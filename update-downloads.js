// update-downloads.js
// Reads the public GitHub Releases download counters of NULL JSFX and Noxpress
// and writes them to downloads.json, which the project cards on index.html read.
// No dependencies; needs Node 18+ (global fetch). Run: node update-downloads.js
//
// What counts as a download (exact asset download_count from GitHub):
// - NULL JSFX: every asset of every normal release (plugins, installers, Hub app,
//   Android remotes), except the NULL-JSFX-Catalog.json file that the Hub app reads
//   by itself, and except the "media" / "media-kit" pre-releases (videos, press kit).
// - Noxpress: every asset of every release (all plugins are beta pre-releases),
//   except the .sha256 checksum files.

const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(__dirname, 'downloads.json');

// Android apps (APPS-DL): the Koulaxizis Apps download counter (a Cloudflare
// Worker of orOS that serves our F-Droid repositories and counts each APK
// download per app and channel; numbers only). Copied into "android" so the
// page still reads only this file.
const COUNTER = 'https://apps.koulaxizis.workers.dev/stats.json';
const OURS = ['gr.koulaxizis.apps', 'online.useoros.', 'tech.nulljsfx.', 'tech.noxpress.', 'net.glarolykoi.'];

function ours(pkg) {
    return OURS.some((p) => p === pkg || (p.endsWith('.') && pkg.startsWith(p)));
}

async function android(previous) {
    const before = (previous && previous.android) || {};
    try {
        const res = await fetch(COUNTER, { headers: { 'User-Agent': 'koulaxizis-gr-download-counter' } });
        if (!res.ok) throw new Error('counter answered ' + res.status);
        const stats = await res.json();
        if (!stats || stats.v !== 1 || !stats.apps) throw new Error('unexpected counter answer');
        let manager = 0, all = 0, via = 0;
        for (const [pkg, row] of Object.entries(stats.apps)) {
            if (!ours(pkg)) continue;
            for (const [ch, v] of Object.entries(row)) {
                const n = typeof v === 'number' ? v : (v && typeof v.n === 'number' ? v.n : 0);
                all += n;
                if (pkg === 'gr.koulaxizis.apps') manager += n;
                if (ch === 'manager') via += n;
            }
        }
        // never lower than before
        return {
            manager: Math.max(manager, before.manager || 0),
            all: Math.max(all, before.all || 0),
            via: Math.max(via, before.via || 0)
        };
    } catch (e) {
        console.log('Android: counter not read (' + e.message + '), keeping the previous numbers');
        return previous && previous.android ? previous.android : null;
    }
}

const PROJECTS = {
    nulljsfx: {
        name: 'NULL JSFX',
        repo: 'koulaxizis/null-jsfx',
        includeRelease: (rel) => !rel.draft && !rel.prerelease,
        includeAsset: (asset) => !asset.name.toLowerCase().endsWith('.json')
    },
    noxpress: {
        name: 'Noxpress',
        repo: 'koulaxizis/noxpress',
        includeRelease: (rel) => !rel.draft,
        includeAsset: (asset) => !asset.name.toLowerCase().endsWith('.sha256')
    }
};

async function fetchAllReleases(repo) {
    const headers = {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'koulaxizis-gr-download-counter'
    };
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = 'Bearer ' + process.env.GITHUB_TOKEN;
    }

    const releases = [];
    for (let page = 1; page <= 50; page++) {
        const url = 'https://api.github.com/repos/' + repo + '/releases?per_page=100&page=' + page;
        const res = await fetch(url, { headers });
        if (!res.ok) {
            throw new Error(repo + ': GitHub API answered ' + res.status + ' on page ' + page);
        }
        const batch = await res.json();
        if (!Array.isArray(batch)) {
            throw new Error(repo + ': unexpected GitHub API answer on page ' + page);
        }
        releases.push(...batch);
        if (batch.length < 100) return releases;
    }
    throw new Error(repo + ': more than 50 pages of releases, refusing to guess');
}

async function countDownloads(project) {
    const releases = await fetchAllReleases(project.repo);
    let downloads = 0;
    let counted = 0;
    for (const rel of releases) {
        if (!project.includeRelease(rel)) continue;
        counted++;
        for (const asset of rel.assets || []) {
            if (project.includeAsset(asset)) downloads += asset.download_count;
        }
    }
    return { downloads, releases: counted };
}

async function main() {
    let previous = null;
    try {
        previous = JSON.parse(fs.readFileSync(OUTPUT, 'utf8'));
    } catch (e) {
        previous = null;
    }

    // Athens date, YYYY-MM-DD
    const updated = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date());

    // The workflow is scheduled several times a day because GitHub often drops
    // scheduled runs; only the first run of each Athens day updates the numbers.
    if (process.env.SKIP_IF_TODAY === '1' && previous && previous.updated === updated) {
        console.log('downloads.json already updated today (' + updated + '), nothing to do');
        return;
    }

    const projects = {};
    for (const [key, project] of Object.entries(PROJECTS)) {
        const result = await countDownloads(project);
        const before = previous && previous.projects && previous.projects[key]
            ? previous.projects[key].downloads
            : 0;
        // GitHub counters never go down unless a release is deleted; keep the
        // highest known value so a deleted release does not shrink the number.
        projects[key] = {
            name: project.name,
            repo: project.repo,
            downloads: Math.max(result.downloads, before),
            releases: result.releases
        };
        console.log(project.name + ': ' + result.downloads + ' downloads in ' + result.releases + ' releases');
    }

    const data = {
        updated,
        source: 'GitHub Releases (asset download_count)',
        projects
    };
    const droid = await android(previous);
    if (droid) {
        data.android = droid;
        console.log('Android: ' + JSON.stringify(droid));
    }

    fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2) + '\n');
    console.log('downloads.json written for ' + updated);
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});

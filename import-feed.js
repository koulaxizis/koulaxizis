// === import-feed.js ===
// Φέρνει αναρτήσεις από εξωτερικό RSS/Atom feed (π.χ. Ko-fi) μέσα στο updates.json.
// Τρέχει μόνο όταν το sources.json έχει "mode": "feed". Χωρίς εξαρτήσεις (Node 18+).

const fs = require('fs');
const path = require('path');

const sourcesPath = path.join(__dirname, 'sources.json');
const updatesPath = path.join(__dirname, 'updates.json');
const statePath = path.join(__dirname, '.github', 'feed-state.json');

const MONTHS = ['Ιανουαρίου','Φεβρουαρίου','Μαρτίου','Απριλίου','Μαΐου','Ιουνίου','Ιουλίου','Αυγούστου','Σεπτεμβρίου','Οκτωβρίου','Νοεμβρίου','Δεκεμβρίου'];

function readJson(file, fallback) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
        if (fallback !== undefined && err.code === 'ENOENT') return fallback;
        throw err;
    }
}

// --- ΑΠΛΟΣ PARSER RSS 2.0 / ATOM ---
function getTag(block, names) {
    for (const name of names) {
        const re = new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>', 'i');
        const m = block.match(re);
        if (m) return unwrapCdata(m[1]).trim();
    }
    return '';
}

function unwrapCdata(str) {
    return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
}

function getAtomLink(block) {
    const links = block.match(/<link\b[^>]*>/gi) || [];
    let fallback = '';
    for (const tag of links) {
        const href = (tag.match(/href\s*=\s*["']([^"']+)["']/i) || [])[1];
        if (!href) continue;
        const rel = (tag.match(/rel\s*=\s*["']([^"']+)["']/i) || [])[1];
        if (!rel || rel === 'alternate') return decodeEntities(href);
        if (!fallback) fallback = decodeEntities(href);
    }
    return fallback;
}

function decodeEntities(str) {
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', laquo: '«', raquo: '»', hellip: '…', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };
    return str.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code) => {
        if (code[0] === '#') {
            const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
            return Number.isFinite(n) ? String.fromCodePoint(n) : m;
        }
        return named[code.toLowerCase()] !== undefined ? named[code.toLowerCase()] : m;
    });
}

// Το περιεχόμενο των feeds είναι συνήθως HTML (συχνά escaped). Το site δείχνει απλό κείμενο.
function toPlainText(str) {
    let text = decodeEntities(unwrapCdata(str));
    text = text.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<br\s*\/?>|<\/p>|<\/div>|<\/li>/gi, ' ')
        .replace(/<\/?[a-z][^>]*>/gi, ' ');
    return decodeEntities(text).replace(/\s+/g, ' ').trim();
}

function parseFeed(xml) {
    const isAtom = /<feed[\s>]/i.test(xml) && !/<rss[\s>]/i.test(xml);
    const blocks = xml.match(isAtom ? /<entry[\s>][\s\S]*?<\/entry>/gi : /<item[\s>][\s\S]*?<\/item>/gi) || [];
    return blocks.map(block => {
        const link = isAtom ? getAtomLink(block) : decodeEntities(getTag(block, ['link']));
        const id = getTag(block, isAtom ? ['id'] : ['guid']) || link;
        return {
            id: decodeEntities(id),
            link: link,
            title: toPlainText(getTag(block, ['title'])),
            summary: toPlainText(getTag(block, isAtom ? ['summary', 'content'] : ['description', 'content:encoded'])),
            date: getTag(block, isAtom ? ['published', 'updated'] : ['pubDate', 'dc:date', 'published'])
        };
    }).filter(item => item.id && item.date && !isNaN(new Date(item.date)));
}

// --- ΜΕΤΑΤΡΟΠΗ ΣΕ ΕΓΓΡΑΦΗ updates.json ---
// Οι ημερομηνίες στο updates.json είναι τοπική ώρα Ελλάδας χωρίς ζώνη (όπως τις γράφει το admin).
function athensParts(date) {
    const parts = {};
    new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(date).forEach(p => { parts[p.type] = p.value; });
    return parts;
}

function truncate(text, max) {
    if (text.length <= max) return text;
    return text.slice(0, Math.max(0, max - 1)).replace(/\s+\S*$/, '') + '…';
}

function toUpdate(item, feed) {
    const p = athensParts(new Date(item.date));
    const maxLength = Number(feed.maxLength) || 280;
    const link = /^https?:\/\//i.test(item.link) ? item.link : '';

    let text = item.title;
    if (item.summary && item.summary !== item.title && !item.summary.startsWith(item.title)) {
        text = text ? text + ': ' + item.summary : item.summary;
    } else if (!text) {
        text = item.summary;
    }
    const room = maxLength - (link ? link.length + 1 : 0);
    const content = (truncate(text, Math.max(room, 40)) + (link ? ' ' + link : '')).trim();

    return {
        date: `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:00`,
        displayDate: `${p.day} ${MONTHS[parseInt(p.month, 10) - 1]} ${p.year}, ${p.hour}:${p.minute}`,
        content: content,
        tags: Array.isArray(feed.tags) && feed.tags.length ? feed.tags.slice(0, 5) : ['🔗'],
        source: 'feed',
        sourceId: item.id
    };
}

async function main() {
    const sources = readJson(sourcesPath, { mode: 'manual' });
    if (sources.mode !== 'feed') {
        console.log('ℹ️ mode = "' + sources.mode + '": δεν γίνεται εισαγωγή από feed.');
        return;
    }
    const feed = sources.feed || {};
    if (!/^https:\/\//i.test(feed.url || '')) {
        console.error('❌ Το sources.json δεν έχει έγκυρο https feed.url.');
        process.exit(1);
    }

    const res = await fetch(feed.url, { headers: { 'User-Agent': 'koulaxizis.gr feed importer', 'Accept': 'application/atom+xml, application/rss+xml, application/xml, text/xml' } });
    if (!res.ok) {
        console.error('❌ Αποτυχία λήψης feed: HTTP ' + res.status);
        process.exit(1);
    }
    const items = parseFeed(await res.text());
    console.log('📥 Βρέθηκαν ' + items.length + ' αναρτήσεις στο feed.');

    const data = readJson(updatesPath);
    if (!Array.isArray(data.updates)) data.updates = [];
    const state = readJson(statePath, { seen: [] });
    const seen = new Set(state.seen || []);
    data.updates.forEach(u => { if (u.sourceId) seen.add(u.sourceId); });

    // Ό,τι έχει εισαχθεί μία φορά δεν ξαναμπαίνει, ακόμη κι αν σβηστεί με το χέρι από το updates.json.
    const fresh = items.filter(item => !seen.has(item.id));
    fresh.forEach(item => {
        data.updates.push(toUpdate(item, feed));
        seen.add(item.id);
    });

    if (fresh.length) {
        data.updates.sort((a, b) => new Date(b.date) - new Date(a.date));
        fs.writeFileSync(updatesPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    }
    fs.writeFileSync(statePath, JSON.stringify({ seen: Array.from(seen) }, null, 2) + '\n', 'utf8');
    console.log('✅ Νέες ενημερώσεις από το feed: ' + fresh.length);
}

if (require.main === module) {
    main().catch(err => {
        console.error('❌ ' + err.message);
        process.exit(1);
    });
}

module.exports = { parseFeed, toUpdate };

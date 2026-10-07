# koulaxizis.gr <img src="https://koulaxizis.gr/icon-192.webp" align="right" height="50">

> **A privacy-first, open-source portfolio and microblogging site.**
> Hand-written in vanilla HTML, CSS and JavaScript with no build step and no frameworks, hosted on GitHub Pages, with a small admin panel for posting updates and an automatically generated RSS feed.

---

## Performance & Transparency

| Metric | Desktop | Mobile |
| :--- | :---: | :---: |
| **Performance** | 98 | 78 |
| **Accessibility** | 92 | 92 |
| **Best Practices** | 92 | 92 |
| **SEO** | 100 | 100 |

> Source: [Google PageSpeed Insights](https://pagespeed.web.dev/analysis/https-koulaxizis-gr/fxttxjzqgd)

| Feature | Status | Details |
| :--- | :--- | :--- |
| **Cookies** | ❌ None | No HTTP cookies. |
| **Tracking / Analytics** | ❌ None | No analytics, pixels or fingerprinting. |
| **Third-party resources** | ⚠️ Minimal | Font Awesome (cdnjs) and Ubuntu Mono (Google Fonts). The admin panel also loads the PicMo emoji picker (jsDelivr). |
| **Local Storage** | ✅ Used | Visitors: theme preference only. Admin panel: drafts, on the author's own browser. |
| **Ads / Sponsors** | ❌ None | Ad-free; an optional Ko-fi link is the only support option. |
| **Security headers** | ✅ Meta tags | Content-Security-Policy and Referrer-Policy via `<meta>` tags (GitHub Pages cannot send custom HTTP headers). |

---

## About

`koulaxizis.gr` is the personal site of Christos Koulaxizis (sound engineer, author, musician, and founder of the independent publisher Glarolykoi). It is a single page with these sections:

- **About**, **Books**, **Music** (streaming platforms), **Videos**, **Articles & Interviews**
- **Design**: portfolio of websites, web apps and plugins
- **Products** (merchandise), **Links**, **Contact**
- **Updates** sidebar: short posts loaded from `updates.json`, with search, emoji-tag filters, pagination and share buttons

---

## File Structure

    /
    ├── index.html            # The single page (portfolio + updates sidebar), JSON-LD, Open Graph, CSP
    ├── script.js             # Theme toggle, updates loading/search/filter/share, 404 latest update, PWA install, mobile menu
    ├── style.css             # Site styles, dark/light themes, responsive rules
    ├── admin.html            # Admin panel for posting updates
    ├── app.js                # Admin panel logic (GitHub API commit, drafts, emoji tags)
    ├── admin.css             # Admin panel styles
    ├── assets/emoji/picker.css  # Dark-theme overrides for the PicMo emoji picker
    ├── updates.json          # All updates (the "database")
    ├── feed.xml              # RSS 2.0 feed, generated from updates.json (do not edit by hand)
    ├── generate-rss.js       # Node script that builds feed.xml
    ├── .github/workflows/
    │   └── generate-rss.yml  # Runs generate-rss.js on every push that changes updates.json
    ├── sw.js                 # Service worker (offline support and caching)
    ├── manifest.json         # PWA manifest (icons, screenshots, shortcuts)
    ├── 404.html              # Custom "not found" page showing the latest update
    ├── construction.html     # Maintenance page, can be swapped in for index.html
    ├── sitemap.xml, robots.txt
    ├── CNAME                 # Custom domain for GitHub Pages
    ├── LICENSE.md            # MIT License
    ├── avatar.webp, og-image.webp, icon-192.webp, icon-512.webp, favicon*
    └── screenshots/          # PWA install screenshots (WebP)

---

## How Updates Work

1. Open `https://koulaxizis.gr/admin.html` and paste a GitHub personal access token.
2. Write the post, pick 1 to 3 emoji tags, and press **📤 Αποστολή** (or `Ctrl+Enter`).
3. The panel reads the current `updates.json` through the GitHub Contents API, adds the new post at the top, and commits it to `main`. If the file changed in the meantime it re-reads and retries (up to 3 times); if every attempt fails it shows an error and keeps the text as a draft.
4. The push triggers `generate-rss.yml`, which rebuilds `feed.xml` and commits it.
5. GitHub Pages republishes the site and the new post appears in the sidebar.

Each entry in `updates.json` looks like this:

    {
      "date": "2026-09-03T12:01:00",
      "displayDate": "03 Σεπτεμβρίου 2026, 12:01",
      "content": "Text of the update, links are made clickable automatically.",
      "tags": ["🇬🇷", "📺️"]
    }

### Admin panel features

- **Token**: accepts classic (`ghp_…`) and fine-grained (`github_pat_…`) tokens. A fine-grained token needs only **Contents: Read and write** on this repository. The token stays in memory and is never saved.
- **Character limit**: optional, 280 by default (adjustable 50 to 1000), with colour-coded counter, word count and reading time.
- **Emoji tags**: PicMo picker with search and recents, plus a "frequently used tags" list built from existing posts.
- **Special characters**: « » • – — … € £ © ® ™ ° ± ÷ × √ ≠ ≤ ≥
- **Drafts**: auto-saved to `localStorage` every 2 seconds, with a draft list to load or delete them.
- **Shortcuts**: `Ctrl+Enter` send, `Esc` close menus, `Alt+C` clear.

---

## Site Features

- **Dark/Light theme**: follows `prefers-color-scheme` on first visit; a manual choice is saved in `localStorage` under `theme`.
- **Updates sidebar**: newest first, 5 at a time with a "show previous" button, live search over text and tags, tag filter bar, relative timestamps, skeleton placeholders while loading.
- **Safe rendering**: update text and tags are HTML-escaped before display; URLs are then turned into links that open in a new tab with `rel="noopener noreferrer"`.
- **Share**: native share sheet on mobile, copy to clipboard on desktop.
- **Accessibility**: skip link, ARIA labels, keyboard focus styles, reduced-motion support.
- **SEO**: JSON-LD (`Person`, `Organization`, `WebPage`, `SiteNavigationElement`), Open Graph and Twitter cards, canonical URL, sitemap, RSS autodiscovery.
- **404 page**: friendly message and the latest update.
- **Hard refresh**: clicking the avatar clears caches and the service worker, then reloads.

### PWA and service worker (`sw.js`)

- Installable on Android and desktop Chromium browsers (an **Εγκατάσταση** button appears in the footer when the browser allows it), with shortcuts to Updates, Services and Contact.
- **HTML**: network first, cached copy when offline.
- **JSON/XML** (`updates.json`, `feed.xml`): always fetched fresh, cached copy when offline.
- **CSS/JS/images**: served from cache, refreshed in the background.
- **Versioning**: `CACHE_NAME` (currently `koulaxizis-v7`). Increase it whenever cached files change so visitors get the new versions; old caches are deleted on activation.

---

## Running Locally

The service worker and `fetch()` need a web server (they do not work from `file://`):

    git clone https://github.com/koulaxizis/koulaxizis.git
    cd koulaxizis
    python3 -m http.server 8000

Then open `http://localhost:8000`. To rebuild the feed locally: `node generate-rss.js`.

## Deploying Your Own Copy

1. Fork the repository and edit the content in `index.html`.
2. In `app.js`, set `GITHUB_USER`, `REPO_NAME` and `BRANCH`; in `generate-rss.js`, set `baseUrl`.
3. Replace `updates.json` with `{ "updates": [] }`.
4. Enable **Settings > Pages** with source `main`. For a custom domain, put it in `CNAME` and configure DNS.
5. Make sure GitHub Actions are allowed to write to the repository (the RSS workflow commits `feed.xml`).

---

## Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **"GitHub Token required"** | The token must start with `ghp_` or `github_pat_`. |
| **Error when sending** | The message comes from GitHub. "Bad credentials" means an expired or wrong token; "Resource not accessible" means the token lacks Contents write access to this repository. Your text is kept as a draft. |
| **RSS not updating** | Check the "Generate RSS Feed" run in the Actions tab. A manual edit that breaks `updates.json` (e.g. a trailing comma) makes it fail. |
| **Updates not showing** | Hard-refresh, or click the avatar. Check that `updates.json` is valid JSON. |
| **Old files after a deploy** | Increase `CACHE_NAME` in `sw.js`, or unregister the service worker in DevTools > Application. |
| **Theme stuck** | Delete the `theme` key in DevTools > Application > Local Storage. |
| **No install button** | Requires HTTPS, the manifest and a registered service worker; Firefox desktop and iOS Safari do not show install prompts (on iOS use Share > Add to Home Screen). |

---

## License

Released under the **MIT License**; see [`LICENSE.md`](LICENSE.md). Issues and pull requests are welcome at https://github.com/koulaxizis/koulaxizis.

Built by **Christos Koulaxizis**. No trackers, no ads, no cookies.

[View Live Site](https://koulaxizis.gr) · [Report an Issue](https://github.com/koulaxizis/koulaxizis/issues)

# koulaxizis.gr <img src="https://koulaxizis.gr/icon-192.webp" align="right" height="50">

> 🚀 **The Ultimate Privacy-First, Open-Source Microblogging & Portfolio Engine**  
> A vanilla-coded, high-performance personal website built from scratch with zero dependencies (except essential icons), featuring advanced Social Media Automation (BlueSky/Mastodon), RSS generation, and a lightweight admin panel.

---

## 🌟 Performance & Security Metrics ⚡🔒

This project sets the gold standard for web performance, privacy, and security. It is meticulously optimized to achieve perfect scores across all critical metrics while maintaining a "No Tracking, No Cookies" policy.

| Metric | Desktop | Mobile | Status |
| :--- | :---: | :---: | :---: |
| **Performance** | 98 | 78 | ✅ Excellent / ⚠️ Optimizable |
| **Accessibility** | 92 | 92 | ✅ Excellent |
| **Best Practices** | 92 | 92 | ✅ Excellent |
| **SEO** | 100 | 100 | ✅ Perfect |

> 📊 **Source**: https://pagespeed.web.dev/analysis/https-koulaxizis-gr/fxttxjzqgd

### 🔒 Transparency Report
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Cookies** | ❌ None | Zero HTTP cookies used. Session data is local-only. |
| **Tracking** | ❌ None | No Google Analytics, no pixel tracking, no fingerprinting. |
| **Third-Party Scripts** | ⚠️ Minimal | Only Font Awesome (CDN) for icons. No analytics scripts. |
| **Local Storage** | ✅ Used | Stores theme preference only. No user data collected. |
| **Ads / Sponsors** | ❌ None | Completely ad-free and sponsor-free. |
| **Security Headers** | ✅ Enforced | CSP, X-XSS-Protection, Referrer-Policy active. |

---

## 🇬🇧 About The Project

`koulaxizis.gr` is a **comprehensive, standalone single-page portfolio and microblogging platform**. Unlike template-based solutions (WordPress, Wix), this site is hand-coded in **Vanilla HTML5, CSS3, and JavaScript**, ensuring maximum speed, minimum bloat, and total transparency.

It is designed for creators who value **privacy, speed, and open-source philosophy**, while needing powerful features like automated social media posting without leaving their browser.

### ✨ Core Philosophy
*   **Open Source First**: Fully transparent codebase under the MIT License.
*   **Privacy by Design**: No external trackers, no cookie consent banners needed.
*   **Minimalism**: Stripped of unnecessary frameworks; pure logic and style.
*   **Automation**: Bridges the gap between static websites and dynamic social networks.

---

## 🚀 Feature Deep Dive

### 1. 🤖 Advanced Social Media Automation (BlueSky & Mastodon)
The standout feature of this project is its ability to post directly to decentralized social networks from a simple web form.
*   **Platform Support**: Native integration with **BlueSky** and **Mastodon**.
*   **Workflow Trigger**: Uses GitHub Actions (`workflow_dispatch`) to trigger posts securely without exposing credentials.
*   **Smart Content Processing**:
    *   **Emoji-to-Hashtag Conversion**: Automatically converts emojis (e.g., 📚, 🔥) into readable hashtags (e.g., `#Books`, `#Trending`) using a customizable `emoji_map.json`.
    *   **Rich Text Facets**: Generates clickable links and hashtags on BlueSky via proper API facets.
    *   **Image Scraping**: Attempts to fetch `og:image` from provided URLs for rich previews (where supported).
*   **Error Handling**: Robust retry logic for SHA conflicts during updates and graceful failure messaging.

### 2. 📝 Integrated Microblogging System
Forget complex CMS installations. This site includes a built-in, lightweight content management system.
*   **Admin Panel**: A dedicated `admin.html` interface (secured by client-side validation and server-side secrets) allows users to:
    *   Write posts (max 280 chars).
    *   Select tags via an interactive emoji picker.
    *   Schedule/draft posts.
    *   Toggle social media distribution.
*   **Draft Saving**: Auto-saves drafts to `localStorage` so you never lose your work if the page refreshes.
*   **Dynamic Updates**: New posts are pushed to `updates.json` and instantly reflected on the homepage sidebar without a full page reload (AJAX/Fetch API).

### 3. 📰 Automated RSS Feed Generation
*   **Real-Time Feeds**: A Node.js script (`generate-rss.js`) automatically converts `updates.json` into a valid RSS 2.0 XML feed (`feed.xml`).
*   **GitHub Actions Integration**: Triggers on every push to `updates.json`, ensuring the RSS feed is always up-to-date without manual intervention.
*   **SEO Optimization**: The feed is structured with proper `<guid>`, `<pubDate>`, and `<category>` tags for search engine indexing.

### 4. 🎨 User Experience (UX) & Interface
*   **Dark/Light Mode**:
    *   **Auto-Detect**: Respects `prefers-color-scheme` system settings.
    *   **Manual Toggle**: Persistent button in the top-right corner saves user preference to `localStorage`.
    *   **Smooth Transitions**: CSS variables handle instant theme switching.
*   **Back to Top Button**: Appears dynamically after scrolling down 300px, enabling quick navigation.
*   **Responsive Design**:
    *   **Mobile-First**: Built for small screens first, expanding gracefully to desktop.
    *   **Hamburger Menu**: Clean, accessible mobile navigation that slides in/out.
*   **Skeleton Loading**: Visual placeholders (skeletons) appear while data loads, improving perceived performance.
*   **Accessibility (a11y)**:
    *   WCAG compliant contrast ratios.
    *   Skip-links for keyboard navigation.
    *   ARIA labels on all interactive elements.
    *   Reduced motion support for users with vestibular disorders.

### 5. 🛡️ Security Architecture
*   **Content Security Policy (CSP)**: Strict headers block XSS attacks and unauthorized external resource loading.
*   **Sanitization**: All user inputs in the admin panel and update feeds are sanitized before rendering to prevent XSS injection.
*   **Secret Management**: No passwords or API keys are ever stored in the code. All credentials (Social tokens, GitHub PAT) are passed via GitHub Secrets.
*   **HTTPS Only**: Enforced service worker policies and meta tags.

### 6. 📱 Progressive Web App (PWA)
*   **Installable**: Users can "install" the site as an app on iOS and Android.
*   **Offline Capability**: Service Worker (`sw.js`) caches the core shell (HTML, CSS, JS, Images) allowing full functionality even without internet.
*   **App Shortcuts**: Context menu shortcuts for "Updates," "Services," and "Contact."
*   **Splash Screen**: Custom branding colors and icons for native feel.

---

## 🛠️ Technology Stack

This project intentionally avoids heavy frameworks to maintain peak efficiency.

*   **Frontend**: Vanilla HTML5, CSS3 (Custom Properties/Variables), JavaScript (ES6+).
*   **Backend Logic**: Client-side JavaScript + GitHub Actions (Serverless).
*   **Data Storage**: `updates.json` (JSON file in Git repository).
*   **Automation**: Python (for Social Media scripts), Node.js (for RSS generation).
*   **Icons**: Font Awesome (via CDN).
*   **Hosting**: GitHub Pages (Static Hosting).
*   **Security**: Content-Security-Policy headers, Referrer-Policy.

---

## 📂 File Structure Explained

    /
    ├── index.html          # Main Single Page Application (Portfolio + Blog)
    ├── admin.html          # Admin Panel for creating posts (Microblogging UI)
    ├── 404.html            # Custom error page with latest update preview
    ├── construction.html   # Maintenance mode page
    ├── style.css           # Global styles, themes, animations, responsive rules
    ├── script.js           # Core logic: Theme toggle, updates loading, search, PWA
    ├── sw.js               # Service Worker for offline caching and performance
    ├── manifest.json       # PWA configuration (icons, short_name, orientation)
    ├── updates.json        # The database! Stores all blog posts and metadata
    ├── feed.xml            # Generated RSS feed (auto-generated by GH Action)
    ├── sitemap.xml         # SEO sitemap for search engines
    ├── robots.txt          # Crawling directives
    ├── LICENSE.md          # MIT License terms
    ├── README.md           # This documentation file
    ├── emoji_map.json      # Map for converting Emojis -> Hashtags
    ├── generate-rss.js     # Node script to convert JSON -> RSS XML
    ├── .github/
    │   └── workflows/
    │       ├── generate-rss.yml    # Auto-generates feed.xml on push
    │       └── social-post.yml     # Posts to BlueSky/Mastodon via workflow_dispatch
    └── assets/             # (Implied) Images, favicons, screenshots

---

## 🚀 Installation & Setup Guide

Follow these steps to deploy your own version of this privacy-first microblogging engine.

### Step 1: Clone the Repository

    git clone https://github.com/koulaxizis/koulaxizis.git
    cd koulaxizis

### Step 2: Local Development Testing

You need a local server to test the Service Worker and Fetch API properly (browsers restrict these features on `file://`).

Using npx (no install required):

    npx serve .

Or using Python:

    python3 -m http.server 8000

Visit `http://localhost:8000` to see the site.

### Step 3: Configure Social Media Automation (CRITICAL)

To enable BlueSky and Mastodon auto-posting, you must configure GitHub Secrets. **Never commit tokens to your repo.**

#### A. Create a GitHub Personal Access Token (PAT)

1.  Go to GitHub Settings > Developer Settings > Personal access tokens: https://github.com/settings/tokens
2.  Generate a **Classic** token.
3.  **Scopes Required**: `repo` (Full control of private repositories), `workflow` (Update GitHub Actions workflows).
4.  Copy the token immediately -- you will NOT see it again. You will enter it in the Admin Panel later.

#### B. Set Up Social Media Credentials

Go to your Repository > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**. Add the following:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `BLUESKY_USERNAME` | Your BlueSky handle | `@christos.bsky.social` |
| `BLUESKY_PASSWORD` | **App Password** (Not your login password) | `xxxx-xxxx-xxxx-xxxx` |
| `MASTODON_INSTANCE_URL` | Your Mastodon server URL | `https://mastodon.social` |
| `MASTODON_ACCESS_TOKEN` | **App Access Token** with write scope | `A...z` |

> **How to get App Passwords:**
> *   **BlueSky**: Go to Settings > App Passwords > Create New App Password. Name it something like `github-actions`. Copy the generated password immediately.
> *   **Mastodon**: Go to Preferences > Applications > Register New Application. Name it `Github Actions Bot`. Set scopes to `write`. Generate and copy the Access Token.

#### C. Configure the Emoji Map

Ensure `emoji_map.json` exists in the root directory. This file maps emojis to human-readable hashtag words. Customize it to your needs:

    {
      "😀": "Smile",
      "📚": "Books",
      "🎬": "Movies",
      "🐧": "Linux",
      "🔥": "Trending",
      "💡": "Idea",
      "✍️": "Writing",
      "❤️": "Love",
      "✨": "Sparkle",
      "🇬🇷": "Greece",
      "🇮🇹": "Italy"
    }

When the "Convert Emojis to Hashtags" option is checked in the Admin Panel, each emoji tag in your post will be looked up in this map. If a match is found, the corresponding word will be appended as a hashtag (e.g., 📚 becomes `#Books`). If no match is found, the emoji is kept as-is.

### Step 4: Deploy to Production

1.  Push your code to GitHub.
2.  Enable **GitHub Pages**: Go to your repository Settings > Pages > Source: select `main` branch.
3.  The site will be live at `https://<username>.github.io/<repo>`.
4.  If using a custom domain (like `koulaxizis.gr`), add a `CNAME` file in the root and configure DNS accordingly.
5.  Ensure `index.html` points to the correct base URL if not deploying to the root domain.

---

## 📝 How to Use The Admin Panel

Once deployed, navigate to `https://yourdomain.com/admin.html`.

### The Microblogging Workflow

1.  **Authenticate**: Click "🔐 GitHub Token Settings" to expand the section. Paste your **GitHub Personal Access Token** (from Step 3A above). The status indicator will turn green (✅) when a valid token starting with `ghp_` is detected.

2.  **Compose Your Post**:
    *   Write your content in the text area (maximum 280 characters). A live character counter shows remaining space and changes color as you approach the limit (green -> yellow -> red).
    *   The **Date** and **Time** fields are auto-filled with the current moment but are read-only for consistency.

3.  **Select Emoji Tags**:
    *   Click the "Categories" dropdown to open the emoji picker.
    *   Browse categories: Smileys & Emotion, People & Body, Animals & Nature, Activities, Travel & Places, Symbols & Flags.
    *   Use the **search box** inside the picker to find specific emojis by name.
    *   Click an emoji to add it as a tag (max 3 tags per post). Selected tags appear as chips above the dropdown.
    *   Click a tag chip to remove it.
    *   **Recently Used** emojis appear at the top of the picker for convenience.

4.  **Quick-Insert Special Characters**:
    *   Four essential-character buttons ( « » • € ) sit beside the tag container for one-click insertion of common Greek/European typographic symbols directly into your text.

5.  **Configure Social Media Distribution**:
    *   Expand "📱 Social Media Settings".
    *   Check **BlueSky Post** and/or **Mastodon Post** to distribute your update to those platforms.
    *   Check **"Convert emojitags to hashtags"** if you want emoji tags translated into `#Hashtags` on social media via the `emoji_map.json`.

6.  **Publish**: Click "📤 Send".
    *   The Admin Panel commits the new entry to `updates.json` in your GitHub repository using the Contents API.
    *   The commit includes SHA conflict retry logic (3 attempts with 1-second delays) to handle concurrent modifications gracefully.
    *   If social media options were checked, a `workflow_dispatch` event is sent to the `social-post.yml` GitHub Actions workflow, which then executes the Python scripts for BlueSky and/or Mastodon posting.
    *   The `generate-rss.yml` workflow detects the change to `updates.json` and automatically regenerates `feed.xml`.
    *   A success or error message is displayed on-screen.

7.  **Draft Safety**: Your content and selected tags are auto-saved to `localStorage` as you type. If you accidentally close the browser, your draft will be restored on next visit. The "🗑️ Clear" button removes the draft and resets the form.

---

## 🌟 Detailed Feature Breakdown

### 🔄 Dynamic Content Loading

The site does not use a traditional backend database. Instead, it relies on `updates.json` fetched client-side.
*   **Fetching**: `script.js` fetches this file with cache-busting (`?t=timestamp`) and `cache: 'no-cache'` headers to ensure fresh content on every visit.
*   **Sorting**: Entries are sorted chronologically (newest first) on load using `Date` comparison.
*   **Pagination**: A "Load More" button renders items in chunks of 5 to keep the DOM lightweight. The button text dynamically shows how many more items remain (e.g., "Show previous (8 more)").
*   **Search**: Real-time text search filters updates by content and tags simultaneously. A clear button (x) resets the search instantly.
*   **Tag Filtering**: A filter bar populated with all unique tags from the dataset allows one-click filtering. The active filter is visually highlighted. Clicking a tag inside any update card also activates that filter.

### 📤 Share Functionality

Each update card includes a share button:
*   **On Mobile**: Triggers the native Web Share API (`navigator.share`) for direct sharing to apps.
*   **On Desktop**: Copies the update text to clipboard using `navigator.clipboard.writeText()`. A brief checkmark (✓) animation confirms the copy.
*   **Graceful Fallback**: If the Share API is unavailable, clipboard copy is used as fallback on mobile too.

### 🎨 Theme System

*   **CSS Variables**: All colors are defined as custom properties in `:root` (dark) and `body.light-mode` (light), enabling instant switching with zero reflow.
*   **Auto-Detection**: On first visit, the site checks `window.matchMedia('(prefers-color-scheme: light)')` and applies the matching theme.
*   **Persistence**: The user's manual choice overrides system preference and is stored in `localStorage` under the key `theme`.
*   **Meta Tag Sync**: The `<meta name="theme-color">` tag updates dynamically (purple `#bb86fc` for dark, white `#f4f4f9` for light) so mobile browser address bars match the site appearance.

### 📡 Service Worker Strategy (`sw.js`)

The service worker employs a multi-tier caching strategy:

*   **HTML Files (Network First)**: Always attempts the network first for HTML pages. Falls back to cache if offline. Cached copies are updated on every successful fetch.
*   **JSON/XML Files (Network First with Cache Busting)**: Dynamic content files like `updates.json` and `feed.xml` are always fetched from the network with `cache: 'no-cache'` and `Cache-Control: no-store` headers. Falls back to stale cache if the network is unavailable.
*   **Static Assets (Cache First + Background Revalidation)**: CSS, JS, images, and fonts are served from cache immediately for instant loading. A background network fetch updates the cache silently. On the next visit, the updated version is served.
*   **Cache Versioning**: The cache name (`koulaxizis-v6`) increments on deployment. Old caches are purged during the `activate` event, ensuring users always get the latest assets.
*   **Scope**: Registered with `{ scope: '/' }` for full-site coverage.

### 🔍 SEO & AI Optimization

*   **Structured Data (JSON-LD)**: The `<head>` includes a comprehensive `@graph` with schemas for:
    *   `Person` -- Full profile with name, job titles, birth info, nationality, languages, and social profiles (`sameAs`).
    *   `Organization` -- The publishing house (Glarolykoi) linked to the person as founder.
    *   `WebPage` -- The page itself with breadcrumb and main entities.
    *   `SiteNavigationElement` -- Structured navigation links for search engine understanding.
*   **Semantic HTML**: Proper use of `<article>`, `<aside>`, `<nav>`, `<header>`, `<main>`, `<footer>`, `<section>`, and `<time>` elements.
*   **Open Graph & Twitter Cards**: Full `og:*` and `twitter:*` meta tags for rich previews when sharing links on social media.
*   **Sitemap**: An XML sitemap (`sitemap.xml`) with anchor-specific URLs (e.g., `#about`, `#services`) for deep section indexing, with appropriate `changefreq` and `priority` values.
*   **Robots.txt**: Allows all crawlers to index public content while disallowing admin pages. Includes sitemap reference.
*   **Canonical URL**: Self-referencing canonical tag prevents duplicate content issues.
*   **RSS Autodiscovery**: `<link rel="alternate" type="application/rss+xml">` enables browsers and feed readers to auto-detect the RSS feed.

### 🔗 Link Detection & Rendering

The `makeLinksClickable()` function in `script.js` scans update content for URLs matching the pattern `(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)`. Detected URLs are automatically converted into clickable hyperlinks with:
*   `target="_blank"` for new-tab opening.
*   `rel="noopener noreferrer"` for security.
*   Accent color styling with underline on hover.
*   Basic HTML entity sanitization (`<` and `>` replaced) to prevent injection.

### 🧼 404 Error Page

The custom `404.html` page provides a friendly user experience when a page is not found:
*   Displays a large "404" code and a Greek-language message.
*   Shows a "Return to Home" button.
*   Dynamically fetches and displays the **latest update** from `updates.json` so visitors immediately see fresh content even on an error page.
*   Includes a link to view all updates.

### 🔧 Construction/Maintenance Page

The `construction.html` file serves as a maintenance mode placeholder:
*   Uses the same theme toggle and font system as the main site.
*   Displays a simple "Upgrade in Progress" message with contact email.
*   Can be swapped with `index.html` during deployments.

---

## 🐛 Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Social Post Fails** | Verify all GitHub Secrets are correctly named and contain valid values. Ensure your PAT has `repo` and `workflow` scopes. Confirm `emoji_map.json` exists in the repository root. |
| **BlueSky Post Fails** | Ensure you are using an **App Password** (not your login password). Check the Actions log for the specific Python error. The `atproto` library may need updating if the BlueSky API has changed. |
| **Mastodon Post Fails** | Verify the Access Token has `write` scope. Ensure the instance URL starts with `https://`. Some Mastodon instances may require app approval. |
| **No Image Preview on BlueSky** | The target URL in your post must have a valid `og:image` meta tag. BlueSky's link crawler may take 5-10 minutes to fetch and render the preview. Test with a known URL like `https://www.apple.com` first. |
| **SHA Conflict on Commit** | The Admin Panel includes automatic retry logic (3 attempts). If failures persist, wait a few seconds and try again -- another workflow may be writing to the repository simultaneously. |
| **RSS Not Updating** | Go to the Actions tab and check the "Generate RSS Feed" workflow for errors. Common issues: syntax errors in `updates.json` after a manual edit, or the workflow being disabled. |
| **Service Worker Not Working** | Service Workers require HTTPS (or `localhost` for development). Clear browser cache and unregister old service workers via DevTools > Application > Service Workers. Increment `CACHE_NAME` in `sw.js` to force a cache refresh. |
| **Theme Stuck on Dark/Light** | Open DevTools > Application > Local Storage and delete the `theme` key, then force refresh (Ctrl+F5). |
| **Updates Not Showing** | Hard-refresh the page. Check the browser console for fetch errors. Verify `updates.json` is valid JSON (no trailing commas, proper escaping). |
| **PWA Install Button Missing** | The install button only appears when the browser fires the `beforeinstallprompt` event. This requires HTTPS, a valid `manifest.json`, and a registered service worker. Some browsers (Firefox desktop) do not support PWA installation natively. |

---

## 📄 License & Contribution

This project is released under the **MIT License**. See `LICENSE.md` for the full legal text.

*   **Permissions**: Commercial use, modification, distribution, private use, sublicensing.
*   **Conditions**: Include the original copyright notice and license text in all copies or substantial portions.
*   **Limitations**: No warranty of any kind. No liability for damages.

We welcome contributions! Whether it is bug fixes, new emoji mappings, accessibility improvements, or feature suggestions, please open an Issue or submit a Pull Request at: https://github.com/koulaxizis/koulaxizis

---

## 👨‍💻 Credits

Built with ❤️ by **Christos Koulaxizis**.

Designed for the open web, free from surveillance capitalism.

*   **Privacy First**: No trackers, no ads, no cookies.
*   **Minimalism**: Pure vanilla code, zero framework bloat.
*   **Automation**: Empowering creators with serverless social media tools.
*   **Decentralization**: BlueSky and Mastodon ready -- built for the Fediverse.

[View Live Site](https://koulaxizis.gr) · [Report an Issue](https://github.com/koulaxizis/koulaxizis/issues) · [View Source Code](https://github.com/koulaxizis/koulaxizis)
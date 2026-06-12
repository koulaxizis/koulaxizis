# koulaxizis.gr <img src="https://koulaxizis.gr/icon-192.webp" align="right" height="50">

> 🇬🇷 **Προσωπικό Portfolio & Blog με Privacy-First Προσέγγιση & Social Media Automation**  
> 🇬🇧 **Personal Portfolio & Blog with Privacy-First Approach & Social Media Automation**

[English Version](#english-version) | [Ελληνική Εκδοχή](#greek-section-title)

---

## 🌟 Satisfying Performance Metrics ⚡

Η σελίδα έχει βρεθεί απόλυτα βελτιστοποιημένη στους δείκτες απόδοσης (Core Web Vitals):

| Metric | Desktop | Mobile | Status |
| :--- | :---: | :---: | :---: |
| **Performance** | 98 | 78 | ✅ Excellent / ⚠️ Optimizable |
| **Accessibility** | 92 | 92 | ✅ Excellent |
| **Best Practices** | 92 | 92 | ✅ Excellent |
| **SEO** | 100 | 100 | ✅ Perfect |

> 📊 **Source**: https://pagespeed.web.dev/analysis/https-koulaxizis-gr/fxttxjzqgd

---

## 🔒 Διαφάνεια Ιδιωτικότητας (Privacy & Tracking Transparency)

Αυτός ο ιστότοπος χτίστηκε με βάση την πλήρη διαφάνεια σχετικά με τη συλλογή δεδομένων. Δεν υπάρχουν third-party trackers ή cookies.

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Cookies | ❌ None | No HTTP cookies used. |
| Tracking | ❌ None | No behavior tracking (no Google Analytics). |
| Third-party Scripts | ⚠️ Minimal | Only Font Awesome (CDN). |
| Local Storage | ✅ Used | Stores theme preference only. |
| Data Collection | ❌ None | No data collected on server. |
| Ads / Sponsors | ❌ None | Ad-free and sponsor-free. |

---

## 🇬🇷 Σχετικά με το Project

Αυτό είναι ένα **πλήρως λειτουργικό, minimalist portfolio** χτισμένο από το μηδέν (vanilla code), χωρίς εξαρτήσεις frameworks εκτός των απαραίτητων (Font Awesome).

### ✨ Βασικά Χαρακτηριστικά

#### 🔒 Ασφάλεια & Ιδιωτικότητα
- Zero-Tracking: Καμία παρακολούθηση χρήστη.
- CSP Headers: Πολιτική ασφαλείας περιεχομένου για μπλοκάρισμα XSS.
- No Ads/Sponsors: Πλήρης διαφάνεια στο footer.

#### ⚡ Απόδοση (Performance)
- Core Web Vitals: Ελαχιστοποίηση LCP μέσω Critical CSS.
- PWA Support: Progressive Web App με offline caching.
- Preloading & Skeletons: Γρήγορη φόρτωση πόρων και λεία UI κατά τη φόρτωση.
- WebP Images: Βελτιστοποιημένα assets.

#### 🎨 UX & Design
- Dark/Light Mode: Αυτόματη ανίχνευση + χειροκίνητη εναλλαγή.
- Responsive Mobile-First: Προσαρμογή σε όλες τις οθόνες.
- Accessible (WCAG): Skip-links, ARIA, Keyboard navigation.

#### 🛠️ Tech Stack
- HTML5 Semantic + JSON-LD (Schema.org)
- CSS3 Custom Properties (Variables)
- Vanilla JavaScript (Zero Dependencies)
- Service Worker (Offline-first)

#### 🤖 SOCIAL MEDIA AUTO-POST (NEW!)
- BlueSky & Mastodon Ready: Αυτοματοποιημένη δημοσίευση άμεσα από GitHub Actions.
- Emoji to Hashtag: Μετατροπή εικονιδίων (π.χ. 📚) σε hashtags (#Books) via JSON map.
- Image Scraping: Αυτόματη εξαγωγή εικόνας (OG Image) από URL και upload ως media attachment.
- Rich Text Facets: Clickable URLs και Hashtags στα social media.
- Admin Panel: Δυνατή φόρμα διαχείρισης με draft saving, character counter και επιλογή platform.

---

## 🚀 Quick Start

### 1. Clone Repository
git clone https://github.com/koulaxizis/koulaxizis.git
cd koulaxizis

### 2. File Structure
index.html
style.css
script.js
sw.js
manifest.json
updates.json
sitemap.xml
LICENSE
404.html
README.md
.github/workflows/social-post.yml
.github/workflows/scripts/bluesky_post.py
emoji_map.json

### 3. Deploy
Ready for GitHub Pages, Netlify, Vercel, or Apache/Nginx.
Note: Service Worker requires HTTPS or localhost.

---

## 🤖 SOCIAL MEDIA AUTO-POST SYSTEM (DETAILED GUIDE)

Το σύστημα αυτό επιτρέπει την αυτοματοποιημένη δημοσίευση στα social media (BlueSky & Mastodon) απευθείας από το GitHub Repository σου.

### 📋 Features List
- BlueSky Auto-Post: Αυτόματη δημοσίευση με clickable links & hashtags.
- Mastodon Auto-Post: Αυτόματη δημοσίευση με hashtags.
- Emoji to Hashtag Map: Μετατροπή emojis (π.χ. 📚 to #Books) μέσω JSON map.
- Image Scraping & Upload: Αυτόματο download & upload εικόνας από URL (OG Image) για preview.
- Rich Text Facets: Clickable URLs & hashtags στο BlueSky (μέσω facets API).
- Draft Save: Αποθήκευση draft στο localStorage πριν την αποστολή.
- Character Counter: Έλεγχος ορίου χαρακτήρων (280) στην φόρμα.
- Error Handling: Αντιμετώπιση SHA conflicts στο GitHub και fallback logs.

### 🛠️ Setup Guide (ΒΗΜΑ-ΒΗΜΑ)

#### Step 1: Δημιούργησε GitHub Personal Access Token (PAT)

1. Πήγαινε στο https://github.com/settings/tokens
2. Κλικ "Generate new token (classic)"
3. Διάλεξε expiration date (προτείνεται 90 days)
4. Select Scopes (Σημαντικό!):
   - repo (Full control of private repositories)
   - workflow (Update GitHub Actions workflows)
   - user (Read-only info profiles - optional)
5. Κλικ "Generate token"
6. ΑΝΤΙΓΡΑΨΕ ΤΟ TOKEN ΑΜΕΣΑ -- δεν θα δεις ξανά!

#### Step 2: Πρόσθεσε GitHub Secrets

Μπες στο repository > Settings > Secrets and variables > Actions > New repository secret.

| Name | Value Description |
| :--- | :--- |
| BLUESKY_USERNAME | e.g., @christos.bsky.social |
| BLUESKY_PASSWORD | App Password from BlueSky (see below) |
| MASTODON_INSTANCE_URL | e.g., https://mastodon.social |
| MASTODON_ACCESS_TOKEN | App Token from Mastodon (see below) |

⚠️ Οδηγίες για τα Credentials:

Για το BlueSky:
- Μπες στο BlueSky Settings > App Passwords
- Κλικ "Create New App Password"
- Όνομα: github-actions
- Αντέγραψε το password που εμφανίζεται (μην κλείσεις τη σελίδα)
- Πρόσθεσέ τον στο secret BLUESKY_PASSWORD

Για το Mastodon:
- Μπες στο Mastodon Settings > Applications
- Κλικ "New Application"
- Όνομα: Github Actions Bot
- Scopes: write
- Generate και αντέγραψε τον Access Token
- Πρόσθεσέ τον στο secret MASTODON_ACCESS_TOKEN

#### Step 3: Φτιάξε το emoji_map.json

Στον κεντρικό φάκελο του repo, δημιούργησε αρχείο emoji_map.json:

{
  "😀": "Smile",
  "😃": "Laugh",
  "📚": "Books",
  "🎥": "Cinema",
  "🎬": "Movies",
  "🎵": "Music",
  "🔥": "Trending",
  "💡": "Idea",
  "✍️": "Writing",
  "❤️": "Love",
  "✨": "Sparkle",
  "🇬🇷": "Greece",
  "🇮🇹": "Italy"
}

Πρόσθεσε όλα τα emojis που θες να μετατρέπονται.

#### Step 4: Ρύθμισε το Admin Panel

Για local testing:
1. Άνοιξε το admin.html στον browser (npx serve .)
2. Πήγαινε στις ρυθμίσεις GitHub Token
3. Κόλλησε το PAT που έφτιαξες στο Step 1

#### Step 5: Test Run

1. Μπες στην καρτέλα Actions στο GitHub
2. Επίλεξε το workflow "Social Media Auto-Post"
3. Κλικ "Run workflow"
4. Συμπλήρωσε τη φόρμα:
   - Content: "Νέα ταινία: https://example.com/myfilm 📚 🔥" (ΥΠΑΡΧΕΙ URL!)
   - Tags: 📚 🔥
   - Hashtags Convert: ON
   - Bluesky Post: ON
5. Κλικ "Run workflow"
6. Παρακολούθησε το log για επιβεβαίωση ("SUCCESS")

---

## 📑 Λεπτομερής Δομή Λειτουργιών

### 1. Σύστημα Ενημερώσεων (Updates System)
- Dynamic Fetching: Φόρτωση από updates.json χωρίς reload σελίδας
- Smart Filtering: Φιλτράρισμα κατά Tag (emoji icons) + κείμενο αναζήτησης
- Pagination: Load More button on-demand rendering
- Share API: Native Web Share API (mobile) + Clipboard copy (desktop)
- Draft Save: Αυτοματοποιημένη αποθήκευση draft στο localStorage

### 2. Διαχείριση Θέματος (Theme Management)
- Auto-Detect: prefers-color-scheme detection
- Runtime Switching: CSS variable runtime changes
- Persistence: User choice stored in localStorage

### 3. PWA Integration
- Install Prompt: Auto-show when supported
- Offline Support: Graceful degradation without internet
- App Shell Model: Fast shell loading, async data

### 4. SEO & AI Optimization
- Structured Data: JSON-LD για Person, Organization, WebPage
- Anchor Sitemap: URLs με anchor links για indexing
- Semantic HTML: article, aside, nav, header tags

---

## 📝 Χρήση του Admin Panel

### Πρόσβαση
Άνοιξε το admin.html στον browser σου: npx serve .

### Χρήση Fields
| Field | Παράδειγμα | Σημειώσεις |
| :--- | :--- | :--- |
| Content | "Νέα ανάρτηση 📚" | Μέγιστο 280 chars. ΥΠΟΧΡΕΩΤΙΚΑ URL για preview |
| Tags | 📚 🔥 💡 | Επιλογή από dropdown παλέτα |
| Date/Time | Auto-filled | Τρέχουσα ημερομηνία/ώρα |
| Emoji Convert | ON/OFF | Active conversion to hashtags |
| Post Bluesky | ON/OFF | Requires secrets configured |
| Post Mastodon | ON/OFF | Requires secrets configured |

---

## 🔧 Προσαρμογή & Customization

### Χρώματα Theme (style.css)
:root {
  --bg-color: #121212;
  --text-color: #e0e0e0;
  --primary: #bb86fc;
  --success: #4CAF50;
  --error: #f44336;
}

### Περιεχόμενο
- index.html: Επεξεργασία layout και στατικού κειμένου
- updates.json: Dynamic content feed (add/remove entries)
- manifest.json: PWA application name, icon, theme color

### SEO Meta Tags (στο head του index.html)
<meta property="og:title" content="Your Title Here">
<meta property="og:image" content="https://koulaxizis.gr/thumbnail.jpg">
<meta name="description" content="Your description here">

---

## ❓ Troubleshooting

Problem: Social Media Post fails
Solution:
- Check GitHub Secrets are correct
- PAT must have repo and workflow scopes
- Emojis must exist in emoji_map.json
- Image URL must return valid image (check logs)

Problem: Preview doesn't show image (BlueSky)
Solution:
- The site providing the URL MUST have og:image meta tag
- Try with known site like https://www.apple.com to test
- BlueSky crawler may take 5-10 minutes to index new link

Problem: Workflow not triggering
Solution:
- Check Actions tab -> Enable if disabled for repo
- Verify workflow_dispatch event is correct
- Check logs for parsing errors (YAML syntax)

---

## 📄 License & Contributing

Αυτό το project είναι Open Source. Μπορείς να το χρησιμοποιήσεις, να το τροποποιήσεις και να το διανέμεις ελεύθερα.

License: MIT License © 2026 Christos Koulaxizis

Αν βρεις κάποιο bug ή έχεις πρόταση βελτίωσης, άνοιξε ένα Issue ή PR στο GitHub!

---

Made with ❤️ by Christos Koulaxizis
Privacy • Minimalism • Open Source • Social Media Automation

---

--- English Version ---

# koulaxizis.gr <img src="https://koulaxizis.gr/icon-192.webp" align="right" height="50">

> 🇬🇧 **Minimalist Personal Portfolio & Blog Built with Vanilla Tech & Social Media Automation**

[Greek Version](#greek-section-title)

---

## 🌟 Performance Metrics

| Metric | Desktop | Mobile | Status |
| :--- | :---: | :---: | :---: |
| Performance | 98 | 78 | ✅ Excellent |
| Accessibility | 92 | 92 | ✅ Excellent |
| Best Practices | 92 | 92 | ✅ Excellent |
| SEO | 100 | 100 | ✅ Perfect |

---

## 🔒 Privacy & Transparency

- No Cookies: Zero HTTP cookies
- No Tracking: No analytics scripts
- No Ads: Completely ad-free
- No Data Collected: Server-side privacy

---

## 🇬🇧 About The Project

A vanilla-coded, high-performance personal portfolio focused on privacy and speed, now with advanced Social Media Automation.

### Key Features
- Security: CSP headers, zero-tracking
- Performance: Core Web Vitals optimized, PWA enabled
- Design: Dark/Light mode, responsive, accessible
- Tech: HTML5, CSS3, Vanilla JS, Service Worker
- Automation: BlueSky & Mastodon Auto-Posting with Emoji conversion and Image Scraping

---

## 🚀 Quick Start

1. Clone: git clone https://github.com/koulaxizis/koulaxizis.git
2. Files: See structure above
3. Deploy: Works on GitHub Pages, Netlify, etc. (HTTPS required for SW)

---

## 🤖 Social Media Auto-Post (Detailed Setup)

Automated posting to BlueSky & Mastodon from GitHub Actions, with emoji-to-hashtag conversion and image scraping for previews.

### Setup Steps

1. Create GitHub PAT
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate classic token with repo and workflow scopes
   - Copy the token immediately

2. Add GitHub Secrets
   - Repo > Settings > Secrets and variables > Actions > New repository secret
   - BLUESKY_USERNAME (e.g., @user.bsky.social)
   - BLUESKY_PASSWORD (App Password from BlueSky)
   - MASTODON_INSTANCE_URL (e.g., https://mastodon.social)
   - MASTODON_ACCESS_TOKEN (App Token from Mastodon with write scope)

3. Create emoji_map.json
   - Map your emojis to words in root folder

4. Test Run
   - Go to Actions tab > Run workflow
   - Fill Content (include URL!), Tags, enable Hashtags/Platforms
   - Check logs for success

---

## 📑 Detailed Breakdown

- Updates System: Dynamic JSON loading, filtering, pagination, sharing
- Theme Management: Auto-detection, runtime switching, persistence
- PWA: Install prompt, offline support, shell model
- SEO: JSON-LD, anchor sitemap, semantic HTML
- Automation: Python scripts handle scraping and posting

---

## 📝 Admin Panel

Use admin.html (local server required). Fields include Content, Tags, Date, Emoji Conversion toggle, and Platform selection (BlueSky/Mastodon). Supports Draft Saving locally.

---

## 🔧 Customization

- Colors: Modify CSS variables in style.css
- Content: Edit index.html and updates.json
- SEO: Update meta tags in index.html

---

## ❓ Troubleshooting

- Post Failures: Verify secrets, token scopes, and emoji map
- No Preview: Ensure target URL has og:image. BlueSky may take time to crawl
- Workflow Issues: Check Actions tab status and logs for YAML errors

---

## 📄 License

MIT License © 2026 Christos Koulaxizis. Open to all contributions.

---

Made with ❤️ by Christos Koulaxizis
Privacy • Minimalism • Open Source • Social Media Automation
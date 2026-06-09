# koulaxizis.gr <img src="https://koulaxizis.gr/icon-192.webp" align="right" height="50">

> 🇬🇷 **Προσωπικό Portfolio & Blog με Privacy-First Προσέγγιση**  
> 🇬🇧 **Personal Portfolio & Blog with Privacy-First Approach**

[Click here for English version](#english-version)

---

## 🌟 Satisfying Performance Metrics ⚡

Η σελίδα έχει βρεθεί απόλυτα βελτιστοποιημένη και διαφάνεια στους δείκτες απόδοσης (Core Web Vitals):

| Metric | Desktop Score | Mobile Score | Status |
| :--- | :---: | :---: | :---: |
| **Performance** | <span style="color:#33FF57; font-weight:bold;">98</span> | <span style="color:#FFB300; font-weight:bold;">78</span> | ✅ Excellent / ⚠️ Optimizable |
| **Accessibility** | <span style="color:#33FF57; font-weight:bold;">92</span> | <span style="color:#33FF57; font-weight:bold;">92</span> | ✅ Excellent |
| **Best Practices** | <span style="color:#33FF57; font-weight:bold;">92</span> | <span style="color:#33FF57; font-weight:bold;">92</span> | ✅ Excellent |
| **SEO** | <span style="color:#33FF57; font-weight:bold;">100</span> | <span style="color:#33FF57; font-weight:bold;">100</span> | ✅ Perfect |

> 📊 **Source**: [Google PageSpeed Insights Report](https://pagespeed.web.dev/analysis/https-koulaxizis-gr/fxttxjzqgd)  
> *Σημείωση: Η τιμή 78 στο Mobile Performance είναι φυσιολογική λόγω περιορισμών κινητών συσκευών, αλλά όλα τα άλλα μέτρα είναι στην κορυφή.*

---

## 🇬🇷 Σχετικά με το Project

Αυτό το εγχείρημα είναι ένα **πλήρως λειτουργικό, minimalist προσωπικό portfolio** που χτίστηκε από το μηδέν (vanilla code), χωρίς καμία εξάρτηση frameworks ή βιβλιοθηκών τρίτων εκτός των απαραίτητων (Font Awesome). 

Σκοπός του είναι να παρέχει μια γρήγορη, ασφαλή, προσαρμοστική (responsive) και ουσιαστική εμπειρία στον χρήστη, τηρώντας τις αρχές της ανοικτής κουλτούρας και της προστασίας των δεδομένων.

### ✨ Βασικά Χαρακτηριστικά (Features)

#### 🔒 Ασφάλεια & Ιδιωτικότητα (Security & Privacy)
| Feature | Περιγραφή |
| :--- | :--- |
| **Zero-Tracking** | Δεν υπάρχουν Analytics (Google Analytics, etc.). Η σελίδα σεβάζεται απόλυτα την ιδιωτικότητα του επισκέπτη. |
| **CSP Headers** | Υψηλού επιπέδου **Content-Security-Policy** για μπλοκάρισμα XSS και injection attacks. |
| **No Ads / No Sponsors** | Ενδεικτικό "No ads • No Sponsors" στο footer για πλήρη διαφάνεια. |
| **No Google Services** | Μόνο Open Source ή Self-hosted λύσεις (όπου γίνεται). |

#### ⚡ Απόδοση (Performance)
*   **Core Web Vitals Optimized**: Ελαχιστοποίηση LCP μέσω Critical CSS inline (Desktop Perf: 98%).
*   **Service Worker PWA**: Επίσημη υποστήριξη **Progressive Web App** με offline caching strategy.
*   **Preloading**: Προ-φόρτωση κρίσιμων πόρων (fonts, scripts, images).
*   **Skeleton Loading**: Ομαλές animating καταστάσεις φόρτωσης αντί για blank screens.
*   **Optimized Assets**: Χρήση μορφών WebP για εικόνες.

#### 🎨 Σχεδιασμός & UX (Design & UX)
*   **Dark/Light Mode**: Αυτόματη ανίχνευση συστήματος + χειροκίνητη εναλλαγή με persistence (`localStorage`).
*   **Responsive Mobile-First**: Πλήρης υποστήριξη για όλες τις οθόνες.
*   **Accessible (WCAG)**: Skip-link, ARIA labels, Keyboard navigation, Reduced-motion support.
*   **Smart Navigation**: Back-to-top button, Sticky Sidebar, Smooth scroll.

#### 🛠️ Τεχνολογική Στοίβα (Tech Stack)

| Τεχνολογία | Χρήση |
| :--- | :--- |
| **HTML5 Semantic** | Δομημένο περιεχόμενο με Schema.org (JSON-LD) για AI Crawlers & SEO. |
| **CSS3 (Custom Properties)** | Dynamic theming, Grid, Flexbox, Sticky positioning, Scroll-snap. |
| **Vanilla JavaScript** | Zero dependencies logic for updates, search, filters, PWA install. |
| **JSON** | Δυναμική φόρτωση ενημερώσεων (updates.json) και RSS feed. |
| **Service Worker** | Offline-first architecture και cache management. |
| **Lighthouse Verified** | Επαληθευμένα scores από Google PageSpeed Insights. |

---

## 🚀 Γρήγορη Εγκατάσταση (Quick Start)

Αν θέλεις να χρησιμοποιήσεις τον κώδικα για τον εαυτό σου:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/koulaxizis/koulaxizis.git
    cd koulaxizis
    ```

2.  **Δομή Αρχείων**:
    Το project ακολουθεί μια απλή δομή:
    ```
    /
    ├── index.html       # Κύρια σελίδα (Portfolio)
    ├── style.css        # Κεντρικά στυλ (Variables, Layout, Components)
    ├── script.js        # Λογική (Updates, Search, Filters, Theme, PWA)
    ├── sw.js            # Service Worker (PWA Caching)
    ├── manifest.json    # PWA Manifest
    ├── updates.json     # Δεδομένα ενημερώσεων (Blog/News)
    ├── sitemap.xml      # Sitemap με Anchor Links
    ├── LICENSE          # MIT License
    ├── 404.html         # Error Page with Latest Update Feed
    └── README.md        # This file
    ```

3.  **Deploy**:
    Το project είναι έτοιμο για hosting σε οποιοδήποτε στατικό χώρο (GitHub Pages, Netlify, Vercel, ή απλό Apache/Nginx server).
    > 💡 **Σημείωση**: Για το Service Worker να δουλέψει σωστά, η σελίδα πρέπει να φιλοξενείται σε **HTTPS** ή `localhost`.

4.  **Customization**:
    *   **Χρώματα**: Άλλαξε τα `--bg-color`, `--accent-color` στο `style.css`.
    *   **Περιεχόμενο**: Επεξεργάσου τα HTML tags στο `index.html` και το JSON στο `updates.json`.
    *   **SEO**: Ενημέρωσε το `sitemap.xml` και τα meta tags στο `<head>` του `index.html`.
    *   **Scores**: Αν τρέξεις νέο Lighthouse test, ενημέρωσε την ενότητα "Satisfying Performance Metrics" στο README.

---

## 📑 Δομή Λειτουργιών (Functional Breakdown)

### 1. Σύστημα Ενημερώσεων (Updates System)
Το κεντρικό σημείο δυναμικού περιεχομένου.
*   **Dynamic Fetching**: Φόρτωση δεδομένων από `updates.json` χωρίς reload της σελίδας.
*   **Smart Filtering**: Φιλτράρισμα κατά Tag (emoji icons) και Αναζήτηση κειμένου.
*   **Pagination**: "Load More" button με on-demand rendering.
*   **Share Functionality**: Native Web Share API (mobile) και Clipboard copy (desktop).

### 2. Διαχείριση Θέματος (Theme Management)
*   Ανίχνευση `prefers-color-scheme`.
*   Αλλαγές μεταβλητών CSS runtime.
*   Συντήρηση επιλογής χρήστη για επόμενες επισκέψεις.

### 3. PWA Integration
*   **Install Prompt**: Αυτόματη εμφάνιση κουμπιού εγκατάστασης όταν υπάρχει διαθέσιμη δυνατότητα.
*   **Offline Support**: Η σελίδα φορτώνει ακόμα και χωρίς internet (graceful degradation).
*   **App Shell Model**: Γρήγορη φόρτωση shell, ασύγχρονη φόρτωση δεδομένων.

### 4. SEO & AI Optimization
*   **Structured Data**: JSON-LD για `Person`, `Organization`, `WebPage`, `BreadcrumbList`.
*   **Anchor Sitemap**: Κατάλογος URL με anchor links (`#section`) για καλύτερη crawling.
*   **Semantic HTML**: Σωστή χρήση των `<article>`, `<aside>`, `<nav>`, `<header>`.

### 5. Error Handling (404 Page)
*   Δυναμική σελίδα σφάλματος που εμφανίζει την τελευταία ενημέρωση για να κρατήσει τον χρήστη ενδιαφερόμενο.
*   "Go back home" button για άμεση πλοήγηση.

---

## 🤝 Συνεισφορά & License

Αυτό το project είναι **Open Source**. Μπορείς να το χρησιμοποιήσεις, να το τροποποιήσεις και να το διανέμεις ελεύθερα.

**License**: MIT License © 2026 Χρήστος Κουλαξίζης

Αν βρεις κάποιο bug ή έχεις πρόταση βελτίωσης, άνοιξε ένα Issue ή PR στο GitHub!

---
<div style="page-break-after: always;"></div>

---

# English Version <a name="english-version"></a> <img src="https://koulaxizis.gr/icon-192.webp" align="right" height="50">

> 🇬🇧 **Minimalist Personal Portfolio & Blog Built with Vanilla Tech**  
> 🇬🇷 **Προσωπικό Portfolio & Blog με Privacy-First Προσέγγιση**

[Click here for Greek version](#greek-section-title) *(Link to top)*

---

## 🌟 Satisfying Performance Metrics ⚡

This site has been rigorously tested and verified for high performance:

| Metric | Desktop Score | Mobile Score | Status |
| :--- | :---: | :---: | :---: |
| **Performance** | <span style="color:#33FF57; font-weight:bold;">98</span> | <span style="color:#FFB300; font-weight:bold;">78</span> | ✅ Excellent / ⚠️ Optimizable |
| **Accessibility** | <span style="color:#33FF57; font-weight:bold;">92</span> | <span style="color:#33FF57; font-weight:bold;">92</span> | ✅ Excellent |
| **Best Practices** | <span style="color:#33FF57; font-weight:bold;">92</span> | <span style="color:#33FF57; font-weight:bold;">92</span> | ✅ Excellent |
| **SEO** | <span style="color:#33FF57; font-weight:bold;">100</span> | <span style="color:#33FF57; font-weight:bold;">100</span> | ✅ Perfect |

> 📊 **Source**: [Google PageSpeed Insights Report](https://pagespeed.web.dev/analysis/https-koulaxizis-gr/fxttxjzqgd)  
> *Note: The mobile performance score of 78 is typical for vanilla sites on limited mobile hardware, while all other metrics are top-tier.*

---

## 🇬🇧 About The Project

This project is a **fully functional, minimalist personal portfolio** built from scratch using **vanilla code**, without any external framework dependencies (except Font Awesome for icons).

The goal is to provide a fast, secure, responsive, and meaningful user experience, adhering to open culture principles and data privacy standards.

### ✨ Key Features

#### 🔒 Security & Privacy First
| Feature | Description |
| :--- | :--- |
| **Zero-Tracking** | No Analytics (Google Analytics, etc.). Completely respectful of visitor privacy. |
| **CSP Headers** | High-level **Content-Security-Policy** to prevent XSS and injection attacks. |
| **No Ads / No Sponsors** | Explicit "No ads • No Sponsors" badge in the footer for transparency. |
| **No Google Ecosystem** | Preference for Open Source or Self-hosted solutions where possible. |

#### ⚡ Performance Optimized
*   **Core Web Vitals Ready**: Minimized LCP via Critical CSS inlining (Desktop Perf: 98%).
*   **PWA Enabled**: Full **Progressive Web App** support with offline caching strategies.
*   **Resource Preloading**: Critical assets (fonts, scripts, images) preloaded.
*   **Skeleton Loaders**: Smooth animated loading states instead of white screens.
*   **Asset Optimization**: WebP images and optimized CDN delivery.

#### 🎨 Design & User Experience
*   **Dark/Light Mode**: Auto-detection of system preference + manual toggle with `localStorage` persistence.
*   **Mobile-First Responsive**: Perfectly adapted for smartphones, tablets, and desktops.
*   **Accessible (WCAG Compliant)**: Skip-link, proper ARIA labels, full keyboard navigation, `prefers-reduced-motion` support.
*   **Smart Navigation Helpers**: Back-to-top button, sticky sidebar, smooth scrolling.

#### 🛠️ Technical Stack

| Technology | Usage |
| :--- | :--- |
| **HTML5 Semantic** | Structured content with Schema.org (JSON-LD) for AI Crawlers & SEO. |
| **CSS3 (Custom Props)** | Dynamic theming, Grid, Flexbox, Sticky positioning, Scroll-snap. |
| **Vanilla JavaScript** | Zero-dependency logic for updates, search, filters, and PWA installation. |
| **JSON** | Dynamic update loading (`updates.json`) and RSS feed generation. |
| **Service Worker** | Offline-first architecture and intelligent cache management. |
| **Lighthouse Verified** | Scores verified by Google PageSpeed Insights. |

---

## 🚀 Quick Start Guide

To use this codebase for your own project:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/koulaxizis/koulaxizis.git
    cd koulaxizis
    ```

2.  **File Structure**:
    The project follows a clean, simple structure:
    ```
    /
    ├── index.html       # Main Portfolio Page
    ├── style.css        # Global Styles (Variables, Layout, Components)
    ├── script.js        # Logic (Updates, Search, Filters, Theme, PWA)
    ├── sw.js            # Service Worker (PWA Caching)
    ├── manifest.json    # PWA Configuration
    ├── updates.json     # Update Feed Data (Blog/News)
    ├── sitemap.xml      # Sitemap with Anchor Links
    ├── LICENSE          # MIT License
    ├── 404.html         # Error Page with Latest Update Feed
    └── README.md        # This file
    ```

3.  **Deployment**:
    Ready for static hosting on **GitHub Pages**, **Netlify**, **Vercel**, or any standard Apache/Nginx server.
    > 💡 **Note**: For the Service Worker to function correctly, the site must be served over **HTTPS** or `localhost`.

4.  **Customization**:
    *   **Colors**: Modify `--bg-color`, `--accent-color` in `style.css`.
    *   **Content**: Edit HTML tags in `index.html` and data in `updates.json`.
    *   **SEO**: Update `sitemap.xml` and meta tags in the `<head>` of `index.html`.
    *   **Scores**: If you run a new Lighthouse test, update the "Satisfying Performance Metrics" section in this README.

---

## 📑 Functional Architecture

### 1. Updates System (Dynamic Content)
The core dynamic engine of the site.
*   **Dynamic Fetching**: Loads content from `updates.json` without page reloads.
*   **Smart Filtering**: Filter by Tags (emoji icons) and text search.
*   **Pagination**: "Load More" button for on-demand rendering.
*   **Sharing**: Native Web Share API (mobile) and Clipboard copy (desktop).

### 2. Theme Management
*   Detects `prefers-color-scheme`.
*   Runtime CSS variable switching.
*   Persists user choice for future visits.

### 3. PWA Integration
*   **Install Prompt**: Auto-shows install button when supported.
*   **Offline Support**: Site loads gracefully even without an internet connection.
*   **App Shell Model**: Fast shell loading, asynchronous data fetching.

### 4. SEO & AI Optimization
*   **Structured Data**: JSON-LD for `Person`, `Organization`, `WebPage`, `BreadcrumbList`.
*   **Anchor Sitemap**: URLs including anchor links (`#section`) for better indexing.
*   **Semantic HTML**: Correct use of `<article>`, `<aside>`, `<nav>`, `<header>`.

### 5. Error Handling (404 Page)
*   Dynamic error page showing the latest update to keep users engaged.
*   "Go back home" button for easy navigation.

---

## 🤝 Contributing & License

This project is **Open Source**. You are free to use, modify, and distribute it.

**License**: MIT License © 2026 Christos Koulaxizis

If you find a bug or have an improvement suggestion, feel free to open an Issue or Pull Request on GitHub!

---

<div align="center">

**Made with ❤️ by Christos Koulaxizis**  
*Privacy • Minimalism • Open Source*

</div>
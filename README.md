# koulaxizis.gr <img src="https://koulaxizis.gr/icon-192.webp" align="right" height="40">

> 🇬🇷 **Προσωπικό Portfolio & Blog με Privacy-First Προσέγγιση**  
> 🇬🇧 **Personal Portfolio & Blog with Privacy-First Approach**

[Click here for English version](#english-version)

---

## 🌟 Σχετικά με το Project

Αυτό το εγχείρημα είναι ένα **πλήρως λειτουργικό, minimalist προσωπικό portfolio** που χτίστηκε από το μηδέν (vanilla code), χωρίς καμία εξάρτηση frameworks ή βιβλιοθηκών τρίτων εκτός των απαραίτητων (Font Awesome). 

Σκοπός του είναι να παρέχει μια γρήγορη, ασφαλή, προσαρμοστική (responsive) και ουσιαστική εμπειρία στον χρήστη, τηρώντας τις αρχές της ανοικτής κουλτούρας και της προστασίας των δεδομένων.

### ✨ Βασικά Χαρακτηριστικά (Features)

#### 🔒 Ασφάλεια & Ιδιωτικότητα (Security & Privacy)
| Feature | Περιγραφή |
| :--- | :--- |
| **Zero-Tracking** | Δεν υπάρχουν Analytics (Google Analytics, etc.). Η σελίδα σεβεται απόλυτα την ιδιωτικότητα του επισκέπτη. |
| **CSP Headers** | Υψηλού επιπέδου **Content-Security-Policy** για μπλοκάρισμα XSS και injection attacks. |
| **Secure Cookies** | Όλες οι συνεδρίες διαχείρισης βασίζονται σε token με αυστηρά περιορισμούς. |
| **No Google Services** | Μόνο Open Source ή Self-hosted λύσεις (όπου γίνεται). |
| **Referrer Policy** | `strict-origin-when-cross-origin` για προστασία της πηγής αναφοράς. |

#### ⚡ Απόδοση (Performance)
*   **Core Web Vitals Optimized**: Ελαχιστοποίηση LCP (Largest Contentful Paint) μέσω Critical CSS inline.
*   **Service Worker PWA**: Επίσημη υποστήριξη **Progressive Web App** με offline caching strategy (Cache First / Network First ανά τύπο αρχείου).
*   **Preloading**: Προ-φόρτωση κρίσιμων πόρων (fonts, scripts, images) με `<link rel="preload">`.
*   **Skeleton Loading**: Ομαλές animating καταστάσεις φόρτωσης (skeletons) αντί για blank screens.
*   **Optimized Assets**: Χρήση μορφών WebP για εικόνες και CDN caching για στατικά αρχεία.

#### 🎨 Σχεδιασμός & UX (Design & UX)
*   **Dark/Light Mode**: Αυτόματη ανίχνευση συστήματος + χειροκίνητη εναλλαγή με persistence (`localStorage`).
*   **Responsive Mobile-First**: Πλήρης υποστήριξη για όλες τις οθόνες, από smartphone μέχρι desktop large screens.
*   **Accessible (WCAG)**: 
    *   Skip-link για screen readers.
    *   Proper ARIA labels και roles.
    *   Keyboard navigation support (Focus states).
    *   Reduced-motion support για άτομα με ευαισθησία.
*   **Micro-interactions**: Ομαλά hover effects, smooth scrolling, και transitions.

#### 🛠️ Τεχνολογική Στοίβα (Tech Stack)

| Τεχνολογία | Χρήση |
| :--- | :--- |
| **HTML5 Semantic** | Δομημένο περιεχόμενο με Schema.org (JSON-LD) για AI Crawlers & SEO. |
| **CSS3 (Custom Properties)** | Dynamic theming, Grid, Flexbox, Sticky positioning, Scroll-snap. |
| **Vanilla JavaScript** | Zero dependencies logic for updates, search, filters, PWA install. |
| **JSON** | Δυναμική φόρτωση ενημερώσεων (updates.json) και RSS feed. |
| **Service Worker** | Offline-first architecture και cache management. |

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
    ├── script.js        # Λογική (Updates, Search, Filters, Theme)
    ├── sw.js            # Service Worker (PWA Caching)
    ├── manifest.json    # PWA Manifest
    ├── updates.json     # Δεδομένα ενημερώσεων (Blog/News)
    ├── sitemap.xml      # Sitemap με Anchor Links
    ├── assets/          # Εικόνες (avatar.webp, icons)
    └── admin.html       # Admin Panel (Προστατευμένο με Token)
    ```

3.  **Deploy**:
    Το project είναι έτοιμο για hosting σε οποιοδήποτε στατικό χώρο (GitHub Pages, Netlify, Vercel, ή απλό Apache/Nginx server).
    > 💡 **Σημείωση**: Για το Service Worker να δουλέψει σωστά, η σελίδα πρέπει να φιλοξενείται σε **HTTPS** ή `localhost`.

4.  **Customization**:
    *   **Χρώματα**: Άλλαξε τα `--bg-color`, `--accent-color` στο `style.css`.
    *   **Περιεχόμενο**: Επεξεργάσου τα HTML tags στο `index.html` και το JSON στο `updates.json`.
    *   **SEO**: Ενημέρωσε το `sitemap.xml` και τα meta tags στο `<head>` του `index.html`.

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

---

## 🤝 Συνεισφορά & License

Αυτό το project είναι **Open Source**. Μπορείς να το χρησιμοποιήσεις, να το τροποποιήσεις και να το διανέμεις ελεύθερα.

**License**: MIT License © 2026 Χρήστος Κουλαξίζης

Αν βρεις κάποιο bug ή έχεις πρόταση βελτίωσης, άνοιξε ένα Issue ή PR στο GitHub!

---
<div style="page-break-after: always;"></div>

---

# English Version <a name="english-version"></a> <img src="https://koulaxizis.gr/icon-192.webp" align="right" height="40">

> 🇬🇧 **Minimalist Personal Portfolio & Blog Built with Vanilla Tech**  
> 🇬🇷 **Προσωπικό Portfolio & Blog με Privacy-First Προσέγγιση**

[Click here for Greek version](#greek-section-title) *(Link to top)*

---

## 🌟 About The Project

This project is a **fully functional, minimalist personal portfolio** built from scratch using **vanilla code**, without any external framework dependencies (except Font Awesome for icons).

The goal is to provide a fast, secure, responsive, and meaningful user experience, adhering to open culture principles and data privacy standards.

### ✨ Key Features

#### 🔒 Security & Privacy First
| Feature | Description |
| :--- | :--- |
| **Zero-Tracking** | No Analytics (Google Analytics, etc.). Completely respectful of visitor privacy. |
| **CSP Headers** | High-level **Content-Security-Policy** to prevent XSS and injection attacks. |
| **Secure Tokens** | Admin panel sessions use strict token-based authentication. |
| **No Google Ecosystem** | Preference for Open Source or Self-hosted solutions where possible. |
| **Referrer Policy** | `strict-origin-when-cross-origin` implemented. |

#### ⚡ Performance Optimized
*   **Core Web Vitals Ready**: Minimized LCP via Critical CSS inlining.
*   **PWA Enabled**: Full **Progressive Web App** support with offline caching strategies (Cache First / Network First based on content type).
*   **Resource Preloading**: Critical assets (fonts, scripts, images) preloaded.
*   **Skeleton Loaders**: Smooth animated loading states instead of white screens.
*   **Asset Optimization**: WebP images and optimized CDN delivery.

#### 🎨 Design & User Experience
*   **Dark/Light Mode**: Auto-detection of system preference + manual toggle with `localStorage` persistence.
*   **Mobile-First Responsive**: Perfectly adapted for smartphones, tablets, and desktops.
*   **Accessible (WCAG Compliant)**:
    *   Skip-link for screen readers.
    *   Proper ARIA labels and roles.
    *   Full keyboard navigation support.
    *   `prefers-reduced-motion` support.
*   **Micro-interactions**: Smooth hovers, scroll animations, and transitions.

#### 🛠️ Technical Stack

| Technology | Usage |
| :--- | :--- |
| **HTML5 Semantic** | Structured content with Schema.org (JSON-LD) for AI Crawlers & SEO. |
| **CSS3 (Custom Props)** | Dynamic theming, Grid, Flexbox, Sticky positioning, Scroll-snap. |
| **Vanilla JavaScript** | Zero-dependency logic for updates, search, filters, and PWA installation. |
| **JSON** | Dynamic update loading (`updates.json`) and RSS feed generation. |
| **Service Worker** | Offline-first architecture and intelligent cache management. |

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
    ├── script.js        # Logic (Updates, Search, Filters, Theme Toggle)
    ├── sw.js            # Service Worker (PWA Caching)
    ├── manifest.json    # PWA Configuration
    ├── updates.json     # Update Feed Data (Blog/News)
    ├── sitemap.xml      # Sitemap with Anchor Links
    ├── assets/          # Images (avatar.webp, icons)
    └── admin.html       # Admin Panel (Token Protected)
    ```

3.  **Deployment**:
    Ready for static hosting on **GitHub Pages**, **Netlify**, **Vercel**, or any standard Apache/Nginx server.
    > 💡 **Note**: For the Service Worker to function correctly, the site must be served over **HTTPS** or `localhost`.

4.  **Customization**:
    *   **Colors**: Modify `--bg-color`, `--accent-color` in `style.css`.
    *   **Content**: Edit HTML tags in `index.html` and data in `updates.json`.
    *   **SEO**: Update `sitemap.xml` and meta tags in the `<head>` of `index.html`.

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
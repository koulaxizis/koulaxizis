# koulaxizis.gr <img src="https://koulaxizis.gr/icon-192.webp" align="right" height="50">

> 🇬🇷 **Το Απόλυτο Vanilla Portfolio: Γρήγορο, Ασφαλές, Όμορφο & Open Source**  
> 🇬🇧 **The Ultimate Vanilla Portfolio: Fast, Secure, Beautiful & Open Source**

[👉 Click here for English Version](#english-version)

---

## 🚀 Γιατί αυτό το Project;

Μην ψάχνεις περισσότερο! Αυτό δεν είναι απλώς ένα template. Είναι ένας **πλήρως βελτιστοποιημένος, παραγωγικός μηχανισμός προσωπικής παρουσίασης**, χτισμένος από την αρχή (Vanilla Code) για να αποφεύγει τον "φουσκωμένο" κώδικα των σύγχρονων frameworks.

Αν ψάχνεις μια ιστοσελίδα που:
*   ⚡ **Φορτώνει άμεσα** (Sub-second load times).
*   🔒 **Σεβάζεται την ιδιωτικότητα** (Zero Analytics, Zero Tracking).
*   🎨 **Προσαρμόζεται τέλεια** σε κινητά και desktop.
*   💡 **Έχει έξυπνες λειτουργίες** (Microblogging, Search, PWA).

...τότε έχεις βρει το ιδανικό εργαλείο. Διάβασε παρακάτω για να ανακαλύψεις πώς κάθε γραμμή κώδικα δουλεύει για σένα!

---

## ✨ Βαθύτατη Ανάλυση Χαρακτηριστικών (Deep Dive Features)

### 📱 1. Microblogging Σύστημα στη Sidebar (Real-Time Updates)
Η δεξιά πλευρά της σελίδας δεν είναι απλώς μια λίστα κειμένων. Είναι ένας **ζωντανός feed ενημερώσεων** σχεδιασμένος για αλληλεπίδραση:
*   **Δυναμική Λίστα**: Φόρτωση δεδομένων μέσω JSON (`updates.json`) χωρίς reload της σελίδας.
*   **Emojis ως Tags**: Κάθε ανάρτηση συνοδεύεται από emoji icons (π.χ. 🌱, 🐮, 💻) που λειτουργούν ως οπτικοί επιλογείς κατηγοριών.
*   **Άμεση Αναζήτηση**: Ενσωματωμένο πεδίο αναζήτησης στο ίδιο πλαίσιο που φιλτράζει άμεσα τις αναρτήσεις σε πραγματικό χρόνο (Search-as-you-type).
*   **Smart Filters**: Κλικ σε ένα Emoji tag για να δείτε μόνο τα posts εκείνης της κατηγορίας.
*   **Pagination**: Πλήθος ανάρτησεων διαχειρίζονται με κουμπί "Load More" για μέγιστη απόδοση μνήμης.
*   **One-Click Share**: 
    *   📲 Στις συσκευές (Mobile): Χρήση του **Native Web Share API** για άμεση κοινή χρήση σε WhatsApp, Telegram, κλπ.
    *   💻 Στα Desktop: Αυτόματη αντιγραφή του περιεχομένου στο clipboard με ενιαία επερχόμενη ειδοποίηση.

### 🍔 2. Mobile Navigation (Hamburger Menu)
Ένα καθαρό, ευέλικτο μενού που μεταμορφώνει την εμπειρία χρήστη σε κινητά:
*   **Smooth Toggle**: Κουμπί Hamburger με ομαλή animation μετάβαση μεταξύ κλειστής/ανοιχτής κατάστασης.
*   **Semantic Structure**: Χρήση `<nav>` και ARIA labels για πλήρη προσβασιμότητα (Screen Readers).
*   **Responsive Layout**: Αυτοματοποιημένη κρυψία στον desktop και εμφάνιση όταν απαιτείται (max-width breakpoint).
*   **Touch Friendly**: Μεγάλες περιοχές αφήγησης (tap targets) για εύκολη πλοήγηση με το δάχτυλο.

### 🌓 3. Smart Dark/Light Mode
Ολοκληρωμένο σύστημα θέματος που ταιριάζει στις συνήθειες του χρήστη:
*   **System Detection**: Αυτοματοποιημένη ανίχνευση της ρύθμισης σκούρου/φωτεινού του λειτουργικού συστήματος (`prefers-color-scheme`).
*   **Instant Toggle**: Κουμπί "☀️/🌙" στην πάνω δεξιά γωνία για άμεση εναλλαγή χωρίς καθυστέρηση.
*   **Persistence**: Η επιλογή του χρήστη αποθηκεύεται στο `localStorage` και θυμάται την επόμενη φορά που θα επισκεφθεί τη σελίδα.
*   **CSS Variables**: Ολόκληρο το χρωματικό σχήμα βασίζεται σε μεταβλητές CSS για instant rendering.

### 🔍 4. Advanced Search & Filtering
Μια λύση που συνδυάζει ισχύ και ευκολία:
*   **Live Search**: Το κείμενο που πληκτρολογείτε στο sidebar φιλτράζει αμέσως τα αποτελέσματα χωρίς κλικ στο "Submit".
*   **Tag Integration**: Οι κατηγορίες (tags) μπορούν να ενεργοποιούνται είτε με κλικ στο εικονίδιο είτε μέσω του φίλτρου του sidebar.
*   **Empty State Handling**: Ευφυές μήνυμα "Δεν βρέθηκαν αποτελέσματα" όταν η αναζήτηση δεν έχει νόημα.

### 📦 5. Progressive Web App (PWA) Ready
Η ιστοσελίδα σου μπορεί να εγκατασταθεί σαν εφαρμογή!
*   **Install Prompt**: Αυτόματη εμφάνιση κουμπιού "Εγκατάσταση" (Install App) όταν ο browser υποστηρίζει PWA.
*   **Offline Support**: Χάρη στον **Service Worker**, η σελίδα φορτώνει ακόμα και αν χάσεις το internet (Cache First Strategy για στατικά, Network First για updates).
*   **App Icons & Manifest**: Πλήρης υποστήριξη για home screen icons, splash screens και χρώματα οθόνης lockscreen.
*   **Fast Load Times**: Η πρώτη φορά είναι αργή, αλλά οι επόμενες φόρτωσης είναι σχεδόν στιγμιαίες χάρη στο caching.

### 🚀 6. Κορυφαία Ταχύτητα & Performance
Κάθε byte έχει υπολογιστεί:
*   **Critical CSS Inline**: Τα κρίσιμα στυλ για το "above-the-fold" περιεχόμενο φορτώνουν κατευθείαν στο `<head>`, εξαλείφοντας το CLS (Cumulative Layout Shift).
*   **Resource Preloading**: Fonts, Scripts και Images φορτώνονται εκ των προτέρων με `<link rel="preload">`.
*   **Skeleton Loading**: Κατά τη φόρτωση των δεδομένων, βλέπουμε όμορφα animated skeletons αντί για λευκές οθόνες φόρτωσης.
*   **WebP Images**: Όλες οι εικόνες χρησιμοποιούν τη μορφή WebP για ελάχιστο βάρος και μέγιστη ποιότητα.
*   **No Framework Bloat**: Μηδενική εξάρτηση από React, Vue ή jQuery. Μόνο καθαρός, γρήγορος κώδικας.

### 📲 7. Responsive Design & Mobile First
Μια σελίδα που φαίνεται υπέροχη σε οποιαδήποτε οθόνη:
*   **Fluid Grids**: Χρήση CSS Grid και Flexbox για αυτόματη προσαρμογή στο μέγεθος της οθόνης.
*   **Touch Optimizations**: Αποσύνθεση στοιχείων (stacking) σε μικρές οθόνες για εύκολη ανάγνωση.
*   **Adaptive Typography**: Οι γραμματοσειρές και τα margins προσαρμόζουν το μέγεθός τους ανάλογα με τη συσκευή.
*   **Breakpoints**: Βέλτιστη εμπειρία σε Smartphones (<480px), Tablets (480-900px) και Desktops (>900px).

### ⬆️ 8. Smart Navigation Helpers
Λειτουργίες που διευκολύνουν την πλοήγηση:
*   **Back-to-Top Button**: Ένα κυκλικό κουμπί που εμφανίζεται δυναμικά μόλις ο χρήστης κάνει scroll κάτω, επιτρέποντας άμεση επιστροφή στην κορυφή με smooth animation.
*   **Sticky Sidebar**: Η μπάρα ενημερώσεων κολλάει στην κορυφή της οθόνης όσο ο χρήστης διαβάζει το υπόλοιπο περιεχόμενο, διατηρώντας πάντα διαθέσιμη την αναζήτηση.
*   **Smooth Scroll**: Πλήρης στήριξη για ομαλή κύλιση σε όλες τις εσωτερικές αρθρώσεις (#links).

### 🎨 9. Font Awesome & Iconography
*   **Vector Icons**: Χρήση της Font Awesome για όλα τα εικονίδια (κοινωνικά δίκτυα, δράσεις, tags).
*   **Lightweight Load**: Υποστηριζόμενο από CDN για γρήγορη παράδοση χωρίς βαρύτητα.
*   **Consistent Style**: Διατηρεί ένα ενιαίο, επαγγελματικό αισθητικό σε όλη την σελίδα.

### ♿ 10. Accessibility (WCAG Compliant)
Για όλους, παντού:
*   **Skip Link**: Άμεση μετάβαση στο περιεχόμενο για screen readers.
*   **ARIA Labels**: Περιγραφές για κάθε κουμπί και σύνδεσμο.
*   **Focus States**: Ορατά borders για πλοήγηση με πληκτρολόγιο.
*   **Reduced Motion**: Σεβασμός στη ρύθμιση `prefers-reduced-motion` για άτομα με ζαλάδα.

---

## 🛠️ Τεχνολογική Στοίβα (Tech Stack)

| Τεχνολογία | Ρόλος |
| :--- | :--- |
| **HTML5 Semantic** | Δομή περιεχομένου με Schema.org (JSON-LD) για AI Crawlers. |
| **CSS3 (Variables)** | Dynamic Theming, Grid Layout, Sticky Positioning, Animations. |
| **Vanilla JS (ES6+)** | Μοναδικό λογισμικό (Updates, Search, Theme, PWA Logic). |
| **JSON** | Δομημένα δεδομένα για Blog/Updates Feed. |
| **Service Worker** | Offline-first Cache Management & PWA functionality. |
| **Font Awesome** | Vector Icon Library. |
| **WebP** | Next-gen Image Format. |

---

## 🚀 Πώς να το Ξεκινήσεις (Quick Start)

1.  **Clone το Repository**:
    ```bash
    git clone https://github.com/koulaxizis/koulaxizis.git
    cd koulaxizis
    ```

2.  **Δομή Αρχείων**:
    ```
    /
    ├── index.html       # Η καρδιά του site (Portfolio)
    ├── style.css        # Όλα τα στυλ (Colors, Layout, Animations)
    ├── script.js        # Η λογική (Search, Filters, Theme, PWA)
    ├── sw.js            # Service Worker (Offline Support)
    ├── manifest.json    # PWA Configuration
    ├── updates.json     # Τα δεδομένα του blog/microblogging
    ├── sitemap.xml      # Sitemap με Anchor Links (SEO)
    └── admin.html       # Panel διαχείρισης (Token Protected)
    ```

3.  **Deploy**:
    Ανέβασέ το όπου θες! **GitHub Pages**, **Netlify**, **Vercel** ή έναν απλό hosting.
    > ⚠️ **Σημαντικό**: Το PWA απαιτεί **HTTPS** ή `localhost`.

4.  **Personalization**:
    *   **Άλλαξε τα Χρώματα**: Στο `style.css` (variables `--bg-color`, `--accent-color`).
    *   **Γράψε τα Posts**: Επεξεργάσου το `updates.json`.
    *   **Βάλε τα Δικά σου**: Άλλαξε το `index.html` και τα εικονίδια.

---

## 🤝 License & Συμβολή

Αυτό το έργο είναι **Open Source** (MIT License).
Μπορείς να το χρησιμοποιήσεις ελεύθερα, να το αλλάξεις, να το πουλήσεις (αν θέλεις!) και να το διανέμεις.
Αν βρεις bug ή έχεις ιδέα, άνοιξε Issue στο GitHub!

---

<div style="page-break-after: always;"></div>

---

# English Version <a name="english-version"></a> <img src="https://koulaxizis.gr/icon-192.webp" align="right" height="50">

> 🇬🇧 **The Ultimate Vanilla Portfolio: Fast, Secure, Beautiful & Open Source**  
> 🇬🇷 **Το Απόλυτο Vanilla Portfolio: Γρήγορο, Ασφαλές, Όμορφο & Open Source**

[👉 Click here for Greek Version](#greek-section-title) *(Link to top)*

---

## 🚀 Why This Project?

Stop searching! This isn't just another template. It's a **fully optimized, productive personal presentation engine**, built from scratch (Vanilla Code) to avoid the bloat of modern frameworks.

If you are looking for a website that:
*   ⚡ **Loads Instantly** (Sub-second load times).
*   🔒 **Respects Privacy** (Zero Analytics, Zero Tracking).
*   🎨 **Adapts Perfectly** to mobile and desktop.
*   💡 **Has Smart Features** (Microblogging, Search, PWA).

...then you've found the ideal tool. Read on to discover how every line of code works for you!

---

## ✨ Deep Dive into Features

### 📱 1. Microblogging System in the Sidebar (Real-Time Updates)
The right sidebar is not just a list of texts. It's a **live update feed designed for interaction**:
*   **Dynamic Loading**: Content loads via JSON (`updates.json`) without page reloads.
*   **Emojis as Tags**: Every post is accompanied by emoji icons (e.g., 🌱, 🐮, 💻) acting as visual category selectors.
*   **Instant Search**: An integrated search field filters posts in real-time (Search-as-you-type).
*   **Smart Filters**: Click an emoji tag to view only posts in that specific category.
*   **Pagination**: Large volumes of posts managed with a "Load More" button for maximum memory efficiency.
*   **One-Click Share**: 
    *   📲 **Mobile**: Uses the **Native Web Share API** for instant sharing to WhatsApp, Telegram, etc.
    *   💻 **Desktop**: Automatically copies content to clipboard with a single click and instant feedback.

### 🍔 2. Mobile Navigation (Hamburger Menu)
A clean, flexible menu that transforms the user experience on mobile:
*   **Smooth Toggle**: Hamburger button with smooth animation transitions between open/closed states.
*   **Semantic Structure**: Uses `<nav>` and ARIA labels for full accessibility (Screen Readers).
*   **Responsive Layout**: Auto-hides on desktop and appears when needed (max-width breakpoint).
*   **Touch Friendly**: Large tap targets for easy navigation with a finger.

### 🌓 3. Smart Dark/Light Mode
An integrated theme system matching user habits:
*   **System Detection**: Auto-detection of OS dark/light mode settings (`prefers-color-scheme`).
*   **Instant Toggle**: ☀️/🌙 button in the top-right corner for immediate switching without delay.
*   **Persistence**: User choice is saved to `localStorage` and remembered on return visits.
*   **CSS Variables**: Entire color scheme based on CSS variables for instant rendering.

### 🔍 4. Advanced Search & Filtering
A solution combining power and simplicity:
*   **Live Search**: Text typed in the sidebar filters results immediately without a "Submit" click.
*   **Tag Integration**: Categories (tags) can be activated by clicking the icon or via the sidebar filter.
*   **Empty State Handling**: Intelligent "No results found" message when search yields nothing.

### 📦 5. Progressive Web App (PWA) Ready
Your website can be installed as an app!
*   **Install Prompt**: Automatic "Install App" button appearance when the browser supports PWA.
*   **Offline Support**: Thanks to the **Service Worker**, the site loads even if you lose internet (Cache First for static, Network First for updates).
*   **App Icons & Manifest**: Full support for home screen icons, splash screens, and lockscreen colors.
*   **Fast Load Times**: First load takes time, but subsequent loads are nearly instant thanks to caching.

### 🚀 6. Top-Tier Speed & Performance
Every byte has been calculated:
*   **Critical CSS Inline**: Styles for "above-the-fold" content load directly in the `<head>`, eliminating CLS (Cumulative Layout Shift).
*   **Resource Preloading**: Fonts, Scripts, and Images preloaded with `<link rel="preload">`.
*   **Skeleton Loading**: During data loading, beautiful animated skeletons appear instead of white screens.
*   **WebP Images**: All images use WebP format for minimal weight and maximum quality.
*   **No Framework Bloat**: Zero dependency on React, Vue, or jQuery. Only pure, fast code.

### 📲 7. Responsive Design & Mobile First
A site that looks amazing on any screen:
*   **Fluid Grids**: CSS Grid and Flexbox for automatic size adaptation.
*   **Touch Optimizations**: Stacking elements on small screens for easy reading.
*   **Adaptive Typography**: Fonts and margins adapt their size based on the device.
*   **Breakpoints**: Optimal experience on Smartphones (<480px), Tablets (480-900px), and Desktops (>900px).

### ⬆️ 8. Smart Navigation Helpers
Features that facilitate navigation:
*   **Back-to-Top Button**: A circular button that dynamically appears once the user scrolls down, allowing instant return to the top with smooth animation.
*   **Sticky Sidebar**: The update bar sticks to the top of the screen as the user reads the rest of the content, keeping search always available.
*   **Smooth Scroll**: Full support for smooth scrolling on all internal anchors (#links).

### 🎨 9. Font Awesome & Iconography
*   **Vector Icons**: Use of Font Awesome for all icons (social networks, actions, tags).
*   **Lightweight Load**: Supported by CDN for fast delivery without heaviness.
*   **Consistent Style**: Maintains a unified, professional aesthetic throughout the site.

### ♿ 10. Accessibility (WCAG Compliant)
For everyone, everywhere:
*   **Skip Link**: Immediate jump to content for screen readers.
*   **ARIA Labels**: Descriptions for every button and link.
*   **Focus States**: Visible borders for keyboard navigation.
*   **Reduced Motion**: Respect for `prefers-reduced-motion` setting for users with dizziness.

---

## 🛠️ Technical Stack

| Technology | Role |
| :--- | :--- |
| **HTML5 Semantic** | Content structure with Schema.org (JSON-LD) for AI Crawlers. |
| **CSS3 (Variables)** | Dynamic Theming, Grid Layout, Sticky Positioning, Animations. |
| **Vanilla JS (ES6+)** | Single logic source (Updates, Search, Theme, PWA Logic). |
| **JSON** | Structured data for Blog/Updates Feed. |
| **Service Worker** | Offline-first Cache Management & PWA functionality. |
| **Font Awesome** | Vector Icon Library. |
| **WebP** | Next-gen Image Format. |

---

## 🚀 How to Get Started (Quick Start)

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/koulaxizis/koulaxizis.git
    cd koulaxizis
    ```

2.  **File Structure**:
    ```
    /
    ├── index.html       # The heart of the site (Portfolio)
    ├── style.css        # All styles (Colors, Layout, Animations)
    ├── script.js        # The logic (Search, Filters, Theme, PWA)
    ├── sw.js            # Service Worker (Offline Support)
    ├── manifest.json    # PWA Configuration
    ├── updates.json     # Blog/microblogging data
    ├── sitemap.xml      # Sitemap with Anchor Links (SEO)
    └── admin.html       # Admin panel (Token Protected)
    ```

3.  **Deploy**:
    Upload it anywhere! **GitHub Pages**, **Netlify**, **Vercel**, or a simple hosting server.
    > ⚠️ **Important**: PWA requires **HTTPS** or `localhost`.

4.  **Personalization**:
    *   **Change Colors**: In `style.css` (variables `--bg-color`, `--accent-color`).
    *   **Write Posts**: Edit `updates.json`.
    *   **Add Your Own**: Change `index.html` and the images.

---

## 🤝 License & Contribution

This project is **Open Source** (MIT License).
You can use it freely, modify it, sell it (if you want!), and distribute it.
If you find a bug or have an idea, open an Issue on GitHub!

---

<div align="center">

**Made with ❤️ by Christos Koulaxizis**  
*Privacy • Minimalism • Open Source*

</div>
// === script.js ===

// --- 1. THEME TOGGLE LOGIC (PRESET: DARK MODE) ---
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Λειτουργία για να ορίσουμε το θέμα
function setTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-mode');
        themeToggle.textContent = '🌙'; // Εικονίδιο για να πάει στο Dark
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        themeToggle.textContent = '☀️'; // Εικονίδιο για να πάει στο Light
        localStorage.setItem('theme', 'dark');
    }
}

// Έλεγχος αποθηκευμένου θέματος κατά την εκκίνηση
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    // Αν ο χρήστης έχει επιλέξει Light, το εφαρμόζουμε
    setTheme('light');
} else {
    // Αν δεν υπάρχει αποθηκευμένη επιλογή (NULL) ή είναι 'dark',
    // τότε ορίζουμε το DEFAULT ως DARK.
    setTheme('dark');
}

themeToggle.addEventListener('click', () => {
    const isLight = body.classList.contains('light-mode');
    setTheme(isLight ? 'dark' : 'light');
});

// --- 2. UPDATES LOADING FROM JSON ---
const updatesContainer = document.getElementById('updates-container');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const itemsPerPage = 10;
let allUpdates = [];
let visibleCount = itemsPerPage;

// Αποθηκεύουμε τη θέση του scroll πριν τη φόρτωση για να την επαναφέρουμε αν χρειαστεί
let initialScrollPosition = 0;

async function loadUpdates() {
    try {
        // Αποθηκεύουμε τη θέση του scroll πριν κάνουμε fetch
        initialScrollPosition = window.scrollY;

        const response = await fetch('updates.json');
        if (!response.ok) throw new Error('Δεν βρέθηκε το updates.json');
        const data = await response.json();
        allUpdates = data.updates;
        
        // Ταξινόμηση: Πιο πρόσφατα πρώτα
        allUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        renderUpdates();
        updateButton();

        // Επαναφορά της θέσης του scroll μετά τη φόρτωση (αν χρειαστεί)
        // Αυτό εμποδίζει το "jump" στην κορυφή αν το browser το έκανε αυτόματα
        window.scrollTo(0, initialScrollPosition);

    } catch (error) {
        console.error('Σφάλμα φόρτωσης updates:', error);
        updatesContainer.innerHTML = '<p style="color: var(--secondary-text);">Δεν μπόρεσαν να φορτωθούν οι ενημερώσεις.</p>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
}

// --- 3. MAKE LINKS CLICKABLE (Αυτόματη αναγνώριση URLs) ---
function makeLinksClickable(text) {
    // Regex για να βρει URLs (http, https, www)
    const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/g;
    
    return text.replace(urlRegex, function(url) {
        // Αν το URL δεν έχει protocol, προσθέτουμε http://
        let href = url;
        if (!url.match(/^https?:\/\//i)) {
            href = 'http://' + url;
        }
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: underline; font-weight: bold;">${url}</a>`;
    });
}

// --- 4. SHARE FUNCTIONALITY (ΔΙΟΡΘΩΜΕΝΟ ΓΙΑ ANDROID) ---
async function shareUpdate(content) {
    // Καθαρισμός κειμένου από HTML tags
    const cleanContent = content.replace(/<[^>]*>?/gm, '').trim();
    const hashtag = '#koulaxizis';
    
    // Το κείμενο που θα μοιραστούμε: Κείμενο + Hashtag
    const shareText = `${cleanContent}\n\n${hashtag}`;
    
    const isMobile = window.innerWidth <= 768;

    // 1. Native Share (Κινητά/Tablets - Android/iOS)
    if (navigator.share && isMobile) {
        try {
            await navigator.share({
                title: 'Ενημέρωση από τον Χρήστο Κουλαξίζη',
                text: shareText
            });
            return;
        } catch (err) {
            console.log('Share cancelled');
        }
    }

    // 2. Fallback: Copy to Clipboard (Desktop)
    const desktopText = `${shareText}\n\n${window.location.href}`;
    try {
        await navigator.clipboard.writeText(desktopText);
        showToast('Αντιγράφηκε το κείμενο, το hashtag και ο σύνδεσμος!');
    } catch (err) {
        showToast('Αδυναμία αντιγραφής.');
    }
}

// Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '80px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'var(--accent-color)';
    toast.style.color = 'var(--bg-color)';
    toast.style.padding = '0.8rem 1.5rem';
    toast.style.borderRadius = '6px';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '0.9rem';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    toast.style.animation = 'fadeInOut 2s ease-in-out';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// --- 5. RENDER UPDATES ---
function renderUpdates() {
    // ΜΗΝ κάνουμε innerHTML = '' εδώ αν θέλουμε να προσθέτουμε!
    // Αλλά για την αρχική φόρτωση πρέπει να καθαρίσουμε.
    // Η λογική είναι: Αν είναι η πρώτη φόρτωση, καθαρίζουμε. Αν όχι, προσθέτουμε.
    
    // Για απλότητα και σωστή λειτουργία του "Load More":
    // Θα κρατάμε τα υπάρχοντα στοιχεία και θα προσθέτουμε τα νέα.
    
    const updatesToShow = allUpdates.slice(0, visibleCount);
    
    // Αν είναι η πρώτη φορά (visibleCount == itemsPerPage), καθαρίζουμε το container
    if (visibleCount === itemsPerPage) {
        updatesContainer.innerHTML = '';
    }

    // Βρίσκουμε από πού να ξεκινήσουμε να προσθέτουμε (αν δεν είναι η πρώτη φορά)
    const startIndex = visibleCount - itemsPerPage;
    const updatesToAdd = updatesToShow.slice(startIndex);

    updatesToAdd.forEach(update => {
        const article = document.createElement('article');
        article.className = 'update h-entry';
        const contentText = update.content || '';
        
        // Μετατροπή URLs σε Links
        const formattedContent = makeLinksClickable(contentText);

        article.innerHTML = `
            <time class="date dt-published" datetime="${update.date}">${update.displayDate}</time>
            <div class="content e-content"><p>${formattedContent}</p></div>
        `;

        // --- ΚΟΥΜΠΙ ΔΙΑΜΟΙΡΑΣΜΟΥ ---
        const shareBtn = document.createElement('button');
        shareBtn.title = 'Μοιράσου αυτή την ενημέρωση';
        shareBtn.style.background = 'transparent';
        shareBtn.style.border = '1px solid var(--border-color)';
        shareBtn.style.borderRadius = '6px';
        shareBtn.style.padding = '0.4rem 0.8rem';
        shareBtn.style.color = 'var(--accent-color)';
        shareBtn.style.cursor = 'pointer';
        shareBtn.style.fontFamily = 'inherit';
        shareBtn.style.fontSize = '0.85rem';
        shareBtn.style.display = 'inline-flex';
        shareBtn.style.alignItems = 'center';
        shareBtn.style.gap = '0.4rem';
        shareBtn.style.marginTop = '0.8rem';
        shareBtn.style.transition = 'all 0.3s';
        shareBtn.style.textDecoration = 'none';

        shareBtn.innerHTML = `
            <i class="fa-solid fa-share-nodes" style="font-size: 1rem;"></i>
            <span>Διαμοιρασμός</span>
        `;

        shareBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            shareUpdate(contentText);
        };

        shareBtn.onmouseover = () => {
            shareBtn.style.backgroundColor = 'var(--accent-color)';
            shareBtn.style.color = 'var(--bg-color)';
            shareBtn.style.borderColor = 'var(--accent-color)';
        };
        shareBtn.onmouseout = () => {
            shareBtn.style.backgroundColor = 'transparent';
            shareBtn.style.color = 'var(--accent-color)';
            shareBtn.style.borderColor = 'var(--border-color)';
        };

        article.appendChild(shareBtn);
        updatesContainer.appendChild(article);
    });
}

function updateButton() {
    if (visibleCount >= allUpdates.length) {
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    } else {
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'block';
            const remaining = allUpdates.length - visibleCount;
            loadMoreBtn.textContent = `Προβολή προηγούμενων (${remaining} ακόμη)`;
        }
    }
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        // Αποθηκεύουμε τη θέση του scroll πριν την προσθήκη
        const scrollPos = window.scrollY;
        
        visibleCount += itemsPerPage;
        renderUpdates();
        updateButton();
        
        // Επαναφορά της θέσης του scroll μετά την προσθήκη
        // Αυτό εμποδίζει το "jump" στην κορυφή
        window.scrollTo(0, scrollPos);
    });
}

// Έναρξη φόρτωσης
loadUpdates();

// --- 6. BACK TO TOP BUTTON ---
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        if (backToTopBtn) backToTopBtn.style.display = "block";
    } else {
        if (backToTopBtn) backToTopBtn.style.display = "none";
    }
});

function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
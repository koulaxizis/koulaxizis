// === script.js ===

// --- 1. THEME TOGGLE LOGIC (ΔΙΟΡΘΩΜΕΝΟ) ---
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
    setTheme('light');
} else {
    // Αν δεν υπάρχει αποθηκευμένο, ελέγχουμε το σύστημα (προαιρετικό) ή μένουμε στο dark
    // Αν θες να ακολουθεί το σύστημα:
    // if (window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('light');
    // Αλλιώς μένουμε στο default (dark)
    setTheme('dark');
}

themeToggle.addEventListener('click', () => {
    // Αν είναι light, πάμε dark. Αν είναι dark, πάμε light.
    const isLight = body.classList.contains('light-mode');
    setTheme(isLight ? 'dark' : 'light');
});

// --- 2. UPDATES LOADING FROM JSON ---
const updatesContainer = document.getElementById('updates-container');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const itemsPerPage = 10;
let allUpdates = [];
let visibleCount = itemsPerPage;

async function loadUpdates() {
    try {
        const response = await fetch('updates.json');
        if (!response.ok) throw new Error('Δεν βρέθηκε το updates.json');
        const data = await response.json();
        allUpdates = data.updates;
        allUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));
        renderUpdates();
        updateButton();
    } catch (error) {
        console.error('Σφάλμα:', error);
        updatesContainer.innerHTML = '<p style="color: var(--secondary-text);">Δεν μπόρεσαν να φορτωθούν οι ενημερώσεις.</p>';
        loadMoreBtn.style.display = 'none';
    }
}

// --- 3. MAKE LINKS CLICKABLE ---
function makeLinksClickable(text) {
    const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/g;
    return text.replace(urlRegex, function(url) {
        let href = url;
        if (!url.match(/^https?:\/\//i)) {
            href = 'http://' + url;
        }
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: underline; font-weight: bold;">${url}</a>`;
    });
}

// --- 4. SHARE FUNCTIONALITY ---
async function shareUpdate(content) {
    const cleanContent = content.replace(/<[^>]*>?/gm, '').trim();
    const hashtag = '#koulaxizis';
    const shareText = `${cleanContent}\n\n${hashtag}`;
    const isMobile = window.innerWidth <= 768;

    if (navigator.share && isMobile) {
        try {
            await navigator.share({
                title: 'Ενημέρωση από τον Χρήστο Κουλαξίζη',
                text: shareText,
                url: window.location.href
            });
            return;
        } catch (err) {
            console.log('Share cancelled');
        }
    }

    try {
        await navigator.clipboard.writeText(shareText);
        showToast('Αντιγράφηκε το κείμενο και το hashtag!');
    } catch (err) {
        showToast('Αδυναμία αντιγραφής.');
    }
}

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
    updatesContainer.innerHTML = '';
    const updatesToShow = allUpdates.slice(0, visibleCount);

    updatesToShow.forEach(update => {
        const article = document.createElement('article');
        article.className = 'update h-entry';
        const contentText = update.content || '';
        const formattedContent = makeLinksClickable(contentText);

        article.innerHTML = `
            <time class="date dt-published" datetime="${update.date}">${update.displayDate}</time>
            <div class="content e-content"><p>${formattedContent}</p></div>
        `;

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
        shareBtn.style.textDecoration = 'none'; // Ασφάλεια

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
            shareBtn.style.textDecoration = 'none';
        };
        shareBtn.onmouseout = () => {
            shareBtn.style.backgroundColor = 'transparent';
            shareBtn.style.color = 'var(--accent-color)';
            shareBtn.style.borderColor = 'var(--border-color)';
            shareBtn.style.textDecoration = 'none';
        };

        article.appendChild(shareBtn);
        updatesContainer.appendChild(article);
    });
}

function updateButton() {
    if (visibleCount >= allUpdates.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.textContent = `Προβολή προηγούμενων (${allUpdates.length - visibleCount} ακόμη)`;
    }
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        visibleCount += itemsPerPage;
        renderUpdates();
        updateButton();
    });
}

loadUpdates();

// --- 6. BACK TO TOP ---
const backToTopBtn = document.getElementById("backToTop");
window.addEventListener('scroll', () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
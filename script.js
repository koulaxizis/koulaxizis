// === script.js ===

// --- 1. THEME TOGGLE LOGIC (PRESET: DARK MODE) ---
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function setTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-mode');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    setTheme('light');
} else {
    setTheme('dark');
}

themeToggle.addEventListener('click', () => {
    const isLight = body.classList.contains('light-mode');
    setTheme(isLight ? 'dark' : 'light');
});

// --- 2. UPDATES LOADING FROM JSON ---
const updatesContainer = document.getElementById('updates-container');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const itemsPerPage = 5;
let allUpdates = [];
let visibleCount = itemsPerPage;
let initialScrollPosition = 0;

// Tags & Filter μεταβλητές
let allUniqueTags = new Set();
let currentFilter = 'all';

async function loadUpdates() {
    try {
        initialScrollPosition = window.scrollY;

        const response = await fetch('updates.json');
        if (!response.ok) throw new Error('Δεν βρέθηκε το updates.json');
        const data = await response.json();
        allUpdates = data.updates;
        
        allUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 1. Συλλογή όλων των μοναδικών tags ΠΡΙΝ την εμφάνιση
        allUniqueTags.clear();
        allUpdates.forEach(update => {
            if (update.tags && Array.isArray(update.tags)) {
                update.tags.forEach(tag => allUniqueTags.add(tag));
            }
        });

        // 2. Φτιάξε τη μπάρα φίλτρου ΑΜΕΣΩΣ (πριν το renderUpdates)
        buildTagsFilterBar();

        // 3. Τώρα εμφάνισε τα posts
        renderUpdates();
        updateButton();

        window.scrollTo(0, initialScrollPosition);

    } catch (error) {
        console.error('Σφάλμα φόρτωσης updates:', error);
        updatesContainer.innerHTML = '<p style="color: var(--secondary-text);">Δεν μπόρεσαν να φορτωθούν οι ενημερώσεις.</p>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
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
                text: shareText
            });
            return;
        } catch (err) {
            console.log('Share cancelled');
        }
    }

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

// --- 5. FILTER LOGIC (ΣΤΟΙΧΕΙΩΔΗΣ ΛΥΣΗ) ---

function buildTagsFilterBar() {
    const bar = document.getElementById('tagsFilterBar');
    if (!bar) {
        console.error('Δεν βρέθηκε το στοιχείο #tagsFilterBar');
        return;
    }
    
    // Κρατάμε μόνο το Label και το κουμπί "Όλα" (τα πρώτα 2 παιδιά)
    // Αφαιρούμε όλα τα υπόλοιπα (τα παλιά tags)
    while (bar.children.length > 2) {
        bar.removeChild(bar.lastChild);
    }

    // Ταξινόμηση tags
    const sortedTags = Array.from(allUniqueTags).sort();

    if (sortedTags.length === 0) {
        console.log('Δεν βρέθηκαν tags για φίλτρο.');
        return;
    }

    sortedTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-filter-btn';
        btn.textContent = tag;
        btn.dataset.filter = tag;
        btn.title = `Φίλτρο για: ${tag}`; // Hover title
        
        // Αφαίρεσε παλιούς listeners αν υπάρχουν (για ασφάλεια)
        const newBtn = btn.cloneNode(true);
        bar.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', () => applyFilter(tag));
    });
}

function applyFilter(tag) {
    console.log(`[FILTER] Applying filter: ${tag}`);
    currentFilter = tag;
    
    // Update active button
    document.querySelectorAll('.tag-filter-btn').forEach(btn => {
        if (btn.dataset.filter === tag) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // ✅ ΚРИΤΙΚΗ ΔΙΟΡΘΩΣΗ: Πλήρες Reset
    // 1. Επαναφορά μετρητή
    visibleCount = itemsPerPage;
    
    // 2. Καθαρισμός container
    updatesContainer.innerHTML = '';
    
    // 3. Επαναφόρτωση posts βάσει του νέου φίλτρου
    renderUpdates();
    
    // 4. Ενημέρωση κουμπιού Load More
    updateButton();
}

// --- 6. RENDER UPDATES (ΣΤΟΙΧΕΙΩΔΗΣ ΛΥΣΗ) ---
function renderUpdates() {
    // 1. Φιλτράρισμα των updates βάσει του currentFilter
    let filteredUpdates = allUpdates;
    
    if (currentFilter !== 'all') {
        filteredUpdates = allUpdates.filter(update => {
            if (!update.tags || !Array.isArray(update.tags)) return false;
            return update.tags.includes(currentFilter);
        });
    }

    // 2. Λήψη των items που πρέπει να εμφανιστούν
    const updatesToShow = filteredUpdates.slice(0, visibleCount);
    
    // 3. Προσθήκη των νέων items στο container
    // (Δεν κάνουμε innerHTML = '' εδώ γιατί το κάναμε στο applyFilter)
    
    updatesToShow.forEach(update => {
        // Αν το update έχει ήδη προστεθεί (λόγω scroll), skip
        // Αλλά εδώ απλώς προσθέτουμε τα νέα
        const article = document.createElement('article');
        article.className = 'update h-entry';
        
        // Συλλογή tags
        if (update.tags && Array.isArray(update.tags)) {
            article.dataset.tags = update.tags.join(',');
        }

        const contentText = update.content || '';
        const formattedContent = makeLinksClickable(contentText);

        // Δημιουργία HTML για τα tags
        let tagsHtml = '';
        if (update.tags && update.tags.length > 0) {
            tagsHtml = '<div class="update-tags">' + 
                       update.tags.map(tag => {
                           return `<span class="tag-display" data-filter="${tag}" title="Φίλτρο: ${tag}" style="cursor: pointer;">${tag}</span>`;
                       }).join('') + 
                       '</div>';
        }

        article.innerHTML = `
            <time class="date dt-published" datetime="${update.date}">${update.displayDate}</time>
            <div class="content e-content"><p>${formattedContent}</p></div>
            ${tagsHtml}
        `;

        // Event Listener στα tags μέσα στο update
        const tagDisplays = article.querySelectorAll('.tag-display');
        tagDisplays.forEach(span => {
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                const filterTag = span.getAttribute('data-filter');
                applyFilter(filterTag);
            });
        });

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
    // Υπολογισμός υπόλοιπων με βάση το φίλτρο
    let filteredUpdates = allUpdates;
    if (currentFilter !== 'all') {
        filteredUpdates = allUpdates.filter(update => {
            if (!update.tags || !Array.isArray(update.tags)) return false;
            return update.tags.includes(currentFilter);
        });
    }

    if (visibleCount >= filteredUpdates.length) {
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    } else {
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'block';
            const remaining = filteredUpdates.length - visibleCount;
            loadMoreBtn.textContent = `Προβολή προηγούμενων (${remaining} ακόμη)`;
        }
    }
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        const scrollPos = window.scrollY;
        
        visibleCount += itemsPerPage;
        renderUpdates();
        updateButton();
        
        window.scrollTo(0, scrollPos);
    });
}

// Έναρξη φόρτωσης
loadUpdates();

// --- 7. BACK TO TOP BUTTON ---
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
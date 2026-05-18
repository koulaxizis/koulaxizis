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
        
        // Καθαρισμός unique tags πριν τη φόρτωση
        allUniqueTags.clear();
        
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

// --- 5. FILTER LOGIC (ΔΙΟΡΘΩΜΕΝΗ) ---

function buildTagsFilterBar() {
    const bar = document.getElementById('tagsFilterBar');
    if (!bar) return;
    
    // Βεβαιωνόμαστε ότι κρατάμε μόνο το Label και το κουμπί "Όλα"
    // Αφαιρούμε όλα τα υπόλοιπα παιδιά (τα παλιά tags)
    while (bar.children.length > 2) {
        bar.removeChild(bar.lastChild);
    }

    // Ταξινόμηση tags
    const sortedTags = Array.from(allUniqueTags).sort();

    sortedTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-filter-btn';
        btn.textContent = tag;
        btn.dataset.filter = tag;
        // ✅ ΔΙΟΡΘΩΣΗ: Προσθήκη title για hover
        btn.title = `Φίλτρο για: ${tag}`; 
        
        btn.addEventListener('click', () => applyFilter(tag));
        
        bar.appendChild(btn);
    });
}

function applyFilter(tag) {
    currentFilter = tag;
    
    // Update active button
    document.querySelectorAll('.tag-filter-btn').forEach(btn => {
        if (btn.dataset.filter === tag) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // ✅ ΔΙΟΡΘΩΣΗ: Πλήρες Reset όταν αλλάζει φίλτρο
    // Επαναφέρουμε το visibleCount και καθαρίζουμε το container
    visibleCount = itemsPerPage;
    updatesContainer.innerHTML = '';
    
    // Επαναφόρτωση των updates με το νέο φίλτρο
    renderUpdates();
    updateButton();
}

// --- 6. RENDER UPDATES (ΔΙΟΡΘΩΜΕΝΗ) ---
function renderUpdates() {
    // ✅ ΔΙΟΡΘΩΣΗ: Φιλτράρισμα των updates βάσει του currentFilter
    let filteredUpdates = allUpdates;
    
    if (currentFilter !== 'all') {
        filteredUpdates = allUpdates.filter(update => {
            if (!update.tags || !Array.isArray(update.tags)) return false;
            return update.tags.includes(currentFilter);
        });
    }

    const updatesToShow = filteredUpdates.slice(0, visibleCount);
    
    // Αν είναι η πρώτη φορά (visibleCount == itemsPerPage), καθαρίζουμε το container
    // (Αυτό γίνεται ήδη στο applyFilter, αλλά για ασφάλεια)
    if (visibleCount === itemsPerPage) {
        // Δεν κάνουμε innerHTML = '' εδώ αν θέλουμε να προσθέτουμε, 
        // αλλά στο applyFilter το κάναμε ήδη.
        // Εδώ απλώς προσθέτουμε τα νέα items.
    }

    const startIndex = visibleCount - itemsPerPage;
    const updatesToAdd = updatesToShow.slice(startIndex);

    updatesToAdd.forEach(update => {
        const article = document.createElement('article');
        article.className = 'update h-entry';
        
        // Συλλογή tags για το φίλτρο
        if (update.tags && Array.isArray(update.tags)) {
            // Αποθήκευση tags στο dataset
            article.dataset.tags = update.tags.join(',');
        }

        const contentText = update.content || '';
        const formattedContent = makeLinksClickable(contentText);

        // Δημιουργία HTML για τα tags
        let tagsHtml = '';
        if (update.tags && update.tags.length > 0) {
            tagsHtml = '<div class="update-tags">' + 
                       update.tags.map(tag => {
                           // ✅ ΔΙΟΡΘΩΣΗ: Κάνουμε τα tags clickable και προσθέτουμε title
                           return `<span class="tag-display" data-filter="${tag}" title="Φίλτρο: ${tag}" style="cursor: pointer;">${tag}</span>`;
                       }).join('') + 
                       '</div>';
        }

        article.innerHTML = `
            <time class="date dt-published" datetime="${update.date}">${update.displayDate}</time>
            <div class="content e-content"><p>${formattedContent}</p></div>
            ${tagsHtml}
        `;

        // ✅ ΔΙΟΡΘΩΣΗ: Προσθήκη Event Listener στα tags μέσα στο update
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

    // Αν είναι η πρώτη φόρτωση και υπάρχουν tags, χτίσε τη μπάρα φίλτρου
    // ✅ ΔΙΟΡΘΩΣΗ: Χτίζουμε τη μπάρα μόνο αν δεν έχει χτιστεί ήδη (για να μην σβήνουμε τα φίλτρα)
    if (visibleCount === itemsPerPage && allUniqueTags.size > 0) {
        // Έλεγχος αν η μπάρα έχει ήδη tags (πέρα από το "Όλα")
        const bar = document.getElementById('tagsFilterBar');
        if (bar && bar.children.length === 2) {
            buildTagsFilterBar();
        }
    }
}

function updateButton() {
    // ✅ ΔΙΟΡΘΩΣΗ: Υπολογισμός υπόλοιπων με βάση το φίλτρο
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
        renderUpdates(); // Αυτό θα φορτώσει τα επόμενα items βάσει του φίλτρου
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
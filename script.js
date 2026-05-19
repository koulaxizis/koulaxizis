// === script.js ===

// --- 0. CLEAN URL AFTER HARD REFRESH ---
if (window.location.search.includes('nocache=')) {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
}

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

let allUniqueTags = [];
let currentFilter = 'all';
let filterBarBuilt = false;

// --- SKELETON LOADING ---
function showSkeletons() {
    updatesContainer.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-card';
        skeleton.setAttribute('aria-hidden', 'true');
        skeleton.innerHTML = `
            <div class="skeleton-line date"></div>
            <div class="skeleton-line content-1"></div>
            <div class="skeleton-line content-2"></div>
            <div class="skeleton-line tags"></div>
        `;
        updatesContainer.appendChild(skeleton);
    }
}

async function loadUpdates() {
    // --- ΕΜΦΑΝΙΣΗ SKELETONS ---
    showSkeletons();

    try {
        initialScrollPosition = window.scrollY;

        const timestamp = new Date().getTime();
        const separator = 'updates.json'.includes('?') ? '&' : '?';
        const response = await fetch('updates.json' + separator + 't=' + timestamp);
        
        if (!response.ok) throw new Error('Δεν βρέθηκε το updates.json');
        const data = await response.json();
        allUpdates = data.updates;
        
        allUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const tagSet = new Set();
        allUpdates.forEach(update => {
            if (update.tags && Array.isArray(update.tags)) {
                update.tags.forEach(tag => tagSet.add(tag));
            }
        });
        allUniqueTags = Array.from(tagSet).sort();

        updatesContainer.innerHTML = '';
        visibleCount = itemsPerPage;
        
        buildTagsFilterBar();
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

// --- 4.5 SEARCH LOGIC ---
const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
let searchQuery = '';

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        if (searchClearBtn) {
            searchClearBtn.style.display = searchQuery ? 'flex' : 'none';
        }
        applySearchAndFilter();
    });
}

if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
        searchQuery = '';
        searchInput.value = '';
        searchClearBtn.style.display = 'none';
        searchInput.focus();
        visibleCount = itemsPerPage;
        updatesContainer.innerHTML = '';
        renderUpdates();
        updateButton();
    });
}

function applySearchAndFilter() {
    if (searchQuery) {
        let filteredResults = allUpdates;
        
        if (currentFilter !== 'all') {
            filteredResults = filteredResults.filter(update => {
                if (!update.tags || !Array.isArray(update.tags)) return false;
                return update.tags.includes(currentFilter);
            });
        }
        
        filteredResults = filteredResults.filter(update => {
            const contentText = (update.content || '').toLowerCase();
            const tagString = (update.tags || []).join(' ');
            return contentText.includes(searchQuery) || tagString.includes(searchQuery);
        });
        
        updatesContainer.innerHTML = '';
        
        if (filteredResults.length === 0) {
            const msg = document.createElement('p');
            msg.className = 'no-results';
            msg.textContent = `Δεν βρέθηκαν αποτελέσματα για "${searchQuery}"`;
            updatesContainer.appendChild(msg);
        } else {
            filteredResults.forEach(update => {
                const article = createArticleElement(update);
                updatesContainer.appendChild(article);
            });
        }
        
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        
    } else {
        visibleCount = itemsPerPage;
        updatesContainer.innerHTML = '';
        renderUpdates();
        updateButton();
    }
}

// --- 5. FILTER LOGIC ---

function buildTagsFilterBar() {
    const bar = document.getElementById('tagsFilterBar');
    if (!bar) return;
    
    while (bar.children.length > 2) {
        bar.removeChild(bar.lastChild);
    }

    allUniqueTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-filter-btn';
        btn.textContent = tag;
        btn.dataset.filter = tag;
        btn.addEventListener('click', () => applyFilter(tag));
        bar.appendChild(btn);
    });

    const filterAllBtn = document.getElementById('filterAllBtn');
    if (filterAllBtn) {
        filterAllBtn.addEventListener('click', () => applyFilter('all'));
    }
    
    filterBarBuilt = true;
}

function applyFilter(tag) {
    currentFilter = tag;
    
    document.querySelectorAll('.tag-filter-btn').forEach(btn => {
        if (btn.dataset.filter === tag) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    visibleCount = itemsPerPage;
    updatesContainer.innerHTML = '';
    renderUpdates();
    updateButton();
    
    applySearchAndFilter();
}

// --- 5.5 CREATE ARTICLE ELEMENT ---
function createArticleElement(update) {
    const article = document.createElement('article');
    article.className = 'update h-entry';
    
    if (update.tags && Array.isArray(update.tags)) {
        article.dataset.tags = update.tags.join(',');
    }

    const contentText = update.content || '';
    const formattedContent = makeLinksClickable(contentText);

    // Tags HTML
    let tagsHtml = '';
    if (update.tags && update.tags.length > 0) {
        tagsHtml = '<div class="update-tags">' + 
                   update.tags.map(tag => {
                       return `<span class="tag-display" data-filter="${tag}" style="cursor: pointer;">${tag}</span>`;
                   }).join('') + 
                   '</div>';
    }

    // Bottom row: tags αριστερά, share δεξιά (με margin-left: auto στο CSS)
    const bottomRowHtml = `
        <div class="update-bottom-row">
            ${tagsHtml}
            <button class="share-update-btn" aria-label="Κοινοποίηση ενημέρωσης" title="Κοινοποίηση">
                <i class="fa-solid fa-share-nodes"></i>
            </button>
        </div>
    `;

    article.innerHTML = `
        <time class="date dt-published" datetime="${update.date}">${update.displayDate}</time>
        <div class="content e-content"><p>${formattedContent}</p></div>
        ${bottomRowHtml}
    `;

    article.querySelectorAll('.tag-display').forEach(span => {
        span.addEventListener('click', (e) => {
            e.stopPropagation();
            applyFilter(span.getAttribute('data-filter'));
        });
    });

    // Share Button Logic
    const shareBtn = article.querySelector('.share-update-btn');
    shareBtn.addEventListener('click', async (e) => {
        e.stopPropagation();

        // Έλεγχος: Είναι Desktop;
        const isDesktop = window.innerWidth > 900 || !('ontouchstart' in window);

        if (isDesktop) {
            // --- DESKTOP: Αντιγραφή ΠΕΡΙΕΧΟΜΕΝΟΥ στο clipboard ---
            try {
                await navigator.clipboard.writeText(update.content);
                shareBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                shareBtn.title = 'Αντιγράφηκε!';
                shareBtn.classList.add('copied');
                setTimeout(() => {
                    shareBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i>';
                    shareBtn.title = 'Κοινοποίηση';
                    shareBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Clipboard error:', err);
                alert('Αδυναμία αντιγραφής. Παρακαλώ αντιγράψτε χειροκίνητα το κείμενο.');
            }
        } else {
            // --- MOBILE: Μόνο το περιεχόμενο, χωρίς τίτλο ή URL ---
            const shareData = {
                text: update.content
            };

            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error('Share error:', err);
                    }
                }
            } else {
                // Fallback για κινητά χωρίς Web Share API
                try {
                    await navigator.clipboard.writeText(update.content);
                    shareBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                    shareBtn.title = 'Αντιγράφηκε!';
                    shareBtn.classList.add('copied');
                    setTimeout(() => {
                        shareBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i>';
                        shareBtn.title = 'Κοινοποίηση';
                        shareBtn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Clipboard error:', err);
                    alert('Αδυναμία αντιγραφής.');
                }
            }
        }
    });

    return article;
}

// --- 6. RENDER UPDATES ---
function renderUpdates() {
    let filteredUpdates = allUpdates;
    
    if (currentFilter !== 'all') {
        filteredUpdates = allUpdates.filter(update => {
            if (!update.tags || !Array.isArray(update.tags)) return false;
            return update.tags.includes(currentFilter);
        });
    }

    const updatesToShow = filteredUpdates.slice(0, visibleCount);
    
    const startIndex = Math.max(0, visibleCount - itemsPerPage);
    const updatesToAdd = updatesToShow.slice(startIndex);

    updatesToAdd.forEach(update => {
        const article = createArticleElement(update);
        updatesContainer.appendChild(article);
    });
}

function updateButton() {
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

// --- 8. AVATAR HARD REFRESH ---
function setupAvatarRefresh() {
    const avatarImg = document.getElementById('avatarImg');
    if (avatarImg) {
        const newAvatar = avatarImg.cloneNode(true);
        avatarImg.parentNode.replaceChild(newAvatar, avatarImg);
        
        newAvatar.addEventListener('click', async () => {
            console.log('🔄 Εκκίνηση Hard Refresh...');

            if ('caches' in window) {
                try {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                    console.log('✅ Όλα τα caches διαγράφηκαν');
                } catch (err) {
                    console.warn('⚠️ Αδυναμία καθαρισμού cache:', err);
                }
            }

            if ('serviceWorker' in navigator) {
                try {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    await Promise.all(registrations.map(reg => reg.unregister()));
                    console.log('✅ Service Worker unregister');
                } catch (err) {
                    console.warn('⚠️ Αδυναμία unregister SW:', err);
                }
            }

            const timestamp = new Date().getTime();
            window.location.href = window.location.origin + window.location.pathname + '?nocache=' + timestamp;
        });
    }
}

// --- 9. NEWSLETTER FORM (FORMSPREE AJAX) ---
(function() {
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    const submitBtn = document.getElementById('newsletter-submit');
    const successMsg = document.getElementById('newsletter-success');
    const errorMsg = document.getElementById('newsletter-error');

    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) return;

        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Αποστολή...';

        try {
            const response = await fetch('https://formspree.io/f/xqejajzv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            if (response.ok) {
                successMsg.style.display = 'block';
                form.reset();
            } else {
                errorMsg.style.display = 'block';
            }
        } catch (err) {
            errorMsg.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Εγγραφή';
        }
    });
})();

// --- 10. PWA INSTALL BUTTON ---
(function() {
    let deferredPrompt = null;
    const installContainer = document.getElementById('pwa-install-container');
    const installBtn = document.getElementById('pwa-install-btn');

    if (!installContainer || !installBtn) return;

    // Ακούμε το beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        // Αποτρέπουμε το default browser prompt
        e.preventDefault();
        // Αποθηκεύουμε το event για να το εκκινήσουμε αργότερα
        deferredPrompt = e;
        
        // Εμφανίζουμε το κουμπί
        installContainer.style.display = 'block';
        console.log('✅ PWA Install button shown');
    });

    // Κλικ στο κουμπί εγκατάστασης
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) {
            console.warn('⚠️ No install prompt available');
            return;
        }

        // Εμφανίζουμε το native install prompt
        deferredPrompt.prompt();
        
        // Περιμένουμε την απάντηση του χρήστη
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`👤 User choice: ${outcome}`);

        // Κρυβουμε το κουμπί μετά την επιλογή
        installContainer.style.display = 'none';
        deferredPrompt = null;
    });

    // Αν ο χρήστης εγκατέστησε ήδη (αφού το service worker claim), κρύβουμε το κουμπί
    window.addEventListener('appinstalled', () => {
        console.log('🎉 PWA installed successfully');
        installContainer.style.display = 'none';
        deferredPrompt = null;
    });

    // Κρυβουμε το κουμπί αν ο χρήστης κλείσει τη σελίδα (προαιρετικό)
    // Αν θέλεις να μην εμφανίζεται ξανά, μπορείς να αποθηκεύσεις στο localStorage
    // localStorage.setItem('pwa_install_shown', 'true');
})();

document.addEventListener('DOMContentLoaded', setupAvatarRefresh);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(setupAvatarRefresh, 0);
}
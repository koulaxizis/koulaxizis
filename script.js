// ========================================
// === PERFORMANCE & SECURITY INIT ===
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Clean URL after hard refresh
    if (window.location.search.includes('nocache=')) {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
});

// ========================================
// === THEME TOGGLE LOGIC ===
// ========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function setTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-mode');
        if (themeToggle) themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
    // Apply preference to meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if(metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'light' ? '#f4f4f9' : '#bb86fc');
    }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    setTheme('light');
} else {
    // Respect system preference initially if no saved preference
    if (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = body.classList.contains('light-mode');
        setTheme(isLight ? 'dark' : 'light');
    });
}

// ========================================
// === UPDATES LOADING FROM JSON ===
// ========================================
const updatesContainer = document.getElementById('updates-container');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const itemsPerPage = 5;
let allUpdates = [];
let visibleCount = itemsPerPage;
let allUniqueTags = [];
let currentFilter = 'all';
let filterBarBuilt = false;

function showSkeletons() {
    if (!updatesContainer) return;
    updatesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-card';
        skeleton.setAttribute('aria-hidden', 'true');
        skeleton.innerHTML = '<div class="skeleton-line date"></div><div class="skeleton-line content-1"></div><div class="skeleton-line content-2"></div><div class="skeleton-line tags"></div>';
        updatesContainer.appendChild(skeleton);
    }
}

async function loadUpdates() {
    if (!updatesContainer) return;
    showSkeletons();
    try {
        const updatesSidebar = document.querySelector('.updates-sidebar');
        if (updatesSidebar && visibleCount === itemsPerPage) {
            updatesSidebar.scrollTop = 0;
        }
        
        const timestamp = new Date().getTime();
        const response = await fetch('updates.json?t=' + timestamp, { cache: 'no-cache' });
        
        if (!response.ok) throw new Error('Δεν βρέθηκε το updates.json');
        const data = await response.json();
        allUpdates = data.updates || [];
        
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
        
    } catch (error) {
        console.error('Σφάλμα φόρτωσης updates:', error);
        if (updatesContainer) updatesContainer.innerHTML = '<p style="color: var(--secondary-text);">Δεν μπόρεσαν να φορτωθούν οι ενημερώσεις.</p>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
}

// ========================================
// === RELATIVE TIMESTAMPS ===
// ========================================
function getRelativeTime(isoDate) {
    if (!isoDate) return '';
    const now = new Date();
    const then = new Date(isoDate);
    const diffMs = now - then;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 7) {
        const months = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μάι', 'Ιούν', 'Ιούλ', 'Αύγ', 'Σεπτ', 'Οκτ', 'Νοέμ', 'Δεκ'];
        const day = String(then.getDate()).padStart(2, '0');
        const month = months[then.getMonth()];
        const year = then.getFullYear();
        const hours = String(then.getHours()).padStart(2, '0');
        const mins = String(then.getMinutes()).padStart(2, '0');
        return day + ' ' + month + ' ' + year + ', ' + hours + ':' + mins;
    }

    if (diffSeconds < 60) return 'πριν από ' + diffSeconds + ' δευτ.';
    if (diffMinutes < 60) return 'πριν από ' + diffMinutes + ' λεπτά';
    if (diffHours < 24) return 'πριν από ' + diffHours + ' ώρες' + (diffHours > 1 ? '' : '');
    if (diffDays === 1) return 'χθες';
    return 'πριν από ' + diffDays + ' μέρες';
}

// ========================================
// === MAKE LINKS CLICKABLE ===
// ========================================
function makeLinksClickable(text) {
    if (!text) return '';
    const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/g;
    return text.replace(urlRegex, function(url) {
        let href = url;
        if (!url.match(/^https?:\/\//i)) href = 'http://' + url;
        const safeHref = href.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: underline; font-weight: bold;">${url}</a>`;
    });
}

// ========================================
// === SEARCH LOGIC ===
// ========================================
const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
let searchQuery = '';

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        if (searchClearBtn) searchClearBtn.style.display = searchQuery ? 'flex' : 'none';
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
        if (updatesContainer) updatesContainer.innerHTML = '';
        renderUpdates();
        updateButton();
    });
}

function applySearchAndFilter() {
    if (!updatesContainer) return;
    
    let filteredResults = allUpdates;
    
    if (currentFilter !== 'all') {
        filteredResults = filteredResults.filter(update => {
            if (!update.tags || !Array.isArray(update.tags)) return false;
            return update.tags.includes(currentFilter);
        });
    }
    
    if (searchQuery) {
        filteredResults = filteredResults.filter(update => {
            const contentText = (update.content || '').toLowerCase();
            const tagString = (update.tags || []).join(' ');
            return contentText.includes(searchQuery) || tagString.includes(searchQuery);
        });
    }
    
    updatesContainer.innerHTML = '';
    
    if (filteredResults.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'no-results';
        msg.textContent = 'Δεν βρέθηκαν αποτελέσματα για "' + searchQuery + '"';
        updatesContainer.appendChild(msg);
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    } else {
        filteredResults.forEach(update => {
            updatesContainer.appendChild(createArticleElement(update));
        });
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
}

// ========================================
// === FILTER LOGIC ===
// ========================================
function buildTagsFilterBar() {
    const bar = document.getElementById('tagsFilterBar');
    if (!bar || filterBarBuilt) return;
    
    while (bar.children.length > 2) bar.removeChild(bar.lastChild);
    
    allUniqueTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-filter-btn';
        btn.textContent = tag;
        btn.dataset.filter = tag;
        btn.setAttribute('aria-label', `Φιλτράρισμα με ετικέτα ${tag}`);
        btn.addEventListener('click', () => applyFilter(tag));
        bar.appendChild(btn);
    });
    
    const filterAllBtn = document.getElementById('filterAllBtn');
    if (filterAllBtn) filterAllBtn.addEventListener('click', () => applyFilter('all'));
    
    filterBarBuilt = true;
}

function applyFilter(tag) {
    currentFilter = tag;
    
    document.querySelectorAll('.tag-filter-btn').forEach(btn => {
        if (btn.dataset.filter === tag) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    
    visibleCount = itemsPerPage;
    if (updatesContainer) updatesContainer.innerHTML = '';
    renderUpdates();
    updateButton();
}

// ========================================
// === CREATE ARTICLE ELEMENT ===
// ========================================
function createArticleElement(update) {
    const article = document.createElement('article');
    article.className = 'update h-entry';
    
    if (update.tags && Array.isArray(update.tags)) {
        article.dataset.tags = update.tags.join(',');
    }

    const contentText = update.content || '';
    const formattedContent = makeLinksClickable(contentText);

    let tagsHtml = '';
    if (update.tags && update.tags.length > 0) {
        tagsHtml = '<div class="update-tags">' + update.tags.map(tag => {
            return `<span class="tag-display" data-filter="${tag}" style="cursor: pointer;" aria-label="Φιλτράρισμα με ετικέτα ${tag}">${tag}</span>`;
        }).join('') + '</div>';
    }

    const relativeTime = getRelativeTime(update.parsedDate || update.date);
    article.innerHTML = `<time class="date dt-published" datetime="${update.date}">${relativeTime}</time>` +
        `<div class="content e-content"><p>${formattedContent}</p></div>` +
        `<div class="update-bottom-row">${tagsHtml}<button class="share-update-btn" aria-label="Κοινοποίηση ενημέρωσης" title="Κοινοποίηση"><i class="fa-solid fa-share-nodes"></i></button></div>`;

    article.querySelectorAll('.tag-display').forEach(span => {
        span.addEventListener('click', (e) => {
            e.stopPropagation();
            applyFilter(span.getAttribute('data-filter'));
        });
    });

    const shareBtn = article.querySelector('.share-update-btn');
    shareBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const isDesktop = window.innerWidth > 900 || !('ontouchstart' in window);
        
        if (isDesktop) {
            try {
                await navigator.clipboard.writeText(update.content);
                shareBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                shareBtn.classList.add('copied');
                setTimeout(() => { 
                    shareBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i>'; 
                    shareBtn.classList.remove('copied'); 
                }, 2000);
            } catch (err) {
                alert('Αδυναμία αντιγραφής.');
            }
        } else {
            const shareData = { text: update.content };
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    if (err.name !== 'AbortError') console.error('Share error:', err);
                }
            } else {
                try {
                    await navigator.clipboard.writeText(update.content);
                    shareBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                    shareBtn.classList.add('copied');
                    setTimeout(() => { 
                        shareBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i>'; 
                        shareBtn.classList.remove('copied'); 
                    }, 2000);
                } catch (err) {
                    alert('Αδυναμία αντιγραφής.');
                }
            }
        }
    });
    
    return article;
}

// ========================================
// === RENDER UPDATES ===
// ========================================
function renderUpdates() {
    if (!updatesContainer) return;
    
    let filteredUpdates = allUpdates;
    if (currentFilter !== 'all') {
        filteredUpdates = allUpdates.filter(update => {
            if (!update.tags || !Array.isArray(update.tags)) return false;
            return update.tags.includes(currentFilter);
        });
    }
    
    const updatesToShow = filteredUpdates.slice(0, visibleCount);
    const startIndex = Math.max(0, visibleCount - itemsPerPage);
    updatesToShow.slice(startIndex).forEach(update => {
        updatesContainer.appendChild(createArticleElement(update));
    });
}

function updateButton() {
    if (!loadMoreBtn) return;
    
    let filteredUpdates = allUpdates;
    if (currentFilter !== 'all') {
        filteredUpdates = allUpdates.filter(update => {
            if (!update.tags || !Array.isArray(update.tags)) return false;
            return update.tags.includes(currentFilter);
        });
    }
    
    if (visibleCount >= filteredUpdates.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.textContent = `Προβολή προηγούμενων (${filteredUpdates.length - visibleCount} ακόμη)`;
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

// Init loading on desktop/mobile index only
if (updatesContainer) loadUpdates();

// ========================================
// === 404 PAGE: LATEST UPDATE FETCH ===
// ========================================
const latestUpdateContainer = document.getElementById('latestUpdate');
if (latestUpdateContainer) {
    (async function() {
        const dateEl = document.getElementById('updateDate');
        const contentEl = document.getElementById('updateContent');
        
        try {
            const response = await fetch('/updates.json?t=' + new Date().getTime(), { cache: 'no-cache' });
            if (!response.ok) throw new Error('Not available');
            
            const data = await response.json();
            const items = data.updates || [];
            
            if (items.length > 0) {
                const firstItem = items[0];
                const pubDate = new Date(firstItem.date);
                
                if(dateEl) dateEl.textContent = pubDate.toLocaleDateString('el-GR', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });
                
                if(contentEl) contentEl.textContent = firstItem.content.substring(0, 160) + (firstItem.content.length >= 160 ? '...' : '');
                latestUpdateContainer.classList.remove('loading');
            } else {
                throw new Error('No items found');
            }
        } catch (error) {
            if(dateEl) dateEl.textContent = '';
            if(contentEl) contentEl.innerHTML = '<span class="error-msg">Αδυναμία φόρτωσης της τελευταίας ενημέρωσης.</span>';
            if(latestUpdateContainer) latestUpdateContainer.classList.remove('loading');
        }
    })();
}

// ========================================
// === BACK TO TOP BUTTON ===
// ========================================
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
    window.addEventListener('scroll', function() {
        backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// === AVATAR HARD REFRESH ===
// ========================================
function setupAvatarRefresh() {
    const avatarImg = document.getElementById('avatarImg');
    if (!avatarImg) return;
    
    const newAvatar = avatarImg.cloneNode(true);
    avatarImg.parentNode.replaceChild(newAvatar, avatarImg);
    
    newAvatar.addEventListener('click', async () => {
        if ('caches' in window) {
            try {
                const names = await caches.keys();
                await Promise.all(names.map(n => caches.delete(n)));
            } catch (e) {}
        }
        
        if ('serviceWorker' in navigator) {
            try {
                const regs = await navigator.serviceWorker.getRegistrations();
                await Promise.all(regs.map(r => r.unregister()));
            } catch (e) {}
        }
        
        window.location.href = window.location.origin + window.location.pathname + '?nocache=' + new Date().getTime();
    });
}

document.addEventListener('DOMContentLoaded', setupAvatarRefresh);

// ========================================
// === PWA INSTALL BUTTON (FOOTER INTEGRATION) ===
// ========================================
(function() {
    let deferredPrompt = null;
    const installBtn = document.getElementById('pwa-install-btn-footer');
    const oldContainer = document.getElementById('pwa-install-container');
    
    if (!installBtn) return;
    
    if (oldContainer) oldContainer.style.display = 'none';
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'inline-flex';
    });
    
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            installBtn.style.display = 'none';
            deferredPrompt = null;
        } catch (err) {
            console.error('PWA install failed:', err);
        }
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        installBtn.style.display = 'none';
        deferredPrompt = null;
    });
})();

// ========================================
// === NAVIGATION HAMBURGER ===
// ========================================
const hamburgerBtn = document.querySelector('.hamburger-btn');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburgerBtn && mobileMenu) {
    mobileMenu.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.textContent = '☰';
    
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileMenu.classList.contains('active');
        
        if (isOpen) {
            mobileMenu.classList.remove('active');
            hamburgerBtn.textContent = '☰';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        } else {
            mobileMenu.classList.add('active');
            hamburgerBtn.textContent = '✕';
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburgerBtn.textContent = '☰';
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburgerBtn.textContent = '☰';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// ========================================
// === FORCED SMOOTH SCROLL FALLBACK ===
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.getElementById(targetId.substring(1));
            
            if (targetElement) {
                e.preventDefault();
                
                try {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    
                    history.pushState(null, null, targetId);
                } catch (err) {
                    console.error("Smooth scroll failed, using fallback", err);
                    const start = window.pageYOffset;
                    const end = targetElement.offsetTop;
                    const duration = 700;
                    let startTime = null;

                    function step(timestamp) {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;
                        const percentage = Math.min(progress / duration, 1);
                        const ease = 1 - Math.pow(1 - percentage, 3);
                        window.scrollTo(0, start + (end - start) * ease);
                        
                        if (progress < duration) {
                            window.requestAnimationFrame(step);
                        } else {
                            history.pushState(null, null, targetId);
                        }
                    }
                    
                    window.requestAnimationFrame(step);
                }
            }
        });
    });
});

// ========================================
// === PROGRESSIVE ENHANCEMENT & FEATURES ===
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const features = {
        serviceWorker: 'serviceWorker' in navigator,
        pushNotification: 'PushManager' in window,
        shareAPI: 'share' in navigator,
        offline: navigator.onLine
    };
    console.table(features);
});
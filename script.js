// ========================================
// === STORIES LOGIC (NEW) ===
// ========================================
(function() {
    'use strict';

    const STORY_IMAGE_DURATION = 15000; // 15 seconds for images
    const GITHUB_USER = 'koulaxizis';
    const REPO_NAME = 'koulaxizis';
    const BRANCH = 'main';

    let stories = [];
    let currentIndex = 0;
    let storyTimer = null;
    let progressBarInterval = null;
    let storyViewer = null;
    let storyMediaContainer = null;
    let storyImage = null;
    let storyVideo = null;
    let storyCloseBtn = null;
    let storyPrevBtn = null;
    let storyNextBtn = null;
    let storyProgressBars = null;

    let touchStartX = 0;
    let touchEndX = 0;

    function initStories() {
        storyViewer = document.getElementById('storyViewer');
        storyMediaContainer = document.getElementById('storyMediaContainer');
        storyImage = document.getElementById('storyImage');
        storyVideo = document.getElementById('storyVideo');
        storyCloseBtn = document.getElementById('storyCloseBtn');
        storyPrevBtn = document.getElementById('storyPrevBtn');
        storyNextBtn = document.getElementById('storyNextBtn');
        storyProgressBars = document.getElementById('storyProgressBars');

        if (!storyViewer || !storyMediaContainer) {
            console.log('ℹ️ Story viewer elements not found, skipping');
            return;
        }

        fetchActiveStories();
        setupStoryEvents();
        detectSwipe();
    }

    async function fetchActiveStories() {
        try {
            const timestamp = Date.now();
            const response = await fetch('stories.json?t=' + timestamp, { cache: 'no-cache' });
            
            if (!response.ok) {
                console.log('ℹ️ No stories.json found');
                return;
            }

            const data = await response.json();
            const allStories = data.stories || [];
            const now = Date.now();

            // Filter out expired stories
            stories = allStories.filter(s => {
                return s.expires && s.expires > now;
            });

            renderStoryRing();

        } catch (error) {
            console.log('ℹ️ Failed to fetch stories:', error.message);
        }
    }

    function renderStoryRing() {
        const ring = document.getElementById('storyRing');
        if (!ring) return;

        if (stories.length > 0) {
            ring.classList.add('active');
            ring.setAttribute('aria-label', stories.length + ' διαθέσιμες stories. Κλικ για προβολή.');
        } else {
            ring.classList.remove('active');
        }
    }

    function setupStoryEvents() {
        if (storyCloseBtn) {
            storyCloseBtn.addEventListener('click', closeStoryViewer);
        }

        if (storyPrevBtn) {
            storyPrevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevStory();
            });
        }

        if (storyNextBtn) {
            storyNextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextStory();
            });
        }

        if (storyViewer) {
            storyViewer.addEventListener('click', handleViewerClick);
            
            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && storyViewer.style.display === 'flex') {
                    closeStoryViewer();
                }
            });

            // Prevent video clicks from closing viewer
            if (storyVideo) {
                storyVideo.addEventListener('click', (e) => e.stopPropagation());
            }
        }

        // Avatar click opens story viewer
        const avatarImg = document.getElementById('avatarImg');
        if (avatarImg) {
            avatarImg.addEventListener('click', () => {
                if (stories.length > 0) {
                    openStoryViewer();
                }
            });
        }
    }

    function detectSwipe() {
        if (!storyViewer) return;

        storyViewer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        storyViewer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        }, { passive: true });
    }

    function handleSwipeGesture() {
        const threshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left → next
                nextStory();
            } else {
                // Swipe right → prev
                prevStory();
            }
        }
    }

    function handleViewerClick(e) {
        const rect = storyViewer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        if (x < width * 0.3) {
            prevStory();
        } else if (x > width * 0.7) {
            nextStory();
        }
    }

    function openStoryViewer() {
        if (stories.length === 0) return;

        currentIndex = 0;
        storyViewer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        showStory(currentIndex);
    }

    function closeStoryViewer() {
        storyViewer.style.display = 'none';
        document.body.style.overflow = '';
        stopStoryTimer();
        stopProgressBarAnimation();
        
        if (storyVideo) {
            storyVideo.pause();
            storyVideo.src = '';
        }
    }

    function showStory(index) {
        if (index < 0 || index >= stories.length) {
            closeStoryViewer();
            return;
        }

        currentIndex = index;
        const story = stories[index];

        // Update progress bars
        renderProgressBars();

        // Clear previous content
        if (storyImage) {
            storyImage.style.display = 'none';
            storyImage.src = '';
        }
        if (storyVideo) {
            storyVideo.style.display = 'none';
            storyVideo.pause();
            storyVideo.src = '';
			        }

        // Load media
        if (story.mediaType === 'image') {
            if (storyImage) {
                storyImage.src = story.src;
                storyImage.style.display = 'block';
                if (storyVideo) storyVideo.style.display = 'none';
            }
        } else if (story.mediaType === 'video') {
            if (storyVideo) {
                storyVideo.src = story.src;
                storyVideo.style.display = 'block';
                if (storyImage) storyImage.style.display = 'none';
                
                // Play video with sound
                storyVideo.play().catch(e => console.log('Video autoplay blocked:', e));
                
                // Wait for video end before moving to next
                storyVideo.onended = () => {
                    nextStory();
                };
            }
        }

        // Start timer for images (videos play naturally)
        if (story.mediaType === 'image') {
            const duration = story.duration || STORY_IMAGE_DURATION;
            startStoryTimer(duration);
        }
    }

    function startStoryTimer(duration) {
        stopStoryTimer();
        startProgressBarAnimation(duration);
        
        storyTimer = setTimeout(() => {
            nextStory();
        }, duration);
    }

    function stopStoryTimer() {
        if (storyTimer) {
            clearTimeout(storyTimer);
            storyTimer = null;
        }
    }

    function startProgressBarAnimation(totalDuration) {
        stopProgressBarAnimation();
        
        const bars = storyProgressBars.querySelectorAll('.progress-bar');
        if (!bars.length) return;

        let elapsed = 0;
        const interval = 50; // Update every 50ms
        
        progressBarInterval = setInterval(() => {
            elapsed += interval;
            const progress = Math.min(elapsed / totalDuration, 1);
            
            // Update current bar
            if (bars[currentIndex]) {
                bars[currentIndex].style.width = (progress * 100) + '%';
            }
            
            // Mark previous bars as complete
            for (let i = 0; i < currentIndex; i++) {
                if (bars[i]) bars[i].style.width = '100%';
            }
            
            // Future bars stay at 0
            for (let i = currentIndex + 1; i < bars.length; i++) {
                if (bars[i]) bars[i].style.width = '0%';
            }
            
            if (progress >= 1) {
                stopProgressBarAnimation();
            }
        }, interval);
    }

    function stopProgressBarAnimation() {
        if (progressBarInterval) {
            clearInterval(progressBarInterval);
            progressBarInterval = null;
        }
    }

    function renderProgressBars() {
        if (!storyProgressBars) return;
        
        storyProgressBars.innerHTML = '';
        
        stories.forEach((_, idx) => {
            const bar = document.createElement('div');
            bar.className = 'progress-bar';
            bar.style.width = idx < currentIndex ? '100%' : '0%';
            bar.setAttribute('aria-label', 'Story ' + (idx + 1) + ' of ' + stories.length);
            storyProgressBars.appendChild(bar);
        });
    }

    function nextStory() {
        if (currentIndex < stories.length - 1) {
            showStory(currentIndex + 1);
        } else {
            // Last story - close after delay
            closeStoryViewer();
        }
    }

    function prevStory() {
        if (currentIndex > 0) {
            showStory(currentIndex - 1);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStories);
    } else {
        initStories();
    }

})();

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
        // ✅ Reset scroll position at top of sidebar on initial load
        const updatesSidebar = document.querySelector('.updates-sidebar');
        if (updatesSidebar && visibleCount === itemsPerPage) {
            updatesSidebar.scrollTop = 0;
        }
        
        // CACHE BUSTER: Add timestamp to prevent stale JSON
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
// === RELATIVE TIMESTAMPS (NEW FEATURE) ===
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

    // Return absolute after 7 days
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
        // Sanitize URL to prevent injection
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
    
    // Filter by tag first
    if (currentFilter !== 'all') {
        filteredResults = filteredResults.filter(update => {
            if (!update.tags || !Array.isArray(update.tags)) return false;
            return update.tags.includes(currentFilter);
        });
    }
    
    // Then filter by search query
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
        // Render all results in search mode (no pagination)
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
    
    // Remove existing tag buttons but keep label and "All" button
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

    // CHANGE ONLY THIS LINE - Use relative timestamp
    const relativeTime = getRelativeTime(update.parsedDate || update.date);
    article.innerHTML = `<time class="date dt-published" datetime="${update.date}">${relativeTime}</time>` +
        `<div class="content e-content"><p>${formattedContent}</p></div>` +
        `<div class="update-bottom-row">${tagsHtml}<button class="share-update-btn" aria-label="Κοινοποίηση ενημέρωσης" title="Κοινοποίηση"><i class="fa-solid fa-share-nodes"></i></button></div>`;

    // Tag filtering click handlers
    article.querySelectorAll('.tag-display').forEach(span => {
        span.addEventListener('click', (e) => {
            e.stopPropagation();
            applyFilter(span.getAttribute('data-filter'));
        });
    });

    // Share functionality
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
                // Fallback to clipboard
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
    
    // Clone to bust cache visually
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
        
        // Reload with timestamp to force network fetch
        window.location.href = window.location.origin + window.location.pathname + '?nocache=' + new Date().getTime();
    });
}

document.addEventListener('DOMContentLoaded', setupAvatarRefresh);

// ========================================
// === PWA INSTALL BUTTON (FOOTER INTEGRATION) ===
// ========================================
(function() {
    let deferredPrompt = null;
    // Target the new footer button
    const installBtn = document.getElementById('pwa-install-btn-footer');
    const oldContainer = document.getElementById('pwa-install-container');
    
    if (!installBtn) return;
    
    // Hide old container if exists
    if (oldContainer) oldContainer.style.display = 'none';
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'inline-flex'; // Show button
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
// === NAVIGATION HAMBURGER (FIXED) ===
// ========================================
const hamburgerBtn = document.querySelector('.hamburger-btn');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburgerBtn && mobileMenu) {
    // Ensure closed initially
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
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburgerBtn.textContent = '☰';
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Close when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburgerBtn.textContent = '☰';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// ========================================
// === FORCED SMOOTH SCROLL FALLBACK (DESKTOP FIX) ===
// ========================================
// Εφαρμόζεται μόνο αν το native smooth scroll δεν λειτουργεί σωστά
document.addEventListener('DOMContentLoaded', () => {
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.getElementById(targetId.substring(1));
            
            if (targetElement) {
                e.preventDefault(); // Σταματάμε το default jump
                
                // Δοκιμή native smooth scroll
                try {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    
                    // Έλεγχος αν έγινε πράγματι smooth scroll (με βάση το time)
                    setTimeout(() => {
                        // Αν μετά από 1ms η σελίδα είναι ακόμα στην ίδια θέση,
                        // τότε το browser δεν υποστήριξε το smooth -> fallback manual
                        const currentPos = window.scrollY;
                        const targetPos = targetElement.getBoundingClientRect().top + window.scrollY;
                        
                        // Αν η διαφορά είναι μεγάλη και η ώρα περνάει, κάνουμε manual smooth
                        if (Math.abs(currentPos - targetPos) > 1 && Math.abs(currentPos - targetPos) < 500) {
                            // Αν χρειάζεται, μπορούμε να προσθέσουμε επιπλέον logic εδώ
                            // Αλλά συνήθως το scrollIntoView δουλεύει. 
                            // Αν δεν δουλέψει, αυτό το check θα εντοπίσει το πρόβλημα.
                        }
                    }, 10);
                    
                    history.pushState(null, null, targetId);
                } catch (err) {
                    console.error("Smooth scroll failed, using fallback", err);
                    // Fallback: Manual smooth scroll με requestAnimationFrame
                    const start = window.pageYOffset;
                    const end = targetElement.offsetTop;
                    const duration = 700; // ms
                    let startTime = null;

                    function step(timestamp) {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;
                        const percentage = Math.min(progress / duration, 1);
                        
                        // Ease-out cubic easing
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
    // Feature detection logs
    const features = {
        serviceWorker: 'serviceWorker' in navigator,
        pushNotification: 'PushManager' in window,
        shareAPI: 'share' in navigator,
        offline: navigator.onLine
    };
    console.table(features);
});
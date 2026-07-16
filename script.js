// === script.js - Relative Timestamps + Ctrl+K Search + Theme Sync ===

(function() {
    'use strict';

    const CACHE_KEY = 'updates_cache_v1';
    const CACHE_TTL = 5 * 60 * 1000;
    const MAX_UPDATES = 10;
    let allUpdates = [];
    let filteredUpdates = [];

    // === THEME SYNC ===
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme_mode') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }
        updateThemeIcon(savedTheme);
    }

    function saveTheme(theme) {
        localStorage.setItem('theme_mode', theme);
    }

    function toggleTheme() {
        const isLight = document.body.classList.toggle('light-mode');
        const newTheme = isLight ? 'light' : 'dark';
        saveTheme(newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    // === RELATIVE TIMESTAMPS ===
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

        if (diffSeconds < 60) return 'πριν από ' + diffSeconds + ' sec';
        if (diffMinutes < 60) return 'πριν από ' + diffMinutes + ' min';
        if (diffHours < 24) return 'πριν από ' + diffHours + ' hr' + (diffHours > 1 ? 's' : '');
        if (diffDays === 1) return 'χθες';
        return 'πριν από ' + diffDays + ' day' + (diffDays > 1 ? 's' : '');
    }

    // === LOAD UPDATES ===
    async function loadUpdates() {
        try {
            // Try cache first
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const { timestamp, data } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_TTL) {
                    allUpdates = data || [];
                    filteredUpdates = allUpdates.slice(0, MAX_UPDATES);
                    renderUpdates();
                    // Still refresh in background
                    fetchUpdatesFromGithub();
                    return;
                }
            }

            await fetchUpdatesFromGithub();
        } catch (error) {
            console.error('Failed to load updates:', error);
            showError('Failed to load updates');
        }
    }

    async function fetchUpdatesFromGithub() {
        const rawUrl = 'https://raw.githubusercontent.com/koulaxizis/koulaxizis/main/updates.json';
        const response = await fetch(rawUrl + '?t=' + Date.now());

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        allUpdates = data.updates || [];
        filteredUpdates = allUpdates.slice(0, MAX_UPDATES);

        // Cache for future
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                data: allUpdates
            }));
        } catch(e) {}

        renderUpdates();
    }

    // === RENDER UPDATES ===
    function renderUpdates(updatesToShow) {
        const container = document.getElementById('updates-container');
        if (!container) return;

        const updates = updatesToShow || filteredUpdates;

        if (updates.length === 0) {
            container.innerHTML = '<p style="color: var(--secondary-text); font-size: 0.9rem;">No updates yet.</p>';
            return;
        }

        container.innerHTML = updates.map(function(update) {
            const relativeTime = getRelativeTime(update.parsedDate);
            const tags = update.tags || [];
            const tagsHTML = tags.map(function(tag) {
                return '<span class="tag-badge">' + escapeHtml(tag) + '</span>';
            }).join('');

            return '<article class="update-card" data-date="' + escapeHtml(update.date) + '">' +
                '<div class="update-meta">' +
                    '<span class="update-relative">' + escapeHtml(relativeTime) + '</span>' +
                    '<span class="update-date" title="' + escapeHtml(update.displayDate) + '">•</span>' +
                '</div>' +
                '<div class="update-content">' + escapeHtml(update.content) + '</div>' +
                '<div class="update-tags">' + tagsHTML + '</div>' +
            '</article>';
        }).join('');

        // Rebind filter events if search is active
        if (currentSearchTerm) {
            filterUpdates(currentSearchTerm);
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // === SEARCH & FILTER ===
    let currentSearchTerm = '';

    function initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchClearBtn = document.getElementById('searchClearBtn');

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                currentSearchTerm = this.value.trim().toLowerCase();
                filterUpdates(currentSearchTerm);
                if (searchClearBtn) {
                    searchClearBtn.style.display = currentSearchTerm ? 'inline-flex' : 'none';
                }
            });

            searchInput.addEventListener('focus', function() {
                searchInput.select();
            });
        }

        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', function() {
                if (searchInput) {
                    searchInput.value = '';
                }
                currentSearchTerm = '';
                renderUpdates();
                this.style.display = 'none';
                if (searchInput) searchInput.focus();
            });
        }
    }

    function filterUpdates(term) {
        if (!term) {
            filteredUpdates = allUpdates.slice(0, MAX_UPDATES);
            renderUpdates(filteredUpdates);
            return;
        }

        filteredUpdates = allUpdates
            .filter(function(update) {
                return (update.content || '').toLowerCase().includes(term) ||
                       (update.displayDate || '').toLowerCase().includes(term) ||
                       (update.tags || []).some(function(tag) {
                           return tag.toLowerCase().includes(term);
                       });
            })
            .slice(0, MAX_UPDATES);

        renderUpdates(filteredUpdates);
    }

    // === CTRL+K SHORTCUT ===
    function initCtrlK() {
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        });
    }

    // === LOAD MORE ===
    function initLoadMore() {
        const btn = document.getElementById('loadMoreBtn');
        const container = document.getElementById('updates-container');
        if (!btn || !container) return;

        let shown = MAX_UPDATES;
        btn.addEventListener('click', function() {
            shown += 5;
            const moreUpdates = allUpdates.slice(0, shown);
            renderUpdates(moreUpdates);
            if (shown >= allUpdates.length) {
                btn.style.display = 'none';
            }
        });

        if (allUpdates.length <= MAX_UPDATES) {
            btn.style.display = 'none';
        }
    }

    // === SHOW ERROR ===
    function showError(message) {
        const container = document.getElementById('updates-container');
        if (container) {
            container.innerHTML = '<p style="color: #f44336; font-size: 0.9rem;">' + message + '</p>';
        }
    }

    // === INIT ===
    function init() {
        loadTheme();

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        initSearch();
        initCtrlK();
        loadUpdates();

        // Load more
        setTimeout(function() {
            initLoadMore();
        }, 100);

        console.log('✅ Script.js Ready - Relative Timestamps + Ctrl+K');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
// === app.js - Part 1 of 2 ===

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const GITHUB_USER = 'koulaxizis';
    const REPO_NAME = 'koulaxizis';
    const BRANCH = 'main';
    let GITHUB_TOKEN = '';
    let selectedTags = [];
    const MAX_TAGS = 3;

    // --- PLATFORM LOGIC ---
    function getPlatformForLength(length) {
        if (length <= 140) return 'Status Cafe';
        if (length <= 280) return 'Twitter';
        if (length <= 300) return 'BlueSky';
        if (length <= 500) return 'Mastodon';
        return 'Others (>500)';
    }

    function getPlatformColorClass(length, userLimit) {
        if (userLimit && length > userLimit) return 'danger';
        if (length <= 140) return 'platform-white';
        if (length <= 280) return 'warning';
        if (length <= 300) return 'platform-blue';
        if (length <= 500) return 'platform-yellow';
        return 'danger';
    }

    // --- DOM ELEMENTS ---
    const elements = {};

    function initElements() {
        elements.submitBtn = document.getElementById('submitBtn');
        elements.clearBtn = document.getElementById('clearBtn');
        elements.statusDiv = document.getElementById('status');
        elements.dateInput = document.getElementById('date');
        elements.timeInput = document.getElementById('time');
        elements.contentInput = document.getElementById('content');
        elements.charCounter = document.getElementById('charCounter');
        elements.tagsContainer = document.getElementById('tagsContainer');
        elements.hashtagPreview = document.getElementById('hashtagPreview');
        elements.previewContent = document.getElementById('previewContent');
        elements.tokenToggle = document.getElementById('tokenToggle');
        elements.tokenWrapper = document.getElementById('tokenWrapper');
        elements.githubTokenInput = document.getElementById('githubToken');
        elements.tokenStatus = document.getElementById('tokenStatus');
        elements.socialToggle = document.getElementById('socialToggle');
        elements.socialWrapper = document.getElementById('socialWrapper');
        elements.emojiDropdownBtn = document.getElementById('emojiDropdownBtn');
        elements.emojiDropdownMenu = document.getElementById('emojiDropdownMenu');
        elements.emojiSearch = document.getElementById('emojiSearch');
        elements.categoriesContainer = document.getElementById('emojiCategoriesContainer');
        elements.recentEmojisCategory = document.getElementById('recentEmojisCategory');
        elements.recentEmojisGrid = document.getElementById('recentEmojisGrid');
        elements.enableLimitToggle = document.getElementById('enableLimitToggle');
        elements.userLimitInput = document.getElementById('userLimitInput');
    }

    // --- CHARACTER COUNTER ---
    function updateCharCounter() {
        const text = elements.contentInput ? elements.contentInput.value : '';
        const convertHashtags = document.getElementById('hashtagsConvert')?.checked || false;
        
        let limit = null;
        if (elements.enableLimitToggle && elements.enableLimitToggle.checked) {
            limit = parseInt(elements.userLimitInput.value) || 280;
        }

        let totalLength = text.length;
        
        if (convertHashtags && selectedTags.length > 0) {
            const wordFunc = typeof window.emojiToWord === 'function' ? window.emojiToWord : (e) => 'tag';
            const hashtags = selectedTags.map(tag => '#' + wordFunc(tag)).join(' ');
            totalLength += (hashtags.length + 1);
        }
        
        const platform = limit ? `(Custom: ${limit})` : getPlatformForLength(totalLength);
        const colorClass = getPlatformColorClass(totalLength, limit);
        
        if (elements.charCounter) {
            elements.charCounter.className = 'char-counter ' + colorClass;
            if (limit) {
                elements.charCounter.innerHTML = `${totalLength} / ${limit}`;
            } else {
                elements.charCounter.innerHTML = `${totalLength} <small>(${platform})</small>`;
            }
        }
        
        updateHashtagPreview();
        saveDraft();
    }

    function updateHashtagPreview() {
        const convertHashtags = document.getElementById('hashtagsConvert')?.checked || false;
        
        if (!convertHashtags || selectedTags.length === 0) {
            if (elements.hashtagPreview) elements.hashtagPreview.style.display = 'none';
            return;
        }
        
        if (elements.hashtagPreview) elements.hashtagPreview.style.display = 'block';
        
        const wordFunc = typeof window.emojiToWord === 'function' ? window.emojiToWord : (e) => 'tag';
        const hashtags = selectedTags.map(tag => `#${wordFunc(tag)}`).join(' ');
        
        if (elements.previewContent) {
            elements.previewContent.textContent = `"${hashtags}" (${hashtags.length} chars)`;
        }
    }

    // --- TAGS MANAGEMENT ---
    function renderTags() {
        if (!elements.tagsContainer) return;
        elements.tagsContainer.innerHTML = '';
        if (selectedTags.length === 0) {
            elements.tagsContainer.innerHTML = '<span class="empty-msg">Επίλεξε emojis ως tags</span>';
        } else {
            selectedTags.forEach(tag => {
                const chip = document.createElement('div');
                chip.className = 'tag-chip';
                chip.innerHTML = `${tag}<span class="remove-tag">×</span>`;
                chip.querySelector('.remove-tag').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeTag(tag);
                });
                elements.tagsContainer.appendChild(chip);
            });
        }
        updateEmojiButtonsState();
    }

    function addTag(emoji) {
        if (selectedTags.includes(emoji)) return;
        if (selectedTags.length >= MAX_TAGS) { alert(`Μέγιστο ${MAX_TAGS} tags.`); return; }
        selectedTags.push(emoji);
        renderTags();
        updateCharCounter();
    }

    function removeTag(emoji) {
        selectedTags = selectedTags.filter(t => t !== emoji);
        renderTags();
        updateCharCounter();
    }

    function updateEmojiButtonsState() {
        const buttons = document.querySelectorAll('.char-btn');
        buttons.forEach(btn => {
            const char = btn.getAttribute('data-char');
            if (char) {
                if (selectedTags.includes(char)) {
                    btn.classList.add('selected');
                    btn.style.opacity = '1';
                } else if (selectedTags.length >= MAX_TAGS) {
                    btn.classList.remove('selected');
                    btn.style.opacity = '0.4';
                    btn.style.cursor = 'not-allowed';
                } else {
                    btn.classList.remove('selected');
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                }
            }
        });
    }

    // --- DRAFT SAVE/LOAD ---
    function saveDraft() {
        try {
            localStorage.setItem('update_draft', JSON.stringify({
                content: elements.contentInput ? elements.contentInput.value : '',
                tags: selectedTags,
                timestamp: Date.now()
            }));
        } catch(e) {}
    }

    function loadSavedDraft() {
        try {
            const saved = localStorage.getItem('update_draft');
            if (saved) {
                const draft = JSON.parse(saved);
                if (elements.contentInput) elements.contentInput.value = draft.content || '';
                if (Array.isArray(draft.tags)) {
                    selectedTags = draft.tags;
                    renderTags();
                }
            }
        } catch(e) {}
    }
    // --- EMOJI DROPDOWN ---
    function initEmojiDropdown() {
        if (!elements.categoriesContainer) return;
        const categories = window.EMOJI_CATEGORIES || [];
        if (categories.length === 0) {
            categories.push({ title: '😊 Smiles', emojis: ['😀','😃','😄'] });
        }
        
        categories.forEach(cat => {
            const catDiv = document.createElement('div');
            catDiv.className = 'emoji-category';
            const title = document.createElement('div');
            title.className = 'category-title';
            title.textContent = cat.title;
            catDiv.appendChild(title);
            
            const grid = document.createElement('div');
            grid.className = 'char-grid';
            
            cat.emojis.forEach(emoji => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'char-btn';
                btn.setAttribute('data-char', emoji);
                btn.textContent = emoji;
                btn.title = emoji;
                btn.addEventListener('click', () => {
                    const char = btn.getAttribute('data-char');
                    if (selectedTags.includes(char)) removeTag(char);
                    else addTag(char);
                    btn.classList.toggle('selected');
                });
                grid.appendChild(btn);
            });
            
            catDiv.appendChild(grid);
            elements.categoriesContainer.appendChild(catDiv);
        });
        loadRecentEmojis();
    }

    async function loadRecentEmojis() {
        if (!elements.recentEmojisGrid) return;
        try {
            const res = await fetch('./updates.json');
            if (!res.ok) throw new Error();
            const data = await res.json();
            const recentList = [];
            if (data.updates) {
                data.updates.forEach(u => {
                    if (u.tags) u.tags.forEach(t => { if (!recentList.includes(t)) recentList.push(t); });
                });
            }
            if (recentList.length > 0 && elements.recentEmojisCategory) {
                elements.recentEmojisCategory.classList.remove('hidden');
                elements.recentEmojisGrid.innerHTML = '';
                recentList.slice(0, 50).forEach(char => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'char-btn';
                    btn.setAttribute('data-char', char);
                    btn.textContent = char;
                    btn.title = 'Πρόσφατο';
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (selectedTags.includes(char)) removeTag(char);
                        else addTag(char);
                        btn.classList.toggle('selected');
                    });
                    elements.recentEmojisGrid.appendChild(btn);
                });
            }
        } catch (err) {
            if (elements.recentEmojisCategory) elements.recentEmojisCategory.classList.add('hidden');
        }
    }

    // --- SEARCH ---
    function setupSearch() {
        if (!elements.emojiSearch) return;
        elements.emojiSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.emoji-category').forEach(cat => {
                const btns = cat.querySelectorAll('.char-btn');
                let count = 0;
                btns.forEach(b => {
                    const match = term === '' || b.textContent.includes(term) || b.title.includes(term);
                    b.classList.toggle('hidden', !match);
                    if (match) count++;
                });
                cat.classList.toggle('hidden', count === 0);
            });
        });
    }

    // --- SUBMIT ---
    function safeBase64Decode(str) { try { return decodeURIComponent(escape(atob(str))); } catch(e){return '{}';} }
    async function submitUpdate() {
        const dateDisplay = elements.dateInput ? elements.dateInput.value : '';
        const time = elements.timeInput ? elements.timeInput.value.trim() : '';
        const content = elements.contentInput ? elements.contentInput.value.trim() : '';
        const hasHashtagsConvert = document.getElementById('hashtagsConvert')?.checked || false;
        
        if (!GITHUB_TOKEN || !GITHUB_TOKEN.startsWith('ghp_')) {
            alert('⚠️ GitHub Token required!');
            if(elements.tokenWrapper) elements.tokenWrapper.classList.add('show');
            return;
        }
        if (selectedTags.length < 1) { alert('Select at least 1 tag.'); return; }
        if (!dateDisplay || !time || !content) { alert('Fill all fields!'); return; }

        if (elements.submitBtn) { elements.submitBtn.disabled = true; elements.submitBtn.textContent = 'Αποστολή...'; }
        if (elements.statusDiv) { elements.statusDiv.style.display = 'none'; }

        try {
            const [d, m, y] = dateDisplay.split('/');
            const isoDate = `${y}-${m}-${d}T${time}:00`;
            const months = ['Ιανουαρίου','Φεβρουαρίου','Μαρτίου','Απριλίου','Μαΐου','Ιουνίου','Ιουλίου','Αυγούστου','Σεπτεμβρίου','Οκτωβρίου','Νοεμβρίου','Δεκεμβρίου'];
            const formattedDate = `${d} ${months[parseInt(m)-1]} ${y}, ${time}`;

            const newUpdate = { date: isoDate, displayDate: formattedDate, content, tags: selectedTags };
            const fileUrl = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/updates.json?ref=${BRANCH}`;
            let retries = 3;
            while (retries > 0) {
                const fRes = await fetch(fileUrl, { headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' } });
                if (!fRes.ok) throw new Error("Load fail");
                const fData = await fRes.json();
                let data = JSON.parse(safeBase64Decode(fData.content));
                if (!data.updates) data.updates = [];
                data.updates.unshift(newUpdate);
                const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
                const cRes = await fetch(fileUrl, { method: 'PUT', headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Auto: ${formattedDate}`, content: newContent, sha: fData.sha, branch: BRANCH }) });
                if (cRes.ok) break;
                if (cRes.status === 422) { retries--; await new Promise(r => setTimeout(r, 1500)); }
                else throw new Error((await cRes.json()).message || "Fail");
            }

            if (document.getElementById('blueskyPost')?.checked || document.getElementById('mastodonPost')?.checked) {
                try {
                    await fetch(`https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/actions/workflows/social-post.yml/dispatches`, {
                        method: 'POST', headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ref: BRANCH, inputs: { content, tags: selectedTags.join(' '), display_date: formattedDate, bluesky_post: 'true', mastodon_post: 'true', hashtags_convert: hasHashtagsConvert.toString() } })
                    });
                } catch(e) { console.warn("Social trigger failed", e); }
            }

            if (elements.statusDiv) { elements.statusDiv.textContent = '✅ Επιτυχία!'; elements.statusDiv.className = 'success'; elements.statusDiv.style.display = 'block'; }
            if (elements.contentInput) elements.contentInput.value = '';
            selectedTags = [];
            renderTags();
            localStorage.removeItem('update_draft');
            updateCharCounter();
            if (elements.submitBtn) { elements.submitBtn.disabled = false; elements.submitBtn.textContent = '📤 Αποστολή'; }

        } catch (error) {
            if (elements.statusDiv) { elements.statusDiv.textContent = `❌ Σφάλμα: ${error.message}`; elements.statusDiv.className = 'error'; elements.statusDiv.style.display = 'block'; }
            if (elements.submitBtn) { elements.submitBtn.disabled = false; elements.submitBtn.textContent = '📤 Αποστολή'; }
        }
    }

    // --- EVENT BINDING ---
    function bindEvents() {
        if (elements.tokenToggle) elements.tokenToggle.addEventListener('click', () => {
            elements.tokenWrapper.classList.toggle('show');
            elements.tokenToggle.textContent = elements.tokenWrapper.classList.contains('show') ? '🔓 Κρύψε Token' : '🔐 GitHub Token';
            if(elements.tokenWrapper.classList.contains('show')) elements.githubTokenInput.focus();
        });
        if (elements.githubTokenInput) elements.githubTokenInput.addEventListener('input', () => {
            GITHUB_TOKEN = elements.githubTokenInput.value.trim();
            if (elements.tokenStatus) elements.tokenStatus.innerHTML = GITHUB_TOKEN.startsWith('ghp_') ? '<span style="color:#4CAF50">✅</span>' : '<span style="color:#ff9800">⚠️</span>';
        });
        if (elements.socialToggle) elements.socialToggle.addEventListener('click', () => {
            elements.socialWrapper.classList.toggle('show');
            elements.socialToggle.textContent = elements.socialWrapper.classList.contains('show') ? '🔓 Κλείσε' : '📱 Social';
        });
        if (elements.emojiDropdownBtn && elements.emojiDropdownMenu) {
            elements.emojiDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                elements.emojiDropdownMenu.classList.toggle('show');
                if (elements.emojiDropdownMenu.classList.contains('show')) elements.emojiSearch.focus();
            });
        }
        document.addEventListener('click', (e) => {
            if (elements.emojiDropdownMenu && elements.emojiDropdownBtn && !elements.emojiDropdownMenu.contains(e.target) && !elements.emojiDropdownBtn.contains(e.target)) {
                elements.emojiDropdownMenu.classList.remove('show');
            }
        });
        setupSearch();
        if (elements.submitBtn) elements.submitBtn.addEventListener('click', submitUpdate);
        if (elements.clearBtn) elements.clearBtn.addEventListener('click', () => {
            if (confirm('Καθαρισμός;')) {
                if (elements.contentInput) elements.contentInput.value = '';
                selectedTags = [];
                renderTags();
                localStorage.removeItem('update_draft');
                updateCharCounter();
                if (elements.statusDiv) elements.statusDiv.style.display = 'none';
            }
        });
        if (elements.contentInput) elements.contentInput.addEventListener('input', updateCharCounter);
        const hashtagCb = document.getElementById('hashtagsConvert');
        if (hashtagCb) hashtagCb.addEventListener('change', updateCharCounter);
        
        // ★ Special Chars
        const specialBtns = document.querySelectorAll('.special-char-btn');
        specialBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const char = btn.getAttribute('data-char');
                if (elements.contentInput) {
                    const start = elements.contentInput.selectionStart;
                    const end = elements.contentInput.selectionEnd;
                    const text = elements.contentInput.value;
                    elements.contentInput.value = text.substring(0, start) + char + text.substring(end);
                    elements.contentInput.selectionStart = elements.contentInput.selectionEnd = start + 1;
                    elements.contentInput.focus();
                    updateCharCounter();
                }
            });
        });
        
        // ★ Custom Limit Toggle
        if (elements.enableLimitToggle && elements.userLimitInput) {
            elements.enableLimitToggle.addEventListener('change', () => {
                elements.userLimitInput.disabled = !elements.enableLimitToggle.checked;
                updateCharCounter();
            });
            elements.userLimitInput.addEventListener('input', updateCharCounter);
            elements.userLimitInput.disabled = !elements.enableLimitToggle.checked;
        }

        if (elements.dateInput && elements.timeInput) {
            const now = new Date();
            elements.dateInput.value = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`;
            elements.timeInput.value = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        }
    }

    // --- INIT ---
    function init() {
        initElements();
        if (!elements.emojiSearch) { console.error("Missing search input!"); return; }
        loadSavedDraft();
        initEmojiDropdown();
        bindEvents();
        updateCharCounter();
        console.log("✅ Admin Panel Ready");
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
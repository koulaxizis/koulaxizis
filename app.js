// --- APP.JS - MAIN APPLICATION LOGIC ---
(function() {
    'use strict';

    // === CONFIGURATION ===
    const GITHUB_USER = 'koulaxizis';
    const REPO_NAME = 'koulaxizis';
    const BRANCH = 'main';
    let GITHUB_TOKEN = '';
    let selectedTags = [];
    const MAX_TAGS = 3;

    // === PLATFORM LIMITS ===
    function getPlatformForLength(length) {
        if (length <= 140) return 'Status Cafe';
        if (length <= 280) return 'Twitter';
        if (length <= 300) return 'BlueSky';
        if (length <= 500) return 'Mastodon';
        return 'Others (>500)';
    }

    function getPlatformColorClass(length) {
        if (length <= 140) return 'platform-white';
        if (length <= 280) return 'warning';
        if (length <= 300) return 'platform-blue';
        if (length <= 500) return 'platform-yellow';
        return 'danger';
    }

    // === DOM ELEMENTS ===
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
    }

    // === CHARACTER COUNTER ===
    function updateCharCounter() {
        const text = elements.contentInput.value;
        const convertHashtags = document.getElementById('hashtagsConvert').checked;
        
        let totalLength = text.length;
        
        if (convertHashtags && selectedTags.length > 0) {
            const hashtags = selectedTags.map(tag => '#' + emojiToWord(tag)).join(' ');
            totalLength += (hashtags.length + 1);
        }
        
        const platform = getPlatformForLength(totalLength);
        const colorClass = getPlatformColorClass(totalLength);
        
        elements.charCounter.className = 'char-counter ' + colorClass;
        elements.charCounter.innerHTML = `${totalLength} <small>(${platform})</small>`;
        
        updateHashtagPreview();
        saveDraft();
    }
	
	    // === HASHTAG PREVIEW ===
    function updateHashtagPreview() {
        const convertHashtags = document.getElementById('hashtagsConvert').checked;
        
        if (!convertHashtags || selectedTags.length === 0) {
            elements.hashtagPreview.style.display = 'none';
            return;
        }
        
        elements.hashtagPreview.style.display = 'block';
        
        // Δημιουργία της λίστας με τα hashtags (π.χ. #grinning #love)
        const hashtags = selectedTags.map(tag => {
            const word = emojiToWord(tag);
            return `#${word}`;
        }).join(' ');
        
        elements.previewContent.textContent = `"${hashtags}" (${hashtags.length} chars)`;
    }

    // === TAGS MANAGEMENT ===
    function renderTags() {
        elements.tagsContainer.innerHTML = '';
        
        if (selectedTags.length === 0) {
            elements.tagsContainer.innerHTML = '<span class="empty-msg">Επίλεξε emojis ως tags</span>';
        } else {
            selectedTags.forEach(tag => {
                const chip = document.createElement('div');
                chip.className = 'tag-chip';
                chip.innerHTML = `${tag}<span class="remove-tag" title="Αφαίρεση">×</span>`;
                
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
        if (selectedTags.length >= MAX_TAGS) {
            alert(`Μπορείς να επιλέξεις το πολύ ${MAX_TAGS} tags.`);
            return;
        }
        
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
        // Ενημέρωση όλων των κουμπιών μέσα στο dropdown
        const buttons = document.querySelectorAll('.char-btn');
        buttons.forEach(btn => {
            const char = btn.getAttribute('data-char');
            if (selectedTags.includes(char)) {
                btn.classList.add('selected');
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            } else if (selectedTags.length >= MAX_TAGS) {
                btn.classList.remove('selected');
                btn.style.opacity = '0.4';
                btn.style.cursor = 'not-allowed';
            } else {
                btn.classList.remove('selected');
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        });
    }

    // === DRAFT SAVE & LOAD ===
    function saveDraft() {
        const draft = {
            content: elements.contentInput.value,
            tags: selectedTags,
            timestamp: Date.now()
        };
        localStorage.setItem('update_draft', JSON.stringify(draft));
    }

    function loadSavedDraft() {
        const saved = localStorage.getItem('update_draft');
        if (saved) {
            try {
                const draft = JSON.parse(saved);
                elements.contentInput.value = draft.content || '';
                if (Array.isArray(draft.tags)) {
                    selectedTags = draft.tags;
                    renderTags();
                }
            } catch(e) { console.error("Error loading draft", e); }
        }
    }

    // === INIT EMOJI DROPDOWN ===
    function initEmojiDropdown() {
        // Αν δεν υπάρχουν κατηγορίες από το emoji-data.js, χρησιμοποιούμε fallback
        const categories = window.EMOJI_CATEGORIES || [];
        
        if (categories.length === 0 && typeof EMOJI_MAPPING !== 'undefined') {
            // Fallback: Δημιουργία βασικών κατηγοριών από το mapping
            alert("Warning: EMOJI_CATEGORIES not found. Using basic structure.");
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
                btn.title = emoji; // Χρήση του emoji ως title για αναζήτηση
                
                btn.addEventListener('click', () => {
                    const char = btn.getAttribute('data-char');
                    if (selectedTags.includes(char)) {
                        removeTag(char);
                    } else {
                        addTag(char);
                    }
                    btn.classList.toggle('selected');
                });
                
                grid.appendChild(btn);
            });
            
            catDiv.appendChild(grid);
            elements.categoriesContainer.appendChild(catDiv);
        });

        // Πρόσθεσε recent emojis αν υπάρχουν (από το updates.json)
        loadRecentEmojis();
    }

    async function loadRecentEmojis() {
        if (!elements.recentEmojisGrid) return;
        
        try {
            const response = await fetch('./updates.json');
            if (!response.ok) throw new Error('No file');
            
            const data = await response.json();
            if (!data.updates || !Array.isArray(data.updates)) throw new Error('Invalid format');
            
            const recentList = [];
            data.updates.forEach(update => {
                if (update.tags && Array.isArray(update.tags)) {
                    update.tags.forEach(tag => {
                        if (!recentList.includes(tag)) recentList.push(tag);
                    });
                }
            });
            
            if (recentList.length > 0) {
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
                        if (selectedTags.includes(char)) {
                            removeTag(char);
                        } else {
                            addTag(char);
                        }
                        btn.classList.toggle('selected');
                    });
                    
                    elements.recentEmojisGrid.appendChild(btn);
                });
            }
        } catch (err) {
            elements.recentEmojisCategory.classList.add('hidden');
        }
    }

    // === SEARCH FUNCTIONALITY ===
    elements.emojiSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        const categories = document.querySelectorAll('.emoji-category');
        
        categories.forEach(cat => {
            const buttons = cat.querySelectorAll('.char-btn');
            let visibleCount = 0;
            
            buttons.forEach(btn => {
                const title = btn.getAttribute('title').toLowerCase();
                const char = btn.getAttribute('data-char');
                // Αναζήτηση στον τίτλο ή στο ίδιο το emoji
                const matches = term === '' || title.includes(term) || char.includes(term);
                
                if (matches) {
                    btn.classList.remove('hidden');
                    visibleCount++;
                } else {
                    btn.classList.add('hidden');
                }
            });
            
            if (visibleCount === 0) {
                cat.classList.add('hidden');
            } else {
                cat.classList.remove('hidden');
            }
        });
    });

    // === GITHUB & SUBMIT LOGIC ===
    function safeBase64Decode(str) { return decodeURIComponent(escape(atob(str))); }

    async function submitUpdate() {
        const dateDisplay = elements.dateInput.value;
        const time = elements.timeInput.value.trim();
        const content = elements.contentInput.value.trim();
        
        const blueskyPost = document.getElementById('blueskyPost').checked;
        const mastodonPost = document.getElementById('blueskyPost').checked; // Συνήθως κοινό checkbox για demo
        const hasHashtagsConvert = document.getElementById('hashtagsConvert').checked;

        // Validations
        if (!GITHUB_TOKEN || !GITHUB_TOKEN.startsWith('ghp_')) {
            alert('⚠️ Παρακαλώ εισάγετε το GitHub Token πρώτα!');
            elements.tokenWrapper.classList.add('show');
            elements.githubTokenInput.focus();
            return;
        }
        if (selectedTags.length < 1) {
            alert('Παρακαλώ επιλέξτε τουλάχιστον 1 emoji tag.');
            return;
        }
        if (!dateDisplay || !time || !content) {
            alert('Συμπληρώστε όλα τα πεδία!');
            return;
        }

        elements.submitBtn.disabled = true;
        elements.submitBtn.textContent = 'Αποστολή...';
        elements.statusDiv.style.display = 'none';

        try {
            const [d, m, y] = dateDisplay.split('/');
            const isoDate = `${y}-${m}-${d}T${time}:00`;
            const months = ['Ιανουαρίου','Φεβρουαρίου','Μαρτίου','Απριλίου','Μαΐου','Ιουνίου','Ιουλίου','Αυγούστου','Σεπτεμβρίου','Οκτωβρίου','Νοεμβρίου','Δεκεμβρίου'];
            const formattedDate = `${d} ${months[parseInt(m)-1]} ${y}, ${time}`;

            const newUpdate = {
                date: isoDate,
                displayDate: formattedDate,
                content: content,
                tags: selectedTags
            };

            // 1. Fetch current file
            const fileUrl = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/updates.json?ref=${BRANCH}`;
            let retries = 3;
            let success = false;

            while (retries > 0 && !success) {
                try {
                    const fetchRes = await fetch(fileUrl, {
                        headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
                    });
                    if (!fetchRes.ok) throw new Error('Αδυναμία φόρτωσης updates.json');

                    const fileData = await fetchRes.json();
                    const existingContent = safeBase64Decode(fileData.content);
                    let data = JSON.parse(existingContent);

                    if (!data.updates) data.updates = [];
                    data.updates.unshift(newUpdate);

                    const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
                    
                    const commitRes = await fetch(fileUrl, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/vnd.github.v3+json',
                            'Authorization': `token ${GITHUB_TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: `Auto-commit: Νέα ενημέρωση - ${formattedDate}`,
                            content: newContent,
                            sha: fileData.sha,
                            branch: BRANCH
                        })
                    });

                    if (commitRes.ok) {
                        success = true;
                        console.log('✅ Update committed successfully.');
                    } else if (commitRes.status === 422) {
                        console.warn('⚠️ SHA Conflict. Retrying...');
                        retries--;
                        await new Promise(r => setTimeout(r, 1500));
                    } else {
                        throw new Error((await commitRes.json()).message || 'Commit failed');
                    }
                } catch (err) {
                    if (retries <= 0) throw err;
                    retries--;
                    await new Promise(r => setTimeout(r, 1500));
                }
            }

            if (!success) throw new Error('Απέτυχε η αποστολή μετά από επαναλήψεις.');

            // 2. Trigger Social Media (Optional)
            if (blueskyPost || mastodonPost) {
                const tagsString = selectedTags.join(' ');
                const dispatchRes = await fetch(
                    `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/actions/workflows/social-post.yml/dispatches`,
                    {
                        method: 'POST',
                        headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ref: BRANCH,
                            inputs: {
                                content: content,
                                tags: tagsString,
                                display_date: formattedDate,
                                bluesky_post: blueskyPost.toString(),
                                mastodon_post: mastodonPost.toString(),
                                hashtags_convert: hasHashtagsConvert.toString()
                            }
                        })
                    }
                );
                if (!dispatchRes.ok) console.warn('Social trigger failed:', await dispatchRes.text());
            }

            // Success UI
            elements.statusDiv.textContent = '✅ Επιτυχία! Η ενημέρωση καταχωρήθηκε.';
            elements.statusDiv.className = 'success';
            elements.statusDiv.style.display = 'block';

            // Reset Form
            elements.contentInput.value = '';
            selectedTags = [];
            renderTags();
            localStorage.removeItem('update_draft');
            updateCharCounter();
            elements.submitBtn.disabled = false;
            elements.submitBtn.textContent = '📤 Αποστολή';

        } catch (error) {
            console.error(error);
            elements.statusDiv.textContent = `❌ Σφάλμα: ${error.message}`;
            elements.statusDiv.className = 'error';
            elements.statusDiv.style.display = 'block';
            elements.submitBtn.disabled = false;
            elements.submitBtn.textContent = '📤 Αποστολή';
        }
    }

    // === EVENT LISTENERS ===
    function bindEvents() {
        // Tokens
        elements.tokenToggle.addEventListener('click', () => {
            elements.tokenWrapper.classList.toggle('show');
            elements.tokenToggle.textContent = elements.tokenWrapper.classList.contains('show') ? '🔓 Κρύψε Token' : '🔐 GitHub Token';
            if (elements.tokenWrapper.classList.contains('show')) elements.githubTokenInput.focus();
        });

        elements.githubTokenInput.addEventListener('input', () => {
            const val = elements.githubTokenInput.value.trim();
            GITHUB_TOKEN = val;
            elements.tokenStatus.innerHTML = val.startsWith('ghp_') 
                ? '<span style="color: #4CAF50;">✅ Valid Token</span>' 
                : '<span style="color: #ff9800;">⚠️ Invalid or missing</span>';
        });

        // Social Toggle
        elements.socialToggle.addEventListener('click', () => {
            elements.socialWrapper.classList.toggle('show');
            elements.socialToggle.textContent = elements.socialWrapper.classList.contains('show') ? '🔓 Κλείσε ρυθμίσεις' : '📱 Social Media & Hashtags';
        });

        // Dropdown
        elements.emojiDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.emojiDropdownMenu.classList.toggle('show');
            if (elements.emojiDropdownMenu.classList.contains('show')) elements.emojiSearch.focus();
        });

        document.addEventListener('click', (e) => {
            if (!elements.emojiDropdownMenu.contains(e.target) && !elements.emojiDropdownBtn.contains(e.target)) {
                elements.emojiDropdownMenu.classList.remove('show');
            }
        });

        // Submit & Clear
        elements.submitBtn.addEventListener('click', submitUpdate);
        
        elements.clearBtn.addEventListener('click', () => {
            if (confirm('Είσαι σίγουρος/η ότι θέλεις να καθαρίσεις;')) {
                elements.contentInput.value = '';
                selectedTags = [];
                renderTags();
                localStorage.removeItem('update_draft');
                updateCharCounter();
                elements.statusDiv.style.display = 'none';
            }
        });

        // Inputs
        elements.contentInput.addEventListener('input', updateCharCounter);
        
        // Date/Time Auto-fill
        const now = new Date();
        elements.dateInput.value = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
        elements.timeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    // === INITIALIZATION ===
    function init() {
        initElements();
        loadSavedDraft();
        initEmojiDropdown();
        bindEvents();
        updateCharCounter(); // Initial count
        
        console.log('Lumo Admin Panel Initialized');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
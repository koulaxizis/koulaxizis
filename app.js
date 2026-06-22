// === app.js - Main Application Logic ===
// Ασφαλής εκτέλεση μόνο όταν τα στοιχεία υπάρχουν στο DOM

(function() {
    'use strict';

    // --- 1. CONFIGURATION & STATE ---
    const GITHUB_USER = 'koulaxizis';
    const REPO_NAME = 'koulaxizis';
    const BRANCH = 'main';
    let GITHUB_TOKEN = '';
    let selectedTags = [];
    const MAX_TAGS = 3;

    // --- 2. PLATFORM LIMITS LOGIC ---
    function getPlatformForLength(length) {
        if (length <= 140) return 'Status Cafe';
        if (length <= 280) return 'Twitter';
        if (length <= 300) return 'BlueSky';
        if (length <= 500) return 'Mastodon';
        return 'Others (>500)';
    }

    function getPlatformColorClass(length) {
        if (length <= 140) return 'platform-white';
        if (length <= 280) return 'warning';       // Green
        if (length <= 300) return 'platform-blue'; // Blue
        if (length <= 500) return 'platform-yellow'; // Yellow
        return 'danger';                            // Red
    }

    // --- 3. DOM ELEMENTS REFERENCES ---
    // Κεντρικό αντικείμενο για να αποθηκεύουμε τις αναφορές μετά την εύρεσή τους
    const elements = {};

    function initElements() {
        // Βασικά Forms
        elements.submitBtn = document.getElementById('submitBtn');
        elements.clearBtn = document.getElementById('clearBtn');
        elements.statusDiv = document.getElementById('status');
        elements.dateInput = document.getElementById('date');
        elements.timeInput = document.getElementById('time');
        elements.contentInput = document.getElementById('content');
        elements.charCounter = document.getElementById('charCounter');
        elements.tagsContainer = document.getElementById('tagsContainer');
        
        // Hashtag Preview
        elements.hashtagPreview = document.getElementById('hashtagPreview');
        elements.previewContent = document.getElementById('previewContent');

        // Token Section
        elements.tokenToggle = document.getElementById('tokenToggle');
        elements.tokenWrapper = document.getElementById('tokenWrapper');
        elements.githubTokenInput = document.getElementById('githubToken');
        elements.tokenStatus = document.getElementById('tokenStatus');

        // Social Section
        elements.socialToggle = document.getElementById('socialToggle');
        elements.socialWrapper = document.getElementById('socialWrapper');

        // Emoji Dropdown
        elements.emojiDropdownBtn = document.getElementById('emojiDropdownBtn');
        elements.emojiDropdownMenu = document.getElementById('emojiDropdownMenu');
        elements.emojiSearch = document.getElementById('emojiSearch'); // Το κρίσιμο στοιχείο
        elements.categoriesContainer = document.getElementById('emojiCategoriesContainer');
        elements.recentEmojisCategory = document.getElementById('recentEmojisCategory');
        elements.recentEmojisGrid = document.getElementById('recentEmojisGrid');
    }

    // --- 4. CHARACTER COUNTER & PREVIEW ---
    function updateCharCounter() {
        const text = elements.contentInput ? elements.contentInput.value : '';
        const convertHashtags = document.getElementById('hashtagsConvert')?.checked || false;
        
        let totalLength = text.length;
        
        // Αν ενεργό μετατροπή, υπολογίζουμε και τα hashtags
        if (convertHashtags && selectedTags.length > 0) {
            // Χρήση του global emojiToWord αν υπάρχει, αλλιώς fallback
            const wordFunc = typeof window.emojiToWord === 'function' ? window.emojiToWord : 
                             (typeof emojiToWord === 'function' ? emojiToWord : (e) => 'tag');
            
            const hashtags = selectedTags.map(tag => '#' + wordFunc(tag)).join(' ');
            totalLength += (hashtags.length + 1); // +1 για το αρχικό κενό αν υπήρχε κείμενο
        }
        
        const platform = getPlatformForLength(totalLength);
        const colorClass = getPlatformColorClass(totalLength);
        
        if (elements.charCounter) {
            elements.charCounter.className = 'char-counter ' + colorClass;
            elements.charCounter.innerHTML = `${totalLength} <small>(${platform})</small>`;
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
        
        const wordFunc = typeof window.emojiToWord === 'function' ? window.emojiToWord : 
                         (typeof emojiToWord === 'function' ? emojiToWord : (e) => 'tag');
        
        const hashtags = selectedTags.map(tag => `#${wordFunc(tag)}`).join(' ');
        
        if (elements.previewContent) {
            elements.previewContent.textContent = `"${hashtags}" (${hashtags.length} chars)`;
        }
    }

    // --- 5. TAGS MANAGEMENT ---
    function renderTags() {
        if (!elements.tagsContainer) return;
        
        elements.tagsContainer.innerHTML = '';
        
        if (selectedTags.length === 0) {
            elements.tagsContainer.innerHTML = '<span class="empty-msg">Επίλεξε emojis ως tags</span>';
        } else {
            selectedTags.forEach(tag => {
                const chip = document.createElement('div');
                chip.className = 'tag-chip';
                chip.innerHTML = `${tag}<span class="remove-tag" title="Αφαίρεση">×</span>`;
                
                const removeBtn = chip.querySelector('.remove-tag');
                if (removeBtn) {
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        removeTag(tag);
                    });
                }
                
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
            if (char) {
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
            }
        });
    }

    // --- 6. DRAFT SAVE & LOAD ---
    function saveDraft() {
        const draft = {
            content: elements.contentInput ? elements.contentInput.value : '',
            tags: selectedTags,
            timestamp: Date.now()
        };
        try {
            localStorage.setItem('update_draft', JSON.stringify(draft));
        } catch(e) { console.warn("Could not save draft:", e); }
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
        } catch(e) { console.error("Error loading draft", e); }
    }

    // --- 7. EMOJI DROPDOWN INITIALIZATION ---
    function initEmojiDropdown() {
        if (!elements.categoriesContainer) {
            console.error("categoriesContainer element not found!");
            return;
        }

        // Προσπαθούμε να πάρουμε τις κατηγορίες από το εξωτερικό αρχείο ή χρησιμοποιούμε fallback
        const categories = window.EMOJI_CATEGORIES || [];
        
        if (categories.length === 0) {
            console.warn("No EMOJI_CATEGORIES found. Using minimal fallback.");
            // Fallback category αν δεν φορτώσει το emoji-data.js
            categories.push({
                title: '😊 Smiles & Emotion',
                emojis: ['😀','😃','😄','😁','😅','😂','🤣','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘']
            });
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
                btn.title = emoji; // Το title θα χρησιμοποιηθεί για search
                
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

        // Φόρτωση πρόσφατων (αν υπάρχει updates.json)
        loadRecentEmojis();
    }

    async function loadRecentEmojis() {
        if (!elements.recentEmojisGrid) return;
        
        try {
            const response = await fetch('./updates.json');
            if (!response.ok) throw new Error('File not found');
            
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
            if (elements.recentEmojisCategory) elements.recentEmojisCategory.classList.add('hidden');
            // Σιωπηλά αποτυχαίνει αν δεν υπάρχει το αρχείο (κανονική συμπεριφορά αρχικά)
        }
    }

    // --- 8. SEARCH FUNCTIONALITY ---
    function setupSearch() {
        if (!elements.emojiSearch) {
            console.error("CRITICAL: Search input (id='emojiSearch') NOT FOUND in HTML. Check admin.html.");
            return;
        }

        elements.emojiSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const categories = document.querySelectorAll('.emoji-category');
            
            categories.forEach(cat => {
                const buttons = cat.querySelectorAll('.char-btn');
                let visibleCount = 0;
                
                buttons.forEach(btn => {
                    const title = (btn.getAttribute('title') || '').toLowerCase();
                    const char = btn.getAttribute('data-char') || '';
                    // Αναζήτηση στον τίτλο ή στο emoji itself
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
    }

    // --- 9. GITHUB SUBMIT LOGIC ---
    function safeBase64Decode(str) { 
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch(e) {
            console.error("Base64 decode error", e);
            return '{}';
        }
    }

    async function submitUpdate() {
        const dateDisplay = elements.dateInput ? elements.dateInput.value : '';
        const time = elements.timeInput ? elements.timeInput.value.trim() : '';
        const content = elements.contentInput ? elements.contentInput.value.trim() : '';
        
        const blueskyPost = document.getElementById('blueskyPost')?.checked || false;
        const mastodonPost = document.getElementById('mastodonPost')?.checked || false;
        const hasHashtagsConvert = document.getElementById('hashtagsConvert')?.checked || false;

        // Validations
        if (!GITHUB_TOKEN || !GITHUB_TOKEN.startsWith('ghp_')) {
            alert('⚠️ Παρακαλώ εισάγετε το GitHub Token πρώτα!');
            if (elements.tokenWrapper) elements.tokenWrapper.classList.add('show');
            if (elements.githubTokenInput) elements.githubTokenInput.focus();
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

        if (elements.submitBtn) {
            elements.submitBtn.disabled = true;
            elements.submitBtn.textContent = 'Αποστολή...';
        }
        if (elements.statusDiv) {
            elements.statusDiv.style.display = 'none';
            elements.statusDiv.className = '';
        }

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
                        console.warn('⚠️ SHA Conflict. Retrying... (' + retries + ' left)');
                        retries--;
                        await new Promise(r => setTimeout(r, 1500));
                    } else {
                        const errJson = await commitRes.json().catch(() => ({}));
                        throw new Error(errJson.message || 'Commit failed: ' + commitRes.status);
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
                try {
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
                    if (!dispatchRes.ok) {
                        console.warn('Social trigger failed:', await dispatchRes.text());
                    } else {
                        console.log('✅ Social media workflow triggered.');
                    }
                } catch (socialErr) {
                    console.warn('Social trigger error:', socialErr);
                }
            }

            // Success UI
            if (elements.statusDiv) {
                elements.statusDiv.textContent = '✅ Επιτυχία! Η ενημέρωση καταχωρήθηκε.';
                elements.statusDiv.className = 'success';
                elements.statusDiv.style.display = 'block';
            }

            // Reset Form
            if (elements.contentInput) elements.contentInput.value = '';
            selectedTags = [];
            renderTags();
            localStorage.removeItem('update_draft');
            updateCharCounter();
            if (elements.submitBtn) {
                elements.submitBtn.disabled = false;
                elements.submitBtn.textContent = '📤 Αποστολή';
            }

        } catch (error) {
            console.error(error);
            if (elements.statusDiv) {
                elements.statusDiv.textContent = `❌ Σφάλμα: ${error.message}`;
                elements.statusDiv.className = 'error';
                elements.statusDiv.style.display = 'block';
            }
            if (elements.submitBtn) {
                elements.submitBtn.disabled = false;
                elements.submitBtn.textContent = '📤 Αποστολή';
            }
        }
    }

    // --- 10. EVENT BINDING (SAFETY CHECKS INCLUDED) ---
    function bindEvents() {
        // Debug logging for missing elements
        Object.keys(elements).forEach(key => {
            if (!elements[key]) {
                console.warn(`[bindEvents] Element '${key}' is null. Check ID in HTML.`);
            }
        });

        // Token Toggle
        if (elements.tokenToggle) {
            elements.tokenToggle.addEventListener('click', () => {
                if (!elements.tokenWrapper) return;
                elements.tokenWrapper.classList.toggle('show');
                elements.tokenToggle.textContent = elements.tokenWrapper.classList.contains('show') ? '🔓 Κρύψε Token' : '🔐 GitHub Token';
                if (elements.tokenWrapper.classList.contains('show') && elements.githubTokenInput) {
                    elements.githubTokenInput.focus();
                }
            });
        }

        // Token Input
        if (elements.githubTokenInput) {
            elements.githubTokenInput.addEventListener('input', () => {
                const val = elements.githubTokenInput.value.trim();
                GITHUB_TOKEN = val;
                if (elements.tokenStatus) {
                    elements.tokenStatus.innerHTML = val.startsWith('ghp_') 
                        ? '<span style="color: #4CAF50;">✅ Valid Token</span>' 
                        : '<span style="color: #ff9800;">⚠️ Invalid or missing</span>';
                }
            });
        }

        // Social Toggle
        if (elements.socialToggle) {
            elements.socialToggle.addEventListener('click', () => {
                if (!elements.socialWrapper) return;
                elements.socialWrapper.classList.toggle('show');
                elements.socialToggle.textContent = elements.socialWrapper.classList.contains('show') ? '🔓 Κλείσε ρυθμίσεις' : '📱 Social Media & Hashtags';
            });
        }

        // Emoji Dropdown Toggle
        if (elements.emojiDropdownBtn && elements.emojiDropdownMenu) {
            elements.emojiDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                elements.emojiDropdownMenu.classList.toggle('show');
                if (elements.emojiDropdownMenu.classList.contains('show') && elements.emojiSearch) {
                    elements.emojiSearch.focus();
                }
            });
        }

        // Click outside to close dropdown
        document.addEventListener('click', (e) => {
            if (elements.emojiDropdownMenu && elements.emojiDropdownBtn) {
                if (!elements.emojiDropdownMenu.contains(e.target) && !elements.emojiDropdownBtn.contains(e.target)) {
                    elements.emojiDropdownMenu.classList.remove('show');
                }
            }
        });

        // Search Input (CRITICAL FIX HERE)
        setupSearch();

        // Submit Button
        if (elements.submitBtn) {
            elements.submitBtn.addEventListener('click', submitUpdate);
        }
        
        // Clear Button
        if (elements.clearBtn) {
            elements.clearBtn.addEventListener('click', () => {
                if (confirm('Είσαι σίγουρος/η ότι θέλεις να καθαρίσεις;')) {
                    if (elements.contentInput) elements.contentInput.value = '';
                    selectedTags = [];
                    renderTags();
                    localStorage.removeItem('update_draft');
                    updateCharCounter();
                    if (elements.statusDiv) elements.statusDiv.style.display = 'none';
                }
            });
        }

        // Content Input
        if (elements.contentInput) {
            elements.contentInput.addEventListener('input', updateCharCounter);
        }
        
        // Date/Time Auto-fill
        if (elements.dateInput && elements.timeInput) {
            const now = new Date();
            elements.dateInput.value = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
            elements.timeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }
    }

    // --- 11. INITIALIZATION ---
    function init() {
        initElements();
        
        // Verify critical elements immediately
        if (!elements.emojiSearch) {
            console.error("STOPPING INIT: Missing id='emojiSearch' in admin.html");
            return;
        }

        loadSavedDraft();
        initEmojiDropdown();
        bindEvents();
        updateCharCounter(); // Initial count
        
        console.log('✅ Lumo Admin Panel Initialized Successfully');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
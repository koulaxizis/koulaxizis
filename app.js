// === app.js - Full Feature Update ===

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const GITHUB_USER = 'koulaxizis';
    const REPO_NAME = 'koulaxizis';
    const BRANCH = 'main';
    let GITHUB_TOKEN = '';
    let selectedTags = [];
    const MAX_TAGS = 3;
    const AUTOSAVE_DELAY = 2000;
    const WARNING_THRESHOLD = 0.95;
    
    // --- STATE MANAGEMENT ---
    let currentDraftId = null;
    let autosaveTimer = null;
    let usedTagsCache = [];
    let submissionStage = 0;

    // --- EMOJI NAME MAP ---
    const emojiNameMap = {};

    window.emojiToWord = function(emoji) {
        return emojiNameMap[emoji] || '';
    };

    window.emojiToHashtag = function(emoji) {
        const slug = emojiNameMap[emoji];
        if (!slug) return '';
        return slug.split('_').map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join('');
    };

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
        elements.wordCounter = document.getElementById('wordCounter');
        elements.fullCharCounter = document.getElementById('fullCharCounter');
        elements.readingTime = document.getElementById('readingTime');
        elements.tagsContainer = document.getElementById('tagsContainer');
        elements.tokenToggle = document.getElementById('tokenToggle');
        elements.tokenWrapper = document.getElementById('tokenWrapper');
        elements.githubTokenInput = document.getElementById('githubToken');
        elements.tokenStatus = document.getElementById('tokenStatus');
        elements.emojiTriggerBtn = document.getElementById('emojiTriggerBtn');
        elements.emojiPickerContainer = document.getElementById('emojiPickerContainer');
        elements.specialCharsBtn = document.getElementById('specialCharsBtn');
        elements.specialCharsDropdown = document.getElementById('specialCharsDropdown');
        elements.enableLimitToggle = document.getElementById('enableLimitToggle');
        elements.userLimitInput = document.getElementById('userLimitInput');
        elements.usedTagsPanel = document.getElementById('usedTagsPanel');
        elements.usedTagsList = document.getElementById('usedTagsList');
        elements.clearUsedTags = document.getElementById('clearUsedTags');
        elements.draftManager = document.getElementById('draftManager');
        elements.draftList = document.getElementById('draftList');
        elements.newDraftBtn = document.getElementById('newDraftBtn');
        elements.progressIndicator = document.getElementById('progressIndicator');
        elements.progressText = document.getElementById('progressText');
        elements.progressFill = document.getElementById('progressFill');
    }

    // === STATS CALCULATIONS ===
    function calculateStats(text) {
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const avgWordsPerMinute = 200;
        const readingMinutes = Math.ceil(wordCount / avgWordsPerMinute);
        
        return {
            chars: charCount,
            words: wordCount,
            readingTime: readingMinutes
        };
    }

    // === UPDATE ALL COUNTERS ===
    function updateAllCounters() {
        const text = elements.contentInput ? elements.contentInput.value : '';
        const stats = calculateStats(text);

        if (elements.wordCounter) elements.wordCounter.textContent = stats.words;
        if (elements.fullCharCounter) elements.fullCharCounter.textContent = stats.chars;
        if (elements.readingTime) elements.readingTime.textContent = stats.readingTime + ' min';

        // Char limit logic with smart warning
        let limit = null;
        if (elements.enableLimitToggle && elements.enableLimitToggle.checked) {
            limit = parseInt(elements.userLimitInput.value) || 280;
        }

        if (elements.charCounter && limit) {
            elements.charCounter.className = 'char-counter';
            const pct = stats.chars / limit;
            let colorClass = '';

            if (pct < WARNING_THRESHOLD) {
                colorClass = 'counter-green';
            } else if (pct < 1) {
                colorClass = 'counter-yellow';
                elements.charCounter.classList.add('counter-warning');
            } else {
                colorClass = 'counter-red';
                elements.charCounter.classList.remove('counter-warning');
            }

            elements.charCounter.className = 'char-counter ' + colorClass;
            elements.charCounter.textContent = stats.chars + ' / ' + limit;
        } else if (elements.charCounter) {
            elements.charCounter.textContent = stats.chars;
        }

        // Debounced autosave
        scheduleAutoSave();
        return stats;
    }

    // === AUTOSAVE WITH IDLE DETECTION ===
    function scheduleAutoSave() {
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(saveCurrentDraft, AUTOSAVE_DELAY);
    }

    function saveCurrentDraft() {
        const text = elements.contentInput ? elements.contentInput.value : '';
        const timestamp = Date.now();
        const draftId = currentDraftId || 'draft-' + timestamp;
        
        const draftData = {
            id: draftId,
            content: text,
            tags: selectedTags,
            timestamp: timestamp,
            createdAt: new Date(timestamp).toLocaleString()
        };

        // Save to localStorage
        let drafts = getAllDrafts();
        drafts[draftId] = draftData;
        try {
            localStorage.setItem('admin_drafts', JSON.stringify(drafts));
            currentDraftId = draftId;
            updateDraftList();
        } catch(e) {
            console.error('Failed to save draft:', e);
        }
    }

    function getAllDrafts() {
        try {
            const saved = localStorage.getItem('admin_drafts');
            return saved ? JSON.parse(saved) : {};
        } catch(e) {
            return {};
        }
    }

    function loadDraft(draftId) {
        const drafts = getAllDrafts();
        const draft = drafts[draftId];
        if (!draft) return;

        if (elements.contentInput) elements.contentInput.value = draft.content || '';
        selectedTags = draft.tags || [];
        currentDraftId = draft.id;
        renderTags();
        updateAllCounters();
        
        // Switch to that draft's timestamp
        const now = new Date(draft.timestamp);
        if (elements.dateInput) elements.dateInput.value = String(now.getDate()).padStart(2,'0') + '/' + String(now.getMonth()+1).padStart(2,'0') + '/' + now.getFullYear();
        if (elements.timeInput) elements.timeInput.value = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    }

    function deleteDraft(draftId) {
        if (!confirm('Delete this draft?')) return;
        let drafts = getAllDrafts();
        delete drafts[draftId];
        try {
            localStorage.setItem('admin_drafts', JSON.stringify(drafts));
        } catch(e) {}
        if (currentDraftId === draftId) {
            currentDraftId = null;
        }
        updateDraftList();
    }

    function updateDraftList() {
        if (!elements.draftList) return;
        const drafts = getAllDrafts();
        const draftIds = Object.keys(drafts).sort((a,b) => drafts[b].timestamp - drafts[a].timestamp);
        
        if (draftIds.length === 0) {
            elements.draftManager.classList.remove('visible');
            return;
        }

        elements.draftManager.classList.add('visible');
        elements.draftList.innerHTML = '';
        
        draftIds.forEach(id => {
            const draft = drafts[id];
            const div = document.createElement('div');
            div.className = 'draft-item';
            if (id === currentDraftId) div.style.background = '#3a3a3a';
            
            div.innerHTML = `
                <div class="draft-info">
                    <div class="draft-title">${draft.content.substring(0, 40)}${draft.content.length > 40 ? '...' : ''}</div>
                    <div class="draft-meta">${draft.createdAt} | ${draft.tags.length} tags</div>
                </div>
                <div class="draft-actions">
                    <button class="draft-btn" title="Load" onclick="window.loadAdminDraft('${id}')"><i class="fa-solid fa-eye"></i></button>
                    <button class="draft-btn" title="Delete" onclick="window.deleteAdminDraft('${id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            div.querySelector('.draft-btn:first-child').addEventListener('click', () => loadDraft(id));
            div.querySelector('.draft-btn:last-child').addEventListener('click', () => deleteDraft(id));
            elements.draftList.appendChild(div);
        });
    }

    // === GLOBAL FUNCTIONS FOR DRAFT BUTTONS ===
    window.loadAdminDraft = function(draftId) {
        loadDraft(draftId);
    };

    window.deleteAdminDraft = function(draftId) {
        deleteDraft(draftId);
    };

    // === NEW DRAFT BUTTON ===
    if (elements.newDraftBtn) {
        elements.newDraftBtn.addEventListener('click', function() {
            if (elements.contentInput && elements.contentInput.value) {
                saveCurrentDraft();
            }
            elements.contentInput.value = '';
            selectedTags = [];
            renderTags();
            currentDraftId = 'draft-' + Date.now();
            updateDraftList();
            updateAllCounters();
            setDateTimeNow();
        });
    }

    // === FETCH USED TAGS FROM UPDATES.JSON ===
    async function loadUsedTags() {
        try {
            const fileUrl = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/updates.json?ref=${BRANCH}`;
            const response = await fetch(fileUrl, {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                console.warn('Could not load used tags:', response.statusText);
                return;
            }

            const data = await response.json();
            const content = safeBase64Decode(data.content);
            const updatesData = JSON.parse(content);

            // Count tag usage
            const tagCounts = {};
            if (updatesData.updates) {
                updatesData.updates.forEach(update => {
                    if (update.tags && Array.isArray(update.tags)) {
                        update.tags.forEach(tag => {
                            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                        });
                    }
                });
            }

            // Sort by usage count
            usedTagsCache = Object.entries(tagCounts)
                .sort((a,b) => b[1] - a[1])
                .slice(0, 50)
                .map(([emoji, count]) => ({ emoji, count }));

            renderUsedTags();
            elements.usedTagsPanel.classList.add('visible');

        } catch (error) {
            console.warn('Failed to load used tags:', error.message);
        }
    }

    function renderUsedTags() {
        if (!elements.usedTagsList) return;
        elements.usedTagsList.innerHTML = '';
        
        usedTagsCache.forEach(item => {
            const chip = document.createElement('div');
            chip.className = 'used-tag-chip count-badge';
            chip.setAttribute('data-count', item.count);
            chip.textContent = item.emoji;
            chip.title = `Used ${item.count} times`;
            chip.addEventListener('click', function() {
                addTag(item.emoji);
            });
            elements.usedTagsList.appendChild(chip);
        });
    }

    // Clear used tags cache
    if (elements.clearUsedTags) {
        elements.clearUsedTags.addEventListener('click', function() {
            usedTagsCache = [];
            elements.usedTagsList.innerHTML = '';
            elements.usedTagsPanel.classList.remove('visible');
            localStorage.removeItem('admin_used_tags_cache');
        });
    }

    // === OTHER FUNCTIONS (unchanged) ===
    function renderTags() {
        if (!elements.tagsContainer) return;
        elements.tagsContainer.innerHTML = '';
        if (selectedTags.length === 0) {
            elements.tagsContainer.innerHTML = '';
        } else {
            selectedTags.forEach(function(tag) {
                var chip = document.createElement('div');
                chip.className = 'tag-chip';
                chip.innerHTML = tag + '<span class="remove-tag">×</span>';
                chip.querySelector('.remove-tag').addEventListener('click', function(e) {
                    e.stopPropagation();
                    removeTag(tag);
                });
                elements.tagsContainer.appendChild(chip);
            });
        }
    }

    function addTag(emoji) {
        if (selectedTags.includes(emoji)) return;
        if (selectedTags.length >= MAX_TAGS) {
            alert('Μέγιστο ' + MAX_TAGS + ' tags.');
            return;
        }
        selectedTags.push(emoji);
        renderTags();
        updateAllCounters();
    }

    function removeTag(emoji) {
        selectedTags = selectedTags.filter(function(t) { return t !== emoji; });
        renderTags();
        updateAllCounters();
    }

    function enforceLimit(e) {
        if (!elements.enableLimitToggle || !elements.enableLimitToggle.checked) return;
        if (!elements.userLimitInput) return;

        const limit = parseInt(elements.userLimitInput.value) || 280;
        const currentLength = elements.contentInput.value.length;

        if (currentLength >= limit) {
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab', 'Escape'];
            if (allowedKeys.includes(e.key)) return;
            if (e.ctrlKey || e.metaKey) return;

            e.preventDefault();

            elements.contentInput.style.borderColor = '#f44336';
            elements.contentInput.style.boxShadow = '0 0 0 2px rgba(244, 67, 54, 0.3)';
            clearTimeout(elements._lockTimer);
            elements._lockTimer = setTimeout(function() {
                elements.contentInput.style.borderColor = '';
                elements.contentInput.style.boxShadow = '';
            }, 400);
        }
    }

    function enforcePasteLimit(e) {
        if (!elements.enableLimitToggle || !elements.enableLimitToggle.checked) return;
        const limit = parseInt(elements.userLimitInput.value) || 280;
        const currentLength = elements.contentInput.value.length;
        const remaining = limit - currentLength;

        if (remaining <= 0) {
            e.preventDefault();
            return;
        }

        const pasteData = (e.clipboardData || window.clipboardData).getData('text');
        if (pasteData.length > remaining) {
            e.preventDefault();
            const truncated = pasteData.substring(0, remaining);
            const start = elements.contentInput.selectionStart;
            const end = elements.contentInput.selectionEnd;
            const text = elements.contentInput.value;
            elements.contentInput.value = text.substring(0, start) + truncated + text.substring(end);
            elements.contentInput.selectionStart = elements.contentInput.selectionEnd = start + truncated.length;
            updateAllCounters();
            elements.contentInput.focus();
        }
    }

    function initEmojiPicker() {
        if (!elements.emojiTriggerBtn || !elements.emojiPickerContainer) {
            console.error('Emoji picker elements not found!');
            return;
        }

        if (typeof picmo === 'undefined') {
            setTimeout(initEmojiPicker, 100);
            return;
        }

        var picker = picmo.createPicker({
            rootElement: elements.emojiPickerContainer,
            referenceElement: elements.emojiTriggerBtn,
            emojiSize: '1.5em',
            showPreview: true,
            showRecents: true,
            recentsCount: 50,
            numColumns: 8,
            visibleRows: 6
        });

        elements.emojiTriggerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            elements.emojiPickerContainer.classList.toggle('active');
        });

        picker.addEventListener('emoji:select', function(event) {
            var emojiChar = event.emoji || (event.detail && event.detail.emoji) || '';
            if (!emojiChar) return;

            var rawName = event.label || event.name || (event.detail && (event.detail.label || event.detail.name)) || '';
            if (rawName) {
                var slug = rawName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '_');
                emojiNameMap[emojiChar] = slug;
            }

            addTag(emojiChar);
            elements.emojiPickerContainer.classList.remove('active');
        });

        document.addEventListener('click', function(e) {
            if (!elements.emojiPickerContainer.contains(e.target) && !elements.emojiTriggerBtn.contains(e.target)) {
                elements.emojiPickerContainer.classList.remove('active');
            }
        });
    }

    function initSpecialCharsDropdown() {
        if (!elements.specialCharsBtn || !elements.specialCharsDropdown) return;

        elements.specialCharsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            elements.specialCharsDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!elements.specialCharsDropdown.contains(e.target) && !elements.specialCharsBtn.contains(e.target)) {
                elements.specialCharsDropdown.classList.remove('show');
            }
        });

        var specialBtns = document.querySelectorAll('.special-char-btn');
        specialBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var char = btn.getAttribute('data-char');
                if (elements.contentInput) {
                    if (elements.enableLimitToggle && elements.enableLimitToggle.checked) {
                        var limit = parseInt(elements.userLimitInput.value) || 280;
                        if (elements.contentInput.value.length >= limit) return;
                    }
                    var start = elements.contentInput.selectionStart;
                    var end = elements.contentInput.selectionEnd;
                    var text = elements.contentInput.value;
                    elements.contentInput.value = text.substring(0, start) + char + text.substring(end);
                    elements.contentInput.selectionStart = elements.contentInput.selectionEnd = start + 1;
                    elements.contentInput.focus();
                    updateAllCounters();
                }
            });
        });
    }

    function safeBase64Decode(str) {
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch(e) {
            return '{}';
        }
    }

    // === SUBMIT WITH PROGRESS & STATE RECOVERY ===
    async function submitUpdate() {
        const dateDisplay = elements.dateInput ? elements.dateInput.value : '';
        const time = elements.timeInput ? elements.timeInput.value.trim() : '';
        const content = elements.contentInput ? elements.contentInput.value.trim() : '';

        let limit = null;
        if (elements.enableLimitToggle && elements.enableLimitToggle.checked) {
            limit = parseInt(elements.userLimitInput.value) || 280;
        }
        const totalLength = content.length;

        if (limit && totalLength > limit) {
            alert('⚠️ Ξεπέρασες το όριο!\nΧαρακτήρες: ' + totalLength + '\nΌριο: ' + limit);
            resetSubmitButton();
            return;
        }

        if (!GITHUB_TOKEN || !GITHUB_TOKEN.startsWith('ghp_')) {
            alert('⚠️ GitHub Token required!');
            if(elements.tokenWrapper) elements.tokenWrapper.classList.add('show');
            return;
        }
        if (selectedTags.length < 1) { alert('Select at least 1 tag.'); return; }
        if (!dateDisplay || !time || !content) { alert('Fill all fields!'); return; }

        // Show progress
        showProgress('Connecting to GitHub...', 10);
        
        if (elements.submitBtn) { 
            elements.submitBtn.disabled = true; 
            elements.submitBtn.textContent = 'Αποστολή...'; 
        }
        if (elements.statusDiv) { elements.statusDiv.style.display = 'none'; }

        try {
            const parts = dateDisplay.split('/');
            const d = parts[0], m = parts[1], y = parts[2];
            const isoDate = y + '-' + m + '-' + d + 'T' + time + ':00';
            const months = ['Ιανουαρίου','Φεβρουαρίου','Μαρτίου','Απριλίου','Μαΐου','Ιουνίου','Ιουλίου','Αυγούστου','Σεπτεμβρίου','Οκτωβρίου','Νοεμβρίου','Δεκεμβρίου'];
            const formattedDate = d + ' ' + months[parseInt(m)-1] + ' ' + y + ', ' + time;

            const newUpdate = { date: isoDate, displayDate: formattedDate, content: content, tags: selectedTags };
            const fileUrl = 'https://api.github.com/repos/' + GITHUB_USER + '/' + REPO_NAME + '/contents/updates.json?ref=' + BRANCH;
            
            // Save draft before submission in case of failure
            saveCurrentDraft();
            submissionStage = 1;
            showProgress('Fetching current updates...', 30);

            let retries = 3;
            while (retries > 0) {
                const fRes = await fetch(fileUrl, {
                    headers: {
                        Authorization: 'token ' + GITHUB_TOKEN,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (!fRes.ok) throw new Error("Load fail");
                
                submissionStage = 2;
                showProgress('Processing update...', 50);

                const fData = await fRes.json();
                var data = JSON.parse(safeBase64Decode(fData.content));
                if (!data.updates) data.updates = [];
                data.updates.unshift(newUpdate);
                
                const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
                
                submissionStage = 3;
                showProgress('Committing to GitHub...', 75);

                const cRes = await fetch(fileUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'token ' + GITHUB_TOKEN,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: 'Auto: ' + formattedDate,
                        content: newContent,
                        sha: fData.sha,
                        branch: BRANCH
                    })
                });
                
                if (cRes.ok) break;
                
                if (cRes.status === 422) {
                    retries--;
                    await new Promise(function(r) { setTimeout(r, 1500); });
                } else {
                    var errData = await cRes.json();
                    throw new Error(errData.message || "Fail");
                }
            }

            // Success
            hideProgress();
            if (elements.statusDiv) {
                elements.statusDiv.textContent = '✅ Επιτυχία!';
                elements.statusDiv.className = 'success';
                elements.statusDiv.style.display = 'block';
            }
            if (elements.contentInput) elements.contentInput.value = '';
            selectedTags = [];
            renderTags();
            updateAllCounters();
            setDateTimeNow();
            
            // Invalidate used tags cache for fresh data
            usedTagsCache = [];
            loadUsedTags();

            if (elements.submitBtn) {
                elements.submitBtn.disabled = false;
                elements.submitBtn.textContent = '📤 Αποστολή';
            }

        } catch (error) {
            hideProgress();
            
            // Attempt recovery - restore content from draft
            console.log('Submission failed, draft saved at stage:', submissionStage);
            
            if (elements.statusDiv) {
                elements.statusDiv.textContent = '❌ Σφάλμα: ' + error.message + '\nYour content was saved as draft.';
                elements.statusDiv.className = 'error';
                elements.statusDiv.style.display = 'block';
            }
            
            if (elements.submitBtn) {
                elements.submitBtn.disabled = false;
                elements.submitBtn.textContent = '📤 Αποστολή';
            }
        }
    }

    function showProgress(message, percentage) {
        if (elements.progressIndicator) {
            elements.progressIndicator.classList.add('active');
            elements.progressText.textContent = message;
            elements.progressFill.style.width = percentage + '%';
        }
    }

    function hideProgress() {
        if (elements.progressIndicator) {
            elements.progressIndicator.classList.remove('active');
        }
    }

    function resetSubmitButton() {
        if (elements.submitBtn) {
            elements.submitBtn.disabled = false;
            elements.submitBtn.textContent = '📤 Αποστολή';
        }
    }

    function setDateTimeNow() {
        const now = new Date();
        if (elements.dateInput) elements.dateInput.value = String(now.getDate()).padStart(2,'0') + '/' + String(now.getMonth()+1).padStart(2,'0') + '/' + now.getFullYear();
        if (elements.timeInput) elements.timeInput.value = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    }

    // === KEYBOARD SHORTCUTS ===
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl+Enter → Submit
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                submitUpdate();
            }
            
            // Escape → Close dropdowns
            if (e.key === 'Escape') {
                e.preventDefault();
                if (elements.emojiPickerContainer) elements.emojiPickerContainer.classList.remove('active');
                if (elements.specialCharsDropdown) elements.specialCharsDropdown.classList.remove('show');
            }
            
            // Alt+C → Clear (with confirmation)
            if (e.altKey && e.key.toLowerCase() === 'c') {
                e.preventDefault();
                if (confirm('Clear form?')) {
                    if (elements.contentInput) elements.contentInput.value = '';
                    selectedTags = [];
                    renderTags();
                    updateAllCounters();
                    setDateTimeNow();
                    if (elements.statusDiv) elements.statusDiv.style.display = 'none';
                }
            }
        });
    }

    // === EVENT BINDING ===
    function bindEvents() {
        if (elements.tokenToggle) elements.tokenToggle.addEventListener('click', function() {
            elements.tokenWrapper.classList.toggle('show');
            elements.tokenToggle.textContent = elements.tokenWrapper.classList.contains('show') ? '🔓 Κρύψε Token' : '🔐 GitHub Token';
            if(elements.tokenWrapper.classList.contains('show')) elements.githubTokenInput.focus();
        });
        if (elements.githubTokenInput) elements.githubTokenInput.addEventListener('input', function() {
            GITHUB_TOKEN = elements.githubTokenInput.value.trim();
            if (elements.tokenStatus) elements.tokenStatus.innerHTML = GITHUB_TOKEN.startsWith('ghp_') ? '<span style="color:#4CAF50">✅</span>' : '<span style="color:#ff9800">⚠️</span>';
        });
        if (elements.submitBtn) elements.submitBtn.addEventListener('click', submitUpdate);
        if (elements.clearBtn) elements.clearBtn.addEventListener('click', function() {
            if (confirm('Καθαρισμός;')) {
                if (elements.contentInput) elements.contentInput.value = '';
                selectedTags = [];
                renderTags();
                updateAllCounters();
                setDateTimeNow();
                if (elements.statusDiv) elements.statusDiv.style.display = 'none';
            }
        });

        if (elements.contentInput) {
            elements.contentInput.addEventListener('input', updateAllCounters);
            elements.contentInput.addEventListener('keydown', function(e) {
                enforceLimit(e);
            });
            elements.contentInput.addEventListener('paste', enforcePasteLimit);
        }

        if (elements.enableLimitToggle && elements.userLimitInput) {
            elements.enableLimitToggle.addEventListener('change', function() {
                updateAllCounters();
            });
            elements.userLimitInput.addEventListener('input', updateAllCounters);
            elements.userLimitInput.addEventListener('wheel', function(e) {
                e.preventDefault();
            });
        }

        setDateTimeNow();
    }

    // === INIT ===
    function init() {
        initElements();
        initKeyboardShortcuts();
        bindEvents();
        initEmojiPicker();
        initSpecialCharsDropdown();
        
        // Load drafts list
        updateDraftList();
        
        // Load used tags from GitHub
        if (GITHUB_TOKEN && GITHUB_TOKEN.startsWith('ghp_')) {
            loadUsedTags();
        } else {
            // Try to load when token is entered
            const tokenObserver = new MutationObserver(function() {
                if (GITHUB_TOKEN && GITHUB_TOKEN.startsWith('ghp_')) {
                    loadUsedTags();
                    tokenObserver.disconnect();
                }
            });
            if (elements.tokenWrapper) {
                tokenObserver.observe(elements.tokenWrapper, { childList: true, subtree: true });
            }
        }
        
        updateAllCounters();
        console.log("✅ Admin Panel Ready - All Features Loaded");
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
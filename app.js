// === app.js - Token Persistence Added ===

(function() {
    'use strict';

    const GITHUB_USER = 'koulaxizis';
    const REPO_NAME = 'koulaxizis';
    const BRANCH = 'main';
    let GITHUB_TOKEN = '';
    let selectedTags = [];
    const MAX_TAGS = 3;
    const AUTOSAVE_DELAY = 2000;
    const WARNING_THRESHOLD = 0.95;

    let currentDraftId = null;
    let autosaveTimer = null;
    let usedTagsCache = [];
    let submissionStage = 0;

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
        elements.usedTagsToggle = document.getElementById('usedTagsToggle');
        elements.usedTagsContent = document.getElementById('usedTagsContent');
        elements.usedTagsList = document.getElementById('usedTagsList');
        elements.draftManager = document.getElementById('draftManager');
        elements.draftList = document.getElementById('draftList');
        elements.newDraftBtn = document.getElementById('newDraftBtn');
        elements.deleteAllDraftsBtn = document.getElementById('deleteAllDraftsBtn');
        elements.progressIndicator = document.getElementById('progressIndicator');
        elements.progressText = document.getElementById('progressText');
        elements.progressFill = document.getElementById('progressFill');
    }

    // === SESSION STORAGE FOR TOKEN (NEW) ===
    function loadTokenFromSession() {
        const savedToken = sessionStorage.getItem('admin_github_token');
        if (savedToken) {
            GITHUB_TOKEN = savedToken;
            if (elements.githubTokenInput) {
                elements.githubTokenInput.value = savedToken;
            }
            if (elements.tokenStatus) {
                elements.tokenStatus.innerHTML = savedToken.startsWith('ghp_') ? '<span style="color:#4CAF50">✅</span>' : '<span style="color:#ff9800">⚠️</span>';
            }
            console.log('✅ Token restored from session');
            loadUsedTags();
        }
    }

    function saveTokenToSession() {
        if (GITHUB_TOKEN && GITHUB_TOKEN.startsWith('ghp_')) {
            sessionStorage.setItem('admin_github_token', GITHUB_TOKEN);
        }
    }

    // === STATS ===
    function calculateStats(text) {
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));
        return { chars: charCount, words: wordCount, readingTime: wordCount === 0 ? 0 : readingMinutes };
    }

    function updateAllCounters() {
        const text = elements.contentInput ? elements.contentInput.value : '';
        const stats = calculateStats(text);

        if (elements.wordCounter) elements.wordCounter.textContent = stats.words;
        if (elements.fullCharCounter) elements.fullCharCounter.textContent = stats.chars;
        if (elements.readingTime) elements.readingTime.textContent = stats.readingTime + ' min';

        let limit = null;
        if (elements.enableLimitToggle && elements.enableLimitToggle.checked) {
            limit = parseInt(elements.userLimitInput.value) || 280;
        }

        if (elements.charCounter) {
            elements.charCounter.className = 'char-counter';
            elements.charCounter.classList.remove('counter-warning');

            if (limit) {
                const pct = stats.chars / limit;

                if (pct < 0.70) {
                    elements.charCounter.classList.add('counter-green');
                } else if (pct < WARNING_THRESHOLD) {
                    elements.charCounter.classList.add('counter-yellow');
                } else if (pct < 1) {
                    elements.charCounter.classList.add('counter-yellow');
                    elements.charCounter.classList.add('counter-warning');
                } else {
                    elements.charCounter.classList.add('counter-red');
                }

                elements.charCounter.textContent = stats.chars + ' / ' + limit;
            } else {
                elements.charCounter.textContent = stats.chars;
            }
        }

        scheduleAutoSave();
        return stats;
    }

    // === AUTOSAVE ===
    function scheduleAutoSave() {
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(saveCurrentDraft, AUTOSAVE_DELAY);
    }

    function saveCurrentDraft() {
        const text = elements.contentInput ? elements.contentInput.value : '';
        if (!text && selectedTags.length === 0) return;

        const timestamp = Date.now();
        const draftId = currentDraftId || ('draft-' + timestamp);

        const draftData = {
            id: draftId,
            content: text,
            tags: selectedTags.slice(),
            timestamp: timestamp,
            createdAt: new Date(timestamp).toLocaleString('el-GR')
        };

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

    function loadMostRecentDraft() {
        const drafts = getAllDrafts();
        const ids = Object.keys(drafts);
        if (ids.length === 0) return;

        let mostRecent = null;
        let mostRecentTime = 0;
        ids.forEach(function(id) {
            if (drafts[id].timestamp > mostRecentTime) {
                mostRecentTime = drafts[id].timestamp;
                mostRecent = id;
            }
        });

        if (mostRecent) {
            loadDraft(mostRecent);
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
    }

    function deleteDraft(draftId) {
        if (!confirm('Delete this draft?')) return;
        let drafts = getAllDrafts();
        delete drafts[draftId];
        try {
            localStorage.setItem('admin_drafts', JSON.stringify(drafts));
        } catch(e) {}
        if (currentDraftId === draftId) currentDraftId = null;
        updateDraftList();
    }

    function deleteAllDrafts() {
        if (!confirm('Διαγραφή όλων των drafts;')) return;
        try {
            localStorage.removeItem('admin_drafts');
        } catch(e) {}
        currentDraftId = null;
        updateDraftList();
    }

    function createNewDraft() {
        if (elements.contentInput && elements.contentInput.value.trim()) {
            saveCurrentDraft();
        }
        if (elements.contentInput) elements.contentInput.value = '';
        selectedTags = [];
        renderTags();
        currentDraftId = 'draft-' + Date.now();
        setDateTimeNow();
        updateAllCounters();
        if (elements.contentInput) elements.contentInput.focus();
    }

    function updateDraftList() {
        if (!elements.draftList) return;
        const drafts = getAllDrafts();
        const draftIds = Object.keys(drafts).sort(function(a,b) {
            return drafts[b].timestamp - drafts[a].timestamp;
        });

        if (draftIds.length === 0) {
            if (elements.draftManager) elements.draftManager.classList.remove('visible');
            return;
        }

        if (elements.draftManager) elements.draftManager.classList.add('visible');
        elements.draftList.innerHTML = '';

        draftIds.forEach(function(id) {
            const draft = drafts[id];
            const div = document.createElement('div');
            div.className = 'draft-item';
            if (id === currentDraftId) div.style.background = '#3a3a3a';

            const preview = draft.content.substring(0, 40) + (draft.content.length > 40 ? '...' : '');

            div.innerHTML =
                '<div class="draft-info">' +
                    '<div class="draft-title">' + escapeHtml(preview) + '</div>' +
                    '<div class="draft-meta">' + draft.createdAt + ' | ' + draft.tags.length + ' tags</div>' +
                '</div>' +
                '<div class="draft-actions">' +
                    '<button class="draft-btn load-draft-btn" title="Load"><i class="fa-solid fa-eye"></i></button>' +
                    '<button class="draft-btn delete-draft-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
                '</div>';

            div.querySelector('.load-draft-btn').addEventListener('click', function() { loadDraft(id); });
            div.querySelector('.delete-draft-btn').addEventListener('click', function() { deleteDraft(id); });

            elements.draftList.appendChild(div);
        });
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // === USED TAGS ===
    async function loadUsedTags() {
        try {
            const rawUrl = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/' + REPO_NAME + '/' + BRANCH + '/updates.json';
            const response = await fetch(rawUrl);

            if (!response.ok) {
                console.warn('Could not load used tags:', response.statusText);
                return;
            }

            const updatesData = await response.json();

            const tagCounts = {};
            if (updatesData.updates) {
                updatesData.updates.forEach(function(update) {
                    if (update.tags && Array.isArray(update.tags)) {
                        update.tags.forEach(function(tag) {
                            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                        });
                    }
                });
            }

            usedTagsCache = Object.entries(tagCounts)
                .sort(function(a,b) { return b[1] - a[1]; })
                .slice(0, 50)
                .map(function(entry) { return { emoji: entry[0], count: entry[1] }; });

            renderUsedTags();
        } catch (error) {
            console.warn('Failed to load used tags:', error.message);
        }
    }

    function renderUsedTags() {
        if (!elements.usedTagsList) return;
        elements.usedTagsList.innerHTML = '';

        if (usedTagsCache.length === 0) return;

        usedTagsCache.forEach(function(item) {
            const chip = document.createElement('div');
            chip.className = 'used-tag-chip';
            chip.textContent = item.emoji;
            chip.title = 'Χρησιμοποιήθηκε ' + item.count + ' φορές';
            chip.setAttribute('data-count', item.count);
            chip.addEventListener('click', function() { addTag(item.emoji); });
            elements.usedTagsList.appendChild(chip);
        });
    }

    // === TAGS ===
    function renderTags() {
        if (!elements.tagsContainer) return;
        elements.tagsContainer.innerHTML = '';
        selectedTags.forEach(function(tag) {
            var chip = document.createElement('div');
            chip.className = 'tag-chip';
            chip.innerHTML = tag + '<span class="remove-tag">\u00d7</span>';
            chip.querySelector('.remove-tag').addEventListener('click', function(e) {
                e.stopPropagation();
                removeTag(tag);
            });
            elements.tagsContainer.appendChild(chip);
        });
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

    // === LIMIT ENFORCEMENT ===
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

    // === EMOJI PICKER ===
    function initEmojiPicker() {
        if (!elements.emojiTriggerBtn || !elements.emojiPickerContainer) return;
        if (typeof picmo === 'undefined') { setTimeout(initEmojiPicker, 100); return; }

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

    // === SPECIAL CHARS ===
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
        try { return decodeURIComponent(escape(atob(str))); }
        catch(e) { return '{}'; }
    }

    function showProgress(message, percentage) {
        if (elements.progressIndicator) {
            elements.progressIndicator.classList.add('active');
            elements.progressText.textContent = message;
            elements.progressFill.style.width = percentage + '%';
        }
    }

    function hideProgress() {
        if (elements.progressIndicator) elements.progressIndicator.classList.remove('active');
    }

    function resetSubmitButton() {
        if (elements.submitBtn) {
            elements.submitBtn.disabled = false;
            elements.submitBtn.textContent = '📤 Αποστολή';
        }
    }

    function setDateTimeNow() {
        var now = new Date();
        if (elements.dateInput) elements.dateInput.value = String(now.getDate()).padStart(2,'0') + '/' + String(now.getMonth()+1).padStart(2,'0') + '/' + now.getFullYear();
        if (elements.timeInput) elements.timeInput.value = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    }

    // === SUBMIT ===
    async function submitUpdate() {
        var dateDisplay = elements.dateInput ? elements.dateInput.value : '';
        var time = elements.timeInput ? elements.timeInput.value.trim() : '';
        var content = elements.contentInput ? elements.contentInput.value.trim() : '';

        var limit = null;
        if (elements.enableLimitToggle && elements.enableLimitToggle.checked) {
            limit = parseInt(elements.userLimitInput.value) || 280;
        }
        var totalLength = content.length;

        if (limit && totalLength > limit) {
            alert('⚠️ Ξεπέρασες το όριο!\nΧαρακτήρες: ' + totalLength + '\nΌριο: ' + limit);
            resetSubmitButton();
            return;
        }
        if (!GITHUB_TOKEN || !GITHUB_TOKEN.startsWith('ghp_')) {
            alert('⚠️ GitHub Token required!');
            if (elements.tokenWrapper) elements.tokenWrapper.classList.add('show');
            return;
        }
        if (selectedTags.length < 1) { alert('Select at least 1 tag.'); return; }
        if (!dateDisplay || !time || !content) { alert('Fill all fields!'); return; }

        showProgress('Connecting to GitHub...', 10);
        if (elements.submitBtn) { elements.submitBtn.disabled = true; elements.submitBtn.textContent = 'Αποστολή...'; }
        if (elements.statusDiv) elements.statusDiv.style.display = 'none';

        try {
            saveCurrentDraft();
            submissionStage = 1;
            showProgress('Fetching current updates...', 30);

            var parts = dateDisplay.split('/');
            var d = parts[0], m = parts[1], y = parts[2];
            var isoDate = y + '-' + m + '-' + d + 'T' + time + ':00';
            var months = ['Ιανουαρίου','Φεβρουαρίου','Μαρτίου','Απριλίου','Μαΐου','Ιουνίου','Ιουλίου','Αυγούστου','Σεπτεμβρίου','Οκτωβρίου','Νοεμβρίου','Δεκεμβρίου'];
            var formattedDate = d + ' ' + months[parseInt(m)-1] + ' ' + y + ', ' + time;

            var newUpdate = { date: isoDate, displayDate: formattedDate, content: content, tags: selectedTags.slice() };
            var fileUrl = 'https://api.github.com/repos/' + GITHUB_USER + '/' + REPO_NAME + '/contents/updates.json?ref=' + BRANCH;

            var retries = 3;
            while (retries > 0) {
                var fRes = await fetch(fileUrl, {
                    headers: { Authorization: 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' }
                });
                if (!fRes.ok) throw new Error('Load fail');

                submissionStage = 2;
                showProgress('Processing update...', 50);

                var fData = await fRes.json();
                var data = JSON.parse(safeBase64Decode(fData.content));
                if (!data.updates) data.updates = [];
                data.updates.unshift(newUpdate);

                var newContent = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

                submissionStage = 3;
                showProgress('Committing to GitHub...', 75);

                var cRes = await fetch(fileUrl, {
                    method: 'PUT',
                    headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: 'Auto: ' + formattedDate, content: newContent, sha: fData.sha, branch: BRANCH })
                });

                if (cRes.ok) break;
                if (cRes.status === 422) { retries--; await new Promise(function(r) { setTimeout(r, 1500); }); }
                else { var errData = await cRes.json(); throw new Error(errData.message || 'Fail'); }
            }

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

            if (currentDraftId) {
                var allDrafts = getAllDrafts();
                delete allDrafts[currentDraftId];
                try { localStorage.setItem('admin_drafts', JSON.stringify(allDrafts)); } catch(e) {}
                currentDraftId = null;
                updateDraftList();
            }

            loadUsedTags();
            resetSubmitButton();

        } catch (error) {
            hideProgress();
            if (elements.statusDiv) {
                elements.statusDiv.textContent = '❌ Σφάλμα: ' + error.message + ' — Το περιεχόμενο σώθηκε ως draft.';
                elements.statusDiv.className = 'error';
                elements.statusDiv.style.display = 'block';
            }
            resetSubmitButton();
        }
    }

    // === KEYBOARD SHORTCUTS ===
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                submitUpdate();
            }
            if (e.key === 'Escape') {
                if (elements.emojiPickerContainer) elements.emojiPickerContainer.classList.remove('active');
                if (elements.specialCharsDropdown) elements.specialCharsDropdown.classList.remove('show');
                if (elements.usedTagsContent) elements.usedTagsContent.classList.remove('open');
                if (elements.usedTagsToggle) elements.usedTagsToggle.classList.remove('open');
            }
            if (e.altKey && e.key.toLowerCase() === 'c') {
                e.preventDefault();
                if (confirm('Καθαρισμός;')) {
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
        // Load token from sessionStorage on init (NEW)
        loadTokenFromSession();

        if (elements.tokenToggle) elements.tokenToggle.addEventListener('click', function() {
            elements.tokenWrapper.classList.toggle('show');
            elements.tokenToggle.textContent = elements.tokenWrapper.classList.contains('show') ? '🔓 Κρύψε Token' : '🔐 GitHub Token';
            if (elements.tokenWrapper.classList.contains('show')) elements.githubTokenInput.focus();
        });

        if (elements.githubTokenInput) elements.githubTokenInput.addEventListener('input', function() {
            GITHUB_TOKEN = elements.githubTokenInput.value.trim();
            saveTokenToSession(); // NEW
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
            elements.contentInput.addEventListener('keydown', enforceLimit);
            elements.contentInput.addEventListener('paste', enforcePasteLimit);
        }

        if (elements.enableLimitToggle && elements.userLimitInput) {
            elements.enableLimitToggle.addEventListener('change', updateAllCounters);
            elements.userLimitInput.addEventListener('input', updateAllCounters);
            elements.userLimitInput.addEventListener('wheel', function(e) { e.preventDefault(); });
        }

        if (elements.newDraftBtn) elements.newDraftBtn.addEventListener('click', createNewDraft);
        if (elements.deleteAllDraftsBtn) elements.deleteAllDraftsBtn.addEventListener('click', deleteAllDrafts);

        if (elements.usedTagsToggle) {
            elements.usedTagsToggle.addEventListener('click', function() {
                elements.usedTagsToggle.classList.toggle('open');
                elements.usedTagsContent.classList.toggle('open');
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

        loadMostRecentDraft();
        updateDraftList();

        loadUsedTags();

        updateAllCounters();
        console.log('✅ Admin Panel Ready - Token Persistence Active');
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
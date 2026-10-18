// ========================================
// === APP.JS - CLEAN (NO STORIES) ===
// ========================================

(function() {
    'use strict';

    const GITHUB_USER = 'koulaxizis';
    const REPO_NAME = 'koulaxizis';
    const BRANCH = 'main';
    
    let GITHUB_TOKEN = '';
    let selectedTags = [];
    const MAX_TAGS = 5;
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
        elements.sourceToggle = document.getElementById('sourceToggle');
        elements.sourceWrapper = document.getElementById('sourceWrapper');
        elements.sourceModeLabel = document.getElementById('sourceModeLabel');
        elements.sourceModeInputs = document.querySelectorAll('input[name="sourceMode"]');
        elements.feedFields = document.getElementById('feedFields');
        elements.feedUrl = document.getElementById('feedUrl');
        elements.feedTags = document.getElementById('feedTags');
        elements.saveSourceBtn = document.getElementById('saveSourceBtn');
        elements.syncFeedBtn = document.getElementById('syncFeedBtn');
        elements.sourceStatus = document.getElementById('sourceStatus');
        elements.manageToggle = document.getElementById('manageToggle');
        elements.manageWrapper = document.getElementById('manageWrapper');
        elements.selectAllPosts = document.getElementById('selectAllPosts');
        elements.selectedCount = document.getElementById('selectedCount');
        elements.reloadPostsBtn = document.getElementById('reloadPostsBtn');
        elements.postList = document.getElementById('postList');
        elements.deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        elements.eraseAllBtn = document.getElementById('eraseAllBtn');
        elements.manageStatus = document.getElementById('manageStatus');
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

    // Classic (ghp_) and fine-grained (github_pat_) personal access tokens.
    function isValidToken(token) {
        return !!token && (token.startsWith('ghp_') || token.startsWith('github_pat_'));
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // === USED TAGS ===
    async function loadUsedTags() {
        try {
            const rawUrl = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/' + REPO_NAME + '/' + BRANCH + '/updates.json?t=' + Date.now();
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

    // === ΠΗΓΗ ΕΝΗΜΕΡΩΣΕΩΝ (sources.json) ===
    // "manual": μόνο ό,τι γράφεται από εδώ. "feed": το import-feed.yml φέρνει και τις αναρτήσεις
    // του εξωτερικού feed μέσα στο updates.json, ώστε το site να διαβάζει πάντα μία πηγή.
    var SOURCES_API_URL = 'https://api.github.com/repos/' + GITHUB_USER + '/' + REPO_NAME + '/contents/sources.json';
    var sourcesConfig = { mode: 'manual', feed: {} };

    function githubHeaders() {
        return { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github+json' };
    }

    function decodeBase64Utf8(b64) {
        return decodeURIComponent(escape(atob(b64.replace(/\n/g, ''))));
    }

    function encodeBase64Utf8(text) {
        return btoa(unescape(encodeURIComponent(text)));
    }

    function setSourceStatus(message, kind) {
        if (!elements.sourceStatus) return;
        elements.sourceStatus.textContent = message;
        elements.sourceStatus.style.color = kind === 'error' ? 'var(--error)' : (kind === 'success' ? 'var(--success)' : '#a0a0a0');
    }

    function selectedSourceMode() {
        var mode = 'manual';
        elements.sourceModeInputs.forEach(function(input) { if (input.checked) mode = input.value; });
        return mode;
    }

    function updateSourceUi() {
        var mode = selectedSourceMode();
        if (elements.feedFields) elements.feedFields.classList.toggle('visible', mode === 'feed');
        if (elements.syncFeedBtn) elements.syncFeedBtn.style.display = mode === 'feed' ? '' : 'none';
    }

    function renderSources() {
        var feed = sourcesConfig.feed || {};
        elements.sourceModeInputs.forEach(function(input) { input.checked = input.value === sourcesConfig.mode; });
        if (elements.feedUrl) elements.feedUrl.value = feed.url || '';
        if (elements.feedTags) elements.feedTags.value = (feed.tags || []).join(' ');
        if (elements.sourceModeLabel) elements.sourceModeLabel.textContent = sourcesConfig.mode === 'feed' ? 'updates.json + feed' : 'updates.json';
        updateSourceUi();
    }

    async function loadSources() {
        try {
            var res = await fetch('https://raw.githubusercontent.com/' + GITHUB_USER + '/' + REPO_NAME + '/' + BRANCH + '/sources.json?t=' + Date.now());
            if (res.ok) sourcesConfig = await res.json();
        } catch (e) {
            console.warn('Could not load sources.json:', e.message);
        }
        if (sourcesConfig.mode !== 'feed') sourcesConfig.mode = 'manual';
        renderSources();
    }

    function requireToken(setStatus) {
        if (isValidToken(GITHUB_TOKEN)) return true;
        (setStatus || setSourceStatus)('⚠️ Χρειάζεται GitHub Token.', 'error');
        if (elements.tokenWrapper) elements.tokenWrapper.classList.add('show');
        return false;
    }

    async function saveSources() {
        if (!requireToken()) return;
        var mode = selectedSourceMode();
        var url = elements.feedUrl ? elements.feedUrl.value.trim() : '';
        var tags = elements.feedTags ? elements.feedTags.value.trim().split(/\s+/).filter(Boolean).slice(0, MAX_TAGS) : [];

        if (mode === 'feed' && !/^https:\/\/\S+$/i.test(url)) {
            setSourceStatus('⚠️ Βάλε μια έγκυρη διεύθυνση feed που ξεκινά με https://', 'error');
            return;
        }

        elements.saveSourceBtn.disabled = true;
        setSourceStatus('Αποθήκευση…');
        try {
            // Διαβάζουμε το αρχείο από το API για το τρέχον sha και κρατάμε τυχόν άλλα πεδία του.
            var getRes = await fetch(SOURCES_API_URL + '?ref=' + BRANCH + '&t=' + Date.now(), { headers: githubHeaders(), cache: 'no-store' });
            var sha;
            var current = {};
            if (getRes.ok) {
                var getJson = await getRes.json();
                sha = getJson.sha;
                current = JSON.parse(decodeBase64Utf8(getJson.content));
            } else if (getRes.status !== 404) {
                var getErr = await getRes.json().catch(function() { return {}; });
                throw new Error(getErr.message || ('Load fail (' + getRes.status + ')'));
            }

            current.mode = mode;
            current.feed = Object.assign({}, current.feed, { url: url, tags: tags.length ? tags : ['🔗'] });

            var body = { message: 'Admin: πηγή ενημερώσεων = ' + mode, content: encodeBase64Utf8(JSON.stringify(current, null, 2) + '\n'), branch: BRANCH };
            if (sha) body.sha = sha;
            var putRes = await fetch(SOURCES_API_URL, {
                method: 'PUT',
                headers: Object.assign({ 'Content-Type': 'application/json' }, githubHeaders()),
                body: JSON.stringify(body)
            });
            if (!putRes.ok) {
                var putErr = await putRes.json().catch(function() { return {}; });
                throw new Error(putErr.message || ('Commit fail (' + putRes.status + ')'));
            }

            sourcesConfig = current;
            renderSources();
            setSourceStatus(mode === 'feed'
                ? '✅ Αποθηκεύτηκε. Ο πρώτος έλεγχος του feed ξεκινά τώρα στο GitHub.'
                : '✅ Αποθηκεύτηκε. Δεν θα γίνεται πλέον εισαγωγή από feed.', 'success');
        } catch (error) {
            setSourceStatus('❌ Σφάλμα: ' + error.message, 'error');
        } finally {
            elements.saveSourceBtn.disabled = false;
        }
    }

    async function syncFeedNow() {
        if (!requireToken()) return;
        elements.syncFeedBtn.disabled = true;
        setSourceStatus('Ζητώ έλεγχο του feed…');
        try {
            var res = await fetch('https://api.github.com/repos/' + GITHUB_USER + '/' + REPO_NAME + '/actions/workflows/import-feed.yml/dispatches', {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' }, githubHeaders()),
                body: JSON.stringify({ ref: BRANCH })
            });
            if (res.status === 204) {
                setSourceStatus('✅ Ο έλεγχος ξεκίνησε. Οι νέες αναρτήσεις εμφανίζονται στο site σε λίγα λεπτά.', 'success');
            } else if (res.status === 403 || res.status === 404) {
                setSourceStatus('⚠️ Το token δεν έχει δικαίωμα να ξεκινά Actions (χρειάζεται «Actions: Read and write» ή scope «workflow»). Ο αυτόματος έλεγχος κάθε 2 ώρες συνεχίζει κανονικά.', 'error');
            } else {
                var err = await res.json().catch(function() { return {}; });
                throw new Error(err.message || ('HTTP ' + res.status));
            }
        } catch (error) {
            setSourceStatus('❌ Σφάλμα: ' + error.message, 'error');
        } finally {
            elements.syncFeedBtn.disabled = false;
        }
    }

    // === ΚΟΙΝΗ ΕΓΓΡΑΦΗ updates.json ===
    var UPDATES_API_URL = 'https://api.github.com/repos/' + GITHUB_USER + '/' + REPO_NAME + '/contents/updates.json';

    async function fetchUpdatesJson() {
        var res = await fetch(UPDATES_API_URL + '?ref=' + BRANCH + '&t=' + Date.now(), { headers: githubHeaders(), cache: 'no-store' });
        if (!res.ok) {
            var err = await res.json().catch(function() { return {}; });
            throw new Error(err.message || ('Load fail (' + res.status + ')'));
        }
        var json = await res.json();
        var data = JSON.parse(decodeBase64Utf8(json.content));
        if (!Array.isArray(data.updates)) data.updates = [];
        return { data: data, sha: json.sha };
    }

    // Διαβάζει το αρχείο από το API (όχι από το raw.githubusercontent, που έχει cache), ώστε η αλλαγή
    // να πατά πάντα στο τελευταίο περιεχόμενο και στο sha του. Αν το αρχείο άλλαξε στο μεταξύ
    // (409/422), το ξαναδιαβάζει και ξαναεφαρμόζει την αλλαγή, έως 3 φορές.
    async function commitUpdatesJson(mutate, message) {
        var lastError = '';
        for (var attempt = 1; attempt <= 3; attempt++) {
            var current = await fetchUpdatesJson();
            var result = mutate(current.data);
            if (result === false) return current.data;

            var res = await fetch(UPDATES_API_URL, {
                method: 'PUT',
                headers: Object.assign({ 'Content-Type': 'application/json' }, githubHeaders()),
                body: JSON.stringify({ message: message, content: encodeBase64Utf8(JSON.stringify(current.data, null, 2)), sha: current.sha, branch: BRANCH })
            });
            if (res.ok) return current.data;

            var errData = await res.json().catch(function() { return {}; });
            lastError = errData.message || ('Commit fail (' + res.status + ')');
            if (res.status !== 409 && res.status !== 422) throw new Error(lastError);
            await new Promise(function(r) { setTimeout(r, 1500); });
        }
        throw new Error(lastError || 'Commit fail');
    }

    // === ΔΙΑΧΕΙΡΙΣΗ ΔΗΜΟΣΙΕΥΣΕΩΝ (διαγραφή) ===
    // Οι ενημερώσεις δεν έχουν id, οπότε μία εγγραφή αναγνωρίζεται από ημερομηνία + κείμενο.
    var managedPosts = [];
    var selectedPostKeys = new Set();

    function postKey(update) {
        return (update.date || '') + '\u0000' + (update.content || '');
    }

    function setManageStatus(message, kind) {
        if (!elements.manageStatus) return;
        elements.manageStatus.textContent = message;
        elements.manageStatus.style.color = kind === 'error' ? 'var(--error)' : (kind === 'success' ? 'var(--success)' : '#a0a0a0');
    }

    function updateSelectionUi() {
        var count = selectedPostKeys.size;
        if (elements.selectedCount) elements.selectedCount.textContent = count + ' / ' + managedPosts.length + ' επιλεγμένες';
        if (elements.deleteSelectedBtn) elements.deleteSelectedBtn.disabled = count === 0;
        if (elements.eraseAllBtn) elements.eraseAllBtn.disabled = managedPosts.length === 0;
        if (elements.selectAllPosts) {
            elements.selectAllPosts.checked = managedPosts.length > 0 && count === managedPosts.length;
            elements.selectAllPosts.indeterminate = count > 0 && count < managedPosts.length;
        }
    }

    function renderPostList() {
        if (!elements.postList) return;
        elements.postList.innerHTML = '';
        if (managedPosts.length === 0) {
            elements.postList.innerHTML = '<p class="source-hint">Δεν υπάρχουν δημοσιεύσεις.</p>';
            updateSelectionUi();
            return;
        }
        managedPosts.forEach(function(update) {
            var key = postKey(update);
            var row = document.createElement('label');
            row.className = 'post-row';

            var box = document.createElement('input');
            box.type = 'checkbox';
            box.checked = selectedPostKeys.has(key);
            box.addEventListener('change', function() {
                if (box.checked) selectedPostKeys.add(key); else selectedPostKeys.delete(key);
                updateSelectionUi();
            });

            var info = document.createElement('div');
            info.className = 'post-info';
            var meta = document.createElement('div');
            meta.className = 'post-meta';
            meta.textContent = (update.displayDate || update.date || '') + '  ' + (update.tags || []).join(' ') + (update.source === 'feed' ? '  · από feed' : '');
            var text = document.createElement('div');
            text.className = 'post-text';
            text.textContent = update.content || '';
            info.appendChild(meta);
            info.appendChild(text);

            row.appendChild(box);
            row.appendChild(info);
            elements.postList.appendChild(row);
        });
        updateSelectionUi();
    }

    async function loadPostList() {
        if (!requireToken(setManageStatus)) return;
        setManageStatus('Φόρτωση…');
        try {
            var current = await fetchUpdatesJson();
            managedPosts = current.data.updates.slice().sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
            var keys = new Set(managedPosts.map(postKey));
            selectedPostKeys.forEach(function(k) { if (!keys.has(k)) selectedPostKeys.delete(k); });
            renderPostList();
            setManageStatus('');
        } catch (error) {
            setManageStatus('❌ Σφάλμα: ' + error.message, 'error');
        }
    }

    async function deletePosts(eraseAll) {
        if (!requireToken(setManageStatus)) return;
        var toDelete = new Set(selectedPostKeys);

        if (eraseAll) {
            var answer = prompt('Θα διαγραφούν ΟΛΕΣ οι δημοσιεύσεις (' + managedPosts.length + ') από το site και το RSS.\nΓράψε ΔΙΑΓΡΑΦΗ για επιβεβαίωση:');
            if (answer === null) return;
            if (answer.trim().toUpperCase() !== 'ΔΙΑΓΡΑΦΗ') { setManageStatus('Ακυρώθηκε: δεν γράφτηκε «ΔΙΑΓΡΑΦΗ».', 'error'); return; }
        } else {
            if (toDelete.size === 0) return;
            if (!confirm('Διαγραφή ' + toDelete.size + ' δημοσιεύσεων; Δεν αναιρείται από εδώ.')) return;
        }

        elements.deleteSelectedBtn.disabled = true;
        elements.eraseAllBtn.disabled = true;
        setManageStatus('Διαγραφή…');
        var removed = 0;
        try {
            var data = await commitUpdatesJson(function(d) {
                var before = d.updates.length;
                d.updates = eraseAll ? [] : d.updates.filter(function(u) { return !toDelete.has(postKey(u)); });
                removed = before - d.updates.length;
                return removed > 0;
            }, eraseAll ? 'Admin: διαγραφή όλων των ενημερώσεων' : 'Admin: διαγραφή ' + toDelete.size + ' ενημερώσεων');

            selectedPostKeys.clear();
            managedPosts = data.updates.slice().sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
            renderPostList();
            setManageStatus(removed
                ? '✅ Διαγράφηκαν ' + removed + '. Το site και το RSS ενημερώνονται σε λίγα λεπτά.'
                : 'Δεν βρέθηκε τίποτα για διαγραφή (ίσως είχε ήδη διαγραφεί).', removed ? 'success' : '');
            loadUsedTags();
        } catch (error) {
            setManageStatus('❌ Σφάλμα: ' + error.message, 'error');
            updateSelectionUi();
        }
    }

    // === SUBMIT (UPDATES) ===
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
        if (!isValidToken(GITHUB_TOKEN)) {
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
            
            await commitUpdatesJson(function(data) {
                submissionStage = 2;
                showProgress('Processing update...', 50);
                data.updates.unshift(newUpdate);
                submissionStage = 3;
                showProgress('Committing to GitHub...', 75);
            }, 'Auto: ' + formattedDate);

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
            if (elements.manageWrapper && elements.manageWrapper.classList.contains('show')) loadPostList();
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
        if (elements.tokenToggle) elements.tokenToggle.addEventListener('click', function() {
            elements.tokenWrapper.classList.toggle('show');
            elements.tokenToggle.textContent = elements.tokenWrapper.classList.contains('show') ? '🔓 Κρύψε Token' : '🔐 GitHub Token';
            if (elements.tokenWrapper.classList.contains('show')) elements.githubTokenInput.focus();
        });

        if (elements.githubTokenInput) elements.githubTokenInput.addEventListener('input', function() {
            GITHUB_TOKEN = elements.githubTokenInput.value.trim();
            if (elements.tokenStatus) elements.tokenStatus.innerHTML = isValidToken(GITHUB_TOKEN) ? '<span style="color:#4CAF50">✅</span>' : '<span style="color:#ff9800">⚠️</span>';
        });

        if (elements.submitBtn) elements.submitBtn.addEventListener('click', submitUpdate);

        if (elements.sourceToggle) elements.sourceToggle.addEventListener('click', function() {
            elements.sourceWrapper.classList.toggle('show');
        });
        elements.sourceModeInputs.forEach(function(input) { input.addEventListener('change', updateSourceUi); });
        if (elements.saveSourceBtn) elements.saveSourceBtn.addEventListener('click', saveSources);
        if (elements.syncFeedBtn) elements.syncFeedBtn.addEventListener('click', syncFeedNow);

        if (elements.manageToggle) elements.manageToggle.addEventListener('click', function() {
            elements.manageWrapper.classList.toggle('show');
            if (elements.manageWrapper.classList.contains('show')) loadPostList();
        });
        if (elements.reloadPostsBtn) elements.reloadPostsBtn.addEventListener('click', loadPostList);
        if (elements.selectAllPosts) elements.selectAllPosts.addEventListener('change', function() {
            selectedPostKeys.clear();
            if (elements.selectAllPosts.checked) managedPosts.forEach(function(u) { selectedPostKeys.add(postKey(u)); });
            renderPostList();
        });
        if (elements.deleteSelectedBtn) elements.deleteSelectedBtn.addEventListener('click', function() { deletePosts(false); });
        if (elements.eraseAllBtn) elements.eraseAllBtn.addEventListener('click', function() { deletePosts(true); });

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
        loadSources();

        updateAllCounters();
        console.log('✅ Admin Panel Ready');
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
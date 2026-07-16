// === app.js - PicMo Emoji Picker Integration (FIXED) ===

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const GITHUB_USER = 'koulaxizis';
    const REPO_NAME = 'koulaxizis';
    const BRANCH = 'main';
    let GITHUB_TOKEN = '';
    let selectedTags = [];
    const MAX_TAGS = 3;

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
    }

    // --- CHARACTER COUNTER WITH GRADIENT COLOR + LOCK ---
    function updateCharCounter() {
        const text = elements.contentInput ? elements.contentInput.value : '';

        let limit = null;
        if (elements.enableLimitToggle && elements.enableLimitToggle.checked) {
            limit = parseInt(elements.userLimitInput.value) || 280;
        }

        let totalLength = text.length;

        if (elements.charCounter) {
            // Reset classes
            elements.charCounter.className = 'char-counter';

            if (limit) {
                const pct = totalLength / limit;
                let colorClass = '';

                if (pct <= 0.70) {
                    colorClass = 'counter-green';
                } else if (pct <= 0.90) {
                    colorClass = 'counter-yellow';
                } else {
                    colorClass = 'counter-red';
                }

                elements.charCounter.className = 'char-counter ' + colorClass;
                elements.charCounter.textContent = totalLength + ' / ' + limit;
            } else {
                elements.charCounter.textContent = totalLength;
            }
        }

        saveDraft();
        return totalLength;
    }

    // --- LOCK INPUT AT LIMIT ---
    function enforceLimit(e) {
        if (!elements.enableLimitToggle || !elements.enableLimitToggle.checked) return;
        if (!elements.userLimitInput) return;

        const limit = parseInt(elements.userLimitInput.value) || 280;
        const currentLength = elements.contentInput.value.length;

        if (currentLength >= limit) {
            // Allow backspace, delete, arrow keys, etc.
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab', 'Escape'];
            if (allowedKeys.includes(e.key)) return;

            // Allow Ctrl/Cmd combos (copy, paste, select all, etc.)
            if (e.ctrlKey || e.metaKey) return;

            e.preventDefault();

            // Visual feedback - flash border
            elements.contentInput.style.borderColor = '#f44336';
            elements.contentInput.style.boxShadow = '0 0 0 2px rgba(244, 67, 54, 0.3)';
            clearTimeout(elements._lockTimer);
            elements._lockTimer = setTimeout(function() {
                elements.contentInput.style.borderColor = '';
                elements.contentInput.style.boxShadow = '';
            }, 400);
        }
    }

    // Also guard against paste exceeding limit
    function enforcePasteLimit(e) {
        if (!elements.enableLimitToggle || !elements.enableLimitToggle.checked) return;
        if (!elements.userLimitInput) return;

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
            updateCharCounter();
            elements.contentInput.focus();
        }
    }

    // --- TAGS MANAGEMENT ---
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
        updateCharCounter();
    }

    function removeTag(emoji) {
        selectedTags = selectedTags.filter(function(t) { return t !== emoji; });
        renderTags();
        updateCharCounter();
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
            var saved = localStorage.getItem('update_draft');
            if (saved) {
                var draft = JSON.parse(saved);
                if (elements.contentInput) elements.contentInput.value = draft.content || '';
                if (Array.isArray(draft.tags)) {
                    selectedTags = draft.tags;
                    renderTags();
                }
            }
        } catch(e) {}
    }

    // --- PICMO EMOJI PICKER INITIALIZATION ---
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

            if (!emojiChar) {
                console.warn('No emoji in selection event', event);
                return;
            }

            var rawName = event.label || event.name ||
                           (event.detail && (event.detail.label || event.detail.name)) || '';

            if (rawName) {
                var slug = rawName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '_');
                emojiNameMap[emojiChar] = slug;
            }

            addTag(emojiChar);
            elements.emojiPickerContainer.classList.remove('active');
        });

        document.addEventListener('click', function(e) {
            if (!elements.emojiPickerContainer.contains(e.target) &&
                !elements.emojiTriggerBtn.contains(e.target)) {
                elements.emojiPickerContainer.classList.remove('active');
            }
        });

        console.log('✅ PicMo Emoji Picker Initialized');
    }

    // --- SPECIAL CHARACTERS DROPDOWN ---
    function initSpecialCharsDropdown() {
        if (!elements.specialCharsBtn || !elements.specialCharsDropdown) return;

        elements.specialCharsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            elements.specialCharsDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!elements.specialCharsDropdown.contains(e.target) &&
                !elements.specialCharsBtn.contains(e.target)) {
                elements.specialCharsDropdown.classList.remove('show');
            }
        });

        var specialBtns = document.querySelectorAll('.special-char-btn');
        specialBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var char = btn.getAttribute('data-char');
                if (elements.contentInput) {
                    // Check limit before inserting
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
                    updateCharCounter();
                }
            });
        });
    }

    // --- BASE64 HELPER ---
    function safeBase64Decode(str) {
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch(e) {
            return '{}';
        }
    }

    // --- SUBMIT ---
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
            if (elements.submitBtn) {
                elements.submitBtn.disabled = false;
                elements.submitBtn.textContent = '📤 Αποστολή';
            }
            return;
        }

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
            var parts = dateDisplay.split('/');
            var d = parts[0], m = parts[1], y = parts[2];
            var isoDate = y + '-' + m + '-' + d + 'T' + time + ':00';
            var months = ['Ιανουαρίου','Φεβρουαρίου','Μαρτίου','Απριλίου','Μαΐου','Ιουνίου','Ιουλίου','Αυγούστου','Σεπτεμβρίου','Οκτωβρίου','Νοεμβρίου','Δεκεμβρίου'];
            var formattedDate = d + ' ' + months[parseInt(m)-1] + ' ' + y + ', ' + time;

            var newUpdate = { date: isoDate, displayDate: formattedDate, content: content, tags: selectedTags };
            var fileUrl = 'https://api.github.com/repos/' + GITHUB_USER + '/' + REPO_NAME + '/contents/updates.json?ref=' + BRANCH;
            var retries = 3;
            while (retries > 0) {
                var fRes = await fetch(fileUrl, {
                    headers: {
                        Authorization: 'token ' + GITHUB_TOKEN,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (!fRes.ok) throw new Error("Load fail");
                var fData = await fRes.json();
                var data = JSON.parse(safeBase64Decode(fData.content));
                if (!data.updates) data.updates = [];
                data.updates.unshift(newUpdate);
                var newContent = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
                var cRes = await fetch(fileUrl, {
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

            if (elements.statusDiv) {
                elements.statusDiv.textContent = '✅ Επιτυχία!';
                elements.statusDiv.className = 'success';
                elements.statusDiv.style.display = 'block';
            }
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
            if (elements.statusDiv) {
                elements.statusDiv.textContent = '❌ Σφάλμα: ' + error.message;
                elements.statusDiv.className = 'error';
                elements.statusDiv.style.display = 'block';
            }
            if (elements.submitBtn) {
                elements.submitBtn.disabled = false;
                elements.submitBtn.textContent = '📤 Αποστολή';
            }
        }
    }

    // --- EVENT BINDING ---
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
                localStorage.removeItem('update_draft');
                updateCharCounter();
                if (elements.statusDiv) elements.statusDiv.style.display = 'none';
            }
        });

        // Input listener with limit enforcement
        if (elements.contentInput) {
            elements.contentInput.addEventListener('input', updateCharCounter);
            elements.contentInput.addEventListener('keydown', enforceLimit);
            elements.contentInput.addEventListener('paste', enforcePasteLimit);
        }

        if (elements.enableLimitToggle && elements.userLimitInput) {
            elements.enableLimitToggle.addEventListener('change', function() {
                updateCharCounter();
            });
            elements.userLimitInput.addEventListener('input', updateCharCounter);
            elements.userLimitInput.addEventListener('wheel', function(e) {
                e.preventDefault();
            });
        }

        if (elements.dateInput && elements.timeInput) {
            var now = new Date();
            elements.dateInput.value = String(now.getDate()).padStart(2,'0') + '/' + String(now.getMonth()+1).padStart(2,'0') + '/' + now.getFullYear();
            elements.timeInput.value = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
        }
    }

    // --- INIT ---
    function init() {
        initElements();
        loadSavedDraft();
        bindEvents();
        initEmojiPicker();
        initSpecialCharsDropdown();
        updateCharCounter();
        console.log("✅ Admin Panel Ready");
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
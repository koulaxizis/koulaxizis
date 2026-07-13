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

    // --- EMOJI NAME MAP (bridge for hashtag generation) ---
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
        elements.emojiTriggerBtn = document.getElementById('emojiTriggerBtn');
        elements.emojiPickerContainer = document.getElementById('emojiPickerContainer');
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
                const overLimit = totalLength > limit;
                elements.charCounter.innerHTML = `${totalLength} / ${limit}${overLimit ? ' ⚠️' : ''}`;
            } else {
                elements.charCounter.innerHTML = `${totalLength} <small>(${platform})</small>`;
            }
        }
        
        updateHashtagPreview();
        saveDraft();
        return totalLength;
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
    }

    function addTag(emoji) {
        if (selectedTags.includes(emoji)) return;
        if (selectedTags.length >= MAX_TAGS) {
            alert(`Μέγιστο ${MAX_TAGS} tags.`);
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

        // Create picker — rootElement is REQUIRED by PicMo
        const picker = picmo.createPicker({
            rootElement: elements.emojiPickerContainer,
            referenceElement: elements.emojiTriggerBtn,
            emojiSize: '1.5em',
            showPreview: true,
            showRecents: true,
            recentsCount: 50,
            numColumns: 8,
            visibleRows: 6
        });

        // Toggle picker visibility via CSS on trigger button click
        elements.emojiTriggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.emojiPickerContainer.classList.toggle('active');
        });

        // Handle emoji selection
        picker.addEventListener('emoji:select', (event) => {
            const emojiChar = event.emoji || (event.detail && event.detail.emoji) || '';
            
            if (!emojiChar) {
                console.warn('No emoji in selection event', event);
                return;
            }

            const rawName = event.label || event.name ||
                           (event.detail && (event.detail.label || event.detail.name)) || '';

            if (rawName) {
                const slug = rawName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '_');
                emojiNameMap[emojiChar] = slug;
            }

            addTag(emojiChar);

            // Hide picker after selection via CSS
            elements.emojiPickerContainer.classList.remove('active');
        });

        // Close picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.emojiPickerContainer.contains(e.target) &&
                !elements.emojiTriggerBtn.contains(e.target)) {
                elements.emojiPickerContainer.classList.remove('active');
            }
        });

        console.log('✅ PicMo Emoji Picker Initialized');
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
        const dateDisplay = elements.dateInput ? elements.dateInput.value : '';
        const time = elements.timeInput ? elements.timeInput.value.trim() : '';
        const content = elements.contentInput ? elements.contentInput.value.trim() : '';
        const hasHashtagsConvert = document.getElementById('hashtagsConvert')?.checked || false;

        const convertHashtags = document.getElementById('hashtagsConvert')?.checked || false;
        let limit = null;
        if (elements.enableLimitToggle && elements.enableLimitToggle.checked) {
            limit = parseInt(elements.userLimitInput.value) || 280;
        }
        let totalLength = content.length;
        if (convertHashtags && selectedTags.length > 0) {
            const wordFunc = typeof window.emojiToWord === 'function' ? window.emojiToWord : (e) => 'tag';
            const hashtags = selectedTags.map(tag => '#' + wordFunc(tag)).join(' ');
            totalLength += (hashtags.length + 1);
        }

        if (limit && totalLength > limit) {
            alert(`⚠️ Ξεπέρασες το όριο!\nΧαρακτήρες: ${totalLength}\nΌριο: ${limit}`);
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
            const [d, m, y] = dateDisplay.split('/');
            const isoDate = `${y}-${m}-${d}T${time}:00`;
            const months = ['Ιανουαρίου','Φεβρουαρίου','Μαρτίου','Απριλίου','Μαΐου','Ιουνίου','Ιουλίου','Αυγούστου','Σεπτεμβρίου','Οκτωβρίου','Νοεμβρίου','Δεκεμβρίου'];
            const formattedDate = `${d} ${months[parseInt(m)-1]} ${y}, ${time}`;

            const newUpdate = { date: isoDate, displayDate: formattedDate, content, tags: selectedTags };
            const fileUrl = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/updates.json?ref=${BRANCH}`;
            let retries = 3;
            while (retries > 0) {
                const fRes = await fetch(fileUrl, {
                    headers: {
                        Authorization: `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (!fRes.ok) throw new Error("Load fail");
                const fData = await fRes.json();
                let data = JSON.parse(safeBase64Decode(fData.content));
                if (!data.updates) data.updates = [];
                data.updates.unshift(newUpdate);
                const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
                const cRes = await fetch(fileUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `Auto: ${formattedDate}`,
                        content: newContent,
                        sha: fData.sha,
                        branch: BRANCH
                    })
                });
                if (cRes.ok) break;
                if (cRes.status === 422) {
                    retries--;
                    await new Promise(r => setTimeout(r, 1500));
                } else {
                    throw new Error((await cRes.json()).message || "Fail");
                }
            }

            if (document.getElementById('blueskyPost')?.checked || document.getElementById('mastodonPost')?.checked) {
                try {
                    await fetch(`https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/actions/workflows/social-post.yml/dispatches`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `token ${GITHUB_TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ref: BRANCH,
                            inputs: {
                                content,
                                tags: selectedTags.join(' '),
                                display_date: formattedDate,
                                bluesky_post: 'true',
                                mastodon_post: 'true',
                                hashtags_convert: hasHashtagsConvert.toString()
                            }
                        })
                    });
                } catch(e) {
                    console.warn("Social trigger failed", e);
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

        if (elements.enableLimitToggle && elements.userLimitInput) {
            elements.enableLimitToggle.addEventListener('change', () => {
                updateCharCounter();
            });
            elements.userLimitInput.addEventListener('input', updateCharCounter);
            elements.userLimitInput.addEventListener('wheel', (e) => {
                e.preventDefault();
            });
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
        loadSavedDraft();
        bindEvents();
        initEmojiPicker();
        updateCharCounter();
        console.log("✅ Admin Panel Ready");
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
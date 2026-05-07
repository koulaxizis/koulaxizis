// === script.js ===

// --- 1. THEME TOGGLE LOGIC ---
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
});

// --- 2. UPDATES LOADING FROM JSON ---
const updatesContainer = document.getElementById('updates-container');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const itemsPerPage = 10;
let allUpdates = [];
let visibleCount = itemsPerPage;

async function loadUpdates() {
    try {
        const response = await fetch('updates.json');
        if (!response.ok) throw new Error('Δεν βρέθηκε το updates.json');
        const data = await response.json();
        allUpdates = data.updates;
        allUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));
        renderUpdates();
        updateButton();
    } catch (error) {
        console.error('Σφάλμα:', error);
        updatesContainer.innerHTML = '<p style="color: var(--secondary-text);">Δεν μπόρεσαν να φορτωθούν οι ενημερώσεις.</p>';
        loadMoreBtn.style.display = 'none';
    }
}

// --- 3. SHARE FUNCTIONALITY (ΔΙΟΡΘΩΜΕΝΗ) ---
async function shareUpdate(content, url) {
    // Αφαιρούμε HTML tags από το κείμενο για καθαρή αντιγραφή/κοινοποίηση
    const cleanContent = content.replace(/<[^>]*>?/gm, '').trim();
    const shareText = `${cleanContent}\n\n${url}`;

    const isMobile = window.innerWidth <= 768;

    // 1. Native Share (Κινητά) - Προτιμάται για Mastodon/BlueSky
    if (navigator.share && isMobile) {
        try {
            await navigator.share({
                title: 'Ενημέρωση από τον Χρήστο Κουλαξίζη',
                text: shareText,
                url: url
            });
            return;
        } catch (err) {
            console.log('Share cancelled');
        }
    }

    // 2. Fallback: Copy to Clipboard (Desktop)
    try {
        await navigator.clipboard.writeText(shareText);
        showToast('Αντιγράφηκε το κείμενο και ο σύνδεσμος!');
    } catch (err) {
        showToast('Αδυναμία αντιγραφής.');
    }
}

// Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '80px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'var(--accent-color)';
    toast.style.color = 'var(--bg-color)';
    toast.style.padding = '0.8rem 1.5rem';
    toast.style.borderRadius = '6px';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '0.9rem';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    toast.style.animation = 'fadeInOut 2s ease-in-out';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// --- 4. RENDER UPDATES ---
function renderUpdates() {
    updatesContainer.innerHTML = '';
    const updatesToShow = allUpdates.slice(0, visibleCount);

    updatesToShow.forEach(update => {
        const article = document.createElement('article');
        article.className = 'update h-entry';
        const contentText = update.content || '';
        const cleanText = contentText.replace(/<[^>]*>?/gm, '').trim();
        const encodedText = encodeURIComponent(cleanText);
        const encodedUrl = encodeURIComponent(window.location.href + '#updates');
        const finalUrl = window.location.href + '#updates';

        article.innerHTML = `
            <time class="date dt-published" datetime="${update.date}">${update.displayDate}</time>
            <div class="content e-content"><p>${contentText}</p></div>
        `;

        const shareDiv = document.createElement('div');
        shareDiv.style.marginTop = '0.8rem';
        shareDiv.style.display = 'flex';
        shareDiv.style.gap = '0.6rem';
        shareDiv.style.flexWrap = 'wrap';

        // Helper για κουμπιά
        const createBtn = (url, iconClass, title, onClick) => {
            const btn = document.createElement('a');
            btn.href = url || 'javascript:void(0)';
            btn.title = title;
            btn.style.display = 'inline-flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.width = '36px';
            btn.style.height = '36px';
            btn.style.borderRadius = '50%';
            btn.style.backgroundColor = 'var(--card-bg)';
            btn.style.border = '1px solid var(--border-color)';
            btn.style.color = 'var(--accent-color)';
            btn.style.textDecoration = 'none';
            btn.style.transition = 'all 0.3s';
            btn.style.cursor = 'pointer';
            
            // Custom SVG για BlueSky αν δεν υπάρχει icon
            if (iconClass === 'bluesky-svg') {
                btn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;
            } else {
                btn.innerHTML = `<i class="${iconClass}" style="font-size: 1rem;"></i>`;
            }

            btn.onmouseover = () => {
                btn.style.backgroundColor = 'var(--accent-color)';
                btn.style.color = 'var(--bg-color)';
                btn.style.borderColor = 'var(--accent-color)';
            };
            btn.onmouseout = () => {
                btn.style.backgroundColor = 'var(--card-bg)';
                btn.style.color = 'var(--accent-color)';
                btn.style.borderColor = 'var(--border-color)';
            };

            if (onClick) {
                btn.onclick = (e) => {
                    e.preventDefault();
                    onClick();
                };
            }
            return btn;
        };

        // 1. Mastodon (Native Share ή Link)
        // Το native share ανοίγει το instance που έχεις συνδεδεμένο
        const mastodonBtn = createBtn(null, 'fa-brands fa-mastodon', 'Mastodon', () => shareUpdate(cleanText, finalUrl));
        shareDiv.appendChild(mastodonBtn);

        // 2. BlueSky (Web Intent με σωστό URL)
        const blueskyUrl = `https://bsky.app/intent/compose?text=${encodedText}%20${encodedUrl}`;
        const blueskyBtn = createBtn(blueskyUrl, 'bluesky-svg', 'BlueSky');
        shareDiv.appendChild(blueskyBtn);

        // 3. Diaspora (Native Share ή Info)
        const diasporaBtn = createBtn(null, 'fa-solid fa-share-nodes', 'Diaspora', () => shareUpdate(cleanText, finalUrl));
        shareDiv.appendChild(diasporaBtn);

        // 4. Email (ΔΙΟΡΘΩΜΕΝΟ: Clean Text + Newlines + URL)
        const mailtoUrl = `mailto:?subject=Ενημέρωση από τον Χρήστο Κουλαξίζη&body=${encodedText}%0A%0A${encodedUrl}`;
        const emailBtn = createBtn(mailtoUrl, 'fa-solid fa-envelope', 'Email');
        shareDiv.appendChild(emailBtn);

        // 5. Copy Link (ΔΙΟΡΘΩΜΕΝΟ: Copy Text + URL)
        const copyBtn = createBtn(null, 'fa-solid fa-link', 'Αντιγραφή', () => shareUpdate(cleanText, finalUrl));
        shareDiv.appendChild(copyBtn);

        article.appendChild(shareDiv);
        updatesContainer.appendChild(article);
    });
}

function updateButton() {
    if (visibleCount >= allUpdates.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.textContent = `Προβολή προηγούμενων (${allUpdates.length - visibleCount} ακόμη)`;
    }
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        visibleCount += itemsPerPage;
        renderUpdates();
        updateButton();
    });
}

loadUpdates();

// --- 5. BACK TO TOP ---
const backToTopBtn = document.getElementById("backToTop");
window.addEventListener('scroll', () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
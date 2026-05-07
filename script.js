// === script.js ===

// --- 1. THEME TOGGLE LOGIC ---
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Έλεγχος αν υπάρχει αποθηκευμένη προτίμηση στο localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    // Αλλαγή εικονιδίου και αποθήκευση προτίμησης
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

// Φόρτωση των updates από το JSON
async function loadUpdates() {
    try {
        const response = await fetch('updates.json');
        if (!response.ok) {
            throw new Error('Δεν βρέθηκε το updates.json');
        }
        const data = await response.json();
        allUpdates = data.updates;
        
        // Ταξινόμηση κατά ημερομηνία (πιο πρόσφατα πρώτα)
        allUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Αρχική εμφάνιση
        renderUpdates();
        updateButton();
    } catch (error) {
        console.error('Σφάλμα φόρτωσης updates:', error);
        updatesContainer.innerHTML = '<p style="color: var(--secondary-text); font-size: 0.9rem;">Δεν μπόρεσαν να φορτωθούν οι ενημερώσεις.</p>';
        loadMoreBtn.style.display = 'none';
    }
}

// Συνάρτηση Κοινοποίησης (Share) - ΔΙΟΡΘΩΜΕΝΗ
async function shareUpdate(content) {
    const shareData = {
        title: 'Ενημέρωση από τον Χρήστο Κουλαξίζη',
        text: content,
        url: window.location.href + '#updates'
    };

    // Δοκιμή για Native Web Share (ΜΟΝΟ σε κινητά/tablets)
    // Ελέγχουμε αν η οθόνη είναι μικρή για να αποφύγουμε το Windows share dialog
    const isMobile = window.innerWidth <= 768;
    
    if (navigator.share && isMobile) {
        try {
            await navigator.share(shareData);
            return;
        } catch (err) {
            console.log('Share cancelled or failed');
        }
    }

    // Fallback: Copy to Clipboard (για Desktop)
    try {
        await navigator.clipboard.writeText(shareData.url);
        // Μικρό toast message αντί για alert
        showToast('Ο σύνδεσμος αντιγράφηκε στο πρόχειρο!');
    } catch (err) {
        showToast('Αδυναμία αντιγραφής. Παρακαλώ αντιγράψτε χειροκίνητα.');
    }
}

// Toast Notification (για καλύτερη εμπειρία χρήστη)
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
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// Εμφάνιση των updates
function renderUpdates() {
    updatesContainer.innerHTML = '';
    
    const updatesToShow = allUpdates.slice(0, visibleCount);
    
    updatesToShow.forEach(update => {
        const article = document.createElement('article');
        article.className = 'update h-entry'; // Προσθήκη Microformat h-entry
        
        // Δημιουργία HTML περιεχομένου με Microformats
        const contentText = update.content || '';
        const encodedContent = encodeURIComponent(contentText);
        const encodedUrl = encodeURIComponent(window.location.href + '#updates');

        article.innerHTML = `
            <time class="date dt-published" datetime="${update.date}">${update.displayDate}</time>
            <div class="content e-content">
                <p>${contentText}</p>
            </div>
        `;

        // --- Δημιουργία Κουμπιών Κοινοποίησης (ΜΟΝΟ ΕΙΚΟΝΙΔΙΑ) ---
        const shareDiv = document.createElement('div');
        shareDiv.style.marginTop = '0.8rem';
        shareDiv.style.fontSize = '0.85rem';
        shareDiv.style.color = 'var(--secondary-text)';
        shareDiv.style.display = 'flex';
        shareDiv.style.gap = '0.6rem';
        shareDiv.style.flexWrap = 'wrap';
        shareDiv.style.alignItems = 'center';

        // Helper για τη δημιουργία link (ΜΟΝΟ ΕΙΚΟΝΙΔΙΟ)
        const createShareLink = (url, label, iconClass, title) => {
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.title = title || label; // Tooltip με το όνομα
            a.style.display = 'inline-flex';
            a.style.alignItems = 'center';
            a.style.justifyContent = 'center';
            a.style.width = '36px';
            a.style.height = '36px';
            a.style.borderRadius = '50%';
            a.style.backgroundColor = 'var(--card-bg)';
            a.style.border = '1px solid var(--border-color)';
            a.style.color = 'var(--accent-color)';
            a.style.textDecoration = 'none';
            a.style.transition = 'all 0.3s';
            a.style.cursor = 'pointer';
            a.innerHTML = `<i class="${iconClass}" style="font-size: 1rem;"></i>`;
            
            a.onmouseover = () => {
                a.style.backgroundColor = 'var(--accent-color)';
                a.style.color = 'var(--bg-color)';
                a.style.borderColor = 'var(--accent-color)';
            };
            a.onmouseout = () => {
                a.style.backgroundColor = 'var(--card-bg)';
                a.style.color = 'var(--accent-color)';
                a.style.borderColor = 'var(--border-color)';
            };
            return a;
        };

        // 1. Mastodon (Web Intent - επιλέγει το instance του χρήστη)
        const mastodonUrl = `https://mastodon.social/share?text=${encodedContent}&url=${encodedUrl}`;
        shareDiv.appendChild(createShareLink(mastodonUrl, 'Mastodon', 'fa-brands fa-mastodon', 'Μοιράσου στο Mastodon'));

        // 2. BlueSky (Web Intent - με το σωστό λογότυπο πεταλούδας)
        const blueskyUrl = `https://bsky.app/intent/compose?text=${encodedContent}%20${encodedUrl}`;
        shareDiv.appendChild(createShareLink(blueskyUrl, 'BlueSky', 'fa-brands fa-bluesky', 'Μοιράσου στο BlueSky'));

        // 3. Diaspora (Generic Share - δεν υπάρχει επίσημο logo στο Font Awesome)
        // Χρησιμοποιούμε ένα γενικό εικονίδιο διαμοιρασμού
        const diasporaUrl = `https://diasporafoundation.org/`; // Δείχνει στο site του Diaspora
        shareDiv.appendChild(createShareLink(diasporaUrl, 'Diaspora', 'fa-solid fa-share-nodes', 'Diaspora (Διαμοιρασμός)'));

        // 4. Email (ΔΙΟΡΘΩΜΕΝΟ - με κενό μεταξύ κειμένου και URL)
        const mailtoUrl = `mailto:?subject=Ενημέρωση από τον Χρήστο Κουλαξίζη&body=${encodedContent}%0A%0A${encodedUrl}`;
        shareDiv.appendChild(createShareLink(mailtoUrl, 'Email', 'fa-solid fa-envelope', 'Αποστολή με Email'));

        // 5. Copy Link (ΔΙΟΡΘΩΜΕΝΟ - δεν ανοίγει Windows share)
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<i class="fa-solid fa-link" style="font-size: 1rem;"></i>';
        copyBtn.title = 'Αντιγραφή Συνδέσμου';
        copyBtn.style.background = 'transparent';
        copyBtn.style.border = '1px solid var(--border-color)';
        copyBtn.style.borderRadius = '50%';
        copyBtn.style.width = '36px';
        copyBtn.style.height = '36px';
        copyBtn.style.color = 'var(--accent-color)';
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.fontFamily = 'inherit';
        copyBtn.style.display = 'inline-flex';
        copyBtn.style.alignItems = 'center';
        copyBtn.style.justifyContent = 'center';
        copyBtn.style.transition = 'all 0.3s';
        copyBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            shareUpdate(contentText);
        };
        
        copyBtn.onmouseover = () => {
            copyBtn.style.backgroundColor = 'var(--accent-color)';
            copyBtn.style.color = 'var(--bg-color)';
            copyBtn.style.borderColor = 'var(--accent-color)';
        };
        copyBtn.onmouseout = () => {
            copyBtn.style.backgroundColor = 'transparent';
            copyBtn.style.color = 'var(--accent-color)';
            copyBtn.style.borderColor = 'var(--border-color)';
        };
        
        shareDiv.appendChild(copyBtn);

        article.appendChild(shareDiv);
        updatesContainer.appendChild(article);
    });
}

// Ενημέρωση κουμπιού
function updateButton() {
    if (visibleCount >= allUpdates.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        const remaining = allUpdates.length - visibleCount;
        loadMoreBtn.textContent = `Προβολή προηγούμενων (${remaining} ακόμη)`;
    }
}

// Event listener για το κουμπί
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        visibleCount += itemsPerPage;
        renderUpdates();
        updateButton();
    });
}

// Έναρξη φόρτωσης
loadUpdates();

// --- 3. BACK TO TOP BUTTON ---
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
});

function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
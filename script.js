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

// Συνάρτηση Κοινοποίησης (Share)
async function shareUpdate(content) {
    const shareData = {
        title: 'Ενημέρωση από τον Χρήστο Κουλαξίζη',
        text: content,
        url: window.location.href + '#updates'
    };

    // Δοκιμή για Native Web Share (Κινητά)
    if (navigator.share) {
        try {
            await navigator.share(shareData);
            return;
        } catch (err) {
            // Αν ο χρήστης ακυρώσει ή αποτύχει, πέφτουμε στο fallback
            console.log('Share cancelled or failed');
        }
    }

    // Fallback: Copy to Clipboard
    try {
        await navigator.clipboard.writeText(shareData.url);
        // Μικρό alert ή toast message (εδώ απλό alert για απλότητα)
        alert('Ο σύνδεσμος αντιγράφηκε στο πρόχειρο!');
    } catch (err) {
        alert('Αδυναμία αντιγραφής. Παρακαλώ αντιγράψτε χειροκίνητα.');
    }
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

        // --- Δημιουργία Κουμπιών Κοινοποίησης ---
        const shareDiv = document.createElement('div');
        shareDiv.style.marginTop = '0.8rem';
        shareDiv.style.fontSize = '0.85rem';
        shareDiv.style.color = 'var(--secondary-text)';
        shareDiv.style.display = 'flex';
        shareDiv.style.gap = '0.8rem';
        shareDiv.style.flexWrap = 'wrap';
        shareDiv.style.alignItems = 'center';

        // Helper για τη δημιουργία link
        const createShareLink = (url, label, iconClass) => {
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.style.display = 'inline-flex';
            a.style.alignItems = 'center';
            a.style.gap = '0.3rem';
            a.style.color = 'var(--accent-color)';
            a.style.textDecoration = 'none';
            a.style.transition = 'opacity 0.3s';
            a.style.fontWeight = '500';
            a.innerHTML = `<i class="${iconClass}" style="font-size: 1rem;"></i> ${label}`;
            
            a.onmouseover = () => a.style.opacity = '0.7';
            a.onmouseout = () => a.style.opacity = '1';
            return a;
        };

        // 1. Mastodon (Web Intent)
        const mastodonUrl = `https://mastodon.social/share?text=${encodedContent}&url=${encodedUrl}`;
        shareDiv.appendChild(createShareLink(mastodonUrl, 'Mastodon', 'fa-brands fa-mastodon'));

        // 2. BlueSky (Web Intent)
        const blueskyUrl = `https://bsky.app/intent/compose?text=${encodedContent} ${encodedUrl}`;
        shareDiv.appendChild(createShareLink(blueskyUrl, 'BlueSky', 'fa-solid fa-cloud'));

        // 3. Email
        const mailtoUrl = `mailto:?subject=Ενημέρωση από τον Χρήστο Κουλαξίζη&body=${encodedContent}%0A${encodedUrl}`;
        shareDiv.appendChild(createShareLink(mailtoUrl, 'Email', 'fa-solid fa-envelope'));

        // 4. Copy Link (Native)
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<i class="fa-solid fa-link" style="font-size: 1rem;"></i> Link';
        copyBtn.style.background = 'transparent';
        copyBtn.style.border = 'none';
        copyBtn.style.color = 'var(--accent-color)';
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.fontFamily = 'inherit';
        copyBtn.style.fontSize = '0.85rem';
        copyBtn.style.fontWeight = '500';
        copyBtn.style.transition = 'opacity 0.3s';
        copyBtn.onclick = () => shareUpdate(contentText);
        
        copyBtn.onmouseover = () => copyBtn.style.opacity = '0.7';
        copyBtn.onmouseout = () => copyBtn.style.opacity = '1';
        
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
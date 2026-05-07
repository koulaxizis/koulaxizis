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

// Εμφάνιση των updates
function renderUpdates() {
    updatesContainer.innerHTML = '';
    
    const updatesToShow = allUpdates.slice(0, visibleCount);
    
    updatesToShow.forEach(update => {
        const article = document.createElement('article');
        article.className = 'update';
        
        article.innerHTML = `
            <time class="date" datetime="${update.date}">${update.displayDate}</time>
            <div class="content">
                <p>${update.content}</p>
            </div>
        `;
        
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
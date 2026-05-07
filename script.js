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

// --- 2. PAGINATION LOGIC ---
const updatesContainer = document.getElementById('updates-container');
const updates = Array.from(updatesContainer.querySelectorAll('.update'));
const loadMoreBtn = document.getElementById('loadMoreBtn');
const itemsPerPage = 10;
let currentPage = 1;

function showUpdates(page) {
    const end = page * itemsPerPage;
    updates.forEach((update, index) => {
        update.style.display = index < end ? 'block' : 'none';
    });

    if (end >= updates.length) {
        loadMoreBtn.style.display = 'none';
        loadMoreBtn.textContent = 'Όλες οι ενημερώσεις εμφανίζονται';
    } else {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.textContent = `Προβολή Όλων (${updates.length - end} ακόμη)`;
    }
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        showUpdates(currentPage);
    });
    showUpdates(currentPage);
}

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
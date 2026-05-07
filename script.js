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

// --- 2. PAGINATION LOGIC (ΑΝΑΣΤΡΟΦΗ - ΠΡΟΣ ΤΑ ΠΙΣΩ) ---
const updatesContainer = document.getElementById('updates-container');
const updates = Array.from(updatesContainer.querySelectorAll('.update'));
const loadMoreBtn = document.getElementById('loadMoreBtn');

// Ρυθμίσεις
const itemsPerPage = 10;
let visibleCount = itemsPerPage; // Αρχικά βλέπουμε 10
let loadedPages = 1; // Πόσες φορές έχουμε πατήσει το κουμπί

// Συνάρτηση για να εμφανίζουμε τα elements
function updateVisibility() {
    // Εμφανίζουμε τα πρώτα 'visibleCount' elements (τα πιο πρόσφατα)
    updates.forEach((update, index) => {
        if (index < visibleCount) {
            update.style.display = 'block';
        } else {
            update.style.display = 'none';
        }
    });

    // Έλεγχος αν υπάρχουν περισσότερα για να φορτώσουμε
    if (visibleCount >= updates.length) {
        // Δεν υπάρχουν πλέον παλαιότερες
        loadMoreBtn.style.display = 'none';
    } else {
        // Υπάρχουν ακόμα
        loadMoreBtn.style.display = 'block';
        const remaining = updates.length - visibleCount;
        loadMoreBtn.textContent = `Προβολή προηγούμενων (${remaining} ακόμη)`;
    }
}

// Αρχική εμφάνιση
if (loadMoreBtn) {
    updateVisibility();

    loadMoreBtn.addEventListener('click', () => {
        // Προσθέτουμε 10 ακόμη
        visibleCount += itemsPerPage;
        
        // Επαναφορά της σελίδας στο πάνω μέρος για καλύτερη εμπειρία (προαιρετικό)
        // window.scrollTo({ top: 0, behavior: 'smooth' });
        
        updateVisibility();
    });
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
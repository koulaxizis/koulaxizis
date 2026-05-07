// --- 1. THEME TOGGLE LOGIC (PRESET: DARK MODE) ---
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Λειτουργία για να ορίσουμε το θέμα
function setTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-mode');
        themeToggle.textContent = '🌙'; // Εικονίδιο για να πάει στο Dark
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        themeToggle.textContent = '☀️'; // Εικονίδιο για να πάει στο Light
        localStorage.setItem('theme', 'dark');
    }
}

// Έλεγχος αποθηκευμένου θέματος κατά την εκκίνηση
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    // Αν ο χρήστης έχει επιλέξει Light, το εφαρμόζουμε
    setTheme('light');
} else {
    // Αν δεν υπάρχει αποθηκευμένη επιλογή (NULL) ή είναι 'dark',
    // τότε ορίζουμε το DEFAULT ως DARK.
    setTheme('dark');
}

themeToggle.addEventListener('click', () => {
    const isLight = body.classList.contains('light-mode');
    setTheme(isLight ? 'dark' : 'light');
});
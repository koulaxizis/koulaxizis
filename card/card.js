// /card page: theme toggle, share and QR panel.
// Loaded at the end of <body>; kept out of the page so the CSP needs no 'unsafe-inline'.
// Theme toggle: shares the 'theme' localStorage key with the main site
(function () {
    var root = document.documentElement;
    var btn = document.getElementById('themeToggle');
    var meta = document.querySelector('meta[name="theme-color"]');
    function paint() {
        var light = root.classList.contains('light-mode');
        btn.textContent = light ? '🌙' : '☀️';
        if (meta) meta.setAttribute('content', light ? '#ffffff' : '#0d0d0d');
    }
    btn.addEventListener('click', function () {
        root.classList.toggle('light-mode');
        try { localStorage.setItem('theme', root.classList.contains('light-mode') ? 'light' : 'dark'); } catch (e) {}
        paint();
    });
    paint();
})();

// Toast helper
var toastEl = document.getElementById('toast');
var toastTimer;
function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
}

// Share: native share sheet when available, otherwise copy the link
document.getElementById('shareBtn').addEventListener('click', function () {
    var data = { title: 'Χρήστος Κουλαξίζης', text: 'Κάρτα επαφής του Χρήστου Κουλαξίζη', url: 'https://koulaxizis.gr/card/' };
    if (navigator.share) {
        navigator.share(data).catch(function () { /* cancelled by the user */ });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(data.url)
            .then(function () { toast('Ο σύνδεσμος αντιγράφηκε'); })
            .catch(function () { toast('Δεν ήταν δυνατή η αντιγραφή'); });
    } else {
        toast(data.url);
    }
});

// QR panel: show this page's QR so someone else can scan it from the screen
var qrBtn = document.getElementById('qrBtn');
var qrPanel = document.getElementById('qrPanel');
qrBtn.addEventListener('click', function () {
    var open = qrPanel.classList.toggle('open');
    qrBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) qrPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

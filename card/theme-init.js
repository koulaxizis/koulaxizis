// Applies the saved theme before first paint (same localStorage key as the main site).
// Loaded synchronously in <head>; kept out of the page so the CSP needs no 'unsafe-inline'.
(function () {
    try {
        var saved = localStorage.getItem('theme');
        var light = saved === 'light' || (!saved && window.matchMedia('(prefers-color-scheme: light)').matches);
        if (light) document.documentElement.classList.add('light-mode');
    } catch (e) { /* storage blocked: stay dark */ }
})();

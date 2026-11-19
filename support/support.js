(function () {
	'use strict';
	/* EN / EL: every [data-en][data-el] node swaps its text; product links and
	 * alt texts swap too. Text only (textContent), never HTML. */
	var KEY = "koulaxizis-lang";
	var toggle = document.getElementById('langToggle');
	var current = 'el';
	function apply(lang) {
		current = lang;
		document.documentElement.lang = lang;
		document.title = ('el' === lang) ? "\u03a3\u03c4\u03ae\u03c1\u03b9\u03be\u03b5 \u03c4\u03b1 \u03b4\u03c9\u03c1\u03b5\u03ac\u03bd projects" : "Support the free projects";
		toggle.textContent = ('el' === lang) ? 'EN' : 'ΕΛ';
		var nodes = document.querySelectorAll('[data-en][data-el]');
		for (var i = 0; i < nodes.length; i++) {
			nodes[i].textContent = nodes[i].getAttribute('data-' + lang);
		}
		var links = document.querySelectorAll('[data-href-en]');
		for (var j = 0; j < links.length; j++) {
			links[j].setAttribute('href', links[j].getAttribute('data-href-' + lang));
		}
		var imgs = document.querySelectorAll('img[data-alt-el]');
		for (var k = 0; k < imgs.length; k++) {
			if (!imgs[k].hasAttribute('data-alt-en')) { imgs[k].setAttribute('data-alt-en', imgs[k].getAttribute('alt')); }
			imgs[k].setAttribute('alt', imgs[k].getAttribute('data-alt-' + lang));
		}
		try { localStorage.setItem(KEY, lang); } catch (e) { /* blocked storage */ }
	}
	toggle.addEventListener('click', function () { apply('en' === current ? 'el' : 'en'); });
	// ?lang=en|el (links from the other sites) wins over the saved choice.
	var start = "el";
	try {
		var saved = localStorage.getItem(KEY);
		if ('el' === saved || 'en' === saved) { start = saved; }
	} catch (e) { /* blocked storage */ }
	var m = /[?&]lang=(en|el)\b/.exec(location.search);
	if (m) { start = m[1]; }
	if (start !== 'el') { apply(start); }
})();

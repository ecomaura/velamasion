/* Vela Maison – core JS: drawers, modals, AJAX cart */
(function () {
  'use strict';
  var body = document.body;
  var scrim = document.querySelector('[data-scrim]');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Photography flags */
  body.classList.add('zoom-on', 'frame-on');

  /* Drawers + modals (event delegation survives section re-renders) */
  var lastFocus = null;
  function closeAll() {
    $$('.drawer.open,.modal.open').forEach(function (el) { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); });
    scrim.classList.remove('on');
    body.style.overflow = '';
    if (lastFocus) { lastFocus.focus(); lastFocus = null; }
  }
  function openEl(id) {
    var el = document.getElementById(id);
    if (!el) return;
    closeAll();
    lastFocus = document.activeElement;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    scrim.classList.add('on');
    body.style.overflow = 'hidden';
    var f = $('input,button,a', el);
    if (id === 'search-modal') { var i = $('input[type=search]', el); i && setTimeout(function () { i.focus(); }, 50); }
  }
  window.VelaTheme = { openCart: function () { openEl('cart-drawer'); }, closeAll: closeAll };

  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); openEl(o.getAttribute('data-open')); return; }
    if (e.target.closest('[data-close]') || e.target === scrim) { closeAll(); return; }
    if (e.target.classList && e.target.classList.contains('modal')) { closeAll(); return; }
    var q = e.target.closest('[data-qty]');
    if (q) { e.preventDefault(); changeLine(+q.getAttribute('data-qty'), +q.getAttribute('data-qty-value')); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  /* Cart: re-render drawer + header count through the Section Rendering API */
  function refreshCart(openDrawer) {
    return fetch(window.Shopify.routes.root + '?sections=cart-drawer,header')
      .then(function (r) { return r.json(); })
      .then(function (s) {
        ['cart-drawer', 'header'].forEach(function (id) {
          var host = document.getElementById('shopify-section-' + id);
          if (!host || !s[id]) return;
          var doc = new DOMParser().parseFromString(s[id], 'text/html');
          var fresh = doc.getElementById('shopify-section-' + id);
          if (fresh) host.innerHTML = fresh.innerHTML;
        });
        if (openDrawer) openEl('cart-drawer');
        document.dispatchEvent(new CustomEvent('cart:updated'));
      });
  }
  function changeLine(line, quantity) {
    return fetch(window.Shopify.routes.root + 'cart/change.js', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity })
    }).then(function () {
      return refreshCart(false).then(function () { var d = document.getElementById('cart-drawer'); if (d) { d.classList.add('open'); d.setAttribute('aria-hidden', 'false'); } });
    });
  }
  window.VelaTheme.refreshCart = refreshCart;

  /* AJAX add to cart: any <form data-ajax-cart> */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[data-ajax-cart]');
    if (!form) return;
    e.preventDefault();
    var btn = form.querySelector('[type=submit]');
    var label = btn && btn.innerHTML;
    if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.textContent = 'Adding…'; }
    var msg = form.querySelector('[data-form-error]');
    if (msg) { msg.hidden = true; }
    fetch(window.Shopify.routes.root + 'cart/add.js', { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return j; }); })
      .then(function () { return refreshCart(true); })
      .catch(function (err) {
        if (msg) { msg.textContent = (err && err.description) || 'Could not add this item.'; msg.hidden = false; }
      })
      .finally(function () { if (btn) { btn.removeAttribute('aria-disabled'); btn.innerHTML = label; } });
  });
})();

/* Vela Maison – shopping JS: product page, quantity, filters, recommendations */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Quantity steppers (product page + cart page) */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-step]');
    if (!b) return;
    var input = $('[data-qty-input]', b.closest('.qty'));
    if (!input) return;
    var min = input.hasAttribute('min') ? +input.min : 1;
    input.value = Math.max(min, (+input.value || 0) + (+b.getAttribute('data-step')));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* Cart page: submit when a quantity changes */
  document.addEventListener('change', function (e) {
    var f = e.target.closest('[data-cart-form]');
    if (f && e.target.matches('[data-qty-input]')) f.submit();
  });

  /* Product gallery */
  function showMedia(root, id) {
    $$('.gal-main', root).forEach(function (m) { m.classList.toggle('is-active', m.getAttribute('data-media-id') == id); });
    $$('.thumb', root).forEach(function (t) { t.classList.toggle('is-active', t.getAttribute('data-thumb') == id); });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-thumb]');
    if (t) showMedia(t.closest('[data-product-section]'), t.getAttribute('data-thumb'));
  });

  /* Variant selection */
  document.addEventListener('change', function (e) {
    var inp = e.target.closest('.opt input');
    var root = inp && inp.closest('[data-product-section]');
    if (!root) return;
    var data = $('[data-variants]', root);
    if (!data) return;
    var variants = JSON.parse(data.textContent);
    var chosen = $$('.opt', root).map(function (fs) { var c = $('input:checked', fs); return c ? c.value : null; });
    var v = variants.filter(function (x) { return x.options.every(function (o, i) { return o === chosen[i]; }); })[0];
    var btn = $('[data-submit]', root);
    if (!v) { if (btn) { btn.disabled = true; btn.textContent = 'Unavailable'; } return; }
    $('input[name=id]', root).value = v.id;
    try { history.replaceState(null, '', '?variant=' + v.id); } catch (err) {}
    if (v.featured_media) showMedia(root, v.featured_media.id);
    var url = root.getAttribute('data-product-url') + '?variant=' + v.id + '&section_id=' + root.getAttribute('data-section-id');
    fetch(url).then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      ['[data-price]', '[data-submit]'].forEach(function (sel) {
        var fresh = $(sel, doc), old = $(sel, root);
        if (fresh && old) old.replaceWith(fresh);
      });
    });
  });

  /* Collection filters: submit on change; panel open by default on desktop */
  document.addEventListener('change', function (e) {
    var f = e.target.closest('[data-filter-form]');
    if (!f) return;
    if (f.requestSubmit) f.requestSubmit(); else f.submit();
  });
  var fp = $('[data-filters]');
  if (fp && window.matchMedia('(max-width: 960px)').matches) fp.removeAttribute('open');

  /* Related products (Product Recommendations API) */
  $$('[data-recs]').forEach(function (el) {
    fetch(el.getAttribute('data-url')).then(function (r) { return r.text(); }).then(function (t) {
      var d = new DOMParser().parseFromString(t, 'text/html');
      var n = $('[data-recs]', d);
      if (n && $('.card', n)) { el.innerHTML = n.innerHTML; el.closest('[data-related]').hidden = false; }
    }).catch(function () {});
  });
})();

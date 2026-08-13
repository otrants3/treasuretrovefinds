/* Treasure Trove Finds, round 4.
   Everything here degrades: with JS off you still get the header, the nav
   (via the footer and the drawer's :target-free fallback links), every photo,
   every caption, the phone number and the map. JS adds the trove sheet. */

(function () {
  'use strict';

  /* ---- sticky header shadow ---- */
  var head = document.querySelector('.head');
  if (head) {
    var onScroll = function () {
      head.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- mobile drawer ---- */
  var drawer = document.getElementById('drawer');
  var openBtn = document.querySelector('[data-open-menu]');
  var closeBtn = document.querySelector('[data-close-menu]');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.setAttribute('data-open', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = drawer.querySelector('a'); if (f) f.focus(); }
    else if (openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setDrawer(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });

  /* ---- scroll reveals ---- */
  var reveals = document.querySelectorAll('.rise');
  if (reveals.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- the trove ---- */
  var wall = document.getElementById('wall');
  var items = window.TTF_ITEMS || [];
  var PHONE = '+15164462693';

  if (wall && items.length) {
    var shownAll = wall.hasAttribute('data-all');
    var LIMIT = shownAll ? items.length : 12;
    var activeCat = 'all';

    // Vary tile shapes from the real orientation of each photo, so the wall
    // reads like a packed case instead of a tidy product grid.
    function shapeFor(item, i) {
      if (item.orientation === 'portrait') return 'tall';
      if (item.orientation === 'landscape' && i % 7 === 3) return 'wide';
      return '';
    }

    function render() {
      var list = items.filter(function (it) {
        return activeCat === 'all' || it.category === activeCat;
      });
      var slice = list.slice(0, LIMIT);
      wall.innerHTML = slice.map(function (it, i) {
        var shape = shapeFor(it, i);
        var tag = it.price ? it.price : (it.hasTag ? "Bill's tag" : 'The record');
        return '<button class="find ' + shape + '" type="button" data-i="' + items.indexOf(it) + '" ' +
          'aria-label="' + esc(it.caption) + '. Open the record.">' +
          '<img src="../' + it.file + '" alt="' + esc(it.caption) + '" loading="lazy" decoding="async">' +
          '<span class="tag find-tag' + (it.price ? ' price' : '') + '">' + esc(tag) + '</span>' +
          '</button>';
      }).join('');
      var more = document.getElementById('wall-more');
      if (more) more.hidden = shownAll || list.length <= LIMIT;
    }

    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    var chips = document.querySelectorAll('.chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        activeCat = chip.getAttribute('data-cat');
        render();
      });
    });

    render();

    /* ---- record sheet ---- */
    var sheet = document.getElementById('sheet');
    var scrim = document.getElementById('sheet-scrim');
    var sheetBody = document.getElementById('sheet-body');
    var lastFocus = null;

    function openSheet(idx) {
      var it = items[idx];
      if (!it || !sheet) return;
      lastFocus = document.activeElement;

      var meta = [];
      if (it.maker) meta.push('<b>Maker</b> ' + esc(it.maker));
      if (it.era) meta.push('<b>When</b> ' + esc(it.era));
      if (it.price) meta.push('<b>Price</b> ' + esc(it.price));
      meta.push('<b>In</b> ' + esc(it.categoryLabel || 'the booth'));

      var readable = (it.readable && it.readable.length)
        ? '<div class="sheet-note"><p><b>Written on it:</b> ' +
          it.readable.map(esc).map(function (r) { return '&ldquo;' + r + '&rdquo;'; }).join(', ') +
          '</p></div>'
        : '';

      var record;
      if (it.record) {
        record = '<div class="sheet-note"><p>' + esc(it.record) + '</p></div>';
      } else if (it.tags && it.tags.length) {
        record = '<div class="sheet-note"><p><b>' + it.tags.length +
          ' tags readable in this shot:</b></p><ul class="tag-list">' +
          it.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') +
          '</ul></div>';
      } else {
        record = '<div class="sheet-note"><p>The history on this one is at the shop. The cases are open, so ask ' +
          'and it comes out, or call and they will tell you over the phone.</p></div>';
      }

      sheetBody.innerHTML =
        '<img src="../' + it.file + '" alt="' + esc(it.caption) + '">' +
        '<div class="sheet-inner">' +
          (it.title
            ? '<h3>' + esc(it.title) + '</h3><p class="muted">' + esc(it.caption) + '</p>'
            : '<h3>' + esc(it.categoryLabel) + '</h3><p>' + esc(it.caption) + '</p>') +
          '<p class="sheet-meta">' + meta.join('<br>') + '</p>' +
          record + readable +
          '<div class="btn-row">' +
            '<a class="btn primary" href="tel:' + PHONE + '">Ask about this piece</a>' +
            '<a class="btn ghost" href="visit.html">Come see it</a>' +
          '</div>' +
        '</div>';

      sheet.setAttribute('data-open', 'true');
      scrim.setAttribute('data-open', 'true');
      document.body.style.overflow = 'hidden';
      var c = sheet.querySelector('.sheet-close');
      if (c) c.focus();
    }

    function closeSheet() {
      if (!sheet) return;
      sheet.setAttribute('data-open', 'false');
      scrim.setAttribute('data-open', 'false');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    wall.addEventListener('click', function (e) {
      var btn = e.target.closest('.find');
      if (btn) openSheet(parseInt(btn.getAttribute('data-i'), 10));
    });
    if (scrim) scrim.addEventListener('click', closeSheet);
    var sc = document.querySelector('.sheet-close');
    if (sc) sc.addEventListener('click', closeSheet);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeSheet(); setDrawer(false); }
    });

    var moreBtn = document.getElementById('wall-more-btn');
    if (moreBtn) moreBtn.addEventListener('click', function () {
      LIMIT = items.length; render();
    });
  }
})();

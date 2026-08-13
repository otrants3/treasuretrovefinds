/* =============================================================
   Treasure Trove Finds - the booth helper

   Why this exists: the booths are in Las Vegas but the interest is
   national. People want to ask "do you have the pair to this one" and
   today there is nowhere to ask. This answers what it safely can, three
   times, and then turns the conversation into a real email to Treasure Trove Finds.

   THE EMAIL IS THE POINT. The chat is the on-ramp. Every failure mode
   here lands on the email, never on an error.

   Degrades: with JS off, nothing renders and the page is unchanged.
   With no API key on the server, the helper says so and goes straight
   to the email path.
   ============================================================= */

(function () {
  'use strict';

  var EMAIL = 'ttrovefinds@gmail.com';
  var PHONE = '+15164462693';
  var ENDPOINT = '/api/ask';
  var MAX_ANSWERS = 3;
  var STORE = 'ttf-helper-v1';

  /* ---------- session state, so the cap survives page to page ---------- */
  var state = { answers: 0, log: [], photos: 0, done: false };
  try {
    var saved = sessionStorage.getItem(STORE);
    if (saved) state = JSON.parse(saved);
    if (!state || typeof state !== 'object') state = { answers: 0, log: [], photos: 0, done: false };
    if (!Array.isArray(state.log)) state.log = [];
    if (typeof state.answers !== 'number') state.answers = 0;
    if (typeof state.photos !== 'number') state.photos = 0;
  } catch (e) { /* private mode, run in memory */ }

  function save() {
    try { sessionStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- the catalogue we are allowed to speak for ---------- */
  function catalogue() {
    var items = window.TTF_ITEMS || [];
    var rows = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var name = it.title || it.caption || '';
      name = String(name).split('.')[0].slice(0, 90);
      if (!name) continue;
      var row = name + ' [' + (it.categoryLabel || 'in the booth') + ']';
      if (it.price) row += ' ' + it.price;
      rows.push(row);
    }
    return rows;
  }

  /* ---------- build the furniture ---------- */
  var launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'btn primary ai-launch';
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'ai-panel');
  launcher.textContent = 'Ask about a piece';

  var scrim = document.createElement('div');
  scrim.className = 'ai-scrim';
  scrim.setAttribute('data-open', 'false');

  var panel = document.createElement('aside');
  panel.className = 'ai-panel';
  panel.id = 'ai-panel';
  panel.setAttribute('data-open', 'false');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'ai-title');
  panel.innerHTML =
    '<div class="sheet-bar">' +
      '<p class="eyebrow" id="ai-title">Ask about a piece</p>' +
      '<button class="sheet-close" type="button" data-ai-close>Close</button>' +
    '</div>' +
    '<div class="ai-log" id="ai-log" role="log" aria-live="polite" aria-relevant="additions text"></div>' +
    '<div class="ai-foot">' +
      '<form class="ai-form" novalidate>' +
        '<label class="ai-photo" for="ai-file">' +
          '<span class="ai-photo-txt">Add a photo</span>' +
          '<input id="ai-file" type="file" accept="image/*">' +
        '</label>' +
        '<textarea id="ai-text" class="ai-text" rows="1" placeholder="Ask about a piece, an era, a maker" ' +
          'aria-label="Your question"></textarea>' +
        '<button class="btn primary ai-send" type="submit">Send</button>' +
      '</form>' +
      '<div class="ai-foot-row">' +
        '<button class="ai-link" type="button" data-ai-hand>Send this to the shop instead</button>' +
        '<p class="ai-count" id="ai-count"></p>' +
      '</div>' +
    '</div>';

  document.body.appendChild(launcher);
  document.body.appendChild(scrim);
  document.body.appendChild(panel);

  var log = panel.querySelector('#ai-log');
  var form = panel.querySelector('.ai-form');
  var text = panel.querySelector('#ai-text');
  var file = panel.querySelector('#ai-file');
  var sendBtn = panel.querySelector('.ai-send');
  var photoLabel = panel.querySelector('.ai-photo-txt');
  var counter = panel.querySelector('#ai-count');
  var pending = null;   // { dataUrl, name }
  var busy = false;
  var lastFocus = null;

  /* ---------- messages ---------- */
  function bubble(role, body, isHtml) {
    var el = document.createElement('div');
    el.className = 'ai-msg ai-' + role;
    el.innerHTML = isHtml ? body : '<p>' + esc(body).replace(/\n+/g, '</p><p>') + '</p>';
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function note(html) {
    var el = document.createElement('div');
    el.className = 'ai-note';
    el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function paint() {
    log.innerHTML = '';
    bubble('bot',
      '<p><b>Ask about anything, in the cases or not.</b> This answers up to three ' +
      'questions using the pieces photographed for this site, then it writes the ' +
      'whole thing up as an email so Bill and Lisa can pick it up from there.</p>' +
      '<p>Booths 39 and 46, Wednesdays and Sundays, 10 to 6.</p>', true);

    for (var i = 0; i < state.log.length; i++) {
      var m = state.log[i];
      var body = m.content + (m.photo ? '\n(photo attached)' : '');
      bubble(m.role === 'user' ? 'you' : 'bot', body, false);
    }
    if (state.answers >= MAX_ANSWERS) handoffCard('That is three. The shop can take it from here.');
    updateCount();
  }

  function updateCount() {
    var left = Math.max(0, MAX_ANSWERS - state.answers);
    counter.textContent = left === 0
      ? 'No answers left this visit'
      : left + (left === 1 ? ' answer left' : ' answers left');
    var capped = state.answers >= MAX_ANSWERS;
    text.disabled = capped || busy;
    sendBtn.disabled = capped || busy;
    file.disabled = capped || busy;
    form.setAttribute('data-capped', capped ? 'true' : 'false');
    if (capped) text.placeholder = 'Three answers used. Send the question below.';
  }

  /* ---------- the handoff, which is the actual product ---------- */
  function recap() {
    var lines = [];
    lines.push('Hello Bill and Lisa,');
    lines.push('');
    lines.push('I was on your website and had a question about a piece.');
    lines.push('');
    lines.push('WHAT I ASKED');
    var n = 0;
    for (var i = 0; i < state.log.length; i++) {
      if (state.log[i].role !== 'user') continue;
      n++;
      lines.push(n + '. ' + state.log[i].content + (state.log[i].photo ? ' (I have a photo of this one)' : ''));
    }
    if (!n) lines.push('(I had not typed my question yet. Here it is:)');
    lines.push('');
    var bot = [];
    for (var j = 0; j < state.log.length; j++) {
      if (state.log[j].role === 'assistant') bot.push(state.log[j].content);
    }
    if (bot.length) {
      lines.push('WHAT THE WEBSITE HELPER TOLD ME');
      for (var k = 0; k < bot.length; k++) lines.push('- ' + bot[k].replace(/\s+/g, ' ').slice(0, 600));
      lines.push('');
    }
    if (state.photos > 0) {
      lines.push('PHOTO: I took a photo of the piece. Please attach it to this email before you send it, the website could not carry it over.');
      lines.push('');
    }
    lines.push('Page I was on: ' + location.href);
    lines.push('');
    lines.push('Thank you,');
    lines.push('');
    return lines.join('\n');
  }

  function subject() {
    var first = '';
    for (var i = 0; i < state.log.length; i++) {
      if (state.log[i].role === 'user') { first = state.log[i].content; break; }
    }
    first = first.replace(/\s+/g, ' ').trim();
    if (!first) return 'Question from the Treasure Trove Finds website';
    return 'Website question: ' + first.slice(0, 70) + (first.length > 70 ? '...' : '');
  }

  function handoffCard(lead) {
    if (log.querySelector('.ai-hand-card')) {
      var already = log.querySelector('.ai-hand-card');
      already.scrollIntoView({ block: 'nearest' });
      var ta0 = already.querySelector('textarea');
      if (ta0) ta0.focus();
      return;
    }
    var card = document.createElement('div');
    card.className = 'ai-hand-card';
    card.innerHTML =
      '<p class="eyebrow">Send it to the shop</p>' +
      '<p>' + esc(lead || 'Bill and Lisa answer these themselves. Here is the email, ready to go. Change anything you like before it opens.') + '</p>' +
      '<label class="ai-ta-label" for="ai-recap">The email, yours to edit</label>' +
      '<textarea id="ai-recap" class="ai-recap" rows="9" spellcheck="true"></textarea>' +
      '<div class="btn-row">' +
        '<button class="btn primary" type="button" data-ai-mail>Open this in email</button>' +
        '<button class="btn ghost" type="button" data-ai-copy>Copy the text</button>' +
      '</div>' +
      '<p class="ai-fine">Goes to ' + EMAIL + '. No mail app on this device? Copy the text and send it however you like, or call (516) 446-2693.</p>';
    log.appendChild(card);
    var ta = card.querySelector('textarea');
    ta.value = recap();

    card.querySelector('[data-ai-mail]').addEventListener('click', function () {
      var body = ta.value;
      // Mail clients truncate long mailto bodies, so trim for the link only.
      var trimmed = body.length > 1700 ? body.slice(0, 1700) + '\n(...)' : body;
      var href = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(subject()) +
        '&body=' + encodeURIComponent(trimmed);
      window.location.href = href;
      var f = card.querySelector('.ai-fine');
      f.textContent = 'Your mail app should be opening. If nothing happened, copy the text and send it to ' + EMAIL + '.';
    });

    card.querySelector('[data-ai-copy]').addEventListener('click', function (e) {
      var btn = e.currentTarget;
      var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy the text'; }, 2400); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ta.value).then(done, function () { ta.select(); });
      } else {
        ta.select();
        try { document.execCommand('copy'); done(); } catch (err) {}
      }
    });

    log.scrollTop = log.scrollHeight;
    ta.focus();
  }

  /* ---------- photo: downscale in the browser so the payload stays small ---------- */
  function loadPhoto(f, cb) {
    if (!f || !/^image\//.test(f.type)) { cb(null); return; }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        try {
          var max = 1024;
          var w = img.naturalWidth, h = img.naturalHeight;
          var scale = Math.min(1, max / Math.max(w, h));
          var c = document.createElement('canvas');
          c.width = Math.round(w * scale);
          c.height = Math.round(h * scale);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          cb(c.toDataURL('image/jpeg', 0.82));
        } catch (e) {
          cb(String(reader.result).length < 3000000 ? reader.result : null);
        }
      };
      img.onerror = function () { cb(null); };
      img.src = reader.result;
    };
    reader.onerror = function () { cb(null); };
    reader.readAsDataURL(f);
  }

  file.addEventListener('change', function () {
    var f = file.files && file.files[0];
    if (!f) { pending = null; photoLabel.textContent = 'Add a photo'; return; }
    if (f.size > 12 * 1024 * 1024) {
      pending = null; file.value = '';
      photoLabel.textContent = 'Add a photo';
      note('That photo is very large. Try one under 12MB, or attach it to the email instead.');
      return;
    }
    photoLabel.textContent = 'Reading photo';
    loadPhoto(f, function (dataUrl) {
      if (!dataUrl) {
        pending = null; file.value = '';
        photoLabel.textContent = 'Add a photo';
        note('That file would not open as a photo. You can attach it to the email instead.');
        return;
      }
      pending = { dataUrl: dataUrl, name: f.name || 'photo' };
      photoLabel.textContent = 'Photo ready';
    });
  });

  /* ---------- asking ---------- */
  function ask(question) {
    busy = true;
    updateCount();
    var hadPhoto = !!pending;
    state.log.push({ role: 'user', content: question, photo: hadPhoto });
    if (hadPhoto) state.photos++;
    save();
    bubble('you', question + (hadPhoto ? '\n(photo attached)' : ''), false);

    var thinking = bubble('bot', 'Looking...', false);
    thinking.classList.add('ai-thinking');

    var payload = {
      messages: state.log.map(function (m) { return { role: m.role, content: m.content }; }),
      catalogue: catalogue()
    };
    if (pending) payload.image = pending.dataUrl;
    pending = null;
    file.value = '';
    photoLabel.textContent = 'Add a photo';

    var fail = function () {
      thinking.remove();
      // Never leave them at a dead end. The email is the product.
      bubble('bot',
        '<p>The helper is not answering right now. That happens, and it does not ' +
        'cost you the question.</p><p>Bill and Lisa answer these themselves. Here is your ' +
        'question written up for him.</p>', true);
      busy = false;
      updateCount();
      handoffCard('Send it straight to the shop.');
    };

    var done = function (reply) {
      thinking.remove();
      state.log.push({ role: 'assistant', content: reply, photo: false });
      state.answers++;
      save();
      bubble('bot', reply, false);
      busy = false;
      updateCount();
      if (state.answers >= MAX_ANSWERS) {
        handoffCard('That is three. Bill and Lisa answer the rest themselves.');
      }
    };

    var ok = true;
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      ok = r.ok;
      return r.json().catch(function () { return null; });
    }).then(function (data) {
      if (!ok || !data || !data.reply) return fail();
      done(String(data.reply));
    }).catch(fail);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy || state.answers >= MAX_ANSWERS) return;
    var q = text.value.replace(/\s+/g, ' ').trim();
    if (!q && pending) q = 'Here is a photo of a piece. What can you tell me about it?';
    if (!q) { text.focus(); return; }
    text.value = '';
    text.style.height = '';
    ask(q.slice(0, 1200));
  });

  // Enter sends, Shift+Enter makes a new line.
  text.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  });
  text.addEventListener('input', function () {
    text.style.height = 'auto';
    text.style.height = Math.min(text.scrollHeight, 132) + 'px';
  });

  panel.querySelector('[data-ai-hand]').addEventListener('click', function () {
    handoffCard();
  });

  /* ---------- open, close, focus ---------- */
  function focusables() {
    return Array.prototype.filter.call(
      panel.querySelectorAll('button, textarea, input, a[href], [tabindex]:not([tabindex="-1"])'),
      function (el) { return !el.disabled && el.offsetParent !== null; }
    );
  }

  function open() {
    lastFocus = document.activeElement;
    paint();
    panel.setAttribute('data-open', 'true');
    scrim.setAttribute('data-open', 'true');
    launcher.setAttribute('aria-expanded', 'true');
    document.body.classList.add('ai-open');
    var target = state.answers >= MAX_ANSWERS ? panel.querySelector('.ai-recap') : text;
    (target || panel.querySelector('.sheet-close')).focus();
  }

  function close() {
    panel.setAttribute('data-open', 'false');
    scrim.setAttribute('data-open', 'false');
    launcher.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('ai-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    else launcher.focus();
  }

  launcher.addEventListener('click', open);
  scrim.addEventListener('click', close);
  panel.querySelector('[data-ai-close]').addEventListener('click', close);

  panel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var list = focusables();
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.getAttribute('data-open') === 'true') close();
  });

  updateCount();
})();

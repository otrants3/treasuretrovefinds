// Review scaffolding. Builds the design switcher on every concept page.
(function () {
  'use strict';
  var DESIGNS = [
    { n: '1', file: '01-litho.html', name: 'The Litho' },
    { n: '2', file: '02-keeper.html', name: 'The Keeper' },
    { n: '3', file: '03-underglass.html', name: 'Under Glass' },
    { n: '4', file: '04-the-cabinet.html', name: 'The Cabinet' },
    { n: '5', file: '05-walkthrough.html', name: 'The Walkthrough' }
  ];
  var here = location.pathname.split('/').pop();

  var bar = document.createElement('nav');
  bar.id = 'dswitch';
  bar.setAttribute('aria-label', 'Switch design');

  var lbl = document.createElement('span');
  lbl.className = 'lbl';
  lbl.textContent = 'Design';
  bar.appendChild(lbl);

  DESIGNS.forEach(function (d) {
    var a = document.createElement('a');
    a.href = d.file;
    a.textContent = d.n;
    a.title = d.name;
    if (d.file === here) a.setAttribute('aria-current', 'page');
    bar.appendChild(a);
  });

  var home = document.createElement('a');
  home.href = 'index.html';
  home.className = 'home';
  home.textContent = 'All';
  home.title = 'Back to all five';
  bar.appendChild(home);

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(bar);
  });
  if (document.readyState !== 'loading') document.body.appendChild(bar);

  // number keys 1 to 5 jump between designs
  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var i = DESIGNS.findIndex(function (d) { return d.n === e.key; });
    if (i > -1 && DESIGNS[i].file !== here) location.href = DESIGNS[i].file;
  });
})();

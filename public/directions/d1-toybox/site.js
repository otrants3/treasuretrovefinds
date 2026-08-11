/* Shared behavior for the Toy Box pages. Everything degrades:
   no JS = header still sticky, nav links still visible on desktop,
   mobile menu button hidden content is duplicated in the footer. */
(function(){
  /* Sticky header shadow once scrolled */
  var head = document.querySelector('.site-head');
  if (head){
    var onScroll = function(){
      head.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* Full-screen mobile menu */
  var openBtn = document.querySelector('.menu-btn');
  var overlay = document.querySelector('.menu-overlay');
  var closeBtn = document.querySelector('.menu-close');
  function setMenu(open){
    document.body.classList.toggle('menu-open', open);
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && closeBtn) closeBtn.focus();
    if (!open && openBtn) openBtn.focus();
  }
  if (openBtn && overlay){
    openBtn.addEventListener('click', function(){ setMenu(true); });
    if (closeBtn) closeBtn.addEventListener('click', function(){ setMenu(false); });
    overlay.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ document.body.classList.remove('menu-open'); });
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false);
    });
  }

  /* Scroll reveal, fully guarded: without JS or with reduced motion,
     everything is simply visible. No content ever depends on this. */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('motion');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rev').forEach(function(el){ io.observe(el); });
})();

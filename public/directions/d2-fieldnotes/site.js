/* Field Notes · shared behavior for all five pages.
   Everything here is enhancement only. Without JS: the page is fully
   readable, the mobile menu opens via :target, strips are static. */
(function(){
  "use strict";

  /* ---- sticky header: solid shadow once scrolled ---- */
  var head = document.querySelector(".site-head");
  if (head){
    var onScroll = function(){ head.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, {passive:true});
    onScroll();
  }

  /* ---- full-screen mobile menu ---- */
  var menu = document.getElementById("menu");
  var openBtn = document.getElementById("menuOpen");
  var closeBtn = document.getElementById("menuClose");
  function closeMenu(){
    if (!menu) return;
    menu.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (menu && openBtn && closeBtn){
    openBtn.addEventListener("click", function(e){
      e.preventDefault();
      menu.classList.add("open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    });
    closeBtn.addEventListener("click", function(e){
      e.preventDefault();
      closeMenu();
      openBtn.focus();
    });
    menu.addEventListener("click", function(e){
      var a = e.target.closest ? e.target.closest("a") : null;
      if (a && a !== closeBtn) closeMenu(); /* navigating away; unlock scroll */
    });
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape" && menu.classList.contains("open")){
        closeMenu();
        openBtn.focus();
      }
    });
  }

  /* ---- motion below this line only ---- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return; /* static fallback: everything already in the markup */

  document.documentElement.classList.add("anim");

  /* ---- scroll reveal ---- */
  var revs = document.querySelectorAll(".rev");
  var revIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add("in"); revIO.unobserve(e.target); }
    });
  }, {rootMargin:"0px 0px -8% 0px", threshold:0.05});
  revs.forEach(function(el){ revIO.observe(el); });

  /* ---- accession strips: type themselves in ---- */
  var strips = document.querySelectorAll(".acc");
  strips.forEach(function(el){
    var full = el.textContent.replace(/\s+/g," ").trim();
    el.dataset.full = full;
    el.style.minHeight = el.offsetHeight + "px"; /* no layout shift while typing */
    el.textContent = "";
  });
  function typeStrip(el){
    var full = el.dataset.full || "";
    var i = 0;
    el.classList.add("typing");
    var t = setInterval(function(){
      i++;
      el.textContent = full.slice(0, i);
      if (i >= full.length){ clearInterval(t); el.classList.remove("typing"); }
    }, 17);
  }
  var accIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ accIO.unobserve(e.target); typeStrip(e.target); }
    });
  }, {rootMargin:"0px 0px -12% 0px", threshold:0.4});
  strips.forEach(function(el){ accIO.observe(el); });
})();

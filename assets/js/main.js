// PHANTOM WARRIOR — shared page setup
(function () {
  var cfg = window.PW_CONFIG || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  // Footer social links from config (only entries with a URL)
  var soc = document.getElementById("footer-social");
  if (soc) {
    var links = Object.keys(cfg.social || {}).filter(function (k) { return cfg.social[k]; });
    soc.innerHTML = links.length ? "" : "<span>Social links coming soon.</span>";
    links.forEach(function (k) {
      var a = document.createElement("a");
      a.href = cfg.social[k]; a.textContent = k; a.target = "_blank"; a.rel = "noopener";
      soc.appendChild(a);
    });
  }

  // Scroll reveal
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Hero sparks (skipped for reduced motion)
  var sparks = document.getElementById("sparks");
  if (sparks && !reduce) {
    for (var i = 0; i < 14; i++) {
      var s = document.createElement("span");
      s.className = "spark";
      s.style.cssText = "left:" + (40 + Math.random() * 55) + "%;--t:" + (5 + Math.random() * 5) + "s;--w:" + (Math.random() * 6) + "s;--x:" + (Math.random() * 120 - 60) + "px";
      sparks.appendChild(s);
    }
  }
})();

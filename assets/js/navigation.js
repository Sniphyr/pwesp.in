// PHANTOM WARRIOR — mobile menu, desktop sidebar pin + active page highlight
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var list = document.getElementById("nav-list");
  var mq = window.matchMedia("(min-width: 821px)"); // keep in sync with responsive.css

  if (toggle && list) {
    function isOpen() { return list.classList.contains("open"); }
    function setOpen(open) {
      list.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }
    toggle.addEventListener("click", function () { setOpen(!isOpen()); });
    list.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (isOpen() && !e.target.closest(".nav")) setOpen(false);
    });
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener("change", onChange); else mq.addListener(onChange);
  }

  // Desktop sidebar: "keep expanded" pin button (state saved in localStorage; the CSS is in components.css)
  var nav = document.querySelector(".site-header .nav");
  if (nav) {
    var root = document.documentElement;
    var pin = document.createElement("button");
    pin.type = "button";
    pin.className = "nav-pin";
    pin.setAttribute("aria-label", "Keep sidebar expanded");
    pin.innerHTML = '<svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 3h6l-1 6 3 3v2H7v-2l3-3-1-6z"/><path d="M12 14v7"/></svg><span class="nav-label">Keep expanded</span>';
    var setPinned = function (on, save) {
      root.classList.toggle("nav-pinned", on);
      pin.setAttribute("aria-pressed", String(on));
      if (save) { try { localStorage.setItem("pw-nav-pinned", on ? "1" : "0"); } catch (e) {} }
    };
    setPinned(root.classList.contains("nav-pinned"), false);
    pin.addEventListener("click", function () { setPinned(!root.classList.contains("nav-pinned"), true); });
    nav.appendChild(pin);
  }

  // Active page (Sign Up is the #signup section of login.html)
  function markActive() {
    var page = location.pathname.split("/").pop() || "index.html";
    var full = page + (location.hash === "#signup" ? "#signup" : "");
    var links = document.querySelectorAll(".nav-list a");
    var exact = Array.prototype.some.call(links, function (a) { return a.getAttribute("href") === full; });
    links.forEach(function (a) {
      var h = a.getAttribute("href");
      if (h === (exact ? full : page)) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }
  markActive();
  window.addEventListener("hashchange", markActive);
})();

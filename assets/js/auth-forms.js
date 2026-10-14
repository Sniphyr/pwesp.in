// PHANTOM WARRIOR — login / register / forgot / reset form behaviour. Uses window.PWAuth (assets/js/auth.js).
// All user-provided text is written with textContent (never innerHTML).
(function () {
  "use strict";
  var A = window.PWAuth;
  var root = document.querySelector("[data-auth]");
  if (!root || !A) return;
  var page = root.getAttribute("data-auth");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PW_MIN = 8, PW_MAX = 72;
  var ROLES = ["Rusher", "Nader", "Sniper", "IGL", "Assaulter", "Coach / Manager", "Other / Supporter"];
  var SOURCES = ["Instagram", "YouTube", "Discord", "Friends / Referral", "Free Fire Tournament / Esports", "Other"];
  var busy = false;

  function $(id) { return document.getElementById(id); }

  // ---------- messages ----------
  function setStatus(el, kind, text) {
    if (!el) return;
    el.textContent = "";
    var p = document.createElement("p");
    p.className = "is-" + kind;
    if (kind === "error") p.setAttribute("role", "alert");
    p.textContent = text;
    el.appendChild(p);
    el.className = "auth-status is-" + kind;
  }
  function clearStatus(el) { if (el) { el.textContent = ""; el.className = "auth-status"; } }
  function setFieldError(input, msg) {
    var err = $(input.id + "-err");
    if (msg) { input.setAttribute("aria-invalid", "true"); if (err) { err.textContent = msg; err.hidden = false; } }
    else { input.removeAttribute("aria-invalid"); if (err) { err.textContent = ""; err.hidden = true; } }
    return !msg;
  }

  // ---------- busy state ----------
  function lock(on, btn, busyLabel) {
    busy = on;
    var all = root.querySelectorAll(".auth-submit");
    Array.prototype.forEach.call(all, function (b) { b.disabled = on; });
    if (btn) {
      btn.setAttribute("aria-busy", String(on));
      btn.classList.toggle("is-loading", on);
      var l = btn.querySelector(".btn-label");
      if (l) { if (on) { btn.dataset.label = l.textContent; l.textContent = busyLabel; } else if (btn.dataset.label) { l.textContent = btn.dataset.label; } }
    }
  }

  // ---------- show / hide password ----------
  Array.prototype.forEach.call(document.querySelectorAll(".pw-toggle"), function (t) {
    t.addEventListener("click", function () {
      var input = $(t.getAttribute("data-target"));
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      t.setAttribute("aria-pressed", String(show));
      t.setAttribute("aria-label", show ? "Hide password" : "Show password");
      input.focus();
    });
  });

  // ---------- keep the focused field visible when a phone keyboard opens ----------
  document.addEventListener("focusin", function (e) {
    var t = e.target;
    if (!t.matches || !t.matches("input:not([type=checkbox]),select")) return;
    if (!window.matchMedia("(max-width: 820px)").matches) return;
    setTimeout(function () { try { t.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }); } catch (x) {} }, 300);
  });

  // ---------- shared notices ----------
  var banner = $("auth-banner");
  function showEnvNotices() {
    var a = A.availability();
    if (banner) {
      if (!a.ok) setStatus(banner, "warn", a.message);
      else if (A.isFile()) setStatus(banner, "info", "You opened this page from a file. Email/password works, but emailed links need the site served over http(s). See docs/SUPABASE_SETUP.md.");
    }
  }
  function authFailure(err, statusEl, ctx) {
    setStatus(statusEl, "error", A.friendly(err, ctx));
  }

  // ---------- validators ----------
  var V = {
    email: function (v) { v = v.trim(); return !v ? "Enter your email address." : !RE_EMAIL.test(v) ? "Enter a valid email address." : ""; },
    loginPassword: function (v) { return v ? "" : "Enter your password."; },
    newPassword: function (v) { return !v ? "Create a password." : v.length < PW_MIN ? "Use at least " + PW_MIN + " characters." : v.length > PW_MAX ? "Use no more than " + PW_MAX + " characters." : ""; },
    name: function (v) { v = v.trim(); return !v ? "Enter your full name." : v.length > 80 ? "Use 80 characters or fewer." : ""; },
    ign: function (v) { v = v.trim(); return !v ? "Enter your in-game name." : v.length > 40 ? "Use 40 characters or fewer." : ""; },
    uid: function (v) { v = v.trim(); return !v ? "Enter your in-game UID." : v.length > 32 ? "Use 32 characters or fewer." : ""; },
    role: function (v) { return !v ? "Select your role." : ROLES.indexOf(v) < 0 ? "Select a role from the list." : ""; },
    source: function (v) { return !v ? "Tell us where you heard about us." : SOURCES.indexOf(v) < 0 ? "Select an option from the list." : ""; }
  };
  function bind(input, fn) {
    var touched = false;
    function run() { return setFieldError(input, fn(input.value)); }
    input.addEventListener("blur", function () { if (input.value !== "" || touched) { touched = true; run(); } });
    input.addEventListener("input", function () { if (touched || input.hasAttribute("aria-invalid")) run(); });
    input.addEventListener("change", function () { touched = true; run(); });
    return run;
  }
  function focusFirstInvalid(form) {
    var bad = form.querySelector("[aria-invalid=true]");
    if (bad) bad.focus();
  }

  // ---------- LOGIN ----------
  function initLogin() {
    var next = A.safeNext();
    if (location.hash === "#signup") { location.replace("register.html" + A.nextQuery(next)); return; }
    var loginView = $("view-login"), forgotView = $("view-forgot"), sessionView = $("view-session");
    var form = $("login-form"), status = $("login-status"), email = $("login-email"), pw = $("login-password");
    var remember = $("login-remember");
    var checks = { email: bind(email, V.email), pw: bind(pw, V.loginPassword) };
    var createLink = $("create-link"); if (createLink) createLink.href = "register.html" + A.nextQuery(next);
    showEnvNotices();

    function go() { location.href = next || "index.html"; }

    // Views: sign in / forgot password / already signed in
    function showView() {
      var forgot = location.hash === "#forgot";
      if (!sessionView.hidden) return;
      loginView.hidden = forgot; forgotView.hidden = !forgot;
      var h = (forgot ? forgotView : loginView).querySelector("h1");
      if (h && document.documentElement.dataset.viewReady) h.focus({ preventScroll: false });
      document.documentElement.dataset.viewReady = "1";
    }
    window.addEventListener("hashchange", showView);

    // Returning from an emailed link (?code=...) or already signed in
    var fromEmailLink = /[?&]code=/.test(location.search);
    var linkError = new URLSearchParams(location.search).get("error_description") || new URLSearchParams(location.hash.slice(1)).get("error_description");
    if (linkError) setStatus(status, "error", "That link could not be completed. It may have expired. Please try again.");
    if (A.availability().ok) {
      A.onAuthChange(function (event, session) {
        if (event === "SIGNED_IN" && session && fromEmailLink) go();
      });
      A.getSession().then(function (session) {
        if (!session) return;
        if (fromEmailLink) { go(); return; }
        loginView.hidden = true; forgotView.hidden = true; sessionView.hidden = false;
        var who = $("session-email"); if (who) who.textContent = session.user && session.user.email ? session.user.email : "your account";
        var c = $("session-continue"); if (c) c.href = next || "index.html";
      }).catch(function () {});
    }
    showView();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      clearStatus(status);
      var ok = checks.email() & checks.pw();
      if (!ok) { setStatus(status, "error", "Please fix the highlighted fields."); focusFirstInvalid(form); return; }
      var a = A.availability(); if (!a.ok) { setStatus(status, "error", a.message); return; }
      var btn = form.querySelector(".auth-submit");
      lock(true, btn, "Signing in…");
      setStatus(status, "info", "Signing you in…");
      A.signIn(email.value.trim(), pw.value, remember.checked).then(function () {
        pw.value = "";
        setStatus(status, "success", "Signed in. Redirecting…");
        setTimeout(go, 600);
      }).catch(function (err) {
        lock(false, btn);
        authFailure(err, status);
        pw.focus();
      });
    });


    // Forgot password
    var fForm = $("forgot-form"), fStatus = $("forgot-status"), fEmail = $("forgot-email");
    var fCheck = bind(fEmail, V.email);
    fForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      clearStatus(fStatus);
      if (!fCheck()) { setStatus(fStatus, "error", "Enter a valid email address."); fEmail.focus(); return; }
      var a = A.availability(); if (!a.ok) { setStatus(fStatus, "error", a.message); return; }
      var btn = fForm.querySelector(".auth-submit");
      lock(true, btn, "Sending…");
      A.sendResetEmail(fEmail.value.trim()).then(function () {
        lock(false, btn);
        setStatus(fStatus, "success", "If an account exists for that email, a password reset link is on its way. Check your inbox and spam folder.");
      }).catch(function (err) { lock(false, btn); authFailure(err, fStatus, "reset"); });
    });

    // Signed-in panel: sign out
    var out = $("session-signout");
    if (out) out.addEventListener("click", function () {
      if (busy) return;
      var s = $("session-status"); clearStatus(s); lock(true, null);
      A.signOut().then(function () { location.reload(); }).catch(function (err) { lock(false, null); authFailure(err, s); });
    });
  }

  // ---------- REGISTER ----------
  function initRegister() {
    var next = A.safeNext();
    var form = $("register-form"), status = $("register-status");
    var f = { name: $("reg-name"), email: $("reg-email"), pw: $("reg-password"), confirm: $("reg-confirm"), role: $("reg-role"), ign: $("reg-ign"), uid: $("reg-uid"), source: $("reg-source") };
    var loginLink = $("login-link"); if (loginLink) loginLink.href = "login.html" + A.nextQuery(next);
    showEnvNotices();
    var matchMsg = function () { return !f.confirm.value ? "Confirm your password." : f.confirm.value !== f.pw.value ? "Passwords do not match." : ""; };
    var checks = [
      bind(f.name, V.name), bind(f.email, V.email), bind(f.pw, V.newPassword),
      bind(f.confirm, matchMsg), bind(f.role, V.role), bind(f.ign, V.ign), bind(f.uid, V.uid), bind(f.source, V.source)
    ];
    f.pw.addEventListener("input", function () { if (f.confirm.value) setFieldError(f.confirm, matchMsg()); });

    if (A.availability().ok) {
      A.getSession().then(function (s) {
        if (s) setStatus(status, "info", "You are already signed in. Registering again will not change your current account.");
      }).catch(function () {});
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      clearStatus(status);
      var ok = true;
      checks.forEach(function (c) { if (!c()) ok = false; });
      if (!ok) { setStatus(status, "error", "Please fix the highlighted fields."); focusFirstInvalid(form); return; }
      var a = A.availability(); if (!a.ok) { setStatus(status, "error", a.message); return; }
      var btn = form.querySelector(".auth-submit");
      lock(true, btn, "Creating account…");
      setStatus(status, "info", "Creating your account…");
      var profile = {
        fullName: f.name.value.trim().replace(/\s+/g, " "), email: f.email.value.trim(), role: f.role.value,
        ign: f.ign.value.trim(), uid: f.uid.value.trim(), source: f.source.value
      };
      A.signUp(profile, f.pw.value).then(function (r) {
        f.pw.value = ""; f.confirm.value = "";
        if (r.signedIn) {
          setStatus(status, "success", "Account created. You are signed in. Redirecting…");
          setTimeout(function () { location.href = next || "index.html"; }, 800);
          return;
        }
        // Same wording whether the address is new or already registered (no account enumeration).
        lock(false, btn);
        form.hidden = true;
        var done = $("register-done"); done.hidden = false;
        $("register-done-email").textContent = profile.email;
        done.querySelector("h2").focus();
      }).catch(function (err) {
        lock(false, btn);
        var code = err && err.code;
        if (code === "user_already_exists" || code === "email_exists") {
          lock(false, btn); form.hidden = true;
          var d = $("register-done"); d.hidden = false; $("register-done-email").textContent = profile.email; d.querySelector("h2").focus();
          return;
        }
        authFailure(err, status);
      });
    });
  }

  // ---------- RESET PASSWORD (arrives from the emailed link) ----------
  function initReset() {
    var form = $("reset-form"), status = $("reset-status"), invalid = $("reset-invalid"), done = $("reset-done"), loading = $("reset-loading");
    var pw = $("reset-password"), confirm = $("reset-confirm");
    var matchMsg = function () { return !confirm.value ? "Confirm your new password." : confirm.value !== pw.value ? "Passwords do not match." : ""; };
    var checks = [bind(pw, V.newPassword), bind(confirm, matchMsg)];
    pw.addEventListener("input", function () { if (confirm.value) setFieldError(confirm, matchMsg()); });
    showEnvNotices();
    var a = A.availability();
    var settled = false;
    function show(which) {
      if (settled) return; settled = true;
      loading.hidden = true;
      if (which === "form") { form.hidden = false; pw.focus(); } else { invalid.hidden = false; }
    }
    if (!a.ok) { settled = false; loading.hidden = true; invalid.hidden = false; return; }
    var hadCode = /[?&]code=/.test(location.search);
    var urlError = new URLSearchParams(location.search).get("error_description") || new URLSearchParams(location.hash.slice(1)).get("error_description");
    if (urlError) { show("invalid"); return; }
    A.onAuthChange(function (event) { if (event === "PASSWORD_RECOVERY") show("form"); });
    setTimeout(function () {
      if (settled) return;
      if (hadCode) { A.getSession().then(function (s) { show(s ? "form" : "invalid"); }).catch(function () { show("invalid"); }); }
      else show("invalid");
    }, 4000);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      clearStatus(status);
      var ok = true; checks.forEach(function (c) { if (!c()) ok = false; });
      if (!ok) { setStatus(status, "error", "Please fix the highlighted fields."); focusFirstInvalid(form); return; }
      var btn = form.querySelector(".auth-submit");
      lock(true, btn, "Updating…");
      A.updatePassword(pw.value).then(function () {
        pw.value = ""; confirm.value = "";
        lock(false, btn); form.hidden = true; done.hidden = false; done.querySelector("h2").focus();
      }).catch(function (err) { lock(false, btn); authFailure(err, status); });
    });
  }

  if (page === "login") initLogin();
  else if (page === "register") initRegister();
  else if (page === "reset") initReset();
})();

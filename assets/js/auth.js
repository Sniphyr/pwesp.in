// PHANTOM WARRIOR — authentication layer (Supabase Auth). No UI code here; pages use assets/js/auth-forms.js.
// Requires the Supabase JS client from the official CDN (loaded by the page) and assets/js/supabase-config.js.
// Sessions are managed by the Supabase client; this file never stores tokens or passwords itself.
(function () {
  "use strict";
  var cfg = window.PW_SUPABASE || {};
  var REMEMBER_KEY = "pw-auth-remember"; // "0" = this browser tab only; anything else = remember. Not a secret.
  var client = null;

  function configured() {
    var u = String(cfg.url || "").trim(), k = String(cfg.publishableKey || "").trim();
    return /^https:\/\/\S+$/.test(u) && k.length > 0 && !/YOUR_/i.test(u + k);
  }
  function remembered() { try { return localStorage.getItem(REMEMBER_KEY) !== "0"; } catch (e) { return true; } }
  function setRemember(on) { try { localStorage.setItem(REMEMBER_KEY, on ? "1" : "0"); } catch (e) {} }

  // Storage adapter handed to the Supabase client: the client decides WHAT to store; we only choose WHERE
  // (localStorage when "Remember me" is on, sessionStorage when it is off).
  var storage = {
    getItem: function (k) { try { return localStorage.getItem(k) || sessionStorage.getItem(k); } catch (e) { return null; } },
    setItem: function (k, v) {
      try {
        if (remembered()) { localStorage.setItem(k, v); sessionStorage.removeItem(k); }
        else { sessionStorage.setItem(k, v); localStorage.removeItem(k); }
      } catch (e) {}
    },
    removeItem: function (k) { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch (e) {} }
  };

  function availability() {
    if (!configured()) return { ok: false, reason: "config", message: "Authentication is not set up yet. The site owner must add the Supabase project URL and publishable key (see docs/SUPABASE_SETUP.md)." };
    if (!(window.supabase && window.supabase.createClient)) return { ok: false, reason: "sdk", message: "The sign-in service could not be loaded. Check your internet connection and reload the page." };
    return { ok: true };
  }
  function getClient() {
    if (client) return client;
    if (!availability().ok) return null;
    client = window.supabase.createClient(String(cfg.url).trim(), String(cfg.publishableKey).trim(), {
      auth: { storage: storage, storageKey: "pw-auth", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" }
    });
    return client;
  }

  // Absolute URL of a page next to the current one (used for email links). file:// is not usable for these.
  function isFile() { return location.protocol === "file:"; }
  function pageUrl(name, query) { return new URL(name + (query || ""), location.href).href; }
  // Only allow returning to a local page like "maps.html" or "maps.html#x" (blocks open redirects).
  function safeNext(raw) {
    var v = raw == null ? new URLSearchParams(location.search).get("next") : raw;
    return v && /^[a-z0-9_-]+\.html(#[\w-]*)?$/i.test(v) ? v : "";
  }
  function nextQuery(next) { return next ? "?next=" + encodeURIComponent(next) : ""; }

  // Turn Supabase / network errors into plain language. Never echoes raw server text.
  function friendly(err, ctx) {
    var code = err && (err.code || ""), msg = String((err && err.message) || ""), status = err && err.status;
    if (err && err.pwReason) return err.message;
    if (err && (err.name === "AuthRetryableFetchError" || status === 0 || /failed to fetch|networkerror|network request|load failed/i.test(msg)))
      return "Network problem. Check your connection and try again.";
    if (code === "invalid_credentials" || /invalid login credentials/i.test(msg)) return "Incorrect email or password.";
    if (code === "email_not_confirmed" || /email not confirmed/i.test(msg)) return "Your email address is not verified yet. Open the confirmation link we emailed you, then sign in.";
    if (code === "weak_password" || /password.*(weak|at least|short)/i.test(msg)) return "That password is too weak. Use a longer, less common password.";
    if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit" || status === 429) return "Too many attempts. Please wait a few minutes and try again.";
    if (code === "signup_disabled" || /signups? (not allowed|disabled)/i.test(msg)) return "New registrations are currently disabled.";
    if (/database error saving new user/i.test(msg)) return "Your account could not be created because the profile details were rejected or the database is not set up yet. Check your entries and try again.";
    if (/api key|apikey|invalid.*key|jwt/i.test(msg) || status === 401) return "The sign-in service is misconfigured (invalid project URL or key). The site owner must check supabase-config.js.";
    return ctx === "reset" ? "We could not send the reset email. Please try again." : "Something went wrong. Please try again.";
  }

  function wrap(fn, ctx) {
    var a = availability();
    if (!a.ok) { var e = new Error(a.message); e.pwReason = a.reason; return Promise.reject(e); }
    return fn(getClient()).catch(function (err) { throw err; });
  }

  window.PWAuth = {
    availability: availability, isFile: isFile, pageUrl: pageUrl, safeNext: safeNext, nextQuery: nextQuery, friendly: friendly,
    getClient: getClient,
    getSession: function () {
      return wrap(function (c) { return c.auth.getSession(); }).then(function (r) { return r.data && r.data.session ? r.data.session : null; });
    },
    onAuthChange: function (cb) { var c = getClient(); if (!c) return function () {}; var s = c.auth.onAuthStateChange(cb); return function () { s.data.subscription.unsubscribe(); }; },
    signIn: function (email, password, remember) {
      setRemember(remember);
      return wrap(function (c) { return c.auth.signInWithPassword({ email: email, password: password }); }).then(function (r) {
        if (r.error) throw r.error;
        return r.data;
      });
    },
    signUp: function (profile, password) {
      setRemember(true);
      var opts = { data: { full_name: profile.fullName, player_role: profile.role, ign: profile.ign, uid: profile.uid, discovery_source: profile.source } };
      if (!isFile()) opts.emailRedirectTo = pageUrl("login.html");
      return wrap(function (c) { return c.auth.signUp({ email: profile.email, password: password, options: opts }); }).then(function (r) {
        if (r.error) throw r.error;
        var u = r.data.user;
        // Supabase answers a sign-up for an already-registered email with an obfuscated user (no identities) to prevent account enumeration.
        return { session: r.data.session, signedIn: !!r.data.session, obfuscated: !!(u && u.identities && u.identities.length === 0) };
      });
    },
    sendResetEmail: function (email) {
      var opts = isFile() ? undefined : { redirectTo: pageUrl("reset-password.html") };
      return wrap(function (c) { return c.auth.resetPasswordForEmail(email, opts); }, "reset").then(function (r) { if (r.error) throw r.error; });
    },
    updatePassword: function (password) {
      return wrap(function (c) { return c.auth.updateUser({ password: password }); }).then(function (r) { if (r.error) throw r.error; });
    },
    signOut: function () {
      return wrap(function (c) { return c.auth.signOut(); }).then(function (r) { if (r.error) throw r.error; });
    }
  };
})();

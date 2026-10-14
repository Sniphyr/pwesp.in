# HANDOFF — Batch 1: Login & Registration (PHANTOM WARRIOR)

**Update:** Google sign-in has been removed entirely (button, divider, handlers, CSS, `googleEnabled` setting, Google setup docs). Email/password signup, login, logout, forgot/reset password are unchanged. Any mention of Google below is historical and no longer applies.

Status: **front-end code complete; real authentication NOT yet verified** because no Supabase project/credentials were available. Nothing below claims Supabase or email verification works end-to-end.

## Files
**New:** `register.html`, `reset-password.html`, `assets/css/auth.css`, `assets/js/supabase-config.js` (placeholders), `assets/js/auth.js` (Supabase layer), `assets/js/auth-forms.js` (form logic), `supabase/setup.sql`, `docs/SUPABASE_SETUP.md` (incl. Google OAuth guide), this file.
**Changed:** `login.html` (placeholder replaced by the real login; also holds Forgot Password and an "already signed in" panel), `index/about/contact/maps/plan-maps/teams.html` (Sign Up link now `register.html`), `assets/js/navigation.js` (active-link rule for Sign Up), `PROJECT_STATUS.md`.
**Untouched:** homepage, sidebar design, existing CSS files, logo (`pw-primary-logo.png` reused as-is).
`login.html#signup` still works (redirects to `register.html`).

## Behaviour
- **Login:** email, password (show/hide), Remember Me, Forgot Password, Sign In, link to register. Success is only shown after Supabase confirms. Errors: wrong credentials, unverified email, network, rate limit, bad configuration.
- **Remember Me:** on = session kept in localStorage; off = sessionStorage (cleared when the tab closes). Supabase manages the tokens; only a non-secret `pw-auth-remember` flag is stored by us.
- **Forgot Password:** `#forgot` view on `login.html` -> Supabase reset email -> `reset-password.html` (PKCE recovery link) -> new password. Always shows the same "if an account exists…" message.
- **Register:** exactly the 8 requested fields and exact option lists, inline validation, password 8–72 chars + match check, double-submit lock. Profile fields travel as sign-up metadata; the DB trigger in `setup.sql` validates and writes `profiles` linked to the auth user id. Password is never in the profile. If email verification is on, a "Check your email" panel is shown (same wording for new and existing addresses) — the user is not treated as signed in.
- `?next=page.html` is preserved (only local `*.html` names are accepted).
- **Not done:** route protection, a logout button in the nav (sign-out exists on the "already signed in" panel of `login.html`).

## You must do before real auth works
1. Create a Supabase project; put URL + publishable key in `assets/js/supabase-config.js`.
2. Run `supabase/setup.sql` in the SQL Editor.
3. Auth settings: keep Confirm email ON, min password length 8, Site URL + Redirect URLs (`login.html`, `reset-password.html`).
4. Serve over http(s) (e.g. `python3 -m http.server 8000`), not `file://`. Full steps: `docs/SUPABASE_SETUP.md`.

## Tests actually performed (headless Chromium via Playwright, local static server)
- **Layout:** login, register, reset pages at 320, 360, 375, 390, 430, 768, 1024, 1440, 1920 px: no horizontal overflow, no off-screen elements, no page errors. Screenshots eyeballed: login 1440, register 375.
- **Form logic against a stand-in Supabase client (not the real service):** required/format validation, password mismatch and length, wrong-credential / unverified / network / weak-password / DB-error messages, double-submit lock, Remember Me flag, show/hide password, forgot-password request + generic message, `#forgot` view, `#signup` redirect, `next` sanitising, exact field labels and option lists, no Team Name field, signUp payload (trimmed name, UID kept as text with leading zeros), verification panel, existing-email obfuscation path, no HTML injection from input, reset page invalid-link and recovery paths.
- **Without configuration:** placeholder config shows a clear error and never a success; SDK-load failure message.
- Keyboard: one Tab-reached control showed a 2px outline.

## Not tested (pending)
Real Supabase sign-up/sign-in/reset/email delivery; the SQL script on a real database (RLS behaviour, trigger); Safari/Firefox/real phones/screen readers; on-screen keyboard behaviour; `window.supabase` CDN load from a real network; sign-out button and Supabase client storage options (code present, not asserted); real-browser focus order across every control.

## Known issues / notes
- The reference ZIP (`create-glassmorphism-login-form-html-css.zip`) was **not provided**; the design was built from the existing site's glass tokens instead.
- With the CDN script blocked/offline the pages show a "could not be loaded" message.
- Pin the Supabase CDN version (and optionally add SRI) for production.

# Supabase setup (PHANTOM WARRIOR) — email/password auth

Nothing here is configured for you. Until you finish these steps, the login/register pages show a clear "not set up" message and do not pretend to sign anyone in.
Reference: the official Supabase Auth docs (supabase.com/docs/guides/auth), including "Redirect URLs".

## 1. Create / select the Supabase project
1. Sign in at supabase.com -> **New project** (or open an existing one).
2. Wait until the project finishes provisioning.

## 2. Put the project URL and publishable key in the site
1. Dashboard -> **Project Settings -> API** (the page may be labelled "API Keys" / "Data API" in newer dashboards).
2. Copy the **Project URL** and the **publishable key** (`sb_publishable_...`). If your project only shows the older **anon** key, that works too.
3. Open `assets/js/supabase-config.js` and replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_PUBLISHABLE_KEY`.
4. **Never** paste a `service_role` / secret key into any website file.

## 3. Create the profile table (SQL)
Dashboard -> **SQL Editor -> New query**, paste all of `supabase/setup.sql`, **Run**. It creates `public.profiles`, turns Row Level Security on, adds own-row-only policies, and adds the trigger that saves the registration profile fields for each new user. Re-running it is safe.

## 4. Email / password settings
Dashboard -> **Authentication**:
- **Providers -> Email**: enabled. Keep **Confirm email** ON (recommended; the register page assumes verification is required and avoids revealing whether an address is already registered).
- Set **Minimum password length** to **8** (the form enforces 8–72 characters; the server setting should match).
- **URL Configuration**: set **Site URL** to your production address (or your local address while developing) and add the **Redirect URLs** listed in step 6.

## 5. Redirect URLs to allow (Authentication -> URL Configuration -> Redirect URLs)
The site returns users to `login.html` (email-confirmation links) and `reset-password.html` (password reset). Add, for each environment you use:
- Local: `http://localhost:8000/login.html`, `http://localhost:8000/reset-password.html` (use your real port)
- Production: `https://YOUR-DOMAIN/login.html`, `https://YOUR-DOMAIN/reset-password.html`
If the site lives in a sub-folder, include that folder in the path. (A wildcard such as `https://YOUR-DOMAIN/**` also works but is broader.)
If a redirect URL is not on the list, Supabase silently falls back to the Site URL.

## 6. Serve the site (do not use file://)
Emailed links do not work reliably from `file://`. No Node or npm needed — any static server:
- Python (usually pre-installed): in the `phantom-warrior` folder run `python3 -m http.server 8000` (Windows: `py -m http.server 8000`), then open `http://localhost:8000/login.html`.
- Or VS Code's "Live Server" extension, or upload the folder to any static host (GitHub Pages, Netlify, Cloudflare Pages, etc.).

## 7. Test checklist (do these yourself)
1. Register with a real email -> "Check your email" panel -> open the confirmation link -> you land on `login.html`.
2. Table Editor -> `profiles` has one row for that user with the right role/IGN/UID/source and **no** password.
3. Sign in with email + password; try a wrong password and an unverified email.
4. Forgot password -> email arrives -> link opens `reset-password.html` -> set a new password -> sign in with it.
5. With a second account, confirm in the SQL Editor/API that user A cannot read user B's profile row.

## Known behaviour to be aware of
- The Supabase JS client is loaded from the official jsDelivr CDN at `@supabase/supabase-js@2` (as in Supabase's docs). For production consider pinning an exact version.

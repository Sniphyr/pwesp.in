# Next Batch — not yet chosen

Status: the cinematic homepage (visual upgrade v2) and inner-page polish are implemented. Suggested next steps (pick one):
- Contact page: real form using the existing form styles (decide how submissions are delivered first).
- About page: real content (needs organisation copy from the owner; do not invent history).
- Authentication (Supabase) and gating of Maps / Plan My Maps / Teams.

Reminders:
- Change colours/theme through the `:root` variables in `assets/css/style.css`.
- Keep every page responsive from 320px up (mobile menu at 820px, mirrored in `navigation.js`).
- Respect `prefers-reduced-motion`; buttons/panels use `clip-path`, so draw focus rings inside the shape.
- Use only `assets/images/logo/pw-primary-logo.png`, never altered, kept square.
- No fake statistics, players, achievements or testimonials.
- Inner pages stay calmer than the homepage.
- Test in a real browser at 320, 375, 768, 1024 and 1440px, ideally with the real display font installed.
- Before finishing: check links/paths, update `PROJECT_STATUS.md`, ship the full project ZIP.

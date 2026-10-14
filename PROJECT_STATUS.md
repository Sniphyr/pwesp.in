# Project Status — PHANTOM WARRIOR (singular)

**Latest batch (Batch 1 — Login & Registration):** real Supabase auth UI added: `login.html` (login, forgot password), `register.html`, `reset-password.html`, `assets/css/auth.css`, `assets/js/{supabase-config,auth,auth-forms}.js`, `supabase/setup.sql`, `docs/SUPABASE_SETUP.md`, `HANDOFF.md`. Google sign-in was later removed (email/password only). Needs Supabase project configuration before it works; see HANDOFF.md. No route protection yet.

**Current batch:** Expanding glass sidebar navigation (desktop >=821px: fixed left sidebar, 84px collapsed / 256px expanded on hover, keyboard focus or pin; mobile keeps the top bar + dropdown). Nav-only: `components.css`, `responsive.css`, `navigation.js`, nav markup in all HTML files. Before that: Cinematic background + glass upgrade (shared `pw-background.png` on every page; old painted hero scene, vignette, light-pool washes and opaque bands removed; header, strip, page heads, section heads, about copy, identity rows, footer and mobile menu are now glass). Before that: Visible glass fix v3 (first screen) on top of translucent glassmorphism v2 (materials only, after glass gloss v1) on top of Batch 3 visual upgrade v2 — complete, on top of the earlier visual pass and Batch 2 (theme + responsive). The website as a whole is NOT finished.
**Next batch:** not yet chosen — see `docs/NEXT_BATCH.md` for suggestions.

## Rules (mandatory)
HTML5, CSS3, vanilla JS only. No React, TypeScript, Node, npm, frameworks, or build tools. Must work by opening `index.html`.

## Brand
Near-black #050608, charcoal #111318, silver #D5D8DE, crimson #FF1738, electric blue #3BAEFF (sparingly). Tagline: ZERO MERCY. PURE DOMINATION. Tokens live in `:root` of `assets/css/style.css`.

## Done
- 1A foundation; 1B homepage; Batch 2 homepage cleanup (Teams/Maps/Plan My Maps removed from nav, Team Preview and statistics removed)
- Final cleanup & logo consistency, see below
- Final wording fix: Maps Explorer card text changed from "Explore seven Free Fire maps." to "Explore maps and learn the terrain." No other homepage wording needed changing (remaining words like "game", "battle", "compete" are generic brand copy tied to the tagline). Nothing else was touched.

## Batch 3 correction — visual upgrade v2 (latest)
The first Batch 3 pass was too subtle (centred logo + mild glows on the old layout). This pass changes composition and layout, not just effects.

### What changed (before -> after)
- **Hero:** was a centred stack with a small glow. Now a full-bleed split composition: huge two-line chrome title (polished-metal horizon gradient) and crimson tagline on the left, the original PW logo large on the right in a concentrated crimson spotlight with a floor reflection. Behind it: light beams, four layers of smoke, three depth layers of rocks (crimson-lit far range, charcoal mid, black front), embers, a strong vignette and top shadow. On screens under 900px it stacks with the logo first, centred.
- **Divider strip (new, decorative):** "PLAY ◆ FIGHT ◆ WIN" band between hero and About. It reuses the existing tagline words only and is hidden from screen readers (`aria-hidden`).
- **About:** asymmetric layout with a larger lead paragraph and a tall framed "monolith" panel (red light, corner marks) instead of a small centred box.
- **Features:** larger glass cards with a framed icon and big outlined numerals 01/02 (decorative CSS counters).
- **How we compete:** was three small columns. Now poster-style rows: number, huge chrome word (PLAY / IMPROVE / GROW), short line; red-lit horizon and rock silhouette at the bottom. Rows stack under 1100px so no word gets split.
- **Typography:** `PW Display` @font-face uses an installed heavy condensed font (Impact etc.) via `local()` with no downloads; other devices get a real bold sans fallback. Bigger, tighter headings, chrome gradient, wider-tracked uppercase labels.
- **Buttons:** primary = crimson cut-corner with metallic top edge, chevron and light sweep on hover; secondary = obsidian + chrome outline with crimson corner marks. Focus rings visible on both.
- **Inner pages (About, Contact, Login, Maps, Plan Maps, Teams):** refined header (breadcrumb Home / Page, large chrome title, crimson rule, subtle diagonal texture and a faint red corner light), notice cards in dark glass with a crimson label; Login shows its two notices side by side. Still calmer than the homepage.
- **Footer:** larger logo, display-font tagline, tracked uppercase links.
- No fake stats, players, achievements or history. Page copy unchanged. Logo file byte-identical to the original upload; `pw-emblem.svg` unreferenced.

### Files modified
`assets/css/style.css`, `assets/css/components.css` (rewritten), `assets/css/responsive.css` (rewritten), `index.html` (hero layers/title spans, strip, identity rocks), `about.html`, `contact.html`, `login.html`, `maps.html`, `plan-maps.html`, `teams.html` (breadcrumb + notice grid), `PROJECT_STATUS.md`. Unchanged: all JS, assets.

### Tests actually performed (real Chromium via Playwright, file://)
- All 7 pages at 320, 360, 375, 414, 600, 768, 900, 1024, 1440, 1920 px: no horizontal overflow, no off-screen elements, no page errors or failed requests.
- Hero, pillar, strip and h2 text checked at 14 widths (320 to 2560 px) for mid-word breaks or clipping: none after fixes. (This caught and fixed two real bugs: the hero title splitting mid-word at 1920px and "IMPROVE" splitting between roughly 700 and 1280px.)
- Logo: only `pw-primary-logo.png` is displayed, loads, renders square; file compared byte-for-byte with the upload.
- Mobile menu at 320/375/768/820/821/1024 px: open/close, `aria-expanded`, Escape + focus return, outside click, navigation, active link, close on resize.
- Keyboard: Tab reaches About Us / Contact Us with a visible 2px outline. Emulated reduced motion: all animations off, no sparks, hero content fully visible.
- Local link/path check by script: none broken.
- Screenshots reviewed by eye: homepage 1440 (full page), 1920, 768, 375 (full page); About and Login at 1440. Before/after comparison was made against the previous Batch 3 screenshots of the same pages.

### Known limits
- **Fonts:** the test machine has no Impact, so every screenshot used the wide bold fallback, which is the worst case for wrapping. On Windows/macOS with Impact the headings will look narrower and more condensed than seen in testing; re-check on a real device.
- **Browsers/devices:** Chromium only. Safari, Firefox, real phones, screen readers and browser zoom not tested. `backdrop-filter` and `mask-image` degrade gracefully but were not seen without support.
- **Performance:** hero uses several blurred layers; not profiled on low-end phones. If it feels heavy, remove `.smoke.s3`/`.s4` first.
- **Imagery:** rocks and smoke are CSS only; no photographic textures exist in the project.
- Header/footer markup is still duplicated across 7 pages.
- Protected pages (`maps.html`, `plan-maps.html`, `teams.html`) are still unlinked and not access-protected; no authentication exists.
- Inner pages still say "Free Fire" in subtitles/meta (content left as-is).

## Visual art direction batch (previous pass, superseded by the section above)

### What changed
- **Materials/tokens** (`style.css`): dark glass (`--glass`), metallic edges (`--edge`, `--edge-hi`, `--grad-edge`), vignette, subtle noise texture (`--tex`, an inline SVG data URI, no extra files), soft chrome heading gradient. Rings now use a faint metallic top highlight.
- **Homepage hero** rebuilt in CSS as a brand reveal: original PW logo large and centred, lit by one controlled red light behind it (the logo file is untouched), noise + rocky silhouettes + smoke + vignette, chrome heading, crimson tagline, fade into the next section. The title is on one line from 900px and two lines below. Added a primary CTA (About Us → `about.html`) and a secondary CTA (Contact Us → `contact.html`). These two buttons and the `body.home` class are the only HTML additions on the homepage.
- **Motion:** gentle logo/copy entrance, slow float, smoke drift, a few sparks. All switched off under `prefers-reduced-motion`; content stays fully visible.
- **Homepage sections:** metallic separators between sections, glass panels (blur, thin metallic border, crimson edge on hover), calmer About visual, gradient pillar rules, textured red-lit identity section.
- **Inner pages:** calm and clean. No atmosphere layers, thin metallic divider, short crimson rule under the title, placeholder notices as restrained glass blocks (max 760px wide).
- **Buttons:** primary = crimson cut-corner; secondary = square outlined silver, with no clip-path so its border is never cut.
- Header/footer gain a metallic edge line; footer fades to obsidian.
- Unchanged: page content/wording, nav, JavaScript, routes, all 7 pages, the single logo, no new fake content.

### Files modified
`assets/css/style.css`, `assets/css/components.css`, `assets/css/responsive.css`, `index.html`, `PROJECT_STATUS.md`, `docs/NEXT_BATCH.md`.

### Tests actually performed (real Chromium via Playwright, `file://`)
- All 7 pages at 320, 360, 375, 414, 600, 768, 900, 1024, 1440, 1920px: no horizontal overflow, no element past the viewport, no page errors or failed requests.
- All images load, use only `pw-primary-logo.png`, and render square; `pw-emblem.svg` is not referenced.
- Mobile menu (320/375/768/820/821/1024px): open/close, `aria-expanded`, Escape + focus return, outside click, link navigation, close on resize.
- Emulated reduced motion: no animations or sparks; hero copy and logo at opacity 1.
- Screenshots viewed: homepage at 1440px and 320px, login at 1440px. Captured but not viewed: homepage 768px and contact 375px.
- Local link/path check by script: none broken.

### Known limits
- `Impact` is not installed in the test browser, so typography was seen only with the fallback font. Real Impact is narrower and heavier; the hero title and wrapping should be re-checked on a machine that has it.
- Chromium only. Safari/Firefox, real phones, screen readers and browser zoom not tested. `backdrop-filter` on glass panels degrades to the translucent colour where unsupported.
- "Rocky texture" is CSS silhouettes plus noise; there are no photographic textures in the project.
- Visual judgement came from a few screenshots; a human review on real devices is advised.
- Header/footer markup is still duplicated across 7 pages.
- Protected pages (`maps.html`, `plan-maps.html`, `teams.html`) are still unlinked and not access-protected; no authentication exists.
- Inner pages still say "Free Fire" in subtitles/meta (content left as-is).

## Batch 2: Theme foundation + responsive design (previous batch)

### What changed
- **Design tokens** (`style.css` `:root`): backgrounds, text, accents (with `--red-rgb`/`--blue-rgb` triplets so `rgba(var(--red-rgb),.2)` follows theme changes), gradients, fluid type scale, spacing scale, fluid gutter/section padding, radii, cut-corner size, shadows, transitions, z-index. Old variable names kept as-is. Components use tokens instead of raw colours.
- **Theme consistency:** nav + active link, headings, primary/ghost buttons, panels, page heads, placeholders, footer, and new shared form styles (`input`, `select`, `textarea`, `.field`, visible focus, 16px text, 44px min height). No forms exist yet; styles are ready for later batches.
- **Glow reduced** (hero emblem, sparks, button hover, panel hover) to match the restrained brief. Dead outer glows that `clip-path` was already hiding were removed.
- **Logo:** only `assets/images/logo/pw-primary-logo.png` is displayed (header, footer, hero, About panel). Square 1:1 everywhere. `width`/`height` attributes added to the About panel logo. `pw-emblem.svg` is kept but unreferenced.
- **Mobile menu:** now collapses at 820px (was 1060px, which put laptops at 1024px into a hamburger). Closes on Escape (focus returns to the button), outside click, link click and resize past breakpoint. `aria-expanded` and `aria-controls` kept in sync. Without JavaScript the nav stays visible and wraps.
- **Accessibility fixes:** `clip-path` clipped focus outlines on buttons, so buttons now draw the focus ring inside the shape. Button gradient darkened so white text is at least 5:1 (was 3.87:1 at the top). Touch targets (nav links, toggle, buttons, footer links) are at least 44px high. `scroll-padding-top` added so `#signup` is not hidden under the sticky header.
- Removed six inline `font-size` styles on inner-page `<h1>`s; they now use `--fs-h1-page` via `.page-head h1`.

### Files modified
`assets/css/style.css`, `assets/css/components.css`, `assets/css/responsive.css`, `assets/js/navigation.js`, `index.html` (logo size attributes), `about.html`, `contact.html`, `login.html`, `maps.html`, `plan-maps.html`, `teams.html` (inline h1 style removed), `PROJECT_STATUS.md`, `docs/NEXT_BATCH.md`.
Not modified: `main.js`, `config.js`, page content/wording, assets.

### Responsive improvements
Breakpoints: 1060 (5-col grid), 820 (mobile menu), 860 (hero/split stack, 4/5-col grids to 2), 640 (2/3-col grids to 1, footer stacks), 480, 374 (small mobile), plus short-landscape hero. Fluid gutters, section padding, panel padding and headings (`clamp`). Hero uses `100svh` with a `vh` fallback. `min-width:0` on grid/flex children prevents overflow. Container widens to 1280px at 1440px and above.

### Tests actually performed
Real Chromium (Playwright) against `file://` pages:
- All 7 pages at 320, 360, 375, 414, 600, 768, 900, 1024, 1440 and 1920px: no horizontal scroll (`scrollWidth == clientWidth`) and no element extending past the viewport (the off-screen skip link was excluded on purpose). No page errors or failed requests.
- Every `<img>` loaded, uses the PNG path and renders square.
- Menu at 320, 375, 768, 820, 821 and 1024px: toggle visibility, open, `aria-expanded`, Escape, focus return, outside click, link navigation, active-link `aria-current`, close on resize. All behaved correctly.
- Reduced motion (emulated): animations none, no sparks created, reveal content visible. Keyboard Tab shows a 2px outline on the focused toggle.
- Computed contrast ratios for the main colour pairs (all >= 4.8:1 after the button fix).
- Screenshots viewed at 320 (closed and open menu) and 1440 on the homepage. Screenshots of 375, 768 and login were captured but not viewed.
Static: local `href`/`src` paths and `#` anchors checked by script (none broken); CSS searched for fixed pixel widths (none found).

### Known limits
- `Impact` is not installed in the test browser, so headings were checked with the fallback font. Real Impact is narrower; wrapping should be equal or better but was not seen.
- Only Chromium was tested. Safari/Firefox and real devices were not.
- Not tested: forms (none exist), screen readers, 200% browser zoom.
- Visual polish was judged from a few screenshots only; the full cinematic look is the next batch.
- Header/footer markup is still duplicated across 7 pages.
- Protected pages are still not protected (no auth exists). `teams.html`, `maps.html`, `plan-maps.html` remain unlinked.
- Inner pages still say "Free Fire" in subtitles/meta (content left as-is).

## Final cleanup changes (previous batch) (made in the previous batch)
- **Sign Up restored.** Public nav and footer on all 7 pages: Home, About, Contact, Login, Sign Up. Login and Sign Up now use the same plain link style (the red `nav-cta` style is no longer used on any page; the CSS rule is kept).
- **No separate Sign Up page exists** in the project. Sign Up links to the existing entry point `login.html#signup`, a placeholder block already on the Login page. No authentication, sessions or password storage were added.
- **One logo only:** `assets/images/logo/pw-primary-logo.png` (verified: valid PNG, 500x500, RGBA, shows the red/silver PW mark). All displayed logos on all pages (header, footer, homepage hero, homepage About panel) use it. `pw-emblem.svg` is no longer referenced anywhere; the file is kept in `assets/images/logo/` unused.
- **Proportions fixed:** the logo is square, but it had been displayed at 30x36, 44x53 and 200x240 (distorted). Now 36x36 (header), 48x48 (footer), 200x200 (hero), with `height:auto`/`object-fit:contain` in CSS.
- **Homepage:** removed the "Team & Community" card (it promoted the deferred Teams area). Maps Explorer and Plan My Maps remain as non-clickable "Members · Upcoming" cards; the two remaining cards use a new `.grid-2` layout so they fill the row.
- **Login page:** removed one stray `</div>` that closed the container early (markup fix only; text unchanged).
- Already done in Batch 2 and kept: no "Free Fire Esports" on the homepage, no team-role cards, no statistics, Teams absent from nav and footer.
- NOT touched: `teams.html`, `maps.html`, `plan-maps.html`, JavaScript, colour theme, About/Contact/Login text.

## Tested in the previous batch
Static checks only (no browser). Browser tests for this batch are listed above.

## Known limits / open items
- **Protected pages are not actually protected.** `maps.html` and `plan-maps.html` (and `teams.html`) are reachable by typing the URL. No login exists, so they cannot be gated yet. They are not linked from any public page.
- Sign Up has no page of its own; it is a placeholder section on `login.html`.
- Inner pages still say "Free Fire" in their own subtitles/meta (e.g. About, Maps). Left to preserve page content. The homepage no longer mentions Free Fire anywhere.
- `pw-emblem.svg` is unused but still in the folder.
- Display font is the system `Impact` stack.

## Conventions
- Header/footer markup is duplicated in all 7 pages; update all when changing nav
- Logo: always `assets/images/logo/pw-primary-logo.png`, square (1:1); never set a non-square width/height
- Footer social links: set URLs in `assets/js/config.js`


## Glass gloss finish polish v1 (latest)
Materials-only pass. No layout, copy, branding, routes, JS or HTML changes. Only `assets/css/style.css`, `components.css`, `responsive.css` were edited; the logo file is byte-identical and `pw-emblem.svg` is still unreferenced.
- **Tokens (style.css):** `--glass`/`--glass-bar` now default to a dense fallback and are thinned to real smoked glass inside an `@supports (backdrop-filter)` block. New `--blur` (14px, 8px under 820px), `--gloss-*` reflection layers (full for homepage, `-soft` for inner pages) and `--rim-glass*` polished-edge shadows.
- **Header/nav:** translucent blurred bar with top sheen and silver edge; link hover sheen; crimson-glass `Sign Up` action; glass menu toggle; mobile menu sheet stays near-opaque (nested blur does not work inside the header).
- **Buttons:** primary = subtle gloss over crimson with metallic inset edge; secondary = smoked glass with chrome edge. Gradient base darkened slightly to keep white text above 4.5:1.
- **Panels:** homepage feature cards = visible transparency, top highlight, diagonal reflection, crimson corner glow, polished rim. Inner-page notice cards (`.placeholder`, plus `.form-panel` for future forms) use the softer variants.
- **Light behind glass:** `#features::after` and `.section-inner::before` add soft crimson pools and thin light rods so transparency is visible. Decorative, static, `pointer-events:none`.
- **Forms:** translucent fields, clearer borders, blue focus ring kept plus a soft glow.
- Reduced-motion and focus styles untouched; all additions are static (no new animation).


## Glassmorphism v2 — true translucency (latest)
CSS only (`style.css`, `components.css`); no HTML/JS/layout/asset changes. Logo byte-identical, `pw-emblem.svg` unreferenced.
- **Surfaces now genuinely see-through:** with `backdrop-filter` support, `--glass` = rgba(18,18,22,.35), `--glass-soft` (inner pages) .42, `--glass-bar` (header) .42, blur 16px (10px under 820px), saturate 125%. Without support the same tokens stay at ~.93 opacity (dense, readable fallback).
- **Light behind the glass was strengthened** (this is what makes transparency visible): crimson pools, chrome/crimson light rods and noise texture behind `#features`, `.section-inner` (all inner pages) and `#about`.
- **Edges:** `clip-path` cuts the corners, so CSS `border` and outer `box-shadow` would be clipped. The 1px silver edge is an inset ring and the two cut corners get a drawn diagonal edge (`--cut-edge`).
- Panel body text lightened to #b6bbc5 for readability on the thinner glass. Form inputs got a light 8px blur and translucent fill.
- Reduced-motion/focus untouched; nothing new animates.


## Glassmorphism v3 — visible on the first screen (latest)
Why v2 looked flat on load: the hero text had no surface, nothing sat behind the header at scroll 0, and the feature cards are below the fold. Fixes (CSS only; no HTML/JS changes):
- **Hero content = smoked-glass panel:** `.hero-copy` now has `--glass-hero` (rgba(14,14,18,.3) with backdrop-filter, .86 fallback), 16px blur, silver edge, top highlight, diagonal reflection. Extra crimson light and a chrome rod were added to `.hero-bg` (desktop and the <900px override) so the animated smoke/rocks show through it.
- **Header sits over the hero** on the homepage (`html.js .hero{margin-top:-nav-h;padding-top:nav-h}`), so the glass header has real lighting behind it. Content position is unchanged. Hero top shadow lightened (.55 -> .3).
- Verified computed styles in Chromium: `--glass` .35, `--glass-hero` .3, `--glass-bar` .42, `--blur` 16px, `backdrop-filter` applied on header, hero panel, ghost button and feature cards.
- `file://` makes no difference to `@supports`/`backdrop-filter`.

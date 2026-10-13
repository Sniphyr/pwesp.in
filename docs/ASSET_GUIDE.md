# Asset Guide
- **Logo:** `assets/images/logo/pw-primary-logo.png` (500x500, transparent PNG) is the only logo displayed. Keep it square; never stretch it. `pw-emblem.svg` is an unused leftover placeholder and must not be displayed.
- **Site background:** `assets/images/backgrounds/pw-background.png` (1672x941, used exactly as supplied) is the shared background for every page, set once on `body::before` in `style.css` (fixed, `cover`, centred, no overlay/filter/opacity). Never add a tint, gradient or opaque background above it; glass panels use `--glass*` tokens with `backdrop-filter`.
- `assets/images/maps/` — Free Fire map images (for the Maps batch)
- `assets/icons/` — small SVG icons

Naming: lowercase, hyphens, no spaces.

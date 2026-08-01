# UREYZ — Discover the Rest. (PWA)

A fully installable Progressive Web App built from the UREYZ brand kit and investment prospectus concept boards. Community-powered interactive social discovery entertainment — dating, live entertainment, and nightlife, gamified.

## What's inside

- `index.html` — the full one-page app (hero, ecosystem, three-act experience, Dream Chests, membership tiers, journey, gallery, final CTA)
- `style.css` — design system (brand colors, Montserrat + Orbitron type, animations)
- `app.js` — interactivity: 11 tappable Dream Chests, Discovery Wheel spinner, scroll reveals, PWA install prompt, bottom app tab bar
- `manifest.json` + `sw.js` — makes it installable and available offline
- `icons/` — full PWA icon set generated from the UREYZ shield mark (72–512px + maskable)
- `assets/` — optimized photography from the brand deck

## Run it locally

Any static file server works — the app has no build step and no backend.

```bash
cd ureyz-pwa
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy it

Upload the whole `ureyz-pwa` folder as-is to any static host: Netlify, Vercel, GitHub Pages, Cloudflare Pages, or your own server. It must be served over **HTTPS** (or localhost) for install and offline support to work — that's a browser requirement for all PWAs, not specific to this app.

## Install as an app

Once hosted on HTTPS:
- **Android/Chrome/Edge/desktop:** an "Install App" button appears automatically (top nav, hero, and footer). Tapping it triggers the native install prompt.
- **iOS Safari:** Safari doesn't support the automatic prompt — use Share → "Add to Home Screen." The app already ships the right icons and meta tags for this.

## Customize

- **Brand colors / fonts:** all defined as CSS custom properties at the top of `style.css` under `:root`.
- **Dream Chest categories:** edit the `CHESTS` array in `app.js`.
- **Discovery Wheel outcomes:** edit the `WHEEL_OUTCOMES` array in `app.js`.
- **Copy:** all section text lives directly in `index.html`.
- **Real waitlist/signup:** the Install buttons currently trigger the PWA install prompt. Wire `#join` up to your actual signup form or CRM when ready.

# Printkite India — static website

HTML + Tailwind CSS (CDN) + vanilla JavaScript. No build step — open `index.html` or deploy the folder as-is.

## Structure

```
printkite/
├── index.html          Home (header, hero, about, why us, services preview, portfolio preview, clients, franchise, CTA, footer)
├── services.html       Services accordion + Enquiry section (#enquiry)
├── portfolio.html      Filterable portfolio grid
├── netlify.toml        Netlify config (publish = root, cache headers)
├── robots.txt / sitemap.xml
└── assets/
    ├── css/style.css   Brand tokens, header/footer, accordion, popup, buttons
    ├── js/data.js      ALL SITE CONTENT — services, why-us, franchise, clients, portfolio
    ├── js/hero.js      Home hero motion (GSAP entrance, ambient drift, parallax, tilt)
    ├── js/main.js      Header, drawer, accordion, enquiry scroll + prefill, form, renderers
    ├── js/popup.js     Promo popup logic (delay / scroll trigger, localStorage)
    └── images/
        ├── brand/      logo, icon, skyline, hero banner tiles (banner-1..4.jpg)
        ├── clients/    client logos for the home page carousel
        ├── services/   one image per service category
        └── portfolio/  logos, business-cards, id-cards, branding
```

## Things to configure before going live

1. **Formspree** — in `services.html`, replace `YOUR_FORM_ID` in
   `action="https://formspree.io/f/YOUR_FORM_ID"` with the form ID created for
   `printkiteindia@gmail.com` at https://formspree.io. Until then the form shows a
   "not configured" notice instead of silently failing.
2. **Social links** — the Instagram and Facebook URLs in the header and footer are placeholders
   (`https://www.instagram.com/`, `https://www.facebook.com/`). The header/footer WhatsApp icons
   point to +91 9655 66 5713; the floating button and the popup's "Claim the offer" button point
   to +91 97895 85713 (`wa.me/919789585713`).
3. **Banner artwork** — the four hero tiles load `assets/images/brand/banner-1.jpg` …
   `banner-4.jpg`. Until those files exist each tile falls back to the image named in its
   `data-fallback` attribute, so the hero always renders. Every tile has a fixed 4:3 footprint
   (1:1 under 480px) and is cropped with `object-fit: cover`, so replacements of any native size
   keep the same layout.
4. **Domain** — canonical/OG URLs and `sitemap.xml` use `https://www.printkite.com`.

## Editing content

Almost everything lives in `assets/js/data.js`:

- `PK_SERVICES` — service categories, their items (exactly as in the brochure), image and blurb.
  Each category's `id` is also its deep link, e.g. `services.html#printing`.
- `PK_WHY`, `PK_FRANCHISE`, `PK_CLIENTS` — home page lists.
- `PK_CLIENTS` feeds the looping client logo carousel. An entry is either a plain name or
  `{ name, logo }` — the `pkClient(name, file)` helper builds the latter. A logo that is missing
  or fails to load falls back to the client's name, so entries can be added one at a time.
  The 42 logos in `assets/images/clients/` were extracted from the "Our Happy Clients" page of
  the brochure (Onelink Freight came from the portfolio pages); a few are only as sharp as the
  brochure had them, so drop a higher-resolution file at the same path to improve one.
- `PK_PORTFOLIO` / `PK_PORTFOLIO_CATEGORIES` — portfolio grid. To add a mockup, drop the image in
  `assets/images/portfolio/<category>/` and add one line to `PK_PORTFOLIO`.

Static copy (About, Vision, Mission, franchise paragraph, contact details) sits in `index.html`.

## Behaviour notes

- Clicking any **service item** inside an accordion pre-fills the enquiry form (service + message)
  and smooth-scrolls to `#enquiry`.
- The **promo popup** slides in from the bottom-right after 7 s or at 25 % scroll, whichever comes
  first, and is suppressed for 24 h after it is closed (`localStorage` key `pk_promo_seen_at`).
  Timings are in `PK_POPUP_CONFIG` at the top of `assets/js/popup.js`. Its "Claim the offer"
  button opens WhatsApp with a pre-filled message; it sits above the floating WhatsApp button
  rather than over it.
- A **floating WhatsApp button** (`.pk-whatsapp`) is fixed bottom-right on all three pages.
- The **"What we do"** cards and each services-page accordion panel use the same carousel:
  autoplay every 4 s, arrows, dots, swipe, and arrow-key support. It pauses on hover/focus, while
  the tab is hidden, and for visitors who prefer reduced motion — where the arrows stay visible on
  touch devices, which never fire hover.
- The **client carousel** is a CSS marquee: the list is rendered twice (the second copy is
  `aria-hidden`) and the track scrolls exactly 50 %, so the loop is seamless. It pauses on hover
  and collapses to a static wrapped row under `prefers-reduced-motion`. The logos are **not**
  lazy-loaded — the whole strip is always on its way on-screen — and a card with a logo starts
  with its name hidden so the strip never flashes text before the images arrive.
- The **home hero** is animated by `assets/js/hero.js` (GSAP 3 + ScrollTrigger, both from cdnjs):
  a one-shot entrance timeline of 1.35 s, then an ambient float on the media card and independent
  randomised drift on the decorative bubbles, scroll parallax that separates the two, and a
  pointer tilt on desktop pointers only. AOS is deliberately **not** used inside `#hero` so the
  two libraries never animate the same nodes; it still runs everywhere else on the page.
  - Elements are hooked via `data-hero="…"` attributes, and the media card is wrapped three deep
    so each transform has exactly one owner (scroll `y`, ambient `y`, pointer `x/y`) — adding a
    second tween to any one of those wrappers will fight the existing one.
  - An inline script in `<head>` adds `.pk-hero-pending`, which hides the animated elements with
    `opacity` only (no layout shift) until `hero.js` runs. It clears itself after 2.5 s, so a JS
    error or a blocked CDN can never leave the hero invisible.
  - `prefers-reduced-motion: reduce` skips all of it: no guard class, no tweens, no bubbles.
- Header collapses its top utility bar once the page is scrolled.

## Deploy

**Netlify** — drag the folder into the Netlify dashboard, or connect the repo (no build command,
publish directory `.`).
**Vercel** — `vercel deploy` from this folder; framework preset "Other", output directory `.`.

## Optional: production Tailwind

Tailwind runs from the Play CDN, which is fine for a static marketing site but compiles in the
browser. For a leaner build, install Tailwind CLI, point it at the HTML files and swap the CDN
`<script>` for the generated stylesheet.

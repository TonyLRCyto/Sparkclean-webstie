# Sparkclean Cleaning Services

Astro website prepared for deployment to Cloudflare Workers Static Assets.

## Completed pages

- `/` — homepage
- `/recurring-cleaning-concord-ca/` — recurring house cleaning service page
- `/deep-cleaning-concord-ca/` — deep cleaning service page
- `/move-in-move-out-cleaning-concord-ca/` — move-in and move-out service page
- `/post-construction-cleaning-concord-ca/` — post-construction and remodel cleaning page
- `/about/` — About Sparkclean page
- `/contact/` — quote-request and contact page
- `/service-areas/` — service-area overview
- `/service-areas/pleasant-hill-ca/` — Pleasant Hill location page
- `/service-areas/martinez-ca/` — Martinez location page
- `/404.html` — not-found page

## Local development

```bash
npm install
npm run dev
```

Open the local URL shown by Astro.

## Production build

```bash
npm run build
npm run preview
```

## Cloudflare deployment

```bash
npm run deploy
```

Wrangler will ask you to sign in to Cloudflare the first time.

## Before launch

- Add the confirmed production domain to `astro.config.mjs` as the `site` value.
- Update `public/robots.txt` with the production sitemap URL.
- Replace all gradient photo placeholders with optimized Sparkclean images.
- Add the remaining priority service-area, Privacy, and Thank You pages.
- Optionally connect the quote form to a Cloudflare Worker and email delivery service. The current form opens a prefilled email in the visitor's email application.
- Confirm service inclusions, service areas, phone number, email, and business hours with the owner.
- Run Lighthouse and structured-data validation on the production URL.

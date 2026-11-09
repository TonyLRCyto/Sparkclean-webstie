import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set this build variable to the confirmed custom domain before launch.
// Leaving it unset keeps review builds free of guessed canonical URLs.
const productionSite = process.env.PUBLIC_SITE_URL?.trim() || undefined;

export default defineConfig({
  site: productionSite,
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !/\/404(?:\.html)?\/?$/.test(new URL(page).pathname),
    }),
  ],
});

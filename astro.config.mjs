// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages (project site): https://gillicorp.github.io/eu-yes-or-no/
  site: 'https://gillicorp.github.io',
  base: '/eu-yes-or-no',
  // Icelandic is the primary audience → served at the site root (no /is/ prefix).
  // English lives under /en/.
  i18n: {
    locales: ['is', 'en'],
    defaultLocale: 'is',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

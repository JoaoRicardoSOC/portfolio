import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// URL absoluta do site (og:image, og:url, canonical, hreflang).
// Defina SITE_URL quando o domínio existir; na Vercel, sem SITE_URL, usa o domínio de produção do projeto.
const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:4173')
).replace(/\/$/, '');

export default defineConfig({
  plugins: [
    {
      name: 'site-url',
      transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
      // robots.txt e sitemap.xml gerados no build, com a mesma SITE_URL.
      generateBundle() {
        const pages = ['/', '/merlin.html', '/merlin-en.html'];
        this.emitFile({
          type: 'asset',
          fileName: 'robots.txt',
          source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
        });
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source:
            '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
            pages.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n') +
            '\n</urlset>\n',
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        merlin: resolve(import.meta.dirname, 'merlin.html'),
        'merlin-en': resolve(import.meta.dirname, 'merlin-en.html'),
      },
    },
  },
});

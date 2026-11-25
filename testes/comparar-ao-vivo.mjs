// Compara o site novo com o protótipo de referência, os dois renderizados na mesma máquina.
// Elimina a diferença de antisserrilhado entre sistemas operacionais (as capturas oficiais são de Linux).
// Uso:
//   node <servidor estático> referencia 4180   (ou qualquer servidor apontando para referencia/)
//   npx vite preview --port 4173
//   REF_URL=http://localhost:4180 BASE_URL=http://localhost:4173 node testes/comparar-ao-vivo.mjs
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:4173';
const REF = process.env.REF_URL || 'http://localhost:4180';
const LIMITE = Number(process.env.LIMITE || 0.5);
const ROTAS = {
  home: { novo: { pt: '/', en: '/' }, ref: { pt: '/index.html', en: '/index.html' } },
  merlin: { novo: { pt: '/merlin.html', en: '/merlin-en.html' }, ref: { pt: '/merlin.html', en: '/merlin-en.html' } },
};
const TAMANHOS = [[360, 740], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]];
const OUT = path.resolve('testes/resultado-ao-vivo');
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
async function shot(url, w, h, lang) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  await ctx.addInitScript(l => { try { localStorage.setItem('lang', l); } catch (e) {} }, lang);
  const page = await ctx.newPage();
  await page.goto(url);
  await page.waitForTimeout(1800);
  await page.evaluate(() => Promise.all([...document.images].map(i => { i.loading = 'eager'; i.decoding = 'sync'; return i.decode().catch(() => 0); })));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  const png = PNG.sync.read(await page.screenshot({ fullPage: true }));
  await ctx.close();
  return png;
}
let falhas = 0;
for (const [pagina, r] of Object.entries(ROTAS)) {
  for (const lang of ['pt', 'en']) {
    for (const [w, h] of TAMANHOS) {
      const nome = `${pagina}-${lang}-${w}x${h}`;
      const ref = await shot(REF + r.ref[lang], w, h, lang);
      const atual = await shot(BASE + r.novo[lang], w, h, lang);
      const W = Math.max(ref.width, atual.width), H = Math.max(ref.height, atual.height);
      const pad = img => { const o = new PNG({ width: W, height: H }); o.data.fill(255); PNG.bitblt(img, o, 0, 0, img.width, img.height, 0, 0); return o; };
      const a = pad(ref), b = pad(atual), diff = new PNG({ width: W, height: H });
      const n = pixelmatch(a.data, b.data, diff.data, W, H, { threshold: 0.1 });
      const pct = 100 * n / (W * H);
      const alturaOk = ref.height === atual.height;
      const ok = pct <= LIMITE && alturaOk;
      if (!ok) { falhas++; fs.writeFileSync(path.join(OUT, nome + '-diff.png'), PNG.sync.write(diff)); }
      console.log(`${ok ? 'OK  ' : 'FALHA'} ${nome}  ${pct.toFixed(3)}% diferente${alturaOk ? '' : `  (altura ${atual.height}px, referência ${ref.height}px)`}`);
    }
  }
}
await browser.close();
console.log(falhas ? `\n${falhas} captura(s) fora do limite.` : '\nTudo idêntico à referência (mesma máquina).');
process.exit(falhas ? 1 : 0);

// Testes de comportamento da seção 7.2 do PEDIDO.md.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DESK = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };
const counter = async (page) => Number((await page.locator('#cnt').textContent()).trim().split(' ')[0]);
const front = (page) => page.locator('#ring button.on, #ring [aria-current="true"]').first();

// Coleta erros de JS e respostas 4xx/5xx de qualquer página do teste.
function watch(page) {
  const erros = [];
  page.on('pageerror', (e) => erros.push('JS: ' + e.message));
  page.on('response', (r) => { if (r.status() >= 400) erros.push(`${r.status()} ${r.url()}`); });
  return erros;
}
async function setLang(context, lang) {
  await context.addInitScript((l) => { try { if (!sessionStorage.getItem('__lang_set')) { localStorage.setItem('lang', l); sessionStorage.setItem('__lang_set', '1'); } } catch (e) {} }, lang);
}
async function scrollToId(page, id) {
  await page.evaluate((id) => document.getElementById(id).scrollIntoView(), id);
  await page.waitForTimeout(800);
}

test.describe('Desktop 1440×900', () => {
  test.use({ viewport: DESK });

  test('abertura some ~1,5s e o nome sobe', async ({ page }) => {
    const erros = watch(page);
    await page.goto('/');
    const yAntes = await page.locator('.name i').first().evaluate((el) => getComputedStyle(el).transform);
    await page.waitForTimeout(3200);
    const load = page.locator('#load');
    const sumiu = await load.evaluate((el) => !el.isConnected || el.hidden || getComputedStyle(el).opacity === '0' || getComputedStyle(el).display === 'none' || getComputedStyle(el).visibility === 'hidden');
    expect(sumiu).toBe(true);
    const yDepois = await page.locator('.name i').first().evaluate((el) => getComputedStyle(el).transform);
    expect(yDepois === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(yDepois)).toBe(true);
    expect(yAntes).not.toBe(yDepois);
    expect(erros).toEqual([]);
  });

  test('canvas da hero desenha a foto', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2500);
    const pixels = await page.evaluate(() => {
      const c = document.getElementById('pc'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n;
    });
    expect(pixels).toBeGreaterThan(1000);
  });

  test('os 5 links do menu levam às seções', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2200);
    const hrefs = await page.locator('nav .links a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs).toHaveLength(5);
    for (const h of hrefs) {
      await page.locator(`nav .links a[href="${h}"]`).click();
      await page.waitForTimeout(2200);
      const top = await page.evaluate((id) => document.querySelector(id).getBoundingClientRect().top, h);
      expect(Math.abs(top), `${h} topo ${top}`).toBeLessThan(120);
    }
  });

  test('roda do mouse em Projetos avança 1, 2, 3, 4 e a ficha acompanha', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2200);
    await page.locator('nav .links a[href="#projetos"]').click();
    await page.waitForTimeout(2200);
    await page.mouse.move(700, 450);
    const vistos = [await counter(page)];
    const fichas = { [vistos[0]]: await page.locator('#pinfo').innerText() };
    for (let k = 0; k < 14 && vistos.at(-1) < 4; k++) {
      await page.mouse.wheel(0, 260);
      await page.waitForTimeout(700);
      const c = await counter(page);
      if (c !== vistos.at(-1)) { vistos.push(c); await page.waitForTimeout(500); fichas[c] = await page.locator('#pinfo').innerText(); }
    }
    expect(vistos.slice(0, 4)).toEqual([1, 2, 3, 4]);
    // A ficha muda a cada projeto e mostra o da frente (o 4º é o Aurum).
    expect(new Set(Object.values(fichas)).size).toBe(Object.keys(fichas).length);
    expect(fichas[4]).toContain('criptomoedas');
  });

  test('setas ↑ ↓ mudam o projeto e clicar num nome traz pra frente', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2200);
    await scrollToId(page, 'projetos');
    const c0 = await counter(page);
    await page.locator('#next').click(); await page.waitForTimeout(1500);
    expect(await counter(page)).toBe(c0 + 1);
    await page.locator('#prev').click(); await page.waitForTimeout(1500);
    expect(await counter(page)).toBe(c0);
    await page.locator('#ring button').nth(2).click(); await page.waitForTimeout(1800);
    expect(await counter(page)).toBe(3);
  });

  test('galeria ampliada: abrir, foco, Tab preso, ←, Esc, clicar fora, sem rolar', async ({ page }) => {
    const erros = watch(page);
    await page.goto('/');
    await page.waitForTimeout(2200);
    await scrollToId(page, 'projetos');
    const shots = page.locator('#pinfo .shots');
    await expect(shots).toContainText('4');
    await shots.click();
    await expect(page.locator('#lb')).toBeVisible();
    expect(await page.evaluate(() => document.activeElement.id)).toBe('lbx');
    for (let k = 0; k < 8; k++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement.closest('#lb'))).toBe(true);
    }
    // ← a partir do item 1 vai pro 13
    await page.locator('#lbx').focus();
    const pos1 = (await page.locator('#lbpos').textContent()).trim();
    expect(pos1.startsWith('1')).toBe(true);
    await page.keyboard.press('ArrowLeft');
    expect((await page.locator('#lbpos').textContent()).trim()).toMatch(/^13\s*\/\s*13$/);
    // não rola enquanto aberta
    const y0 = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 600); await page.waitForTimeout(600);
    expect(await page.evaluate(() => scrollY)).toBe(y0);
    // Esc fecha e devolve o foco
    await page.keyboard.press('Escape');
    await expect(page.locator('#lb')).toBeHidden();
    expect(await page.evaluate(() => document.activeElement.classList.contains('shots'))).toBe(true);
    // clicar fora fecha
    await shots.click();
    await expect(page.locator('#lb')).toBeVisible();
    await page.mouse.click(8, 450);
    await expect(page.locator('#lb')).toBeHidden();
    expect(erros).toEqual([]);
  });

  test('item 5 abre o vídeo, trocar remove; → da galeria avança o trilho', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2200);
    await scrollToId(page, 'galeria');
    const x0 = await page.locator('#grail').evaluate((el) => el.scrollLeft);
    await page.locator('#gnext').click(); await page.waitForTimeout(1200);
    expect(await page.locator('#grail').evaluate((el) => el.scrollLeft)).toBeGreaterThan(x0);
    await page.locator('#grail .gi[data-i="4"]').click();
    await expect(page.locator('#lbstage video')).toHaveAttribute('src', /meus-direitos-pitch\.mp4/);
    await expect(page.locator('#lbstage video')).toHaveAttribute('preload', 'none');
    await page.locator('#lbn').click();
    await expect(page.locator('#lbstage video')).toHaveCount(0);
  });

  test('cv.pdf e o vídeo respondem 200; CV tem download', async ({ page, request }) => {
    expect((await request.get('/cv.pdf')).status()).toBe(200);
    expect((await request.get('/meus-direitos-pitch.mp4')).status()).toBe(200);
    await page.goto('/');
    await expect(page.locator('a[href="cv.pdf"]')).toHaveAttribute('download', 'Curriculo_Joao_Ricardo_Coto.pdf');
  });

  test('EN troca a página e sobrevive ao recarregar', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2200);
    await page.locator('#lang').click();
    await page.waitForTimeout(600);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const texto = await page.locator('body').innerText();
    for (const pt of ['Projetos', 'Galeria', 'Meu papel', 'Ver telas', ' de 7']) expect(texto, pt).not.toContain(pt);
    await page.reload(); await page.waitForTimeout(2200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await scrollToId(page, 'projetos');
    await expect(page.locator('#pinfo a.cs')).toHaveAttribute('href', 'merlin-en.html');
  });

  for (const caso of ['abrindo em PT', 'abrindo em EN', 'trocando ida e volta']) {
    test(`manifesto acende palavra por palavra (${caso})`, async ({ page, context }) => {
      if (caso === 'abrindo em EN') await setLang(context, 'en');
      await page.goto('/');
      await page.waitForTimeout(2200);
      if (caso === 'trocando ida e volta') {
        await page.locator('#lang').click(); await page.waitForTimeout(500);
        await page.locator('#lang').click(); await page.waitForTimeout(500);
      }
      const ops = () => page.locator('#mtxt .w').evaluateAll((ws) => ws.map((w) => +getComputedStyle(w).opacity));
      const antes = await ops();
      expect(antes.length).toBeGreaterThan(10);
      expect(Math.max(...antes)).toBeLessThan(0.5);
      // rola até o meio da animação: as primeiras acesas, as últimas ainda apagadas
      await page.evaluate(() => { const m = document.getElementById('mtxt').closest('section'); scrollTo(0, m.offsetTop - innerHeight * 0.25); });
      await page.waitForTimeout(1500);
      const meio = await ops();
      expect(meio[0]).toBeGreaterThan(0.5);
      expect(meio.at(-1)).toBeLessThan(0.9);
      await page.evaluate(() => { const m = document.getElementById('mtxt').closest('section'); scrollTo(0, m.offsetTop + m.offsetHeight); });
      await page.waitForTimeout(1500);
      expect(Math.min(...(await ops()))).toBeGreaterThan(0.95);
    });
  }
});

test.describe('Estudo de caso', () => {
  test.use({ viewport: DESK });

  test('índice marca a seção, barras crescem, idioma e voltar', async ({ page }) => {
    const erros = watch(page);
    await page.goto('/merlin.html');
    await page.waitForTimeout(1200);
    const link = page.locator('#toc a').nth(3);
    await link.click(); await page.waitForTimeout(2200);
    await expect(link).toHaveClass(/\bon\b/);
    await expect(page.locator('#bars')).toHaveClass(/pre/);
    await page.evaluate(() => document.getElementById('bars').scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(1500);
    await expect(page.locator('#bars')).not.toHaveClass(/pre/);
    // EN
    await page.evaluate(() => scrollTo(0, 0));
    await page.locator('#lang').click();
    await page.waitForURL(/merlin-en\.html/);
    expect(await page.evaluate(() => localStorage.getItem('lang'))).toBe('en');
    // com en salvo, merlin.html redireciona
    await page.goto('/merlin.html');
    await page.waitForURL(/merlin-en\.html/);
    // PT volta e salva pt
    await page.locator('#lang').click();
    await page.waitForURL(/merlin\.html/);
    expect(await page.evaluate(() => localStorage.getItem('lang'))).toBe('pt');
    // Voltar ao portfólio
    await page.locator('a.back').click();
    await page.waitForTimeout(2500);
    const top = await page.evaluate(() => document.getElementById('projetos').getBoundingClientRect().top);
    expect(Math.abs(top)).toBeLessThan(120);
    expect(erros).toEqual([]);
  });
});

test.describe('Celular 390×844 com toque', () => {
  test.use({ viewport: PHONE, hasTouch: true, isMobile: true });

  test('menu em tela cheia, Tab preso, link fecha e rola', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2200);
    await page.locator('#mbtn').click();
    const nav = page.locator('#mnav');
    await expect(nav).toBeVisible();
    const box = await nav.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(PHONE.width - 1);
    expect(box.height).toBeGreaterThanOrEqual(PHONE.height - 1);
    for (let k = 0; k < 10; k++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!(document.activeElement.closest('#mnav') || ['lang', 'mbtn'].includes(document.activeElement.id)))).toBe(true);
    }
    await page.locator('#mnav a[href="#trajetoria"]').click();
    await page.waitForTimeout(2200);
    await expect(nav).toBeHidden();
    const top = await page.evaluate(() => document.getElementById('trajetoria').getBoundingClientRect().top);
    expect(Math.abs(top)).toBeLessThan(120);
  });

  test('projetos: "1 de 3", 4 outros, setas e arrasto giram, não gira sozinho', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2200);
    await scrollToId(page, 'projetos');
    await expect(page.locator('#cnt')).toHaveText(/^1 de 3$/);
    await expect(page.locator('#others li')).toHaveCount(4);
    await page.locator('#next').click(); await page.waitForTimeout(1200);
    expect(await counter(page)).toBe(2);
    // arrasto lateral
    const b = await page.locator('#stage').boundingBox();
    const y = b.y + b.height / 2;
    await page.evaluate(({ x1, x2, y }) => {
      const st = document.getElementById('stage');
      const ev = (type, x) => st.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, bubbles: true, pointerType: 'touch', isPrimary: true }));
      ev('pointerdown', x1); ev('pointermove', (x1 + x2) / 2); ev('pointermove', x2); window.dispatchEvent(new PointerEvent('pointerup', { clientX: x2, clientY: y, bubbles: true, pointerType: 'touch' })); st.dispatchEvent(new PointerEvent('pointerup', { clientX: x2, clientY: y, bubbles: true, pointerType: 'touch' }));
    }, { x1: b.x + b.width * 0.8, x2: b.x + b.width * 0.2, y });
    await page.waitForTimeout(1200);
    const depoisArrasto = await counter(page);
    expect(depoisArrasto).not.toBe(2);
    await page.waitForTimeout(5000);
    expect(await counter(page)).toBe(depoisArrasto);
  });
});

test.describe('Movimento reduzido', () => {
  test.use({ viewport: DESK, reducedMotion: 'reduce' });
  test('sem abertura, manifesto aceso, setas funcionando, sem erro', async ({ page }) => {
    const erros = watch(page);
    await page.goto('/');
    await page.waitForTimeout(400);
    const loadVisivel = await page.locator('#load').evaluate((el) => el.isConnected && !el.hidden && getComputedStyle(el).display !== 'none' && getComputedStyle(el).opacity !== '0' && getComputedStyle(el).visibility !== 'hidden');
    expect(loadVisivel).toBe(false);
    const ops = await page.locator('#mtxt .w, #mtxt').evaluateAll((ws) => ws.map((w) => +getComputedStyle(w).opacity));
    expect(Math.min(...ops)).toBeGreaterThan(0.95);
    await scrollToId(page, 'projetos');
    const c0 = await counter(page);
    await page.locator('#next').click(); await page.waitForTimeout(800);
    expect(await counter(page)).toBe(c0 + 1);
    expect(erros).toEqual([]);
  });
});

test.describe('Em tudo', () => {
  const TAM = [[360, 740], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]];
  for (const rota of ['/', '/merlin.html', '/merlin-en.html']) {
    for (const lang of ['pt', 'en']) {
      test(`sem erros e sem rolagem horizontal: ${rota} ${lang}`, async ({ browser }) => {
        for (const [w, h] of TAM) {
          const ctx = await browser.newContext({ viewport: { width: w, height: h } });
          await ctx.addInitScript((l) => { try { localStorage.setItem('lang', l); } catch (e) {} }, lang);
          const page = await ctx.newPage();
          const erros = watch(page);
          await page.goto(rota);
          await page.waitForTimeout(2000);
          await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
          await page.waitForTimeout(500);
          const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
          expect(sw, `${rota} ${lang} ${w}x${h}`).toBe(iw);
          expect(erros, `${rota} ${lang} ${w}x${h}`).toEqual([]);
          await ctx.close();
        }
      });
    }
  }
});

test.describe('Acessibilidade (axe)', () => {
  test.use({ viewport: DESK });
  for (const rota of ['/', '/merlin.html', '/merlin-en.html']) {
    test(`axe sem violações: ${rota}`, async ({ page }) => {
      await page.goto(rota);
      await page.waitForTimeout(2500);
      // Rola a página inteira antes: o manifesto começa apagado e só acende com a rolagem.
      await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
      await page.waitForTimeout(1200);
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'best-practice']).analyze();
      // Exceção aceita: contraste dos nomes de trás do tambor (apagados de propósito).
      const viol = r.violations
        .map((v) => ({ id: v.id, nodes: v.nodes.filter((n) => !(v.id === 'color-contrast' && n.target.join(' ').includes('#ring'))).map((n) => n.target.join(' ')) }))
        .filter((v) => v.nodes.length);
      expect(viol).toEqual([]);
    });
  }
});

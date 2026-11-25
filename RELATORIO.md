# Relatório: port do portfólio para Vite

Data: 25/11/2026. Ambiente de teste: Windows 11, Microsoft Edge (Chromium) via Playwright, porque não há Linux (WSL ou Docker) nesta máquina.

## Resumo

| Item | Resultado |
|---|---|
| Comparação visual com as capturas oficiais (`testes/comparar.mjs`) | Não passa no Windows, **pelo mesmo motivo que o próprio protótipo não passa** (ver 1.1). Precisa rodar em Linux. |
| Comparação ao vivo, site novo × protótipo na mesma máquina (`testes/comparar-ao-vivo.mjs`) | **24 de 24 idênticas: 0,000% de pixels diferentes**, mesma altura, no port original. Depois dos ajustes da seção 6, o estudo de caso continua 0,000%. Na página inicial, a única diferença é a linha removida a seu pedido (ver 6.3). |
| Testes de comportamento da seção 7.2 (`testes/comportamento.spec.js`) | **16 de 16 passaram**, antes e depois dos ajustes. |
| Zero erros de JS e zero 4xx/5xx, sem rolagem horizontal (3 páginas × 2 idiomas × 6 tamanhos) | **6 de 6 passaram** (36 combinações). |
| axe-core (`wcag2a`, `wcag2aa`, `best-practice`) | **3 de 3 páginas sem violações**, fora a exceção aceita do tambor. |
| Site publicado | Agora em **`https://joaoricardo.vercel.app`** (subdomínio gratuito da Vercel, com `SITE_URL` configurada). Páginas, arquivos, URLs absolutas e cache conferidos (ver 2.1). |
| Lighthouse no celular, na URL publicada | **Antes dos ajustes:** Performance 76–79, Acessibilidade 93 na inicial. **Depois dos ajustes:** Performance **92 / 100 / 92** (mediana de 3 execuções: inicial, Merlin PT, Merlin EN), Boas práticas 100 e SEO 100. A Acessibilidade da inicial continua em 93 por dois itens do próprio design; o estudo de caso tem 100 (ver 6.2). |

---

## 1. Comparação visual

### 1.1 Script oficial contra as capturas de Linux

```
FALHA home-pt-360x740  1.52% diferente
FALHA home-pt-390x844  1.28% diferente
FALHA home-pt-768x1024  0.77% diferente
FALHA home-pt-1024x768  0.75% diferente
OK   home-pt-1440x900  0.41% diferente
OK   home-pt-1920x1080  0.30% diferente
FALHA home-en-360x740  1.57% diferente
FALHA home-en-390x844  1.36% diferente
FALHA home-en-768x1024  0.78% diferente
FALHA home-en-1024x768  0.78% diferente
OK   home-en-1440x900  0.42% diferente
OK   home-en-1920x1080  0.30% diferente
FALHA merlin-pt-360x740  2.34% diferente
FALHA merlin-pt-390x844  2.19% diferente
FALHA merlin-pt-768x1024  1.44% diferente
FALHA merlin-pt-1024x768  1.33% diferente
FALHA merlin-pt-1440x900  0.85% diferente
FALHA merlin-pt-1920x1080  0.62% diferente
FALHA merlin-en-360x740  2.33% diferente
FALHA merlin-en-390x844  2.27% diferente
FALHA merlin-en-768x1024  1.52% diferente
FALHA merlin-en-1024x768  1.36% diferente
FALHA merlin-en-1440x900  0.88% diferente
FALHA merlin-en-1920x1080  0.65% diferente

20 captura(s) fora do limite de 0.5%. Veja testes/resultado/.
```

- **Todas as alturas de página batem** com a referência (nenhum aviso de altura).
- **Calibração:** rodei o mesmo script contra o **próprio protótipo** (`referencia/`, servido sem alteração) nesta máquina. Ele deu **os mesmos números**, captura por captura (1,52%, 1,28%, 0,77%…; só `merlin-en-1920x1080` variou de 0,65% para 0,68%).
- **Conclusão:** a diferença é o antisserrilhado de fonte do Windows contra o Linux das capturas, como o PEDIDO prevê na seção 7.1. Não é diferença do port.
- **Para fechar este critério,** rode o comando oficial em Linux (WSL, `ubuntu-latest` no GitHub Actions ou a imagem Docker do Playwright).

### 1.2 Comparação ao vivo, na mesma máquina

`testes/comparar-ao-vivo.mjs` (novo) renderiza o protótipo e o site novo no mesmo navegador, mesmos tamanhos, idiomas e movimento reduzido, e compara os dois.

```
OK   home-pt-360x740  0.000% diferente
OK   home-pt-390x844  0.000% diferente
OK   home-pt-768x1024  0.000% diferente
OK   home-pt-1024x768  0.000% diferente
OK   home-pt-1440x900  0.000% diferente
OK   home-pt-1920x1080  0.000% diferente
OK   home-en-360x740  0.000% diferente
OK   home-en-390x844  0.000% diferente
OK   home-en-768x1024  0.000% diferente
OK   home-en-1024x768  0.000% diferente
OK   home-en-1440x900  0.000% diferente
OK   home-en-1920x1080  0.000% diferente
OK   merlin-pt-360x740  0.000% diferente
OK   merlin-pt-390x844  0.000% diferente
OK   merlin-pt-768x1024  0.000% diferente
OK   merlin-pt-1024x768  0.000% diferente
OK   merlin-pt-1440x900  0.000% diferente
OK   merlin-pt-1920x1080  0.000% diferente
OK   merlin-en-360x740  0.000% diferente
OK   merlin-en-390x844  0.000% diferente
OK   merlin-en-768x1024  0.000% diferente
OK   merlin-en-1024x768  0.000% diferente
OK   merlin-en-1440x900  0.000% diferente
OK   merlin-en-1920x1080  0.000% diferente

Tudo idêntico à referência (mesma máquina).
```

## 2. Testes de comportamento e axe

Saída completa em `testes/resultado-comportamento.txt`. Resumo: **25 passed (4.3m)**.

- **Desktop 1440×900:** abertura e nome subindo; canvas da hero com pixels; 5 links do menu; roda do mouse avançando 1, 2, 3, 4 com a ficha acompanhando; setas ↑ ↓; clique no nome do tambor; galeria ampliada (foco no Fechar, Tab preso, ← do item 1 para o 13, Esc devolvendo o foco, clique fora fechando, página sem rolar); vídeo no item 5 e removido ao trocar; trilho avançando com →; `cv.pdf` e vídeo com 200; EN (lang, sem português visível, salvo após recarregar, link do estudo de caso para `merlin-en.html`); manifesto acendendo nos três casos.
- **Estudo de caso:** índice marcando a seção, barras crescendo, EN salvando `en`, redirecionamento com `en` salvo, PT salvando `pt`, "Voltar ao portfólio" chegando em `#projetos`.
- **Celular 390×844 com toque:** menu em tela cheia com Tab preso e link fechando e rolando; "1 de 3" e 4 outros projetos; setas e arrasto girando; tambor parado por 5s.
- **Movimento reduzido:** sem abertura, manifesto aceso, setas funcionando, sem erro.
- **Em tudo:** zero erros e zero 4xx/5xx; `scrollWidth === innerWidth`.
- **axe:** sem violações nas 3 páginas, com a exceção aceita.

**Uma nota sobre o axe:** na página inicial, ele só fica limpo depois de rolar a página inteira. Antes disso, as palavras do manifesto ainda estão com opacidade .16 e o axe marca `color-contrast` nelas. O teste rola a página antes de analisar. Isso vale igualmente para o protótipo, então não é uma regressão.

### 2.1 Site publicado

Verificado em `https://portfolio-ochre-two-oudskgy1zq.vercel.app`:

- **Respondem 200:** `/`, `/merlin.html`, `/merlin-en.html`, `/robots.txt`, `/sitemap.xml`, `/cv.pdf`, `/meus-direitos-pitch.mp4`, `/img/*.webp` e `/og.png`.
- **URLs absolutas:** `og:image`, `og:url`, `canonical`, `hreflang` e o sitemap já usam o domínio da Vercel (`VERCEL_PROJECT_PRODUCTION_URL`). Quando houver domínio próprio, defina `SITE_URL` na Vercel e publique de novo.
- **Cache:** `/img/*` com `public, max-age=31536000, immutable`; HTML com `public, max-age=0, must-revalidate`.

### 2.2 Lighthouse no celular

Lighthouse 13.6.0, perfil de celular, rodado desta máquina contra a URL publicada. Relatórios completos em `testes/lighthouse/*.report.html`.

| Página | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| `/` | **76** | **93** | 100 | 100 |
| `/merlin.html` | **78** | 100 | 100 | 100 |
| `/merlin-en.html` | **79** | 100 | 100 | 100 |
| Meta (seção 7.3) | ≥ 90 | ≥ 95 | ≥ 95 | 100 |

**Performance.**

| Métrica | `/` | `/merlin.html` |
|---|---|---|
| First Contentful Paint | 1,3 s | 1,1 s |
| Largest Contentful Paint | 1,3 s | 1,1 s |
| Cumulative Layout Shift | 0,002 | 0,092 |
| Speed Index | 3,4 s | 2,6 s |
| **Total Blocking Time** | **1.050 ms** | **840 ms** |

- O carregamento é rápido. O que derruba a nota é o **Total Blocking Time**, que é tempo de execução de JavaScript e de layout no carregamento:
  - o chunk do GSAP, ScrollTrigger e Lenis (`lenis-*.js`) tem uma tarefa longa de 710 ms e cálculos de layout forçados, apontados pelo `forced-reflow-insight`;
  - o script do portfólio (`index-*.js`), que monta o canvas da hero com o retrato em caracteres, tem cerca de 1,9 s de execução na CPU simulada.
- **O que a seção 7.3 permite e o que foi feito:**
  - compressão: a Vercel já serve com compressão;
  - cache: já configurado no `vercel.json`;
  - pré-carregamento: a foto da hero já é pré-carregada, como no protótipo. Pré-carregar a fonte melhoraria pouco o Speed Index e não mexe no TBT, então não foi feito.
- **Conclusão:** chegar a 90 exige mudar o JavaScript, o que a regra 1 proíbe sem autorização. Sugestões, sem implementar:
  - montar a camada de código do canvas da hero em `requestIdleCallback`, depois da primeira pintura;
  - criar os ScrollTriggers depois do `load`, ou dentro de um `requestAnimationFrame`, para evitar os layouts forçados no carregamento.

**Acessibilidade da página inicial (93).** Os três itens reprovados vêm do protótipo:

1. **`color-contrast`:** as palavras do manifesto começam com opacidade 0,16 e só acendem com a rolagem. É o efeito, e o mesmo motivo do axe (ver seção 2).
2. **`target-size`:** os nomes de trás do tambor (`button.nm`) são alvos de toque pequenos. É a exceção visual já aceita.
3. **`label-content-name-mismatch`:** o botão mostra "EN", mas o `aria-label` é "Switch to English"; o logo tem `aria-label="Início"`. O estudo de caso tem o mesmo problema no botão de idioma, mas ali ele não chegou a derrubar a nota.
   - **Sugestão:** começar o `aria-label` pelo texto visível (ex.: "EN, Switch to English"). Não muda nada no visual.

## 3. O que mudou em relação ao protótipo

Só o que a seção 6 permite:

1. Google Fonts e CDNs trocados por `@fontsource-variable/archivo` (arquivo `archivo-latin-wdth-normal.woff2`, `font-weight:100 900; font-stretch:62% 125%`), `@fontsource/nothing-you-could-do`, `gsap@3.12.5` e `lenis@1.1.13` via npm (versões exatas no `package.json`).
2. Linha `artifact-thumbnail` removida.
3. `SITE_URL` em `og:image`, `og:url`, `canonical` e `hreflang` (as duas versões do estudo de caso apontam uma para a outra e para si mesmas).
4. `robots.txt` e `sitemap.xml` gerados no build com a mesma `SITE_URL`.
5. `download="Curriculo_Joao_Ricardo_Coto.pdf"` no Baixar CV e `preload="none"` no vídeo (antes era `preload="metadata"`).
6. `vercel.json` com cache longo (`immutable`) em `/img`, `/assets` (fontes, CSS e JS com hash) e `.mp4`, e HTML com `max-age=0, must-revalidate`.

**Como o código foi portado:**
- O CSS e o JS foram **copiados por script, sem edição manual**, do `<style>` e do `<script>` de cada página.
- O JS virou módulo ES. As três primeiras linhas importam `gsap`, `ScrollTrigger` e `Lenis` e os expõem em `window`, como os scripts de CDN faziam; o resto é o código original, na mesma ordem.
- O redirecionamento de idioma do `<head>` do estudo de caso continua como script inline, para rodar antes de pintar.
- **`SITE_URL`:**
  - Use a variável de ambiente `SITE_URL` (ex.: `SITE_URL=https://joaoricardo.dev npm run build`).
  - Sem ela, na Vercel, o build usa o domínio de produção do projeto (`VERCEL_PROJECT_PRODUCTION_URL`).
  - Fora da Vercel, cai em `http://localhost:4173`.

## 4. Coisas estranhas ou que eu sugeriria mudar

Os itens 1 e 5 e as sugestões de acessibilidade da seção 2.2 foram resolvidos depois, a seu pedido (ver seção 6). Os demais seguem só como observação.

1. **Texto do Merlin desatualizado** *(resolvido na seção 6)*: a ficha dizia "O back-end acorda em até um minuto no primeiro acesso.", mas o back-end não dorme mais.
2. **CSS do estudo de caso:** `merlin.html` e `merlin-en.html` tinham CSS idêntico, exceto o comentário da linha `VOICE`. Virou um único `src/styles/case.css` (com o comentário em inglês). Isso não muda o visual.
3. **Nome do CSS de fontes no build:** o Vite agrupou o `fonts.css`, compartilhado pelas 3 páginas, num arquivo chamado `lenis-*.css`, por causa do chunk compartilhado. Funciona, só o nome engana.
4. **Pesos da fonte:** o Google Fonts servia Archivo só de 300 a 900, com itálico. O arquivo do fontsource vai de 100 a 900, sem itálico. Nenhum texto usa itálico nem peso abaixo de 300, e a comparação ao vivo deu 0,000%.
5. **Script de JS compartilhado `lenis-*.js`, 124 kB (47 kB gzip):** é o GSAP com ScrollTrigger e o Lenis. Se o Lighthouse reclamar, dá para carregar o ScrollTrigger só onde for usado, mas isso mexe na ordem de execução. Por isso não foi feito.

## 5. Pendências (precisam de você)

- **Publicação:** feita por você. Repositório `JoaoRicardoSOC/portfolio`, no ar em `https://joaoricardo.vercel.app`, com `SITE_URL` configurada.
- **Capturas oficiais da página inicial:** com a linha do Merlin removida, as 12 capturas `home-*` de `capturas/` ficaram desatualizadas. Para o `comparar.mjs` voltar a valer na página inicial, gere capturas novas em Linux com o mesmo script.
- **Comparação oficial em Linux** (`testes/comparar.mjs`), para cumprir o critério 7.1 à risca. Dá para rodar no GitHub Actions (`ubuntu-latest`).
- **Domínio próprio:** se um dia comprar um, troque a `SITE_URL` na Vercel e publique de novo.

## 6. Ajustes depois da publicação (autorizados pelo João)

Depois do primeiro deploy, você pediu para resolver as pendências de código. Estas mudanças vão além da seção 6 do PEDIDO, por isso ficam registradas à parte.

### 6.1 O que mudou

1. **Camada de código da hero montada em tempo ocioso** (`src/main.js`):
   - Antes, a função `ascii()` convertia o retrato em caracteres logo no carregamento, duas vezes: uma para o placeholder e outra para a foto. Era o maior bloco de JavaScript da página.
   - Agora ela roda em `requestIdleCallback`, com limite de 1,5 s, e cada nova chamada cancela a anterior.
   - Essa camada só aparece sob o pincel, que começa vazio. Por isso o que se vê não muda.
2. **Pré-carregamento da fonte** Archivo (`<link rel="preload" as="font">`) nas 3 páginas. O Vite troca o caminho pelo arquivo com hash no build.
3. **`aria-label` começando pelo texto visível,** para resolver o `label-content-name-mismatch`:
   - botão de idioma: "EN, switch to English" e "PT, mudar para português", no HTML e no `applyLang`;
   - logo: "João Ricardo, início".
4. **Linha "O back-end acorda em até um minuto no primeiro acesso."** removida da ficha do Merlin, em PT e EN.

### 6.2 Lighthouse no celular, medido localmente

Build de produção servido em `localhost:4173`; mediana de 3 execuções por página.

| Página | Antes: Performance | Antes: bloqueio | Depois: Performance | Depois: bloqueio |
|---|---|---|---|---|
| `/` | 83 | 651 ms | **92** | **300 ms** |
| `/merlin.html` | 88 | 432 ms | **95** | **243 ms** |

**Na URL publicada** (`https://joaoricardo.vercel.app`), depois do deploy dos ajustes. Mediana de 3 execuções:

| Página | Performance antes | Performance depois | Bloqueio depois | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|---|---|
| `/` | 76 | **92** | 311 ms | 93 | 100 | 100 |
| `/merlin.html` | 78 | **100** | 35 ms | 100 | 100 | 100 |
| `/merlin-en.html` | 79 | **92** | 326 ms | 100 | 100 | 100 |

- Uma execução avulsa, com todas as categorias, deu 90, 95 e 100 nas três páginas. A Performance varia alguns pontos de uma execução para outra, por isso a tabela usa a mediana.
- Relatórios completos em `testes/lighthouse/*.report.html`. Os de antes dos ajustes estão em `testes/lighthouse/antes/`.
- **Acessibilidade da página inicial: continua 93.** Sobraram dois itens, e corrigi-los mudaria o visual:
  - `color-contrast`: as palavras do manifesto começam com opacidade 0,16 até a rolagem acendê-las;
  - `target-size`: os nomes de trás do tambor são alvos pequenos.

### 6.3 Conferência visual e de comportamento

- **Estudo de caso, PT e EN:** 12 de 12 capturas com 0,000% de diferença em relação ao protótipo.
- **Página inicial:**
  - Sem a linha do Merlin, a ficha ficou 28 a 48 px mais curta, e tudo abaixo dela subiu. As capturas dão de 4% a 7% de diferença, e a de 1920×1080 dá 0,3%.
  - **Prova de que essa é a única diferença:** fiz um build de controle com todos os outros ajustes e a linha recolocada. Ele deu **24 de 24 capturas com 0,000%**. Ou seja, os itens 1 a 3 de 6.1 não mudam nenhum pixel.
- **Efeito de código sob o cursor:** confirmado depois da mudança. Passando o mouse pela foto, aparecem 108 pixels violeta, contra 107 no protótipo.
- **Testes de comportamento e axe:** 25 de 25 passaram (`testes/resultado-comportamento.txt`).

## Como rodar

```bash
npm install
npm run build
npx vite preview --port 4173
```

```bash
# testes (usa um Chromium/Edge instalado; sem CHROME_PATH, rode antes: npx playwright install chromium)
CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" BASE_URL=http://localhost:4173 npx playwright test
```

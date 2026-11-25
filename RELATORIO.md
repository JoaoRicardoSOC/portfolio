# Relatório: port do portfólio para Vite

Data: 25/11/2026. Ambiente de teste: Windows 11, Microsoft Edge (Chromium) via Playwright, porque não há Linux (WSL ou Docker) nesta máquina.

## Resumo

| Item | Resultado |
|---|---|
| Comparação visual com as capturas oficiais (`testes/comparar.mjs`) | Não passa no Windows, **pelo mesmo motivo que o próprio protótipo não passa** (ver 1.1). Precisa rodar em Linux. |
| Comparação ao vivo, site novo × protótipo na mesma máquina (`testes/comparar-ao-vivo.mjs`) | **24 de 24 idênticas: 0,000% de pixels diferentes**, mesma altura. |
| Testes de comportamento da seção 7.2 (`testes/comportamento.spec.js`) | **16 de 16 passaram.** |
| Zero erros de JS e zero 4xx/5xx, sem rolagem horizontal (3 páginas × 2 idiomas × 6 tamanhos) | **6 de 6 passaram** (36 combinações). |
| axe-core (`wcag2a`, `wcag2aa`, `best-practice`) | **3 de 3 páginas sem violações**, fora a exceção aceita do tambor. |
| Lighthouse na URL publicada | **Não rodado:** o site ainda não foi publicado (ver "Pendências"). |

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

## 4. Coisas estranhas ou que eu sugeriria mudar (nada implementado)

1. **Texto do Merlin desatualizado:** a ficha diz "O back-end acorda em até um minuto no primeiro acesso.", mas o back-end não dorme mais. Sugiro tirar essa linha.
2. **CSS do estudo de caso:** `merlin.html` e `merlin-en.html` tinham CSS idêntico, exceto o comentário da linha `VOICE`. Virou um único `src/styles/case.css` (com o comentário em inglês). Isso não muda o visual.
3. **Nome do CSS de fontes no build:** o Vite agrupou o `fonts.css`, compartilhado pelas 3 páginas, num arquivo chamado `lenis-*.css`, por causa do chunk compartilhado. Funciona, só o nome engana.
4. **Pesos da fonte:** o Google Fonts servia Archivo só de 300 a 900, com itálico. O arquivo do fontsource vai de 100 a 900, sem itálico. Nenhum texto usa itálico nem peso abaixo de 300, e a comparação ao vivo deu 0,000%.
5. **Script de JS compartilhado `lenis-*.js`, 124 kB (47 kB gzip):** é o GSAP com ScrollTrigger e o Lenis. Se o Lighthouse reclamar, dá para carregar o ScrollTrigger só onde for usado, mas isso mexe na ordem de execução. Por isso não foi feito.

## 5. Pendências (precisam de você)

- **Publicação:**
  - criar o repositório `JoaoRicardoSOC/portfolio` no GitHub;
  - fazer os commits;
  - ligar o deploy na Vercel.

  São ações públicas na sua conta, então não fiz sem confirmação.
- **Lighthouse no celular,** na URL publicada.
- **Comparação oficial em Linux** (`testes/comparar.mjs`), para cumprir o critério 7.1 à risca.

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

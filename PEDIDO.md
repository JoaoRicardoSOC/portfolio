# Pedido: publicar o portfólio do João Ricardo, idêntico ao protótipo

> Leia este arquivo inteiro antes de escrever qualquer código. Depois leia o `DESIGN.md`. Trabalhe seguindo o **checklist do fim**, marcando cada item com `[x]` neste mesmo arquivo à medida que concluir.

## 1. O que você vai fazer

Transformar o protótipo em `referencia/` num site de verdade, publicado na Vercel, **visualmente idêntico pixel a pixel** e com o mesmo comportamento. O protótipo já passou por uma caça a bugs completa, então o trabalho aqui é **portar e publicar, não redesenhar**.

## 2. Regras que não podem ser quebradas

1. **A fonte da verdade é o código em `referencia/`.** Copie o CSS e a lógica do JavaScript literalmente. Não "melhore", não troque valores, não arredonde `clamp()`, não troque curvas de animação, não reescreva textos.
2. **Não acrescente nada visual:** nenhum efeito, seção, ícone, sombra, cor ou biblioteca de UI (Tailwind, shadcn, Framer Motion, etc.).
3. **Não remova nada,** nem os detalhes pequenos: cursor violeta, máscara da foto, barra de progresso do estudo de caso, foco preso nos painéis, movimento reduzido.
4. Se algo parecer bug, **pare e descreva no relatório** em vez de "consertar" por conta própria. A exceção é se o teste de comparação mostrar diferença com a referência.
5. O resultado é aceito só quando `testes/comparar.mjs` passar nas 24 capturas e todos os testes de comportamento da seção 7 passarem.

## 3. O que tem neste pacote

| Caminho | O que é |
|---|---|
| `referencia/index.html` | Portfólio completo (HTML, CSS e JS num arquivo só). |
| `referencia/merlin.html` / `merlin-en.html` | Estudo de caso do Merlin em português e inglês. |
| `referencia/joao.webp` | Retrato recortado (sem fundo) usado na hero. |
| `referencia/img/*.webp` | 12 telas dos projetos e a capa do vídeo. |
| `referencia/meus-direitos-pitch.mp4` | Vídeo pitch (720p, 6,6 MB). |
| `referencia/cv.pdf` | Currículo para o botão "Baixar CV". |
| `referencia/og.png`, `og-merlin.png`, `icon-180.png` | Imagens de prévia e ícone. |
| `capturas/*.png` | 24 capturas de página inteira: 2 páginas × 2 idiomas × 6 tamanhos, com movimento reduzido. |
| `testes/comparar.mjs` | Compara o site novo com as capturas, pixel a pixel. |
| `DESIGN.md` | Especificação de design em palavras: tokens, seções, animações, pontos de quebra. |

## 4. Stack

- **Vite** em modo multi-página, com **JavaScript puro** (pode ser TypeScript), sem framework.
  - **Por quê:** o protótipo é HTML, CSS e JS puros. Manter a mesma natureza é o jeito mais seguro de ficar idêntico. Um framework de componentes obrigaria a reescrever a lógica de canvas, do tambor e do GSAP, abrindo espaço para diferenças.
- Bibliotecas via npm, **nas versões exatas:** `gsap@3.12.5` (com `ScrollTrigger`) e `lenis@1.1.13`.
- **Fontes auto-hospedadas** (sem Google Fonts): `@fontsource-variable/archivo`, usando o arquivo `archivo-latin-wdth-normal.woff2`, que tem os eixos `wght` 100–900 e `wdth` 62–125. Também `@fontsource/nothing-you-could-do`.
  - Declare com `font-weight:100 900; font-stretch:62% 125%`. As capturas foram geradas exatamente com esses arquivos.
- **Hospedagem:** Vercel, plano gratuito. **Domínio:** ainda não definido. Use a variável `SITE_URL` em tudo que precisar de URL absoluta.

## 5. Estrutura sugerida

```
/
├─ index.html            ← portfólio (conteúdo de referencia/index.html)
├─ merlin.html           ← estudo de caso PT
├─ merlin-en.html        ← estudo de caso EN
├─ src/
│  ├─ styles/base.css    ← tokens + estilos do portfólio (copiados do <style>)
│  ├─ styles/case.css    ← estilos do estudo de caso
│  ├─ fonts.css          ← @font-face apontando pros arquivos do fontsource
│  ├─ main.js            ← script do portfólio, dividido em módulos se quiser
│  │   (loader, scroll, menu, hero-canvas, manifesto, drum, gallery, lightbox, i18n)
│  └─ case.js            ← script do estudo de caso
├─ public/
│  ├─ joao.webp, cv.pdf, meus-direitos-pitch.mp4, og.png, og-merlin.png, icon-180.png
│  ├─ img/…
│  ├─ robots.txt, sitemap.xml
├─ capturas/  testes/   ← deste pacote
└─ vite.config.js        ← build.rollupOptions.input com as 3 páginas
```

Dividir o JS em módulos é permitido **desde que o comportamento e a ordem de execução fiquem iguais**. Exemplos de ordem que importa:
- o `GAL` precisa existir antes da primeira `showInfo`;
- `applyLang(true)` roda por último;
- na abertura em português, o `applyLang` **não pode** regravar o `innerHTML` do manifesto, senão a animação perde as palavras e ele fica cinza. Esse bug já aconteceu uma vez.

## 6. O que muda em relação ao protótipo (e só isso)

1. **Fontes e bibliotecas:** trocar os links de CDN e do Google Fonts pelos pacotes npm da seção 4.
2. **Remover** a linha `<link rel="artifact-thumbnail" href="og.png">`. Ela só serve pra hospedagem do protótipo.
3. **URLs absolutas com `SITE_URL`** em:
   - `og:image` (`${SITE_URL}/og.png` e `${SITE_URL}/og-merlin.png`);
   - `og:url`;
   - `<link rel="canonical">` em cada página;
   - `hreflang` entre `merlin.html` e `merlin-en.html`.
4. **Criar** `robots.txt` (permitindo tudo, com o sitemap) e `sitemap.xml` com as 3 páginas.
5. **Botão "Baixar CV":** acrescentar o atributo `download="Curriculo_Joao_Ricardo_Coto.pdf"`.
6. **Vídeo:** acrescentar `preload="none"` no `<video>` da galeria ampliada.
7. **Cabeçalhos de cache na Vercel:** `public/img`, fontes e vídeo com cache longo (`immutable`). HTML sem cache longo.
8. **Nada mais.** Qualquer outra mudança vai no relatório como sugestão, sem implementar.

## 7. Critérios de aceite

### 7.1 Visual (obrigatório)

```bash
npm i -D playwright pixelmatch pngjs && npx playwright install chromium
npm run build && npx vite preview --port 4173 &
BASE_URL=http://localhost:4173 node testes/comparar.mjs
```

- Precisa terminar com **"Tudo idêntico à referência."**, com limite de 0,5% de pixels diferentes e altura de página igual.
- Ajuste a tabela `ROTAS` no topo do script se as URLs mudarem.
- O antisserrilhado de fonte varia entre sistemas operacionais. As capturas foram geradas no **Chromium em Linux**, então rode a comparação em Linux: WSL, GitHub Actions `ubuntu-latest` ou a imagem Docker oficial do Playwright. No Windows nativo, diferenças pequenas e espalhadas nas bordas das letras são esperadas e não contam como falha. Diferenças concentradas num bloco contam.
- Se falhar, abra `testes/resultado/*-diff.png`, ache a diferença e corrija até passar.

### 7.2 Comportamento (obrigatório)

Escreva estes testes em Playwright (`testes/comportamento.spec.js`). Todos já passam no protótipo.

**Desktop, 1440×900**
- [ ] A abertura some depois de ~1,5s, e o nome sobe linha por linha.
- [ ] O canvas da hero desenha a foto (existem pixels não transparentes).
- [ ] Os 5 links do menu levam às seções certas (topo da seção a menos de 120px do topo da tela).
- [ ] Rolando a roda do mouse dentro de Projetos, o contador avança em ordem: 1, 2, 3, 4…
- [ ] A ficha acompanha o projeto da frente.
- [ ] As setas ↑ ↓ mudam o projeto.
- [ ] Clicar num nome do tambor traz ele pra frente.
- [ ] "Ver telas (4)" abre a galeria ampliada no Merlin, com o foco no botão Fechar.
- [ ] Na galeria ampliada:
  - o Tab não sai de dentro;
  - a seta ← a partir do item 1 vai pro 13;
  - Esc fecha e o foco volta pro botão de origem;
  - clicar fora fecha;
  - a página não rola enquanto está aberta.
- [ ] O item 5 da galeria abre o `<video>` com `meus-direitos-pitch.mp4`, e trocar de item remove o vídeo.
- [ ] Os botões → da galeria fazem o trilho avançar.
- [ ] `cv.pdf` e o vídeo respondem 200.
- [ ] EN troca a página pra inglês:
  - `lang="en"`;
  - sem português visível (por exemplo: "Projetos", "Galeria", "Meu papel", "Ver telas", " de 7");
  - a escolha fica salva e sobrevive ao recarregar;
  - o link do estudo de caso aponta pra `merlin-en.html`.
- [ ] O manifesto acende palavra por palavra com a rolagem nos três casos: abrindo em PT, abrindo em EN e trocando de idioma ida e volta.

**Estudo de caso**
- [ ] O índice marca a seção atual ao clicar.
- [ ] As barras do gráfico crescem quando entram na tela.
- [ ] O botão EN leva a `merlin-en.html` e salva `en`.
- [ ] Com `en` salvo, abrir `merlin.html` redireciona.
- [ ] PT volta e salva `pt`.
- [ ] "Voltar ao portfólio" chega em `#projetos`.

**Celular, 390×844, com toque**
- [ ] O Menu abre em tela cheia, o Tab fica dentro dele, e escolher um link fecha o menu e rola até a seção.
- [ ] Projetos mostra "1 de 3" e a lista "Outros projetos" com 4 itens.
- [ ] As setas e o arrasto lateral giram o tambor.
- [ ] O tambor **não** gira sozinho (esperar 5s sem mexer).

**Movimento reduzido**
- [ ] Sem abertura, manifesto todo aceso, setas funcionando, sem erro de JS.

**Em tudo**
- [ ] Zero erros de JS e zero respostas 4xx ou 5xx nas 3 páginas × 2 idiomas × 6 tamanhos.
- [ ] Nenhuma rolagem horizontal (`scrollWidth === innerWidth`).

### 7.3 Acessibilidade e qualidade

- [ ] axe-core (`wcag2a`, `wcag2aa`, `best-practice`) sem violações nas 3 páginas, com uma exceção aceita: `color-contrast` nos nomes de trás do tambor, que ficam apagados de propósito.
- [ ] Lighthouse no celular, na URL publicada: Performance ≥ 90, Acessibilidade ≥ 95, Boas práticas ≥ 95, SEO = 100.
- [ ] Se a Performance ficar abaixo, ajuste só o que não muda o visual: pré-carregamento, compressão, cache. Relate o que fez.

## 8. Conteúdo

Todo o texto está na referência, em português e em inglês (`data-en` e os campos `en` dos projetos). **Não reescreva nada.** Dados de contato e links:

- E-mail: joaoricardosoc@gmail.com · WhatsApp: (69) 98112-3101 (`https://wa.me/5569981123101`)
- LinkedIn: https://www.linkedin.com/in/joaoricardosoc · GitHub: https://github.com/JoaoRicardoSOC
- Deploys:
  - Merlin: https://merlin-route-finder.vercel.app/
  - Meus Direitos: https://meus-direitos-kohl.vercel.app/
  - OTIS: https://sistema-otis-puce.vercel.app/login
  - Feira Online: https://feira-online-liart.vercel.app/

## 9. Entrega

1. Repositório novo no GitHub do João (`JoaoRicardoSOC/portfolio`), com commits pequenos e mensagens claras.
2. Deploy na Vercel ligado ao repositório.
3. Um `RELATORIO.md` na raiz com:
   - a saída do `comparar.mjs`;
   - o resultado dos testes de comportamento e do axe;
   - as notas do Lighthouse;
   - tudo que você achou estranho ou sugeriria mudar (sem implementar).

---

## Checklist

**Preparação**
- [x] Li o PEDIDO.md e o DESIGN.md inteiros.
- [x] Abri `referencia/index.html` e `merlin.html` no navegador e naveguei por tudo antes de começar. *(feito de forma automatizada: comparação ao vivo e testes de comportamento contra o protótipo)*

**Projeto**
- [x] Criei o projeto Vite multi-página com as 3 entradas.
- [x] Instalei `gsap@3.12.5`, `lenis@1.1.13`, `@fontsource-variable/archivo` e `@fontsource/nothing-you-could-do`.
- [x] Criei `fonts.css` com o arquivo `wdth` do Archivo e removi Google Fonts e CDNs.
- [x] Copiei o CSS do portfólio para `base.css` **sem alterar valores**.
- [x] Copiei o CSS do estudo de caso para `case.css` **sem alterar valores**.
- [x] Portei o JS do portfólio, mantendo a ordem de execução da seção 5.
- [x] Portei o JS do estudo de caso, incluindo o redirecionamento de idioma no `<head>`.
- [x] Copiei todos os arquivos de `referencia/` para `public/` (foto, telas, vídeo, CV, prévias, ícone).

**Mudanças permitidas (seção 6)**
- [x] Removi a linha do `artifact-thumbnail`.
- [x] Coloquei `SITE_URL` em `og:image`, `og:url`, `canonical` e `hreflang`.
- [x] Criei `robots.txt` e `sitemap.xml`.
- [x] Coloquei `download` no Baixar CV e `preload="none"` no vídeo.
- [x] Configurei os cabeçalhos de cache na Vercel.

**Testes**
- [ ] `comparar.mjs` passou nas 24 capturas. *(no Windows o próprio protótipo dá os mesmos números; falta rodar em Linux. Na mesma máquina, site novo × protótipo: 24/24 com 0,000%. Ver RELATORIO.md)*
- [x] Todos os testes de comportamento da seção 7.2 passaram.
- [x] axe sem violações, fora a exceção aceita.

**Publicação**
- [ ] Publiquei na Vercel e rodei o Lighthouse na URL publicada.
- [x] Escrevi o `RELATORIO.md`.

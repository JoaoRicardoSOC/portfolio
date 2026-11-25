# Portfólio João Ricardo: especificação de design

Este documento descreve o design do portfólio em palavras e números. **A fonte da verdade é o código em `referencia/`**: quando este texto e o código discordarem, vale o código. Os valores abaixo foram extraídos dele.

---

## 1. Conceito

O site de um piloto de F1 (landonorris.com) traduzido para um desenvolvedor:

- **Hero:** nome gigante atrás do retrato recortado. Onde o nome passa por cima da pessoa, a letra vira só contorno. Sob o cursor, o retrato vira código.
- **Manifesto:** acende palavra por palavra com a rolagem e termina numa assinatura manuscrita.
- **Projetos:** um tambor vertical de nomes gigantes que gira como um odômetro, com uma ficha técnica ao lado.
- **Galeria:** telas reais dos projetos em molduras de celular e de navegador, mais o vídeo pitch.
- **Estudo de caso:** página longa em formato de relatório de engenharia (`merlin.html` e `merlin-en.html`).

Voz: confiante, curta, sem jargão de currículo. Português do Brasil informal ("pra", "Bora conversar").

---

## 2. Tokens

### Cores

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#000` | fundo de todas as seções (preto puro, nunca `#111`) |
| `--ink` | `#fff` | texto principal, botões sólidos |
| `--mute` | `#8d8d93` | texto secundário, legendas, metadados |
| `--soft` | `#c9c9cf` | parágrafos longos no estudo de caso |
| `--line` | `#232326` | linhas finas e divisórias |
| `--panel` | `#0d0d0f` | fundo de caixas (hover de "No código", diagramas) |
| `--vio` | `#7c5cff` | acento raro: cursor, ano do projeto ativo, marcadores, foco, link do estudo de caso |

O violeta é detalhe, nunca fundo de bloco. Botões principais são brancos com texto preto.

### Tipografia

| Família | Arquivo | Uso |
|---|---|---|
| **Archivo** (variável, eixos `wght` 100–900 e `wdth` 62–125) | `@fontsource-variable/archivo`, arquivo `archivo-latin-wdth-normal.woff2` | tudo |
| **Nothing You Could Do** | `@fontsource/nothing-you-could-do` | só a assinatura do manifesto |

- **Display** (`.disp`): `font-weight:900; font-stretch:62%; text-transform:uppercase; line-height:.86; letter-spacing:-.01em`.
- **Corpo:** `400 17px/1.55 Archivo`, `font-stretch` padrão (100%).
- **Logo do menu:** `800`, `font-stretch:125%`, 15px.
- **Escala de títulos** (todas com `clamp`):

| Onde | Tamanho |
|---|---|
| Nome da hero | `clamp(76px,19vw,300px)` |
| Celular deitado (altura ≤ 500px) | `clamp(52px,17vh,96px)` |
| "Bora conversar" | `clamp(64px,14vw,230px)` |
| "No código / Fora do código" | `clamp(64px,10vw,150px)`, `line-height:1.1` (para o acento de CÓDIGO não tocar o DO) |
| "Na tela" | `clamp(56px,9vw,130px)` |
| "Trajetória" | `clamp(48px,6vw,92px)`, `white-space:nowrap` (nunca quebra a palavra) |
| Nomes do tambor | `clamp(40px,4.8vw,84px)`; ≤ 860px: `clamp(34px,10.5vw,56px)`; ≥ 1600px: `clamp(84px,5vw,120px)` |
| Manifesto | `clamp(28px,4.4vw,58px)`, peso 500, `font-stretch:88%`, `line-height:1.08`, máximo 21ch |
| Estudo de caso, h1 | `clamp(64px,13vw,210px)` |
| Estudo de caso, h2 | `clamp(44px,5.6vw,84px)` |

### Espaçamento e grade

- **Margem lateral:** `max(5vw,16px)` em todas as seções.
- **Faixa (`.band`):** `padding: clamp(56px,9vw,140px) max(5vw,16px)`.
- **Largura de conteúdo (`.wrap`):** `max-width:1240px`. No estudo de caso: `1400px`, com índice de 220px.
- **Raios:** pílulas 999px; cartões e molduras 14–22px; moldura de celular 34px com borda de 8px `#1c1c21`.

### Pontos de quebra

| Regra | O que muda |
|---|---|
| `max-width:380px` | o menu esconde o texto "João Ricardo" e deixa só o monograma |
| `max-width:700px` | menu vira botão "Menu" em tela cheia; foto centralizada com `width:min(132vw,70svh)`; nome desce `14svh` |
| `701px a 1100px` | foto com `height:min(72%,680px)` |
| `max-width:800px` | "No código / Fora do código" empilham; trajetória em uma coluna |
| `max-width:860px` | projetos no modo celular: só 3 destaques no tambor, lista "Outros projetos" abaixo, sem trilho lateral |
| `min-width:861px` e `min-height:821px` | seção de projetos **trava na tela** e gira com a rolagem |
| `max-height:820px` e `min-width:861px` | projetos não travam (a ficha não caberia); o tambor fica com `height:min(78svh,560px)` |
| `min-width:1600px` | tambor e ficha maiores |
| `max-height:500px` e paisagem | hero de celular deitado (foto à direita, nome menor) |
| `hover:none` | sem cursor violeta e sem `cursor:none` na hero |
| `prefers-reduced-motion` | sem abertura, sem rolagem suave, sem tambor travado, manifesto já aceso, transições desligadas |

---

## 3. Seções, de cima para baixo (`index.html`)

### 3.1 Abertura (loader)
- Tela preta com o monograma **JR** montado como ímã: J vem da esquerda (−160px) e R da direita (+160px) com `transition: transform .9s cubic-bezier(.2,1.6,.4,1)`. Depois a barra violeta cai de cima (−140px) com `.5s cubic-bezier(.2,1.8,.4,1)` e atraso de `.75s`.
- Some aos **1500ms** com `opacity .5s` (atraso de .2s).
- Ao sumir: as linhas do nome sobem (`gsap.from('.name i',{yPercent:105,duration:1.1,ease:'expo.out',stagger:.12})`) e a foto aparece (`opacity 0`, `scale 1.06`, `1.6s power2.out`).
- Geometria do monograma: os `<polygon>` e o `<path>` exatos estão em `referencia/index.html`.

### 3.2 Menu
- Fixo, `mix-blend-mode:difference`, padding `14px max(5vw,16px)`.
- À esquerda: monograma JR (32px) e "João Ricardo". À direita: links (No código, Projetos, Galeria, Trajetória, Contato), botão de idioma **EN/PT** (pílula com borda) e, no celular, o botão **Menu**.
- O menu do celular cobre a tela inteira em preto, com os links em display de `clamp(48px,14vw,72px)`. Esc fecha, o Tab fica preso dentro, e escolher um link fecha o menu e rola até a seção.

### 3.3 Hero
- Camadas, de trás para frente: nome sólido (`z-index:1`), foto em canvas (`z-index:2`), o mesmo nome só em contorno (`z-index:3`, `color:transparent; -webkit-text-stroke: clamp(1px,.12vw,2px) #fff`). Esse é o efeito "vazado" da thumbnail.
- Nome em duas linhas: JOÃO / RICARDO, com a segunda recuada `padding-left:8vw`.
- **Foto:** `joao.webp` (recortada, sem fundo), desenhada em canvas em preto e branco (`filter: grayscale(1) contrast(1.15) brightness(1.05)`), encostada embaixo e à direita (`right:max(3vw,0px)`), `height:min(88%,900px)`, `aspect-ratio:1167/1200`, com máscara `linear-gradient(#000 62%, transparent 98%)` pra base sumir no preto.
- **Efeito de código:** uma segunda camada com a própria foto desenhada em caracteres ` .:;=+*{}<>/01#` (célula = largura/70, mínimo 8px; brilho > .72 branco, > .4 `#b7a6ff`, resto `#7c5cff`). Ela aparece através de uma máscara pintada pelo cursor:
  - pincel radial com raio de 11% da largura;
  - a máscara se apaga 3,5% por quadro;
  - sem mexer o mouse por 2,4s, um pincel passeia sozinho (só em telas com hover);
  - no toque, cada toque revela um círculo.
- **Cursor:** uma barra violeta de 3×22px inclinada −14°, só sobre a hero.
- **Rodapé da hero:** "Software Engineer" (600) e "Engenharia de Software · FIAP · Cuiabá, MT" (mute).
- A foto se move 12% para baixo com a rolagem (parallax via ScrollTrigger).

### 3.4 Manifesto
- O texto é quebrado em palavras com `opacity:.16`, que vão a 1 com `scrub` entre `top 75%` e `bottom 60%` da seção (`stagger .06`).
- Assinatura em Nothing You Could Do, `rotate(-4deg)`, com legenda pequena.

### 3.5 No código / Fora do código
- Duas colunas separadas por 2px de `--line`. Cada lado é um link inteiro.
- O título de "Fora do código" é só contorno (`-webkit-text-stroke:2px #fff`).
- A seta circular de 48px gira −45° e fica branca no hover.

### 3.6 Faixa da stack
- Marquee infinito (`30s linear`), alternando nome sólido e contorno, separados por "/" violeta.

### 3.7 Projetos (tambor)
- **Tambor:** cada nome é um botão posicionado em 3D com `translateZ(-R) rotateX(-a) translateZ(R) translateY(-50%)`.
  - `a = (i - rot) * 24°`, e `R` sai da altura da linha.
  - Opacidade `.12 + .88·cos(a)³`; itens a mais de 88° ficam escondidos.
  - Inativos: só contorno `rgba(255,255,255,.55)`. Ativo: branco sólido com o ano em violeta.
  - Máscara vertical: `linear-gradient(transparent, #000 22%, #000 78%, transparent)`.
  - Perspectiva 1100px, `perspective-origin: 30% 50%`, suavização `rot += (target - rot) * .09`.
- **Trilho:** linha à direita com um marcador violeta de 6×28px que acompanha o progresso.
- **Travado na tela** (telas ≥ 861×821): a seção fica presa por `0,5 × altura da tela × (projetos − 1)`, com snap em cada projeto.
- **Ficha** (à direita; abaixo no celular): selo de prêmio (medalha prata em `conic-gradient`), linha de contexto, frase-resumo grande, lista de funcionalidades com traço violeta, linhas "Meu papel" e "Stack", e os links. Os links são "Ler estudo de caso" (violeta, só no Merlin), "Abrir repositório", "Ver projeto no ar" ou "Demo indisponível" e "Ver telas (n)".
  - Cada bloco entra com `rv .6s cubic-bezier(.2,.9,.3,1)`, `translateY(18px)` e `blur(4px)`, com 70ms de atraso entre blocos.
- **Controles:** setas ↑ ↓ e contador "1 de 7"; setas do teclado; clique no nome; arrastar para o lado no celular. O tambor **nunca** gira sozinho.

### 3.8 Galeria "Na tela"
- Trilho horizontal com scroll-snap e botões ← →; a altura das peças é `--gh: clamp(300px,58svh,560px)`.
- Antes de cada projeto, um separador com o nome em display e uma legenda ("Celular, 2026").
- Molduras:
  - celular (500:900, raio 34px, sombra violeta suave);
  - navegador (1280:855, barra de 28px com 3 bolinhas);
  - vídeo (16:9 com botão de play branco de 76px).
- **Galeria ampliada:** fundo `rgba(0,0,0,.94)`, contador "n / 13", botão Fechar, legenda e setas.
  - Esc fecha, as setas do teclado navegam, o Tab fica preso dentro.
  - Clicar fora fecha, a página não rola enquanto está aberta e o foco volta ao botão de origem.
  - O vídeo pausa ao fechar.

### 3.9 Trajetória
- Duas colunas: o título e uma lista com data à esquerda (`7.5em`, números tabulares) e texto à direita. A linha do 2º lugar tem um selo branco.

### 3.10 Contato
- "Tem uma vaga ou um projeto?" e **BORA CONVERSAR** gigante (link pro LinkedIn, violeta no hover).
- Pílulas: **Baixar CV** (sólida), LinkedIn, WhatsApp, GitHub e Voltar ao topo.
- E-mail e WhatsApp em texto selecionável. Rodapé com o nome completo e "Cuiabá, MT · aberto a estágio e trabalho remoto".

---

## 4. Estudo de caso (`merlin.html` / `merlin-en.html`)

- **Barra de progresso** violeta de 2px no topo.
- **Menu:** "← Voltar ao portfólio", links pro app e pro repositório, botão de idioma.
- **Cabeçalho:**
  - título em duas linhas;
  - resumo;
  - quatro fatos: Resultado (com medalha), Meu papel, Equipe e Stack;
  - três links sublinhados.
- **Índice** fixo à esquerda (some abaixo de 1100px). A seção atual fica branca, com barra violeta.
- **Seções:** O problema, A virada, A solução, Arquitetura, Decisões técnicas, Resultados e Lições, mais o fechamento "Quer ver rodando?".
- **Componentes próprios:**
  - três dores em grade;
  - antes/depois com itens riscados;
  - quatro passos numerados em violeta;
  - diagrama de arquitetura em caixas e setas (empilha abaixo de 900px);
  - pipeline da ruptura com o plano B tracejado;
  - tabela de modelos;
  - gráfico de barras de latência, com a variação listrada, que cresce ao entrar na tela;
  - lista de tentativas (✕ e ✓);
  - grade de resultados com números grandes.

---

## 5. Idiomas

- Botão EN/PT no menu. A escolha fica salva em `localStorage['lang']`.
- No portfólio, os textos trocam no lugar: elementos com `data-en` e dados dos projetos com campo `en`.
- O estudo de caso tem um arquivo por idioma. Se a escolha salva for inglês, `merlin.html` redireciona para `merlin-en.html`.
- Ao trocar de idioma, o manifesto é re-quebrado em palavras e a animação é recriada.

---

## 6. Acessibilidade (o que já está garantido e precisa continuar)

- Foco visível em tudo: `outline 2px solid #7c5cff; outline-offset:3px`.
- Painéis abertos (menu do celular e galeria ampliada) prendem o Tab, fecham com Esc e devolvem o foco.
- Todos os botões têm nome acessível. Imagens decorativas têm `alt=""` e o retrato tem `role="img"` com rótulo.
- Movimento reduzido respeitado em tudo.
- **Exceção consciente:** os nomes de trás do tambor ficam apagados, porque esse é o visual do tambor. Eles continuam acessíveis por leitor de tela e ficam 100% visíveis ao receber foco.
- Resultado do axe-core no protótipo: zero violações, fora essa exceção.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
// Os scripts de CDN do protótipo expunham estes globais; o código portado os usa como estão.
gsap.registerPlugin(ScrollTrigger);
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.Lenis = Lenis;

/* idioma: pt ou en, lembrado só neste navegador */
let LANG='pt';try{LANG=localStorage.getItem('lang')==='en'?'en':'pt'}catch(e){}
const TX={pt:{menu:'Menu',close:'Fechar',role:'Meu papel',repo:'Abrir repositório',live:'Ver projeto no ar',nodemo:'Demo indisponível',cs:'Ler estudo de caso',csf:'merlin.html',others:'Outros projetos',orepo:'Repositório ↗',olive:'No ar ↗',of:'de',shots:'Ver telas',hpin:'Role pra girar. Clique num nome pra trazer ele pra frente.',hsm:'Arraste pro lado, use as setas ou toque num nome.',hdesk:'Use as setas ou clique num nome pra trazer ele pra frente.',lang:'EN',langl:'Switch to English',title:'João Ricardo — Portfólio',screens:'telas',video:'vídeo'},
en:{menu:'Menu',close:'Close',role:'My role',repo:'Open repository',live:'See it live',nodemo:'Demo unavailable',cs:'Read the case study',csf:'merlin-en.html',others:'Other projects',orepo:'Repository ↗',olive:'Live ↗',of:'of',shots:'See screens',hpin:'Scroll to spin. Click a name to bring it to the front.',hsm:'Swipe sideways, use the arrows or tap a name.',hdesk:'Use the arrows or click a name to bring it to the front.',lang:'PT',langl:'Mudar para português',title:'João Ricardo — Portfolio',screens:'screens',video:'video'}};
const t=k=>TX[LANG][k];
const LP=(p,k)=>LANG==='en'&&p.en&&p.en[k]!==undefined?p.en[k]:p[k];
/* troque null pela sua foto (data URI ou caminho) */
const PHOTO='joao.webp';
{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG=!!window.gsap&&!!window.ScrollTrigger;

/* abertura */
const L=document.getElementById('load');
requestAnimationFrame(()=>requestAnimationFrame(()=>L.classList.add('go')));
setTimeout(()=>{L.classList.add('done');if(hasG&&!reduce){gsap.from('.name i',{yPercent:105,duration:1.1,ease:'expo.out',stagger:.12});gsap.from('.shot',{opacity:0,scale:1.06,duration:1.6,ease:'power2.out'})}},reduce?0:1500);

/* rolagem suave */
let lenis=null;
if(hasG)gsap.registerPlugin(ScrollTrigger);
if(window.Lenis&&!reduce){
  lenis=new Lenis({lerp:.09});
  if(hasG){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
  else{const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}
}
const goTo=y=>lenis?lenis.scrollTo(y):scrollTo({top:y,behavior:reduce?'auto':'smooth'});
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();const y=a.getAttribute('href')==='#top'?0:t.getBoundingClientRect().top+scrollY;lenis?lenis.scrollTo(y):scrollTo({top:y,behavior:reduce?'auto':'smooth'})});

/* mantém o Tab dentro de um painel aberto */
const trapTab=(e,box,extra=[])=>{if(e.key!=='Tab')return;const f=[...extra,...box.querySelectorAll('a[href],button:not([disabled]),video[controls],[tabindex="0"]')].filter(x=>x.offsetParent!==null||x===document.activeElement);if(!f.length)return;const i=f.indexOf(document.activeElement);
  if(e.shiftKey&&(i<=0)){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&(i===f.length-1||i===-1)){e.preventDefault();f[0].focus()}};
/* menu do celular */
{const b=document.getElementById('mbtn'),m=document.getElementById('mnav');const set=o=>{m.hidden=!o;b.setAttribute('aria-expanded',o);b.textContent=o?t('close'):t('menu');lenis&&(o?lenis.stop():lenis.start())};b.onclick=()=>set(m.hidden);m.addEventListener('click',e=>{if(e.target.closest('a'))set(false)},true);addEventListener('keydown',e=>{if(m.hidden)return;if(e.key==='Escape'){set(false);b.focus()}else trapTab(e,m,[document.getElementById('lang'),b])})}
/* manifesto acende palavra por palavra */
const mt=document.getElementById('mtxt');let mtw=null;
const splitMani=()=>{if(mtw){mtw.scrollTrigger&&mtw.scrollTrigger.kill();mtw.kill()}
  mt.innerHTML=mt.textContent.split(' ').map(w=>`<span class="w">${w}</span>`).join(' ');
  if(hasG&&!reduce)mtw=gsap.to('#mtxt .w',{opacity:1,stagger:.06,ease:'none',scrollTrigger:{trigger:'.mani',start:'top 75%',end:'bottom 60%',scrub:true}});
  else document.querySelectorAll('#mtxt .w').forEach(w=>w.style.opacity=1)};
splitMani();

/* faixa da stack */
const S=['Java','React','Python','SQL','JavaScript','Oracle','Tailwind','FastAPI','JUnit','Git'];
const row=S.map((s,i)=>`<span class="disp ${i%2?'o':''}">${s}</span><span class="disp" style="color:var(--vio)">/</span>`).join('');
document.getElementById('mq').innerHTML=row+row;

/* hero: retrato que vira código sob o cursor */
const hero=document.querySelector('.hero'),shot=document.querySelector('.shot'),pc=document.getElementById('pc'),px=pc.getContext('2d'),cur=document.getElementById('cur');
const mk=()=>document.createElement('canvas');
const A=mk(),B=mk(),Mk=mk(),T=mk();A.getContext('2d',{willReadFrequently:true});let PW=0,PH=0,img=null,heroOn=true,lastMove=0,pp=null;
const cover=(c,im)=>{const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.filter='grayscale(1) contrast(1.15) brightness(1.05)';const s=Math.min(c.width/im.width,c.height/im.height),w=im.width*s,h=im.height*s;g.drawImage(im,(c.width-w)/2,c.height-h,w,h);g.filter='none'};
const placeholder=c=>{const g=c.getContext('2d'),w=c.width,h=c.height;g.clearRect(0,0,w,h);
  const body=g.createLinearGradient(0,h*.2,0,h);body.addColorStop(0,'#9a9aa6');body.addColorStop(1,'#26262c');g.fillStyle=body;
  g.beginPath();g.moveTo(w*.06,h);g.bezierCurveTo(w*.08,h*.74,w*.28,h*.68,w*.42,h*.66);g.lineTo(w*.58,h*.66);g.bezierCurveTo(w*.72,h*.68,w*.92,h*.74,w*.94,h);g.fill();
  g.fillRect(w*.44,h*.54,w*.12,h*.14);g.beginPath();g.ellipse(w*.5,h*.42,w*.15,h*.15,0,0,7);g.fill();
  const rim=g.createLinearGradient(w*.32,0,w*.7,0);rim.addColorStop(0,'rgba(255,255,255,.5)');rim.addColorStop(.4,'rgba(255,255,255,0)');g.globalCompositeOperation='source-atop';g.fillStyle=rim;g.fillRect(0,0,w,h);g.globalCompositeOperation='source-over'};
const ascii=(src,c)=>{const g=c.getContext('2d'),w=c.width,h=c.height,cs=Math.max(8,Math.round(w/70)),d=src.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h).data,ch=' .:;=+*{}<>/01#',P=[];
  let lo=1,hi=0;for(let y=0;y<h;y+=cs)for(let x=0;x<w;x+=cs){const i=((Math.min(h-1,y+cs/2|0))*w+(Math.min(w-1,x+cs/2|0)))*4;if(d[i+3]<20)continue;const l=(d[i]*.3+d[i+1]*.59+d[i+2]*.11)/255;P.push([x,y,l]);lo=Math.min(lo,l);hi=Math.max(hi,l)}
  g.clearRect(0,0,w,h);g.fillStyle='#000';g.fillRect(0,0,w,h);g.font=`700 ${cs*1.15}px ui-monospace,Menlo,monospace`;g.textAlign='center';g.textBaseline='middle';
  for(const[x,y,l]of P){const n=(l-lo)/(hi-lo||1),k=Math.min(ch.length-1,n*ch.length|0);if(!k)continue;g.fillStyle=n>.72?'#fff':n>.4?'#b7a6ff':'#7c5cff';g.fillText(ch[k],x+cs/2,y+cs/2)}};
const build=()=>{const r=shot.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);PW=Math.round(r.width*d);PH=Math.round(r.height*d);if(!PW||!PH)return;
  for(const c of[pc,A,B,Mk,T]){c.width=PW;c.height=PH}img?cover(A,img):placeholder(A);ascii(A,B)};
new ResizeObserver(build).observe(shot);
new IntersectionObserver(e=>{heroOn=e[0].isIntersecting}).observe(hero);
if(PHOTO){const im=new Image();im.decoding='async';im.onload=()=>{img=im;build()};im.src=PHOTO}
const mg=Mk.getContext('2d'),tg=T.getContext('2d');
const brush=(x,y,r)=>{const g=mg.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.55,'rgba(0,0,0,.85)');g.addColorStop(1,'rgba(0,0,0,0)');mg.fillStyle=g;mg.beginPath();mg.arc(x,y,r,0,7);mg.fill()};
hero.addEventListener('pointermove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';
  const r=shot.getBoundingClientRect(),s=PW/r.width,x=(e.clientX-r.left)*s,y=(e.clientY-r.top)*s;if(x<-PW*.2||x>PW*1.2){pp=null;return}
  if(pp){const dx=x-pp[0],dy=y-pp[1],n=Math.ceil(Math.hypot(dx,dy)/(PW/60));for(let i=1;i<=n;i++)brush(pp[0]+dx*i/n,pp[1]+dy*i/n,PW*.11)}pp=[x,y];lastMove=performance.now()});
hero.addEventListener('pointerleave',()=>pp=null);
const canHover=matchMedia('(hover: hover)').matches;
hero.addEventListener('pointerdown',e=>{const r=shot.getBoundingClientRect(),s=PW/r.width;pp=null;brush((e.clientX-r.left)*s,(e.clientY-r.top)*s,PW*.13);lastMove=performance.now()});
let pt=0;
const pdraw=()=>{requestAnimationFrame(pdraw);if(!heroOn||!PW)return;
  mg.globalCompositeOperation='destination-out';mg.fillStyle='rgba(0,0,0,.035)';mg.fillRect(0,0,PW,PH);mg.globalCompositeOperation='source-over';
  if(performance.now()-lastMove>2400&&!reduce&&canHover){pt+=.018;brush(PW*(.5+.2*Math.sin(pt)),PH*(.45+.15*Math.sin(pt*1.3)),PW*.09)}
  px.clearRect(0,0,PW,PH);px.drawImage(A,0,0);
  tg.globalCompositeOperation='source-over';tg.clearRect(0,0,PW,PH);tg.drawImage(B,0,0);tg.globalCompositeOperation='destination-in';tg.drawImage(Mk,0,0);
  px.drawImage(T,0,0)};
requestAnimationFrame(pdraw);
if(hasG&&!reduce)gsap.to('.shot',{yPercent:12,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});

/* projetos: carrossel 3D */
const G='https://github.com/';
const GAL=[
 {p:'Merlin Route Finder',k:'phone',src:'img/merlin-1.webp',pt:'Tela inicial, antes de o cliente escanear uma placa',en:'Home screen, before the shopper scans a sign'},
 {p:'Merlin Route Finder',k:'phone',src:'img/merlin-2.webp',pt:'Busca com erro de digitação ("tinta acrilca") achando as tintas certas',en:'A typo in the search ("tinta acrilca") still finds the right paints'},
 {p:'Merlin Route Finder',k:'phone',src:'img/merlin-3.webp',pt:'Planta interativa da loja, com as placas de QR code',en:'Interactive store map with the QR code signs'},
 {p:'Merlin Route Finder',k:'phone',src:'img/merlin-4.webp',pt:'Assistente de IA respondendo com produtos e corredores do catálogo',en:'AI assistant answering with real catalog products and aisles'},
 {p:'Meus Direitos',v:'meus-direitos-pitch.mp4',src:'img/direitos-poster.webp',pt:'Vídeo pitch do projeto, com a minha narração',en:'Project pitch video, narrated by me'},
 {p:'Meus Direitos',k:'phone',src:'img/direitos-1.webp',pt:'Boas-vindas no celular',en:'Welcome screen on mobile'},
 {p:'Meus Direitos',k:'phone',src:'img/direitos-2.webp',pt:'Cadastro em quatro etapas',en:'Four-step sign-up'},
 {p:'Meus Direitos',k:'browser',src:'img/direitos-3.webp',pt:'Versão desktop, com o resumo do projeto ao lado',en:'Desktop version, with the project summary alongside'},
 {p:'Gestão OTIS',k:'browser',src:'img/otis-1.webp',pt:'Dashboard de KPIs: prazo, custo, qualidade e satisfação',en:'KPI dashboard: lead time, cost, quality and satisfaction'},
 {p:'Gestão OTIS',k:'browser',src:'img/otis-2.webp',pt:'Instalações por etapa, com filtros e status de prazo',en:'Installations by stage, with filters and deadline status'},
 {p:'Gestão OTIS',k:'browser',src:'img/otis-3.webp',pt:'Tela de login',en:'Login screen'},
 {p:'Feira Online',k:'browser',src:'img/feira-1.webp',pt:'Página inicial do marketplace',en:'Marketplace home page'},
 {p:'Feira Online',k:'browser',src:'img/feira-2.webp',pt:'Catálogo de produtos dos produtores',en:'Product catalog from local producers'}
];
const P=[
 {top:1,n:'Merlin Route Finder',y:'2026',c:'Smart Retail Challenge, Leroy Merlin + FIAP',prize:'2º lugar no NEXT FIAP 2026',en:{c:'Smart Retail Challenge, Leroy Merlin + FIAP',prize:'2nd place at NEXT FIAP 2026',d:'The shopper scans a QR code in the aisle and the app already knows where they are: it shows the way to the shelf and answers questions with AI.',f:['Typo-tolerant search using Oracle UTL_MATCH','Indoor store map with the route to each product','Gemini assistant with function calling, limited to real products and aisles','When a shelf is empty, it suggests in-stock substitutes and logs the stockout for the store'],r:'Architecture and back end: REST API in Java 21 with JAX-RS, OpenAPI 3.0 contract, centralized error handling and Gemini integration.',team:'5 people',ln:'The back end can take up to a minute to wake up on first access.'},
  d:'O cliente escaneia um QR code no corredor e o app já sabe onde ele está: mostra a rota até a prateleira e responde dúvidas com IA.',
  f:['Busca que tolera erro de digitação, com UTL_MATCH do Oracle','Mapa interno da loja com a rota até o produto','Assistente Gemini com function calling, limitado aos produtos e corredores reais','Quando falta produto, sugere substitutos em estoque e registra a ruptura pra loja'],
  r:'Arquitetura e back-end: API REST em Java 21 com JAX-RS, contrato OpenAPI 3.0, tratamento central de exceções e integração com o Gemini.',team:'5 pessoas',
  t:['Java 21','JAX-RS','Oracle 19c','OpenAPI','Gemini','React 19'],u:G+'JoaoRicardoSOC/merlin-route-finder',l:'https://merlin-route-finder.vercel.app/',cs:1,ln:'O back-end acorda em até um minuto no primeiro acesso.'},
 {top:1,n:'Meus Direitos',y:'2026/2',c:'Global Solution FIAP · ODS 10 e 11',en:{c:'Global Solution FIAP · SDGs 10 and 11',d:'An app that combines collaborative urban maintenance reports with plain-language guidance on social rights.',f:['Residents report neighborhood issues with location, ticket number and timeline','The community backs reports, and three residents confirm when an issue is fixed','A consent-based (LGPD) questionnaire points to rights and official channels such as Gov.br and CRAS','City dashboard with numbers by neighborhood and CSV export'],r:'Back end: REST API in Java 17 organized into resource, service and DAO layers, with Oracle via JDBC.',team:'5 people'},
  d:'App que junta zeladoria urbana colaborativa com orientação sobre direitos sociais, em linguagem simples.',
  f:['Moradores registram problemas do bairro com localização, protocolo e linha do tempo','A comunidade apoia denúncias e três moradores confirmam a resolução','Questionário com consentimento LGPD indica direitos e canais oficiais, como Gov.br e CRAS','Painel da cidade com números por bairro e exportação em CSV'],
  r:'Back-end: API REST em Java 17 organizada em resource, service e DAO, com Oracle via JDBC.',team:'5 pessoas',
  t:['Java 17','JAX-RS','Oracle','JUnit 5','GitHub Actions','React 19'],u:G+'JoaoRicardoSOC/meus-direitos',l:'https://meus-direitos-kohl.vercel.app/'},
 {top:1,n:'Yvy',y:'2026/1',c:'Global Solution FIAP · ODS 2 e 13',r:'Back-end em Java: regras de análise preditiva e de rendimento das culturas, e scripts do banco Oracle.',en:{c:'Global Solution FIAP · SDGs 2 and 13',d:'Combines agronomic data with satellite weather data to recommend the planting window with the lowest risk of drought or excess rain.',f:['Predictive engine that simulates consuming the NASA POWER API','Java back end with Clean Architecture, DDD and SOLID','Mobile-first React interface built for people in the field','Normalized relational model, documented with UML and wireframes'],r:'Java back end: predictive analysis and crop yield rules, plus the Oracle database scripts.'},
  d:'Cruza dados agronômicos com clima orbital pra recomendar a janela de plantio com menos risco de seca ou de chuva em excesso.',
  f:['Motor preditivo que simula o consumo da NASA POWER API','Back-end em Java com Clean Architecture, DDD e SOLID','Interface React mobile first, pensada pra quem está no campo','Modelo relacional normalizado, com UML e wireframes documentados'],
  t:['Java','React','Vite','Oracle SQL','Figma'],u:G+'JoaoRicardoSOC/Yvy'},
 {n:'Aurum',y:'2026',c:'Projeto acadêmico FIAP',en:{c:'FIAP academic project',d:'Cryptocurrency platform with financial education modules and portfolio management.',r:'I refactored the Java domain entities, normalized the database, built the course modules, and wrote, reviewed and assigned the unit tests.'},
  d:'Plataforma de criptomoedas com módulos de educação financeira e gestão de portfólio.',
  r:'Refatorei as entidades de domínio em Java, normalizei o banco, criei os módulos de cursos e escrevi, revisei e distribuí os testes unitários.',
  t:['Java','POO','JUnit','SQL'],u:G+'JoaoRicardoSOC/aurum-banking'},
 {n:'Ready2Work',y:'2025',c:'Projeto acadêmico FIAP',en:{c:'FIAP academic project',d:'Internal reskilling: instead of laying people off, the company moves the right people into the right roles.',f:['Profiles with hard and soft skills, current role and career goal','Python recommendation engine that scores fit with open roles and suggests courses','Gamified dashboard with points, badges and an internal ranking'],r:'Interface concept and layout.',team:'5 people'},
  d:'Requalificação interna: em vez de demitir, a empresa recoloca as pessoas certas nas vagas certas.',
  f:['Cadastro de hard e soft skills, cargo atual e objetivo de carreira','Motor de recomendação em Python que mede o encaixe com vagas e sugere cursos','Dashboard com gamificação: pontos, badges e ranking interno'],
  r:'Conceito e layout da interface.',team:'5 pessoas',
  t:['React','Tailwind','Chart.js','Python','FastAPI','Pandas'],u:G+'edubielecky/ready2work'},
 {n:'Gestão OTIS',y:'2025',c:'Desafio com a OTIS Elevadores',en:{c:'Challenge with OTIS Elevators',d:'Digitizes the path from a signed contract to an installed elevator, with every department in one system.',f:['Contract, dispatch and installation management','Internal chat and notice board across departments','KPI dashboard and reports forecasting delays and costs'],r:'Front end and responsive design.',team:'5 people'},
  d:'Digitaliza o caminho do contrato fechado até o elevador instalado, com todos os setores no mesmo sistema.',
  f:['Gestão de contratos, expedição e instalação','Chat interno e mural de avisos entre setores','Dashboard de KPIs e relatórios com previsão de atrasos e custos'],
  r:'Front-end e design responsivo.',team:'5 pessoas',
  t:['React','Vite','Bootstrap','Chart.js'],u:G+'JoaoRicardoSOC/Sistema-OTIS',l:'https://sistema-otis-puce.vercel.app/login'},
 {n:'Feira Online',y:'2025',c:'Projeto acadêmico FIAP',
  d:'Marketplace que liga pequenos produtores agrícolas a consumidores, fortalece a economia local e reduz o desperdício de alimentos.',
  r:'Design da interface no Figma e desenvolvimento front-end.',en:{c:'FIAP academic project',d:'Marketplace that connects small farmers with consumers, strengthening the local economy and reducing food waste.',r:'Interface design in Figma and front-end development.'},
  t:['Figma','React','Vite','Bootstrap','JavaScript'],u:G+'JoaoRicardoSOC/FEIRA-ONLINE',l:'https://feira-online-liart.vercel.app/'}
];
const STEP=24,ring=document.getElementById('ring'),stage=document.getElementById('stage'),info=document.getElementById('pinfo'),cnt=document.getElementById('cnt'),tk=document.getElementById('tk'),oth=document.getElementById('others');
const small=matchMedia('(max-width: 860px)');
let PL=P,N=P.length,names=[],rot=0,target=0,act=-1,R=0,pinST=null;
const clamp=i=>Math.max(0,Math.min(N-1,i));
const radius=()=>{if(!names[0])return;const h=names[0].offsetHeight*.92;R=h/(2*Math.tan(STEP*Math.PI/360))};
/* no celular, o tambor mostra só os destaques; o resto vira lista */
const buildDrum=()=>{PL=small.matches?P.filter(p=>p.top):P;N=PL.length;
  ring.innerHTML=PL.map((p,i)=>`<button class="nm" data-i="${i}">${p.n}<sup>${p.y}</sup></button>`).join('');
  names=[...ring.children];rot=target=0;act=-1;radius();
  oth.innerHTML=small.matches?`<h3>${t('others')}</h3><ul>${P.filter(p=>!p.top).map(p=>`<li><div><b>${p.n}</b><span>${p.y} · ${LP(p,'d')}</span></div><p><a href="${p.u}">${t('orepo')}</a>${p.l?`<a href="${p.l}">${t('olive')}</a>`:''}</p></li>`).join('')}</ul>`:''};
buildDrum();small.addEventListener('change',()=>{buildDrum();if(window.ScrollTrigger)ScrollTrigger.refresh()});
new ResizeObserver(radius).observe(stage);
const showInfo=i=>{const p=PL[i];
  const rows=[p.r&&[t('role'),LP(p,'r')],['Stack',p.t.join(' · ')]].filter(Boolean);const meta=[LP(p,'c'),p.y,LP(p,'team')].filter(Boolean).join(' · ');const ng=GAL.filter(g=>g.p===p.n).length;
  const parts=[p.prize&&`<p class="prize">${LP(p,'prize')}</p>`,`<p class="meta">${meta}</p>`,`<p class="lead">${LP(p,'d')}</p>`,p.f&&`<ul class="feat">${LP(p,'f').map(x=>`<li>${x}</li>`).join('')}</ul>`,`<dl class="spec">${rows.map(r=>`<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')}</dl>`,
    `<div class="links2">${p.cs?`<a class="gh cs" href="${t('csf')}">${t('cs')} <span>→</span></a>`:''}<a class="gh" href="${p.u}">${t('repo')} <span>↗</span></a>${p.l?`<a class="gh" href="${p.l}">${t('live')} <span>↗</span></a>`:`<span class="nodemo">${t('nodemo')}</span>`}${ng?`<button class="shots" data-p="${p.n}">${t('shots')} (${ng}) <span>⤢</span></button>`:''}</div>${p.ln?`<p class="lnote">${LP(p,'ln')}</p>`:''}`].filter(Boolean);
  info.innerHTML=parts.map((h,k)=>`<div class="rv" style="animation-delay:${k*70}ms">${h}</div>`).join('');cnt.textContent=`${i+1} ${t('of')} ${N}`};
const render=()=>{requestAnimationFrame(render);
  rot+=(target-rot)*(reduce?1:.09);
  names.forEach((c,i)=>{const a=(i-rot)*STEP;if(Math.abs(a)>88){c.style.visibility='hidden';return}
    const k=Math.cos(a*Math.PI/180);c.style.visibility='visible';
    c.style.transform=`translateZ(${-R}px) rotateX(${-a}deg) translateZ(${R}px) translateY(-50%)`;c.style.opacity=(.12+.88*k**3).toFixed(3)});
  const pr=N>1?rot/(N-1):0;tk.style.top=`calc(${pr*100}% - ${pr*28}px)`;
  const a=clamp(Math.round(rot));if(a!==act){act=a;names.forEach((c,i)=>{c.classList.toggle('act',i===a);c.setAttribute('aria-current',i===a)});showInfo(a)}};
requestAnimationFrame(render);
/* gira com a rolagem em telas grandes e altas; setas, clique e arrasto em qualquer tela */
const go=i=>{i=clamp(i);if(pinST)goTo(pinST.start+(pinST.end-pinST.start)*i/(N-1));else target=i};
document.getElementById('prev').onclick=()=>go(Math.round(target)-1);
document.getElementById('next').onclick=()=>go(Math.round(target)+1);
ring.addEventListener('click',e=>{const c=e.target.closest('.nm');if(!c||dragged)return;go(+c.dataset.i)});
document.getElementById('projetos').addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();go(Math.round(target)+1)}if(e.key==='ArrowUp'){e.preventDefault();go(Math.round(target)-1)}});
let dx0=null,t0=0,dragged=false;
stage.addEventListener('pointerdown',e=>{if(pinST)return;dx0=e.clientX;t0=target;dragged=false});
addEventListener('pointermove',e=>{if(dx0===null)return;const d=e.clientX-dx0;if(Math.abs(d)>6)dragged=true;target=Math.max(-.4,Math.min(N-.6,t0-d/90))});
addEventListener('pointerup',()=>{if(dx0===null)return;dx0=null;target=clamp(Math.round(target));setTimeout(()=>dragged=false,0)});
const sec=document.getElementById('projetos'),hint=document.getElementById('phint');
const setHint=()=>{hint.textContent=pinST?t('hpin'):small.matches?t('hsm'):t('hdesk')};
if(hasG&&!reduce){
  const mm=gsap.matchMedia();
  mm.add('(min-width: 861px) and (min-height: 821px)',()=>{
    sec.classList.add('pinned');
    pinST=ScrollTrigger.create({trigger:sec,start:'top top',end:()=>'+='+innerHeight*.5*(N-1),pin:true,scrub:true,
      snap:{snapTo:1/(N-1),duration:{min:.2,max:.5},ease:'power2.inOut'},onUpdate:s=>{target=s.progress*(N-1)}});
    setHint();
    return()=>{pinST.kill();pinST=null;sec.classList.remove('pinned');setHint()}});
}
setHint();small.addEventListener('change',setHint);

/* galeria */
const grail=document.getElementById('grail');
const grp={'Merlin Route Finder':{pt:'Celular, 2026',en:'Mobile, 2026'},'Meus Direitos':{pt:'Celular e vídeo, 2026',en:'Mobile and video, 2026'},'Gestão OTIS':{pt:'Desktop, 2025',en:'Desktop, 2025'},'Feira Online':{pt:'Desktop, 2025',en:'Desktop, 2025'}};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const renderGal=()=>{let last='',h='';
  GAL.forEach((g,i)=>{if(g.p!==last){last=g.p;h+=`<div class="gsep"><b>${g.p}</b><span>${grp[g.p][LANG]}</span></div>`}
    const cap=esc(g[LANG]);
    h+=`<button class="gi" data-i="${i}" aria-label="${cap}">${g.v?`<span class="video"><img src="${g.src}" alt="" loading="lazy" decoding="async"></span>`:g.k==='phone'?`<span class="phone"><img src="${g.src}" alt="" loading="lazy" decoding="async"></span>`:`<span class="browser"><i></i><img src="${g.src}" alt="" loading="lazy" decoding="async"></span>`}<figcaption>${cap}</figcaption></button>`});
  grail.innerHTML=h};
renderGal();
const gstep=d=>grail.scrollBy({left:d*grail.clientWidth*.7,behavior:reduce?'auto':'smooth'});
document.getElementById('gprev').onclick=()=>gstep(-1);document.getElementById('gnext').onclick=()=>gstep(1);
grail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();gstep(1)}if(e.key==='ArrowLeft'){e.preventDefault();gstep(-1)}});
/* lightbox */
const lb=document.getElementById('lb'),lbs=document.getElementById('lbstage'),lbc=document.getElementById('lbcap'),lbp=document.getElementById('lbpos');let li=0,lfrom=null;
const showLb=i=>{li=(i+GAL.length)%GAL.length;const g=GAL[li];
  lbs.innerHTML=g.v?`<video src="${g.v}" poster="${g.src}" controls playsinline preload="none"></video>`:`<img src="${g.src}" alt="${esc(g[LANG])}">`;
  lbc.textContent=`${g.p} — ${g[LANG]}`;lbp.textContent=`${li+1} / ${GAL.length}`};
const openLb=(i,from)=>{lfrom=from||document.activeElement;showLb(i);lb.hidden=false;lenis&&lenis.stop();document.getElementById('lbx').focus()};
const closeLb=()=>{const v=lbs.querySelector('video');v&&v.pause();lb.hidden=true;lbs.innerHTML='';lenis&&lenis.start();lfrom&&lfrom.focus()};
grail.addEventListener('click',e=>{const b=e.target.closest('.gi');if(b)openLb(+b.dataset.i,b)});
info.addEventListener('click',e=>{const b=e.target.closest('.shots');if(b)openLb(GAL.findIndex(g=>g.p===b.dataset.p),b)});
document.getElementById('lbx').onclick=closeLb;document.getElementById('lbp').onclick=()=>showLb(li-1);document.getElementById('lbn').onclick=()=>showLb(li+1);
lb.addEventListener('click',e=>{if(e.target===lb||e.target===lbs)closeLb()});
addEventListener('keydown',e=>{if(lb.hidden)return;trapTab(e,lb);if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')showLb(li+1);if(e.key==='ArrowLeft')showLb(li-1)});

/* troca de idioma */
const langBtn=document.getElementById('lang');
const applyLang=first=>{const keep=first&&LANG==='pt';document.querySelectorAll('[data-en]').forEach(el=>{if(el.dataset.pt===undefined)el.dataset.pt=el.id==='mtxt'?el.textContent:el.innerHTML;if(!keep)el.innerHTML=LANG==='en'?el.dataset.en:el.dataset.pt});
  document.documentElement.lang=LANG==='en'?'en':'pt-BR';document.title=t('title');
  langBtn.textContent=t('lang');langBtn.setAttribute('aria-label',t('langl'));
  const mb=document.getElementById('mbtn');mb.textContent=document.getElementById('mnav').hidden?t('menu'):t('close');
  if(!first||LANG==='en'){splitMani();act=-1;buildDrum();setHint();renderGal();if(window.ScrollTrigger)ScrollTrigger.refresh()}};
langBtn.onclick=()=>{LANG=LANG==='en'?'pt':'en';try{localStorage.setItem('lang',LANG)}catch(e){}applyLang()};
applyLang(true);
}

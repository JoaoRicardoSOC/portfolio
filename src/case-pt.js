import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
// Os scripts de CDN do protótipo expunham estes globais; o código portado os usa como estão.
gsap.registerPlugin(ScrollTrigger);
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.Lenis = Lenis;

{
document.getElementById('lang').addEventListener('click',()=>{try{localStorage.setItem('lang','en')}catch(e){}});
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG=!!window.gsap&&!!window.ScrollTrigger;
let lenis=null;
if(hasG)gsap.registerPlugin(ScrollTrigger);
if(window.Lenis&&!reduce){lenis=new Lenis({lerp:.09});
  if(hasG){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
  else{const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();const y=t.getBoundingClientRect().top+scrollY-70;lenis?lenis.scrollTo(y):scrollTo({top:y,behavior:reduce?'auto':'smooth'})});
/* entrada do título */
if(hasG&&!reduce)gsap.from('h1 i',{yPercent:105,duration:1.1,ease:'expo.out',stagger:.1,delay:.1});
/* progresso de leitura */
const prog=document.getElementById('prog');
const upd=()=>{const h=document.documentElement.scrollHeight-innerHeight;prog.style.transform=`scaleX(${h>0?scrollY/h:0})`};
addEventListener('scroll',upd,{passive:true});upd();
/* índice marca a seção atual */
const links=[...document.querySelectorAll('#toc a')];
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}})},{rootMargin:'-40% 0px -55% 0px'});
document.querySelectorAll('main section[id]').forEach(s=>io.observe(s));
/* barras crescem quando aparecem */
const bars=document.getElementById('bars');
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){bars.classList.remove('pre');o.disconnect()}},{threshold:.4}).observe(bars);
}

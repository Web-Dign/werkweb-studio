// Demo configuration: keep blank until a real inbox is authorized for enquiries.
const CONFIG = { inquiryEmail: '' };
const menuBtn=document.getElementById('menuBtn');const menu=document.getElementById('menu');
menuBtn?.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false');}));
document.getElementById('year').textContent=new Date().getFullYear();
const form=document.getElementById('contactForm');const result=document.getElementById('formResult');
form?.addEventListener('submit',e=>{e.preventDefault();result.classList.remove('error');if(!form.reportValidity()){result.textContent='Bitte alle Pflichtfelder korrekt ausfüllen.';result.classList.add('error');return;}if(!CONFIG.inquiryEmail){result.textContent='Demo-Modus: Es ist noch keine Empfängeradresse konfiguriert. Es wurden keine Daten versendet. Bitte richte vor dem Live-Betrieb eine geschäftliche E-Mail-Adresse ein.';return;}const val=id=>document.getElementById(id).value.trim();const body=`Betrieb: ${val('company')}\nKontakt: ${val('person')}\nE-Mail: ${val('email')}\nGewerk: ${val('trade')}\n\nProjektbeschreibung:\n${val('message')}`;const url=`mailto:${encodeURIComponent(CONFIG.inquiryEmail)}?subject=${encodeURIComponent('Website-Anfrage: '+val('company'))}&body=${encodeURIComponent(body)}`;window.location.href=url;result.textContent='Dein E-Mail-Programm sollte sich jetzt mit einem Entwurf öffnen. Der Versand erfolgt erst dort.';});

// Accessible, dependency-free design slider (no autoplay; respects user control).
(()=>{const slides=[...document.querySelectorAll('.design-slide')];if(!slides.length)return;
const names=['VOLTWERK — Bold & technisch','WASSERWERK — Klar & ruhig','DACHKANTE — Robust & hochwertig','FARBRAUM — Kreativ & elegant'];
const descriptions=['Kontraststarkes Design für einen Elektrofachbetrieb.','Helle, vertrauensvolle Optik für Sanitär und Heizung.','Markantes Design für einen Dachdeckerbetrieb.','Warme, kreative Gestaltung für einen Malerbetrieb.'];
const dots=[...document.querySelectorAll('[data-design]')];let active=0;
function show(index){active=(index+slides.length)%slides.length;slides.forEach((el,i)=>{el.hidden=i!==active;el.setAttribute('aria-hidden',String(i!==active));el.classList.toggle('is-active',i===active)});dots.forEach((el,i)=>{el.classList.toggle('is-active',i===active);if(i===active)el.setAttribute('aria-current','true');else el.removeAttribute('aria-current')});document.getElementById('slideCount').textContent=String(active+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');document.getElementById('designName').textContent=names[active];document.getElementById('designDesc').textContent=descriptions[active]}
document.getElementById('prevDesign').addEventListener('click',()=>show(active-1));document.getElementById('nextDesign').addEventListener('click',()=>show(active+1));dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i)));
const slider=document.getElementById('designSlider');slider.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){if(e.target.closest('button'))return;e.preventDefault();show(active+(e.key==='ArrowRight'?1:-1))}});
let startX=null;slider.addEventListener('touchstart',e=>{startX=e.changedTouches[0].screenX},{passive:true});slider.addEventListener('touchend',e=>{if(startX===null)return;const delta=e.changedTouches[0].screenX-startX;if(Math.abs(delta)>60)show(active+(delta<0?1:-1));startX=null},{passive:true});
})();

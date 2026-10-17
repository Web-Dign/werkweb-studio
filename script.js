const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

document.getElementById('year').textContent = new Date().getFullYear();

const slides = Array.from(document.querySelectorAll('.design-slide'));
const dotsWrap = document.getElementById('sliderDots');
const designCounter = document.getElementById('designCounter');
const nameEl = document.getElementById('designName');
const subtitleEl = document.getElementById('designSubtitle');
const descEl = document.getElementById('designDescription');
let current = 0;

function renderDots() {
  slides.forEach((_, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Design ${index + 1} auswählen`);
    btn.addEventListener('click', () => showSlide(index));
    dotsWrap.appendChild(btn);
  });
}

function showSlide(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => { slide.classList.toggle('active', i === current); slide.setAttribute('aria-hidden', String(i !== current)); });
  Array.from(dotsWrap.children).forEach((dot, i) => dot.classList.toggle('active', i === current));
  const active = slides[current];
  designCounter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  nameEl.textContent = active.dataset.name;
  subtitleEl.textContent = active.dataset.subtitle;
  descEl.textContent = active.dataset.description;
}

if (slides.length && dotsWrap) {
  renderDots();
  showSlide(0);
  document.getElementById('prevBtn').addEventListener('click', () => showSlide(current - 1));
  document.getElementById('nextBtn').addEventListener('click', () => showSlide(current + 1));
  const slider = document.getElementById('designSlider');
  let startX = 0;
  slider.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive: true});
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) showSlide(current + (dx < 0 ? 1 : -1));
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, {threshold: .14});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const metricObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(el => {
      const target = Number(el.dataset.count);
      let value = 0;
      const step = Math.max(1, Math.round(target / 36));
      const timer = setInterval(() => {
        value += step;
        if (value >= target) {
          value = target;
          clearInterval(timer);
        }
        el.textContent = value;
      }, 24);
    });
    metricObserver.unobserve(entry.target);
  });
}, {threshold: .4});
const metrics = document.querySelector('.metrics');
if (metrics) metricObserver.observe(metrics);

const form = document.getElementById('contactForm');
const output = document.getElementById('formOutput');
if (form && output) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      output.textContent = 'Bitte fülle alle Pflichtfelder korrekt aus.';
      return;
    }
    const company = document.getElementById('company').value.trim();
    const trade = document.getElementById('trade').value;
    const style = document.getElementById('style').value;
    output.textContent = `Demo erfolgreich: Für ${company} (${trade}) wurde eine Beispiel-Anfrage mit Stil "${style}" vorbereitet. Noch kein Versand oder Speichern.`;
    form.reset();
  });
}

// V4 accessible comparison control
const comparisonRange = document.getElementById('comparisonRange');
const comparison = document.getElementById('comparison');
if (comparisonRange && comparison) {
  const updateComparison = () => comparison.style.setProperty('--cut', `${comparisonRange.value}%`);
  comparisonRange.addEventListener('input', updateComparison);
  updateComparison();
}
// Keyboard navigation for design carousel
const carousel = document.querySelector('.slider-shell');
if (carousel && slides.length) {
  carousel.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea,select')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); showSlide(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); showSlide(current - 1); }
  });
}

let currentSlide = 0;
const totalSlides = 7;
const track = document.getElementById('slidesTrack');
const counterCurrent = document.getElementById('counterCurrent');
const dots = document.querySelectorAll('.dot');
const labels = document.querySelectorAll('.slide-label');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const viewport = document.getElementById('viewport');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxSection = document.getElementById('lightboxSection');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxClose = document.getElementById('lightboxClose');

// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 800);
});

// ── GO TO SLIDE ──
function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  currentSlide = index;
  const offset = -(currentSlide * (100 / totalSlides));
  track.style.transform = `translateX(${offset}%)`;
  counterCurrent.textContent = String(currentSlide + 1).padStart(2, '0');
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  labels.forEach((l, i) => l.classList.toggle('active', i === currentSlide));
  btnPrev.classList.toggle('disabled', currentSlide === 0);
  btnNext.classList.toggle('disabled', currentSlide === totalSlides - 1);

  // Re-trigger routine animations
  if (currentSlide === 2) {
    document.querySelectorAll('.routine-step').forEach(s => {
      s.style.animation = 'none';
      s.offsetHeight;
      s.style.animation = '';
    });
  }
}

// ── BUTTON NAV ──
btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
btnNext.addEventListener('click', () => goToSlide(currentSlide + 1));

// ── DOTS NAV ──
dots.forEach(dot => {
  dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.slide)));
});

// ── LABELS NAV ──
labels.forEach(label => {
  label.addEventListener('click', () => goToSlide(parseInt(label.dataset.slide)));
});

// ── KEYBOARD NAV ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    goToSlide(currentSlide + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    goToSlide(currentSlide - 1);
  } else if (e.key === 'Escape') {
    closeLightbox();
  }
});

// ── TOUCH / SWIPE ──
let touchStartX = 0;
let touchStartY = 0;
viewport.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });
viewport.addEventListener('touchend', (e) => {
  const diffX = touchStartX - e.changedTouches[0].screenX;
  const diffY = touchStartY - e.changedTouches[0].screenY;
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX > 0) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
  }
}, { passive: true });

// ── MOUSE DRAG ──
let isDragging = false;
let dragStartX = 0;
let dragOffset = 0;
viewport.addEventListener('mousedown', (e) => {
  if (e.target.closest('.nav-arrow, .dot, .slide-label, .about-card, .hobby-card, .gallery-item, .family-item, .family-wide, .weekly-card, .routine-step-content, .lightbox')) return;
  isDragging = true;
  dragStartX = e.clientX;
  track.classList.add('dragging');
  viewport.style.cursor = 'grabbing';
});
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  dragOffset = e.clientX - dragStartX;
  const baseOffset = -(currentSlide * viewport.offsetWidth);
  track.style.transform = `translateX(${baseOffset + dragOffset}px)`;
});
document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  track.classList.remove('dragging');
  viewport.style.cursor = '';
  if (dragOffset < -80) goToSlide(currentSlide + 1);
  else if (dragOffset > 80) goToSlide(currentSlide - 1);
  else goToSlide(currentSlide);
  dragOffset = 0;
});

// ── LIGHTBOX ──
function openLightbox(item) {
  const src = item.dataset.src;
  if (!src) return;
  lightboxImg.src = src;
  lightboxSection.textContent = item.dataset.section || '';
  lightboxTitle.textContent = item.dataset.title || '';
  lightboxDesc.textContent = item.dataset.desc || '';
  lightbox.classList.add('open');
}

function closeLightbox() {
  lightbox.classList.remove('open');
}

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => openLightbox(item));
});

lightboxClose.addEventListener('click', (e) => {
  e.stopPropagation();
  closeLightbox();
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ── MOUSE WHEEL ──
let wheelTimeout = false;
viewport.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (wheelTimeout) return;
  wheelTimeout = true;
  if (e.deltaY > 30 || e.deltaX > 30) goToSlide(currentSlide + 1);
  else if (e.deltaY < -30 || e.deltaX < -30) goToSlide(currentSlide - 1);
  setTimeout(() => { wheelTimeout = false; }, 800);
}, { passive: false });

// ── INIT ──
goToSlide(0);
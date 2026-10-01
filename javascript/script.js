
/* ============================================
   16. HOOK TEXT WIDTH MEASUREMENT (FIXED)
   [Op 1] document.fonts.ready ensures custom
          fonts (Poppins/Inter) have FULLY loaded
          before we measure text width — prevents
          measuring against fallback-font metrics.
   [Op 2] Adds a small +4px buffer per measurement,
          as insurance against sub-pixel rounding
          differences between measurement and render.
   ============================================ */
document.fonts.ready.then(() => {
  document.querySelectorAll('.hook-wrap-l1, .hook-wrap-moving, .hook-wrap-l2b').forEach(wrap => {
    const textEl = wrap.querySelector('.hook-text');
    const naturalWidth = textEl.offsetWidth;
    wrap.style.setProperty('--target-width', (naturalWidth + 4) + 'px');
  });
});

/* ============================================
IMAGES PLACE :

/* ============================================
/* ============================================
   17. SLIDE-TRANSITION SLIDESHOW
   [Op 1] Simple auto-advance, no dots/hover-pause,
          per your request.
   [Op 2] New image slides in from the left while
          the old one slides out to the right,
          simultaneously.
   ============================================ */
const slideImgs = document.querySelectorAll('.slide-img');
let currentSlide = 0;

function advanceSlide() {
  const current = slideImgs[currentSlide];
  const nextIndex = (currentSlide + 1) % slideImgs.length;
  const next = slideImgs[nextIndex];

  // Step 1: position the incoming image off-screen LEFT instantly (no transition)
  next.classList.add('incoming');

  // Step 2: force the browser to acknowledge that position before animating
  // (reading offsetWidth forces a "reflow" — a technical necessity for the
  // instant jump above to register before we animate away from it)
  void next.offsetWidth;

  // Step 3: outgoing image slides right, incoming image slides to center — together
  current.classList.remove('active');
  current.classList.add('exit');

  next.classList.remove('incoming');
  next.classList.add('active');

  // Step 4: reset the old "current" image's classes after its transition finishes,
  // so it's ready to be reused as a future incoming slide
  setTimeout(() => {
    current.classList.remove('exit');
  }, 800); // matches the 0.8s CSS transition duration

  currentSlide = nextIndex;
}

setInterval(advanceSlide, 3500);
/* ============================================
   18. MOBILE NAV TOGGLE
   [Op 1] Button click toggles nav.open, which
          the CSS (@media max-width:700px) uses
          to show/hide the menu.
   [Op 2] Menu auto-closes after a link is
          tapped, so it doesn't stay open when
          the new page loads.
   ============================================ */
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================
   20. PROJECT CASE-STUDY IMAGE SLIDER
   [Op 1] Multi-instance: every .project-slider
          on the page runs independently (unlike
          section 17's single global slideshow).
   [Op 2] Works from prev/next arrows and the
          dot buttons; no auto-advance.
   ============================================ */
document.querySelectorAll('.project-slider').forEach(slider => {
  const imgs = slider.querySelectorAll('.project-slider__img');
  const dots = slider.querySelectorAll('.project-slider__dot');
  const prevBtn = slider.querySelector('.project-slider__arrow--prev');
  const nextBtn = slider.querySelector('.project-slider__arrow--next');
  let index = 0;

  function show(i) {
    imgs.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    index = (i + imgs.length) % imgs.length;
    imgs[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => show(index - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => show(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));

  show(0);
});

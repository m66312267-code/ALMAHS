/* ═══════════════════════════════════════════════════════════
   MOBILE-ANIMATIONS.JS — نظيف وخفيف
   ═══════════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────────
// SCROLL REVEAL
// ──────────────────────────────────────────────────────────

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // مرة واحدة بس
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ──────────────────────────────────────────────────────────
// RIPPLE EFFECT
// ──────────────────────────────────────────────────────────

function createRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple-el';
  ripple.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
  `;

  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// ──────────────────────────────────────────────────────────
// COUNTER ANIMATION للـ stats
// ──────────────────────────────────────────────────────────

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.textContent.includes('+') ? '+' : '';
  const duration = 1400;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, step);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ──────────────────────────────────────────────────────────
// NAVBAR SCROLL
// ──────────────────────────────────────────────────────────

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ──────────────────────────────────────────────────────────
// HAMBURGER MENU
// ──────────────────────────────────────────────────────────

function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    links.classList.toggle('open');
  });

  // إغلاق لما تضغط على لينك
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      links.classList.remove('open');
    });
  });
}

// ──────────────────────────────────────────────────────────
// BACK TO TOP
// ──────────────────────────────────────────────────────────

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 400 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ──────────────────────────────────────────────────────────
// TOUCH FEEDBACK خفيف
// ──────────────────────────────────────────────────────────

function initTouchFeedback() {
  if (!('ontouchstart' in window)) return;

  document.documentElement.classList.add('touch-device');

  document.querySelectorAll('.card, .project-card, .testimonial-card, .blog-card').forEach(el => {
    el.addEventListener('touchstart', function () {
      this.style.transition = 'opacity 0.12s ease';
      this.style.opacity = '0.88';
    }, { passive: true });

    el.addEventListener('touchend', function () {
      this.style.opacity = '';
    }, { passive: true });
  });
}

// ──────────────────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initNavbar();
  initHamburger();
  initBackToTop();
  initTouchFeedback();

  // Ripple على الأزرار
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', createRipple);
  });
});

// Reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

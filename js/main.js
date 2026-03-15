/* ═══════════════════════════════
   محمد فهمي | Portfolio JS
   ═══════════════════════════════ */

/* ── Nav scroll effect ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.background =
    window.scrollY > 60 ? 'rgba(10,10,15,.97)' : 'rgba(10,10,15,.85)';
});

/* ── Hamburger menu ── */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () =>
    document.getElementById('navLinks').classList.remove('open')
  )
);

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Counter Animation ── */
function animateCounter(el) {
  const target = +el.dataset.target;
  const step   = target / (1800 / 16);
  let current  = 0;
  const timer  = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + '+';
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* ── Contact Form (EmailJS) ── */
async function sendMsg(e) {
  e.preventDefault();

  const btn       = document.getElementById('sendBtn');
  const successEl = document.getElementById('successMsg');
  const errorEl   = document.getElementById('errorMsg');

  successEl.style.display = 'none';
  errorEl.style.display   = 'none';

  btn.innerHTML = '<span>جارٍ الإرسال...</span>';
  btn.disabled  = true;

  const templateParams = {
    from_name:  document.getElementById('from_name').value,
    from_email: document.getElementById('from_email').value,
    subject:    document.getElementById('subject').value,
    message:    document.getElementById('message').value,
    to_name:    'محمد فهمي',
  };

  try {
    // ⬇️ استبدل القيم دي بالقيم من لوحة EmailJS
    await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
    e.target.reset();
    successEl.style.display = 'block';
  } catch (err) {
    console.error('EmailJS error:', err);
    errorEl.style.display = 'block';
  } finally {
    btn.innerHTML = '<span>إرسال الرسالة</span><span>✦</span>';
    btn.disabled  = false;
    setTimeout(() => {
      successEl.style.display = 'none';
      errorEl.style.display   = 'none';
    }, 6000);
  }
}

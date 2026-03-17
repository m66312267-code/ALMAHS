/* ═══════════════════════════════════════════════════════════
   محمد فهمي | Portfolio JS - Improved Version
   ═══════════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ──────────────────────────────────────────────────────────

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ──────────────────────────────────────────────────────────
// SPLASH SCREEN / LOADER
// ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  
  // Setup form validation
  setupFormValidation();
  
  // Hide splash after 2 seconds
  setTimeout(() => {
    loader.classList.add('hide');
  }, 2000);
});

// ──────────────────────────────────────────────────────────
// NAVIGATION - SCROLL EFFECT
// ──────────────────────────────────────────────────────────

const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

const handleScroll = throttle(() => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, 100);

window.addEventListener('scroll', handleScroll);

// ──────────────────────────────────────────────────────────
// HAMBURGER MENU
// ──────────────────────────────────────────────────────────

function toggleMenu() {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
}

hamburger.addEventListener('click', toggleMenu);

// Close menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.navbar')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
});

// ──────────────────────────────────────────────────────────
// SCROLL REVEAL ANIMATION
// ──────────────────────────────────────────────────────────

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger animation
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      
      // Stop observing this element
      revealObserver.unobserve(entry.target);
    }
  });
}, { 
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ──────────────────────────────────────────────────────────
// COUNTER ANIMATION
// ──────────────────────────────────────────────────────────

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  
  // If target is invalid, skip
  if (isNaN(target)) return;
  
  const duration = 1800; // milliseconds
  const frameRate = 16;
  const step = target / (duration / frameRate);
  let current = 0;
  
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    const displayValue = Math.floor(current);
    
    // Only update if value changed
    if (parseInt(el.textContent) !== displayValue) {
      el.textContent = displayValue + '+';
    }
    
    if (current >= target) {
      clearInterval(timer);
      el.textContent = target + '+';
    }
  }, frameRate);
}

// Observe counter elements
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      animateCounter(entry.target);
      entry.target.dataset.animated = 'true';
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
  counterObserver.observe(el);
});

// ──────────────────────────────────────────────────────────
// CONTACT FORM VALIDATION & SUBMISSION
// ──────────────────────────────────────────────────────────

const contactForm = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const successMsg = document.getElementById('successMsg');
const errorMsg = document.getElementById('errorMsg');

/**
 * Email validation regex
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Real-time form validation
 */
function setupFormValidation() {
  const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
  
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const formGroup = input.closest('.form-group');
      if (input.value.trim()) {
        formGroup.classList.remove('error');
      }
    });
    
    input.addEventListener('blur', () => {
      validateField(input);
    });
  });
}

/**
 * Validate individual field
 */
function validateField(field) {
  const formGroup = field.closest('.form-group');
  const value = field.value.trim();
  let isValid = true;
  
  if (field.id === 'from_name') {
    isValid = value.length >= 3;
  } else if (field.id === 'from_email') {
    isValid = isValidEmail(value);
  } else if (field.id === 'subject') {
    isValid = value.length >= 3;
  } else if (field.id === 'message') {
    isValid = value.length >= 10;
  }
  
  if (!isValid && value) {
    formGroup.classList.add('error');
  } else {
    formGroup.classList.remove('error');
  }
}

/**
 * Validate form inputs
 */
function validateForm() {
  const fromName = document.getElementById('from_name').value.trim();
  const fromEmail = document.getElementById('from_email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  
  let isValid = true;
  
  // Clear previous errors
  document.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error');
  });
  
  // Validate name
  if (fromName.length < 3) {
    document.getElementById('from_name').closest('.form-group').classList.add('error');
    isValid = false;
  }
  
  // Validate email
  if (!isValidEmail(fromEmail)) {
    document.getElementById('from_email').closest('.form-group').classList.add('error');
    isValid = false;
  }
  
  // Validate subject
  if (subject.length < 3) {
    document.getElementById('subject').closest('.form-group').classList.add('error');
    isValid = false;
  }
  
  // Validate message
  if (message.length < 10) {
    document.getElementById('message').closest('.form-group').classList.add('error');
    isValid = false;
  }
  
  return isValid;
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
  e.preventDefault();
  
  // Validate form
  if (!validateForm()) {
    errorMsg.textContent = 'من فضلك تأكد من ملء جميع الحقول بشكل صحيح';
    errorMsg.style.display = 'block';
    setTimeout(() => {
      errorMsg.style.display = 'none';
    }, 4000);
    return;
  }
  
  // Hide messages
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';
  
  // Disable button
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<span>جارٍ الإرسال...</span>';
  
  try {
    const templateParams = {
      from_name: document.getElementById('from_name').value,
      from_email: document.getElementById('from_email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
      to_name: 'محمد فهمي',
    };
    
    // Check if EmailJS is loaded
    if (typeof emailjs !== 'undefined') {
      // Initialize EmailJS (replace with your public key)
      emailjs.init('YOUR_PUBLIC_KEY');
      
      // Send email
      await emailjs.send(
        'YOUR_SERVICE_ID',  // Replace with your service ID
        'YOUR_TEMPLATE_ID', // Replace with your template ID
        templateParams
      );
      
      // Success
      contactForm.reset();
      successMsg.style.display = 'block';
      successMsg.textContent = '✓ تم إرسال رسالتك بنجاح! سأرد عليك قريباً.';
    } else {
      // EmailJS not loaded - show alternative message
      console.warn('EmailJS not loaded. Using fallback method.');
      
      // You can implement a backend API call here instead
      // Example: sendViaBackend(templateParams);
      
      successMsg.style.display = 'block';
      successMsg.textContent = '✓ شكراً على رسالتك! سأرد عليك قريباً.';
      contactForm.reset();
    }
  } catch (err) {
    console.error('Error sending message:', err);
    errorMsg.style.display = 'block';
    errorMsg.textContent = '✗ حدث خطأ في الإرسال. يرجى المحاولة مجدداً.';
  } finally {
    // Re-enable button
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<span>إرسال الرسالة</span><span>✦</span>';
    
    // Hide messages after 6 seconds
    setTimeout(() => {
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';
    }, 6000);
  }
}

contactForm.addEventListener('submit', handleSubmit);

// Real-time validation
const formInputs = contactForm.querySelectorAll('input, textarea');
formInputs.forEach(input => {
  input.addEventListener('change', () => {
    const group = input.closest('.form-group');
    if (group.classList.contains('error')) {
      validateForm(); // Re-validate on change
    }
  });
});

// ──────────────────────────────────────────────────────────
// BACK TO TOP BUTTON
// ──────────────────────────────────────────────────────────

const backToTopBtn = document.getElementById('backToTop');

const handleBackToTopVisibility = throttle(() => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('btt-visible');
  } else {
    backToTopBtn.classList.remove('btt-visible');
  }
}, 100);

window.addEventListener('scroll', handleBackToTopVisibility);

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ──────────────────────────────────────────────────────────
// SMOOTH SCROLL FOR ANCHOR LINKS
// ──────────────────────────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip if href is just "#"
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      
      const headerOffset = 80; // Height of fixed navbar
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ──────────────────────────────────────────────────────────
// LAZY LOADING FOR IMAGES (if needed)
// ──────────────────────────────────────────────────────────

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ──────────────────────────────────────────────────────────
// PERFORMANCE: REMOVE SCROLL LISTENER ON MOBILE
// ──────────────────────────────────────────────────────────

const isMobile = window.innerWidth <= 768;

if (!isMobile) {
  window.addEventListener('scroll', handleScroll);
} else {
  // Minimal scroll behavior on mobile
  let lastScrollTop = 0;
  window.addEventListener('scroll', throttle(() => {
    lastScrollTop = window.scrollY;
  }, 250));
}

// ──────────────────────────────────────────────────────────
// ACCESSIBILITY: KEYBOARD NAVIGATION
// ──────────────────────────────────────────────────────────

document.addEventListener('keydown', (e) => {
  // Escape key closes menu
  if (e.key === 'Escape') {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
  
  // Tab key handling for focus management
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// ──────────────────────────────────────────────────────────
// ANALYTICS & ERROR TRACKING (Optional)
// ──────────────────────────────────────────────────────────

/**
 * Track form submission
 */
function trackEvent(eventName, eventData = {}) {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
  }
  
  // Custom logging
  console.log(`Event: ${eventName}`, eventData);
}

// Track when user reaches contact section
const contactSection = document.getElementById('contact');
if (contactSection) {
  const contactObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      trackEvent('contact_section_viewed');
      contactObserver.unobserve(contactSection);
    }
  });
  
  contactObserver.observe(contactSection);
}

// ──────────────────────────────────────────────────────────
// SERVICE WORKER REGISTRATION (Optional - for PWA)
// ──────────────────────────────────────────────────────────

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js');
  });
}

// ──────────────────────────────────────────────────────────
// PERFORMANCE MONITORING
// ──────────────────────────────────────────────────────────

/**
 * Monitor Core Web Vitals (Optional - requires specific setup)
 */
function monitorPerformance() {
  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.log('Performance monitoring not supported');
    }
  }
}

// Call monitoring function
monitorPerformance();

// ──────────────────────────────────────────────────────────
// INITIALIZATION LOG
// ──────────────────────────────────────────────────────────

console.log('%c🚀 Portfolio Loaded Successfully', 'color: #7c5cfc; font-size: 16px; font-weight: bold;');
console.log('%cVersion: 2.0 - Improved', 'color: #c084fc; font-size: 12px;');
console.log('%cFor support: hello@muhammadfahmy.com', 'color: #8888a0; font-size: 12px;');

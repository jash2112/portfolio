/* ===========================
   Navigation
   =========================== */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Sticky nav style on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  updateActiveNavLink();
}, { passive: true });

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ===========================
   Active nav link on scroll
   =========================== */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = navLinks.querySelectorAll('a');
  let current = '';

  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.id;
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ===========================
   Scroll-reveal animations
   =========================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Add reveal class to elements we want to animate
function initReveal() {
  const targets = [
    '.about__text',
    '.about__image-wrap',
    '.skill-card',
    '.timeline__item',
    '.edu-card',
    '.cert-card',
    '.testimonial',
    '.project-card',
    '.contact__intro',
    '.contact__form',
    '.stat',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.08}s`;
      revealObserver.observe(el);
    });
  });
}

initReveal();

/* ===========================
   Contact form
   =========================== */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Clear previous state
  formStatus.textContent = '';
  formStatus.className = 'form__status';

  const fields = contactForm.querySelectorAll('input, textarea');
  let valid = true;

  fields.forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
    if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        field.classList.add('error');
        valid = false;
      }
    }
  });

  if (!valid) {
    formStatus.textContent = 'Please fill in all fields correctly.';
    formStatus.classList.add('error');
    return;
  }

  // Simulate send (replace this with your actual form handler / API call)
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  setTimeout(() => {
    formStatus.textContent = "Message sent! I'll get back to you soon.";
    formStatus.classList.add('success');
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }, 1200);
});

// Remove error class on input
contactForm.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('error'));
});

/* ===========================
   Smooth scroll for anchor links
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

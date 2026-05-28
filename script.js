/* ============================================================
   PORTFOLIO — script.js
   Author: Your Name
   ============================================================ */

'use strict';

/* ========== SCROLL PROGRESS BAR ========== */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = progress + '%';
}

/* ========== NAVBAR ========== */
const navbar = document.getElementById('navbar');
function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/* ========== ACTIVE NAV LINK ON SCROLL ========== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ========== HAMBURGER MENU ========== */
const hamburger   = document.getElementById('hamburger');
const navLinksEl  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
  document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navLinksEl.classList.contains('open') &&
      !navLinksEl.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ========== SCROLL REVEAL ========== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px',
});

revealEls.forEach(el => revealObserver.observe(el));

/* ========== LAZY LOAD IMAGES ========== */
const lazyImages = document.querySelectorAll('img[data-src]');
if (lazyImages.length > 0) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imgObserver.observe(img));
}

/* ========== CONTACT FORM ========== */
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = contactForm.querySelector('#name').value.trim();
    const email   = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      // Simple validation shake
      contactForm.style.animation = 'none';
      contactForm.offsetHeight; // reflow
      return;
    }

    // Simulate send — replace with FormSpree, EmailJS, or your backend
    const btn = contactForm.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      contactForm.reset();
      if (formSuccess) {
        formSuccess.style.display = 'block';
        setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
      }
    }, 1200);
  });
}

/* ========== FOOTER YEAR ========== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ========== SCROLL EVENTS ========== */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      handleNavbarScroll();
      updateActiveNavLink();
      ticking = false;
    });
    ticking = true;
  }
});

// Run once on load
handleNavbarScroll();
updateActiveNavLink();

/* ========== SMOOTH SCROLL POLYFILL (if needed) ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ========== BACK TO TOP ========== */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.style.opacity = window.scrollY > 500 ? '1' : '0.3';
  });
}





document.addEventListener("DOMContentLoaded", () => {

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");

  let images = [];
  let currentIndex = 0;

  // =========================
  // CERTIFICATES (SINGLE IMAGE)
  // =========================
  document.querySelectorAll(".cert-lightbox").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();

      const img = el.dataset.img;

      lightboxImg.src = img;
      lightbox.style.display = "flex";

      // disable gallery mode
      images = [];
    });
  });

  // =========================
  // PROJECTS (GALLERY MODE)
  // =========================
  document.querySelectorAll(".lightbox-trigger").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();

      const group = el.dataset.group;

      images = Array.from(document.querySelectorAll(
        `.lightbox-trigger[data-group="${group}"]`
      ));

      currentIndex = images.indexOf(el);

      showImage();
      lightbox.style.display = "flex";
    });
  });

  function showImage() {
    const el = images[currentIndex];
    if (!el) return;

    const src = el.dataset.img || el.src;
    lightboxImg.src = src;
  }

  function next() {
    if (images.length === 0) return;
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
  }

  function prev() {
    if (images.length === 0) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
  }

  // =========================
  // CONTROLS
  // =========================
  closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display !== "flex") return;

    if (e.key === "Escape") lightbox.style.display = "none";
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

});
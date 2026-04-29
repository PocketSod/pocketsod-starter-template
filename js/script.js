// ===========================
// HEADER SCROLL EFFECT
// ===========================
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ===========================
// MOBILE NAV TOGGLE
// ===========================
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===========================
// SCROLL REVEAL (fade-up)
// ===========================
const fadeEls = document.querySelectorAll('.fade-up');

function checkFadeEls() {
  fadeEls.forEach(el => {
    if (el.classList.contains('in-view')) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.classList.add('in-view');
    }
  });
}

if (fadeEls.length) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  }

  // Poll every 50ms for 10s — covers RAF throttling in headless/off-screen tabs
  const pollInterval = setInterval(checkFadeEls, 50);
  setTimeout(() => clearInterval(pollInterval), 10000);

  window.addEventListener('scroll', checkFadeEls, { passive: true });
}

// ===========================
// BEFORE / AFTER SLIDER
// ===========================
const baRange    = document.getElementById('baRange');
const baWrap     = document.getElementById('baBeforeWrap');
const baHandle   = document.getElementById('baHandle');
const baContainer = document.getElementById('beforeAfter');

function updateSlider(val) {
  if (!baWrap || !baHandle) return;
  baWrap.style.width   = val + '%';
  baHandle.style.left  = val + '%';
}

if (baRange) {
  baRange.addEventListener('input', () => updateSlider(baRange.value), { passive: true });
  updateSlider(50);

  // Drag on handle directly
  if (baContainer) {
    let dragging = false;

    baContainer.addEventListener('mousedown', () => { dragging = true; });
    window.addEventListener('mouseup', () => { dragging = false; });

    baContainer.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const rect = baContainer.getBoundingClientRect();
      const pct  = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
      baRange.value = pct;
      updateSlider(pct);
    });

    baContainer.addEventListener('touchmove', (e) => {
      const rect = baContainer.getBoundingClientRect();
      const pct  = Math.min(Math.max(((e.touches[0].clientX - rect.left) / rect.width) * 100, 0), 100);
      baRange.value = pct;
      updateSlider(pct);
    }, { passive: true });
  }
}

// ===========================
// STICKY CALL BUTTON (mobile)
// ===========================
const stickyCall = document.getElementById('stickyCall');

if (stickyCall) {
  window.addEventListener('scroll', () => {
    stickyCall.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
}

// ===========================
// CONTACT FORM (Formspree AJAX)
// ===========================
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    }

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        contactForm.reset();
        formSuccess.classList.add('visible');
        if (submitBtn) submitBtn.style.display = 'none';
      } else {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
        // Fallback: let the form submit normally
        contactForm.submit();
      }
    } catch {
      // Network error — fall back to regular POST
      contactForm.submit();
    }
  });
}

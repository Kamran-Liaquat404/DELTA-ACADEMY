/**
 * DELTA English Language & Computer Academy
 * Official Interactive Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThreeDotNav();
  initFaqAccordion();
  initScrollTop();
  initActiveNavLink();
  initImageFallbacks();
});

/* --------------------------------------------------------------------------
   1. NAVBAR STICKY EFFECT
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. THREE-DOT ANIMATED NAVIGATION MENU
   -------------------------------------------------------------------------- */
function initThreeDotNav() {
  const threedotBtn = document.getElementById('threedot-btn');
  const navDropdown = document.getElementById('nav-dropdown');
  const navItems = document.querySelectorAll('.nav-dropdown .nav-item, .nav-dropdown-cta');

  if (!threedotBtn || !navDropdown) return;

  const toggleDropdown = (e) => {
    e.stopPropagation();
    const isActive = navDropdown.classList.contains('active');
    if (isActive) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const openDropdown = () => {
    threedotBtn.classList.add('active');
    threedotBtn.setAttribute('aria-expanded', 'true');
    navDropdown.classList.add('active');
  };

  const closeDropdown = () => {
    threedotBtn.classList.remove('active');
    threedotBtn.setAttribute('aria-expanded', 'false');
    navDropdown.classList.remove('active');
  };

  threedotBtn.addEventListener('click', toggleDropdown);

  // Close when clicking an anchor link inside dropdown
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      if (href && href.startsWith('#')) {
        closeDropdown();
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (navDropdown.classList.contains('active') && !navDropdown.contains(e.target) && !threedotBtn.contains(e.target)) {
      closeDropdown();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDropdown.classList.contains('active')) {
      closeDropdown();
    }
  });
}

/* --------------------------------------------------------------------------
   3. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-button');

  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const faqItem = button.closest('.faq-item');
      const faqContent = faqItem.querySelector('.faq-content');
      const isOpen = faqItem.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach((item) => {
        if (item !== faqItem) {
          item.classList.remove('active');
          const content = item.querySelector('.faq-content');
          if (content) content.style.maxHeight = null;
          const btn = item.querySelector('.faq-button');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        faqItem.classList.remove('active');
        faqContent.style.maxHeight = null;
        button.setAttribute('aria-expanded', 'false');
      } else {
        faqItem.classList.add('active');
        faqContent.style.maxHeight = faqContent.scrollHeight + 'px';
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. SCROLL TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   5. ACTIVE NAVIGATION INDICATOR ON SCROLL
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-dropdown .nav-item');

  if (!sections.length || !navItems.length) return;

  const handleScroll = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.includes(`#${currentSectionId}`)) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   6. IMAGE FALLBACK & GRACEFUL HANDLING
   -------------------------------------------------------------------------- */
function initImageFallbacks() {
  const images = document.querySelectorAll('img');

  images.forEach((img) => {
    img.addEventListener('error', () => {
      const altText = img.getAttribute('alt') || 'DELTA Academy';
      const wrapper = img.parentElement;

      if (wrapper && (wrapper.classList.contains('teacher-image-wrapper') || wrapper.classList.contains('student-image-wrapper'))) {
        // Fallback for teacher or student image
        const isStudent = wrapper.classList.contains('student-image-wrapper');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.backgroundColor = isStudent ? '#0D9488' : '#1D4ED8';
        wrapper.style.color = '#FFFFFF';
        wrapper.style.fontWeight = '800';
        wrapper.style.fontSize = '2.5rem';
        wrapper.style.letterSpacing = '0.05em';
        
        const initials = altText
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 3)
          .toUpperCase();

        wrapper.innerHTML = `<div style="text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 0.25rem;">${initials}</div>
          <div style="font-size: 0.8rem; font-weight: 600; opacity: 0.8; text-transform: uppercase;">DELTA ${isStudent ? 'Student' : 'Faculty'}</div>
        </div>`;
      }
    });
  });
}

/**
 * ==========================================================================
 * Warm Heart Cafe and Bakery - JAVASCRIPT (script.js)
 * Vanilla JavaScript for navigation, scrollspy, and interactive features:
 * 1. Mobile Hamburger Menu: Toggle, Backdrop Dismissal & Keyboard Accessibility
 * 2. High-Accuracy Scrollspy: Viewport Bounding Detection & Instant Nav Response
 * 3. Contact Form Submission Handler with Inline Success Notification & Timer Reset
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------
  // 1. Mobile Hamburger Menu Toggle & Auto-Close
  // -------------------------------------------------------------
  const mainHeader = document.getElementById('main-header');
  const navToggle = document.getElementById('nav-toggle');
  const navLinksList = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-links a');
  const siteLogo = document.getElementById('site-logo');

  function closeMobileMenu() {
    if (navLinksList && navLinksList.classList.contains('open')) {
      navLinksList.classList.remove('open');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }

  if (navToggle && navLinksList) {
    // Toggle menu dropdown on mobile
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinksList.classList.toggle('open');
      const isExpanded = navLinksList.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isExpanded.toString());
    });

    // Automatically close the mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close when clicking the brand logo
    if (siteLogo) {
      siteLogo.addEventListener('click', (e) => {
        closeMobileMenu();
      });
    }

    // Dismiss mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      if (mainHeader && !mainHeader.contains(event.target)) {
        closeMobileMenu();
      }
    });

    // Dismiss mobile menu on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    });
  }

  // -------------------------------------------------------------
  // 2. High-Accuracy Scrollspy for Single-Page Experience
  // -------------------------------------------------------------
  const landingSections = document.querySelectorAll('#home, #about, #menu, #gallery, #contact');
  const isLandingPage = landingSections.length > 0 && !!document.getElementById('home');

  function setActiveNavLink(targetHash) {
    if (!navLinks.length || !targetHash) return;

    // Normalize hash: e.g. "index.html#about" or "#about" -> "#about"
    const hashIndex = targetHash.indexOf('#');
    const cleanHash = hashIndex !== -1 ? targetHash.substring(hashIndex).toLowerCase() : targetHash.toLowerCase();

    if (!cleanHash || cleanHash === '#') return;

    navLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      const linkHashIndex = href.indexOf('#');
      const linkHash = linkHashIndex !== -1 ? href.substring(linkHashIndex) : href;

      if (linkHash === cleanHash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function updateActiveNavOnScroll() {
    if (!isLandingPage || !landingSections.length || !navLinks.length) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Edge case 1: Top of the page activates #home
    if (scrollY <= 60) {
      setActiveNavLink('#home');
      return;
    }

    // Edge case 2: Near bottom of the page activates the last section (#contact)
    if (scrollY + windowHeight >= docHeight - 60) {
      const lastSection = landingSections[landingSections.length - 1];
      if (lastSection) {
        setActiveNavLink(`#${lastSection.id}`);
        return;
      }
    }

    // Viewport-relative boundary detection:
    // Header height is ~68px, html scroll-padding-top is 80px.
    // A threshold of 100px ensures that when an anchor target stops at 80px from top,
    // it immediately triggers active status accurately.
    const triggerOffset = 100;
    let currentId = landingSections[0].id;

    landingSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= triggerOffset) {
        currentId = section.id;
      }
    });

    setActiveNavLink(`#${currentId}`);
  }

  if (isLandingPage) {
    // Provide instantaneous visual feedback when an anchor link is clicked
    const internalAnchors = document.querySelectorAll('a[href^="#"], a[href^="index.html#"]');
    internalAnchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href') || '';
        const hashIndex = href.indexOf('#');
        const cleanHash = hashIndex !== -1 ? href.substring(hashIndex).toLowerCase() : href.toLowerCase();

        if (cleanHash === '#home') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          try {
            history.pushState(null, '', '#home');
          } catch (_) {}
          setActiveNavLink('#home');
          return;
        }

        setActiveNavLink(cleanHash);
      });
    });

    if (siteLogo) {
      siteLogo.addEventListener('click', (e) => {
        closeMobileMenu();
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        try {
          history.pushState(null, '', '#home');
        } catch (_) {}
        setActiveNavLink('#home');
      });
    }

    // High performance scroll listener using requestAnimationFrame
    let isScrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!isScrollTicking) {
        window.requestAnimationFrame(() => {
          updateActiveNavOnScroll();
          isScrollTicking = false;
        });
        isScrollTicking = true;
      }
    }, { passive: true });

    // Handle direct hash navigation on page load
    if (window.location.hash) {
      const hash = window.location.hash.toLowerCase();
      setActiveNavLink(hash);
      if (hash === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }, 80);
        }
      }
    } else {
      updateActiveNavOnScroll();
    }

    // Handle URL hash changes
    window.addEventListener('hashchange', () => {
      if (window.location.hash) {
        const hash = window.location.hash.toLowerCase();
        setActiveNavLink(hash);
        if (hash === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  }

  // -------------------------------------------------------------
  // 3. Contact Form Submission with Styled Inline Alert
  // -------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  let formMessageTimeout = null;

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent standard page reload

      const nameInput = document.getElementById('user-name');
      const senderName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Guest';

      // Clear any prior dismissal timer to prevent early disappearance
      if (formMessageTimeout) {
        clearTimeout(formMessageTimeout);
        formMessageTimeout = null;
      }

      // Inline success notification
      formMessage.innerHTML = `<strong>Thank you, ${escapeHtml(senderName)}!</strong> Your message has been sent successfully. We will get back to you soon.`;
      formMessage.style.display = 'block';

      // Reset input fields
      contactForm.reset();

      // Smoothly bring the confirmation message into view if needed
      formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Automatically dismiss alert after 7 seconds
      formMessageTimeout = setTimeout(() => {
        formMessage.style.display = 'none';
        formMessageTimeout = null;
      }, 7000);
    });
  }

  // Helper function to sanitize user inputs for safe DOM insertion
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
  }

});

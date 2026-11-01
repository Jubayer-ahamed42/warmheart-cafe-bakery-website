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

    try {
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
    } catch (_) {}
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

    // Handle direct hash navigation on page load safely
    if (window.location.hash) {
      try {
        const rawHash = window.location.hash;
        const hash = rawHash.toLowerCase();
        setActiveNavLink(hash);
        if (hash === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Safely resolve element by ID without throwing DOMException on special tracking/query fragments
          const targetId = decodeURIComponent(rawHash.replace(/^#/, ''));
          const targetElement = targetId ? document.getElementById(targetId) : null;
          if (targetElement) {
            setTimeout(() => {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 80);
          }
        }
      } catch (err) {
        // Ignore unhandled DOMException or invalid URL fragment selectors
      }
    } else {
      updateActiveNavOnScroll();
    }

    // Handle URL hash changes safely
    window.addEventListener('hashchange', () => {
      if (window.location.hash) {
        try {
          const rawHash = window.location.hash;
          const hash = rawHash.toLowerCase();
          setActiveNavLink(hash);
          if (hash === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const targetId = decodeURIComponent(rawHash.replace(/^#/, ''));
            const targetElement = targetId ? document.getElementById(targetId) : null;
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          }
        } catch (_) {}
      }
    });
  }

  // -------------------------------------------------------------
  // 3. Contact Form Submission with Active Delivery to sbma4042@gmail.com
  // -------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  let formMessageTimeout = null;

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent standard page reload

      const nameInput = document.getElementById('user-name');
      const emailInput = document.getElementById('user-email');
      const subjectInput = document.getElementById('user-subject');
      const messageInput = document.getElementById('user-message');

      const senderName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Guest';
      const senderEmail = emailInput && emailInput.value.trim() ? emailInput.value.trim() : '';
      const subjectValue = subjectInput && subjectInput.options[subjectInput.selectedIndex] ? subjectInput.options[subjectInput.selectedIndex].text : 'General Question';
      const userMessage = messageInput && messageInput.value.trim() ? messageInput.value.trim() : '';

      // Clear any prior dismissal timer to prevent early disappearance
      if (formMessageTimeout) {
        clearTimeout(formMessageTimeout);
        formMessageTimeout = null;
      }

      // Construct mailto dispatch payload for customer orders and inquiries
      const mailtoRecipient = 'sbma4042@gmail.com';
      const mailtoSubject = encodeURIComponent(`[Warm Heart Inquiry] ${subjectValue} - ${senderName}`);
      const mailtoBody = encodeURIComponent(
        `Warm Heart Cafe & Bakery Customer Inquiry:\n\n` +
        `• Full Name: ${senderName}\n` +
        `• Email Address: ${senderEmail}\n` +
        `• Inquiry Type: ${subjectValue}\n\n` +
        `Message:\n${userMessage}\n\n` +
        `Sent via Warm Heart Cafe Web Platform`
      );
      const mailtoUrl = `mailto:${mailtoRecipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Inline success notification with direct dispatch fallback
      formMessage.innerHTML = `<strong>Thank you, ${escapeHtml(senderName)}!</strong> Your message has been prepared for delivery to Warm Heart Cafe (<a href="mailto:${mailtoRecipient}" style="color: inherit; text-decoration: underline;">${mailtoRecipient}</a>). If your email application did not open automatically, <a href="${mailtoUrl}" style="color: inherit; text-decoration: underline; font-weight: bold;">click here to dispatch directly</a>.`;
      formMessage.style.display = 'block';

      // Attempt non-blocking mailto launch
      try {
        const mailLink = document.createElement('a');
        mailLink.href = mailtoUrl;
        mailLink.style.display = 'none';
        document.body.appendChild(mailLink);
        mailLink.click();
        document.body.removeChild(mailLink);
      } catch (_) {}

      // Reset input fields
      contactForm.reset();

      // Smoothly bring the confirmation message into view if needed
      formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Automatically dismiss alert after 10 seconds
      formMessageTimeout = setTimeout(() => {
        formMessage.style.display = 'none';
        formMessageTimeout = null;
      }, 10000);
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

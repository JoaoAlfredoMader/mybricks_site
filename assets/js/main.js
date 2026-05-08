(function () {
  'use strict';

  // Preloader
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 400);
    }
  });

  // Init Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = menuToggle.querySelector('i');
      if (navLinks.classList.contains('open')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      if (window.lucide) lucide.createIcons();
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = menuToggle.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        if (window.lucide) lucide.createIcons();
      });
    });
  }

  // Navbar shadow on scroll
  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 8px 30px rgba(15,23,42,0.2)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Animated counter for dashboard preview
  function animateCounter(el, target, prefix = '', suffix = '', duration = 1500) {
    const start = performance.now();
    const isFloat = target.toString().includes('.') || target.toString().includes(',');
    const numericTarget = parseFloat(target.toString().replace(',', '.'));

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = numericTarget * ease;

      if (isFloat) {
        el.textContent = prefix + current.toFixed(1).replace('.', ',') + suffix;
      } else {
        el.textContent = prefix + Math.floor(current).toLocaleString('pt-BR') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Final exact value
        if (isFloat) {
          el.textContent = prefix + target.toString() + suffix;
        } else {
          el.textContent = prefix + parseInt(target).toLocaleString('pt-BR') + suffix;
        }
      }
    }
    requestAnimationFrame(update);
  }

  // Observe dashboard preview for counter animation
  const dashboardPreview = document.querySelector('.dashboard-preview');
  if (dashboardPreview) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const values = dashboardPreview.querySelectorAll('.p-value');
          values.forEach((val, index) => {
            setTimeout(() => {
              const text = val.textContent.trim();
              if (text.includes('R$')) {
                const num = text.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
                animateCounter(val, num, 'R$ ');
              } else if (text.includes('%')) {
                const num = text.replace('%', '').replace(',', '.').trim();
                animateCounter(val, num, '', '%');
              } else {
                animateCounter(val, text);
              }
            }, index * 200);
          });
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(dashboardPreview);
  }

  // Scroll reveal with stagger
  const revealGroups = [
    { selector: '.feature-card', stagger: 100 },
    { selector: '.pricing-card', stagger: 120 },
    { selector: '.step', stagger: 150 },
    { selector: '.contact-card', stagger: 100 },
    { selector: '.section-header', stagger: 0 }
  ];

  revealGroups.forEach(group => {
    const elements = document.querySelectorAll(group.selector);
    elements.forEach((el, index) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${index * group.stagger}ms`;
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Parallax effect for hero background
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.15;
      heroBg.style.transform = `translateY(${rate}px)`;
    }, { passive: true });
  }

  // Animate pricing features on hover cascade
  document.querySelectorAll('.pricing-card').forEach(card => {
    const features = card.querySelectorAll('.pricing-features li');
    card.addEventListener('mouseenter', () => {
      features.forEach((li, i) => {
        li.style.transitionDelay = `${i * 30}ms`;
        li.style.transform = 'translateX(6px)';
      });
    });
    card.addEventListener('mouseleave', () => {
      features.forEach(li => {
        li.style.transitionDelay = '0ms';
        li.style.transform = 'translateX(0)';
      });
    });
  });

})();

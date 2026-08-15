/**
 * ==========================================================================
 * ANSH SINGH — PERSONAL DEVELOPER PORTFOLIO
 * Vanilla JavaScript Engine
 * Particles • Typewriter • Modals • Observers • Form Mailto Handler
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. CANVAS PARTICLE SYSTEM ENGINE
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let particles = [];
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Mouse proximity position for canvas
    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.scale(dpr, dpr);
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Slow subtle velocity
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.baseRadius = Math.random() * 1.6 + 0.8;
        this.radius = this.baseRadius;
        this.alpha = Math.random() * 0.4 + 0.2;
        // Alternate between subtle cyan and purple tints
        this.color = Math.random() > 0.4 ? '6, 182, 212' : '139, 92, 246';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Screen edge wrapping
        if (this.x < -10) this.x = width + 10;
        else if (this.x > width + 10) this.x = -10;

        if (this.y < -10) this.y = height + 10;
        else if (this.y > height + 10) this.y = -10;

        // Mouse proximity reaction (gentle nudge)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.2;
            this.y -= Math.sin(angle) * force * 1.2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      // Calculate particle count based on screen width (50 to 80 particles)
      const count = Math.min(80, Math.max(45, Math.floor(width / 22)));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDistance = 125;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            // Distance-based alpha fade
            const lineAlpha = (1 - dist / maxDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      if (document.hidden || prefersReducedMotion) {
        return;
      }
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();

      animationFrameId = requestAnimationFrame(animateParticles);
    }

    // Initial setup
    resizeCanvas();
    if (!prefersReducedMotion) {
      animateParticles();
    } else {
      // Draw static particle constellation once for reduced motion
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => p.draw());
      connectParticles();
    }

    // Resize listener with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        if (prefersReducedMotion) {
          particles.forEach(p => p.draw());
          connectParticles();
        }
      }, 150);
    });

    // Track mouse on window for canvas reaction
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Pause canvas animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        if (!prefersReducedMotion) {
          animateParticles();
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. MOUSE-FOLLOWING AMBIENT GLOW
     ------------------------------------------------------------------------ */
  let mouseMoveTicking = false;
  window.addEventListener('mousemove', (e) => {
    if (!mouseMoveTicking) {
      window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
        mouseMoveTicking = false;
      });
      mouseMoveTicking = true;
    }
  });

  /* ------------------------------------------------------------------------
     3. TYPEWRITER ANIMATION
     Strictly verified roles: Student Developer, Chart Analyzer, Web Designer, Python
     ------------------------------------------------------------------------ */
  const typewriterElement = document.getElementById('typewriterText');
  if (typewriterElement) {
    const roles = [
      'Student Developer',
      'Chart Analyzer',
      'Web Designer',
      'Python'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end of word
        typingSpeed = 1900;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(typeLoop, typingSpeed);
    }

    // Start typing
    setTimeout(typeLoop, 500);
  }

  /* ------------------------------------------------------------------------
     4. STICKY HEADER & ACTIVE NAVIGATION HIGHLIGHTING
     ------------------------------------------------------------------------ */
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateHeaderState() {
    if (window.scrollY > 25) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  function updateActiveNav() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', () => {
    updateHeaderState();
    updateActiveNav();
  }, { passive: true });

  updateHeaderState();
  updateActiveNav();

  /* ------------------------------------------------------------------------
     5. MOBILE DRAWER NAVIGATION
     ------------------------------------------------------------------------ */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  /* ------------------------------------------------------------------------
     6. SCROLL REVEAL OBSERVER
     ------------------------------------------------------------------------ */
  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    // Fallback for environments without IntersectionObserver
    revealItems.forEach(item => item.classList.add('revealed'));
  }

  /* ------------------------------------------------------------------------
     7. SKILLS PROGRESS BARS ANIMATION OBSERVER
     ------------------------------------------------------------------------ */
  const skillCards = document.querySelectorAll('.skill-card');
  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector('.skill-progress-bar');
          if (bar) {
            bar.classList.add('animated');
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    skillCards.forEach(card => skillObserver.observe(card));
  } else {
    document.querySelectorAll('.skill-progress-bar').forEach(bar => bar.classList.add('animated'));
  }

  /* ------------------------------------------------------------------------
     8. PROJECT DATA & INTERACTIVE MODAL
     ------------------------------------------------------------------------ */
  const projectsData = {
    'chart-analyzer': {
      title: 'Chart Analyzer — Indian/Forex/Crypto',
      category: 'Event Project',
      description: 'A browser-based analyzer that reads market data and suggests entry & exit with ~83% accuracy. Built and presented for a student event at La Martiniere College, Lucknow.',
      context: 'Demonstrated as an interactive event project to showcase data extraction, algorithmic signal generation, and real-time frontend visualization.',
      features: [
        'Live interactive chart visualizations with candlestick/trendline data',
        'Algorithmic Entry and Exit signal indicators',
        'Real-time accuracy tracking based on historical event test samples (~83% approx.)',
        'CSV file data import and exported report generation',
        'Intuitive, simplified dark-mode UI designed for quick inspection'
      ],
      techStack: ['Python (Data Logic)', 'JavaScript (Visualization)', 'HTML & CSS', 'CSV Parsing'],
      note: 'Academic / Event Project: The ~83% accuracy is an approximate metric achieved during college event demonstrations and is not financial trading advice.'
    },
    'portfolio-pages': {
      title: 'Portfolio & Demo Pages',
      category: 'UI / Frontend',
      description: 'Small landing pages and portfolio templates built using pure HTML/CSS and lightweight JavaScript. Designed to be fully responsive and social-ready.',
      context: 'Created as modular design templates with focus on sleek layout architecture, typography hierarchy, and smooth CSS keyframe animations.',
      features: [
        'Responsive single-page portfolio layout structures',
        'Fluid sliding sections with pop and reveal animations',
        'Social-ready metadata and accessible semantic structure',
        'Zero external framework dependencies for ultra-fast load times'
      ],
      techStack: ['HTML5', 'CSS3', 'Lightweight JavaScript', 'Responsive Design'],
      note: 'Showcases clean design principles, motion design, and cross-device interface crafting.'
    },
    'automation-scripts': {
      title: 'Automation Scripts',
      category: 'Python',
      description: 'Python automation scripts developed for small tasks including web data scraping, CSV parsing, and simple data pipelines.',
      context: 'Employed for quick data extraction, formatting, and preprocessing in event projects and academic utilities.',
      features: [
        'Web scraping scripts for structured information retrieval',
        'Robust CSV parsing and data cleansing routines',
        'Simple multi-step data processing pipelines',
        'Automated file formatting and export utilities'
      ],
      techStack: ['Python', 'CSV Module', 'Web Scraping', 'Data Preprocessing'],
      note: 'Built to automate repetitive data collection tasks for student and event workflows.'
    }
  };

  const projectCards = document.querySelectorAll('.project-card');
  const projectModal = document.getElementById('projectModal');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseAction = document.getElementById('modalCloseAction');
  const modalBackdrop = document.getElementById('modalBackdrop');

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;

    // Render detailed structured modal body
    modalBody.innerHTML = `
      <div>
        <h4 class="modal-section-title">Overview</h4>
        <p>${data.description}</p>
      </div>

      <div>
        <h4 class="modal-section-title">Project Context</h4>
        <p>${data.context}</p>
      </div>

      <div>
        <h4 class="modal-section-title">Key Capabilities &amp; Features</h4>
        <ul class="modal-features-list">
          ${data.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <div>
        <h4 class="modal-section-title">Technologies Used</h4>
        <div class="project-tags" style="margin-top: 6px; margin-bottom: 0;">
          ${data.techStack.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-note-box">
        <strong>Project Note:</strong> ${data.note}
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      openProjectModal(projectId);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const projectId = card.getAttribute('data-project-id');
        openProjectModal(projectId);
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalCloseAction) modalCloseAction.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  /* ------------------------------------------------------------------------
     9. ESCAPE KEY GLOBAL HANDLER
     ------------------------------------------------------------------------ */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && projectModal.classList.contains('open')) {
        closeProjectModal();
      }
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    }
  });

  /* ------------------------------------------------------------------------
     10. TOAST NOTIFICATION SYSTEM
     ------------------------------------------------------------------------ */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, icon = '🚀') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 4500);
  }

  /* ------------------------------------------------------------------------
     11. CONTACT FORM HANDLER (CLIENT-SIDE VALIDATION & MAILTO)
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const senderNameInput = document.getElementById('senderName');
    const emailSubjectInput = document.getElementById('emailSubject');
    const emailMessageInput = document.getElementById('emailMessage');

    const nameError = document.getElementById('nameError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset errors
      nameError.textContent = '';
      subjectError.textContent = '';
      messageError.textContent = '';

      const name = senderNameInput.value.trim();
      const subject = emailSubjectInput.value.trim();
      const message = emailMessageInput.value.trim();

      let hasError = false;

      if (!name) {
        nameError.textContent = 'Please enter your name.';
        hasError = true;
      }

      if (!subject) {
        subjectError.textContent = 'Please enter a subject.';
        hasError = true;
      }

      if (!message) {
        messageError.textContent = 'Please enter a message.';
        hasError = true;
      } else if (message.length < 5) {
        messageError.textContent = 'Message should be at least 5 characters.';
        hasError = true;
      }

      if (hasError) return;

      // Construct mailto link
      const recipient = 'ansh7224@outlook.com';
      const mailtoSubject = encodeURIComponent(subject);
      const mailtoBody = encodeURIComponent(`Hi Ansh,

Name: ${name}

Message:
${message}

Sent from your portfolio contact form.`);
      const mailtoUrl = `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Open mail client
      showToast('Opening your default email app to send message to ansh7224@outlook.com...', '✉️');

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);
    });
  }

  /* ------------------------------------------------------------------------
     12. SMOOTH INTERNAL LINK SCROLLING
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

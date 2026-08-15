/**
 * ==========================================================================
 * ANSH SINGH — PERSONAL DEVELOPER PORTFOLIO (2026 EDITION)
 * Vanilla JavaScript Interaction & Animation Engine
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
        // Subtle, smooth velocity
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.baseRadius = Math.random() * 1.6 + 0.8;
        this.radius = this.baseRadius;
        this.alpha = Math.random() * 0.4 + 0.2;
        // Alternating electric cyan and purple tints
        this.color = Math.random() > 0.4 ? '6, 182, 212' : '139, 92, 246';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Screen boundary wrapping
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
      if (document.hidden || prefersReducedMotion) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();

      animationFrameId = requestAnimationFrame(animateParticles);
    }

    // Initialize Canvas
    resizeCanvas();
    if (!prefersReducedMotion) {
      animateParticles();
    } else {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => p.draw());
      connectParticles();
    }

    // Resize handler
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

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

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
     2. MOUSE-FOLLOWING CURSOR SPOTLIGHT
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
     ------------------------------------------------------------------------ */
  const typewriterElement = document.getElementById('typewriterText');
  if (typewriterElement) {
    const roles = [
      'Building Projects',
      'Learning AI & ML',
      'Developing Web Experiences',
      'Exploring Technology'
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
        typingSpeed = 85;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 1900;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(typeLoop, typingSpeed);
    }

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
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('revealed'));
  }

  /* ------------------------------------------------------------------------
     7. PROJECT DATA & INTERACTIVE MODAL
     ------------------------------------------------------------------------ */
  const projectsData = {
    'trade-analysis': {
      title: 'Intraday & Market Technical Analysis (Trade_with_Ansh)',
      category: 'Technical Analysis',
      description: 'A technical analysis experimentation project focused on reading market indicators, analyzing chart structures, and identifying potential Entry, Exit, Stop Loss, and Take Profit levels.',
      context: 'Developed as an experimental analytical tool to explore algorithmic indicator integration with Python and TradingView charts.',
      features: [
        'Integration of RSI, MACD, Fibonacci retracements, and Alligator indicator logic',
        'Visual structure identification for key Entry and Take Profit / Stop Loss levels',
        'Data extraction and processing routines using Python',
        'Technical charting visualization via TradingView scripts'
      ],
      techStack: ['Python', 'Technical Analysis', 'TradingView', 'RSI / MACD', 'Fibonacci', 'Alligator'],
      note: 'Student / Educational Project: Built for technical experimentation and indicator logic analysis. Does not constitute commercial financial advice.'
    },
    'mindtrack-ai': {
      title: 'MindTrack AI — Student Productivity Ecosystem',
      category: 'AI / Productivity',
      description: 'A student productivity ecosystem concept and project designed to assist study workflow planning, milestone tracking, and focus optimization.',
      context: 'Created to solve real student scheduling friction by exploring intelligent task prioritization and structured revision tracking.',
      features: [
        'Academic revision workflow and syllabus milestone tracker',
        'Focus session timer and study habit analytics',
        'AI-driven study insights and revision scheduling concepts',
        'Clean, accessible interface designed for rapid daily updates'
      ],
      techStack: ['Artificial Intelligence', 'Productivity Logic', 'Python', 'Interface Design'],
      note: 'Student Project: Built to explore AI-assisted productivity tools for high school and academic workflows.'
    },
    'bank-management': {
      title: 'Bank Management System (Python + MySQL)',
      category: 'Software / Team Project',
      description: 'A complete student software project for managing customer bank accounts, transaction histories, fund transfers, and relational database records.',
      context: 'Collaborative team project built with teammates Manas and Sourya, with Ansh serving as the Team Leader overseeing architecture, application logic, and database schema.',
      features: [
        'Account creation, authentication, and lifecycle management',
        'Transaction execution (deposits, withdrawals, balance queries) with SQL transaction commits',
        'Structured relational database schemas in MySQL',
        'Python application layer integrating secure database connectivity'
      ],
      techStack: ['Python', 'MySQL', 'Relational Database Design', 'CRUD Operations', 'Team Leadership'],
      note: 'Academic Software Project: Team led by Ansh Singh with teammates Manas and Sourya.'
    },
    'portfolio-competition': {
      title: 'Portfolio & Web Design Competition Pages',
      category: 'UI / Competition Design',
      description: 'Responsive landing pages, sliding one-page portfolio layouts, and competition frontend prototypes crafted using pure HTML, CSS, and lightweight JavaScript.',
      context: 'Includes creative web design competition entries featuring concepts for a dynamic FIFA World Cup 2026 hub and an ISRO space exploration portal.',
      features: [
        'Responsive, modern UI architectures crafted without bulky framework overhead',
        'Sliding section choreography and CSS keyframe animations',
        'Thematic web design prototypes for FIFA 2026 and ISRO space showcases',
        'Full semantic accessibility and cross-device responsiveness'
      ],
      techStack: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'UI/UX Design', 'Competition Showcase'],
      note: 'Showcases frontend craft, typography hierarchy, motion design, and competition design entries.'
    },
    'automation-pipelines': {
      title: 'Automation Scripts & Data Pipelines',
      category: 'Python / Automation',
      description: 'A collection of Python scripts developed for task automation including web data scraping, CSV parsing, data formatting, and preprocessing pipelines.',
      context: 'Built to automate repetitive academic, event, and data extraction workflows, delivering clean tabular data ready for analysis.',
      features: [
        'Automated web scraping and structured record extraction routines',
        'CSV file parsing, sanitization, and tabular dataset formatting',
        'Lightweight data pipelines for quick preprocessing in technology events',
        'Modular script architecture for quick extensibility'
      ],
      techStack: ['Python', 'Web Scraping', 'CSV Module', 'Data Preprocessing'],
      note: 'Built to automate data extraction tasks across various student and competition projects.'
    },
    'ai-workflows': {
      title: 'AI-Assisted Prototyping & Antigravity Workflows',
      category: 'AI Engineering / Web',
      description: 'Experimentation with modern AI agent workflows (Antigravity) and structured prompt architecture to rapidly scaffold modular frontend systems and performant interfaces.',
      context: 'Exploring the intersection of human engineering and agentic AI pair programming to accelerate web tool creation, motion design, and clean code architecture.',
      features: [
        'Agentic AI pair-programming workflows for rapid component specification',
        'Zero-dependency vanilla JavaScript and high-performance CSS engineering',
        'Modular design system planning and automated verification routines',
        'Focus on web accessibility, smoothness, and zero-runtime bundle overhead'
      ],
      techStack: ['AI Workflows', 'Antigravity', 'Frontend Architecture', 'Vanilla JS', 'Motion Design'],
      note: 'Explores cutting-edge AI-assisted engineering and modern web performance.'
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
        <strong>Note:</strong> ${data.note}
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
     8. GLOBAL KEYBOARD HANDLERS (ESCAPE)
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
     9. TOAST NOTIFICATION SYSTEM
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
     10. CONTACT FORM HANDLER (CLIENT VALIDATION & MAILTO)
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

      const recipient = 'ansh7224@outlook.com';
      const mailtoSubject = encodeURIComponent(subject);
      const mailtoBody = encodeURIComponent(`Hi Ansh,

Name: ${name}

Message:
${message}

Sent from your portfolio contact form.`);
      const mailtoUrl = `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

      showToast('Opening your email client to send message to ansh7224@outlook.com...', '✉️');

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);
    });
  }

  /* ------------------------------------------------------------------------
     11. SMOOTH SCROLL FOR INTERNAL ANCHORS
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 75;
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

/**
 * ==========================================================================
 * ANSH. — CREATIVE DEVELOPER PORTFOLIO
 * Master Interaction & Animation Engine
 * Particle Constellation • Cursor Lighting • Case Study Modals • Form Engine
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. FIXED CANVAS PARTICLE CONSTELLATION ENGINE
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let particles = [];
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Mouse proximity position for canvas deflection
    const mouse = {
      x: null,
      y: null,
      radius: 130
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
        // Smooth editorial velocity
        this.vx = (Math.random() - 0.5) * 0.42;
        this.vy = (Math.random() - 0.5) * 0.42;
        this.baseRadius = Math.random() * 1.5 + 0.8;
        this.radius = this.baseRadius;
        this.alpha = Math.random() * 0.45 + 0.2;
        
        // Palette distribution: 55% Indigo Blue, 35% Warm Ivory, 10% Crimson Red
        const rand = Math.random();
        if (rand < 0.55) {
          this.color = '82, 105, 216'; // Indigo Blue
        } else if (rand < 0.90) {
          this.color = '233, 229, 220'; // Warm Ivory
        } else {
          this.color = '201, 37, 53'; // Crimson Red
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Screen boundary wrapping
        if (this.x < -10) this.x = width + 10;
        else if (this.x > width + 10) this.x = -10;

        if (this.y < -10) this.y = height + 10;
        else if (this.y > height + 10) this.y = -10;

        // Gentle cursor deflection
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.35;
            this.y -= Math.sin(angle) * force * 1.35;
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
      const count = Math.min(85, Math.max(45, Math.floor(width / 20)));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDistance = 120;
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
            ctx.strokeStyle = `rgba(82, 105, 216, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
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

    resizeCanvas();
    if (!prefersReducedMotion) {
      animateParticles();
    } else {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => p.draw());
      connectParticles();
    }

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
     2. CURSOR SPOTLIGHT TRACKING & SCROLL PROGRESS BAR
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

  const scrollProgressBar = document.getElementById('scrollProgressBar');
  function updateScrollProgress() {
    if (scrollProgressBar) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${progress}%`;
    }
  }

  /* ------------------------------------------------------------------------
     3. TYPEWRITER DYNAMIC ROLE DISPLAY
     ------------------------------------------------------------------------ */
  const typewriterElement = document.getElementById('typewriterText');
  if (typewriterElement) {
    const roles = [
      'Interactive Web Experiences',
      'On-Device AI Systems',
      'Web Application Architecture',
      'Algorithmic Analysis'
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
        typingSpeed = 35;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 450;
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
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  function updateActiveNav() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200;

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
    updateScrollProgress();
  }, { passive: true });

  updateHeaderState();
  updateActiveNav();
  updateScrollProgress();

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
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('revealed'));
  }

  /* ------------------------------------------------------------------------
     7. PROJECT CASE STUDY DATA & MODAL SYSTEM
     ------------------------------------------------------------------------ */
  const projectsData = {
    'studyvault-ai': {
      title: 'StudyVault AI — Private Offline Desktop Study Assistant',
      category: 'AI / Desktop Application',
      description: 'An offline desktop study assistant engineered for 100% private, on-device AI inference powered by Tether's QVAC SDK. Eliminates cloud telemetry and recurring API token costs while delivering high-speed conversational assistance directly on local hardware.',
      context: 'Built to solve the academic dilemma between generative AI study aids and privacy risks, enabling students and researchers to process proprietary syllabus notes and textbooks entirely on their machine.',
      features: [
        '100% On-Device AI inference running directly through Tether's QVAC SDK without sending data to external cloud servers',
        'Electron desktop architecture packaged for Windows with native filesystem integration',
        'Fast client interface crafted with React 19, Tailwind CSS, and Vite',
        'Local Express service orchestrating document chunking, prompt pipelines, and QVAC inference execution',
        'Offline capability ensuring full functionality in low-connectivity or air-gapped study environments'
      ],
      techStack: ['Tether QVAC SDK', 'Electron', 'React 19', 'Tailwind CSS', 'Vite', 'Express', 'Node.js'],
      note: 'Verified Software Project: Fully compiled and packaged executable prototype with zero cloud dependency.'
    },
    'trade-analysis': {
      title: 'Intraday & Market Technical Analysis (Trade_with_Ansh)',
      category: 'Financial Engineering & Analytics',
      description: 'A quantitative technical analysis engine integrating algorithmic momentum indicators, moving average structures, and Fibonacci levels to identify potential Entry, Stop Loss, and Take Profit zones in market data.',
      context: 'Built as an experimental analytical environment to test indicator convergence and automate chart inspection through Python logic and TradingView visualization scripts.',
      features: [
        'Mathematical indicator integration combining RSI, MACD, Fibonacci retracements, and Williams Alligator momentum',
        'Algorithmic structure identification for key swing highs/lows, breakout confirmations, and risk-to-reward boundaries',
        'Python backend logic for historical market dataset cleansing and signal backtesting',
        'TradingView chart integration and lightweight interactive chart rendering'
      ],
      techStack: ['Python', 'FastAPI', 'TradingView Scripting', 'Lightweight Charts', 'Technical Indicators', 'Pandas'],
      note: 'Technical & Algorithmic Project: Developed strictly for market analysis and indicator experimentation. Does not constitute commercial financial advice.'
    },
    'farewell-tickets': {
      title: 'SPM ’27 Farewell Ticketing & Verification Platform',
      category: 'Full Stack & Web Application',
      description: 'A production-minded private ticketing web application designed for the SPM ’27 farewell event, incorporating secure invitation access, database persistence, automated QR code generation, camera-based QR ticket scanning, and email dispatch.',
      context: 'Engineered as a real-world event management solution to eliminate manual paper ticketing, prevent counterfeit entries, and provide event administrators with real-time check-in metrics.',
      features: [
        'Secure guest authentication and personalized digital admission ticket generation',
        'Embedded unique QR codes with encrypted verification tokens for high-speed gate scanning',
        'Camera-based in-browser QR scanning utilizing html5-qrcode for instant gatekeeper validation',
        'Relational data persistence managed with SQLite3 and robust Node/Express backend endpoints',
        'Automated ticket delivery to attendee email accounts via Nodemailer integration'
      ],
      techStack: ['React 18', 'TypeScript', 'Node.js / Express', 'SQLite3', 'HTML5 QR Scanner', 'Nodemailer', 'Tailwind'],
      note: 'Production Event Software: Engineered with end-to-end authentication, scanning, and database transactions.'
    },
    'bank-management': {
      title: 'Bank Management System (Python + MySQL)',
      category: 'Software Engineering & Relational DB',
      description: 'A software project managing customer account lifecycles, debit/credit transactions, balance audits, and relational database integrity in MySQL. Developed in a collaborative team led by Ansh with teammates Manas and Sourya.',
      context: 'Constructed to master complex multi-table relational database architecture, ACID transaction properties, and clean separation between application logic and persistent storage.',
      features: [
        'Customer account creation, authentication, profile administration, and record deletion',
        'Transactional execution (fund deposits, withdrawals, transfers) with SQL transaction commits and rollbacks',
        'Structured relational database schemas in MySQL enforcing foreign keys and audit logging',
        'Modular Python application layer connecting via mysql.connector with input sanitization'
      ],
      techStack: ['Python', 'MySQL', 'Relational Schemas', 'CRUD Operations', 'ACID Transactions', 'Team Leadership'],
      note: 'Academic Software Project: Team led by Ansh Singh with teammates Manas and Sourya.'
    },
    'mindtrack-ai': {
      title: 'MindTrack AI — Productivity & Milestone Ecosystem',
      category: 'AI / Productivity Ecosystem',
      description: 'An AI/productivity-oriented student project concept designed to intelligently streamline study milestones, revision pacing, and task prioritization for high-demand academic workflows.',
      context: 'Conceived to address the friction students encounter when organizing multi-subject preparation, synthesizing curriculum schedules into structured study sprints.',
      features: [
        'Intelligent revision milestone tracking with topic completion analytics',
        'Productivity pacing engine scheduling focused study blocks and intervals',
        'AI study insight synthesis providing personalized revision recommendations',
        'Distraction-free dark aesthetic designed for rapid interaction on desktop and mobile'
      ],
      techStack: ['Artificial Intelligence', 'Productivity Logic', 'Python', 'UI Architecture'],
      note: 'Student Concept & Prototype: Built to explore AI-assisted milestone optimization in academic routines.'
    },
    'webdesign-competition': {
      title: 'Portfolio & Web Design Competition Showcases',
      category: 'Creative UI & Competition Entries',
      description: 'Responsive landing templates and competition entries crafted using pure HTML, modern CSS, and lightweight JavaScript, featuring creative concepts for FIFA World Cup 2026 and ISRO space exploration.',
      context: 'Showcasing frontend visual storytelling, typographic hierarchy, responsive layout adaptability, and CSS keyframe motion in competitive design events.',
      features: [
        'Dynamic FIFA World Cup 2026 portal concept with tournament countdown, match schedules, and stadium visualizers',
        'ISRO space research showcase interface featuring rocket stage breakdowns and mission timelines',
        'Zero framework bloat with pure semantic HTML5 and performance-optimized CSS3 animations',
        'Complete cross-device adaptability tested across mobile, tablet, and widescreen viewports'
      ],
      techStack: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'UI/UX Design', 'Competition Showcases'],
      note: 'Creative Frontend Projects: Demonstrates rapid design prototyping, motion design, and competition craftsmanship.'
    },
    'automation-pipelines': {
      title: 'Automation Scripts & Data Pipelines',
      category: 'Python & Automation',
      description: 'A collection of Python scripts developed for task automation including web data scraping, CSV parsing, data formatting, and preprocessing pipelines.',
      context: 'Built to automate repetitive academic, event, and data extraction workflows, delivering clean tabular data ready for analysis.',
      features: [
        'Automated web scraping and structured record extraction routines',
        'CSV file parsing, sanitization, and tabular dataset formatting',
        'Lightweight data pipelines for quick preprocessing in technology events',
        'Modular script architecture for quick extensibility'
      ],
      techStack: ['Python', 'Web Scraping', 'CSV Module', 'Data Preprocessing'],
      note: 'Utility Systems: Engineered to automate repetitive collection and sanitization tasks across various projects.'
    },
    'ai-workflows': {
      title: 'AI-Assisted Prototyping & Antigravity Workflows',
      category: 'AI Engineering & Modern Web Performance',
      description: 'Experimenting with modern AI agent workflows (Antigravity) and structured prompt architecture to rapidly scaffold modular frontend architectures and performant web tools.',
      context: 'Exploring the intersection of human engineering and agentic AI pair programming to accelerate web tool creation, motion design, and clean code architecture.',
      features: [
        'Agentic AI pair-programming workflows for rapid component specification',
        'Zero-dependency vanilla JavaScript and high-performance CSS engineering',
        'Modular design system planning and automated verification routines',
        'Focus on web accessibility, smoothness, and zero-runtime bundle overhead'
      ],
      techStack: ['AI Workflows', 'Antigravity', 'Frontend Architecture', 'Vanilla JS', 'Motion Design'],
      note: 'Engineering Methodologies: Explores cutting-edge AI-assisted engineering and modern web performance.'
    }
  };

  const projectCards = document.querySelectorAll('.project-showcase-card');
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
        <h4 class="modal-section-title">PROJECT OVERVIEW</h4>
        <p>${data.description}</p>
      </div>

      <div>
        <h4 class="modal-section-title">ENGINEERING CONTEXT</h4>
        <p>${data.context}</p>
      </div>

      <div>
        <h4 class="modal-section-title">KEY ARCHITECTURAL HIGHLIGHTS</h4>
        <ul class="modal-features-list">
          ${data.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <div>
        <h4 class="modal-section-title">TECHNOLOGIES &amp; TOOLING</h4>
        <div class="project-tech-tags" style="margin-top: 8px; margin-bottom: 0;">
          ${data.techStack.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-note-box">
        <strong>Status / Note:</strong> ${data.note}
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
     10. CONTACT FORM CLIENT-SIDE VALIDATION & MAILTO HANDLER
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
        messageError.textContent = 'Please enter your message.';
        hasError = true;
      } else if (message.length < 5) {
        messageError.textContent = 'Message should contain at least 5 characters.';
        hasError = true;
      }

      if (hasError) return;

      const recipient = 'ansh7224@outlook.com';
      const mailtoSubject = encodeURIComponent(subject);
      const mailtoBody = encodeURIComponent(`Hi Ansh,

Name: ${name}

Message:
${message}

Sent via your creative developer portfolio.`);
      const mailtoUrl = `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

      showToast('Opening your default email client addressed to ansh7224@outlook.com...', '✉️');

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);
    });
  }

  /* ------------------------------------------------------------------------
     11. SMOOTH SCROLLING FOR INTERNAL ANCHORS
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

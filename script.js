/* ================================================================
   CodeNexuss Ã¢â‚¬â€œ MAIN SCRIPT
   Sections covered:
     1. Navbar Ã¢â‚¬â€œ scroll + hamburger toggle
     2. Active nav-link highlight on scroll (Intersection Observer)
     3. Scroll reveal animations
     4. Contact form validation & submission simulation
     5. AI Chatbot widget
     6. Back-to-top button
     7. Hero canvas particle animation
   ================================================================ */

/* ----------------------------------------------------------------
   Helper: safely get element, warn if missing
   ---------------------------------------------------------------- */
function el(id) {
  const node = document.getElementById(id);
  if (!node) console.warn(`[CodeNexuss] Element #${id} not found`);
  return node;
}

/* ================================================================
   1. NAVBAR Ã¢â‚¬â€œ sticky background + hamburger
   ================================================================ */
(function initNavbar() {
  const navbar    = el('navbar');
  const hamburger = el('hamburger');
  const navLinks  = el('navLinks');

  if (!navbar) return;

  /* Add .scrolled class when page scrolls past 50px */
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page is already scrolled

  /* Hamburger toggle Ã¢â‚¬â€œ show/hide mobile nav */
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close mobile nav when a link is clicked */
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();

/* ================================================================
   2. ACTIVE NAV LINK Ã¢â‚¬â€œ highlight section in viewport
   ================================================================ */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  /* Use IntersectionObserver to track which section is visible */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px', // trigger near vertical centre
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
})();

/* ================================================================
   3. SCROLL REVEAL ANIMATIONS
   Adds staggered data-delay attributes to children of grids,
   then uses IntersectionObserver to add .visible class.
   ================================================================ */
(function initReveal() {
  /* Add staggered delays to grid children */
  const gridSelectors = [
    '.services-grid', '.founders-grid', '.portfolio-grid',
    '.tech-categories', '.tech-grid'
  ];

  gridSelectors.forEach(sel => {
    const grid = document.querySelector(sel);
    if (!grid) return;
    grid.querySelectorAll('.reveal').forEach((item, i) => {
      // cap delay at 4 to match CSS delay classes
      item.setAttribute('data-delay', Math.min(i + 1, 4));
    });
  });

  /* Observe all .reveal elements */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12
  });

  revealEls.forEach(el => observer.observe(el));
})();

/* ================================================================
   4. CONTACT FORM Ã¢â‚¬â€œ validation + simulated submission
   ================================================================ */
(function initContactForm() {
  const form       = el('contactForm');
  const submitBtn  = el('submitBtn');
  const successMsg = el('formSuccess');

  if (!form) return;

  /* Validate a single field, return true if valid */
  function validateField(inputEl, errorId, rules) {
    const errorEl = document.getElementById(errorId);
    let message   = '';

    if (rules.required && !inputEl.value.trim()) {
      message = 'This field is required.';
    } else if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputEl.value.trim())) {
        message = 'Please enter a valid email address.';
      }
    } else if (rules.minLength && inputEl.value.trim().length < rules.minLength) {
      message = `Minimum ${rules.minLength} characters required.`;
    }

    /* Toggle error state */
    inputEl.closest('.form-group').classList.toggle('error', !!message);
    if (errorEl) errorEl.textContent = message;

    return !message;
  }

  /* Real-time validation on blur */
  const nameEl    = document.getElementById('name');
  const emailEl   = document.getElementById('email');
  const projectEl = document.getElementById('project');

  if (nameEl)    nameEl.addEventListener('blur',    () => validateField(nameEl,    'nameError',    { required: true }));
  if (emailEl)   emailEl.addEventListener('blur',   () => validateField(emailEl,   'emailError',   { required: true, email: true }));
  if (projectEl) projectEl.addEventListener('blur', () => validateField(projectEl, 'projectError', { required: true, minLength: 20 }));

  /* Form submit handler */
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent actual page reload

    /* Validate all required fields */
    const v1 = validateField(nameEl,    'nameError',    { required: true });
    const v2 = validateField(emailEl,   'emailError',   { required: true, email: true });
    const v3 = validateField(projectEl, 'projectError', { required: true, minLength: 20 });

    if (!v1 || !v2 || !v3) return; // stop if any error

    /* --- Real async submission to Spring Boot Backend --- */
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'SendingÃ¢â‚¬Â¦';

    const contactData = {
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      phone: document.getElementById('phone').value.trim(),
      projectDescription: projectEl.value.trim()
    };

    fetch('http://localhost:8080/api/contact/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(data => {
      /* Show success message */
      successMsg.hidden = false;
      successMsg.querySelector('p').textContent = data;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      /* Reset form fields */
      form.reset();

      /* Re-enable button */
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';

      /* Hide success message after 6 seconds */
      setTimeout(() => { successMsg.hidden = true; }, 6000);
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please try again later.');
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
    });
  });
})();

/* ================================================================
   5. AI CHATBOT WIDGET
   ================================================================ */
(function initChatbot() {
  const wrapper       = document.getElementById('chatbotWrapper');
  const toggleBtn     = document.getElementById('chatbotToggle');
  const chatWindow    = document.getElementById('chatbotWindow');
  const closeBtn      = document.getElementById('chatClose');
  const messagesArea  = document.getElementById('chatMessages');
  const chatInput     = document.getElementById('chatInput');
  const sendBtn       = document.getElementById('chatSend');
  const chatIcon      = document.getElementById('chatIcon');
  const closeIcon     = document.getElementById('closeIcon');

  if (!toggleBtn) return;

  let isOpen = false;

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Open / close chat window Ã¢â€â‚¬Ã¢â€â‚¬ */
  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.hidden = !isOpen;
    toggleBtn.setAttribute('aria-expanded', String(isOpen));

    /* Swap icons */
    chatIcon.style.display  = isOpen ? 'none'  : 'block';
    closeIcon.style.display = isOpen ? 'block' : 'none';

    if (isOpen) {
      /* Show bot greeting on first open */
      if (messagesArea.children.length === 0) {
        addMessage('bot', "Hi! Ã°Å¸â€˜â€¹ I'm the CodeNexuss Chatbot. How can I help you today?");
      }
      chatInput.focus();
    }
  }

  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Add a message bubble to the chat Ã¢â€â‚¬Ã¢â€â‚¬ */
  function addMessage(type, text) {
    const msg = document.createElement('div');
    msg.classList.add('chat-msg', type);
    
    // Parse markdown for basic formatting (bold, links)
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/\n/g, '<br>');
        
    msg.innerHTML = formattedText;
    messagesArea.appendChild(msg);
    /* Auto-scroll to latest message */
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Typing indicator bubble Ã¢â€â‚¬Ã¢â€â‚¬ */
  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('chat-msg', 'bot');
    indicator.id = 'typingIndicator';
    
    // Create bouncing dots
    indicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    messagesArea.appendChild(indicator);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Fetch bot response from Backend Ã¢â€â‚¬Ã¢â€â‚¬ */
  async function getBotResponse(userMsg) {
    try {
      const response = await fetch(`http://localhost:8080/api/chat/response?message=${encodeURIComponent(userMsg)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return "I'm having trouble connecting to my brain right now. Please try again later!";
    }
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Send message handler Ã¢â€â‚¬Ã¢â€â‚¬ */
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    /* Add user bubble */
    addMessage('user', text);
    chatInput.value = '';

    /* Simulate bot typing delay */
    showTypingIndicator();
    
    const botResponse = await getBotResponse(text);
    
    removeTypingIndicator();
    addMessage('bot', botResponse);
  }

  sendBtn.addEventListener('click', sendMessage);

  /* Send on Enter key */
  chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
  });
})();

/* ================================================================
   6. BACK TO TOP BUTTON
   ================================================================ */
(function initBackToTop() {
  const btn = el('backToTop');
  if (!btn) return;

  /* Show after scrolling 400px */
  window.addEventListener('scroll', function () {
    btn.hidden = window.scrollY < 400;
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ================================================================
   7. HERO CANVAS Ã¢â‚¬â€œ Particle grid animation
   Draws a grid of dots that pulse and drift slightly.
   ================================================================ */
(function initHeroCanvas() {
  const canvas = el('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  /* Resize canvas to fill hero section */
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  /* Particle configuration */
  const PARTICLE_COLOR = 'rgba(56, 189, 248,';  // cyan with variable alpha
  const SPACING        = 60;                     // grid spacing in px
  const DRIFT_SPEED    = 0.35;                   // movement speed

  /* Build particle array from grid positions */
  function buildParticles() {
    const cols = Math.ceil(canvas.width  / SPACING) + 1;
    const rows = Math.ceil(canvas.height / SPACING) + 1;
    const particles = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        particles.push({
          x:    c * SPACING,
          y:    r * SPACING,
          ox:   c * SPACING,  // origin x
          oy:   r * SPACING,  // origin y
          dx:   (Math.random() - 0.5) * DRIFT_SPEED,
          dy:   (Math.random() - 0.5) * DRIFT_SPEED,
          r:    Math.random() * 1.2 + 0.5,          // dot radius
          a:    Math.random() * 0.35 + 0.08,         // alpha
          phase: Math.random() * Math.PI * 2          // pulse phase offset
        });
      }
    }
    return particles;
  }

  let particles = buildParticles();
  let frame     = 0;

  /* Rebuild on resize */
  window.addEventListener('resize', () => {
    resize();
    particles = buildParticles();
  });

  /* Draw loop */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame += 0.012;

    particles.forEach(p => {
      /* Gentle drift around origin (bounded) */
      p.x += p.dx;
      p.y += p.dy;
      if (Math.abs(p.x - p.ox) > 15) p.dx *= -1;
      if (Math.abs(p.y - p.oy) > 15) p.dy *= -1;

      /* Pulsating alpha */
      const alpha = p.a * (0.5 + 0.5 * Math.sin(frame + p.phase));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = PARTICLE_COLOR + alpha + ')';
      ctx.fill();
    });

    /* Connect nearby particles with faint lines */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < SPACING * 1.5) {
          const lineAlpha = (1 - dist / (SPACING * 1.5)) * 0.06;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = PARTICLE_COLOR + lineAlpha + ')';
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

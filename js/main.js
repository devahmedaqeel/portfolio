/* ============================================================
   MAIN INTERACTIONS — main.js
   Cursor · Mobile Menu · Scroll · Terminal · Reveal
   Counter · Tilt · Parallax · Icon Cycler · Form · Status Bar
   ============================================================ */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────────────────
     UTILITIES
  ────────────────────────────────────────────────────────── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const hasMouse = window.matchMedia("(pointer: fine)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ──────────────────────────────────────────────────────────
     CUSTOM CURSOR  (mouse-pointer devices only)
  ────────────────────────────────────────────────────────── */
  const cursor = $("#cursor");
  const ring   = $("#cursor-ring");

  if (cursor && ring && hasMouse && !prefersReduced) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + "px"; cursor.style.top = my + "px";
    });

    (function animRing() {
      rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(animRing);
    })();

    document.addEventListener("mousedown", () => {
      cursor.style.transform = "translate(-50%,-50%) scale(1.8)";
      ring.style.transform   = "translate(-50%,-50%) scale(0.7)";
    });
    document.addEventListener("mouseup", () => {
      cursor.style.transform = ""; ring.style.transform = "";
    });
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0"; ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1"; ring.style.opacity = "1";
    });
  }

  /* ──────────────────────────────────────────────────────────
     MOBILE MENU
  ────────────────────────────────────────────────────────── */
  const hamburger  = $(".hamburger");
  const mobileMenu = $(".mobile-menu");
  let menuOpen = false;

  function openMenu() {
    if (!hamburger || !mobileMenu) return;
    menuOpen = true;
    mobileMenu.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    const spans = $$("span", hamburger);
    if (spans[0]) spans[0].style.transform = "rotate(45deg) translate(5px,5px)";
    if (spans[1]) spans[1].style.opacity   = "0";
    if (spans[2]) spans[2].style.transform = "rotate(-45deg) translate(5px,-5px)";
  }

  function closeMenu() {
    if (!hamburger || !mobileMenu) return;
    menuOpen = false;
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    const spans = $$("span", hamburger);
    if (spans[0]) spans[0].style.transform = "";
    if (spans[1]) spans[1].style.opacity   = "1";
    if (spans[2]) spans[2].style.transform = "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); menuOpen ? closeMenu() : openMenu(); }
    });
  }

  /* Close on any link inside menu */
  if (mobileMenu) {
    $$("a", mobileMenu).forEach((a) => a.addEventListener("click", closeMenu));
  }

  /* Close on Escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOpen) { closeMenu(); hamburger?.focus(); }
  });

  /* Close on outside click */
  document.addEventListener("pointerdown", (e) => {
    if (menuOpen && hamburger && mobileMenu &&
        !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  /* ──────────────────────────────────────────────────────────
     NAV: scroll state + active links
  ────────────────────────────────────────────────────────── */
  const nav      = $("nav");
  const navLinks = $$(".nav-links a");
  const sections = $$("section[id]");

  window.addEventListener("scroll", () => {
    if (!nav) return;

    /* Sticky style */
    if (window.scrollY > 10) {
      nav.classList.add("scrolled");
      nav.style.top = "var(--status-bar-h, 0px)";
    } else {
      nav.classList.remove("scrolled");
      nav.style.top = "var(--status-bar-h, 30px)";
    }

    /* Active link highlight */
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 150) current = s.id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active-link", a.getAttribute("href") === "#" + current);
    });
  }, { passive: true });

  /* ──────────────────────────────────────────────────────────
     SMOOTH SCROLL for anchor links
  ────────────────────────────────────────────────────────── */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = $(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 72;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH - 8,
        behavior: "smooth",
      });
    });
  });

  /* ──────────────────────────────────────────────────────────
     TYPING EFFECT + INTERACTIVE CLI SHELL
  ────────────────────────────────────────────────────────── */
  const typingEl    = $("#typing-text");
  const terminal    = $("#interactive-terminal");
  const historyEl   = $("#terminal-history");
  const shellInput  = $("#terminal-input");
  const shellPrompt = $("#shell-prompt");
  const scrollArea  = $("#terminal-scroll-area");
  const actionHint  = terminal ? $(".terminal-action-hint", terminal) : null;

  const PHRASES = [
    "console.log('Hello, I am Ahmed Aqeel!')",
    "react_native.build(cross_platform_app)",
    "git commit -m 'Production-ready update'",
    "n8n.workflow.run(ai_automation_pipeline)",
    "firebase.deploy(app_to_production)",
    "flutter build apk --release",
    "ollama.run('llama3.2', prompt)",
  ];

  let pIdx = 0, cIdx = 0, deleting = false, activeShell = false;

  function typeLoop() {
    if (activeShell || !typingEl) return;
    const phrase = PHRASES[pIdx];
    if (!deleting) {
      typingEl.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) { deleting = true; setTimeout(typeLoop, 2400); return; }
    } else {
      typingEl.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % PHRASES.length; }
    }
    setTimeout(typeLoop, deleting ? 36 : 74);
  }

  if (typingEl && !prefersReduced) setTimeout(typeLoop, 1200);

  /* CLI command map */
  const CLI = {
    help:
      `Available commands:<br>
       &bull; <span class="term-cmd">about</span>    — bio &amp; credentials<br>
       &bull; <span class="term-cmd">skills</span>   — full tech stack<br>
       &bull; <span class="term-cmd">projects</span> — key projects<br>
       &bull; <span class="term-cmd">contact</span>  — contact details<br>
       &bull; <span class="term-cmd">neofetch</span> — system banner<br>
       &bull; <span class="term-cmd">clear</span>    — clear history<br>
       &bull; <span class="term-cmd">exit</span>     — close shell`,
    about:
      `<b>Ahmed Aqeel</b> — Full Stack Developer &amp; Software Engineering Student.<br>
       Based in Kotli, AJK, Pakistan.<br>
       Passionate about building end-to-end solutions.<br>
       &bull; <b>Mobile:</b> React Native, Flutter<br>
       &bull; <b>Web/Backend:</b> Node.js, Express, TypeScript, React<br>
       &bull; <b>Python:</b> Automation, Web Scraping, Basic AI<br>
       Always eager to tackle new challenges and deliver clean, scalable code.`,
    skills:
      `<span class="term-highlight">Tech Stack</span><br>
       &bull; Languages  : JavaScript, C++, Python, Dart<br>
       &bull; Mobile     : React Native, Flutter, Expo<br>
       &bull; Backend    : Node.js, Firebase, Supabase, PHP<br>
       &bull; AI Tools   : Claude, ChatGPT, Gemini, Ollama, n8n<br>
       &bull; Deploy     : Vercel, Netlify, Docker<br>
       &bull; Design     : Figma, Photoshop, Illustrator, Premiere Pro`,
    projects:
      `<span class="term-highlight">Featured Projects</span><br>
       1. portfolio-pro — Web Template<br>
       2. Organization Finance — TypeScript / React<br>
       3. react-native-auth-ui — Mobile UI<br>
       4. Basic Chatbot — Python / NLP`,
    contact:
      `<span class="term-highlight">Contact</span><br>
       &bull; Email     : engrahmedaqeel14@gmail.com<br>
       &bull; WhatsApp  : +92 316 1893004<br>
       &bull; LinkedIn  : linkedin.com/in/ahmed-aqeel-2a0090271<br>
       &bull; Location  : Kotli, Azad Kashmir, Pakistan`,
    neofetch:
      `<pre class="neo-pre">   /\\   <b>ahmed@portfolio</b>
  /  \\  ─────────────────────
 /_/\\_\\ OS    : Kotli, AJK, Pakistan
 \\_/\\_/ Host  : BS Software Engineering
        Stack : React Native · Flutter · Node.js
        BaaS  : Firebase · Supabase
        AI    : Ollama · n8n · Claude
        Shell : interactive-cli v4.0.0</pre>`,
  };

  if (terminal && shellInput && historyEl) {
    const activateShell = () => {
      if (activeShell) { shellInput.focus(); return; }
      activeShell = true;
      terminal.classList.add("active-shell");
      if (shellPrompt) shellPrompt.style.display = "inline-block";
      shellInput.style.display = "inline-block";
      if (actionHint) { actionHint.textContent = "Type a command & press Enter"; actionHint.style.color = "var(--gold)"; }
      if (historyEl.children.length <= 2) {
        const w = document.createElement("div");
        w.innerHTML = `<span class="term-highlight">Shell active.</span> Type <span class="term-cmd">help</span> to list commands.`;
        historyEl.appendChild(w);
      }
      shellInput.focus();
      if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
    };

    terminal.addEventListener("click", activateShell);

    shellInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const val = shellInput.value.trim();
      shellInput.value = "";

      const echo = document.createElement("div");
      echo.innerHTML = `<span class="term-highlight">ahmed@aqeel:~$</span> <span class="term-cmd">${val}</span>`;
      historyEl.appendChild(echo);

      if (!val) { if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight; return; }

      const cmd = val.toLowerCase();

      if (cmd === "clear") { historyEl.innerHTML = ""; return; }

      if (cmd === "exit") {
        activeShell = false;
        terminal.classList.remove("active-shell");
        if (shellPrompt) shellPrompt.style.display = "none";
        shellInput.style.display = "none";
        if (actionHint) { actionHint.textContent = "Click inside to type"; actionHint.style.color = ""; }
        historyEl.innerHTML = `
          <div>// Hello World! My name is <span class="term-highlight">Ahmed Aqeel</span>.</div>
          <div>// Click inside to activate CLI shell. Try typing <span class="term-highlight">help</span>.</div>`;
        pIdx = 0; cIdx = 0; deleting = false;
        if (typingEl && !prefersReduced) setTimeout(typeLoop, 500);
        return;
      }

      const resp = document.createElement("div");
      resp.innerHTML = CLI[cmd] ||
        `<span class="term-error">command not found: ${val}</span> — type <span class="term-highlight">help</span>`;
      historyEl.appendChild(resp);
      if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
    });
  }

  /* ──────────────────────────────────────────────────────────
     SCROLL REVEAL
  ────────────────────────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      $$(".skill-fill", entry.target).forEach((bar) => {
        setTimeout(() => { bar.style.width = (bar.dataset.w || 0) + "%"; }, 200);
      });
      // Optionally unobserve after revealing to prevent re-triggering if not desired
      // revealObs.unobserve(entry.target); 
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  $$(".reveal").forEach((el) => revealObs.observe(el));

  /* ──────────────────────────────────────────────────────────
     COUNTER ANIMATION  (runs once per element)
  ────────────────────────────────────────────────────────── */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || "";
      let current  = 0;
      const step   = Math.max(1, Math.floor(target / 50));
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 28);
      counterObs.unobserve(el); /* run once */
    });
  }, { threshold: 0.5 });

  $$(".stat-num[data-target]").forEach((el) => counterObs.observe(el));

  /* ──────────────────────────────────────────────────────────
     CONTACT FORM  (FormSubmit API integration)
  ────────────────────────────────────────────────────────── */
  const contactForm = $("#contact-form");
  const formStatus  = $("#form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      /* Validate required fields */
      let valid = true;
      $$("[required]", contactForm).forEach((el) => {
        const empty = !el.value.trim();
        el.classList.toggle("input-error", empty);
        if (empty) valid = false;
      });
      if (!valid) { setStatus("error", "Please fill in all required fields."); return; }

      /* Email format check */
      const emailEl = $("#c-email", contactForm);
      if (emailEl && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
        emailEl.classList.add("input-error");
        setStatus("error", "Please enter a valid email address."); return;
      }

      const btn = $("[type='submit']", contactForm);
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      try {
        const name    = ($("#c-name",  contactForm)?.value || "").trim();
        const email   = (emailEl?.value || "").trim();
        const phone   = ($("#c-phone", contactForm)?.value || "").trim();
        const service = ($("#c-service", contactForm)?.value || "").trim();
        const budget  = ($("#c-budget",  contactForm)?.value || "").trim();
        const message = ($("#c-msg",   contactForm)?.value || "").trim();

        const res = await fetch('/api/submit-contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            service,
            budget,
            message
          })
        });

        const json = await res.json();
        if (!res.ok || !json.success) throw new Error("failed");

        showSuccessModal();
        contactForm.reset();

      } catch (err) {
        setStatus("error", "Failed to send message. Please try again.");
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Send Message →";
        }
      }
    });

    /* Clear error highlight on input */
    $$("input, textarea, select", contactForm).forEach((el) => {
      el.addEventListener("input", () => el.classList.remove("input-error"));
    });
  }

  function setStatus(type, msg) {
    if (!formStatus) return;
    formStatus.className  = `form-status ${type}`;
    formStatus.textContent = msg;
    formStatus.hidden = false;
    setTimeout(() => { formStatus.hidden = true; formStatus.className = "form-status"; }, 6000);
  }

  /* ──────────────────────────────────────────────────────────
     3-D TILT + SPOTLIGHT  (mouse devices only)
  ────────────────────────────────────────────────────────── */
  if (hasMouse && !prefersReduced) {
    $$(".project-card, .skill-card, .service-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 8;
        card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
        card.style.setProperty("--mouse-x", (e.clientX - r.left) + "px");
        card.style.setProperty("--mouse-y", (e.clientY - r.top)  + "px");
      }, { passive: true });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ──────────────────────────────────────────────────────────
     HERO PARALLAX  (mouse devices only)
  ────────────────────────────────────────────────────────── */
  const heroVisual = $(".hero-visual");
  const avatarWrap = $(".avatar-wrap");
  const floatChips = $$(".float-chip");

  if (heroVisual && avatarWrap && hasMouse && !prefersReduced) {
    heroVisual.addEventListener("mousemove", (e) => {
      const r = heroVisual.getBoundingClientRect();
      const x = (e.clientX - r.left) - r.width  / 2;
      const y = (e.clientY - r.top)  - r.height / 2;
      avatarWrap.style.transform = `translate(${x * 0.032}px, ${y * 0.032}px)`;
      floatChips.forEach((c, i) => {
        const f = (i + 1) * 0.042;
        c.style.transform = `translate(${x * f}px, ${y * f}px)`;
      });
    }, { passive: true });
    heroVisual.addEventListener("mouseleave", () => {
      avatarWrap.style.transform = "";
      floatChips.forEach((c) => { c.style.transform = ""; });
    });
  }

  /* ──────────────────────────────────────────────────────────
     SKILL ICON 3-D CYCLER
  ────────────────────────────────────────────────────────── */
  if (!prefersReduced) {
    $$(".skill-icon").forEach((icon, idx) => {
      const items = $$("img, svg", icon);
      if (items.length <= 1) return;
      let active = items.findIndex((el) => el.classList.contains("active"));
      if (active === -1) { active = 0; items[0].classList.add("active"); }
      let busy = false;

      function cycle() {
        if (busy || document.hidden) return;
        busy = true;
        const cur  = items[active];
        const next = items[(active + 1) % items.length];
        const card = icon.closest(".skill-card");
        const col  = card ? getComputedStyle(card).getPropertyValue("--card-accent").trim() : "#00e5c4";
        icon.style.boxShadow = `0 0 18px ${col}`;
        icon.style.transform = "scale(0.9) rotateY(-8deg)";
        cur.classList.add("exiting"); cur.classList.remove("active");
        setTimeout(() => {
          cur.classList.remove("exiting");
          next.classList.add("active");
          active = (active + 1) % items.length;
          setTimeout(() => { icon.style.boxShadow = ""; icon.style.transform = ""; busy = false; }, 400);
        }, 600);
      }

      setTimeout(() => setInterval(cycle, 2000), idx * 400);
    });
  }

  /* ──────────────────────────────────────────────────────────
     ROLE PILL AUTO-CYCLE
  ────────────────────────────────────────────────────────── */
  if (!prefersReduced) {
    const pills = $$(".role-pill");
    if (pills.length > 1) {
      let active = 0;
      setInterval(() => {
        pills[active].classList.remove("active");
        active = (active + 1) % pills.length;
        pills[active].classList.add("active");
      }, 2600);
    }
  }

  /* ──────────────────────────────────────────────────────────
     SCROLL TO TOP BUTTON
  ────────────────────────────────────────────────────────── */
  const scrollTopBtn = $("#scroll-top");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("visible", window.scrollY > 480);
    }, { passive: true });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ──────────────────────────────────────────────────────────
     STATUS BAR — live time + ping
  ────────────────────────────────────────────────────────── */
  const pingEl = $("#sys-ping");
  const timeEl = $("#sys-time");

  function updateStatus() {
    if (document.hidden) return;
    if (pingEl && Math.random() > 0.88)
      pingEl.textContent = `LATENCY: ${Math.floor(18 + Math.random() * 20)}ms`;
  }
  setInterval(updateStatus, 1000);
  updateStatus();

  // Dynamic Global Network Hubs
  if (timeEl) {
    const globalNodes = [
      { city: "KOTLI", country: "PK", label: "HQ SOURCE" },
      { city: "NEW YORK", country: "US", label: "ACTIVE" },
      { city: "LONDON", country: "UK", label: "STABLE" },
      { city: "TOKYO", country: "JP", label: "ONLINE" },
      { city: "FRANKFURT", country: "DE", label: "ROUTING" },
      { city: "SINGAPORE", country: "SG", label: "CONNECTED" }
    ];

    let nodeIndex = 0;
    const nodeTextEl = timeEl.querySelector(".sys-node-text");

    function cycleNetworkNodes() {
      if (document.hidden) return;
      
      const node = globalNodes[nodeIndex];
      nodeIndex = (nodeIndex + 1) % globalNodes.length;
      
      if (nodeTextEl) {
        nodeTextEl.style.opacity = "0.2";
        
        setTimeout(() => {
          if (window.innerWidth < 480) {
            nodeTextEl.textContent = `NODE: ${node.city.substring(0, 3)} [${node.country}]`;
          } else {
            nodeTextEl.textContent = `PORTAL: ${node.city} [${node.country}] // ${node.label}`;
          }
          nodeTextEl.style.opacity = "1";
        }, 200);
      }
    }

    setInterval(cycleNetworkNodes, 3500);
    cycleNetworkNodes();
  }

  /* ──────────────────────────────────────────────────────────
     DYNAMIC TOP BAR ALIGNMENT
  ────────────────────────────────────────────────────────── */
  const statusBar = $(".system-status-bar");
  if (statusBar) {
    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        document.documentElement.style.setProperty('--status-bar-h', `${entry.contentRect.height}px`);
      }
    });
    ro.observe(statusBar);
    // Initial set
    document.documentElement.style.setProperty('--status-bar-h', `${statusBar.getBoundingClientRect().height}px`);
  }

  /* ──────────────────────────────────────────────────────────
     FUTURISTIC POPUP SUCCESS MODAL
  ────────────────────────────────────────────────────────── */
  function showSuccessModal() {
    // 1. Synthesize a premium electronic chime sound using Web Audio API
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const playTone = (freq, start, duration) => {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, start);
          gainNode.gain.setValueAtTime(0.06, start);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          osc.start(start);
          osc.stop(start + duration);
        };
        const now = audioCtx.currentTime;
        playTone(523.25, now, 0.1);        // C5
        playTone(783.99, now + 0.08, 0.22); // G5
      }
    } catch (soundError) {
      // Gracefully ignore if audio context is blocked
    }

    // 2. Inject custom modal and toast styles if not already present
    if (!document.getElementById("success-modal-styles")) {
      const styles = document.createElement("style");
      styles.id = "success-modal-styles";
      styles.textContent = `
        .lead-success-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(5, 11, 24, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .lead-success-modal.show {
          opacity: 1;
        }
        .lead-success-card {
          background: rgba(13, 18, 36, 0.95);
          border: 1.5px solid rgba(0, 229, 196, 0.4);
          box-shadow: 0 0 40px rgba(0, 229, 196, 0.25), inset 0 0 20px rgba(0, 229, 196, 0.05);
          border-radius: 24px;
          padding: 40px 28px;
          max-width: 440px;
          width: 90%;
          text-align: center;
          transform: scale(0.85) translateY(30px);
          transition: transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .lead-success-modal.show .lead-success-card {
          transform: scale(1) translateY(0);
        }
        .lead-success-icon-box {
          width: 76px;
          height: 76px;
          background: rgba(0, 229, 196, 0.1);
          border: 2px solid #00e5c4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px auto;
          box-shadow: 0 0 25px rgba(0, 229, 196, 0.35);
          animation: modalPulse 2s infinite;
        }
        @keyframes modalPulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 229, 196, 0.4); }
          70% { box-shadow: 0 0 0 14px rgba(0, 229, 196, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 229, 196, 0); }
        }
        .lead-success-title {
          font-family: inherit;
          font-weight: 800;
          font-size: 22px;
          color: #ffffff;
          margin: 0 0 14px 0;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .lead-success-title span {
          color: #00e5c4;
          text-shadow: 0 0 12px rgba(0, 229, 196, 0.4);
        }
        .lead-success-text {
          font-size: 14.5px;
          line-height: 1.6;
          color: #9ca3af;
          margin: 0 0 32px 0;
        }
        .lead-success-btn {
          background: linear-gradient(135deg, #00e5c4 0%, #00b0ff 100%);
          color: #050b18;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          border: none;
          padding: 14px 44px;
          border-radius: 30px;
          cursor: pointer;
          box-shadow: 0 5px 18px rgba(0, 229, 196, 0.35);
          transition: all 0.3s ease;
        }
        .lead-success-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 229, 196, 0.55);
        }

        /* Toast Popup styles - TOP CENTER */
        .sys-toast-container {
          position: fixed;
          top: calc(var(--status-bar-h, 30px) + 20px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999999;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          pointer-events: none;
          width: 90%;
          max-width: 400px;
        }
        .sys-toast {
          pointer-events: auto;
          background: rgba(13, 18, 36, 0.96);
          border: 1.5px solid #00e5c4;
          box-shadow: 0 10px 30px rgba(0, 229, 196, 0.3), inset 0 0 10px rgba(0, 229, 196, 0.05);
          border-radius: 16px;
          padding: 16px 22px;
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          transform: translateY(-40px);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .sys-toast.show {
          transform: translateY(0);
          opacity: 1;
        }
        .sys-toast-icon {
          width: 32px;
          height: 32px;
          background: rgba(0, 229, 196, 0.1);
          border: 1.5px solid #00e5c4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00e5c4;
          box-shadow: 0 0 10px rgba(0, 229, 196, 0.3);
          flex-shrink: 0;
        }
        .sys-toast-content {
          flex-grow: 1;
        }
        .sys-toast-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 2px 0;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .sys-toast-title span {
          color: #00e5c4;
        }
        .sys-toast-desc {
          font-size: 11.5px;
          color: #9ca3af;
          margin: 0;
        }
      `;
      document.head.appendChild(styles);
    }

    // 3. Create and trigger a beautiful floating Toast Notification Popup at top center
    let toastContainer = document.querySelector(".sys-toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className = "sys-toast-container";
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.className = "sys-toast";
    toast.innerHTML = `
      <div class="sys-toast-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="#00e5c4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div class="sys-toast-content">
        <h4 class="sys-toast-title"><span>Successfully Sent!</span></h4>
        <p class="sys-toast-desc">We will contact you soon.</p>
      </div>
    `;
    toastContainer.appendChild(toast);

    // Slide in toast
    setTimeout(() => toast.classList.add("show"), 100);

    // Auto-remove toast after 3.5 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 500);
    }, 3500);

    // 4. Create and trigger the Main Center Glassmorphic Modal
    const modal = document.createElement("div");
    modal.className = "lead-success-modal";
    modal.innerHTML = `
      <div class="lead-success-card">
        <div class="lead-success-icon-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00e5c4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="34" height="34">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 class="lead-success-title"><span>Successfully Sent!</span></h3>
        <p class="lead-success-text">
          We will contact you soon.
        </p>
        <button class="lead-success-btn" type="button">Continue</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Fade in modal
    setTimeout(() => modal.classList.add("show"), 150);

    // Close logic
    const closeBtn = modal.querySelector(".lead-success-btn");
    const closeModal = () => {
      modal.classList.remove("show");
      setTimeout(() => modal.remove(), 400);
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

})();


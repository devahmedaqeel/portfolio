/* ============================================================
   BACKGROUND ANIMATIONS — bg.js
   Layers: 1) Hex grid + scanner  2) Neural network  3) Code rain
   Performance: paused on hidden tab · simplified on mobile
                · skipped when prefers-reduced-motion is set
   ============================================================ */

(function () {
  "use strict";

  /* Skip everything if user prefers reduced motion */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const mobile = () => window.innerWidth < 768;

  /* ============================================================
     LAYER 1 — HEX GRID + SCANNER + CONSTELLATION
     ============================================================ */
  (function initBg() {
    const canvas = document.getElementById("c-bg");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, hexes = [];

    const hexR = () => (mobile() ? 60 : 32);

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildHexes();
    }

    function buildHexes() {
      hexes = [];
      if (mobile()) return; /* skip hex grid on mobile for perf */
      const r = hexR();
      const cols = Math.ceil(W / (r * 1.75)) + 2;
      const rows = Math.ceil(H / (r * 1.52)) + 2;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          hexes.push({
            x:     col * r * 1.75 + (row % 2 ? r * 0.875 : 0),
            y:     row * r * 1.52,
            phase: Math.random() * Math.PI * 2,
            speed: 0.003 + Math.random() * 0.004,
            base:  0.015 + Math.random() * 0.03,
          });
        }
      }
    }

    function drawHex(cx, cy, r, a) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + r * Math.cos(ang);
        const y = cy + r * Math.sin(ang);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0,229,196,${a})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    let scanY = 0;
    const N = mobile() ? 10 : 32;
    const pts = Array.from({ length: N }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      r:  Math.random() * 1.2 + 0.4,
      a:  Math.random() * 0.22 + 0.04,
    }));

    function draw() {
      if (document.hidden) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);

      /* Background gradient */
      const g = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.85);
      g.addColorStop(0, "rgba(0,20,55,0.5)");
      g.addColorStop(0.5, "rgba(0,8,24,0.38)");
      g.addColorStop(1, "rgba(2,4,8,0.72)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      /* Hex grid (desktop) */
      const r = hexR();
      hexes.forEach((h) => {
        h.phase += h.speed;
        drawHex(h.x, h.y, r - 1, h.base * (0.5 + 0.5 * Math.sin(h.phase)));
      });

      /* Scanner line */
      scanY = (scanY + 0.55) % H;
      const sg = ctx.createLinearGradient(0, scanY - 55, 0, scanY + 55);
      sg.addColorStop(0, "transparent");
      sg.addColorStop(0.5, "rgba(0,229,196,0.045)");
      sg.addColorStop(1, "transparent");
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 55, W, 110);
      ctx.strokeStyle = "rgba(0,229,196,0.09)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(W, scanY); ctx.stroke();

      /* Constellation dots */
      pts.forEach((p) => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,196,${p.a})`; ctx.fill();
      });

      /* Connections (desktop only) */
      if (!mobile()) {
        const D = 110;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < D) {
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.strokeStyle = `rgba(0,229,196,${0.055 * (1 - d / D)})`;
              ctx.lineWidth = 0.5; ctx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    draw();
  })();

  /* ============================================================
     LAYER 2 — NEURAL NETWORK ANIMATION
     ============================================================ */
  (function initNeural() {
    const canvas = document.getElementById("c-neural");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, nodes = [], signals = [], activations = [], tick = 0;

    const ARCH_D = [4, 6, 8, 8, 6, 4];
    const ARCH_M = [3, 4, 4, 3];
    const arch   = () => (mobile() ? ARCH_M : ARCH_D);

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildNet();
    }

    function buildNet() {
      nodes = []; signals = [];
      const A = arch();
      A.forEach((count, li) => {
        const lx = W * 0.08 + li * (W * 0.84 / (A.length - 1));
        for (let ni = 0; ni < count; ni++) {
          const ly = H * 0.12 + ni * (H * 0.76 / (count - 1 || 1));
          nodes.push({ x: lx, y: ly, r: 5, layer: li, idx: ni,
            alpha: 0.3 + Math.random() * 0.28, phase: Math.random() * Math.PI * 2, glow: 0 });
        }
      });
      activations = nodes.map(() => Math.random());
    }

    function spawnSignal() {
      const A = arch();
      const li = Math.floor(Math.random() * (A.length - 1));
      const from = nodes.filter((n) => n.layer === li);
      const to   = nodes.filter((n) => n.layer === li + 1);
      if (!from.length || !to.length) return;
      const f = from[Math.floor(Math.random() * from.length)];
      const t = to[Math.floor(Math.random() * to.length)];
      const cols = ["rgba(0,229,196,", "rgba(59,158,255,", "rgba(139,92,246,"];
      signals.push({ fx: f.x, fy: f.y, tx: t.x, ty: t.y, p: 0,
        spd: 0.008 + Math.random() * 0.012,
        col: cols[Math.floor(Math.random() * cols.length)],
        fn: f, tn: t });
      f.glow = 1.2;
    }

    function draw() {
      if (document.hidden) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);

      /* Connections */
      const A = arch();
      for (let li = 0; li < A.length - 1; li++) {
        const fr = nodes.filter((n) => n.layer === li);
        const to = nodes.filter((n) => n.layer === li + 1);
        fr.forEach((f) => to.forEach((t) => {
          const w = Math.abs(activations[nodes.indexOf(f)] - 0.5) * 2;
          ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = `rgba(139,92,246,${0.03 + w * 0.035})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }));
      }

      /* Signals */
      signals = signals.filter((s) => {
        s.p += s.spd;
        if (s.p >= 1) { s.tn.glow = 1.0; return false; }
        const px = s.fx + (s.tx - s.fx) * s.p;
        const py = s.fy + (s.ty - s.fy) * s.p;
        const gr = ctx.createRadialGradient(px, py, 0, px, py, 12);
        gr.addColorStop(0, s.col + "0.6)"); gr.addColorStop(1, "transparent");
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = s.col + "0.92)"; ctx.fill();
        return true;
      });

      /* Nodes */
      nodes.forEach((n) => {
        n.phase += 0.02; if (n.glow > 0) n.glow -= 0.02;
        const a = n.alpha * (0.7 + 0.3 * Math.sin(n.phase));
        const g = Math.max(0, n.glow);
        if (g > 0) {
          const gg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 20);
          gg.addColorStop(0, `rgba(0,229,196,${g * 0.38})`); gg.addColorStop(1, "transparent");
          ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(n.x, n.y, 20, 0, Math.PI * 2); ctx.fill();
        }
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,229,196,${a * 0.28})`; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${a * 0.62})`; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x - 1.5, n.y - 1.5, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a * 0.42})`; ctx.fill();
      });

      tick++;
      const max = mobile() ? 8 : 16;
      if (tick % 14 === 0 && signals.length < max) spawnSignal();
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    draw();
  })();

  /* ============================================================
     LAYER 3 — ML CODE RAIN  (desktop only)
     ============================================================ */
  (function initCodeRain() {
    if (mobile()) return; /* skip on mobile — too heavy */
    const canvas = document.getElementById("c-code");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, cols, drops, speeds, alphas;

    const SYM = [
      "0","1","λ","∑","∇","σ","θ","α","β","γ","∂","∫","π","ε","μ","ω",
      "W","b","x","y","z","T","∞","→","←","↑","⊕","⊗",
      "relu","loss","grad","epoch","batch","train","predict",
      "model","layer","dense","lstm","conv","dropout",
      "softmax","sigmoid","tanh","optim","Adam","SGD","lr",
      "[0.98]","0.001","dL/dw","w-=η∇","import","return","class","def",
    ];
    const CW = 18;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cols   = Math.floor(W / CW);
      drops  = Array.from({ length: cols }, () => Math.random() * -120);
      speeds = Array.from({ length: cols }, () => 0.18 + Math.random() * 0.42);
      alphas = Array.from({ length: cols }, () => 0.055 + Math.random() * 0.11);
    }

    function draw() {
      if (document.hidden) { requestAnimationFrame(draw); return; }
      ctx.fillStyle = "rgba(2,4,8,0.05)"; ctx.fillRect(0, 0, W, H);
      ctx.font = "10px 'JetBrains Mono', monospace";

      for (let i = 0; i < cols; i++) {
        const y = drops[i] * CW;
        const x = i * CW;
        ctx.fillStyle = `rgba(200,255,245,${alphas[i] * 2.6})`;
        ctx.fillText(SYM[Math.floor(Math.random() * SYM.length)], x, y);
        if (drops[i] > 1) {
          ctx.fillStyle = `rgba(0,229,196,${alphas[i] * 1.4})`;
          ctx.fillText(SYM[Math.floor(Math.random() * SYM.length)], x, y - CW);
        }
        if (drops[i] > 2) {
          ctx.fillStyle = `rgba(0,180,140,${alphas[i] * 0.72})`;
          ctx.fillText(SYM[Math.floor(Math.random() * SYM.length)], x, y - CW * 2);
        }
        drops[i] += speeds[i];
        if (drops[i] * CW > H + 40 && Math.random() > 0.974) drops[i] = Math.random() * -50;
      }

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    draw();
  })();

})();

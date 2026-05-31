╔══════════════════════════════════════════════════════════════╗
║   MUHAMMAD ALI — ADVANCED PORTFOLIO WEBSITE                  ║
║   Complete Multi-File Source Code                            ║
╚══════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  FILE STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  portfolio/
  ├── index.html          ← Main HTML (all content)
  ├── css/
  │   └── style.css       ← All styles + responsive
  ├── js/
  │   ├── bg.js           ← 3-layer canvas animations
  │   └── main.js         ← Interactions & UI logic
  └── README.txt          ← This file

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HOW TO VIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Extract the ZIP file
  2. Open the "portfolio" folder
  3. Double-click index.html → opens in browser
  
  NOTE: Keep all files together (the css/ and js/ folders
  must stay alongside index.html for it to work)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BACKGROUND ANIMATIONS (bg.js)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Layer 1 — Hex Grid + Scanner + Constellation
    • Animated hexagonal grid with pulsing cells
    • Horizontal scanner line sweeping the screen
    • Floating data points with constellation connections

  Layer 2 — Neural Network
    • Full multi-layer perceptron visualization
    • Nodes with glow effects and pulse animation
    • Colored signals firing between layers in real-time
    • Simulated weight connections shown as thin lines

  Layer 3 — ML Code Rain
    • Matrix-style falling ML symbols
    • Includes: Python keywords, math symbols (∇, σ, ∑, λ),
      ML terms (relu, softmax, lstm, epochs, grad, loss...)
    • Bright leading character with fading trail

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HOW TO CUSTOMIZE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ▶ YOUR PHOTO
    In index.html, find this comment:
    <!-- APNI PHOTO YAHAN LAGAYEIN -->
    
    Replace the <span class="avatar-emoji"> block with:
    <img src="your-photo.jpg" alt="Muhammad Ali"
         style="width:100%;height:100%;
                object-fit:cover;border-radius:inherit;">
    
    Put your photo in the same folder as index.html.

  ▶ YOUR NAME
    Search "Muhammad Ali" in index.html → replace with your name
    Also update the <title> tag at the top.

  ▶ YOUR EMAIL
    Search "muhammadali@gmail.com" → replace in 2-3 places

  ▶ YOUR PHONE
    Search "+92 300 1234567" → replace with your number
    Also update the WhatsApp link:
    href="https://wa.me/923001234567" → change 923001234567

  ▶ YOUR LINKEDIN
    Search "linkedin.com/in/muhammadali-dev" → replace
    Also update the href on the LinkedIn social button.

  ▶ YOUR GITHUB
    Find: <a href="https://github.com/devahmedaqeel" class="social-btn"
    Replace href with your GitHub profile URL.

  ▶ YOUR CITY / LOCATION
    Search "Rawalpindi" → replace with your city
    Search "Punjab, Pakistan" → update as needed

  ▶ PROJECT LINKS
    Find all href="#" inside proj-link elements and replace
    with your actual GitHub/live demo URLs.

  ▶ COLORS (optional)
    Open css/style.css and look for the :root block at the top.
    Change --accent to any color you like.
    All colors cascade from there automatically.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  FREE HOSTING (Go Live in Minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  NETLIFY (Easiest — Drag & Drop):
    1. Go to netlify.com → Sign up free
    2. Drag the entire "portfolio" folder to the deploy area
    3. Your site is live in 30 seconds!
    4. Get a free URL like yourname.netlify.app
    5. Connect your own domain for free (optional)

  GITHUB PAGES:
    1. Create a GitHub account → New repository
    2. Upload all portfolio files
    3. Go to Settings → Pages → Deploy from main branch
    4. Live at yourusername.github.io/portfolio

  VERCEL:
    1. Go to vercel.com → Sign up with GitHub
    2. Import your repository
    3. Deploy automatically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  RESPONSIVE BREAKPOINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Desktop  (> 1200px): Full layout, all animations
  Laptop   (1024px):   Adjusted grid, same animations
  Tablet   (768px):    Single column, mobile nav
  Mobile   (480px):    Compact layout, touch optimized
  
  Custom cursor is hidden on mobile (touch devices)
  All canvas animations are performance-optimized

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Made with ❤️ — Rawalpindi, Punjab, Pakistan
  © 2025 Muhammad Ali

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

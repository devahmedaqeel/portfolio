# 💻 Ahmed Aqeel — Premium AI-Powered Full-Stack Developer Portfolio

Welcome to the official repository of my advanced portfolio website. This is a high-performance, responsive, and futuristic developer portfolio designed to showcase software engineering credentials, full-stack specialties, mobile expertise, and automated AI workflows.

🚀 **Live Demo:** [ahmedaqeel.dev](https://ahmedaqeel.dev/) *(or your custom Vercel domain)*

---

## 🌌 Key Highlights & Features

### 1. 🛡️ Secure Vercel Serverless API & Nodemailer Contact Form
- **Zero Third-Party Router Dependencies**: Powered by a custom Node.js serverless function (`/api/submit-contact`) running securely on **Vercel Serverless Architecture** (`nodejs20.x`).
- **Nodemailer SMTP Transporter**: Delivers incoming contact inquiries directly to the destination inbox via secure Google SMTP server connections.
- **Zero Exposed Credentials**: Sensitive Gmail authentication tokens are kept strictly server-side using Vercel Environment Variables, protecting them from client-side script inspection.
- **Premium HTML Email Template**: Incoming submissions are automatically formatted into beautiful, high-contrast HTML email sheets with full visitor data (Name, Email, WhatsApp/Phone, Service, Message, Timestamp) and one-click quick reply routing.
- **Dynamic Frontend AJAX Logic**: Smooth submit state handling with active button loaders (`Sending...`), double-submission locking, fields resetting, and dynamic neon success/error status alerts.

### 2. 🤖 Interactive Developer Terminal (CLI Shell)
- A simulated command-line terminal supporting a library of utility interactions:
  - `help` — Lists available commands.
  - `about` — Renders engineering bio, background, and academic details.
  - `skills` — Presents comprehensive tech stack ratings.
  - `projects` — Details featured production repositories.
  - `contact` — Prints active connection portals.
  - `neofetch` — Outputs a custom system metadata banner.
  - `clear` / `exit` — CLI window controls.

### 3. 🌍 Spinning Wireframe Globe & Global Portal Latency Ticker
- **3D SVG Globe**: A beautiful, hardware-accelerated wireframe globe vector that rotates infinitely at constant velocity.
- **Global Network Portal Ticker**: Dynamically cycles through localized server routing nodes (`KOTLI [PK]`, `NEW YORK [US]`, `LONDON [UK]`, `TOKYO [JP]`, etc.) along with mock server latencies to convey an immersive tech aesthetic.
- **Fluid Mobile Adaptation**: Automatically collapses long node names into clean compressed formats (`NODE: KOT [PK]`) to prevent layout clipping on small viewports.

### 4. 🎛️ AI Full-Stack Developer Tools Section
- A gorgeous **5x2 glassmorphism grid** containing official brand SVG vector assets (ChatGPT, Claude, Gemini, Copilot, Cursor, Ollama, n8n, Hugging Face, Perplexity, Replit).
- Outfitted with sleek vertical transitions (`translateY(-6px)`), customized neon border box-shadow glows matching official brand colors, and accessible ARIA attributes.

### 5. 📸 Mathematical Portrait Card Alignments
- Portrait boundary frame with sleek custom neon corner brackets.
- Floating status badges representing core specialties drift independently using desynchronized floating animations to simulate a parallax feel.
- Dotted connecting paths and pulsing anchor nodes stop mathematically right at the picture frame border to prevent image overlap.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend Layout** | Semantic HTML5, Vanilla CSS3 (Custom Grid/Flex layouts, Keyframe Animations) |
| **Interactions** | Vanilla JavaScript (ES6+, ResizeObserver, IntersectionObserver) |
| **Backend Functions** | Node.js (Vercel Serverless Function Runtime `nodejs20.x`) |
| **Email Protocol** | Nodemailer (SMTP Secure Transport Protocol) |
| **Package Management** | npm / Node Package Manifest |
| **Hosting & DNS** | Vercel Serverless Edge Platform |

---

## 📦 File Structure

```bash
portfolio-pro/
├── api/
│   └── submit-contact.js   # Vercel Node.js Serverless SMTP Endpoint
├── css/
│   └── style.css           # Premium futuristic styling & media overrides
├── js/
│   ├── bg.js               # Canvas neural network & ML code rain layers
│   └── main.js             # Interactive terminal, AJAX form, & UI nodes
├── index.html              # Core semantic layout & metadata configurations
├── package.json            # Node dependency manifest (Nodemailer configuration)
├── vercel.json             # Vercel serverless runtime definitions
└── README.md               # You are here!
```

---

## ⚙️ Local Installation & Development

To test the frontend interactions and view the styles locally:

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/portfolio-pro.git
   ```
2. Navigate into the project folder:
   ```bash
   cd portfolio-pro
   ```
3. Open `index.html` directly in your web browser, or launch it using a local live-reload extension (e.g., Live Server in VS Code).

---

## 🚀 How to Deploy on Vercel (Production)

To get your secure contact form and serverless API fully operational in production, deploy the project to Vercel and configure your environment variables:

### Step 1: Push your Code to GitHub
Ensure all your project files (including `package.json`, `vercel.json`, and the `api/` folder) are committed and pushed to your personal GitHub repository.

### Step 2: Import Project to Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository containing the portfolio project.

### Step 3: Add environment Variables
Before clicking the **Deploy** button, expand the **Environment Variables** section and add the following three keys:

| Key | Value | Description |
| :--- | :--- | :--- |
| **`GMAIL_USER`** | `engrahmedaqeel14@gmail.com` | Your authenticating Gmail address |
| **`GMAIL_APP_PASSWORD`** | `xxxx xxxx xxxx xxxx` | The 16-character secure App Password generated from Google settings (without spaces) |
| **`ADMIN_EMAIL`** | `engrahmedaqeel14@gmail.com` | The destination email where form messages will be sent |

### Step 4: Click Deploy!
Vercel will compile the assets, automatically install the `nodemailer` dependency, initialize the serverless function, and host your premium portfolio globally.

---

## 🔒 Generating Your Google SMTP App Password

To allow Nodemailer to relay emails securely through Google's SMTP servers, you must generate a dedicated App Password for your account:

1. Go to your [Google Account Dashboard](https://myaccount.google.com/).
2. Select **Security** from the left-hand navigation panel.
3. Under the *How you sign in to Google* section, ensure **2-Step Verification** is enabled.
4. Click on **2-Step Verification**, scroll to the very bottom, and select **App Passwords**.
5. Type `Portfolio` in the **App name** box, then click **Create**.
6. Google will display a glowing yellow box containing a **16-character app password** (e.g., `abcd efgh ijkl mnop`).
7. Copy this password immediately (without spaces) and use it as the value for your `GMAIL_APP_PASSWORD` Vercel environment variable!

---

## 🎓 Academic Credentials

- **Degree Program:** BS in Software Engineering (2022 — 2026)
- **Institution:** University of Kotli, Azad Jammu & Kashmir, Pakistan
- **Core Specialties:** Cross-Platform Apps (React Native / Flutter), Backend Architecture (Node.js / Express), AI Integration & Workflows (n8n / LangChain / Ollama), Frontend Crafting (CSS Grid, Parallax, Tilt).

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to customize and adapt it for your personal brand!

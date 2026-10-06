# ⚡ LLaMA Prompt Studio

> A native Mac desktop app that connects to your local Ollama/LLaMA models and generates ultra-detailed, production-ready prompts for **Lovable.dev** — creating complete multi-page React websites with GSAP animations and Tailwind CSS.

![LLaMA Prompt Studio](./docs/screenshot.png)

---

## 🎯 What It Does

LLaMA Prompt Studio is a powerful workflow tool that:

1. **Connects to local LLaMA models** via Ollama (no API costs, full privacy)
2. **Guides you through website configuration** — templates, pages, animations, color palettes
3. **Generates highly-detailed Lovable.dev prompts** that produce stunning React websites
4. **Saves prompt history** locally so you can revisit and reuse

The generated prompts instruct Lovable.dev to build websites with:
- **React 18 + Vite** for the frontend
- **Tailwind CSS v3** for styling with custom design tokens
- **GSAP 3** with ScrollTrigger, SplitText, MorphSVG for animations
- **React Router v6** for multi-page navigation
- Full responsive design, accessibility, and SEO

---

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+** — [nodejs.org](https://nodejs.org)
2. **Ollama** — [ollama.com](https://ollama.com)

### Step 1: Install Ollama & Pull a Model

```bash
# Install Ollama (Mac)
brew install ollama

# Start Ollama service
ollama serve

# Pull a recommended model (in a new terminal)
ollama pull llama3.2        # Fast, 2GB — great for prompts
ollama pull llama3.1:8b     # More capable, 5GB
ollama pull mistral:latest  # Alternative, excellent writing
ollama pull qwen2.5:7b      # Great multilingual support
```

> **Recommendation:** `llama3.2` is fast and excellent for creative writing tasks. For higher quality prompts, use `llama3.1:8b` or `mistral`.

### Step 2: Install & Run the App

```bash
# Clone or download this project
cd llama-prompt-studio

# Install dependencies
npm install

# Run in development mode
npm start
```

This starts Vite dev server + launches the Electron window.

### Step 3: Build a macOS App (Optional)

```bash
# Build production .dmg
npm run package

# Find the .dmg in ./dist/
```

---

## 🎨 Website Templates

| Template | Pages | Best For |
|----------|-------|----------|
| 🚀 SaaS Landing | 7 pages | Product launches, startups |
| 🎨 Creative Portfolio | 5 pages | Designers, developers, artists |
| ⚡ Digital Agency | 6 pages | Marketing agencies |
| 🛍️ E-Commerce | 6 pages | Product stores |
| 💡 Tech Startup | 6 pages | B2B tech products |
| 🍽️ Restaurant/Food | 6 pages | Hospitality businesses |
| 📰 Blog/Magazine | 6 pages | Content creators |
| 🔮 NFT/Web3 | 6 pages | Web3 platforms |

---

## ✨ GSAP Animations Available

- **Scroll Reveal** — Elements fade and slide in on scroll
- **Parallax Hero** — Depth-layered hero section
- **Text Reveal** — Cinematic split-text animations
- **Stagger Cards** — Cascading card entrance animations
- **Counter Animation** — Number count-up effects
- **Magnetic Hover** — Cursor attraction effects
- **Custom Cursor** — Branded cursor with trail
- **Infinite Marquee** — Horizontal ticker scrolling
- **Split Text** — Per-character/word animations
- **Page Transitions** — GSAP-powered route transitions
- **SVG Distort** — Image warp effects on hover
- **Scroll Scrub** — Frame-perfect scroll animations
- **Floating Elements** — Gentle bobbing UI elements
- **SVG Morphing** — Shape morphing transitions
- **Typewriter** — Text typing animations
- **Gradient Animation** — Shifting color backgrounds
- **3D Card Tilt** — Perspective tilt on mouse move
- **Particle Background** — Canvas particle system

---

## 🛠 Architecture

```
llama-prompt-studio/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Secure IPC bridge
├── src/
│   ├── App.jsx          # Root component
│   ├── main.jsx         # React entry point
│   ├── index.css        # Tailwind + global styles
│   ├── components/
│   │   ├── TitleBar.jsx       # macOS-style title bar
│   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   ├── ModelSelector.jsx  # Ollama model picker
│   │   ├── ConfigureTab.jsx   # Project configuration
│   │   ├── AnimationsTab.jsx  # Animation selector
│   │   ├── GenerateTab.jsx    # Generation + output
│   │   └── HistoryTab.jsx     # Saved prompts
│   ├── hooks/
│   │   └── useOllama.js   # Ollama connection + generation hooks
│   └── data/
│       ├── templates.js   # Website templates, animations data
│       └── systemPrompt.js # LLM system prompt + user prompt builder
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

---

## 🔌 Ollama API Integration

The app communicates with Ollama via HTTP on `localhost:11434`:

- `GET /api/tags` — List available models
- `POST /api/chat` — Stream chat completions

**Streaming:** Token-by-token streaming is implemented for real-time output display using Electron IPC events (`ollama:token`, `ollama:done`, `ollama:error`).

---

## ⚙️ Configuration Tips

### For Best Prompt Quality

| Model | Speed | Quality | RAM Needed |
|-------|-------|---------|------------|
| llama3.2:1b | ⚡⚡⚡ | ★★☆ | 1.5GB |
| llama3.2:3b | ⚡⚡ | ★★★ | 2GB |
| llama3.1:8b | ⚡ | ★★★★ | 6GB |
| mistral:7b | ⚡ | ★★★★ | 5GB |
| llama3.1:70b | 🐌 | ★★★★★ | 48GB+ |

### Prompt Length

The system prompt requests **2000+ word prompts**. Larger models produce significantly more detailed and useful prompts. The progress bar shows a simulated estimate — actual completion depends on model speed.

---

## 🚧 Troubleshooting

**"Ollama not running" error:**
```bash
ollama serve
```

**No models appear:**
```bash
ollama pull llama3.2
```

**Generation is too slow:**
- Use a smaller model (llama3.2:1b or llama3.2:3b)
- Close other apps to free RAM
- Consider GPU acceleration (Metal on M1/M2 Mac is automatic with Ollama)

**Electron window doesn't open:**
```bash
# Make sure Vite is running first, then:
npm run dev     # in one terminal
npm run electron:dev  # in another terminal
```

---

## 📄 License

MIT — use freely for personal and commercial projects.

---

## 🙏 Credits

Built with:
- [Electron](https://electronjs.org) — Desktop app framework
- [Vite](https://vitejs.dev) + [React](https://react.dev) — UI
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Ollama](https://ollama.com) — Local LLM runtime
- [Lovable.dev](https://lovable.dev) — AI website builder

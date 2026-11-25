<div align="center">
  <img src="public/logo.svg" alt="PIXIO Logo" width="72" height="72" />
  <h1>PIXIO – AI-Powered Flyer Generator</h1>
  <p>
    <strong>Translate natural language prompts directly into studio-grade, print-ready flyers and marketing assets in seconds.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?style=flat-square&logo=supabase&logoColor=black" alt="Supabase" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
  </p>
</div>

---

## Overview

**PIXIO** is a modern, prompt-driven AI flyer generation studio built for event creators, small businesses, marketers, and designers. Instead of wrestling with complex canvas layers or rigid templates, users simply describe their idea in plain English, select an aesthetic mood and output dimensions, and let PIXIO synthesize a complete, high-resolution design ready for digital sharing or commercial print.

---

## Key Features

- **Direct Prompt-to-Design Studio (`/generate`)**: Two-pane workspace pairing a sticky prompt console with a live, aspect-aware artboard preview and keyboard shortcut support (`⌘ + Enter` / `Ctrl + Enter`).
- **AI Prompt Enhancement**: One-click prompt expansion powered by `google/gemini-3-flash-preview` to turn brief ideas into detailed creative briefs.
- **6 Curated Aesthetic Styles**:
  - **Modern** · Clean geometric borders, slate grey & sleek contrast
  - **Vibrant** · High-voltage neon accents & electric gradients
  - **Elegant** · Refined gold, warm marble tones & luxury typography
  - **Minimal** · Generous whitespace, cream canvas & botanical lines
  - **Creative** · Surreal graphic compositions & expressive textures
  - **Bold** · Massive headline typography & high-impact monochrome
- **Preset & Custom Output Dimensions**:
  - Built-in presets: **Poster `3:4`** (`1200×1600 px`), **Square `1:1`** (`1080×1080 px`), **Story `9:16`** (`1080×1920 px`), and **Banner `16:9`** (`1920×1080 px`).
  - **Custom Size (`W × H px`)**: Define custom pixel dimensions (`256`–`4096 px`) with live artboard resizing and AI orientation matching.
- **Multi-Format Export Engine**: Export flyers at full target resolution in **PNG** (lossless 300 DPI), **JPG**, **PDF** (lazy-loaded `jspdf` document), **WEBP**, and **SVG** (vector wrapper).
- **Generation History & Snapshots (`/history`)**: Paginated, cached archive backed by Supabase PostgreSQL (`flyer_history`) with instant skeleton loading, full-screen inspection modal, and multi-format re-export.
- **Authentication & Seamless Guest Mode**: Full Supabase Auth (`/auth`, `/profile`, `/reset-password`) with automatic guest session fallback (`ensureSession`) so visitors can generate immediately without forced login walls.
- **Adaptive Dark/Light UI**: Floating glassmorphic navigation bar, custom vector branding, and hardware-accelerated `IntersectionObserver` scroll-reveal animations.

---

## Application Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | `Landing` | Hero command bar, floating 3D tiles, 3-step studio workflow, and merged *Behind the Magic* overview |
| `/generate` | `Generate` | Two-pane AI flyer studio with prompt enhancement, style cards, custom sizing, and multi-format export |
| `/history` | `History` | Paginated flyer archive with skeleton loading, detail modal, and multi-format downloads |
| `/about` | `About` | Mission, vision, founder note, platform roadmap, and technical architecture |
| `/profile` | `Profile` | User profile management, avatar upload, and account settings |
| `/auth` | `Auth` | Email/password login, registration, and password reset trigger |
| `/reset-password` | `ResetPassword` | Password recovery flow |
| `/admin` | `AdminDashboard` | Platform metrics and administrative overview |
| `*` | `NotFound` | 404 fallback page |

---

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5 (with manual vendor chunking for React, React Query, and Supabase)
- **Styling**: Tailwind CSS + `tailwindcss-animate`
- **UI Primitives**: Radix UI + shadcn/ui + Lucide React icons
- **State & Data**: TanStack React Query v5 + React Hook Form + Zod
- **Export Utilities**: HTML5 Canvas API + `jspdf` (dynamically imported on PDF export)

### Backend & AI
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Auth, Edge Functions)
- **AI Gateway (`supabase/functions/generate-flyer`)**:
  - `google/gemini-3-flash-preview` — Smart prompt enhancement & creative suggestions
  - `google/gemini-3-pro-image-preview` — Full-bleed flyer image synthesis with aspect-ratio configuration

---

## Project Structure

```text
├── public/
│   ├── favicon.svg              # Vector browser favicon
│   ├── logo.svg                 # Standalone brand emblem
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                  # Radix / shadcn UI primitives
│   │   ├── DownloadMenu.tsx     # Multi-format export dropdown (PNG/JPG/PDF/WEBP/SVG)
│   │   ├── FlyerGenerator.tsx   # Main two-pane studio workspace
│   │   ├── Footer.tsx           # Multi-column footer & newsletter form
│   │   ├── Logo.tsx             # Custom vector LogoMark & Logo wordmark
│   │   ├── Navbar.tsx           # Fixed floating glass navigation bar
│   │   ├── ScrollReveal.tsx     # IntersectionObserver scroll animations
│   │   └── ThemeToggle.tsx      # Dark / light theme switcher
│   ├── integrations/
│   │   └── supabase/            # Supabase client, guest session helper & types
│   ├── lib/
│   │   ├── exportFlyer.ts       # Canvas & jsPDF multi-format exporter
│   │   └── utils.ts             # Classname & helper utilities
│   ├── pages/                   # Route-level page components
│   ├── App.tsx                  # Router, QueryClient & route definitions
│   └── index.css                # Tailwind directives & CSS theme tokens
├── supabase/
│   ├── functions/
│   │   └── generate-flyer/      # Deno Edge Function for AI generation & rate limiting
│   ├── migrations/              # SQL schema & RLS policies
│   └── config.toml              # Supabase project configuration
├── index.html                   # Entry HTML & metadata
├── package.json
└── vite.config.ts               # Vite & Rollup manualChunks config
```

---

## Getting Started

### Prerequisites
- **Node.js** `18+` (or **Bun**)
- A **Supabase** project (for Auth, PostgreSQL `flyer_history` table, and Edge Functions)

### 1. Clone & Install

```bash
git clone https://github.com/piyushlandge04/piyushai.git
cd piyushai
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

Set the AI gateway secret on your Supabase Edge Function environment:

```bash
supabase secrets set LOVABLE_API_KEY=your_lovable_api_key
```

### 3. Deploy Edge Function (Optional / Backend Updates)

```bash
supabase functions deploy generate-flyer
```

### 4. Start the Development Server

```bash
npm run dev
```

The app runs at `http://localhost:8080`.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Vite development server on port `8080` |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run build:dev` | Build using development mode settings |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## Author

**Piyush Landge** 

## License

This project is licensed under the **MIT License**.

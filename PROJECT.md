# FastToolKits — Project Document

## What Is FastToolKits

FastToolKits is a free online multi-tool website where anyone can access
lightweight, fast, and easy-to-use web tools without signing up, downloading
anything, or paying. Every tool lives on its own page under one brand and one
domain: fasttoolkits.com

---

## Business Goal

Generate passive income through:
1. Google AdSense display advertising (primary, first monetization method)
2. Affiliate links inside relevant tools (secondary, added gradually)
3. Optional paid tier in the future (remove ads, batch processing, save history)

Target: $500 to $2,000/month passive income within 12 to 18 months of launch.
This is a solo founder side project, not a startup.

---

## Target Audience

Primary: Adults in the USA, UK, Canada, and Western Europe
- Regular people who need a quick calculation or conversion
- Students looking for homework help tools
- Small business owners who need simple utilities
- Content creators, designers, and freelancers

These users:
- Find the site through Google search
- Want a result in under 30 seconds
- Do not want to sign up or install anything
- Are comfortable spending $5 to $10/month if a premium tier is offered later

---

## Domain and Brand

- Domain: fasttoolkits.com (purchased on Spaceship)
- Brand name: FastToolKits
- Tagline: Fast, free tools for everyday life
- Tone: Clean, friendly, trustworthy, no clutter

---

## Technology Stack

### Frontend
- React (functional components, hooks only)
- Vite (build tool)
- React Router v7+ (the `react-router` package, client-side routing —
  do not install `react-router-dom`; v7 merged it into `react-router`)
- Tailwind CSS v4 (utility-first styling, Vite plugin integration)
- DaisyUI (component library on top of Tailwind CSS)
- JavaScript only (no TypeScript in Phase 1)

### No Backend (Phase 1)
All tools in Phase 1 run entirely in the browser.
No server, no database, no API calls required for core tools.
Backend and database will be introduced only if accounts or saved history
are added in a future phase.

### Hosting
- Vercel (free tier, auto-deploys from GitHub on every push)

### Domain Registrar
- Spaceship (fasttoolkits.com — already purchased)

### Analytics
- Google Analytics 4
- Google Search Console

### Version Control
- Git + GitHub (private repository initially)

### Future (not Phase 1)
- Google AdSense
- Affiliate links
- Optional paid subscription tier

---

## Correct Installation Order

This is the sequence to follow when setting up the project from scratch.
Do not deviate from this order.

```
1.  Create Vite React project (npm create vite@latest . -- --template react)
2.  Install base dependencies (npm install)
3.  Install Tailwind CSS v4 with Vite plugin
4.  Install DaisyUI
5.  Install React Router (`react-router` package)
6.  Verify dev server runs (npm run dev)
7.  Initialize Git
8.  Place PROJECT.md, AGENTS.md, README.md in project root
9.  Start Claude Code (claude)
10. Claude reads AGENTS.md and PROJECT.md automatically
11. Build shared layout components (Navbar, Footer, MainLayout)
12. Build homepage
13. Build first tool
14. Test everything
15. Push to GitHub
16. Deploy to Vercel
17. Connect fasttoolkits.com domain on Vercel
18. Set up Google Analytics and Search Console
```

---

## Tailwind CSS v4 Setup (Correct Method)

Do NOT use the old Tailwind v3 method. Do not run:
- npx tailwindcss init
- Do not create tailwind.config.js manually

The correct Tailwind v4 installation for Vite is:

```bash
npm install tailwindcss @tailwindcss/vite
```

Then in vite.config.js add the Tailwind plugin:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

Then in src/index.css replace everything with:

```css
@import "tailwindcss";
```

No tailwind.config.js needed in v4.

---

## DaisyUI Setup (After Tailwind v4)

```bash
npm install daisyui
```

Then in src/index.css add the DaisyUI plugin import:

```css
@import "tailwindcss";
@plugin "daisyui";
```

DaisyUI is a required part of this project. Do not remove it.
It provides pre-built components (buttons, cards, inputs, navbar, modals)
that keep the UI consistent without writing repetitive Tailwind classes.

---

## Project Folder Structure

```
fasttoolkits-website/
│
├── public/
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── assets/
│   │   └── logo.svg
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ToolCard.jsx
│   │   └── SearchBar.jsx
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── PrivacyPage.jsx
│   │   └── TermsPage.jsx
│   │
│   ├── tools/
│   │   ├── bmi/
│   │   │   └── BMICalculator.jsx
│   │   ├── age/
│   │   │   └── AgeCalculator.jsx
│   │   ├── tip/
│   │   │   └── TipCalculator.jsx
│   │   ├── word-counter/
│   │   │   └── WordCounter.jsx
│   │   ├── password-generator/
│   │   │   └── PasswordGenerator.jsx
│   │   ├── percentage/
│   │   │   └── PercentageCalculator.jsx
│   │   ├── unit-converter/
│   │   │   └── UnitConverter.jsx
│   │   ├── qr-code/
│   │   │   └── QRCodeGenerator.jsx
│   │   ├── color-picker/
│   │   │   └── ColorPicker.jsx
│   │   └── loan-calculator/
│   │       └── LoanCalculator.jsx
│   │
│   ├── data/
│   │   └── tools.js
│   │
│   ├── hooks/
│   │   └── usePageTitle.js
│   │
│   ├── utils/
│   │   └── calculations.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── PROJECT.md
├── AGENTS.md
├── README.md
├── package.json
├── vite.config.js
└── .gitignore
```

---

## URL Structure

```
fasttoolkits.com/                        → Homepage (tool directory)
fasttoolkits.com/bmi-calculator          → BMI Calculator
fasttoolkits.com/age-calculator          → Age Calculator
fasttoolkits.com/tip-calculator          → Tip Calculator
fasttoolkits.com/word-counter            → Word Counter
fasttoolkits.com/password-generator      → Password Generator
fasttoolkits.com/percentage-calculator   → Percentage Calculator
fasttoolkits.com/unit-converter          → Unit Converter
fasttoolkits.com/qr-code-generator       → QR Code Generator
fasttoolkits.com/color-picker            → Color Picker
fasttoolkits.com/loan-calculator         → Loan Calculator
fasttoolkits.com/about                   → About Page
fasttoolkits.com/contact                 → Contact Page
fasttoolkits.com/privacy                 → Privacy Policy
fasttoolkits.com/terms                   → Terms of Service
```

---

## Initial Tool List (Phase 1)

| Tool | Path | Category | Notes |
|---|---|---|---|
| BMI Calculator | /bmi-calculator | Health | Add disclaimer: not medical advice |
| Age Calculator | /age-calculator | Everyday | |
| Tip Calculator | /tip-calculator | Everyday | |
| Word Counter | /word-counter | Writing | |
| Password Generator | /password-generator | Security | |
| Percentage Calculator | /percentage-calculator | Math | |
| Unit Converter | /unit-converter | Everyday | |
| QR Code Generator | /qr-code-generator | Utility | |
| Color Picker | /color-picker | Design | |
| Loan Calculator | /loan-calculator | Finance | Add disclaimer: not financial advice |

---

## Design System

### Colors
- Primary: #2563EB (blue)
- Primary dark: #1D4ED8
- Background: #F8FAFC
- Surface: #FFFFFF
- Text primary: #1E293B
- Text secondary: #64748B
- Border: #E2E8F0
- Success: #10B981
- Error: #EF4444

Note: This is the starting design system. A more distinctive visual identity
will be designed and this section updated before the homepage is built.
Claude Code must not invent new colors outside this system without approval.

### Typography
- Font: Inter (loaded via Google Fonts in index.html)
- Headings: font-bold
- Body: font-normal
- Small labels: font-medium text-sm

### Spacing
- Section padding: py-12 px-4
- Card padding: p-6
- Gap between elements: gap-4 or gap-6

### Components
- Buttons: DaisyUI btn classes
- Cards: DaisyUI card classes
- Inputs: DaisyUI input classes
- Navbar: DaisyUI navbar class
- Footer: Custom, simple layout

### Design Rules
- Clean white cards on light grey background
- One accent color only (blue)
- Rounded corners: rounded-xl on cards and inputs
- No unnecessary decorative shadows or gradients
- Mobile responsive on every single page
- Tool result displayed prominently and clearly

---

## SEO Strategy

### Every Tool Page Must Have
- Unique page title: "[Tool Name] — FastToolKits"
- Meta description: 150 to 160 characters
- H1 heading matching the tool name
- Short introduction paragraph with natural keywords
- How to Use section below the tool
- Related Tools section at the bottom
- Disclaimer where relevant (health and finance tools)

### Other SEO Requirements
- robots.txt in the public folder
- sitemap.xml submitted to Google Search Console after launch
- Structured data (JSON-LD) on tool pages
- Excellent Core Web Vitals (measured with Lighthouse after each build)
- Mobile-friendly layout throughout

Note: Keyword research will be done properly before each tool is built.
Do not treat any search volume numbers as facts until verified from a source.

---

## Performance Requirements

- Aim for excellent Core Web Vitals scores (measured, not assumed)
- Keep the site lightweight with no unnecessary packages
- Optimize all images before adding them to the project
- Lazy load tool components not visible on first render
- Performance will be measured after each build using Lighthouse

---

## Accessibility Requirements

- All inputs have visible labels
- Color contrast meets WCAG AA minimum
- All interactive elements are keyboard navigable
- Focus states visible on all interactive elements
- Alt text on all images
- Semantic HTML throughout

---

## Monetization Plan

### Phase 1 (At Launch)
- Apply for Google AdSense after 10+ tools are live
- One non-intrusive banner ad per tool page (below the tool)

### Phase 2 (3 to 6 months after launch)
- Contextual affiliate links inside relevant tools

### Phase 3 (When traffic justifies it)
- Optional $5 to $7/month paid tier
- No ads, save history, batch processing, PDF export

---

## Development Rules

1. Functional components only. No class components.
2. React hooks for all state management.
3. Every tool self-contained in its own folder under src/tools/
4. All tool data lives in src/data/tools.js only. Never hardcoded elsewhere.
5. Tailwind CSS classes only. No separate CSS files unless essential.
6. DaisyUI components for all UI elements where available.
7. Every tool page sets its own title using the usePageTitle hook.
8. All tools must work on screens as small as 320px wide.
9. No external API calls for Phase 1 tools.
10. Do not install new packages without a clear reason.
11. Keep components small and single-purpose.
12. Health and finance tools must include appropriate disclaimers.
13. Do not modify PROJECT.md or AGENTS.md without approval.

---

## Deployment Architecture

```
Local Development (VS Code + Claude Code)
            ↓
Git commit and push to GitHub (main branch)
            ↓
Vercel detects push automatically
            ↓
Vercel builds (npm run build)
            ↓
Live at fasttoolkits.com within ~2 minutes
```

---

## Current Project Status

- [x] Domain purchased: fasttoolkits.com (Spaceship)
- [x] Node.js v22.17.0 installed
- [x] Git 2.50.0 installed
- [x] Claude Code 2.1.226 installed
- [x] VS Code configured
- [x] Project folder created: D:\Website\fasttoolkits-website
- [x] PROJECT.md, AGENTS.md, README.md created
- [x] React + Vite project scaffolded
- [x] Tailwind CSS v4 installed correctly
- [x] DaisyUI installed
- [x] React Router installed (`react-router` v7 package)
- [x] Dev server verified running
- [ ] Git initialized and first commit made (repo initialized, no commits yet)
- [ ] GitHub repository created and pushed
- [ ] Deployed to Vercel
- [ ] Domain connected to Vercel
- [ ] Design system finalized (starting colors in use; distinctive identity still pending)
- [x] Shared layout components built (Navbar, Footer, MainLayout)
- [x] Homepage foundation built (hero, search, category filter, tool grid — using real tool metadata)
- [ ] First tool built and tested
- [ ] All 10 Phase 1 tools complete
- [ ] Google Analytics added
- [ ] Google Search Console set up
- [ ] Sitemap submitted
- [ ] AdSense applied

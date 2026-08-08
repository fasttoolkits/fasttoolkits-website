# AGENTS.md — FastToolKits

This file gives instructions to AI coding agents (Claude Code or any other
AI assistant) working on this project. Read this file before touching any code.

---

## What This Project Is

FastToolKits is a free multi-tool website at fasttoolkits.com
One brand. Many tools. Each tool on its own page.
Built with React + Vite + Tailwind CSS v4 + DaisyUI.
Hosted on Vercel. No backend in Phase 1.

Read PROJECT.md for full context before starting any task.

---

## Your Role

You are a development assistant helping build FastToolKits.
You write clean, functional React code following the rules in this file.
You do not make architectural decisions on your own.
If something is unclear, ask before making significant changes.

---

## How to Start Every Session

1. Read AGENTS.md (this file)
2. Read PROJECT.md
3. Check the Current Project Status section in PROJECT.md
4. Ask what the task is for this session
5. Complete only the task given — do not change unrelated files

You do not need PROJECT.md to be pasted into the chat manually.
Read it directly from the project folder.

---

## Rules You Must Follow

### General
- Read PROJECT.md before starting any session
- Do not change the folder structure without approval
- Do not introduce new npm packages without a clear reason
- Do not modify files unrelated to the current task
- Do not remove existing functionality when adding new features
- Keep all changes minimal and focused on the current task
- Do not modify PROJECT.md or AGENTS.md without explicit approval

### React
- Functional components only. No class components. Ever.
- Use React hooks for all state (useState, useEffect, useMemo, etc.)
- No prop drilling more than 2 levels deep
- Keep components small and single-purpose
- One component, one job

### Styling
- Tailwind CSS v4 utility classes only
- DaisyUI component classes where available
- No inline styles unless absolutely unavoidable
- No separate .css files unless absolutely necessary
- Follow the design system in PROJECT.md exactly
- Primary color: #2563EB
- Background: #F8FAFC
- Do not invent colors outside the approved design system

### Tailwind v4 Specific
- Do not create or reference tailwind.config.js (not needed in v4)
- The Tailwind import in index.css is: @import "tailwindcss";
- DaisyUI is loaded via: @plugin "daisyui";
- Tailwind is loaded via the Vite plugin in vite.config.js

### File and Folder Structure
- Every tool lives in its own folder: src/tools/toolname/
- Tool component named clearly: BMICalculator.jsx, WordCounter.jsx
- Shared components go in src/components/
- Page components go in src/pages/
- Layout components go in src/layouts/
- Helper functions go in src/utils/
- Custom hooks go in src/hooks/
- All tool data lives in src/data/tools.js only
- Do not hardcode tool lists inside any component

### Routing
- React Router v7 (the `react-router` package) handles all routing
- Do not install or import `react-router-dom` — this project uses the
  unified `react-router` package (v7 merged `react-router-dom` into it)
- Every tool has its own route in App.jsx
- URL paths are lowercase with hyphens: /bmi-calculator, /word-counter
- Never use hash routing (#)
- Note: When the tool list grows large, routing may be refactored.
  Do not refactor routing without approval.

### SEO — Required on Every Tool Page
- Page title: "[Tool Name] — FastToolKits"
- Meta description: 150 to 160 characters
- H1 heading with the tool name
- Short intro paragraph (2 to 3 sentences with natural keywords)
- How to Use section below the tool
- Related Tools section at the bottom
- Disclaimer for health tools: "This tool is for informational purposes only
  and is not medical advice."
- Disclaimer for finance tools: "This tool is for informational purposes only
  and is not financial advice."

### Tools (Phase 1 Specific)
- All Phase 1 tools run entirely in the browser
- No backend API calls for Phase 1 tools
- No user accounts required for any tool
- No data saved to any server in Phase 1
- Calculations happen in JavaScript only
- Results display instantly on user input where possible

### Performance
- Do not import entire libraries when only one function is needed
- Lazy load tool components using React.lazy() and Suspense
- Keep the bundle size small
- No unnecessary dependencies

### Accessibility
- Every input must have a visible label element
- Every button must have clear descriptive text
- All interactive elements must be keyboard accessible
- Do not rely on color alone to convey information
- Use semantic HTML: button, input, label, nav, main, footer, section

### Code Quality
- Readable code with clear variable names
- No console.log statements left in production code
- No commented-out code blocks left in files
- Handle error states in UI (show a message if something goes wrong)
- Handle empty states in UI (show something useful before results appear)

---

## How to Add a New Tool

Follow this exact pattern every time a new tool is added:

### Step 1: Create the tool folder and file
```
src/tools/tool-name/
  ToolName.jsx
```

### Step 2: Structure every tool component with these sections
- usePageTitle hook to set the page title
- H1 heading with the tool name
- Short description paragraph
- The tool itself (inputs, button, result display)
- How to Use section
- Related Tools section
- Disclaimer if health or finance related

### Step 3: Add to src/data/tools.js
```javascript
{
  name: "Tool Name",
  description: "One sentence describing what this tool does.",
  path: "/tool-name",
  category: "Category Name",
  keywords: ["keyword1", "keyword2", "keyword3"]
}
```

### Step 4: Add the route to App.jsx
```jsx
import ToolName from './tools/tool-name/ToolName'
<Route path="/tool-name" element={<ToolName />} />
```

### Step 5: Test before finishing
- Does it calculate correctly with various inputs?
- Does it display the result clearly?
- Does it work on a 375px wide mobile screen?
- Does the page title update correctly in the browser tab?
- Is the How to Use section helpful?
- Is the Related Tools section populated?

---

## What You Must Never Do

- Never use class components
- Never use inline styles as the primary styling method
- Never hardcode tool data inside components
- Never skip mobile responsiveness testing
- Never add a tool without updating src/data/tools.js
- Never add a tool without adding its route to App.jsx
- Never change design system colors without approval
- Never install a package that duplicates existing functionality
- Never leave broken or incomplete code in the project
- Never modify PROJECT.md or AGENTS.md without approval
- Never create tailwind.config.js (this project uses Tailwind v4)

---

## Tech Stack Reference

| Technology | Purpose |
|---|---|
| React | UI framework |
| Vite | Build tool |
| React Router v7+ (`react-router`) | Client-side routing |
| Tailwind CSS v4 | Utility styling (Vite plugin) |
| DaisyUI | UI component library |
| JavaScript ES2022+ | Language |
| Git + GitHub | Version control |
| Vercel | Hosting and deployment |

---

## Commands Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Save work to GitHub
git add .
git commit -m "describe what you built"
git push
```

---

## Current Tool List

See the Initial Tool List table in PROJECT.md for the full list.
Update the Current Project Status checklist in PROJECT.md when each
tool is completed.

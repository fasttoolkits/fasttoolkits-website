# SETUP_GUIDE_REFERENCE.md

## Important Notice

This file is kept as a general reference only.
Do NOT follow the Tailwind setup steps in this file.
Do NOT follow the domain steps in this file (domain is already purchased).
Do NOT paste PROJECT.md manually into Claude Code sessions.

The authoritative setup instructions are in PROJECT.md under
"Correct Installation Order" and "Tailwind CSS v4 Setup".

Refer to PROJECT.md and AGENTS.md as the source of truth for this project.

---

## What This File Is Good For

- General understanding of the project workflow
- Understanding why GitHub and Vercel are used
- Understanding the Git commit workflow
- Understanding how Claude Code is used as a development assistant

## What to Ignore in This File

- The Tailwind CSS setup steps (outdated v3 method)
- Any mention of Namecheap or GoDaddy (we use Spaceship)
- The instruction to paste PROJECT.md manually each session
- The `npm install -D tailwindcss postcss autoprefixer` command
- The `npx tailwindcss init -p` command
- Any reference to creating tailwind.config.js

---

## Current Authoritative Commands (from PROJECT.md)

### Create the Vite project
```bash
npm create vite@latest . -- --template react
npm install
```

### Install Tailwind CSS v4
```bash
npm install tailwindcss @tailwindcss/vite
```

### Install DaisyUI
```bash
npm install daisyui
```

### Install React Router DOM
```bash
npm install react-router-dom
```

### Start dev server
```bash
npm run dev
```

### Save to GitHub
```bash
git add .
git commit -m "your message here"
git push
```

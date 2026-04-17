# CCW Dry-Fire Trainer

A mobile-first PWA for daily dry-fire practice tracking. Runs fully offline after first load, progress saved in localStorage.

## Features

- 7 structured dry-fire drills with rep tracking
- Daily streak tracking
- 14-day history view
- Session notes
- 4 firearms safety rules displayed
- Installable as PWA (iOS & Android)

## Deploy to Vercel

```bash
git init && git add .
git commit -m "Initial commit"
git remote add origin https://github.com/nickheidmann/ccw-dryfire.git
git push -u origin main
```

Then: vercel.com/new → import repo → Deploy

**Vercel Settings:** Node.js 18.x or later (Settings → General → Node.js Version)

## Install as PWA

Once deployed, open the URL on phone in Safari/Chrome → Share → Add to Home Screen

Runs full-screen in standalone mode, works offline after first load.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- React 18 + Vite 5
- vite-plugin-pwa + Workbox (offline caching)
- CSS-in-JS inline styles (no dependencies)
- localStorage for persistence

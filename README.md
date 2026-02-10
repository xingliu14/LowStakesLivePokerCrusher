# Low Stakes Live Poker Crusher

Real-time poker strategy recommendations for low-stakes live games ($1/$2, $1/$3, $2/$5).

**Live app:** https://easypoker.vercel.app/

## Features

- **GTO-Based Strategy Engine** — Get fold/call/raise recommendations based on position, hand category, stack depth, and game situation
- **AI-Powered Learning** — Paste a YouTube poker video URL to extract strategy adjustments using AI transcript analysis
- **Offline-Ready PWA** — Install on your phone and use at the table, even with spotty connectivity

## Tech Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · OpenAI API

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To use the AI learning feature, set your `OPENAI_API_KEY` environment variable.

## Install as App on Your Phone

This is a Progressive Web App (PWA) — you can add it to your home screen for a native app experience.

### iPhone / iPad (Safari)

1. Open https://easypoker.vercel.app/ in **Safari**
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add**

### Android (Chrome)

1. Open https://easypoker.vercel.app/ in **Chrome**
2. Tap the **three-dot menu** (top right)
3. Tap **Add to Home Screen** (or **Install App**)
4. Tap **Add**

The app will appear on your home screen and launch in full-screen mode without browser UI.

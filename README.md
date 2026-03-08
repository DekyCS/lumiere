# Lumière — Counter Studio

A sleek number counter animation generator. Configure animated counters with custom styling, easing curves, and export them as MP4 videos — all in the browser.

## Features

- **Animated number counters** — set start/end values, prefix, suffix, and decimal precision
- **Multiple easing functions** — Linear, Ease In/Out, Overshoot, Bounce, Elastic with live curve preview
- **Full styling control** — custom fonts, colors, font size, background images, and canvas resolution
- **MP4 export** — render animations using WebCodecs + mp4-muxer, no server required
- **Live preview** — instant canvas preview with real-time playback

## Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS v4** + **shadcn/ui**
- **WebCodecs API** + **mp4-muxer** for client-side video encoding
- **Canvas API** for rendering

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Deployment

Deploy to Vercel, Netlify, or any static host. Vite is auto-detected — no extra configuration needed.

## Author

Made by [Omar Lahlou Mimi](https://omarlahloumimi.com)

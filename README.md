# Villa Aura — Immersive 3D Architectural Experience

A luxury villa 3D walkthrough built with Three.js, featuring PBR rendering, dynamic lighting, weather systems, and interactive hotspots.

**Live Demo:** [https://thanushaa22.github.io/3D-Construction-Building/](https://thanushaa22.github.io/3D-Construction-Building/)

---

## Features

- **32 guided waypoints** covering every room and exterior space
- **PBR materials** — marble, wood, metal, glass, water, fabrics
- **Dynamic lighting** — Golden Hour, Sunset, Night presets with smooth transitions
- **Weather effects** — Rain, Storm (with lightning), Fireflies
- **Free camera** — WASD movement, mouse/touch drag to look, scroll/pinch to zoom
- **Interactive hotspots** — Click markers for room details and material specs
- **Auto tour mode** — 4-second guided walkthrough of all 32 rooms
- **Mobile optimized** — Reduced lights, shadows, and particles for smooth performance

---

## Tech Stack

| Library | Purpose |
|---------|---------|
| [Three.js](https://threejs.org/) | 3D rendering engine |
| [Vite](https://vitejs.dev/) | Build tool and dev server |

No frameworks. Pure vanilla JavaScript.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:3000`.

### Build

```bash
npx vite build
```

Output goes to `dist/`.

---

## Controls

### Desktop
| Key | Action |
|-----|--------|
| W/A/S/D | Move forward/left/back/right |
| Space/Q | Move up |
| E/Shift | Move down |
| Mouse drag | Look around |
| Scroll | Zoom |
| 1/2/3 | Switch lighting (Golden/Sunset/Night) |
| T | Toggle auto tour |
| F | Fullscreen |
| Esc | Close info card |

### Mobile
| Gesture | Action |
|---------|--------|
| Single finger drag | Look around |
| Pinch | Zoom |
| Tap nav buttons | Navigate rooms |

---

## Project Structure

```
├── index.html
├── src/
│   ├── main.js          # Entry point, orchestration
│   ├── materials.js     # 30+ PBR material definitions
│   ├── villa.js         # Complete villa geometry
│   ├── camera.js        # Camera system with 32 waypoints
│   ├── lighting.js      # Dynamic lighting system
│   ├── animations.js    # Weather, water, particles
│   ├── hotspots.js      # Interactive info markers
│   └── ui.js            # UI management
├── vite.config.js
└── package.json
```

---

## Deployment

The site auto-deploys to GitHub Pages via GitHub Actions on every push to `master`.

---


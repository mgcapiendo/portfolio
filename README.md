# mgcapiendo.com

Personal portfolio of Manuel "Chok" Capiendo: a fast, recruiter-first page plus
**Choktopia**, an optional walkable pixel-art dinosaur park where every paddock is
one chapter of my career.

## Two ways to browse

- **Portfolio page** (default): one scannable page with experience, projects,
  skills and contact. Plain HTML, no game code loaded.
- **Choktopia**: open it from the hero or at `/#park`. Walk with WASD or the
  arrow keys, or tap anywhere to walk there along the paths (tap a sign to walk
  over and read it). Press **E** near a sign to read an exhibit, **M** for the
  picture map with fast travel, **Esc** to go back. Dinosaurs react when you
  visit them, every exhibit earns a stamp, and collecting all 17 completes the
  park guide. Sound effects are optional and off by default. Any exhibit can be
  linked directly, for example `/#park/trex`.

## How it's built

- **React 19 + Vite** for the page and every piece of readable text.
- **Phaser 4** draws the park. It is lazy-loaded only when someone opens the
  park, so the portfolio page never downloads it.
- **One content file**, `src/content/content.ts`, feeds both the page and the
  park's exhibit panels.
- A small event bus (`src/game/bus.js`) connects the two: the game reports what
  the player is near, React shows the panel.
- All park art is original pixel art generated in code (`src/game/art/`): a
  tiny sprite toolkit with automatic outlines and shading, a hand-drawn player
  character, ten dinosaurs, and a world painter for paths, water, fences, trees
  and buildings. Any sprite can be swapped for a hand-drawn sheet later.

```
src/
  content/content.ts   all portfolio content (roles, projects, skills, links)
  ui/                  React: top bar, portfolio page, hero scene, park overlay
  game/                Phaser: map layout, park scene, event bus
tests/e2e/             Playwright tests for both views
```

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # production build to dist/
npm run lint       # ESLint
npm run test:e2e   # Playwright end-to-end + axe accessibility tests (uses your installed Chrome)
```

Deployed on Vercel.

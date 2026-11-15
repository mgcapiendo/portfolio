import { BUILDING_Y, BUILDINGS, COLS, DECOR, ROWS, T, TILE } from '../map';
import { M, P } from './palette';
import { mat, OUTLINE, PixelSprite, seeded } from './pixel';

// Paints the park: one big ground canvas (grass, paths with soft edges,
// water with foam, fences that connect, bridges, signs, shadows), plus
// separate tree and building art so the player can walk behind them.

const PATHLIKE = new Set([T.PATH, T.BRIDGE]);
const WATERLIKE = new Set([T.WATER, T.REEDS, T.BRIDGE]);

export const makeCanvas = (w, h) => {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
};

const painter =
  (ctx, ox, oy) =>
  (color, x, y, w = 1, h = 1) => {
    ctx.fillStyle = color;
    ctx.fillRect(ox + x, oy + y, w, h);
  };

// Pixel-stepped translucent ellipse, for soft drop shadows.
const shadow = (ctx, cx, cy, rx, ry) => {
  ctx.fillStyle = P.shadow;
  for (let y = -ry; y <= ry; y += 1) {
    const half = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry)));
    ctx.fillRect(Math.round(cx - half), Math.round(cy + y), half * 2, 1);
  }
};

const grass = (px, rand, flowers) => {
  px(P.grass, 0, 0, TILE, TILE);
  if (rand() < 0.3) px(P.grassLight, Math.floor(rand() * 10), Math.floor(rand() * 10), 4, 3);
  for (let i = 0; i < 4; i += 1) {
    const bx = Math.floor(rand() * 15);
    const by = 2 + Math.floor(rand() * 12);
    px(P.blade, bx, by, 1, 2);
    px(P.blade, bx + 1, by - 1, 1, 2);
    px(P.grassLight, bx + 1, by - 2);
  }
  if (flowers) {
    for (let i = 0; i < 2; i += 1) {
      const fx = 2 + Math.floor(rand() * 12);
      const fy = 2 + Math.floor(rand() * 12);
      const petal = P.flowers[Math.floor(rand() * P.flowers.length)];
      px(petal, fx - 1, fy);
      px(petal, fx + 1, fy);
      px(petal, fx, fy - 1);
      px(petal, fx, fy + 1);
      px(petal === P.flowers[1] ? P.flowers[0] : P.flowers[1], fx, fy);
    }
  }
};

const path = (px, rand, open) => {
  px(P.sand, 0, 0, TILE, TILE);
  for (let i = 0; i < 3; i += 1) {
    const x = 1 + Math.floor(rand() * 13);
    const y = 1 + Math.floor(rand() * 13);
    px(P.pebble, x, y, 2, 1);
    px(P.sandDark, x, y + 1, 2, 1);
  }
  // Grass creeps over the edge where the path meets lawn.
  for (let i = 0; i < TILE; i += 1) {
    const d = 1 + (rand() < 0.35 ? 1 : 0);
    if (!open.up) {
      px(P.grass, i, 0, 1, d);
      px(P.sandEdge, i, d);
    }
    if (!open.down) {
      px(P.grass, i, TILE - d, 1, d);
      px(P.sandDark, i, TILE - d - 1);
    }
    if (!open.left) {
      px(P.grass, 0, i, d, 1);
      px(P.sandEdge, d, i);
    }
    if (!open.right) {
      px(P.grass, TILE - d, i, d, 1);
      px(P.sandDark, TILE - d - 1, i);
    }
  }
};

const water = (px, rand, wet) => {
  px(P.water, 0, 0, TILE, TILE);
  if (rand() < 0.5) px(P.waterDeep, Math.floor(rand() * 10), Math.floor(rand() * 12), 5, 2);
  for (let i = 0; i < 2; i += 1) px(P.waterLight, Math.floor(rand() * 12), 3 + Math.floor(rand() * 10), 3, 1);
  if (!wet.up) {
    for (let i = 0; i < TILE; i += 1) px(P.foam, i, 0, 1, 1 + (i % 4 < 2 ? 1 : 0));
    px(P.waterLight, 0, 2, TILE, 1);
  }
  if (!wet.down) px(P.waterDeep, 0, TILE - 2, TILE, 2);
  if (!wet.left) px(P.waterLight, 0, 0, 1, TILE);
  if (!wet.right) px(P.waterLight, TILE - 1, 0, 1, TILE);
};

const bridge = (px) => {
  for (let y = 0; y < TILE; y += 4) {
    px(P.wood, 1, y, 14, 3);
    px(P.woodLight, 1, y, 14, 1);
    px(P.woodDark, 1, y + 3, 14, 1);
  }
  px(P.woodDark, 0, 0, 2, TILE);
  px(P.woodDark, TILE - 2, 0, 2, TILE);
  px(OUTLINE, 0, 0, 1, TILE);
  px(OUTLINE, TILE - 1, 0, 1, TILE);
};

const reeds = (px, rand) => {
  for (let k = 0; k < 3; k += 1) {
    const x = 2 + k * 5 + Math.floor(rand() * 2);
    px('#3f8434', x, 4, 1, 11);
    px('#62b04a', x + 1, 6, 1, 3);
    px('#8a5a33', x, 1, 1, 4);
  }
};

const fence = (px, h, v) => {
  if (h) {
    for (const y of [5, 10]) {
      px(P.woodLight, 0, y, TILE, 1);
      px(P.woodDark, 0, y + 1, TILE, 1);
      px(OUTLINE, 0, y + 2, TILE, 1);
    }
  }
  if (v) {
    px(P.woodLight, 7, 0, 1, TILE);
    px(P.woodDark, 8, 0, 1, TILE);
    px(OUTLINE, 9, 0, 1, TILE);
  }
  // Post.
  px(OUTLINE, 5, 1, 6, 14);
  px(P.wood, 6, 2, 4, 12);
  px(P.woodLight, 6, 2, 1, 12);
  px(P.woodDark, 9, 2, 1, 12);
  px(P.woodLight, 6, 2, 4, 1);
};

const sign = (px) => {
  px(OUTLINE, 6, 9, 4, 7);
  px(P.woodDark, 7, 9, 2, 6);
  px(OUTLINE, 1, 1, 14, 10);
  px(M.board.base, 2, 2, 12, 8);
  px(M.board.hi, 2, 2, 12, 1);
  px(M.board.lo, 2, 9, 12, 1);
  px(P.sandEdge, 4, 4, 8, 1);
  px(P.sandEdge, 4, 6, 6, 1);
};

export const renderGround = (grid) => {
  const canvas = makeCanvas(COLS * TILE, ROWS * TILE);
  const ctx = canvas.getContext('2d');
  const at = (c, r) => (r < 0 || r >= ROWS || c < 0 || c >= COLS ? T.TREE : grid[r][c]);
  // Tiles under parked decorations (the jeep) are gravel, not lawn.
  const gravel = new Set(DECOR.flatMap((d) => d.tiles.map(([c, r]) => r * COLS + c)));
  const pathy = (c, r) => PATHLIKE.has(at(c, r)) || gravel.has(r * COLS + c);

  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const t = grid[r][c];
      const px = painter(ctx, c * TILE, r * TILE);
      const rand = seeded(c * 7919 + r * 104729 + 17);
      const n = { up: at(c, r - 1), down: at(c, r + 1), left: at(c - 1, r), right: at(c + 1, r) };
      const pathAround = {
        up: pathy(c, r - 1),
        down: pathy(c, r + 1),
        left: pathy(c - 1, r),
        right: pathy(c + 1, r),
      };
      const is = (set) => ({
        up: set.has(n.up),
        down: set.has(n.down),
        left: set.has(n.left),
        right: set.has(n.right),
      });

      switch (t) {
        case T.PATH:
          path(px, rand, pathAround);
          break;
        case T.PROP:
          if (gravel.has(r * COLS + c)) path(px, rand, pathAround);
          else grass(px, rand, false);
          break;
        case T.WATER:
          water(px, rand, is(WATERLIKE));
          break;
        case T.REEDS:
          water(px, rand, is(WATERLIKE));
          reeds(px, rand);
          break;
        case T.BRIDGE:
          water(px, rand, is(WATERLIKE));
          bridge(px);
          break;
        case T.FENCE:
          grass(px, rand, false);
          fence(px, n.left === T.FENCE || n.right === T.FENCE, n.up === T.FENCE || n.down === T.FENCE);
          break;
        case T.SIGN:
          grass(px, rand, false);
          sign(px);
          break;
        default:
          grass(px, rand, t === T.GRASS_ALT);
      }
    }
  }

  // Soft shadows under trees and along the base of buildings.
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (grid[r][c] === T.TREE) shadow(ctx, c * TILE + 8, r * TILE + 14, 11, 3);
    }
  }
  for (const b of BUILDINGS) {
    ctx.fillStyle = P.shadow;
    ctx.fillRect(b.x * TILE, (BUILDING_Y + 6) * TILE, b.w * TILE, 3);
  }
  return canvas;
};

// Two round tree variants, 32 x 32, trunk at the bottom center.
const tree = (leaf, flip) => {
  const s = new PixelSprite(32, 32);
  s.rect(14, 22, 4, 9, M.trunk);
  s.set(13, 30, M.trunk).set(18, 30, M.trunk);
  // Round, bumpy canopy: a big body plus lobes on top and sides.
  s.ellipse(16, 13, 12.5, 9.5, leaf);
  s.ellipse(flip ? 21 : 11, 6, 6.5, 5, leaf);
  s.ellipse(flip ? 11 : 21, 7, 6, 5, leaf);
  s.ellipse(5, 14, 4.5, 5, leaf);
  s.ellipse(27, 14, 4.5, 5, leaf);
  s.ellipse(16, 19, 10, 4, leaf);
  // Leaf clusters: light up-left, dark low-right.
  for (const [x, y] of [
    [10, 6],
    [13, 4],
    [8, 11],
    [12, 9],
    [17, 7],
  ])
    s.set(x, y, leaf.hi).set(x + 1, y, leaf.hi);
  for (const [x, y] of [
    [20, 17],
    [23, 14],
    [14, 19],
    [25, 19],
    [18, 13],
  ])
    s.set(x, y, leaf.lo).set(x + 1, y, leaf.lo);
  return s.finish();
};

export const TREE_ART = [tree(M.leaf, false), tree(M.leafAlt, true)];

const ROOFS = { blue: M.roofBlue, green: M.roofGreen, red: M.roofRed };

// A building: shingled roof (3 tiles tall) over a cream timber-frame wall
// (3 tiles), with windows, lanterns and a door that lines up with the
// door tiles in the collision grid. Drawn 2px wider on each side for eaves.
export const renderBuilding = (b) => {
  if (b.style === 'cabin') return renderCabin(b);
  const W = b.w * TILE + 4;
  const H = 6 * TILE;
  const canvas = makeCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const px = painter(ctx, 0, 0);
  const roof = ROOFS[b.roof] ?? M.roofBlue;

  // Roof.
  px(OUTLINE, 0, 0, W, 48);
  px(roof.base, 1, 1, W - 2, 46);
  for (let y = 8; y < 44; y += 6) {
    px(roof.lo, 1, y, W - 2, 1);
    for (let x = ((y / 6) % 2) * 4 + 2; x < W - 2; x += 8) px(roof.lo, x, y - 5, 1, 5);
  }
  px(roof.hi, 1, 1, W - 2, 4); // ridge
  px(roof.lo, 1, 43, W - 2, 4); // eave
  px(OUTLINE, 0, 47, W, 1);

  // Wall.
  const wx = 2;
  const ww = W - 4;
  px(OUTLINE, wx, 48, ww, 48);
  px(M.wall.base, wx + 1, 48, ww - 2, 47);
  px(M.wall.lo, wx + 1, 48, ww - 2, 3); // shade under eave
  for (let x = wx + 1; x < wx + ww - 2; x += 3 * TILE) px(M.door.lo, x, 51, 3, 39); // timber posts
  px(M.stone.base, wx + 1, 89, ww - 2, 6); // stone base
  px(M.stone.hi, wx + 1, 89, ww - 2, 1);

  // Door lines up with the door tiles in the grid.
  const doorX = (Math.floor(b.w / 2) - 1) * TILE + 2 + 2;
  px(OUTLINE, doorX, 62, 28, 34);
  px(M.door.base, doorX + 1, 63, 26, 33);
  for (let x = doorX + 5; x < doorX + 26; x += 6) px(M.door.lo, x, 63, 1, 33);
  px(M.door.hi, doorX + 1, 63, 26, 1);
  px('#f5c242', doorX + 22, 80, 2, 2); // knob
  // Name board and lanterns.
  px(OUTLINE, doorX - 2, 52, 32, 9);
  px(M.board.base, doorX - 1, 53, 30, 7);
  px(P.sandEdge, doorX + 3, 56, 22, 1);
  for (const lx of [doorX - 7, doorX + 31]) {
    px(OUTLINE, lx, 64, 5, 8);
    px('#f5c242', lx + 1, 65, 3, 6);
    px('#fff1b8', lx + 1, 65, 1, 2);
  }

  // Windows on both sides of the door.
  for (let x = wx + 10; x + 14 < wx + ww - 6; x += 24) {
    if (x + 14 > doorX - 10 && x < doorX + 38) continue;
    px(OUTLINE, x, 60, 16, 14);
    px(M.glass.base, x + 1, 61, 14, 12);
    px(M.glass.hi, x + 1, 61, 14, 2);
    px(M.glass.hi, x + 1, 61, 2, 12);
    px(M.glass.lo, x + 1, 71, 14, 2);
    px(M.door.base, x + 7, 61, 2, 12); // mullion
    px(M.door.base, x - 1, 74, 18, 2); // sill
  }
  return canvas;
};

// Tiny 3 x 5 pixel letters for painted signs.
const GLYPHS = {
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
  A: ['.#.', '#.#', '###', '#.#', '#.#'],
  N: ['#.#', '###', '###', '#.#', '#.#'],
  G: ['.##', '#..', '#.#', '#.#', '.##'],
  E: ['###', '#..', '##.', '#..', '###'],
};

const pixelText = (px, text, x, y, color) => {
  [...text].forEach((ch, i) => {
    (GLYPHS[ch] ?? []).forEach((row, gy) => {
      [...row].forEach((cell, gx) => {
        if (cell === '#') px(color, x + i * 4 + gx, y + gy);
      });
    });
  });
};

// The Ranger Station: a log cabin with a green shingled roof, stone chimney,
// radio antenna, porch awning, shuttered windows with flower boxes and a
// painted RANGER sign. Same footprint rules as renderBuilding.
const renderCabin = (b) => {
  const W = b.w * TILE + 4;
  const H = 6 * TILE;
  const canvas = makeCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const px = painter(ctx, 0, 0);
  const roof = M.roofGreen;

  // Roof with shingles.
  px(OUTLINE, 0, 0, W, 48);
  px(roof.base, 1, 1, W - 2, 46);
  for (let y = 8; y < 44; y += 6) {
    px(roof.lo, 1, y, W - 2, 1);
    for (let x = ((y / 6) % 2) * 4 + 2; x < W - 2; x += 8) px(roof.lo, x, y - 5, 1, 5);
  }
  px(roof.hi, 1, 1, W - 2, 4);
  px(roof.lo, 1, 43, W - 2, 4);
  px(OUTLINE, 0, 47, W, 1);
  // Stone chimney.
  const cx = W - 32;
  px(OUTLINE, cx, 0, 14, 24);
  px(M.stone.base, cx + 1, 1, 12, 22);
  for (let y = 4; y < 22; y += 5) px(M.stone.lo, cx + 1, y, 12, 1);
  for (let y = 1; y < 22; y += 5) px(M.stone.lo, cx + 4 + ((y / 5) % 2) * 4, y, 1, 4);
  px(M.stone.hi, cx + 1, 1, 12, 1);
  // Radio antenna with a red tip.
  px(OUTLINE, 14, 2, 3, 22);
  px('#c3cad1', 15, 3, 1, 20);
  px('#d6453a', 14, 0, 3, 3);

  // Log walls: stacked logs with round log ends at the corners.
  const wx = 2;
  const ww = W - 4;
  px(OUTLINE, wx, 48, ww, 48);
  px('#8a5a33', wx + 1, 48, ww - 2, 47);
  for (let y = 49; y < 89; y += 6) {
    px('#a8703f', wx + 1, y, ww - 2, 1);
    px('#6a4325', wx + 1, y + 5, ww - 2, 1);
    for (const ex of [wx + 1, wx + ww - 7]) {
      px('#6a4325', ex, y, 6, 6);
      px('#d9a86a', ex + 1, y + 1, 4, 4);
      px('#a8703f', ex + 2, y + 2, 2, 2);
    }
  }
  px(M.stone.base, wx + 1, 89, ww - 2, 6); // stone base
  px(M.stone.hi, wx + 1, 89, ww - 2, 1);

  // Door (lines up with the grid door tiles) under a porch awning.
  const doorX = (Math.floor(b.w / 2) - 1) * TILE + 2 + 2;
  px(OUTLINE, doorX, 64, 28, 32);
  px(M.door.base, doorX + 1, 65, 26, 31);
  for (let x = doorX + 5; x < doorX + 26; x += 6) px(M.door.lo, x, 65, 1, 31);
  px('#f5c242', doorX + 22, 80, 2, 2);
  px(OUTLINE, doorX - 6, 58, 40, 6); // awning
  px(roof.base, doorX - 5, 59, 38, 4);
  px(roof.hi, doorX - 5, 59, 38, 1);
  for (const postX of [doorX - 5, doorX + 30]) {
    px(OUTLINE, postX - 1, 64, 5, 31);
    px(M.door.hi, postX, 64, 3, 30);
  }
  // Painted RANGER sign above the awning.
  px(OUTLINE, doorX - 2, 49, 32, 9);
  px(M.door.base, doorX - 1, 50, 30, 7);
  pixelText(px, 'RANGER', doorX + 3, 51, '#f5c242');

  // Shuttered windows with flower boxes, one on each side of the door.
  for (const x of [wx + 12, wx + ww - 28]) {
    px('#2d6c4f', x - 5, 62, 4, 14); // shutters
    px('#2d6c4f', x + 17, 62, 4, 14);
    px(OUTLINE, x, 62, 16, 14);
    px(M.glass.base, x + 1, 63, 14, 12);
    px(M.glass.hi, x + 1, 63, 14, 2);
    px(M.glass.hi, x + 1, 63, 2, 12);
    px(M.door.base, x + 7, 63, 2, 12);
    px(OUTLINE, x - 2, 76, 20, 6); // flower box
    px(M.door.lo, x - 1, 77, 18, 4);
    for (let f = 0; f < 5; f += 1) px(f % 2 ? '#ffd54a' : '#ff8fb1', x + 1 + f * 3, 75, 2, 2);
  }
  return canvas;
};

// ---- Park jeep ----

// Choktopia park jeep, side view facing right: navy body, yellow stripe,
// footprint on the door, roll bar, spare tire and headlight. 54 x 34.
const jeep = () => {
  const s = new PixelSprite(54, 34);
  const body = mat('#1f3a6e', '#3a5fa8', '#142a52');
  const tire = mat('#3a3442', '#5a5466', '#22202a');
  const hub = mat('#9aa3ad', '#c3cad1', '#737d88');
  s.ellipse(5, 18, 4, 5, tire); // spare tire on the back
  s.ellipse(5, 18, 1.5, 2, hub);
  s.rect(12, 3, 2, 12, body); // roll bar
  s.rect(12, 3, 17, 2, body);
  s.rect(29, 5, 2, 10, body); // windshield frame
  s.rect(31, 6, 4, 8, mat('#8fd0f2', '#d6f1ff', '#5ea9d6')); // windshield
  s.rect(15, 11, 11, 4, mat('#8a5a33', '#a8703f', '#6a4325')); // seat
  s.rect(6, 14, 43, 11, body); // tub
  s.rect(34, 12, 15, 5, body); // hood
  s.rect(49, 15, 3, 8, hub); // bumper
  s.rect(6, 18, 43, 2, '#f5c242'); // stripe
  for (const [x, y] of [
    [20, 20],
    [22, 20],
    [24, 20],
    [21, 21],
    [22, 21],
    [23, 21],
    [22, 22],
  ])
    s.set(x, y, '#f5c242'); // footprint
  s.set(47, 13, '#fff1b8').set(48, 13, '#f5c242'); // headlight
  for (const wx of [14, 40]) {
    s.ellipse(wx, 27, 5.5, 5.5, tire);
    s.ellipse(wx, 27, 2.5, 2.5, hub);
  }
  return s.finish();
};

export const JEEP_ART = jeep();

// ---- Props ----

// Flagpole with a navy flag bearing a yellow three-toed dinosaur track (the
// site logo). Two frames make the flag wave. 28 x 50; the pole stands at
// x = 4, base at the bottom.
export const FLAG_SIZE = { w: 28, h: 50, poleX: 4 };

const TRACK = [
  'y...y...y',
  'y...y...y',
  '.y..y..y.',
  '..y.y.y..',
  '...yyy...',
  '..yyyyy..',
  '..yyyyy..',
  '...yyy...',
];

const flag = (frame) => {
  const s = new PixelSprite(FLAG_SIZE.w, FLAG_SIZE.h);
  const metal = { base: '#c3cad1', hi: '#eef2f5', lo: '#8b95a1' };
  s.rect(3, 6, 2, 40, metal);
  s.ellipse(4, 4, 2, 2, { base: '#f5c242', hi: '#ffe08a', lo: '#c99a2e' }); // finial
  s.rect(1, 46, 6, 4, M.stone); // base
  // Flag cloth, 20 x 14, attached at the pole; frame 1 ripples every other band.
  const ripple = (x) => (frame && x % 6 >= 3 ? 1 : 0);
  for (let x = 0; x < 20; x += 1) {
    for (let y = 0; y < 14; y += 1) s.set(6 + x, 8 + y + ripple(x), y === 0 ? '#22355e' : '#0f1f3d');
  }
  TRACK.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === 'y') s.set(12 + x, 11 + y + ripple(6 + x), '#f5c242');
    });
  });
  return s.finish();
};

export const FLAG_ART = [flag(0), flag(1)];

// Bulletin board: two posts, a little shingled roof, a cork board with
// pinned notes. 32 x 30; its center line sits on the edge between two tiles.
const board = () => {
  const s = new PixelSprite(32, 30);
  s.rect(4, 14, 3, 16, M.wood); // posts
  s.rect(25, 14, 3, 16, M.wood);
  s.rect(1, 5, 30, 16, M.wood); // frame
  s.rect(3, 7, 26, 12, '#c9935a'); // cork
  for (const [x, y] of [
    [7, 9],
    [18, 15],
    [24, 10],
    [12, 16],
  ])
    s.set(x, y, '#a8743f'); // cork texture
  s.rect(0, 1, 32, 4, M.roofGreen); // roof
  s.rect(2, 0, 28, 1, M.roofGreen);
  // Pinned notes with a red pin and a few "lines" of text.
  const note = (x, y, w, h, paper) => {
    s.rect(x, y, w, h, paper);
    for (let ly = y + 2; ly < y + h - 1; ly += 2) s.rect(x + 1, ly, w - 2, 1, '#8a8f9c');
    s.set(x + Math.floor(w / 2), y, '#d6453a');
  };
  note(5, 8, 7, 8, '#fffaf0');
  note(14, 9, 7, 6, '#ffe08a');
  note(23, 8, 5, 9, '#cfe6ff');
  return s.finish();
};

export const BOARD_ART = board();

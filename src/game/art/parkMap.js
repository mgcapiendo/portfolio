import { BUILDING_Y, BUILDINGS, buildGrid, COLS, DECOR, CREATURES, EXHIBITS, ROWS, T, TILE } from '../map';
import { CREATURE_ART } from './creatures';
import { RANGER_FRAMES } from './ranger';
import {
  BOARD_ART,
  FLAG_ART,
  FLAG_SIZE,
  JEEP_ART,
  makeCanvas,
  renderBuilding,
  renderGround,
  TREE_ART,
} from './world';

// Images for the map menu: the whole park drawn once (ground, trees and
// buildings, sorted by depth) and the ranger as a "you are here" icon.
// No Phaser here, so the React map can use it directly. Cached after the
// first call.

let mapUrl = null;
let youUrl = null;

const spriteCanvas = (sprite) => {
  const canvas = makeCanvas(sprite.w, sprite.h);
  sprite.draw(canvas.getContext('2d'));
  return canvas;
};

export const parkMapImage = () => {
  if (mapUrl) return mapUrl;
  const grid = buildGrid();
  const world = renderGround(grid);
  const ctx = world.getContext('2d');
  const trees = TREE_ART.map(spriteCanvas);

  const objects = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (grid[r][c] !== T.TREE) continue;
      const img = trees[(c * 3 + r * 5) % trees.length];
      objects.push({
        base: (r + 1) * TILE,
        img,
        x: c * TILE + TILE / 2 - img.width / 2,
        y: (r + 1) * TILE + 1 - img.height,
      });
    }
  }
  for (const b of BUILDINGS) {
    objects.push({
      base: (BUILDING_Y + 6) * TILE,
      img: renderBuilding(b),
      x: b.x * TILE - 2,
      y: BUILDING_Y * TILE,
    });
  }
  // Each enclosure shows its residents, so the map reads like a park guide.
  for (const spec of CREATURES) {
    const art = CREATURE_ART[spec.key];
    const img = spriteCanvas(art.frames[0]);
    const { area } = spec;
    for (let i = 0; i < spec.count; i += 1) {
      const cx = area.x + art.w / 2 + ((i + 1) / (spec.count + 1)) * (area.w - art.w);
      const cy = area.y + area.h / 2 + (i % 2 ? 6 : -6) * (spec.count > 1 ? 1 : 0);
      objects.push({
        base: cy + art.h / 2,
        img,
        x: Math.round(cx - art.w / 2),
        y: Math.round(cy - art.h / 2),
      });
    }
  }
  // The park jeep.
  for (const d of DECOR) {
    if (d.kind === 'jeep')
      objects.push({ base: d.y, img: spriteCanvas(JEEP_ART), x: d.x - JEEP_ART.w / 2, y: d.y - JEEP_ART.h });
  }
  // The flagpole and bulletin board.
  for (const e of EXHIBITS) {
    const [sx, sy] = e.sign;
    const base = (sy + 1) * TILE;
    if (e.prop === 'flag')
      objects.push({
        base,
        img: spriteCanvas(FLAG_ART[0]),
        x: sx * TILE + TILE / 2 - FLAG_SIZE.poleX,
        y: base - FLAG_SIZE.h,
      });
    if (e.prop === 'board')
      objects.push({ base, img: spriteCanvas(BOARD_ART), x: sx * TILE - 16, y: base - 30 });
  }
  objects.sort((a, b) => a.base - b.base);
  for (const o of objects) ctx.drawImage(o.img, o.x, o.y);

  mapUrl = world.toDataURL('image/png');
  return mapUrl;
};

export const youIcon = () => {
  if (!youUrl) youUrl = spriteCanvas(RANGER_FRAMES['down-idle']).toDataURL('image/png');
  return youUrl;
};

export const MAP_SIZE = { w: COLS * TILE, h: ROWS * TILE };

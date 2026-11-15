// Tiny pixel-art toolkit. Sprites are painted onto a grid of cells using
// "materials" (a base color plus a highlight and a shadow), then finished
// with automatic shading (light from the top-left) and a 1px outline, the
// look of classic top-down RPG sprites. Plain color strings are "details"
// (eyes, buttons) that skip shading.

export const OUTLINE = '#2b2236';

// A material: base color with lighter top edge and darker bottom/right edge.
export const mat = (base, hi, lo) => ({ base, hi, lo });

export class PixelSprite {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.cells = new Array(w * h).fill(null);
  }

  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h;
  }

  get(x, y) {
    return this.inBounds(x, y) ? this.cells[y * this.w + x] : null;
  }

  set(x, y, paint) {
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (this.inBounds(ix, iy)) this.cells[iy * this.w + ix] = paint;
    return this;
  }

  rect(x, y, w, h, paint) {
    for (let j = 0; j < h; j += 1) for (let i = 0; i < w; i += 1) this.set(x + i, y + j, paint);
    return this;
  }

  ellipse(cx, cy, rx, ry, paint) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) {
        const dx = (x - cx) / (rx + 0.35);
        const dy = (y - cy) / (ry + 0.35);
        if (dx * dx + dy * dy <= 1) this.set(x, y, paint);
      }
    }
    return this;
  }

  // Thick line with round ends; r0 -> r1 lets limbs and tails taper.
  capsule(x0, y0, x1, y1, r0, paint, r1 = r0) {
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2));
    for (let s = 0; s <= steps; s += 1) {
      const t = s / steps;
      this.ellipse(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r0 + (r1 - r0) * t, r0 + (r1 - r0) * t, paint);
    }
    return this;
  }

  // Rows of characters mapped through a legend: '.' is empty.
  map(rows, legend, ox = 0, oy = 0) {
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch !== '.' && legend[ch] !== undefined) this.set(ox + x, oy + y, legend[ch]);
      });
    });
    return this;
  }

  // Resolve materials to colors with simple top-left lighting, then outline.
  finish({ outline = OUTLINE, shade = true } = {}) {
    const out = new Array(this.w * this.h).fill(null);
    for (let y = 0; y < this.h; y += 1) {
      for (let x = 0; x < this.w; x += 1) {
        const cell = this.get(x, y);
        if (cell === null) continue;
        if (typeof cell === 'string') {
          out[y * this.w + x] = cell;
          continue;
        }
        let color = cell.base;
        if (shade) {
          const up = this.get(x, y - 1);
          const down = this.get(x, y + 1);
          const right = this.get(x + 1, y);
          if (up !== cell && (up === null || typeof up !== 'string')) color = cell.hi;
          else if (down === null || right === null) color = cell.lo;
        }
        out[y * this.w + x] = color;
      }
    }
    if (outline) {
      const filled = (x, y) =>
        this.inBounds(x, y) && out[y * this.w + x] !== null && out[y * this.w + x] !== outline;
      const ring = [];
      for (let y = 0; y < this.h; y += 1) {
        for (let x = 0; x < this.w; x += 1) {
          if (out[y * this.w + x] !== null) continue;
          if (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1))
            ring.push(y * this.w + x);
        }
      }
      for (const i of ring) out[i] = outline;
    }
    this.colors = out;
    return this;
  }

  // Paint onto a canvas 2D context at (ox, oy), optionally mirrored.
  draw(ctx, ox = 0, oy = 0, { flip = false } = {}) {
    const colors = this.colors ?? this.finish().colors;
    for (let y = 0; y < this.h; y += 1) {
      for (let x = 0; x < this.w; x += 1) {
        const c = colors[y * this.w + x];
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fillRect(ox + (flip ? this.w - 1 - x : x), oy + y, 1, 1);
      }
    }
  }
}

// Deterministic random numbers so the world looks the same on every visit.
export const seeded = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

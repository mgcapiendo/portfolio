import { mat, PixelSprite } from './pixel';

// Original pixel dinosaurs, built from simple shapes (ellipses and tapered
// capsules), then auto-shaded and outlined by PixelSprite. All face right;
// the game mirrors them to face left. Each has two frames (walk / flap /
// swim) so they can animate.

const EYE = '#2b2236';
const GLINT = '#ffffff';
const TOOTH = '#fff7e8';

// Darker version of a material for limbs on the far side of the body.
const behind = (m) => mat(m.lo, m.base, m.lo);

const eye = (s, x, y) => {
  s.set(x, y, EYE);
  s.set(x, y - 1, GLINT);
};

const SPECIES = {
  trex: {
    w: 48,
    h: 40,
    draw(s, f) {
      const skin = mat('#c8574a', '#e57a63', '#963a33');
      const belly = mat('#f0c9a0', '#fbe2c4', '#d4a77c');
      const o = f ? 2 : -2;
      s.capsule(14, 21, 2, 15, 4.5, skin, 1.2); // tail
      s.ellipse(17 + o, 27, 4, 4, behind(skin)); // far leg
      s.capsule(17 + o, 29, 17 + o, 35, 1.8, behind(skin));
      s.rect(15 + o, 35, 5, 2, behind(skin));
      s.ellipse(21, 21, 10, 8, skin); // body
      s.ellipse(24, 24, 6, 4, belly);
      s.capsule(27, 17, 32, 12, 4.5, skin); // neck
      s.ellipse(36, 10, 6.5, 5, skin); // head
      s.rect(38, 8, 8, 6, skin); // snout
      for (let x = 39; x <= 44; x += 2) s.set(x, 13, TOOTH);
      s.set(45, 9, EYE); // nostril
      eye(s, 37, 8);
      s.capsule(30, 22, 33, 25, 1.2, skin); // tiny arm
      s.ellipse(23 - o, 27, 4.5, 4.5, skin); // near leg
      s.capsule(23 - o, 30, 23 - o, 36, 2, skin);
      s.rect(21 - o, 36, 6, 2, skin);
    },
  },
  raptor: {
    w: 24,
    h: 16,
    draw(s, f) {
      const skin = mat('#5b8fd6', '#82b2ee', '#3f6aaa');
      const o = f ? 1 : -1;
      s.capsule(8, 8, 1, 5, 2.2, skin, 0.7);
      s.capsule(9 + o, 10, 9 + o, 14, 1, behind(skin));
      s.ellipse(11, 8, 5, 3.5, skin);
      s.capsule(14, 7, 17, 4, 1.8, skin);
      s.ellipse(19, 3.5, 3, 2, skin);
      s.rect(20, 3, 3, 2, skin);
      for (const x of [8, 10, 12]) s.set(x, 6, '#3f6aaa'); // stripes
      eye(s, 19, 3);
      s.capsule(12 - o, 10, 12 - o, 14, 1.1, skin);
    },
  },
  compy: {
    w: 12,
    h: 8,
    draw(s, f) {
      const skin = mat('#9ccf4f', '#bfe470', '#76a536');
      const o = f ? 1 : 0;
      s.capsule(4, 4, 0, 2, 1, skin, 0.5);
      s.ellipse(5, 4, 2.5, 1.8, skin);
      s.ellipse(8, 2, 1.8, 1.5, skin);
      s.set(4 + o, 6, skin).set(4 + o, 7, skin);
      s.set(6 - o, 6, skin).set(6 - o, 7, skin);
      s.set(9, 2, EYE);
    },
  },
  ankylo: {
    w: 40,
    h: 20,
    draw(s, f) {
      const skin = mat('#a8794a', '#c99a63', '#7d5632');
      const armor = mat('#e2c88f', '#f6e2b0', '#b89c63');
      const o = f ? 1 : -1;
      s.capsule(10, 12, 3, 10, 2.5, skin, 1.5); // tail
      s.ellipse(3, 10, 2.8, 2.6, armor); // club
      s.capsule(13 + o, 14, 13 + o, 18, 2, behind(skin));
      s.capsule(26 - o, 14, 26 - o, 18, 2, behind(skin));
      s.ellipse(19, 11, 11, 6, skin); // dome
      for (let x = 11; x <= 27; x += 4) s.ellipse(x, 7, 1.6, 1.1, armor);
      for (let x = 10; x <= 28; x += 3) s.set(x, 13, '#f6e2b0');
      s.ellipse(32, 12, 4, 3, skin); // head
      s.rect(34, 12, 3, 2, skin);
      eye(s, 33, 11);
      s.capsule(15 - o, 14, 15 - o, 18, 2, skin);
      s.capsule(28 + o, 14, 28 + o, 18, 2, skin);
    },
  },
  parasaur: {
    w: 36,
    h: 28,
    draw(s, f) {
      const skin = mat('#e08c3c', '#f6ad5e', '#b0682a');
      const crest = mat('#c0533f', '#de7a5c', '#94392c');
      const belly = mat('#f6dcb0', '#fff0d4', '#dcbc88');
      const o = f ? 2 : -2;
      s.capsule(12, 15, 2, 11, 3, skin, 1);
      s.ellipse(14 + o, 18, 3.5, 3.5, behind(skin));
      s.capsule(14 + o, 20, 14 + o, 26, 1.5, behind(skin));
      s.ellipse(17, 15, 8, 6, skin);
      s.ellipse(19, 18, 5, 3, belly);
      s.capsule(22, 12, 26, 7, 3, skin);
      s.capsule(26, 4, 19, 1, 1.5, crest); // hollow crest
      s.ellipse(28, 6, 4, 3, skin);
      s.rect(30, 6, 4, 3, skin);
      eye(s, 28, 5);
      s.capsule(23, 17, 25, 20, 1, skin);
      s.ellipse(18 - o, 19, 3.5, 3.5, skin);
      s.capsule(18 - o, 21, 18 - o, 26, 1.6, skin);
    },
  },
  brachio: {
    w: 48,
    h: 56,
    draw(s, f) {
      const skin = mat('#6aa89c', '#8fcabf', '#4b8378');
      const belly = mat('#dfeee0', '#f4fbf2', '#bcd6c2');
      const o = f ? 1 : -1;
      s.capsule(14, 38, 2, 32, 3.5, skin, 1);
      s.capsule(14 + o, 42, 14 + o, 54, 2.8, behind(skin));
      s.capsule(29 - o, 42, 29 - o, 54, 2.8, behind(skin));
      s.ellipse(20, 38, 11, 8, skin);
      s.ellipse(21, 42, 8, 4, belly);
      s.capsule(28, 33, 36, 8, 4, skin, 3); // long neck
      s.ellipse(39, 6, 5, 3.5, skin);
      s.rect(41, 6, 5, 3, skin);
      s.ellipse(38, 3, 2, 1.5, skin); // nasal bump
      eye(s, 39, 5);
      s.capsule(17 - o, 42, 17 - o, 54, 3, skin);
      s.capsule(31 + o, 42, 31 + o, 54, 3, skin);
    },
  },
  ptera: {
    w: 32,
    h: 16,
    draw(s, f) {
      const skin = mat('#b0607a', '#c97f97', '#8a4560');
      const wing = mat('#d99ab0', '#efc0d0', '#b87390');
      const crest = mat('#f5c242', '#ffe08a', '#c99a2e');
      if (f) {
        s.capsule(15, 9, 3, 13, 1.6, wing, 0.6);
        s.capsule(18, 9, 28, 14, 1.4, behind(wing), 0.6);
      } else {
        s.capsule(15, 8, 3, 2, 1.6, wing, 0.6);
        s.capsule(18, 8, 27, 1, 1.4, behind(wing), 0.6);
      }
      s.ellipse(16, 9, 4, 2.5, skin);
      s.ellipse(21, 7, 2.5, 2, skin);
      s.capsule(22, 7, 30, 8, 0.8, skin);
      s.capsule(20, 6, 15, 3, 1, crest);
      eye(s, 21, 7);
      s.set(13, 12, skin).set(15, 12, skin);
    },
  },
  mosa: {
    w: 64,
    h: 20,
    waterline: 10,
    draw(s, f) {
      const skin = mat('#3d6fb8', '#5f92d6', '#2b5290');
      const belly = mat('#d7e6f5', '#f1f7fd', '#aac3dc');
      const o = f ? 2 : 0;
      s.capsule(18, 10, 4, 8 + (f ? 1 : -1), 4, skin, 1); // tail
      s.capsule(4, 8, 1, 4 - o / 2, 1.2, skin);
      s.capsule(4, 8, 1, 12 + o / 2, 1.2, skin);
      s.capsule(26, 13, 22 - o, 18, 1.8, behind(skin)); // far flipper
      s.ellipse(30, 10, 15, 6, skin);
      s.ellipse(32, 13, 11, 3, belly);
      s.ellipse(48, 9, 8, 4.5, skin);
      s.rect(50, 9, 12, 4, skin);
      for (let x = 52; x <= 60; x += 2) s.set(x, 12, TOOTH);
      eye(s, 49, 7);
      s.capsule(40, 14, 37 + o, 18, 1.8, skin); // near flipper
    },
  },
  sarco: {
    w: 48,
    h: 12,
    waterline: 7,
    draw(s, f) {
      const skin = mat('#6f8a4a', '#8faa62', '#526a35');
      const belly = mat('#c9c48f', '#e2ddb0', '#a6a06c');
      const o = f ? 1 : -1;
      s.capsule(14, 6, 1, 5 + (f ? 0.5 : -0.5), 2.5, skin, 0.8);
      s.capsule(15 + o, 9, 14 + o, 11, 1, behind(skin));
      s.ellipse(21, 6, 9, 3.5, skin);
      s.ellipse(22, 8, 7, 1.5, belly);
      for (let x = 13; x <= 28; x += 2) s.set(x, 3, '#526a35'); // scutes
      s.ellipse(32, 6, 3.5, 2.5, skin);
      s.capsule(33, 6, 45, 6.5, 1.6, skin); // long snout
      s.ellipse(46, 6, 1.6, 1.6, skin);
      eye(s, 32, 4);
      s.capsule(26 - o, 9, 27 - o, 11, 1, skin);
    },
  },
  // Spinosaurus: full body (sail, arms, legs). Swimming, only the sail, back,
  // head and snout show above the waterline; it pops out with everything.
  spino: {
    w: 48,
    h: 32,
    waterline: 15,
    draw(s, f) {
      const skin = mat('#4f7f6e', '#6fa38f', '#385c50');
      const sail = mat('#d8703f', '#f09466', '#a8502b');
      const belly = mat('#e8dcb8', '#f8f0d8', '#c8b88e');
      const o = f ? 1 : -1;
      s.capsule(12, 19, 1, 14 + (f ? 1 : 0), 3, skin, 1); // tail
      s.capsule(17 + o, 23, 17 + o, 30, 1.8, behind(skin)); // far leg
      s.rect(15 + o, 29, 5, 2, behind(skin));
      s.capsule(30, 19, 33, 23, 1.2, behind(skin)); // far arm
      s.ellipse(19, 11, 9, 6, sail); // sail
      for (let x = 13; x <= 25; x += 3) s.set(x, 7, sail.lo).set(x, 9, sail.lo); // spines
      s.ellipse(20, 18, 10, 6, skin); // body
      s.ellipse(22, 21, 7, 3, belly);
      s.capsule(27, 15, 32, 11, 3, skin); // neck
      s.ellipse(35, 10, 4, 3, skin); // head
      s.rect(37, 9, 10, 3, skin); // long snout
      for (let x = 39; x <= 45; x += 2) s.set(x, 12, TOOTH);
      eye(s, 35, 9);
      s.capsule(28, 19, 31, 23, 1.3, skin); // near arm with claws
      s.set(32, 24, TOOTH).set(30, 24, TOOTH);
      s.capsule(23 - o, 23, 23 - o, 30, 2, skin); // near leg
      s.rect(21 - o, 29, 6, 2, skin);
    },
  },
  // Megalodon: giant prehistoric shark gliding through the bay.
  megalodon: {
    w: 56,
    h: 20,
    waterline: 6,
    draw(s, f) {
      const skin = mat('#6e86a3', '#93a9c3', '#4e6480');
      const belly = mat('#e8eef5', '#ffffff', '#c3cfdc');
      const o = f ? 1 : 0;
      s.capsule(11, 10, 3, 3 + o, 2, skin, 0.8); // tail fin, upper lobe
      s.capsule(11, 10, 4, 17 - o, 2, skin, 0.8); // tail fin, lower lobe
      s.capsule(36, 13, 31, 18, 1.5, behind(skin)); // far pectoral fin
      s.ellipse(28, 10, 19, 6, skin); // body
      s.ellipse(31, 13, 15, 2.5, belly);
      s.capsule(26, 5, 21, 0, 2.2, skin, 0.6); // dorsal fin
      s.ellipse(46, 9, 7, 4.5, skin); // head
      for (let x = 44; x <= 51; x += 2) s.set(x, 13, TOOTH);
      for (const x of [37, 39, 41]) s.set(x, 8, '#4e6480').set(x, 9, '#4e6480'); // gills
      eye(s, 48, 8);
      s.capsule(33, 13, 29, 17, 1.5, skin); // near pectoral fin
    },
  },
  hatchling: {
    w: 12,
    h: 12,
    draw(s, f) {
      const skin = mat('#8fd36a', '#b2e88a', '#69ad4a');
      const shell = mat('#f6ecd2', '#fffaf0', '#d9c9a4');
      const up = f ? 1 : 0;
      s.ellipse(6, 5 - up, 3, 3, skin);
      s.ellipse(6, 9, 4.5, 3, shell);
      for (let x = 2; x <= 10; x += 2) s.set(x, 6, shell); // cracked rim
      s.set(5, 4 - up, EYE).set(7, 4 - up, EYE);
    },
  },
};

const FOAM = '#e6f6ff';
const RIPPLE = '#8fd3f7';

const cloneSprite = (sprite) => {
  const copy = new PixelSprite(sprite.w, sprite.h);
  copy.colors = [...sprite.colors];
  return copy;
};

// Swimming version of a finished sprite: everything under the waterline is
// hidden (outline included, so there is no dark edge) and a line of foam
// with ripples is painted where the body meets the water.
const submerge = (sprite, line, f) => {
  const { w, h, colors } = sprite;
  let minX = w;
  let maxX = -1;
  for (let y = Math.max(0, line - 3); y < line; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (colors[y * w + x]) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
      }
    }
  }
  for (let i = line * w; i < w * h; i += 1) colors[i] = null;
  if (maxX < 0) return;
  const paint = (x, y, c) => {
    if (x >= 0 && x < w && y >= 0 && y < h) colors[y * w + x] = c;
  };
  const shift = f ? 2 : 0;
  for (let x = minX - 2; x <= maxX + 2; x += 1) {
    if ((x + shift) % 5 !== 0) paint(x, line, x > minX + 1 && x < maxX - 1 ? FOAM : RIPPLE);
  }
  for (let x = minX + shift; x < maxX; x += 6) for (let k = 0; k < 3; k += 1) paint(x + k, line + 2, RIPPLE);
};

// { key: { w, h, frames: [swim or walk 0, 1], breach?: [full body 0, 1], waterline? } }
// Water creatures swim with only their top showing; `breach` is the full
// body, used when they pop out of the water to greet you.
export const CREATURE_ART = Object.fromEntries(
  Object.entries(SPECIES).map(([key, spec]) => {
    const full = [0, 1].map((f) => {
      const s = new PixelSprite(spec.w, spec.h);
      spec.draw(s, f);
      return s.finish();
    });
    if (!spec.waterline) return [key, { w: spec.w, h: spec.h, frames: full }];
    const frames = full.map((sprite, f) => {
      const swim = cloneSprite(sprite);
      submerge(swim, spec.waterline, f);
      return swim;
    });
    return [key, { w: spec.w, h: spec.h, frames, breach: full, waterline: spec.waterline }];
  }),
);

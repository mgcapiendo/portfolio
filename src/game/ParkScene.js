import * as Phaser from 'phaser';
import { CREATURE_ART } from './art/creatures';
import { OUTLINE, PixelSprite } from './art/pixel';
import { P } from './art/palette';
import { RANGER_FRAMES } from './art/ranger';
import {
  BOARD_ART,
  FLAG_ART,
  FLAG_SIZE,
  JEEP_ART,
  makeCanvas,
  renderBuilding,
  renderGround,
  TREE_ART,
} from './art/world';
import { emit, on } from './bus';
import {
  BUILDING_Y,
  BUILDINGS,
  buildGrid,
  DECOR,
  COLS,
  CREATURES,
  EXHIBITS,
  ROWS,
  SOLID,
  SPAWN,
  T,
  TILE,
} from './map';
import { sfx } from './sound';

// Choktopia: top-down pixel-art park. All art is generated at runtime from
// the art/ modules (original sprites), so it can be swapped for hand-drawn
// sprite sheets later without touching the game logic.

const SPEED = 72; // px per second
const FEET = 8; // from the ranger's center to the feet
const WATER_CREATURES = new Set(['mosa', 'sarco', 'spino', 'megalodon']);
const WARY_CREATURES = new Set(['trex', 'raptor', 'sarco', 'spino', 'megalodon']); // react with "!" instead of a heart
const SOLID_SET = new Set(SOLID);

// Speech bubble with "!" (sign marker, and the wary creatures' reaction).
const bubble = (ink) =>
  new PixelSprite(11, 13)
    .map(
      [
        '.ooooooooo.',
        'owwwwwwwwwo',
        'owwwwnwwwwo',
        'owwwwnwwwwo',
        'owwwwnwwwwo',
        'owwwwnwwwwo',
        'owwwwwwwwwo',
        'owwwwnwwwwo',
        'owwwwwwwwwo',
        '.ooooooooo.',
        '...owwo....',
        '...owo.....',
        '...oo......',
      ],
      { o: OUTLINE, w: '#ffffff', n: ink },
    )
    .finish({ outline: null, shade: false });

const HEART = new PixelSprite(9, 8)
  .map(
    ['.oo...oo.', 'ohho.oppo', 'ohppopppo', 'oppppppo.', '.oppppo..', '..oppo...', '...oo....'].map((row) =>
      row.padEnd(9, '.'),
    ),
    { o: OUTLINE, p: '#ff6f91', h: '#ffd1dc' },
  )
  .finish({ outline: null, shade: false });

const addTexture = (scene, key, canvas) => {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  scene.textures.addCanvas(key, canvas);
};

const spriteCanvas = (sprite) => {
  const canvas = makeCanvas(sprite.w, sprite.h);
  sprite.draw(canvas.getContext('2d'));
  return canvas;
};

const shadowCanvas = (w) => {
  const rx = Math.max(4, Math.round(w * 0.38));
  const ry = Math.max(2, Math.round(w * 0.1));
  const canvas = makeCanvas(rx * 2, ry * 2 + 1);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = P.shadow;
  for (let y = -ry; y <= ry; y += 1) {
    const half = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry)));
    ctx.fillRect(rx - half, ry + y, half * 2, 1);
  }
  return canvas;
};

export default class ParkScene extends Phaser.Scene {
  constructor() {
    super('park');
    this.paused = false;
    this.active = null;
    this.target = null;
    this.path = null;
    this.pendingOpen = null;
    this.blockedFor = 0;
    this.facing = 'down';
  }

  create() {
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.makeArt();

    // ---- World ----
    this.grid = buildGrid();
    const grid = this.grid;
    addTexture(this, 'ground', renderGround(grid));
    this.add.image(0, 0, 'ground').setOrigin(0, 0).setDepth(-1);

    // Invisible collision layer from the same grid.
    addTexture(this, 'collision-tiles', makeCanvas(TILE * Object.keys(T).length, TILE));
    const map = this.make.tilemap({ data: grid, tileWidth: TILE, tileHeight: TILE });
    const layer = map.createLayer(0, map.addTilesetImage('collision-tiles'), 0, 0);
    layer.setCollision(SOLID).setVisible(false);

    // Trees and buildings are depth-sorted by their base, so the ranger can
    // walk behind a canopy.
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        if (grid[r][c] !== T.TREE) continue;
        const variant = (c * 3 + r * 5) % TREE_ART.length;
        this.add
          .image(c * TILE + TILE / 2, (r + 1) * TILE + 1, `tree-${variant}`)
          .setOrigin(0.5, 1)
          .setDepth((r + 1) * TILE);
      }
    }
    for (const b of BUILDINGS) {
      this.add
        .image(b.x * TILE - 2, BUILDING_Y * TILE, `building-${b.id}`)
        .setOrigin(0, 0)
        .setDepth((BUILDING_Y + 6) * TILE);
    }
    this.addProps();
    this.addWaterSparkles();

    const worldW = COLS * TILE;
    const worldH = ROWS * TILE;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    this.creatures = [];
    for (const spec of CREATURES) this.spawnCreatures(spec);

    // ---- Player ----
    this.playerShadow = this.add.image(SPAWN.x, SPAWN.y + FEET + 1, 'shadow-14');
    this.player = this.physics.add.sprite(SPAWN.x, SPAWN.y, 'ranger-down-idle');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(10, 5).setOffset(3, 15); // feet only, top-down feel
    this.physics.add.collider(this.player, layer);

    // Footsteps land on the walk frames where a foot touches down.
    this.player.on('animationupdate', (_anim, frame) => {
      if (/-(a|b)$/.test(frame.textureKey)) sfx.step(this.surfaceUnderFeet());
    });

    this.marker = this.add.image(0, 0, 'bubble').setVisible(false).setDepth(100000);
    this.markerBaseY = 0;

    // ---- Camera ----
    const cam = this.cameras.main;
    cam.setBounds(0, 0, worldW, worldH);
    const lerp = this.reduceMotion ? 1 : 0.15;
    cam.startFollow(this.player, true, lerp, lerp);
    // Exhibits sit north of the path, so frame a little more of what is ahead.
    cam.setFollowOffset(0, 28);
    cam.setRoundPixels(true);
    this.fitZoom();
    this.scale.on('resize', this.fitZoom, this);

    // ---- Input ----
    // Phaser only handles walking. Read (E) and Map (M) live in React, which
    // knows which panel is open. Capture is off so keys still reach the React
    // buttons over the game.
    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT', false);

    // Tap or click: walk there along the paths. Tapping a sign walks to it
    // and opens it on arrival.
    this.input.on('pointerdown', (pointer) => {
      if (!this.paused) this.walkTo(pointer.worldX, pointer.worldY);
    });

    // ---- Bridge to React ----
    const offs = [
      on('park:pause', () => this.setPaused(true)),
      on('park:resume', () => this.setPaused(false)),
      on('park:travel', (event) => this.travelTo(event.detail.id)),
      // The map menu asks where the ranger is (answered synchronously).
      on('park:where', () => emit('park:here', { x: this.player.x, y: this.player.y + FEET })),
    ];
    this.events.once('shutdown', () => {
      offs.forEach((off) => off());
      this.scale.off('resize', this.fitZoom, this);
    });

    emit('park:ready');
  }

  // Turn the art modules into textures and animations.
  makeArt() {
    for (const [name, sprite] of Object.entries(RANGER_FRAMES))
      addTexture(this, `ranger-${name}`, spriteCanvas(sprite));
    const anim = (key, frames, frameRate) => {
      if (!this.anims.exists(key))
        this.anims.create({ key, frames: frames.map((k) => ({ key: k })), frameRate, repeat: -1 });
    };
    anim('walk-down', ['ranger-down-a', 'ranger-down-idle', 'ranger-down-b', 'ranger-down-idle'], 8);
    anim('walk-up', ['ranger-up-a', 'ranger-up-idle', 'ranger-up-b', 'ranger-up-idle'], 8);
    anim('walk-side', ['ranger-side-a', 'ranger-side-idle'], 6);

    for (const [key, art] of Object.entries(CREATURE_ART)) {
      art.frames.forEach((frame, i) => addTexture(this, `dino-${key}-${i}`, spriteCanvas(frame)));
      anim(`dino-${key}`, [`dino-${key}-0`, `dino-${key}-1`], key === 'ptera' ? 4 : 3);
      // Water creatures also get a full-body "breach" animation for popping out.
      art.breach?.forEach((frame, i) => addTexture(this, `dino-${key}-breach-${i}`, spriteCanvas(frame)));
      if (art.breach) anim(`dino-${key}-breach`, [`dino-${key}-breach-0`, `dino-${key}-breach-1`], 4);
      addTexture(this, `shadow-${art.w}`, shadowCanvas(art.w));
    }
    addTexture(this, 'shadow-14', shadowCanvas(14));
    TREE_ART.forEach((sprite, i) => addTexture(this, `tree-${i}`, spriteCanvas(sprite)));
    for (const b of BUILDINGS) addTexture(this, `building-${b.id}`, renderBuilding(b));
    addTexture(this, 'bubble', spriteCanvas(bubble('#2b4f9a')));
    addTexture(this, 'emote-alert', spriteCanvas(bubble('#d6453a')));
    addTexture(this, 'emote-heart', spriteCanvas(HEART));
    FLAG_ART.forEach((sprite, i) => addTexture(this, `flag-${i}`, spriteCanvas(sprite)));
    anim('flag-wave', ['flag-0', 'flag-1'], 2);
    addTexture(this, 'board', spriteCanvas(BOARD_ART));
    addTexture(this, 'jeep', spriteCanvas(JEEP_ART));

    const sparkle = makeCanvas(3, 3);
    const sctx = sparkle.getContext('2d');
    sctx.fillStyle = '#ffffff';
    sctx.fillRect(1, 0, 1, 3);
    sctx.fillRect(0, 1, 3, 1);
    addTexture(this, 'sparkle', sparkle);

    const droplet = makeCanvas(2, 2);
    const dctx = droplet.getContext('2d');
    dctx.fillStyle = '#e6f6ff';
    dctx.fillRect(0, 0, 2, 2);
    addTexture(this, 'droplet', droplet);
  }

  // Exhibits that are real objects instead of signs: the flagpole in front of
  // the Ranger Station and the bulletin board in front of the Visitor Center.
  addProps() {
    for (const d of DECOR) {
      if (d.kind === 'jeep') this.add.image(d.x, d.y, 'jeep').setOrigin(0.5, 1).setDepth(d.y);
    }
    for (const e of EXHIBITS) {
      const [sx, sy] = e.sign;
      const base = (sy + 1) * TILE;
      if (e.prop === 'flag') {
        const flagSprite = this.add
          .sprite(sx * TILE + TILE / 2, base, 'flag-0')
          .setOrigin((FLAG_SIZE.poleX + 0.5) / FLAG_SIZE.w, 1)
          .setDepth(base);
        if (!this.reduceMotion) flagSprite.play('flag-wave');
      } else if (e.prop === 'board') {
        this.add
          .image(sx * TILE, base, 'board')
          .setOrigin(0.5, 1)
          .setDepth(base);
      }
    }
  }

  // Little glints that come and go on the water.
  addWaterSparkles() {
    if (this.reduceMotion) return;
    const water = [];
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) if (this.grid[r][c] === T.WATER) water.push([c, r]);
    }
    const place = (img) => {
      const [c, r] = water[Phaser.Math.Between(0, water.length - 1)];
      img.setPosition(c * TILE + Phaser.Math.Between(2, 13), r * TILE + Phaser.Math.Between(3, 12));
    };
    for (let i = 0; i < 28; i += 1) {
      const img = this.add.image(0, 0, 'sparkle').setAlpha(0).setDepth(0);
      place(img);
      this.tweens.add({
        targets: img,
        alpha: 0.9,
        duration: 500,
        yoyo: true,
        hold: 200,
        delay: Phaser.Math.Between(0, 4000),
        repeat: -1,
        repeatDelay: Phaser.Math.Between(1500, 4000),
        onRepeat: () => place(img),
      });
    }
  }

  // Creatures: a sprite plus its ground shadow (and a hidden emote) in a
  // container, with simple motion per kind. Sprites face right; flipX turns
  // them around. Each one knows which exhibit signs it reacts to.
  spawnCreatures(spec) {
    const art = CREATURE_ART[spec.key];
    const { w, h } = art;
    const { area } = spec;
    const flies = spec.motion === 'fly';

    for (let i = 0; i < spec.count; i += 1) {
      const startX = area.x + w / 2 + ((i + 1) / (spec.count + 1)) * (area.w - w);
      const startY = area.y + area.h / 2 + (i % 2 ? 6 : -6) * (spec.count > 1 ? 1 : 0);
      const body = this.add.sprite(0, 0, `dino-${spec.key}-0`);
      const emote = this.add
        .image(0, -h / 2 - 9, WARY_CREATURES.has(spec.key) ? 'emote-alert' : 'emote-heart')
        .setVisible(false);
      const parts = [body, emote];
      if (!WATER_CREATURES.has(spec.key))
        parts.unshift(this.add.image(0, h / 2 - 1 + (flies ? 16 : 0), `shadow-${w}`));
      const container = this.add.container(startX, startY, parts);
      const creature = {
        container,
        body,
        emote,
        spec,
        art,
        reacting: false,
        baseOffset: h / 2 + (flies ? 16 : 0),
      };
      this.creatures.push(creature);

      if (this.reduceMotion) continue;
      body.play({ key: `dino-${spec.key}`, startFrame: i % 2 });

      const left = area.x + w / 2;
      const right = area.x + area.w - w / 2;
      const delay = i * 700;

      switch (spec.motion) {
        case 'pace':
          this.tweens.add({
            targets: container,
            x: { from: left + (i * (right - left)) / (spec.count + 1), to: right },
            duration: 7000 + i * 1500,
            delay,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            onYoyo: () => body.setFlipX(true),
            onRepeat: () => body.setFlipX(false),
          });
          break;
        case 'dart': {
          const hop = () => {
            if (creature.reacting) {
              this.time.delayedCall(800, hop);
              return;
            }
            const x = Phaser.Math.Between(left, right);
            body.setFlipX(x < container.x);
            this.tweens.add({
              targets: container,
              x,
              y: Phaser.Math.Between(area.y + h, area.y + area.h - h),
              duration: Phaser.Math.Between(400, 900),
              ease: 'Quad.easeOut',
              onComplete: () => this.time.delayedCall(Phaser.Math.Between(300, 1500), hop),
            });
          };
          this.time.delayedCall(delay, hop);
          break;
        }
        case 'hop':
          this.tweens.add({
            targets: body,
            y: -4,
            duration: 260,
            delay,
            yoyo: true,
            repeat: -1,
            repeatDelay: 900,
          });
          break;
        case 'fly':
          this.tweens.add({
            targets: container,
            x: { from: left, to: right },
            duration: 9000 + i * 2000,
            delay,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            onYoyo: () => body.setFlipX(true),
            onRepeat: () => body.setFlipX(false),
          });
          this.tweens.add({
            targets: body,
            y: -8,
            duration: 1300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
          break;
        case 'drift':
          this.tweens.add({
            targets: container,
            x: { from: left, to: right },
            duration: 16000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            onYoyo: () => body.setFlipX(true),
            onRepeat: () => body.setFlipX(false),
          });
          break;
        default:
          break;
      }
    }
  }

  // A creature notices you: it stops, turns to face you and shows an emote.
  // Land animals hop; water creatures pop up out of the water with a splash
  // and show their whole body until you leave.
  react(creature) {
    const { container, body, emote, art, spec } = creature;
    creature.reacting = true;
    for (const tween of [...this.tweens.getTweensOf(container), ...this.tweens.getTweensOf(body)])
      tween.pause();
    body.setFlipX(this.player.x < container.x);
    if (art.breach) body.play(`dino-${spec.key}-breach`);
    emote.setVisible(true).setScale(this.reduceMotion ? 1 : 0);
    if (this.reduceMotion) return;
    this.tweens.add({ targets: emote, scale: 1, duration: 180, ease: 'Back.easeOut' });
    if (art.breach) {
      this.splash(creature, 10);
      creature.hop = this.tweens.add({ targets: body, y: -6, duration: 260, ease: 'Back.easeOut' });
    } else {
      creature.hop = this.tweens.add({ targets: body, y: body.y - 3, duration: 140, yoyo: true, repeat: 1 });
    }
  }

  calm(creature) {
    const { container, body, emote, art, spec } = creature;
    creature.reacting = false;
    emote.setVisible(false);
    creature.hop?.stop();
    body.y = 0;
    if (art.breach) {
      if (!this.reduceMotion) {
        body.play(`dino-${spec.key}`);
        this.splash(creature, 6);
      } else {
        body.setTexture(`dino-${spec.key}-0`);
      }
    }
    for (const tween of [...this.tweens.getTweensOf(container), ...this.tweens.getTweensOf(body)])
      tween.resume();
  }

  // Droplets that jump up and fall back where a creature breaks the surface.
  splash(creature, count) {
    const { container, art } = creature;
    const waterY = container.y + art.waterline - art.h / 2;
    for (let i = 0; i < count; i += 1) {
      const drop = this.add
        .image(container.x + Phaser.Math.Between(-art.w / 3, art.w / 3), waterY, 'droplet')
        .setDepth(container.depth + 1);
      this.tweens.add({
        targets: drop,
        y: waterY - Phaser.Math.Between(6, 14),
        x: drop.x + Phaser.Math.Between(-6, 6),
        alpha: 0,
        duration: Phaser.Math.Between(350, 550),
        ease: 'Quad.easeOut',
        onComplete: () => drop.destroy(),
      });
    }
  }

  creaturesAt(exhibit) {
    return exhibit ? this.creatures.filter((c) => c.spec.exhibits?.includes(exhibit.id)) : [];
  }

  // Whole-number zoom keeps pixels square; the view shows ~240 px on the
  // short side (3x on a laptop, 2x on phones) so creatures stay in view.
  fitZoom() {
    const { width, height } = this.scale.gameSize;
    const zoom = Math.max(2, Math.round(Math.min(width, height) / 240));
    this.cameras.main.setZoom(zoom);
  }

  // While paused, update() does nothing; held keys are cleared on resume.
  setPaused(paused) {
    this.paused = paused;
    this.target = null;
    this.path = null;
    this.pendingOpen = null;
    this.player.setVelocity(0, 0);
    if (!paused) this.input.keyboard.resetKeys();
  }

  // ---- Tap-to-move pathfinding (breadth-first search over the tile grid) ----

  walkable(c, r) {
    return r >= 0 && r < ROWS && c >= 0 && c < COLS && !SOLID_SET.has(this.grid[r][c]);
  }

  nearestWalkable(c, r) {
    for (let d = 0; d <= 2; d += 1) {
      for (let dr = -d; dr <= d; dr += 1) {
        for (let dc = -d; dc <= d; dc += 1) if (this.walkable(c + dc, r + dr)) return [c + dc, r + dr];
      }
    }
    return null;
  }

  findPath([sc, sr], [gc, gr]) {
    const key = (c, r) => r * COLS + c;
    const prev = new Map([[key(sc, sr), null]]);
    const queue = [[sc, sr]];
    while (queue.length) {
      const [c, r] = queue.shift();
      if (c === gc && r === gr) {
        const tiles = [];
        for (let k = key(c, r); k !== null; k = prev.get(k)) tiles.unshift([k % COLS, Math.floor(k / COLS)]);
        // Keep only the corners, so the walk looks natural.
        return tiles.filter((t, i) => {
          if (i === 0 || i === tiles.length - 1) return true;
          const [a, b] = [tiles[i - 1], tiles[i + 1]];
          return !(a[0] === t[0] && t[0] === b[0]) && !(a[1] === t[1] && t[1] === b[1]);
        });
      }
      for (const [dc, dr] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nc = c + dc;
        const nr = r + dr;
        if (this.walkable(nc, nr) && !prev.has(key(nc, nr))) {
          prev.set(key(nc, nr), key(c, r));
          queue.push([nc, nr]);
        }
      }
    }
    return null;
  }

  walkTo(worldX, worldY) {
    const c = Math.floor(worldX / TILE);
    const r = Math.floor(worldY / TILE);
    // A tap on a sign (or the bubble above it) means "go read this".
    const exhibit = EXHIBITS.find((e) => e.sign[0] === c && (e.sign[1] === r || e.sign[1] - 1 === r));
    this.pendingOpen = exhibit?.id ?? null;
    if (exhibit && this.active === exhibit) {
      this.arrive(exhibit);
      return;
    }

    const goal = exhibit ? [exhibit.sign[0], exhibit.sign[1] + 2] : this.nearestWalkable(c, r);
    if (!goal) return;
    const start = [Math.floor(this.player.x / TILE), Math.floor((this.player.y + FEET) / TILE)];
    const tiles = this.findPath(start, goal);
    this.blockedFor = 0;
    if (tiles && tiles.length > 1) {
      this.path = tiles.slice(1).map(([tc, tr]) => ({ x: tc * TILE + TILE / 2, y: tr * TILE + TILE / 2 }));
      // End exactly where tapped when it was open ground.
      if (!exhibit && this.walkable(c, r)) this.path[this.path.length - 1] = { x: worldX, y: worldY };
    } else {
      this.path = [{ x: worldX, y: worldY }];
    }
    this.target = this.path.shift();
  }

  arrive(exhibit) {
    this.pendingOpen = null;
    this.path = null;
    this.target = null;
    emit('park:arrived', { id: exhibit.id });
  }

  // Fast travel: drop the player on the path in front of an exhibit's sign.
  travelTo(id) {
    const exhibit = EXHIBITS.find((e) => e.id === id);
    if (!exhibit) return;
    this.target = null;
    this.path = null;
    this.pendingOpen = null;
    this.player.setVelocity(0, 0);
    this.player.setPosition(exhibit.stand.x, exhibit.stand.y);
    this.facing = 'up';
    this.cameras.main.centerOn(exhibit.stand.x, exhibit.stand.y);
    this.updateNearby();
  }

  update(time, delta) {
    if (this.marker.visible && !this.reduceMotion) {
      this.marker.y = this.markerBaseY - Math.round(1 + 1.5 * Math.sin(time / 160));
    }
    for (const creature of this.creatures)
      creature.container.setDepth(creature.container.y + creature.baseOffset);

    if (this.paused) {
      this.animateRanger(0, 0);
      return;
    }

    const k = this.keys;
    let vx = (k.RIGHT.isDown || k.D.isDown ? 1 : 0) - (k.LEFT.isDown || k.A.isDown ? 1 : 0);
    let vy = (k.DOWN.isDown || k.S.isDown ? 1 : 0) - (k.UP.isDown || k.W.isDown ? 1 : 0);

    if (vx || vy) {
      // Keyboard wins over tap-to-move.
      this.target = null;
      this.path = null;
      this.pendingOpen = null;
    } else if (this.target) {
      const dx = this.target.x - this.player.x;
      const dy = this.target.y - (this.player.y + FEET); // aim with the feet
      const dist = Math.hypot(dx, dy);
      if (dist < 3) {
        this.target = this.path?.shift() ?? null;
      } else {
        vx = dx / dist;
        vy = dy / dist;
        // Give up if a wall has stopped us for a moment.
        const body = this.player.body;
        this.blockedFor = body.blocked.none ? 0 : this.blockedFor + delta;
        if (this.blockedFor > 400) {
          this.target = null;
          this.path = null;
        }
      }
    }

    const len = Math.hypot(vx, vy) || 1;
    this.player.setVelocity((vx / len) * SPEED, (vy / len) * SPEED);
    this.animateRanger(vx, vy);
    this.player.setDepth(this.player.y + FEET);
    this.playerShadow.setPosition(this.player.x, this.player.y + FEET + 1).setDepth(this.player.depth - 1);

    this.updateNearby();
  }

  surfaceUnderFeet() {
    const tile = this.grid[Math.floor((this.player.y + FEET) / TILE)]?.[Math.floor(this.player.x / TILE)];
    if (tile === T.BRIDGE) return 'wood';
    if (tile === T.PATH) return 'path';
    return 'grass';
  }

  animateRanger(vx, vy) {
    const moving = vx !== 0 || vy !== 0;
    if (moving) {
      if (Math.abs(vx) > Math.abs(vy)) this.facing = vx < 0 ? 'left' : 'right';
      else this.facing = vy < 0 ? 'up' : 'down';
    }
    const dir = this.facing === 'left' || this.facing === 'right' ? 'side' : this.facing;
    this.player.setFlipX(this.facing === 'left');
    if (moving) {
      this.player.play(`walk-${dir}`, true);
    } else {
      this.player.anims.stop();
      this.player.setTexture(`ranger-${dir}-idle`);
    }
  }

  updateNearby() {
    const feetX = this.player.x / TILE;
    const feetY = (this.player.y + FEET) / TILE;
    const hit =
      EXHIBITS.find(
        ({ trigger: t }) => feetX >= t.x && feetX < t.x + t.w && feetY >= t.y && feetY < t.y + t.h,
      ) || null;

    if (hit === this.active) return;

    // Creatures at the old exhibit go back to what they were doing; the
    // ones at the new exhibit come over to say hello.
    this.creaturesAt(this.active).forEach((c) => this.calm(c));
    const greeters = this.creaturesAt(hit);
    greeters.forEach((c) => this.react(c));
    if (greeters.length) sfx.call(greeters[0].art.w);

    this.active = hit;
    if (hit) {
      const [sx, sy] = hit.sign;
      const { dx = 0, dy = 0 } = hit.marker ?? {};
      this.markerBaseY = sy * TILE - 8 + dy;
      this.marker.setPosition(sx * TILE + TILE / 2 + dx, this.markerBaseY).setVisible(true);
    } else {
      this.marker.setVisible(false);
    }
    emit('park:near', hit ? { id: hit.id, name: hit.name } : null);
    if (hit && hit.id === this.pendingOpen) this.arrive(hit);
  }
}

// Choktopia map (greybox). Built in code from the zone list below; it moves to
// a Tiled map once the art plan is approved and real tiles exist.
// Coordinates are in 16 px tiles unless noted.
//
// Layout (matches the park map in the PRD):
//   row 1:  Raptor pen        | Ankylosaurus paddock | Parasaurolophus marsh
//   row 2:  Compy run         | Hatchling nursery    | Brachiosaurus field
//   row 3:  Pteranodon aviary | T. rex paddock       | Mosasaurus Lagoon
//           ~~~~~~~~~~~~~~~ Sarcosuchus River (hackathon signs) ~~~~~~~~~~~~~~
//   row 4:  Ranger Station    | Visitor Center       | Fossil Lab
//                                (spawn below)

export const TILE = 16;
export const COLS = 64;
export const ROWS = 61;

export const T = {
  GRASS: 0,
  GRASS_ALT: 1,
  PATH: 2,
  FENCE: 3,
  WALL: 4,
  DOOR: 5,
  WATER: 6,
  TREE: 7,
  SIGN: 8,
  ROOF: 9,
  BRIDGE: 10,
  REEDS: 11,
  PROP: 12, // a solid prop such as the flagpole or bulletin board (drawn as its own sprite)
};

export const SOLID = [T.FENCE, T.WALL, T.DOOR, T.WATER, T.TREE, T.SIGN, T.ROOF, T.REEDS, T.PROP];

const COL_X = { L: 4, C: 24, R: 44 };
const ROW_Y = { 1: 3, 2: 16, 3: 29 };
const ZONE_W = 16;
const ZONE_H = 9;

// Exhibit groups, in the order the map menu lists them.
export const GROUPS = ['Start here', 'Experience', 'Projects', 'Leadership & community', 'Park services'];

// Enclosures. `ref` is the id in content.ts; `zone` matches its `zone` field.
const ZONES = [
  { id: 'raptor', name: 'Raptor pen', kind: 'role', ref: 'nextera-pa', col: 'L', row: 1, ground: 'grass' },
  {
    id: 'ankylo',
    name: 'Ankylosaurus paddock',
    kind: 'role',
    ref: 'nextera-nsa',
    col: 'C',
    row: 1,
    ground: 'grass',
  },
  {
    id: 'parasaur',
    name: 'Parasaurolophus marsh',
    kind: 'role',
    ref: 'sparton',
    col: 'R',
    row: 1,
    ground: 'marsh',
  },
  { id: 'compy', name: 'Compy run', kind: 'role', ref: 'universal-sqe', col: 'L', row: 2, ground: 'grass' },
  {
    id: 'nursery',
    name: 'Hatchling nursery',
    kind: 'involvement',
    ref: 'sfl-tech-hub',
    col: 'C',
    row: 2,
    ground: 'grass',
  },
  {
    id: 'brachio',
    name: 'Brachiosaurus field',
    kind: 'involvement',
    ref: 'amazon-guides',
    col: 'R',
    row: 2,
    ground: 'grass',
  },
  {
    id: 'ptera',
    name: 'Pteranodon aviary',
    kind: 'role',
    ref: 'nextera-sde',
    col: 'L',
    row: 3,
    ground: 'grass',
  },
  {
    id: 'trex',
    name: 'T. rex paddock',
    kind: 'role',
    ref: 'universal-tsa',
    col: 'C',
    row: 3,
    ground: 'grass',
  },
  {
    id: 'lagoon',
    name: 'Mosasaurus Lagoon',
    kind: 'project',
    ref: 'grant-compliance',
    col: 'R',
    row: 3,
    ground: 'water',
  },
];

const GROUP_OF = { role: 'Experience', project: 'Projects', involvement: 'Leadership & community' };

// Rows of the horizontal paths and the river.
const PATH_ROWS = [13, 26, 39, 47, 56]; // each path is 2 tiles tall
const PATH_COLS = [2, 21, 41, 60]; // each path is 2 tiles wide
const RIVER = { y: 42, h: 4 };
export const BUILDING_Y = 49; // roof 49-51, wall 52-54, door on 54, signs on 55

export const BUILDINGS = [
  {
    id: 'ranger-station',
    name: 'Ranger Station',
    kind: 'contact',
    x: 6,
    w: 9,
    roof: 'green',
    style: 'cabin',
  },
  { id: 'visitor-center', name: 'Visitor Center', kind: 'visitor', x: 25, w: 14, roof: 'blue' },
  { id: 'fossil-lab', name: 'Fossil Lab', kind: 'skills', x: 46, w: 12, roof: 'red' },
];

const fill = (grid, x, y, w, h, tile) => {
  for (let r = y; r < y + h; r += 1) {
    for (let c = x; c < x + w; c += 1) {
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) grid[r][c] = tile;
    }
  }
};

const outline = (grid, x, y, w, h, tile) => {
  fill(grid, x, y, w, 1, tile);
  fill(grid, x, y + h - 1, w, 1, tile);
  fill(grid, x, y, 1, h, tile);
  fill(grid, x + w - 1, y, 1, h, tile);
};

// An exhibit's sign, the area that shows the "Read" prompt (the sign plus
// the path tiles in front of it), and where fast travel drops the player.
const exhibitAt = (base, sx, sy) => ({
  ...base,
  sign: [sx, sy],
  trigger: { x: sx - 2, y: sy, w: 5, h: 3 },
  // Feet on the far row of the path, so the ranger stands below the sign, not on it.
  stand: { x: sx * TILE + TILE / 2, y: (sy + 2.5) * TILE - 8 },
});

export const EXHIBITS = [
  ...ZONES.map((z) => exhibitAt({ ...z, group: GROUP_OF[z.kind] }, COL_X[z.col] + 7, ROW_Y[z.row] + ZONE_H)),
  // Hackathons: each has its own stretch of river (between bridges) and its own
  // creature, with a sign on the south bank.
  exhibitAt(
    {
      id: 'river-nextsteps',
      name: 'Spinosaurus Shallows: NEXTSteps',
      kind: 'project',
      ref: 'nextsteps',
      group: 'Projects',
    },
    12,
    46,
  ),
  exhibitAt(
    {
      id: 'river-mycobiome',
      name: 'Sarcosuchus Creek: Mycobiome',
      kind: 'project',
      ref: 'mycobiome',
      group: 'Projects',
    },
    26,
    46,
  ),
  exhibitAt(
    {
      id: 'river-waste',
      name: 'Megalodon Bay: Waste Routing',
      kind: 'project',
      ref: 'waste-routing',
      group: 'Projects',
    },
    51,
    46,
  ),
  // Buildings along the south road; each sign stands beside its door.
  ...BUILDINGS.map((b) =>
    exhibitAt(
      { id: b.id, name: b.name, kind: b.kind, group: b.kind === 'visitor' ? 'Start here' : 'Park services' },
      b.x + Math.floor(b.w / 2) + 2,
      55,
    ),
  ),
  exhibitAt(
    {
      id: 'news',
      name: 'Bulletin board: In the news',
      kind: 'press',
      ref: 'sea-turtle-rescue',
      group: 'Start here',
      // A two-tile bulletin board centered on the line between tiles 27 and 28.
      prop: 'board',
      marker: { dx: -8, dy: -16 },
    },
    28,
    55,
  ),
  exhibitAt(
    {
      id: 'navy',
      name: 'Flagpole: U.S. Navy Reserve',
      kind: 'involvement',
      ref: 'navy-nrotc',
      group: 'Leadership & community',
      prop: 'flag', // on the grass corner right of the jeep, where the side path meets the road
      marker: { dx: 0, dy: -38 },
    },
    20,
    55,
  ),
];

// Decorations that are not exhibits. The park jeep is parked on a gravel
// driveway beside the Ranger Station; its tiles are solid.
export const DECOR = [
  {
    kind: 'jeep',
    x: 17.5 * TILE, // bottom-center of the sprite, in px
    y: 55 * TILE,
    tiles: [
      [16, 53],
      [17, 53],
      [18, 53],
      [16, 54],
      [17, 54],
      [18, 54],
    ],
  },
];

export const buildGrid = () => {
  const grid = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => ((c * 7 + r * 13) % 11 === 0 ? T.GRASS_ALT : T.GRASS)),
  );

  // Paths.
  for (const y of PATH_ROWS) fill(grid, 2, y, COLS - 4, 2, T.PATH);
  for (const x of PATH_COLS) fill(grid, x, PATH_ROWS[0], 2, PATH_ROWS.at(-1) - PATH_ROWS[0] + 2, T.PATH);
  fill(grid, 31, 39, 2, 9, T.PATH); // Visitor Center straight to the T. rex

  // River with bridges where paths cross it.
  fill(grid, 1, RIVER.y, COLS - 2, RIVER.h, T.WATER);
  for (const x of [...PATH_COLS, 31]) fill(grid, x, RIVER.y, 2, RIVER.h, T.BRIDGE);

  // Enclosures.
  for (const z of ZONES) {
    const x = COL_X[z.col];
    const y = ROW_Y[z.row];
    if (z.ground === 'water') fill(grid, x + 1, y + 1, ZONE_W - 2, ZONE_H - 2, T.WATER);
    if (z.ground === 'marsh') {
      fill(grid, x + 1, y + 4, ZONE_W - 2, ZONE_H - 5, T.WATER);
      for (let c = x + 2; c < x + ZONE_W - 2; c += 3) grid[y + 4][c] = T.REEDS;
    }
    outline(grid, x, y, ZONE_W, ZONE_H, T.FENCE);
  }

  // Buildings.
  for (const b of BUILDINGS) {
    fill(grid, b.x, BUILDING_Y, b.w, 3, T.ROOF);
    fill(grid, b.x, BUILDING_Y + 3, b.w, 3, T.WALL);
    const door = b.x + Math.floor(b.w / 2) - 1;
    fill(grid, door, BUILDING_Y + 5, 2, 1, T.DOOR);
  }

  // Gravel driveway for the jeep, off the south road.
  fill(grid, 15, 53, 5, 3, T.PATH);
  for (const d of DECOR) for (const [c, r] of d.tiles) grid[r][c] = T.PROP;

  // Signs and props.
  for (const e of EXHIBITS) {
    const [sx, sy] = e.sign;
    if (e.prop === 'board') fill(grid, sx - 1, sy, 2, 1, T.PROP);
    else grid[sy][sx] = e.prop ? T.PROP : T.SIGN;
  }

  // Trees: the border plus a few clumps in the open grass.
  outline(grid, 0, 0, COLS, ROWS, T.TREE);
  const clumps = [
    [5, 1],
    [15, 2],
    [30, 1],
    [48, 2],
    [58, 1],
    [20, 15],
    [23, 15],
    [40, 28],
    [43, 28],
    [10, 28],
    [52, 15],
    [1, 30],
    [62, 20],
    [5, 59],
    [12, 58],
    [24, 59],
    [40, 58],
    [52, 59],
    [58, 58],
  ];
  for (const [c, r] of clumps) if (grid[r][c] === T.GRASS || grid[r][c] === T.GRASS_ALT) grid[r][c] = T.TREE;

  return grid;
};

// Creatures and where they roam (`area`, in px). Sizes match the sprites in
// art/creatures.js; `label` and `color` are only used by the old greybox look.
const zoneArea = (col, row, pad = 1) => ({
  x: (COL_X[col] + pad) * TILE,
  y: (ROW_Y[row] + pad) * TILE,
  w: (ZONE_W - 2 * pad) * TILE,
  h: (ZONE_H - 2 * pad) * TILE,
});

export const CREATURES = [
  {
    key: 'raptor',
    exhibits: ['raptor'], // reacts when you are at these signs
    label: 'RAPTOR',
    w: 24,
    h: 16,
    color: '#8fb8ee',
    count: 2,
    motion: 'pace',
    area: zoneArea('L', 1),
  },
  {
    key: 'ankylo',
    exhibits: ['ankylo'], // reacts when you are at these signs
    label: 'ANKYLO',
    w: 40,
    h: 20,
    color: '#4f8a6e',
    count: 1,
    motion: 'pace',
    area: zoneArea('C', 1),
  },
  {
    key: 'parasaur',
    exhibits: ['parasaur'], // reacts when you are at these signs
    label: 'PARASAUR',
    w: 36,
    h: 28,
    color: '#a8553a',
    count: 1,
    motion: 'pace',
    area: { ...zoneArea('R', 1), h: 3 * TILE },
  },
  {
    key: 'compy',
    exhibits: ['compy'], // reacts when you are at these signs
    label: '',
    w: 12,
    h: 8,
    color: '#e4ded0',
    count: 4,
    motion: 'dart',
    area: zoneArea('L', 2),
  },
  {
    key: 'hatchling',
    exhibits: ['nursery'], // reacts when you are at these signs
    label: '',
    w: 12,
    h: 12,
    color: '#f8cf63',
    count: 3,
    motion: 'hop',
    area: zoneArea('C', 2, 2),
  },
  {
    key: 'brachio',
    exhibits: ['brachio'], // reacts when you are at these signs
    label: 'BRACHIO',
    w: 48,
    h: 56,
    color: '#c7dcf5',
    count: 1,
    motion: 'pace',
    area: zoneArea('R', 2),
  },
  {
    key: 'ptera',
    exhibits: ['ptera'], // reacts when you are at these signs
    label: 'PTERA',
    w: 32,
    h: 16,
    color: '#7a4f6b',
    count: 2,
    motion: 'fly',
    area: zoneArea('L', 3),
  },
  {
    key: 'trex',
    exhibits: ['trex'], // reacts when you are at these signs
    label: 'T. REX',
    w: 48,
    h: 40,
    color: '#8fb8ee',
    count: 1,
    motion: 'pace',
    area: zoneArea('C', 3),
  },
  {
    key: 'mosa',
    exhibits: ['lagoon'], // reacts when you are at these signs
    label: 'MOSASAUR',
    w: 64,
    h: 20,
    color: '#1f5fa8',
    count: 1,
    motion: 'drift',
    area: zoneArea('R', 3, 2),
  },
  {
    key: 'sarco',
    exhibits: ['river-mycobiome'], // reacts when you are at these signs
    label: 'SARCO',
    w: 48,
    h: 12,
    color: '#4f8a6e',
    count: 1,
    motion: 'drift',
    area: { x: 23 * TILE, y: (RIVER.y + 1) * TILE, w: 8 * TILE, h: 2 * TILE },
  },
  {
    key: 'spino',
    exhibits: ['river-nextsteps'],
    w: 48,
    h: 32,
    count: 1,
    motion: 'pace',
    area: { x: 5 * TILE, y: RIVER.y * TILE, w: 15 * TILE, h: 3 * TILE },
  },
  {
    key: 'megalodon',
    exhibits: ['river-waste'],
    w: 56,
    h: 20,
    count: 1,
    motion: 'drift',
    area: { x: 44 * TILE, y: (RIVER.y + 1) * TILE, w: 15 * TILE, h: 2 * TILE },
  },
];

// Spawn on the south road, just below the Visitor Center door.
export const SPAWN = { x: 32 * TILE, y: 56 * TILE };

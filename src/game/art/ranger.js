import { PixelSprite } from './pixel';

// The player character, 16 x 20, hand-drawn pixel maps (original character,
// drawn to look like Chok: black hair with a quiff, warm brown skin, white
// shirt under an open blue jacket, jeans). Facing down, up and right; left is
// right mirrored. Each direction has an idle frame and walk frames that only
// swap the leg rows.

const LEGEND = {
  o: '#2b2236', // outline
  r: '#1c1a22', // black hair
  R: '#3d3a4a', // hair shine
  s: '#c68a5e', // skin
  S: '#a26b45', // skin shadow
  e: '#2b2236', // eyes
  w: '#f4f4f6', // white shirt
  W: '#d4d6de', // shirt shadow
  j: '#2f63b5', // blue jacket
  J: '#244c8c', // jacket shadow
  d: '#4f7fc0', // jeans
  D: '#3a6299', // jeans shadow
  k: '#3a3442', // shoes
};

const JEANS = ['...oddddddddo...', '...odddDDdddo...'];

const DOWN_BODY = [
  '.....ooooo......',
  '....orrRRroo....',
  '...orrRRrrrrro..',
  '..orrrrrrrrrro..',
  '..orssssssssro..',
  '..orsessssesro..',
  '..o' + 's'.repeat(10) + 'o..',
  '...osssSSssso...',
  '....ooSSSSoo....',
  '...ojjwwwwjjo...',
  '..ojjjwwwwjjjo..',
  '.ojjjjwwwwjjjjo.',
  '.osJjjwWWwjjJso.',
  '..ojjjwwwwjjjo..',
  ...JEANS,
];

const UP_BODY = [
  '.....ooooo......',
  '....orrRRroo....',
  '...orrRRrrrrro..',
  '..orrrrrrrrrro..',
  '..orrrrrrrrrro..',
  '..orrrrrrrrrro..',
  '..osrrrrrrrrso..',
  '...orrrrrrrro...',
  '....ooSSSSoo....',
  '...ojjjjjjjjo...',
  '..ojjjjjjjjjjo..',
  '.ojjjjjjjjjjjjo.',
  '.osJjjjjjjjjJso.',
  '..ojjjjjjjjjjo..',
  ...JEANS,
];

const FRONT_LEGS = {
  idle: ['...odddo.odddo..', '...odddo.odddo..', '...okkko.okkko..', '...ooooo.ooooo..'],
  a: ['...odddo.odddo..', '...odddo.okkko..', '...okkko.ooooo..', '...ooooo........'],
  b: ['...odddo.odddo..', '...okkko.odddo..', '...ooooo.okkko..', '.........ooooo..'],
};

const SIDE_BODY = [
  '.......oooo.....',
  '.....oorRRro....',
  '...oorrrRRrro...',
  '..orrrrrrrrrro..',
  '...orrrssssso...',
  '...orrssssesoo..',
  '...orsssssssso..',
  '....osssSSsso...',
  '.....ooSSSoo....',
  '....ojjjwwjo....',
  '....ojjjjwwo....',
  '....ojjsjwwo....',
  '....oJjsjwWo....',
  '....oojjjjoo....',
  '.....odddddo....',
  '.....oddDddo....',
];

const SIDE_LEGS = {
  idle: ['.....odddddo....', '.....odddddo....', '.....okkkkko....', '.....ooooooo....'],
  // Mid-stride: two straight legs, front and back, same width as the hips.
  a: ['.....odddddo....', '....oddo.oddo...', '....okko.okko...', '....oooo.oooo...'],
};

const build = (body, legs) =>
  new PixelSprite(16, 20).map([...body, ...legs], LEGEND).finish({ outline: null, shade: false });

// Frames keyed like "down-idle", "down-a", "side-a" ...
export const RANGER_FRAMES = {
  'down-idle': build(DOWN_BODY, FRONT_LEGS.idle),
  'down-a': build(DOWN_BODY, FRONT_LEGS.a),
  'down-b': build(DOWN_BODY, FRONT_LEGS.b),
  'up-idle': build(UP_BODY, FRONT_LEGS.idle),
  'up-a': build(UP_BODY, FRONT_LEGS.a),
  'up-b': build(UP_BODY, FRONT_LEGS.b),
  'side-idle': build(SIDE_BODY, SIDE_LEGS.idle),
  'side-a': build(SIDE_BODY, SIDE_LEGS.a),
};

export const RANGER_SIZE = { w: 16, h: 20 };

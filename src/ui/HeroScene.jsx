import { useEffect, useRef } from 'react';

// Pixel-art night landscape at the foot of the hero: a preview of Choktopia.
// Drawn on a 480 x 48 grid; every shape is a whole number of "pixels".
// The foreground is filled with the page background, so the hero melts into
// the next section.
//
// Motion:
// - The landscape scrolls right in three parallax layers while the
//   brachiosaurus trots in place facing left, so it reads as walking left.
// - Each scrolling layer is drawn three times, 480 units apart, so the loop
//   is seamless.
// - The head and tail move on their own slow cycles; the moon bobs.
//
// The motion runs from requestAnimationFrame and writes SVG transform
// attributes directly. CSS animations would push the SVG onto its own GPU
// layer, which anti-aliases the horizon into a visible light-blue line.
// It pauses while off-screen and stays still for reduced-motion visitors.

const TILE = 480;
const GROUND_Y = 40;

const FAR = [
  [40, 7, 72],
  [125, 9, 96],
  [215, 6, 64],
  [300, 10, 104],
  [390, 7, 80],
  [462, 8, 80],
];

const NEAR = [
  [10, 4, 80],
  [95, 5, 96],
  [175, 3, 72],
  [262, 4, 110],
  [350, 5, 90],
  [440, 4, 96],
];

// Stepped mountain: each tier is 3px tall and 8px narrower than the one below.
// Tiers overlap down to the base so scaling never opens hairline gaps.
const mountain = ([cx, steps, baseW], base, fill, key) =>
  Array.from({ length: steps }, (_, i) => {
    const w = baseW - i * 8;
    const h = (i + 1) * 3;
    return <rect key={`${key}-${i}`} x={cx - w / 2} y={base - h} width={w} height={h} fill={fill} />;
  });

// Original pixel brachiosaurus, facing left, 47 x 34 px, split into parts so
// the head, neck, tail and legs can move independently.
const HEAD = [
  [0, 1, 2, 3],
  [2, 0, 8, 4],
];
const NECK_TOP = [[5, 3, 6, 5]];
const BODY = [
  [7, 7, 6, 5],
  [9, 11, 7, 5],
  [11, 14, 8, 4],
  [15, 15, 16, 1],
  [12, 16, 22, 10],
  [34, 18, 5, 5],
];
const TAIL_MID = [[38, 20, 4, 3]];
const TAIL_TIP = [
  [41, 22, 4, 2],
  [44, 23, 3, 1],
];
// Two-frame trot: in each frame one diagonal pair of legs is lifted 1px.
const LEGS_A = [
  [13, 26, 4, 8],
  [19, 26, 3, 7],
  [26, 26, 4, 7],
  [31, 26, 3, 8],
];
const LEGS_B = [
  [14, 26, 4, 7],
  [18, 26, 3, 8],
  [25, 26, 4, 8],
  [32, 26, 3, 7],
];

const PALM = [
  [0, 0, 2, 14],
  [-6, -2, 6, 2],
  [2, -2, 6, 2],
  [-8, 0, 3, 2],
  [7, 0, 3, 2],
  [-2, -4, 6, 2],
];
const PALMS = [58, 168, 334, 420];

// Small bumps on the horizon so the ground visibly slides past.
const ROCK = [
  [1, 0, 3, 1],
  [0, 1, 5, 1],
];
const TUFT = [
  [0, 0, 1, 2],
  [2, -1, 1, 3],
  [4, 0, 1, 2],
];
const ROCKS = [22, 112, 246, 302, 384, 458];
const TUFTS = [80, 198, 276, 360];

const MOON = [
  [2, 0, 6, 1],
  [1, 1, 8, 1],
  [0, 2, 10, 4],
  [1, 6, 8, 1],
  [2, 7, 6, 1],
];

// ---- Timing (ms) ----
const SCROLL_MS = { far: 200000, near: 100000, front: 46000 };
const MOON_MS = 12000; // one full up-and-down
const MOON_RISE = 3; // px
const STEP_MS = 400; // leg frame (slower trot)
const HEAD_MS = 14000;
const TAIL_MS = 9000;
const TAIL_OFFSET_MS = 2000;

// Stepped keyframes: [percent, offsetY]; each value holds until the next.
const HEAD_KEYS = [
  [0, 0],
  [60, -1],
  [62, -2],
  [76, -1],
  [78, 0],
  [88, 1],
  [90, 2],
  [97, 1],
  [99, 0],
];
// The top of the neck follows the head by half so it stays attached.
const NECK_KEYS = [
  [0, 0],
  [62, -1],
  [76, 0],
  [90, 1],
  [97, 0],
];
const TAIL_TIP_KEYS = [
  [0, 0],
  [52, -1],
  [54, -2],
  [60, -1],
  [62, 0],
  [64, 1],
  [70, 0],
];
const TAIL_MID_KEYS = [
  [0, 0],
  [54, -1],
  [60, 0],
];

const stepValue = (keys, t, period) => {
  const pct = ((t % period) / period) * 100;
  let value = keys[0][1];
  for (const [at, v] of keys) {
    if (pct >= at) value = v;
  }
  return value;
};

// Scroll offset in -240..240: shifts exactly one tile per loop, so the three
// copies always cover the view.
const scrollX = (t, period) => ((t % period) / period) * TILE - TILE / 2;

const sprite = (cells, ox, oy, fill, key) =>
  cells.map(([x, y, w, h], i) => (
    <rect key={`${key}-${i}`} x={ox + x} y={oy + y} width={w} height={h} fill={fill} />
  ));

// Draws a layer at -480, 0 and +480 so it can scroll without a visible seam.
const tiled = (render) =>
  [-TILE, 0, TILE].map((offset) => (
    <g key={offset} transform={`translate(${offset} 0)`}>
      {render(offset)}
    </g>
  ));

const DINO_X = 238;
const DINO_Y = GROUND_Y - 34;
const START = `translate(${-TILE / 2} 0)`;

const HeroScene = () => {
  const svgRef = useRef(null);
  const farRef = useRef(null);
  const nearRef = useRef(null);
  const frontRef = useRef(null);
  const moonRef = useRef(null);
  const headRef = useRef(null);
  const neckRef = useRef(null);
  const tailMidRef = useRef(null);
  const tailTipRef = useRef(null);
  const legsARef = useRef(null);
  const legsBRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const set = (ref, value) => ref.current?.setAttribute('transform', value);
    let raf = 0;
    let visible = true;
    const t0 = performance.now();

    const frame = (now) => {
      const t = now - t0;
      set(farRef, `translate(${scrollX(t, SCROLL_MS.far)} 0)`);
      set(nearRef, `translate(${scrollX(t, SCROLL_MS.near)} 0)`);
      set(frontRef, `translate(${scrollX(t, SCROLL_MS.front)} 0)`);

      const bob = -MOON_RISE * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / MOON_MS));
      set(moonRef, `translate(0 ${bob})`);

      const stepB = Math.floor(t / STEP_MS) % 2 === 1;
      legsARef.current?.setAttribute('opacity', stepB ? '0' : '1');
      legsBRef.current?.setAttribute('opacity', stepB ? '1' : '0');

      set(headRef, `translate(0 ${stepValue(HEAD_KEYS, t, HEAD_MS)})`);
      set(neckRef, `translate(0 ${stepValue(NECK_KEYS, t, HEAD_MS)})`);
      set(tailMidRef, `translate(0 ${stepValue(TAIL_MID_KEYS, t + TAIL_OFFSET_MS, TAIL_MS)})`);
      set(tailTipRef, `translate(0 ${stepValue(TAIL_TIP_KEYS, t + TAIL_OFFSET_MS, TAIL_MS)})`);

      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    // Only animate while the scene is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    if (svgRef.current) observer.observe(svgRef.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="hero-scene"
      viewBox="0 0 480 48"
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <g ref={moonRef}>{sprite(MOON, 425, 7, 'var(--cta)', 'moon')}</g>

      <g ref={farRef} transform={START}>
        {tiled((o) => FAR.map((m, i) => mountain(m, 44, 'var(--scene-far)', `far${o}-${i}`)))}
      </g>
      <g ref={nearRef} transform={START}>
        {tiled((o) => NEAR.map((m, i) => mountain(m, 46, 'var(--scene-near)', `near${o}-${i}`)))}
      </g>

      {/* Flat ground; runs past the frame (to y 56) so no sliver of sky shows below it. */}
      <rect x={-40} y={GROUND_Y} width={TILE + 80} height={16} fill="var(--bg)" />

      <g ref={frontRef} transform={START}>
        {tiled((o) => [
          ...PALMS.map((x) => sprite(PALM, x, GROUND_Y - 14, 'var(--bg)', `palm${o}-${x}`)),
          ...ROCKS.map((x) => sprite(ROCK, x, GROUND_Y - 2, 'var(--bg)', `rock${o}-${x}`)),
          ...TUFTS.map((x) => sprite(TUFT, x, GROUND_Y - 2, 'var(--bg)', `tuft${o}-${x}`)),
        ])}
      </g>

      <g transform={`translate(${DINO_X} ${DINO_Y})`}>
        <g ref={headRef}>{sprite(HEAD, 0, 0, 'var(--bg)', 'head')}</g>
        <g ref={neckRef}>{sprite(NECK_TOP, 0, 0, 'var(--bg)', 'neck')}</g>
        {sprite(BODY, 0, 0, 'var(--bg)', 'body')}
        <g ref={tailMidRef}>{sprite(TAIL_MID, 0, 0, 'var(--bg)', 'tailmid')}</g>
        <g ref={tailTipRef}>{sprite(TAIL_TIP, 0, 0, 'var(--bg)', 'tailtip')}</g>
        <g ref={legsARef}>{sprite(LEGS_A, 0, 0, 'var(--bg)', 'legsa')}</g>
        <g ref={legsBRef} opacity="0">
          {sprite(LEGS_B, 0, 0, 'var(--bg)', 'legsb')}
        </g>
      </g>
    </svg>
  );
};

export default HeroScene;

// Tiny synthesized sound effects for the park (Web Audio, no audio files).
// Off by default; the visitor turns it on with the Sound button, and the
// choice is remembered on this device. Shared by React and the Phaser scene.

const KEY = 'choktopia-sound';
let ctx = null;
let enabled = false;

try {
  enabled = window.localStorage.getItem(KEY) === 'on';
} catch {
  enabled = false;
}

const audio = () => {
  if (!ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

export const isSoundOn = () => enabled;

export const setSound = (on) => {
  enabled = on;
  try {
    window.localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // Storage blocked: the choice just won't be remembered.
  }
  if (on) audio(); // must start from a click, which this always is
};

// One enveloped oscillator note.
const tone = ({ type = 'sine', from, to = from, start = 0, length = 0.12, volume = 0.12, filter }) => {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t0 + length);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
  let node = osc;
  if (filter) {
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = filter;
    osc.connect(lp);
    node = lp;
  }
  node.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + length + 0.05);
};

// Short burst of white noise, reused for footsteps.
let noise = null;
const noiseBuffer = (ac) => {
  if (!noise) {
    noise = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.15), ac.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  return noise;
};

// Filtered noise shaped into one footstep. Small random pitch changes keep a
// walk from sounding like a machine.
const scuff = ({ freq, volume, length = 0.07 }) => {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime;
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac);
  const band = ac.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = freq * (0.85 + Math.random() * 0.3);
  band.Q.value = 1.1;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
  src.connect(band).connect(gain).connect(ac.destination);
  src.start(t0);
  src.stop(t0 + length + 0.02);
};

export const sfx = {
  // One footstep; the sound depends on what you are walking on.
  step(surface = 'grass') {
    if (!enabled) return;
    if (surface === 'wood') {
      tone({ from: 190 + Math.random() * 30, to: 120, length: 0.08, volume: 0.07 }); // hollow knock
      scuff({ freq: 2400, volume: 0.015, length: 0.04 });
    } else if (surface === 'path') {
      scuff({ freq: 1900, volume: 0.06, length: 0.07 }); // crunchy sand
    } else {
      scuff({ freq: 800, volume: 0.04, length: 0.09 }); // soft grass
    }
  },
  // Panel or map opens.
  pop() {
    if (enabled) tone({ from: 520, to: 880, length: 0.09, volume: 0.08 });
  },
  // A new stamp for the park guide.
  chime() {
    if (!enabled) return;
    tone({ type: 'triangle', from: 784, length: 0.14, volume: 0.09 });
    tone({ type: 'triangle', from: 1047, start: 0.11, length: 0.22, volume: 0.09 });
  },
  // Every stamp collected.
  fanfare() {
    if (!enabled) return;
    [523, 659, 784, 1047].forEach((f, i) =>
      tone({ type: 'triangle', from: f, start: i * 0.12, length: 0.25, volume: 0.09 }),
    );
  },
  // A dinosaur noticing you: bigger creatures call lower and longer.
  call(size = 24) {
    if (!enabled) return;
    const big = Math.min(1, size / 64);
    const base = 520 - big * 420;
    tone({
      type: 'sawtooth',
      from: base * 1.3,
      to: base * 0.7,
      length: 0.25 + big * 0.35,
      volume: 0.07,
      filter: 900 - big * 500,
    });
  },
};

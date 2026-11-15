import { useEffect, useRef } from 'react';

// Shooting-star cursor for the hero. While the mouse is over the hero the
// system cursor is hidden and a pixel star with a sparkling trail follows it;
// clicking sets off a burst of pixel sparks. Outside the hero the normal
// cursor is back. Skipped on touch devices and for reduced-motion users.

const YELLOW = '#f5c242';
const BONE = '#f8f6f0';
const BLUE = '#8fb8ee';
const SPARK_COLORS = [YELLOW, BONE, BLUE];

const CELL = 3; // size of one "pixel" of the star, in CSS px
// A plus-shaped pixel star; the outer tips drop out on alternate beats to twinkle.
const STAR = [
  [0, -2],
  [0, -1],
  [-2, 0],
  [-1, 0],
  [0, 0],
  [1, 0],
  [2, 0],
  [0, 1],
  [0, 2],
];

const HeroCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return undefined;

    const supported = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    if (!supported.matches) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    hero.classList.add('star-cursor');

    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(hero);

    const head = { x: 0, y: 0, visible: false, big: false };
    let last = null;
    const particles = [];
    let raf = 0;
    let lastTime = 0;

    // Sparks left behind along the path between the last and current position.
    const spawnTrail = (x, y, dx, dy) => {
      const steps = Math.min(Math.ceil(Math.hypot(dx, dy) / 8), 4);
      for (let i = 0; i < steps; i += 1) {
        const t = i / steps;
        particles.push({
          x: x - dx * t + (Math.random() - 0.5) * 3,
          y: y - dy * t + (Math.random() - 0.5) * 3,
          vx: -dx * 0.02 + (Math.random() - 0.5) * 0.3,
          vy: -dy * 0.02 + (Math.random() - 0.5) * 0.3,
          life: 1,
          decay: 0.14 + Math.random() * 0.04, // higher = shorter trail
          size: 3 + Math.random() * 2,
          color: Math.random() < 0.7 ? YELLOW : BLUE,
          gravity: 0,
        });
      }
    };

    const explode = (x, y) => {
      for (let i = 0; i < 44; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012 + Math.random() * 0.012,
          size: 3 + Math.round(Math.random() * 3),
          color: SPARK_COLORS[i % SPARK_COLORS.length],
          gravity: 0.06,
        });
      }
    };

    const drawStar = (x, y, scale, twinkle) => {
      const c = CELL * scale;
      const s = Math.ceil(c);
      ctx.fillStyle = YELLOW;
      for (const [cx, cy] of STAR) {
        if (twinkle && (Math.abs(cx) === 2 || Math.abs(cy) === 2)) continue;
        ctx.fillRect(Math.round(x + cx * c - c / 2), Math.round(y + cy * c - c / 2), s, s);
      }
      ctx.fillStyle = BONE;
      ctx.fillRect(Math.round(x - c / 2), Math.round(y - c / 2), s, s);
    };

    const frame = (now) => {
      // Normalize motion to 60fps so high-refresh screens look the same.
      const dt = lastTime ? Math.min((now - lastTime) / 16.67, 3) : 1;
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.vy += p.gravity * dt;
        p.vx *= 0.97 ** dt;
        p.vy *= 0.97 ** dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const size = Math.max(1, Math.round(p.size * p.life));
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x - size / 2), Math.round(p.y - size / 2), size, size);
      }
      ctx.globalAlpha = 1;

      if (head.visible) drawStar(head.x, head.y, head.big ? 1.4 : 1, Math.floor(now / 250) % 2 === 0);

      // Only keep animating while there is something to draw.
      if (head.visible || particles.length > 0) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        lastTime = 0;
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const toLocal = (event) => {
      const rect = hero.getBoundingClientRect();
      return [event.clientX - rect.left, event.clientY - rect.top];
    };

    const onMove = (event) => {
      if (event.pointerType !== 'mouse') return;
      const [x, y] = toLocal(event);
      if (last && head.visible) spawnTrail(x, y, x - last[0], y - last[1]);
      head.x = x;
      head.y = y;
      head.visible = true;
      head.big = Boolean(event.target.closest?.('a, button, summary'));
      last = [x, y];
      kick();
    };

    const onLeave = () => {
      head.visible = false;
      last = null;
      kick();
    };

    const onDown = (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      const [x, y] = toLocal(event);
      explode(x, y);
      kick();
    };

    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    hero.addEventListener('pointerdown', onDown);

    return () => {
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      hero.removeEventListener('pointerdown', onDown);
      observer.disconnect();
      cancelAnimationFrame(raf);
      hero.classList.remove('star-cursor');
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-cursor" aria-hidden="true" />;
};

export default HeroCursor;

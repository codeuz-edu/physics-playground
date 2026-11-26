import { num } from '../../core/format.js';
import { drawArrow, drawGround, drawSky, ink, label, reserve } from '../../ui/canvas.js';
import { advance, gParam, hint, pulley, rope, support, weight } from '../kit.js';

const CEIL = 2.75; // m, ceiling the pulley hangs from (high enough that the light load stops below the wheel)

const params = [
  { key: 'm1', symbol: 'm₁', unit: 'kg', min: 0.1, max: 5, step: 0.05, default: 1, kind: 'initial', decimals: 2, color: '--pos' },
  { key: 'm2', symbol: 'm₂', unit: 'kg', min: 0.1, max: 5, step: 0.05, default: 1.5, kind: 'initial', decimals: 2, color: '--acc' },
  { key: 'h', symbol: 'h', unit: 'm', min: 0.2, max: 1.6, step: 0.1, default: 1, kind: 'initial', decimals: 1 },
  gParam,
];

/** Atwood machine: two loads on one rope over a light, frictionless pulley. */
class AtwoodModel {
  t = 0; s = 0; v = 0; a = 0; T = 0; run = 0; reason = ''; dir = 1;
  reset(p) {
    this.t = 0; this.s = 0; this.v = 0; this.reason = '';
    this.dir = p.m2 >= p.m1 ? 1 : -1; // +1: the right load goes down
    this.a = (Math.abs(p.m2 - p.m1) * p.g) / (p.m1 + p.m2);
    this.T = (2 * p.m1 * p.m2 * p.g) / (p.m1 + p.m2);
    this.run = p.h;
  }
  step(dt) {
    if (this.reason) return false;
    if (this.a < 1e-9) {
      this.t += dt;
      if (this.t >= 2 - 1e-9) { this.reason = 'balance'; return false; }
      return true;
    }
    const r = advance(this.s, this.v, this.a, dt, this.run);
    this.s = r.s; this.v = r.v; this.t += r.tau;
    if (r.hit) { this.reason = 'floor'; return false; }
    return true;
  }
  isValid() { return [this.t, this.s, this.v, this.a, this.T].every(Number.isFinite); }
  sample() { return { s: this.s, v: this.v, a: this.a, T: this.T }; }
  clone() { return Object.assign(new AtwoodModel(), this); }
  finishMessage(text) {
    if (this.reason === 'floor') return text.msg.floor(num(this.t, 2), num(this.v, 2), num(this.a, 3), num(this.T, 2));
    if (this.reason === 'balance') return text.msg.balance(num(this.T, 2));
    return '';
  }
}

const side = (m) => Math.min(0.42, Math.max(0.16, 0.24 * Math.cbrt(m)));

export default {
  id: 'atwood',
  params,
  stageSize: 'tall',
  viewPadding: { left: 24, right: 24, top: 40, bottom: 28 },
  presets: [
    { values: { m1: 1, m2: 1.5, h: 1, g: 9.81 } },
    { values: { m1: 0.95, m2: 1.05, h: 1.6, g: 9.81 } },
    { values: { m1: 2, m2: 2, h: 1, g: 9.81 } },
    { values: { m1: 1, m2: 3, h: 1, g: 1.62 } },
  ],
  toggles: [
    { key: 'forces', default: true },
    { key: 'ruler', default: true },
  ],
  readouts: [
    { key: 'a', unit: 'm/s²', decimals: 3, color: '--acc' },
    { key: 'T', unit: 'N', decimals: 2, color: '--force' },
    { key: 'v', unit: 'm/s', decimals: 2, color: '--vel' },
  ],
  graphs: [
    { id: 'v', yLabel: 'υ', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
    { id: 's', yLabel: 's', unit: 'm', series: [{ key: 's', color: '--pos' }] },
  ],
  createModel: () => new AtwoodModel(),
  // Room under the floor for the weight of a load that has come down (its arrow reaches into the floor).
  worldBounds: () => ({ xMin: -1.3, xMax: 1.3, yMin: -0.4, yMax: CEIL + 0.15 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, gy = Y(0);
    drawSky(ctx, view, c, gy);
    drawGround(ctx, view, c, gy);
    support(ctx, X(-0.4), X(0.4), Y(CEIL), c, 'up');
    // A load is never narrower than its mass written on it (in the font of kit.js box()).
    ctx.save(); ctx.font = '600 13px Barlow, sans-serif';
    const fit = (mass) => Math.max(side(mass) * S, ctx.measureText(`${num(mass, 2)} kg`).width + 10);
    const w1 = fit(p.m1), h1 = Math.max(32, side(p.m1) * S), w2 = fit(p.m2), h2 = Math.max(32, side(p.m2) * S);
    ctx.restore();
    // The wheel is at least as wide as the loads, so two big loads pass each other without overlapping.
    const r = Math.max(10, Math.max(0.18, Math.max(side(p.m1), side(p.m2)) / 2 + 0.02) * S, Math.max(w1, w2) / 2 + 4), cx = X(0), cy = Y(CEIL - 0.3);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.moveTo(cx, Y(CEIL)); ctx.lineTo(cx, cy); ctx.stroke(); ctx.restore();
    // Heights of the load bottoms: the heavier load starts at h, the other one at the floor + 0.1 m.
    const heavyRight = m.dir > 0;
    const yHeavy = p.h - m.s, yLight = 0.1 + m.s;
    const y1 = heavyRight ? yLight : yHeavy, y2 = heavyRight ? yHeavy : yLight;
    const top1 = Y(y1) - h1 - 6, top2 = Y(y2) - h2 - 6;
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.stroke(); ctx.restore();
    rope(ctx, [[cx - r, cy], [cx - r, top1]], c);
    rope(ctx, [[cx + r, cy], [cx + r, top2]], c);
    pulley(ctx, cx, cy, r, c, (m.s * S * m.dir) / r);
    reserve(ctx, cx - r - 2, cy - r - 2, 2 * r + 4, 2 * r + 4); // the names of the arrows keep off the wheel
    weight(ctx, cx - r, top1, w1, h1, c, `${num(p.m1, 2)} kg`);
    weight(ctx, cx + r, top2, w2, h2, c, `${num(p.m2, 2)} kg`);
    if (toggles.ruler) {
      const rx = X(0.85);
      ctx.save(); ctx.strokeStyle = c.axis || c.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(rx, gy); ctx.lineTo(rx, Y(1.8));
      for (let y = 0; y <= 1.8 + 1e-9; y += 0.1) { const yy = Math.round(Y(y)) + 0.5, big = Math.abs(y * 10 % 5) < 1e-6; ctx.moveTo(rx, yy); ctx.lineTo(rx + (big ? 9 : 5), yy); }
      ctx.stroke(); ctx.restore();
      for (let y = 0.5; y <= 1.5 + 1e-9; y += 0.5) hint(ctx, `${num(y, 1)} m`, rx + 13, Y(y), c);
      ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = c.ghost; ctx.lineWidth = 1;
      const hx = heavyRight ? cx + r : cx - r;
      ctx.beginPath(); ctx.moveTo(hx, Y(p.h)); ctx.lineTo(rx, Y(p.h)); ctx.stroke(); ctx.restore();
      // The dashed line marks where the heavier load starts: name it, between the right-hand load and the ruler.
      hint(ctx, `h = ${num(p.h, 1)} m`, (cx + r + w2 / 2 + rx) / 2, Y(p.h) - 10, c, 'center');
    }
    if (toggles.forces) {
      // One scale for the whole run, chosen so that the weight of each load still ends on the stage (with
      // room for its name) when that load is lowest: the heavier one on the floor, the lighter one at the start.
      const big = Math.max(p.m1, p.m2) * p.g, per0 = Math.min(80, 0.2 * view.height) / big;
      const low = (heavy) => (heavy && m.a > 1e-9 ? 0 : heavy ? p.h : 0.1);
      const room1 = view.height - 30 - Y(low(!heavyRight)), room2 = view.height - 30 - Y(low(heavyRight));
      // ... and so that T stays under the middle of the wheel when a load is highest (the heavier one at the
      // start, the lighter one at the end).
      const run = m.a > 1e-9 ? p.h : 0, hHeavy = heavyRight ? h2 : h1, hLight = heavyRight ? h1 : h2;
      const roomT = Math.min(Y(p.h) - hHeavy - 6, Y(0.1 + run) - hLight - 6) - cy - 10;
      const per = Math.max(0.3 * per0, Math.min(per0, room1 / (p.m1 * p.g), room2 / (p.m2 * p.g), roomT / m.T));
      drawArrow(ctx, cx - r, top1, cx - r, top1 - m.T * per, c.force, 'T');
      drawArrow(ctx, cx + r, top2, cx + r, top2 - m.T * per, c.force, 'T');
      drawArrow(ctx, cx - r, top1 + 6 + h1, cx - r, top1 + 6 + h1 + p.m1 * p.g * per, c.fg, 'm₁g');
      drawArrow(ctx, cx + r, top2 + 6 + h2, cx + r, top2 + 6 + h2 + p.m2 * p.g * per, c.fg, 'm₂g');
      label(ctx, `T = ${num(m.T, 2)} N`, 12, 20, c, 'left');
    }
  },
};

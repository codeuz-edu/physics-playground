import { num } from '../../core/format.js';
import { drawArrow, drawGround, drawSky, ink, label, reserve } from '../../ui/canvas.js';
import { hint } from '../kit.js';

const END = 2.4; // m from the centre to each end of the track
const GAP = 0.18; // m from the centre to the near face of each cart at t = 0

const params = [
  { key: 'm1', symbol: 'm₁', unit: 'kg', min: 0.5, max: 5, step: 0.1, default: 1, kind: 'initial', decimals: 1, color: '--vx' },
  { key: 'm2', symbol: 'm₂', unit: 'kg', min: 0.5, max: 5, step: 0.1, default: 1, kind: 'initial', decimals: 1, color: '--vy' },
  { key: 'F', symbol: 'F', unit: 'N', min: 1, max: 40, step: 1, default: 10, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'tau', symbol: 'τ', unit: 's', min: 0.05, max: 0.5, step: 0.05, default: 0.2, kind: 'initial', decimals: 2 },
];

/** Two carts push each other apart with equal and opposite forces for τ seconds, then roll freely. */
class ThirdLawModel {
  t = 0; x1 = -GAP; x2 = GAP; v1 = 0; v2 = 0; F12 = 0; F21 = 0; reason = ''; m1 = 1; m2 = 1; tau = 0; F = 0;
  reset(p) { this.t = 0; this.x1 = -GAP; this.x2 = GAP; this.v1 = 0; this.v2 = 0; this.reason = ''; this.m1 = p.m1; this.m2 = p.m2; this.tau = p.tau; this.F = p.F; this.force(p, 0); }
  force(p, t) { const on = t < p.tau - 1e-9; this.F21 = on ? -p.F : 0; this.F12 = on ? p.F : 0; }
  step(dt, p) {
    if (this.reason) return false;
    const pushLeft = Math.max(0, Math.min(dt, p.tau - this.t));
    const a1 = -p.F / p.m1, a2 = p.F / p.m2;
    // Pushing part of the step, then free rolling (no friction).
    this.x1 += this.v1 * pushLeft + 0.5 * a1 * pushLeft * pushLeft; this.v1 += a1 * pushLeft;
    this.x2 += this.v2 * pushLeft + 0.5 * a2 * pushLeft * pushLeft; this.v2 += a2 * pushLeft;
    const rest = dt - pushLeft;
    this.x1 += this.v1 * rest; this.x2 += this.v2 * rest;
    this.t += dt;
    this.force(p, this.t);
    // A strong, long push can carry a cart to the end of the track before it is over: say so.
    if (this.x1 <= -END || this.x2 >= END) { this.reason = this.t < p.tau - 1e-9 ? 'early' : 'end'; return false; }
    if (this.t >= 10) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return [this.t, this.x1, this.x2, this.v1, this.v2].every(Number.isFinite); }
  sample() {
    const mv1 = this.m1 * this.v1, mv2 = this.m2 * this.v2, sum = mv1 + mv2;
    // The pair starts at rest, so the total stays 0; drop the rounding left by the two products.
    return { v1: this.v1, v2: this.v2, F12: this.F12, F21: this.F21, p: Math.abs(sum) < 1e-9 * (Math.abs(mv1) + 1) ? 0 : sum, x1: this.x1, x2: this.x2, mv1, mv2 };
  }
  clone() { return Object.assign(new ThirdLawModel(), this); }
  /** The run's outcome in words; `text` is this simulation's text (sims/third-law/<locale>.js). */
  finishMessage(text) {
    if (!this.reason) return '';
    const msg = text.msg;
    const pp = msg.momenta(num(this.m2 * Math.abs(this.v2), 2));
    if (this.reason === 'early') {
      const u1 = -(this.F * this.tau) / this.m1, u2 = (this.F * this.tau) / this.m2;
      return msg.early(num(this.t, 2), num(this.tau, 2), num(this.v1, 2), num(this.v2, 2), pp, num(u1, 2), num(u2, 2));
    }
    return msg.after(num(this.v1, 2), num(this.v2, 2), num(Math.abs(this.v2 / this.v1), 2), pp);
  }
}

/** Length of a cart in metres: a heavier cart is a little longer. The stage holds the track with a cart at each end. */
const cartLen = (m) => 0.7 + 0.1 * m;

const cart = (ctx, cx, y, w, h, c, color, text) => {
  const rw = Math.max(5, h * 0.13), body = h - rw - 1;
  ctx.save();
  ctx.fillStyle = c.track; ctx.strokeStyle = color; ctx.lineWidth = ink.object;
  ctx.fillRect(cx - w / 2, y - h, w, body);
  ctx.strokeRect(cx - w / 2 + 0.75, y - h + 0.75, w - 1.5, body - 1.5);
  reserve(ctx, cx - w / 2, y - h, w, h); // the names of the arrows keep off the cart
  ctx.fillStyle = c.fg;
  for (const k of [-0.28, 0.28]) { ctx.beginPath(); ctx.arc(cx + k * w, y - rw, rw, 0, Math.PI * 2); ctx.fill(); }
  ctx.font = '600 12px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, y - h + body / 2 + 0.5);
  ctx.restore();
};

export default {
  id: 'third-law',
  params,
  stageSize: 'strip',
  viewPadding: { left: 24, right: 24, top: 30, bottom: 30 },
  presets: [
    { values: { m1: 1, m2: 1, F: 10, tau: 0.2 } },
    { values: { m1: 1, m2: 3, F: 12, tau: 0.25 } },
    { values: { m1: 2, m2: 4, F: 20, tau: 0.3 } },
  ],
  toggles: [
    { key: 'forces', default: true },
    { key: 'vel', default: true },
  ],
  readouts: [
    { key: 'F21', unit: 'N', decimals: 1, color: '--vx' },
    { key: 'F12', unit: 'N', decimals: 1, color: '--vy' },
    { key: 'v1', unit: 'm/s', decimals: 2, color: '--vx' },
    { key: 'v2', unit: 'm/s', decimals: 2, color: '--vy' },
    { key: 'mv1', unit: 'kg·m/s', decimals: 2, color: '--vx' },
    { key: 'mv2', unit: 'kg·m/s', decimals: 2, color: '--vy' },
  ],
  graphs: [
    { id: 'F', yLabel: 'F', unit: 'N', series: [{ key: 'F21', color: '--vx' }, { key: 'F12', color: '--vy' }] },
    { id: 'v', yLabel: 'υ', unit: 'm/s', series: [{ key: 'v1', color: '--vx' }, { key: 'v2', color: '--vy' }] },
    { id: 'p', yLabel: 'p', unit: 'kg·m/s', series: [{ key: 'mv1', color: '--vx' }, { key: 'mv2', color: '--vy' }, { key: 'p', color: '--fg' }] },
  ],
  createModel: () => new ThirdLawModel(),
  // The run ends when the near face of a cart reaches ±END, so the whole cart is then past that point: the
  // stage holds the track plus one cart length at each end, and the end stops are drawn where the carts' far
  // faces arrive.
  worldBounds: (p) => ({ xMin: -END - cartLen(p.m1) - 0.12, xMax: END + cartLen(p.m2) + 0.12, yMin: -0.45, yMax: 1 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), gy = view.py(0), S = view.scale;
    drawSky(ctx, view, c, gy);
    drawGround(ctx, view, c, gy);
    const w1 = cartLen(p.m1) * S, w2 = cartLen(p.m2) * S;
    const h1 = Math.max(30, w1 * 0.5), h2 = Math.max(30, w2 * 0.5);
    for (const [x, d] of [[X(-END) - w1, -1], [X(END) + w2, 1]]) { ctx.save(); ctx.fillStyle = c.fg; ctx.fillRect(x + (d < 0 ? -4 : 0), gy - 22, 4, 22); ctx.restore(); }
    const c1 = X(m.x1) - w1 / 2, c2 = X(m.x2) + w2 / 2;
    // Spring between the carts while they still touch it.
    const pushing = m.t < p.tau - 1e-9;
    const forces = toggles.forces && pushing;
    // The total, above the carts; drawn first so the names of the arrows keep off it.
    if (forces) label(ctx, `|F₁₂| = |F₂₁| = ${num(p.F, 0)} N`, X(0), gy - Math.max(h1, h2) - 66, c, 'center');
    if (pushing) {
      const a = X(m.x1), b = X(m.x2), y = gy - Math.min(h1, h2) * 0.55, n = 8;
      ctx.save(); ctx.strokeStyle = c.iron; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.moveTo(a, y);
      for (let i = 1; i < n; i++) ctx.lineTo(a + ((b - a) * i) / n, y + (i % 2 ? -5 : 5));
      ctx.lineTo(b, y); ctx.stroke(); ctx.restore();
    }
    cart(ctx, c1, gy, w1, h1, c, c.vx, `${num(p.m1, 1)} kg`);
    cart(ctx, c2, gy, w2, h2, c, c.vy, `${num(p.m2, 1)} kg`);
    // The forces act where the carts meet: each is drawn from the cart's near face over the cart it pushes,
    // just above it. While they act, the velocities go one row higher.
    if (forces) {
      const L = Math.min(w1, w2) * (0.3 + (0.6 * p.F) / 40); // 0.9 of the shorter cart for the strongest push (40 N)
      drawArrow(ctx, X(m.x1), gy - h1 - 12, X(m.x1) - L, gy - h1 - 12, c.vx, 'F₂₁');
      drawArrow(ctx, X(m.x2), gy - h2 - 12, X(m.x2) + L, gy - h2 - 12, c.vy, 'F₁₂');
    }
    if (toggles.vel) {
      // Over each cart, from its near face the way it goes; one scale for the run, so the faster cart's final
      // velocity is no longer than 0.9 of the shorter cart and both arrows stay over their carts at the end stops.
      const k = Math.min(18, (0.9 * Math.min(w1, w2)) / Math.max(1e-6, (p.F * p.tau) / Math.min(p.m1, p.m2)));
      const up = forces ? 40 : 12;
      if (Math.abs(m.v1) > 0.01) drawArrow(ctx, X(m.x1), gy - h1 - up, X(m.x1) + m.v1 * k, gy - h1 - up, c.vx, 'υ₁');
      if (Math.abs(m.v2) > 0.01) drawArrow(ctx, X(m.x2), gy - h2 - up, X(m.x2) + m.v2 * k, gy - h2 - up, c.vy, 'υ₂');
    }
    if (m.t === 0) hint(ctx, text.draw.start, X(0), gy + 40, c, 'center');
  },
};

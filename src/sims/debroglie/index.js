import { num } from '../../core/format.js';
import { ink, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { dot } from '../optics.js';

const DUR = 4, H = 6.626e-34, E = 1.602e-19;
// Mass (kg) of each particle, in the order of the menu (electron, proton).
const MASS = [9.109e-31, 1.673e-27];
const params = [
  { key: 'part', symbol: '', unit: '', min: 0, max: 1, step: 1, default: 0, kind: 'initial', options: ['electron', 'proton'] },
  { key: 'U', symbol: 'U', unit: 'V', min: 1, max: 5000, step: 1, default: 100, kind: 'initial', decimals: 0, color: '--force' },
];
const solve = (P) => { const m = MASS[P.part], v = Math.sqrt((2 * E * P.U) / m), p = m * v; return { v, p, lam: H / p }; };
// Screen path: the particle crosses the gap between the plates (fraction XG of the path) with constant acceleration in the
// time fraction UG, then drifts at its exit speed. UG = 2·XG/(1 + XG) makes the drift speed equal the exit speed.
const XG = 2 / 7, UG = (2 * XG) / (1 + XG);

/** Particle at rest accelerated through U between two plates (uniform field), then drifting with its de Broglie wave (not to scale). */
class DBModel {
  t = 0; s = null; x = 0; v = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.x = 0; this.v = 0; this.reason = ''; this.s = solve(P); }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt); const u = this.t / DUR;
    this.x = u < UG ? XG * (u / UG) ** 2 : XG + ((2 * XG) / UG) * (u - UG);
    this.v = this.s.v * Math.min(1, u / UG); // speed grows linearly in the uniform field, then stays constant
    if (this.t >= DUR - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.s.lam) && Number.isFinite(this.x); }
  // At rest the de Broglie wavelength does not exist (λ = h/(mυ) → ∞): NaN, shown as “—”.
  sample() { return { v: this.v / 1000, lam: this.v > 0 ? (H / (MASS[this.P.part] * this.v)) * 1e9 : NaN }; }
  clone() { return Object.assign(new DBModel(), this, { P: { ...this.P }, s: { ...this.s } }); }
  finishMessage(text) { return this.reason ? text.msg.end(num(this.P.U, 0), num(this.s.v / 1000, 0), num(this.s.lam * 1e9, 4)) : ''; }
}

export default {
  id: 'debroglie',
  params,
  presets: [
    { values: { part: 0, U: 100 } },
    { values: { part: 0, U: 1000 } },
    { values: { part: 1, U: 100 } },
  ],
  toggles: [],
  readouts: [
    { key: 'v', unit: 'km/s', decimals: 0, color: '--vel' },
    { key: 'lam', unit: 'nm', decimals: 4, color: '--acc' },
  ],
  graphs: [{ id: 'v', unit: 'km/s', series: [{ key: 'v', color: '--vel' }] }],
  noTape: true,
  createModel: () => new DBModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, cy = Y(3);
    // The path runs from x = 1.2 to 8.2, so the wave packet (3.2 wide) stays on the stage at the end; the second
    // plate stands where the path leaves the field (fraction XG of it, at x = 3.2).
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(1), Y(4.4)); ctx.lineTo(X(1), Y(1.6)); ctx.moveTo(X(3.2), Y(4.4)); ctx.lineTo(X(3.2), Y(3.2)); ctx.moveTo(X(3.2), Y(2.8)); ctx.lineTo(X(3.2), Y(1.6)); ctx.stroke();
    ctx.fillStyle = c.fg; ctx.font = '600 20px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(p.part === 0 ? '−' : '+', X(1), Y(4.4) - 14); ctx.fillText(p.part === 0 ? '+' : '−', X(3.2), Y(4.4) - 14); ctx.restore();
    hint(ctx, `U = ${num(p.U, 0)} V`, X(2.1), Y(1.2), c, 'center');
    const px = X(1.2) + m.x * (X(8.2) - X(1.2));
    // Wave packet travelling with the particle after the gap; its drawn wavelength shrinks as λ ∝ 1/√(mU).
    if (m.x > XG) {
      const lamPx = Math.max(6, Math.min(60, 0.9 * S * Math.cbrt(m.s.lam * 1e10))), w = 3.2 * S;
      ctx.save(); ctx.strokeStyle = c.accent; ctx.lineWidth = 1.75; ctx.beginPath();
      for (let k = 0; k <= 160; k++) { const u = k / 160, xx = px - w / 2 + u * w, env = Math.exp(-(((u - 0.5) * 3.2) ** 2)), yy = cy - Math.sin(((xx - px) / lamPx) * Math.PI * 2) * 0.6 * S * env; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke(); ctx.restore();
    }
    dot(ctx, px, cy, 6, p.part === 0 ? c.vel : c.force);
    label(ctx, `λ = h/(mυ) = h/√(2meU) = ${num(m.s.lam * 1e9, 4)} nm`, 12, 20, c, 'left');
    hint(ctx, text.draw.notToScale, 12, 46, c);
  },
};

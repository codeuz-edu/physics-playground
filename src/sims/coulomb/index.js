import { num } from '../../core/format.js';
import { drawArrow, fillSub, label, reserve } from '../../ui/canvas.js';
import { K, chargeBall } from '../elec.js';

const R_END = 0.6, R_HIT = 0.03, BALL = 0.015;
const params = [
  { key: 'q1', symbol: 'q₁', unit: 'μC', min: -5, max: 5, step: 0.1, default: 2, kind: 'initial', decimals: 1, color: '--force' },
  { key: 'q2', symbol: 'q₂', unit: 'μC', min: -5, max: 5, step: 0.1, default: 2, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'm', symbol: 'm', unit: 'g', min: 5, max: 200, step: 5, default: 50, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'r0', symbol: 'r₀', unit: 'cm', min: 5, max: 40, step: 1, default: 10, kind: 'initial', decimals: 0 },
];

/** q₁ is fixed at x = 0; q₂ (mass m) starts at rest at r₀ and moves under Coulomb's force alone. */
class CoulombModel {
  t = 0; r = 0; v = 0; F = 0; a = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.r = P.r0 / 100; this.v = 0; this.reason = ''; this.force(); }
  kqq() { return K * this.P.q1 * this.P.q2 * 1e-12; }
  force() { this.F = this.kqq() / (this.r * this.r); this.a = this.F / (this.P.m / 1000); }
  /** Speed from energy conservation: exact at the stopping point. */
  vAt(r) { const P = this.P; return Math.sign(this.kqq()) * Math.sqrt(Math.max(0, ((2 * Math.abs(this.kqq())) / (P.m / 1000)) * Math.abs(1 / (P.r0 / 100) - 1 / r))); }
  step(dt) {
    if (this.reason) return false;
    if (this.kqq() === 0) { this.t += dt; if (this.t > 2) this.reason = 'none'; return !this.reason; }
    const n = 8, h = dt / n;
    for (let i = 0; i < n; i++) { this.force(); this.v += this.a * h; this.r += this.v * h; this.t += h; if (this.r >= R_END || this.r <= R_HIT) break; }
    if (this.r >= R_END) { this.r = R_END; this.reason = 'far'; }
    else if (this.r <= R_HIT) { this.r = R_HIT; this.reason = 'hit'; }
    if (this.reason) this.v = this.vAt(this.r);
    this.force(); return !this.reason;
  }
  isValid() { return [this.r, this.v, this.F].every(Number.isFinite); }
  /** Readouts are magnitudes, as in F = k|q₁||q₂|/r²; the arrows on the stage show the directions. */
  sample() { return { r: this.r * 100, v: Math.abs(this.v), F: Math.abs(this.F), a: Math.abs(this.a) }; }
  clone() { return Object.assign(new CoulombModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (this.reason === 'far') return text.msg.far(num(this.v, 2), num(Math.abs(this.F), 3));
    if (this.reason === 'hit') return text.msg.hit(num(Math.abs(this.v), 2));
    if (this.reason === 'none') return text.msg.none;
    return '';
  }
}

export default {
  id: 'coulomb',
  params,
  stageSize: 'strip',
  presets: [
    { values: { q1: 2, q2: 2, m: 50, r0: 10 } },
    { values: { q1: 2, q2: -2, m: 50, r0: 30 } },
    { values: { q1: 2, q2: 2, m: 50, r0: 30 } },
  ],
  toggles: [{ key: 'forces', default: true }],
  readouts: [
    { key: 'r', unit: 'cm', decimals: 1, color: '--pos' },
    { key: 'F', unit: 'N', decimals: 3, color: '--force' },
    { key: 'v', unit: 'm/s', decimals: 2, color: '--vel' },
  ],
  graphs: [
    { id: 'F', unit: 'N', series: [{ key: 'F', color: '--force' }] },
    { id: 'v', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
  ],
  createModel: () => new CoulombModel(),
  worldBounds: () => ({ xMin: -0.12, xMax: 0.66, yMin: -0.1, yMax: 0.16 }), // room left of q₁ for the force on it
  viewPadding: { left: 24, right: 24, top: 40, bottom: 30 },

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, rb = Math.max(9, BALL * S);
    ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.fillStyle = c.muted; ctx.font = '500 11px Barlow, sans-serif'; ctx.textAlign = 'center';
    ctx.beginPath(); ctx.moveTo(X(0), Y(-0.05)); ctx.lineTo(X(0.62), Y(-0.05));
    for (let i = 0; i <= 60; i += 5) { const xx = X(i / 100); ctx.moveTo(xx, Y(-0.05)); ctx.lineTo(xx, Y(-0.05) + (i % 10 ? 4 : 8)); if (i % 10 === 0) ctx.fillText(`${i}`, xx, Y(-0.05) + 20); }
    // Axis name at the end of the axis line, clear of the last tick number.
    ctx.stroke(); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text.draw.axis, X(0.62) + 6, Y(-0.05));
    ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(0), Y(-0.05)); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
    chargeBall(ctx, X(0), Y(0), rb, p.q1, c);
    chargeBall(ctx, X(m.r), Y(0), rb, p.q2, c);
    const name = (t, x) => { ctx.save(); ctx.fillStyle = c.fg; ctx.font = '600 14px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; fillSub(ctx, t, x, Y(0) - rb - 6); ctx.restore(); reserve(ctx, x - 10, Y(0) - rb - 22, 20, 18); };
    const apart = Math.max(0, (24 - (X(m.r) - X(0))) / 2); // balls (nearly) touching: the two names move apart so they do not run together
    name('q₁', X(0) - apart); name('q₂', X(m.r) + apart);
    if (toggles.forces && m.F !== 0) {
      const big = (K * Math.abs(p.q1 * p.q2) * 1e-12) / Math.pow(p.r0 / 100, 2) || 1, d = Math.sign(m.F);
      // Equal and opposite, so one length for both; capped so the force on q₁ (pointing left when they repel) and its name stay on
      // the stage, and so two attracting forces, pointing at each other, each take at most their half of the gap between the balls.
      const room = Math.max(0, d > 0 ? X(0) - rb - 24 : (X(m.r) - X(0) - 2 * rb) / 2 - 8);
      const len = Math.min(room, Math.max(14, Math.min(90, 90 * Math.sqrt(Math.abs(m.F) / big))));
      drawArrow(ctx, X(m.r) + d * rb, Y(0), X(m.r) + d * (rb + len), Y(0), c.force, 'F');
      drawArrow(ctx, X(0) - d * rb, Y(0), X(0) - d * (rb + len), Y(0), c.force, 'F');
    }
    label(ctx, `F = k|q₁||q₂| / r² = ${num(Math.abs(m.F), 3)} N`, 12, 20, c, 'left');
  },
};

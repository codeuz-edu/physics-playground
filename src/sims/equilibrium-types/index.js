import { num } from '../../core/format.js';
import { drawArrow, drawHatch, ink, label, reserve } from '../../ui/canvas.js';
import { gParam, hint } from '../kit.js';

const K = 1.2; // 1/m, curvature of the surface y = ±K x²

const params = [
  // Surface names are in the text file (params.mode.options), in this order.
  { key: 'mode', symbol: '', unit: '', min: 0, max: 2, step: 1, default: 0, kind: 'initial', options: ['valley', 'hilltop', 'flat'] },
  { key: 'x0', symbol: 'x₀', unit: 'm', min: -0.4, max: 0.4, step: 0.02, default: 0.2, kind: 'initial', decimals: 2, color: '--pos' },
  { key: 'm', symbol: 'm', unit: 'kg', min: 0.1, max: 2, step: 0.1, default: 0.5, kind: 'initial', decimals: 1 },
  gParam,
];

const shape = (mode) => (mode === 0 ? K : mode === 1 ? -K : 0);

const EDGE = 1.0; // m, where the hill's surface leaves the stage: a ball rolling past it has gone

/**
 * A small ball sliding on y = kx² released from x₀ (k > 0 valley, k < 0 hilltop, k = 0 flat), with a
 * slight drag; a small nudge on the hill. Exact motion along the curve (Lagrange, with s = y′ = 2kx):
 * (1 + s²) ẍ + 2k s ẋ² = −g s, so the energy ½υ² + gy only falls through the drag.
 */
class EquilibriumModel {
  t = 0; x = 0; v = 0; reason = ''; p = null; b = 0.15;
  reset(p) { this.p = { ...p }; this.t = 0; this.x = p.mode === 1 && Math.abs(p.x0) < 1e-6 ? 0.005 : p.x0; this.v = 0; this.reason = ''; }
  acc(x, v) { const k = shape(this.p.mode), s = 2 * k * x; return (-this.p.g * s - 2 * k * s * v * v) / (1 + s * s) - this.b * v; }
  step(dt) {
    if (this.reason) return false;
    const a1 = this.acc(this.x, this.v), xm = this.x + this.v * dt / 2, vm = this.v + a1 * dt / 2, a2 = this.acc(xm, vm);
    this.x += vm * dt; this.v += a2 * dt; this.t += dt;
    if (Math.abs(this.x) > EDGE) { this.reason = 'away'; return false; }
    if (this.t >= 8) { this.reason = 'time'; return false; }
    return true;
  }
  isValid() { return [this.x, this.v].every(Number.isFinite); }
  sample() { const p = this.p, k = shape(p.mode); return { x: this.x, Ep: p.m * p.g * k * this.x * this.x, v: this.v }; }
  clone() { return Object.assign(new EquilibriumModel(), this, { p: { ...this.p } }); }
  finishMessage(text) {
    if (this.reason === 'away') return text.msg.away;
    if (this.p.mode === 0) return text.msg.stable;
    if (this.p.mode === 2) return text.msg.neutral;
    return text.msg.unstable;
  }
}

export default {
  id: 'equilibrium-types',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { mode: 0, x0: 0.2, m: 0.5, g: 9.81 } },
    { values: { mode: 1, x0: 0.02, m: 0.5, g: 9.81 } },
    { values: { mode: 2, x0: 0.2, m: 0.5, g: 9.81 } },
  ],
  toggles: [{ key: 'forces', default: true }, { key: 'eq', default: true }],
  readouts: [
    { key: 'x', unit: 'm', decimals: 3, color: '--pos' },
    { key: 'Ep', unit: 'J', decimals: 3, color: '--acc' },
  ],
  graphs: [
    { id: 'x', yLabel: 'x', unit: 'm', series: [{ key: 'x', color: '--pos' }] },
    { id: 'E', yLabel: 'Eₚ', unit: 'J', series: [{ key: 'Ep', color: '--acc' }] },
  ],
  createModel: () => new EquilibriumModel(),
  worldBounds: () => ({ xMin: -1.3, xMax: 1.3, yMin: -0.9, yMax: 0.9 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, k = shape(p.mode), base = p.mode === 1 ? 0.3 : -0.4;
    const f = (x) => base + k * x * x;
    ctx.fillStyle = c.surface; ctx.fillRect(0, 0, view.width, view.height);
    ctx.save(); ctx.beginPath(); ctx.moveTo(X(-1.3), Y(-0.9));
    for (let i = 0; i <= 80; i++) { const x = -1.3 + (2.6 * i) / 80; ctx.lineTo(X(x), Y(Math.max(-0.9, Math.min(0.9, f(x))))); }
    ctx.lineTo(X(1.3), Y(-0.9)); ctx.closePath(); ctx.fillStyle = c.ground; ctx.fill(); ctx.clip(); drawHatch(ctx, 0, 0, view.width, view.height, c.hatch, 0, 9); ctx.restore();
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.scenery; ctx.beginPath();
    for (let i = 0; i <= 80; i++) { const x = -1.3 + (2.6 * i) / 80, yy = Y(Math.max(-0.9, Math.min(0.9, f(x)))); i ? ctx.lineTo(X(x), yy) : ctx.moveTo(X(x), yy); }
    ctx.stroke(); ctx.restore();
    if (toggles.eq) { ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = c.ghost; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(0), Y(-0.85)); ctx.lineTo(X(0), Y(0.85)); ctx.stroke(); ctx.restore(); hint(ctx, text.draw.equilibrium, X(0) + (p.x0 >= 0 ? -6 : 6), Y(0.8), c, p.x0 >= 0 ? 'right' : 'left'); } // on the side away from the ball's start, clear of N on the hilltop
    const r = Math.max(8, 0.09 * S), slope = 2 * k * m.x, nx = -slope / Math.hypot(1, slope), ny = 1 / Math.hypot(1, slope);
    const bx = X(m.x) + nx * r, by = Y(f(m.x)) - ny * r;
    ctx.save(); ctx.fillStyle = c.body; ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // mg is 60 px, or three and a half ball radii on a big stage, so both arrows reach well out of the ball.
    // A ball that has rolled far down the hill gets both arrows shortened alike as it nears the bottom edge,
    // and none once there is no room left under it for the weight arrow and its name (it is leaving the stage).
    const room = view.height - 26 - by;
    if (toggles.forces && room >= r + 22) {
      const per = Math.min(Math.max(60, 3.5 * r), room) / (p.m * p.g), N = p.m * p.g * ny;
      reserve(ctx, bx - r, by - r, 2 * r, 2 * r); // the ball: no name on it
      drawArrow(ctx, bx, by, bx, by + p.m * p.g * per, c.fg, 'mg');
      drawArrow(ctx, bx, by, bx + nx * N * per, by - ny * N * per, c.force, 'N');
    }
    label(ctx, text.params.mode.options[p.mode], 12, 20, c, 'left');
  },
};

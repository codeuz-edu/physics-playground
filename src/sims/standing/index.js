import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { dot } from '../optics.js';

const PERIODS = 3, SLOW = 1.5; // one period lasts 1.5 s on screen
const params = [
  { key: 'n', symbol: 'n', unit: '', min: 1, max: 6, step: 1, default: 2, kind: 'initial', decimals: 0, color: '--acc' },
  { key: 'L', symbol: 'l', unit: 'm', min: 0.3, max: 2, step: 0.05, default: 1, kind: 'initial', decimals: 2, color: '--pos' },
  { key: 'F', symbol: 'F', unit: 'N', min: 10, max: 200, step: 0.1, default: 40, kind: 'initial', decimals: 1, color: '--force' },
  { key: 'mu', symbol: 'μ', unit: 'g/m', min: 0.5, max: 10, step: 0.1, default: 1, kind: 'initial', decimals: 1 },
];
/** Wave speed on a string, m/s: υ = √(F/μ) with μ given in g/m. */
const speed = (P) => Math.sqrt(P.F / (P.mu / 1000));

/** Standing wave on a string fixed at both ends: y = A sin(nπx/l) cos ωt, ν = nυ/(2l), υ = √(F/μ). Slow motion; time in ms. */
class StandModel {
  t = 0; ang = 0; v = 0; nu = 0; lam = 0; y = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.ang = 0; this.reason = ''; this.v = speed(P); this.nu = (P.n * this.v) / (2 * P.L); this.lam = (2 * P.L) / P.n; this.y = Math.cos(0); }
  step(dt) {
    if (this.reason) return false;
    this.ang = Math.min(2 * Math.PI * PERIODS, this.ang + (2 * Math.PI * dt) / SLOW); this.t = (this.ang / (2 * Math.PI)) * (1000 / this.nu); this.y = Math.cos(this.ang);
    if (this.ang >= 2 * Math.PI * PERIODS - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.y) && Number.isFinite(this.nu); }
  sample() { return { y: this.y * 100, nu: this.nu, lam: this.lam, v: this.v }; }
  clone() { return Object.assign(new StandModel(), this, { P: { ...this.P } }); }
  // Harmonic n has n + 1 nodes (both ends included) and n antinodes.
  finishMessage(text) { const n = this.P.n; return this.reason ? text.msg.end(n, num(this.lam, 2), num(this.nu, 1), n + 1, n, num(this.v, 0)) : ''; }
}

export default {
  id: 'standing',
  params,
  stageSize: 'strip',
  timeUnit: 'ms',
  presets: [
    { values: { n: 1, L: 1, F: 40, mu: 1 } },
    { values: { n: 3, L: 1, F: 40, mu: 1 } },
    { values: { n: 1, L: 0.65, F: 81.8, mu: 1 } },
  ],
  toggles: [],
  readouts: [
    { key: 'nu', unit: 'Hz', decimals: 1, color: '--vel' },
    { key: 'lam', unit: 'm', decimals: 2, color: '--acc' },
    { key: 'v', unit: 'm/s', decimals: 0 },
  ],
  graphs: [{ id: 'y', yLabel: 'y', unit: '%', range: [-100, 100], series: [{ key: 'y', color: '--pos' }] }],
  createModel: () => new StandModel(),
  worldBounds: (p) => ({ xMin: -0.08 * p.L, xMax: 1.08 * p.L, yMin: -0.32 * p.L, yMax: 0.32 * p.L }),
  viewPadding: { left: 24, right: 24, top: 44, bottom: 30 },

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), A = 0.2 * p.L, k = (p.n * Math.PI) / p.L;
    // The clamps first, so the nodes at the two ends show on them.
    ctx.save(); ctx.fillStyle = c.fg;
    for (const x of [0, p.L]) ctx.fillRect(X(x) - 3, Y(0.28 * p.L), 6, Y(-0.28 * p.L) - Y(0.28 * p.L));
    ctx.restore();
    ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
    for (const s of [1, -1]) { ctx.beginPath(); for (let i = 0; i <= 200; i++) { const x = (i / 200) * p.L; i ? ctx.lineTo(X(x), Y(s * A * Math.sin(k * x))) : ctx.moveTo(X(x), Y(0)); } ctx.stroke(); }
    ctx.restore();
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 300; i++) { const x = (i / 300) * p.L; const yy = Y(A * Math.sin(k * x) * m.y); i ? ctx.lineTo(X(x), yy) : ctx.moveTo(X(x), yy); }
    ctx.stroke(); ctx.restore();
    for (let j = 0; j <= p.n; j++) dot(ctx, X((j * p.L) / p.n), Y(0), 4.5, c.force);
    // Legend: the same dot, then what it marks.
    dot(ctx, X(0) + 16, Y(-0.29 * p.L), 4.5, c.force); hint(ctx, text.draw.nodes, X(0) + 26, Y(-0.29 * p.L), c);
    label(ctx, `ν = nυ/(2l) = ${num(m.nu, 1)} Hz,  υ = √(F/μ) = ${num(m.v, 0)} m/s`, 12, 20, c, 'left');
  },
};

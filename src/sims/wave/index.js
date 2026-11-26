import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { dot } from '../optics.js';

const XMAX = 8, MARK = 1, PERIODS = 4; // m; marked particle at x = 1 m; the run lasts four periods
const params = [
  { key: 'type', symbol: '', unit: '', min: 0, max: 1, step: 1, default: 0, kind: 'initial', options: ['transverse', 'longitudinal'] },
  { key: 'A', symbol: 'A', unit: 'cm', min: 0.5, max: 5, step: 0.5, default: 3, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'v', symbol: 'υ', unit: 'm/s', min: 0.5, max: 4, step: 0.05, default: 1, kind: 'initial', decimals: 2, color: '--vel' },
  { key: 'nu', symbol: 'ν', unit: 'Hz', min: 0.25, max: 2, step: 0.25, default: 0.5, kind: 'initial', decimals: 2 },
];

/**
 * Wave sent from x = 0 at t = 0: y(x, t) = A sin ω(t − x/υ) behind the front x = υt, rest ahead. Runs four periods.
 * The medium sets υ and the source sets ν, so the wavelength follows: λ = υ/ν.
 */
class WaveModel {
  t = 0; y = 0; front = 0; v = 0; lam = 0; T = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.reason = ''; this.v = P.v; this.lam = P.v / P.nu; this.T = 1 / P.nu; this.calc(); }
  at(x) { return x > this.v * this.t ? 0 : this.P.A * Math.sin(2 * Math.PI * this.P.nu * (this.t - x / this.v)); }
  calc() { this.front = this.v * this.t; this.y = this.at(MARK); }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(PERIODS * this.T, this.t + dt); this.calc();
    if (this.t >= PERIODS * this.T - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.y); }
  sample() { return { y: this.y, front: Math.min(this.front, 99), lam: this.lam, T: this.T }; }
  clone() { return Object.assign(new WaveModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { return this.reason ? text.msg.end(PERIODS, num(this.lam, 2), num(this.T, 2), num(this.front, 1)) : ''; }
}

export default {
  id: 'wave',
  params,
  stageSize: 'strip',
  presets: [
    { values: { type: 0, A: 3, v: 1, nu: 0.5 } },
    { values: { type: 1, A: 3, v: 1.5, nu: 1.5 } },
    { values: { type: 0, A: 4, v: 0.75, nu: 0.25 } },
  ],
  toggles: [],
  readouts: [
    { key: 'y', unit: 'cm', decimals: 2, color: '--pos' },
    { key: 'lam', unit: 'm', decimals: 2, color: '--acc' },
    { key: 'T', unit: 's', decimals: 2 },
    { key: 'front', unit: 'm', decimals: 2, color: '--vel' },
  ],
  graphs: [{ id: 'y', yLabel: 'y', unit: 'cm', series: [{ key: 'y', color: '--pos' }] }],
  createModel: () => new WaveModel(),
  worldBounds: () => ({ xMin: -0.3, xMax: XMAX + 0.3, yMin: -1.4, yMax: 1.4 }),
  viewPadding: { left: 24, right: 24, top: 40, bottom: 24 },

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y);
    const fine = m.lam < 1; // short waves need more points so the picture does not alias
    ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(XMAX), Y(0)); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    if (p.type === 0) {
      const k = 1 / 5; // 5 cm of displacement drawn as 1 m
      const nc = 640, np = fine ? 97 : 49; // x = 1 m is always one of the particles
      ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let i = 0; i <= nc; i++) { const x = (i / nc) * XMAX, yy = Y(m.at(x) * k); i ? ctx.lineTo(X(x), yy) : ctx.moveTo(X(x), yy); }
      ctx.stroke(); ctx.restore();
      for (let i = 0; i < np; i++) { const x = (i / (np - 1)) * XMAX, mk = Math.abs(x - MARK) < 1e-9; dot(ctx, X(x), Y(m.at(x) * k), mk ? 6 : 3, mk ? c.force : c.accent); }
    } else {
      // Exaggerated along x, but never so much that neighbouring layers cross: the drawn strain stays below 0.8.
      const k = Math.min(0.12, (0.8 * m.lam) / (2 * Math.PI * 5)), nl = fine ? 193 : 97;
      ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.25;
      for (let i = 0; i < nl; i++) { const x = (i / (nl - 1)) * XMAX, xx = X(x + m.at(x) * k); ctx.beginPath(); ctx.moveTo(xx, Y(0.7)); ctx.lineTo(xx, Y(-0.7)); ctx.stroke(); }
      ctx.restore();
      const xm = X(MARK + m.y * k); ctx.save(); ctx.strokeStyle = c.force; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xm, Y(0.8)); ctx.lineTo(xm, Y(-0.8)); ctx.stroke(); ctx.restore();
    }
    // The front line and the λ ruler keep close to the wave: just past its crests (or the layers) and just under its troughs.
    const top = (p.type === 0 ? p.A / 5 : 0.8) + 0.25;
    if (m.front < XMAX) { ctx.save(); ctx.strokeStyle = c.vel; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(m.front), Y(top)); ctx.lineTo(X(m.front), Y(-top)); ctx.stroke(); ctx.restore(); hint(ctx, text.draw.front, X(m.front) + 4, Y(top) + 7, c); }
    // λ as a dimension line; a wave longer than the stage gets an open right end.
    const ys = Y(-top - 0.05), fits = m.lam <= XMAX, a = fits ? Math.min(4, XMAX - m.lam) : 0, b = fits ? a + m.lam : XMAX;
    ctx.save(); ctx.strokeStyle = c.acc || c.fg; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(a), ys); ctx.lineTo(X(b), ys); ctx.moveTo(X(a), ys - 4); ctx.lineTo(X(a), ys + 4);
    if (fits) { ctx.moveTo(X(b), ys - 4); ctx.lineTo(X(b), ys + 4); } else { ctx.moveTo(X(b) - 6, ys - 4); ctx.lineTo(X(b), ys); ctx.lineTo(X(b) - 6, ys + 4); }
    ctx.stroke(); ctx.restore();
    const lam = `λ = ${num(m.lam, 2)} m`;
    hint(ctx, fits ? lam : text.draw.tooLong(lam), X((a + b) / 2), ys + 11, c, 'center'); // under the ruler: the troughs come down to it
    label(ctx, `λ = υ/ν = ${num(m.lam, 2)} m`, 12, 20, c, 'left');
  },
};

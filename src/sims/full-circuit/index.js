import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { cell, drift, meter, resistor, wire } from '../elec.js';

const DUR = 10, R0 = 0.1;
const params = [
  { key: 'mode', symbol: '', unit: '', min: 0, max: 1, step: 1, default: 0, kind: 'initial', options: ['fixed', 'rheostat'] },
  { key: 'E', symbol: 'ℰ', unit: 'V', min: 1.5, max: 24, step: 0.5, default: 12, kind: 'initial', decimals: 1, color: '--force' },
  { key: 'r', symbol: 'r', unit: 'Ω', min: 0.1, max: 5, step: 0.1, default: 1, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'R', symbol: 'R', unit: 'Ω', min: 0.1, max: 50, step: 0.1, default: 5, kind: 'initial', decimals: 1, color: '--pos' },
];

/** Source with EMF ℰ and internal resistance r on a load R (fixed, or swept by a rheostat). */
class CircuitModel {
  t = 0; Rn = 0; I = 0; U = 0; Pw = 0; eta = 0; ph = 0; best = 0; bestR = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.ph = 0; this.best = 0; this.bestR = 0; this.reason = ''; this.calc(); }
  calc() {
    const P = this.P; this.Rn = P.mode === 0 ? P.R : R0 + ((P.R - R0) * this.t) / DUR;
    this.I = P.E / (this.Rn + P.r); this.U = this.I * this.Rn; this.Pw = this.I * this.I * this.Rn; this.eta = (this.Rn / (this.Rn + P.r)) * 100;
    if (this.Pw > this.best) { this.best = this.Pw; this.bestR = this.Rn; }
  }
  step(dt) {
    if (this.reason) return false;
    const end = this.P.mode === 0 ? 5 : DUR; this.t = Math.min(end, this.t + dt); this.calc(); this.ph += this.I * dt * 12;
    if (this.t >= end - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return [this.I, this.U].every(Number.isFinite); }
  sample() { return { I: this.I, U: this.U, P: this.Pw, eta: this.eta, R: this.Rn, Isc: this.P.E / this.P.r }; }
  clone() { return Object.assign(new CircuitModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const P = this.P;
    if (P.mode === 0) return text.msg.fixed(num(this.I, 2), num(this.U, 2), num(this.Pw, 2), num(this.eta, 1));
    return P.R >= P.r
      ? text.msg.peak(num(P.r, 1), num((P.E * P.E) / (4 * P.r), 2))
      : text.msg.atEnd(num(this.Pw, 2));
  }
}

export default {
  id: 'full-circuit',
  params,
  presets: [
    { values: { mode: 0, E: 12, r: 1, R: 5 } },
    { values: { mode: 0, E: 6, r: 0.4, R: 0.1 } },
    { values: { mode: 1, E: 12, r: 2, R: 10 } },
  ],
  toggles: [],
  readouts: [
    { key: 'I', unit: 'A', decimals: 2, color: '--force' },
    { key: 'U', unit: 'V', decimals: 2, color: '--vel' },
    { key: 'P', unit: 'W', decimals: 2, color: '--acc' },
    { key: 'eta', unit: '%', decimals: 1 },
    { key: 'R', unit: 'Ω', decimals: 1, color: '--pos' },
    { key: 'Isc', unit: 'A', decimals: 1 },
  ],
  graphs: [
    { id: 'P', unit: 'W', series: [{ key: 'P', color: '--acc' }] },
    { id: 'IU', unit: '', series: [{ key: 'I', color: '--force' }, { key: 'U', color: '--vel' }] },
  ],
  createModel: () => new CircuitModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),
  noTape: true, // a circuit diagram: distances on it are not lengths

  draw({ ctx, view, model: m, params: p, colors: c }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y);
    const L = X(2.2), Rr = X(8.2), T = Y(4.3), Bt = Y(0.9), cy = (T + Bt) / 2;
    wire(ctx, [[L, cy - 6], [L, T], [Rr, T], [Rr, Bt], [L, Bt], [L, cy + 6]], c);
    drift(ctx, [[L, cy - 30], [L, T], [Rr, T], [Rr, Bt], [L, Bt], [L, cy + 30]], m.ph, c);
    // The source as a dashed box: ideal cell plus its internal resistance r. On a short stage it shrinks to stay clear of the wires above and below.
    const hb = Math.min(56, (Bt - T) / 2 - 12);
    ctx.save(); ctx.fillStyle = c.surface; ctx.fillRect(L - 34, cy - hb, 68, 2 * hb); ctx.strokeStyle = c.muted; ctx.setLineDash([4, 4]); ctx.strokeRect(L - 34, cy - hb, 68, 2 * hb); ctx.restore();
    wire(ctx, [[L, cy - hb], [L, cy + hb]], c);
    ctx.save(); ctx.fillStyle = c.surface; ctx.fillRect(L - 18, cy + 4, 36, 18); ctx.restore();
    cell(ctx, L, cy + 13, c, '');
    resistor(ctx, L, cy - 26, c, '', true, 30);
    hint(ctx, `r = ${num(p.r, 1)} Ω`, L - 42, cy - 26, c, 'right'); hint(ctx, `ℰ = ${num(p.E, 1)} V`, L - 42, cy + 13, c, 'right');
    resistor(ctx, X(5), T, c, '', false, 70); hint(ctx, `R = ${num(m.Rn, 1)} Ω`, X(5), T + 22, c, 'center');
    if (p.mode === 1) { const f = (m.Rn - R0) / Math.max(1e-6, p.R - R0), sx = X(5) - 35 + 70 * f; ctx.save(); ctx.fillStyle = c.force; ctx.beginPath(); ctx.moveTo(sx, T - 9); ctx.lineTo(sx - 6, T - 19); ctx.lineTo(sx + 6, T - 19); ctx.fill(); ctx.restore(); }
    meter(ctx, X(5), Bt, 'A', c); hint(ctx, `I = ${num(m.I, 2)} A`, X(5), Bt + 26, c, 'center');
    // Voltmeter across R: its leads join the wire clear of the resistor's ends and run right up to the meter's circle (r = 13 px).
    const vl = Math.min(X(4.2), X(5) - 47), vr = Math.max(X(5.8), X(5) + 47), vy = Y(5.4);
    wire(ctx, [[vl, T], [vl, vy], [X(5) - 13, vy]], c, c.muted); wire(ctx, [[vr, T], [vr, vy], [X(5) + 13, vy]], c, c.muted);
    meter(ctx, X(5), vy, 'V', c); hint(ctx, `U = ${num(m.U, 2)} V`, X(5), vy - 24, c, 'center');
    label(ctx, `I = ℰ / (R + r) = ${num(m.I, 2)} A`, 12, 20, c, 'left');
  },
};

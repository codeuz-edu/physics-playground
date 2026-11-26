import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { cell, drift, meter, resistor, wire } from '../elec.js';

const DUR = 6;
const params = [
  { key: 'conn', symbol: '', unit: '', min: 0, max: 1, step: 1, default: 0, kind: 'initial', options: ['series', 'parallel'] },
  { key: 'U', symbol: 'U', unit: 'V', min: 1, max: 24, step: 0.5, default: 12, kind: 'initial', decimals: 1, color: '--force' },
  { key: 'R1', symbol: 'R₁', unit: 'Ω', min: 1, max: 50, step: 1, default: 4, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'R2', symbol: 'R₂', unit: 'Ω', min: 1, max: 50, step: 1, default: 8, kind: 'initial', decimals: 0, color: '--vel' },
];
const solve = (P) => {
  if (P.conn === 0) { const R = P.R1 + P.R2, I = P.U / R; return { R, I, I1: I, I2: I, U1: I * P.R1, U2: I * P.R2 }; }
  const R = (P.R1 * P.R2) / (P.R1 + P.R2); return { R, I: P.U / R, I1: P.U / P.R1, I2: P.U / P.R2, U1: P.U, U2: P.U };
};

/** Two resistors on an ideal source; values are fixed by Ohm's law, time only carries the charge and the work. */
class OhmModel {
  t = 0; q = 0; A = 0; s = null; ph = [0, 0, 0]; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.q = 0; this.A = 0; this.ph = [0, 0, 0]; this.reason = ''; this.s = solve(P); }
  step(dt) {
    if (this.reason) return false;
    const d = Math.min(dt, DUR - this.t); this.t += d; this.q = this.s.I * this.t; this.A = this.P.U * this.s.I * this.t;
    this.ph = [this.ph[0] + this.s.I * d * 30, this.ph[1] + this.s.I1 * d * 30, this.ph[2] + this.s.I2 * d * 30];
    if (this.t >= DUR - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.s.I); }
  sample() { return { ...this.s, q: this.q, A: this.A }; }
  clone() { return Object.assign(new OhmModel(), this, { P: { ...this.P }, ph: [...this.ph] }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const s = this.s;
    return this.P.conn === 0
      ? text.msg.series(num(s.R, 1), num(s.I, 2), num(s.U1, 2), num(s.U2, 2))
      : text.msg.parallel(num(s.R, 1), num(s.I, 2), num(s.I1, 2), num(s.I2, 2));
  }
}

export default {
  id: 'ohm',
  params,
  presets: [
    { values: { conn: 0, U: 12, R1: 4, R2: 8 } },
    { values: { conn: 1, U: 12, R1: 4, R2: 12 } },
    { values: { conn: 1, U: 6, R1: 10, R2: 10 } },
  ],
  toggles: [],
  readouts: [
    { key: 'R', unit: 'Ω', decimals: 2, color: '--pos' },
    { key: 'I', unit: 'A', decimals: 2, color: '--force' },
    { key: 'I1', unit: 'A', decimals: 2 },
    { key: 'I2', unit: 'A', decimals: 2 },
    { key: 'U1', unit: 'V', decimals: 2 },
    { key: 'U2', unit: 'V', decimals: 2 },
  ],
  graphs: [
    { id: 'q', unit: 'C', series: [{ key: 'q', color: '--pos' }] },
    { id: 'A', unit: 'J', series: [{ key: 'A', color: '--acc' }] },
  ],
  createModel: () => new OhmModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),
  noTape: true, // a circuit diagram: distances on it are not lengths

  draw({ ctx, view, model: m, params: p, colors: c }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), s = m.s;
    // In parallel the branch currents are written right of the branches; on a narrow stage the outer wire moves right to make room for them.
    ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; const wI = Math.max(ctx.measureText(`I₁ = ${num(s.I1, 2)} A`).width, ctx.measureText(`I₂ = ${num(s.I2, 2)} A`).width); ctx.restore();
    const L = X(1.6), Rr = p.conn === 0 ? X(8.4) : Math.max(X(8.4), Math.min(X(9.7), X(7.2) + 18 + wI)), T = Y(5.1), Bt = Y(1), cy = (T + Bt) / 2;
    if (p.conn === 0) {
      wire(ctx, [[L, cy - 6], [L, T], [Rr, T], [Rr, Bt], [L, Bt], [L, cy + 6]], c);
      drift(ctx, [[L, cy - 10], [L, T], [Rr, T], [Rr, Bt], [L, Bt], [L, cy + 10]], m.ph[0], c);
      resistor(ctx, X(3.9), T, c, `R₁ = ${num(p.R1, 0)} Ω`); resistor(ctx, X(6.4), T, c, `R₂ = ${num(p.R2, 0)} Ω`);
      hint(ctx, `U₁ = ${num(s.U1, 2)} V`, X(3.9), T + 24, c, 'center'); hint(ctx, `U₂ = ${num(s.U2, 2)} V`, X(6.4), T + 24, c, 'center');
    } else {
      const a = X(3.6), b = X(7.2), y1 = Y(4.1), y2 = Y(2.6);
      wire(ctx, [[L, cy - 6], [L, T], [a, T], [a, y2], [b, y2], [b, T], [Rr, T], [Rr, Bt], [L, Bt], [L, cy + 6]], c);
      wire(ctx, [[a, y1], [b, y1]], c);
      drift(ctx, [[L, cy - 10], [L, T], [a, T]], m.ph[0], c); drift(ctx, [[b, T], [Rr, T], [Rr, Bt], [L, Bt], [L, cy + 10]], m.ph[0] + 7, c);
      drift(ctx, [[a, T], [a, y1], [b, y1], [b, T]], m.ph[1], c); drift(ctx, [[a, y1], [a, y2], [b, y2], [b, y1]], m.ph[2], c);
      resistor(ctx, (a + b) / 2, y1, c, `R₁ = ${num(p.R1, 0)} Ω`); resistor(ctx, (a + b) / 2, y2, c, `R₂ = ${num(p.R2, 0)} Ω`);
      hint(ctx, `I₁ = ${num(s.I1, 2)} A`, b + 10, y1 + 12, c); hint(ctx, `I₂ = ${num(s.I2, 2)} A`, b + 10, y2 + 12, c);
    }
    ctx.save(); ctx.fillStyle = c.surface; ctx.fillRect(L - 18, cy - 8, 36, 16); ctx.restore();
    cell(ctx, L, cy, c, `${num(p.U, 1)} V`);
    meter(ctx, X(5), Bt, 'A', c); hint(ctx, `I = ${num(s.I, 2)} A`, X(5), Bt + 26, c, 'center');
    label(ctx, p.conn === 0 ? `R = R₁ + R₂ = ${num(s.R, 2)} Ω` : `1/R = 1/R₁ + 1/R₂,  R = ${num(s.R, 2)} Ω`, 12, 20, c, 'left');
  },
};

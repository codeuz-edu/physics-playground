import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { capacitor, cell, drift, meter, resistor, wire } from '../elec.js';

const params = [
  { key: 'mode', symbol: '', unit: '', min: 0, max: 1, step: 1, default: 0, kind: 'initial', options: ['charge', 'discharge'] },
  { key: 'U', symbol: 'U', unit: 'V', min: 1, max: 24, step: 1, default: 12, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'R', symbol: 'R', unit: 'kΩ', min: 0.5, max: 10, step: 0.5, default: 2, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'C', symbol: 'C', unit: 'μF', min: 100, max: 1000, step: 50, default: 500, kind: 'initial', decimals: 0, color: '--vel' },
];

/** RC circuit: u_C = U(1 − e^(−t/RC)) when charging, U e^(−t/RC) when discharging; the run lasts 5τ. */
class RCModel {
  t = 0; tau = 0; u = 0; I = 0; q = 0; W = 0; ph = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.ph = 0; this.reason = ''; this.tau = P.R * 1e3 * P.C * 1e-6; this.calc(); }
  calc() {
    const P = this.P, e = Math.exp(-this.t / this.tau);
    this.u = P.mode === 0 ? P.U * (1 - e) : P.U * e; this.I = (P.U / P.R) * e;
    this.q = P.C * 1e-6 * this.u * 1000; this.W = 0.5 * P.C * 1e-6 * this.u * this.u * 1000;
  }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(5 * this.tau, this.t + dt); this.calc(); this.ph += this.I * dt * 18;
    if (this.t >= 5 * this.tau - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return [this.u, this.I].every(Number.isFinite); }
  sample() { return { u: this.u, I: this.I, q: this.q, W: this.W }; }
  clone() { return Object.assign(new RCModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { return this.reason ? text.msg.end(num(5 * this.tau, 2), num(this.u, 2), num((this.u / this.P.U) * 100, 1), num(this.q, 2), num(this.W, 2)) : ''; }
}

export default {
  id: 'rc',
  params,
  presets: [
    { values: { mode: 0, U: 12, R: 2, C: 500 } },
    { values: { mode: 0, U: 12, R: 2, C: 1000 } },
    { values: { mode: 1, U: 24, R: 10, C: 200 } },
  ],
  toggles: [],
  readouts: [
    { key: 'u', unit: 'V', decimals: 2, color: '--vel' },
    { key: 'I', unit: 'mA', decimals: 2, color: '--force' },
    { key: 'q', unit: 'mC', decimals: 2, color: '--pos' },
    { key: 'W', unit: 'mJ', decimals: 2, color: '--acc' },
  ],
  graphs: [
    { id: 'u', unit: 'V', series: [{ key: 'u', color: '--vel' }] },
    { id: 'I', unit: 'mA', series: [{ key: 'I', color: '--force' }] },
  ],
  createModel: () => new RCModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),
  noTape: true, // a circuit diagram: distances on it are not lengths

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y);
    const L = X(2), Rr = X(8), T = Y(5), Bt = Y(1.2), cy = (T + Bt) / 2, chg = p.mode === 0;
    const loop = chg ? [[L, cy - 6], [L, T], [Rr, T], [Rr, Bt], [L, Bt], [L, cy + 6]] : [[X(3.6), T], [Rr, T], [Rr, Bt], [X(3.6), Bt], [X(3.6), T]];
    wire(ctx, loop, c);
    if (!chg) { wire(ctx, [[L, cy - 6], [L, T], [X(3), T]], c, c.muted); wire(ctx, [[L, cy + 6], [L, Bt], [X(3.6), Bt]], c, c.muted); }
    // Conventional current: charging, from the + terminal to the top plate and from the bottom plate back to the − terminal
    // (so it also runs through the ammeter); discharging, from the + plate round the loop to the − plate.
    const flows = chg ? [[[L, cy - 8], [L, T], [Rr, T], [Rr, cy - 8]], [[Rr, cy + 8], [Rr, Bt], [L, Bt], [L, cy + 8]]] : [[[Rr, cy - 8], [Rr, T], [X(3.6), T], [X(3.6), Bt], [Rr, Bt], [Rr, cy + 8]]];
    if (m.I > 0.01 && m.t > 0 && !m.reason) for (const f of flows) drift(ctx, f, m.ph, c);
    ctx.save(); ctx.fillStyle = c.surface; ctx.fillRect(Rr - 20, cy - 7, 40, 14); ctx.restore();
    capacitor(ctx, Rr, cy, c, `C = ${num(p.C, 0)} μF`, true, 12, 40);
    // Charges on the plates, more as the voltage rises: up to four signs per plate, spaced so each reads on its own, clear of the wire.
    const n = Math.round((m.u / p.U) * 4);
    ctx.save(); ctx.font = '700 13px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < n; i++) { const xx = Rr + [-7.5, 7.5, -16, 16][i]; ctx.fillStyle = c.force; ctx.fillText('+', xx, cy - 15); ctx.fillStyle = c.vel; ctx.fillText('−', xx, cy + 16); }
    ctx.restore();
    ctx.save(); ctx.fillStyle = c.surface; ctx.fillRect(L - 18, cy - 8, 36, 16); ctx.restore();
    if (chg) cell(ctx, L, cy, c, `U = ${num(p.U, 0)} V`);
    else { ctx.save(); ctx.globalAlpha = 0.4; cell(ctx, L, cy, c, `${num(p.U, 0)} V`); ctx.restore(); }
    resistor(ctx, X(5.5), T, c, `R = ${num(p.R, 1)} kΩ`);
    meter(ctx, X(5.5), Bt, 'A', c);
    if (!chg) hint(ctx, text.draw.disconnected, X(2.6), Y(0.6), c, 'center');
    label(ctx, `τ = RC = ${num(m.tau, 2)} s`, 12, 20, c, 'left');
  },
};

import { num } from '../../core/format.js';
import { ink, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { capacitor, drift, wire } from '../elec.js';

const PERIODS = 3, SLOW = 4; // one period lasts 4 s on screen
const params = [
  { key: 'L', symbol: 'L', unit: 'H', min: 0.05, max: 1, step: 0.05, default: 0.1, kind: 'initial', decimals: 2, color: '--pos' },
  { key: 'C', symbol: 'C', unit: 'μF', min: 1, max: 100, step: 1, default: 10, kind: 'initial', decimals: 0, color: '--vel' },
  { key: 'U', symbol: 'U₀', unit: 'V', min: 1, max: 50, step: 1, default: 10, kind: 'initial', decimals: 0, color: '--force' },
];
const per = (P) => 2 * Math.PI * Math.sqrt(P.L * P.C * 1e-6);

/** Ideal LC circuit, capacitor charged to U₀ at t = 0: q = q_m cos ωt, i = −q_m ω sin ωt. Slow motion; time shown in ms. */
class LCModel {
  t = 0; ang = 0; q = 0; i = 0; WC = 0; WL = 0; T = 0; ph = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.ang = 0; this.ph = 0; this.reason = ''; this.T = per(P); this.calc(); }
  calc() {
    const P = this.P, qm = P.C * 1e-6 * P.U, w = (2 * Math.PI) / this.T;
    this.q = qm * Math.cos(this.ang); this.i = -qm * w * Math.sin(this.ang);
    this.WC = (this.q * this.q) / (2 * P.C * 1e-6) * 1000; this.WL = (P.L * this.i * this.i) / 2 * 1000;
  }
  step(dt) {
    if (this.reason) return false;
    this.ang = Math.min(2 * Math.PI * PERIODS, this.ang + (2 * Math.PI * dt) / SLOW); this.t = (this.ang / (2 * Math.PI)) * this.T * 1000; this.calc(); this.ph += Math.sin(this.ang) * dt * 60; // i = −dq/dt leaves the top plate: dots move with conventional current
    if (this.ang >= 2 * Math.PI * PERIODS - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return [this.q, this.i].every(Number.isFinite); }
  sample() { return { q: this.q * 1e6, i: this.i * 1000, WC: this.WC, WL: this.WL }; }
  clone() { return Object.assign(new LCModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const P = this.P, Im = P.C * 1e-6 * P.U * ((2 * Math.PI) / this.T);
    return text.msg.end(PERIODS, num(this.T * 1000, 3), num(1 / this.T, 1), num(Im * 1000, 1), num(0.5 * P.C * 1e-6 * P.U * P.U * 1000, 3));
  }
}

export default {
  id: 'lc',
  params,
  timeUnit: 'ms',
  presets: [
    { values: { L: 0.1, C: 10, U: 10 } },
    { values: { L: 0.1, C: 40, U: 10 } },
    { values: { L: 0.4, C: 10, U: 20 } },
  ],
  toggles: [],
  readouts: [
    { key: 'q', unit: 'μC', decimals: 1, color: '--vel' },
    { key: 'i', unit: 'mA', decimals: 1, color: '--force' },
    { key: 'WC', unit: 'mJ', decimals: 3, color: '--acc' },
    { key: 'WL', unit: 'mJ', decimals: 3, color: '--pos' },
  ],
  graphs: [
    { id: 'qi', unit: '', series: [{ key: 'q', color: '--vel' }, { key: 'i', color: '--force' }] },
    { id: 'W', unit: 'mJ', series: [{ key: 'WC', color: '--acc' }, { key: 'WL', color: '--pos' }] },
  ],
  createModel: () => new LCModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),
  noTape: true, // a circuit diagram: distances on it are not lengths

  draw({ ctx, view, model: m, params: p, colors: c }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    const L = X(1.6), R = X(6), T = Y(5), Bt = Y(1.2), cy = (T + Bt) / 2;
    wire(ctx, [[L, cy - 8], [L, T], [R, T], [R, cy - 0.9 * S]], c); wire(ctx, [[L, cy + 8], [L, Bt], [R, Bt], [R, cy + 0.9 * S]], c);
    // Current leaving the top plate runs down through the coil and back to the bottom plate; the dots follow it.
    if (Math.abs(m.i) > 1e-6) { drift(ctx, [[L, cy - 12], [L, T], [R, T], [R, cy - 0.9 * S]], m.ph, c); drift(ctx, [[R, cy + 0.9 * S], [R, Bt], [L, Bt], [L, cy + 12]], m.ph, c); }
    capacitor(ctx, L, cy, c, '', true, 14, 44);
    // Charges on the plates, filled outwards from the lead in the middle so no sign sits on the wire.
    const n = Math.round(Math.abs(m.q) / (p.C * 1e-6 * p.U) * 6), top = m.q >= 0;
    ctx.save(); ctx.font = '700 14px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let k = 0; k < n; k++) { const xx = L + (k % 2 ? 1 : -1) * 7 * (1 + (k >> 1)); ctx.fillStyle = top ? c.force : c.vel; ctx.fillText(top ? '+' : '−', xx, cy - 17); ctx.fillStyle = top ? c.vel : c.force; ctx.fillText(top ? '−' : '+', xx, cy + 18); }
    ctx.restore();
    hint(ctx, `C = ${num(p.C, 0)} μF`, L - 30, cy, c, 'right');
    // Coil: the circuit symbol, a row of turns along the right wire.
    const rc = (1.8 * S) / 12;
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(R, cy - 0.9 * S);
    for (let k = 0; k < 6; k++) ctx.arc(R, cy - 0.9 * S + rc * (2 * k + 1), rc, -Math.PI / 2, Math.PI / 2);
    ctx.stroke(); ctx.restore();
    hint(ctx, `L = ${num(p.L, 2)} H`, R - 16, cy, c, 'right');
    // Energy bars.
    const W = 0.5 * p.C * 1e-6 * p.U * p.U * 1000, bx = X(8), bw = 0.5 * S, bh = 3.2 * S, by = Y(1.2);
    for (const [k, val, col, name] of [[0, m.WC, c.acc, 'W_C'], [1, m.WL, c.pos, 'W_L']]) {
      const x = bx + k * (bw + 14); ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1; ctx.strokeRect(x, by - bh, bw, bh); ctx.fillStyle = col; ctx.fillRect(x + 1, by - (bh * val) / W, bw - 2, (bh * val) / W); ctx.restore();
      hint(ctx, name, x + bw / 2, by + 12, c, 'center');
    }
    label(ctx, `T = 2π√(LC) = ${num(m.T * 1000, 3)} ms`, 12, 20, c, 'left');
  },
};

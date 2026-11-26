import { num } from '../../core/format.js';
import { ink, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { R, drawParticles, flame, makeParticles, plotBox } from '../thermo.js';

const DUR = 8; // s of animation for the whole process
const PARTS = makeParticles(40, 11);
const params = [
  { key: 'proc', symbol: '', unit: '', min: 0, max: 2, step: 1, default: 0, kind: 'initial', options: ['isothermal', 'isobaric', 'isochoric'] },
  { key: 'nu', symbol: 'ν', unit: 'mol', min: 0.1, max: 2, step: 0.1, default: 1, kind: 'initial', decimals: 1 },
  { key: 'T0', symbol: 'T₀', unit: 'K', min: 200, max: 600, step: 10, default: 300, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'V0', symbol: 'V₀', unit: 'L', min: 5, max: 50, step: 1, default: 25, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'k', symbol: 'k', unit: '', min: 0.25, max: 3, step: 0.05, default: 2, kind: 'initial', decimals: 2 },
];

/** ν mol of monatomic ideal gas taken through an isoprocess: isothermal V → kV, the others T → kT. */
class GasModel {
  t = 0; ph = 0; s = 0; T = 0; V = 0; p = 0; A = 0; dU = 0; Q = 0; reason = ''; P = null; path = [];
  reset(P) {
    this.P = { ...P }; this.t = 0; this.ph = 0; this.reason = '';
    this.path = Array.from({ length: 41 }, (_, i) => { const s = this.state(i / 40); return [s.V, s.p]; });
    this.apply(0);
  }
  state(s) {
    const P = this.P, nuR = P.nu * R;
    let T = P.T0, V = P.V0;
    if (P.proc === 0) V = P.V0 * (1 + (P.k - 1) * s);
    else { T = P.T0 * (1 + (P.k - 1) * s); if (P.proc === 1) V = (P.V0 * T) / P.T0; }
    const p = (nuR * T) / (V * 1e-3) / 1000;
    const dU = 1.5 * nuR * (T - P.T0);
    const A = P.proc === 0 ? nuR * P.T0 * Math.log(V / P.V0) : P.proc === 1 ? ((nuR * P.T0) / P.V0) * (V - P.V0) : 0;
    return { T, V, p, dU, A, Q: dU + A };
  }
  apply(s) { Object.assign(this, this.state(s)); this.s = s; }
  /** The travelled part of the p–V path, built when drawn, so snapshots hold no arrays of their own. */
  get done() { return this.path.slice(0, Math.floor(this.s * 40) + 1).concat([[this.V, this.p]]); }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt); this.ph += Math.sqrt(this.T / 300) * dt * 0.45; this.apply(this.t / DUR);
    if (this.t >= DUR - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return [this.T, this.V, this.p, this.Q].every(Number.isFinite); }
  sample() { return { p: this.p, V: this.V, T: this.T, A: this.A, Q: this.Q, dU: this.dU }; }
  // `path` is fixed per run, so snapshots share it.
  clone() { return Object.assign(new GasModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { return this.reason ? text.msg.end(num(this.p, 1), num(this.V, 1), num(this.T, 0), this.Q >= 0, num(Math.abs(this.Q), 0), num(this.A, 0)) : ''; }
}

const LAW = ['pV = const', 'V / T = const', 'p / T = const'];

export default {
  id: 'gas-laws',
  params,
  noTape: true,
  presets: [
    { values: { proc: 0, nu: 1, T0: 300, V0: 25, k: 0.5 } },
    { values: { proc: 1, nu: 1, T0: 300, V0: 25, k: 1.5 } },
    { values: { proc: 2, nu: 2, T0: 300, V0: 20, k: 2 } },
  ],
  toggles: [],
  readouts: [
    { key: 'p', unit: 'kPa', decimals: 1, color: '--force' },
    { key: 'V', unit: 'L', decimals: 1, color: '--pos' },
    { key: 'T', unit: 'K', decimals: 0, color: '--acc' },
    { key: 'A', unit: 'J', decimals: 0, color: '--vel' },
    { key: 'Q', unit: 'J', decimals: 0 },
  ],
  graphs: [
    { id: 'p', yLabel: 'p', unit: 'kPa', series: [{ key: 'p', color: '--force' }] },
    { id: 'T', yLabel: 'T', unit: 'K', series: [{ key: 'T', color: '--acc' }] },
  ],
  createModel: () => new GasModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    const Vmax = Math.max(...m.path.map((q) => q[0])) * 1.02;
    const x0 = X(0.6), x1 = X(3.6), yb = Y(0.9), H = 4 * S * (m.V / Vmax), yt = yb - H, pis = 0.22 * S;
    ctx.save(); ctx.fillStyle = c.accent; ctx.globalAlpha = 0.08; ctx.fillRect(x0, yt, x1 - x0, H); ctx.restore();
    drawParticles(ctx, x0 + 2, yt + 2, x1 - x0 - 4, H - 4, PARTS, m.ph, c, 3);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.moveTo(x0, Y(5.4)); ctx.lineTo(x0, yb); ctx.lineTo(x1, yb); ctx.lineTo(x1, Y(5.4)); ctx.stroke();
    ctx.fillStyle = c.track; ctx.fillRect(x0 + 1, yt - pis, x1 - x0 - 2, pis); ctx.strokeRect(x0 + 1, yt - pis, x1 - x0 - 2, pis);
    ctx.beginPath(); ctx.moveTo((x0 + x1) / 2, yt - pis); ctx.lineTo((x0 + x1) / 2, Math.min(yt - pis, Y(5.7))); ctx.stroke();
    if (p.proc === 2) { ctx.fillStyle = c.fg; for (const sx of [x0, x1]) { const d = sx === x0 ? 1 : -1; ctx.beginPath(); ctx.moveTo(sx, yt - pis - 2); ctx.lineTo(sx + d * 9, yt - pis - 2); ctx.lineTo(sx, yt - pis - 11); ctx.fill(); } }
    ctx.restore();
    const running = m.t > 0 && !m.reason;
    if (running && p.k > 1) flame(ctx, x0 + 8, Y(0.3), x1 - x0 - 16, m.t, c);
    if (running && p.k < 1) { ctx.save(); ctx.strokeStyle = c.vel; ctx.lineWidth = 1.5; ctx.strokeRect(x0 + 6, Y(0.75), x1 - x0 - 12, 0.4 * S); ctx.restore(); hint(ctx, text.draw.cooling, (x0 + x1) / 2, Y(0.2), c, 'center'); }
    // Caption beside the piston rod, not across it; the units just under the plot's V axis, not adrift below it.
    if (p.proc === 0) hint(ctx, text.draw.thermostat, (x0 + x1) / 2 - 8, Y(5.75), c, 'right');
    plotBox(ctx, X(5.4), Y(5.2), X(9.6) - X(5.4), Y(1.1) - Y(5.2), m.path, m.done, c, 'V', 'p');
    hint(ctx, 'p, kPa;  V, L', X(5.4), Y(1.1) + 14, c);
    label(ctx, `${LAW[p.proc]}:  p = ${num(m.p, 1)} kPa,  V = ${num(m.V, 1)} L`, 12, 20, c, 'left');
    hint(ctx, `Q = ΔU + A:  ${num(m.Q, 0)} = ${num(m.dU, 0)} + ${num(m.A, 0)} J`, 12, 46, c);
  },
};

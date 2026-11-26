import { num } from '../../core/format.js';
import { ink, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { thermometer } from '../thermo.js';
import { drift, wire } from '../elec.js';

const C_W = 4200;
const params = [
  { key: 'U', symbol: 'U', unit: 'V', min: 110, max: 240, step: 1, default: 220, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'R', symbol: 'R', unit: 'Ω', min: 20, max: 80, step: 1, default: 40, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'm', symbol: 'm', unit: 'kg', min: 0.2, max: 2, step: 0.1, default: 1, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'T0', symbol: 't₀', unit: '°C', min: 5, max: 40, step: 1, default: 20, kind: 'initial', decimals: 0 },
  { key: 'eta', symbol: 'η', unit: '%', min: 50, max: 100, step: 1, default: 80, kind: 'initial', decimals: 0 },
];

/**
 * Electric kettle: the spiral releases Q = I²Rt, a share η of it heats the water to 100 °C. Time in minutes.
 * A constant η only holds for a short heating, so the ranges keep P ≥ 151 W and m ≤ 2 kg: the slowest run is 176 min.
 */
class KettleModel {
  t = 0; T = 0; Q = 0; Qw = 0; I = 0; Pw = 0; end = 0; ph = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.ph = 0; this.reason = ''; this.I = P.U / P.R; this.Pw = this.I * this.I * P.R; this.end = (C_W * P.m * (100 - P.T0)) / ((P.eta / 100) * this.Pw) / 60; this.calc(); }
  calc() { const P = this.P; this.Q = (this.Pw * this.t * 60) / 1000; this.Qw = this.Q * (P.eta / 100); this.T = P.T0 + (this.Qw * 1000) / (C_W * P.m); }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(this.end, this.t + dt); this.calc(); this.ph += this.I * dt * 6;
    if (this.t >= this.end - 1e-9) { this.reason = 'boil'; this.T = 100; return false; }
    return true;
  }
  isValid() { return [this.T, this.Q].every(Number.isFinite); }
  sample() { return { T: this.T, Q: this.Q, P: this.Pw, I: this.I }; }
  clone() { return Object.assign(new KettleModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { return this.reason ? text.msg.end(num(this.t, 2), num(this.Q, 1), num(this.Qw, 1)) : ''; }
}

export default {
  id: 'joule',
  params,
  noTape: true,
  timeUnit: 'min',
  presets: [
    { values: { U: 220, R: 40, m: 1, T0: 20, eta: 80 } },
    { values: { U: 220, R: 40, m: 2, T0: 20, eta: 100 } },
    { values: { U: 110, R: 40, m: 1, T0: 20, eta: 80 } },
  ],
  toggles: [],
  readouts: [
    { key: 'T', unit: '°C', decimals: 1, color: '--force' },
    { key: 'Q', unit: 'kJ', decimals: 1, color: '--acc' },
    { key: 'P', unit: 'W', decimals: 0, color: '--pos' },
    { key: 'I', unit: 'A', decimals: 2, color: '--vel' },
  ],
  graphs: [
    { id: 'T', yLabel: 't', unit: '°C', series: [{ key: 'T', color: '--force' }] },
    { id: 'Q', yLabel: 'Q', unit: 'kJ', series: [{ key: 'Q', color: '--acc' }] },
  ],
  createModel: () => new KettleModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),

  draw({ ctx, view, model: m, params: p, colors: c }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    const x0 = X(3.2), x1 = X(6.8), yb = Y(1.3), lvl = Y(1.3 + 0.9 + 1.1 * Math.min(1, p.m / 2));
    ctx.save(); ctx.fillStyle = c.accent; ctx.globalAlpha = 0.28; ctx.fillRect(x0, lvl, x1 - x0, yb - lvl);
    ctx.fillStyle = c.force; ctx.globalAlpha = 0.3 * Math.max(0, (m.T - p.T0) / Math.max(1, 100 - p.T0)); ctx.fillRect(x0, lvl, x1 - x0, yb - lvl); ctx.restore();
    // Heating spiral near the bottom, glowing as it carries current.
    const coil = (i) => [x0 + 14 + (i / 40) * (x1 - x0 - 28), yb - 0.3 * S + Math.sin(i * 1.2) * 0.12 * S];
    ctx.save(); ctx.strokeStyle = m.t > 0 && !m.reason ? c.force : c.fg; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 40; i++) { const [xx, yy] = coil(i); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.stroke(); ctx.restore();
    if (m.T > 85 && !m.reason) { ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1; for (let i = 0; i < 9; i++) { const ph = (m.t * 8 + i / 9) % 1, bx = x0 + 14 + ((i * 41) % 100) / 100 * (x1 - x0 - 28), by = yb - 0.3 * S - ph * (yb - lvl - 0.4 * S); ctx.beginPath(); ctx.arc(bx, by, 2 + ph * 2, 0, Math.PI * 2); ctx.stroke(); } ctx.restore(); }
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.moveTo(x0, Y(4.6)); ctx.lineTo(x0, yb); ctx.lineTo(x1, yb); ctx.lineTo(x1, Y(4.6)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, Y(4.2)); ctx.quadraticCurveTo(X(7.8), Y(4.2), X(7.6), Y(2.6)); ctx.lineTo(x1, Y(2.3)); ctx.stroke();
    ctx.restore();
    // Leads from the coil's two ends, nested so they never cross: the near end to the right terminal, the far end round the outside to the left one.
    const a = coil(0), b = coil(40);
    wire(ctx, [a, [a[0], Y(0.7)], [X(1.4), Y(0.7)], [X(1.4), Y(2)]], c); wire(ctx, [b, [b[0], Y(0.5)], [X(1), Y(0.5)], [X(1), Y(2)]], c);
    if (m.t > 0 && !m.reason) drift(ctx, [[X(1.4), Y(2)], [X(1.4), Y(0.7)], [a[0], Y(0.7)], a], m.ph, c);
    ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.fillRect(X(0.7), Y(2.6), X(1.7) - X(0.7), Y(2) - Y(2.6)); ctx.strokeRect(X(0.7), Y(2.6), X(1.7) - X(0.7), Y(2) - Y(2.6)); ctx.restore();
    hint(ctx, `${num(p.U, 0)} V`, X(1.2), Y(2.9), c, 'center');
    thermometer(ctx, X(8.6), Y(5.2), Y(1.6) - Y(5.2), (m.T + 5) / 110, `${num(m.T, 1)} °C`, c);
    label(ctx, `Q = I²Rt,  P = U²/R = ${num(m.Pw, 0)} W`, 12, 20, c, 'left');
  },
};

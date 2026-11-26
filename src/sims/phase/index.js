import { num } from '../../core/format.js';
import { ink, label } from '../../ui/canvas.js';
import { flame, thermometer } from '../thermo.js';

const C_ICE = 2100, LAM = 330000, C_W = 4200, L_V = 2300000;
const params = [
  { key: 'm', symbol: 'm', unit: 'kg', min: 0.1, max: 2, step: 0.05, default: 0.5, kind: 'initial', decimals: 2, color: '--pos' },
  { key: 'P', symbol: 'P', unit: 'kW', min: 0.5, max: 3, step: 0.1, default: 1, kind: 'initial', decimals: 1, color: '--force' },
  { key: 'T0', symbol: 't₀', unit: '°C', min: -40, max: 0, step: 1, default: -20, kind: 'initial', decimals: 0, color: '--vel' },
];
const marks = (P) => { const q1 = C_ICE * P.m * -P.T0, q2 = q1 + LAM * P.m, q3 = q2 + C_W * P.m * 100; return [q1, q2, q3, q3 + L_V * P.m]; };

/** Ice heated at constant power: warm the ice, melt it at 0 °C, warm the water, boil it away at 100 °C. Time in minutes. */
class PhaseModel {
  t = 0; Q = 0; T = 0; fi = 1; fw = 0; fs = 0; reason = ''; P = null; q = [];
  reset(P) { this.P = { ...P }; this.t = 0; this.reason = ''; this.q = marks(P); this.calc(); }
  calc() {
    const P = this.P, [q1, q2, q3, q4] = this.q, Q = (this.Q = Math.min(q4, P.P * 1000 * 60 * this.t));
    if (Q < q1) { this.T = P.T0 + Q / (C_ICE * P.m); this.fi = 1; this.fw = 0; this.fs = 0; }
    else if (Q < q2) { this.T = 0; this.fi = 1 - (Q - q1) / (LAM * P.m); this.fw = 1 - this.fi; this.fs = 0; }
    else if (Q < q3) { this.T = (Q - q2) / (C_W * P.m); this.fi = 0; this.fw = 1; this.fs = 0; }
    else { this.T = 100; this.fi = 0; this.fs = Math.min(1, (Q - q3) / (L_V * P.m)); this.fw = 1 - this.fs; }
  }
  step(dt) {
    if (this.reason) return false;
    const end = this.q[3] / (this.P.P * 60000);
    this.t = Math.min(end, this.t + dt);
    if (this.t >= end - 1e-9) this.reason = 'end';
    this.calc(); return !this.reason;
  }
  isValid() { return [this.T, this.Q].every(Number.isFinite); }
  sample() { return { T: this.T, Q: this.Q / 1000, fi: this.fi * 100, fw: this.fw * 100, fs: this.fs * 100 }; }
  // `q` (the four stage boundaries) is fixed per run, so snapshots share it.
  clone() { return Object.assign(new PhaseModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { return this.reason ? text.msg.end(num(this.Q / 1000, 0), num(this.t, 2)) : ''; }
}

export default {
  id: 'phase',
  params,
  noTape: true,
  timeUnit: 'min',
  presets: [
    { values: { m: 0.5, P: 1, T0: -20 } },
    { values: { m: 1, P: 2, T0: -10 } },
    { values: { m: 0.2, P: 1.5, T0: 0 } },
  ],
  toggles: [],
  readouts: [
    { key: 'T', unit: '°C', decimals: 1, color: '--force' },
    { key: 'Q', unit: 'kJ', decimals: 0, color: '--acc' },
    { key: 'fw', unit: '%', decimals: 0, color: '--vel' },
    { key: 'fs', unit: '%', decimals: 0 },
  ],
  graphs: [
    { id: 'T', yLabel: 't', unit: '°C', series: [{ key: 'T', color: '--force' }] },
    { id: 'f', yLabel: '%', unit: '%', range: [0, 100], series: [{ key: 'fi', color: '--pos' }, { key: 'fw', color: '--vel' }, { key: 'fs', color: '--acc' }] },
  ],
  createModel: () => new PhaseModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),

  draw({ ctx, view, model: m, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    const x0 = X(2.4), x1 = X(6.6), yb = Y(1.4), fill = m.fw * 2.2 * S;
    ctx.save();
    if (fill > 1) { ctx.fillStyle = c.accent; ctx.globalAlpha = 0.28; ctx.fillRect(x0 + 2, yb - fill, x1 - x0 - 4, fill); }
    ctx.globalAlpha = 1; ctx.fillStyle = c.surface; ctx.strokeStyle = c.fg; ctx.lineWidth = 1.25;
    const n = Math.ceil(m.fi * 9 - 1e-9), cube = 0.55 * S * Math.max(0.55, Math.cbrt(m.fi || 0.01) * 0.95);
    // Three stacks spread across the inside of the vessel, the outer ones 10 px from its walls.
    for (let i = 0; i < n; i++) { const cx = x0 + 10 + (i % 3) * (x1 - x0 - 20 - cube) / 2, cy = yb - 4 - cube - Math.floor(i / 3) * cube * 1.05 - (fill > cube ? fill - cube * 1.2 : 0) * 0.5; ctx.fillRect(cx, cy, cube, cube); ctx.strokeRect(cx, cy, cube, cube); }
    if (m.T >= 100 && m.fw > 0 && !m.reason) {
      ctx.strokeStyle = c.fg; ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) { const ph = (m.t * 2.5 + i / 8) % 1, bx = x0 + 12 + ((i * 53) % 100) / 100 * (x1 - x0 - 24), by = yb - 6 - ph * (fill - 10); ctx.beginPath(); ctx.arc(bx, by, 2.5 + ph * 2, 0, Math.PI * 2); ctx.stroke(); }
      ctx.strokeStyle = c.muted; ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) { const sx = x0 + (i + 0.6) * (x1 - x0) / 4.2, top = yb - 3.3 * S; ctx.beginPath(); ctx.moveTo(sx, top); for (let k = 1; k <= 6; k++) ctx.lineTo(sx + Math.sin(m.t * 6 + k + i) * 5, top - k * 7); ctx.stroke(); }
    }
    ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.moveTo(x0, Y(4.2)); ctx.lineTo(x0, yb); ctx.lineTo(x1, yb); ctx.lineTo(x1, Y(4.2)); ctx.stroke();
    ctx.fillStyle = c.track; ctx.fillRect(X(2), Y(1.4), X(7) - X(2), 0.3 * S); ctx.strokeRect(X(2), Y(1.4), X(7) - X(2), 0.3 * S);
    ctx.restore();
    if (!m.reason && m.t > 0) flame(ctx, X(2.6), Math.max(Y(0.75), Y(1.1) + 18), X(6.4) - X(2.6), m.t * 10, c); // tips (≤ 16 px) stay under the plate
    thermometer(ctx, X(8.2), Y(5.2), Y(1.5) - Y(5.2), (m.T + 45) / 150, `${num(m.T, 1)} °C`, c);
    // Stage: 0 ice warming, 1 ice melting, 2 water warming, 3 water boiling.
    const stage = m.Q < m.q[0] ? 0 : m.Q < m.q[1] ? 1 : m.Q < m.q[2] ? 2 : 3;
    label(ctx, text.draw.stages[stage], 12, 20, c, 'left');
  },
};

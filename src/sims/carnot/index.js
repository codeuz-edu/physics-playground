import { num } from '../../core/format.js';
import { drawHatch, ink, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { R, drawParticles, makeParticles, plotBox } from '../thermo.js';

const NU = 0.2, V1 = 5, STAGE = 3; // mol, L, s per stage
const PARTS = makeParticles(36, 23);
const params = [
  { key: 'T1', symbol: 'T₁', unit: 'K', min: 400, max: 1200, step: 10, default: 600, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'T2', symbol: 'T₂', unit: 'K', min: 200, max: 380, step: 10, default: 300, kind: 'initial', decimals: 0, color: '--vel' },
  { key: 'Q1', symbol: 'Q₁', unit: 'J', min: 100, max: 2000, step: 50, default: 1000, kind: 'initial', decimals: 0, color: '--acc' },
];

/** Carnot cycle of 0.2 mol monatomic ideal gas: two isotherms and two adiabats (TV^(2/3) = const). */
class CarnotModel {
  t = 0; ph = 0; k = 0; s = 0; V = 0; T = 0; p = 0; A = 0; reason = ''; P = null; Vs = []; path = [];
  reset(P) {
    this.P = { ...P }; this.t = 0; this.ph = 0; this.reason = '';
    const V2 = V1 * Math.exp(P.Q1 / (NU * R * P.T1)), f = Math.pow(P.T1 / P.T2, 1.5);
    this.Vs = [V1, V2, V2 * f, V1 * f];
    this.path = [];
    for (let k = 0; k < 4; k++) for (let i = 0; i <= 20; i++) { const s = this.at(k, i / 20); this.path.push([s.V, s.p]); }
    this.apply();
  }
  at(k, s) {
    const P = this.P, a = this.Vs[k], b = this.Vs[(k + 1) % 4], V = a * Math.pow(b / a, s);
    const Ta = k === 0 || k === 1 ? P.T1 : P.T2;
    const T = k % 2 === 0 ? Ta : Ta * Math.pow(a / V, 2 / 3);
    const W = [0, P.Q1, P.Q1 + 1.5 * NU * R * (P.T1 - P.T2), P.Q1 * (1 - P.T2 / P.T1) + 1.5 * NU * R * (P.T1 - P.T2)][k]
      + (k % 2 === 0 ? NU * R * Ta * Math.log(V / a) : 1.5 * NU * R * (Ta - T));
    return { V, T, p: (NU * R * T) / V, W };
  }
  apply() {
    const k = Math.min(3, Math.floor(this.t / STAGE)), s = Math.min(1, (this.t - k * STAGE) / STAGE), st = this.at(k, s);
    this.k = k; this.V = st.V; this.T = st.T; this.p = st.p; this.A = this.reason ? this.P.Q1 * (1 - this.P.T2 / this.P.T1) : st.W;
    this.s = s;
  }
  /** The travelled part of the cycle on the p–V diagram, built when drawn, so snapshots hold no arrays of their own. */
  get done() { return this.path.slice(0, this.k * 21 + Math.floor(this.s * 20) + 1).concat([[this.V, this.p]]); }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(4 * STAGE, this.t + dt); this.ph += Math.sqrt(this.T / 300) * dt * 0.45;
    if (this.t >= 4 * STAGE - 1e-9) this.reason = 'end';
    this.apply(); return !this.reason;
  }
  isValid() { return [this.V, this.T, this.p, this.A].every(Number.isFinite); }
  sample() { return { p: this.p, V: this.V, T: this.T, A: this.A }; }
  // `Vs` and `path` are fixed per run, so snapshots share them.
  clone() { return Object.assign(new CarnotModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const P = this.P, eta = 1 - P.T2 / P.T1;
    return text.msg.end(num(P.Q1, 0), num(P.Q1 * (1 - eta), 0), num(P.Q1 * eta, 0), num(eta * 100, 1));
  }
}

export default {
  id: 'carnot',
  params,
  noTape: true,
  presets: [
    { values: { T1: 600, T2: 300, Q1: 1000 } },
    { values: { T1: 800, T2: 300, Q1: 1200 } },
    { values: { T1: 500, T2: 350, Q1: 800 } },
  ],
  toggles: [],
  readouts: [
    { key: 'p', unit: 'kPa', decimals: 1, color: '--force' },
    { key: 'V', unit: 'L', decimals: 1, color: '--pos' },
    { key: 'T', unit: 'K', decimals: 0, color: '--acc' },
    { key: 'A', unit: 'J', decimals: 0, color: '--vel' },
  ],
  graphs: [
    { id: 'T', yLabel: 'T', unit: 'K', series: [{ key: 'T', color: '--acc' }] },
    { id: 'A', yLabel: 'A', unit: 'J', series: [{ key: 'A', color: '--vel' }] },
  ],
  createModel: () => new CarnotModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    const Vmax = Math.max(...m.Vs) * 1.02, x0 = X(0.7), x1 = X(3.5), yb = Y(1.1), H = 3.9 * S * (m.V / Vmax), yt = yb - H, pis = 0.22 * S;
    ctx.save(); ctx.fillStyle = c.accent; ctx.globalAlpha = 0.08; ctx.fillRect(x0, yt, x1 - x0, H); ctx.restore();
    drawParticles(ctx, x0 + 2, yt + 2, x1 - x0 - 4, H - 4, PARTS, m.ph, c, 3);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.moveTo(x0, Y(5.4)); ctx.lineTo(x0, yb); ctx.lineTo(x1, yb); ctx.lineTo(x1, Y(5.4)); ctx.stroke();
    ctx.fillStyle = c.track; ctx.fillRect(x0 + 1, yt - pis, x1 - x0 - 2, pis); ctx.strokeRect(x0 + 1, yt - pis, x1 - x0 - 2, pis);
    ctx.beginPath(); ctx.moveTo((x0 + x1) / 2, yt - pis); ctx.lineTo((x0 + x1) / 2, Math.min(yt - pis, Y(5.7))); ctx.stroke();
    // What the cylinder stands on: the heater, the cooler, or an insulating pad.
    const k = m.reason ? -1 : m.k, py = Y(0.95), ph = 0.5 * S;
    if (k === 0 || k === 2) { ctx.strokeStyle = k === 0 ? c.force : c.vel; ctx.lineWidth = 2; ctx.strokeRect(X(0.5), py, X(3.7) - X(0.5), ph); }
    else drawHatch(ctx, X(0.5), py, X(3.7) - X(0.5), ph, c.hatch, 0, 7);
    ctx.restore();
    hint(ctx, k === 0 ? text.draw.heater(num(p.T1, 0)) : k === 2 ? text.draw.cooler(num(p.T2, 0)) : text.draw.insulation, (x0 + x1) / 2, Y(0.2), c, 'center');
    plotBox(ctx, X(5.2), Y(5.2), X(9.6) - X(5.2), Y(1.1) - Y(5.2), m.path, m.done, c, 'V', 'p', !!m.reason);
    // The name of the stage goes under the diagram; on a narrow stage it is longer than the diagram is wide,
    // so there it takes a line of its own below the heater's caption.
    const stage = m.reason ? text.draw.area : text.draw.stages[m.k];
    ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; const fitsUnder = ctx.measureText(stage).width <= view.width - X(5.2) - 6; ctx.restore();
    hint(ctx, stage, X(5.2), fitsUnder ? Y(0.55) : Y(0.2) + 22, c);
    label(ctx, `η = 1 − T₂/T₁ = ${num((1 - p.T2 / p.T1) * 100, 1)} %`, 12, 20, c, 'left');
  },
};

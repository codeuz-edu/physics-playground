import { num } from '../../core/format.js';
import { fillSub, ink, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { thermometer } from '../thermo.js';

const DUR = 4, TAU = 0.6; // minutes
// Specific heat of the hot body, J/(kg·K): hot water, copper, aluminium, iron.
const BODY = [4200, 400, 920, 460];
const params = [
  { key: 'body', symbol: '', unit: '', min: 0, max: 3, step: 1, default: 0, kind: 'initial', options: ['water', 'copper', 'aluminium', 'iron'] },
  { key: 'm1', symbol: 'm₁', unit: 'kg', min: 0.05, max: 2, step: 0.05, default: 0.5, kind: 'initial', decimals: 2, color: '--force' },
  { key: 'T1', symbol: 't₁', unit: '°C', min: 30, max: 100, step: 1, default: 80, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'm2', symbol: 'm₂', unit: 'kg', min: 0.1, max: 3, step: 0.05, default: 1, kind: 'initial', decimals: 2, color: '--vel' },
  { key: 'T2', symbol: 't₂', unit: '°C', min: 0, max: 30, step: 1, default: 20, kind: 'initial', decimals: 0, color: '--vel' },
];

/**
 * Hot body in cold water inside a calorimeter: both relax to θ with one time constant, so c₁m₁Δt₁ = c₂m₂Δt₂ at every instant.
 * The slider ranges meet at 30 °C, so the body is never colder than the water (t₁ ≥ t₂).
 */
class MixModel {
  t = 0; a = 0; b = 0; th = 0; Q = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.reason = ''; const c1 = BODY[P.body] * P.m1, c2 = 4200 * P.m2; this.th = (c1 * P.T1 + c2 * P.T2) / (c1 + c2); this.calc(); }
  calc() {
    const P = this.P, e = this.reason ? 0 : Math.exp(-this.t / TAU);
    this.a = this.th + (P.T1 - this.th) * e; this.b = this.th + (P.T2 - this.th) * e;
    this.Q = (BODY[P.body] * P.m1 * (P.T1 - this.a)) / 1000;
  }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt);
    if (this.t >= DUR - 1e-9) this.reason = 'end';
    this.calc(); return !this.reason;
  }
  isValid() { return [this.a, this.b, this.Q].every(Number.isFinite); }
  sample() { return { a: this.a, b: this.b, Q: this.Q }; }
  clone() { return Object.assign(new MixModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    if (this.P.T1 <= this.P.T2) return text.msg.equal(num(this.th, 1));
    return text.msg.end(num(this.th, 1), text.msg.bodies[this.P.body], num(this.Q, 2));
  }
}

export default {
  id: 'heat-balance',
  params,
  noTape: true,
  timeUnit: 'min',
  presets: [
    { values: { body: 0, m1: 0.5, T1: 80, m2: 1, T2: 20 } },
    { values: { body: 1, m1: 0.5, T1: 100, m2: 1, T2: 20 } },
    { values: { body: 2, m1: 0.5, T1: 100, m2: 1, T2: 20 } },
  ],
  toggles: [],
  readouts: [
    { key: 'a', unit: '°C', decimals: 1, color: '--force' },
    { key: 'b', unit: '°C', decimals: 1, color: '--vel' },
    { key: 'Q', unit: 'kJ', decimals: 2, color: '--acc' },
  ],
  graphs: [
    { id: 'T', yLabel: 't', unit: '°C', series: [{ key: 'a', color: '--force' }, { key: 'b', color: '--vel' }] },
    { id: 'Q', yLabel: 'Q', unit: 'kJ', series: [{ key: 'Q', color: '--acc' }] },
  ],
  createModel: () => new MixModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y);
    const water = p.body === 0, lvl = Y(3.7);
    ctx.save();
    ctx.fillStyle = c.accent; ctx.globalAlpha = 0.28; ctx.fillRect(X(2.6), lvl, X(7.4) - X(2.6), Y(1.0) - lvl);
    // The hot part: a metal block, or a layer of hot water that thins out as the two mix.
    ctx.globalAlpha = 1; ctx.fillStyle = c.force;
    if (water) { ctx.globalAlpha = 0.35 * Math.max(0, (m.a - m.th) / Math.max(1, p.T1 - m.th)); ctx.fillRect(X(2.6), lvl, X(7.4) - X(2.6), (Y(1.0) - lvl) * 0.4); }
    else { ctx.globalAlpha = 0.15 + 0.55 * Math.max(0, Math.min(1, (m.a - 15) / 90)); const s = 0.45 + 0.35 * Math.cbrt(p.m1); ctx.fillRect(X(5 - s), Y(1.05 + 2 * s * 0.75), X(5 + s) - X(5 - s), Y(1.05) - Y(1.05 + 2 * s * 0.75)); ctx.globalAlpha = 1; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.strokeRect(X(5 - s), Y(1.05 + 2 * s * 0.75), X(5 + s) - X(5 - s), Y(1.05) - Y(1.05 + 2 * s * 0.75)); }
    ctx.restore();
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    for (const [a, b, d] of [[2.6, 7.4, 1.0], [2.25, 7.75, 0.65]]) { ctx.beginPath(); ctx.moveTo(X(a), Y(4.7)); ctx.lineTo(X(a), Y(d)); ctx.lineTo(X(b), Y(d)); ctx.lineTo(X(b), Y(4.7)); ctx.stroke(); }
    ctx.restore();
    hint(ctx, text.draw.calorimeter, X(5), Y(0.3), c, 'center');
    // Each reading above its thermometer (with a real subscript), not beside the column, where on a phone it ran over the calorimeter or off the stage.
    for (const [x, t, name] of [[X(1.0), m.a, 't₁'], [X(8.3), m.b, 't₂']]) {
      thermometer(ctx, x, Y(5), Y(1.6) - Y(5), (t + 10) / 120, '', c);
      ctx.save(); ctx.fillStyle = c.fg; ctx.font = '600 13px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; fillSub(ctx, `${name} = ${num(t, 1)} °C`, x, Y(5) - 8); ctx.restore();
    }
    label(ctx, `θ = (c₁m₁t₁ + c₂m₂t₂) / (c₁m₁ + c₂m₂) = ${num(m.th, 1)} °C`, 12, 20, c, 'left');
  },
};

import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';

const PER = 2; // screen seconds per half-life
// Half-life T of each isotope and the unit it is given in, in the order of the menu (I-131, Co-60, Rn-222, C-14).
const ISO = [[8.02, 'day'], [5.27, 'year'], [3.82, 'day'], [5730, 'year']];
const params = [
  { key: 'iso', symbol: '', unit: '', min: 0, max: 3, step: 1, default: 0, kind: 'initial', options: ['iodine131', 'cobalt60', 'radon222', 'carbon14'] },
  { key: 'N0', symbol: 'N₀', unit: '', min: 100, max: 10000, step: 100, default: 1000, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'nT', symbol: 't/T', unit: '', min: 1, max: 6, step: 1, default: 3, kind: 'initial', decimals: 0, color: '--acc' },
];
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
const LIFE = (() => { const r = rnd(42); return Array.from({ length: 400 }, () => -Math.log(1 - r()) / Math.LN2); })(); // decay times in units of T

/** N = N₀·2^(−t/T); the grid of 400 atoms decays at random with the same half-life, so counts scatter around the curve. Time axis in T. */
class DecayModel {
  t = 0; N = 0; A = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.reason = ''; this.calc(); }
  calc() { this.N = this.P.N0 * Math.pow(2, -this.t); this.A = 100 * Math.pow(2, -this.t); }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(this.P.nT, this.t + dt / PER); this.calc();
    if (this.t >= this.P.nT - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.N); }
  sample() { return { N: this.N, A: this.A }; }
  clone() { return Object.assign(new DecayModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const [T, u] = ISO[this.P.iso];
    return text.msg.end(this.P.nT, num(this.P.nT * T, 2), text.msg.periodUnit[u], num(this.N, 0), num(this.A, 1));
  }
}

export default {
  id: 'decay',
  params,
  timeUnit: 'T',
  noTape: true,
  presets: [
    { values: { iso: 0, N0: 1000, nT: 3 } },
    { values: { iso: 1, N0: 1000, nT: 2 } },
    { values: { iso: 3, N0: 1000, nT: 1 } },
  ],
  toggles: [],
  readouts: [
    { key: 'N', unit: '', decimals: 0, color: '--pos' },
    { key: 'A', unit: '%', decimals: 1, color: '--force' },
  ],
  graphs: [{ id: 'N', yLabel: 'N', unit: '', series: [{ key: 'N', color: '--pos' }] }],
  createModel: () => new DecayModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), cols = 25, rows = 16, x0 = X(1.2), y0 = Y(5.4), cell = Math.min((X(8.8) - X(1.2)) / cols, (Y(0.6) - Y(5.4)) / rows);
    let left = 0;
    for (let i = 0; i < LIFE.length; i++) {
      const alive = LIFE[i] > m.t; if (alive) left++;
      ctx.save(); ctx.fillStyle = alive ? c.force : c.muted; ctx.globalAlpha = alive ? 1 : 0.35; ctx.beginPath(); ctx.arc(x0 + (i % cols + 0.5) * cell, y0 + (Math.floor(i / cols) + 0.5) * cell, cell * 0.32, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    hint(ctx, text.draw.left(LIFE.length, left), x0, y0 + rows * cell + 14, c);
    label(ctx, `N = N₀·2^(−t/T) = ${num(m.N, 0)}`, 12, 20, c, 'left');
  },
};

import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { wlColor } from '../optics.js';

// The run: the beam reaches the grating (TA s), then the wavelength rises from 380 nm to λ and the orders swing out.
const TA = 0.6, DUR = 3.4, LAM0 = 380, R2D = 180 / Math.PI;
const params = [
  { key: 'N', symbol: 'N', unit: '1/mm', min: 100, max: 1200, step: 50, default: 500, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'lam', symbol: 'λ', unit: 'nm', min: LAM0, max: 750, step: 5, default: 600, kind: 'initial', decimals: 0, color: '--acc' },
];
/** Orders k = 0 … k_max with sin φ = kλ/d < 1 (an order at exactly 90° would run along the grating, so it does not count). */
const solve = (N, lam) => {
  const d = 1e6 / N, kmax = Math.max(0, Math.ceil(d / lam - 1e-9) - 1);
  return { d, kmax, phi: Array.from({ length: kmax + 1 }, (_, k) => Math.asin((k * lam) / d) * R2D) };
};

/** A narrow beam hits the grating; the orders k = 0, ±1, … leave at sin φ = kλ/d while λ sweeps up to the chosen value. */
class GratingModel {
  t = 0; lam = LAM0; g = null; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.reason = ''; this.tune(); }
  tune() {
    const u = Math.max(0, Math.min(1, (this.t - TA) / (DUR - TA)));
    this.lam = u >= 1 ? this.P.lam : LAM0 + (this.P.lam - LAM0) * u; this.g = solve(this.P.N, this.lam);
  }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt);
    if (this.t >= DUR - 1e-9) { this.t = DUR; this.tune(); this.reason = 'end'; return false; }
    this.tune();
    return true;
  }
  isValid() { return Number.isFinite(this.lam); }
  sample() { const ph = this.g.phi; return { lam: this.lam, d: this.g.d / 1000, phi1: ph[1] ?? NaN, phi2: ph[2] ?? NaN, phi3: ph[3] ?? NaN, kmax: this.g.kmax }; }
  clone() { return Object.assign(new GratingModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const g = this.g, d = num(g.d / 1000, 2);
    return g.kmax >= 1 ? text.msg.orders(d, num(g.phi[1], 1), g.kmax, 2 * g.kmax + 1) : text.msg.centralOnly(d);
  }
}

export default {
  id: 'grating',
  params,
  presets: [
    { values: { N: 500, lam: 600 } },
    { values: { N: 300, lam: 500 } },
    { values: { N: 1000, lam: 700 } },
  ],
  toggles: [],
  readouts: [
    { key: 'lam', unit: 'nm', decimals: 0, color: '--acc' },
    { key: 'd', unit: 'μm', decimals: 2, color: '--pos' },
    { key: 'phi1', unit: '°', decimals: 1, color: '--force' },
    { key: 'kmax', unit: '', decimals: 0 },
  ],
  graphs: [{ id: 'angles', unit: '°', range: [0, 90], series: [{ key: 'phi1', color: '--force' }, { key: 'phi2', color: '--pos' }, { key: 'phi3', color: '--vel' }] }],
  noTape: true,
  createModel: () => new GratingModel(),
  worldBounds: () => ({ xMin: -1, xMax: 9, yMin: -4.2, yMax: 4.2 }),
  viewPadding: { left: 12, right: 12, top: 40, bottom: 12 },

  draw({ ctx, view, model: m, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), col = wlColor(m.lam), g = m.g, gx = 1.5, L = 6.5, sx = X(gx + L);
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(-0.8), Y(0)); ctx.lineTo(X(-0.8 + (gx + 0.8) * Math.min(1, m.t / TA)), Y(0)); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1; for (let y = -1.2; y <= 1.2; y += 0.12) { ctx.beginPath(); ctx.moveTo(X(gx), Y(y)); ctx.lineTo(X(gx), Y(y + 0.07)); ctx.stroke(); } ctx.restore();
    if (m.t >= TA - 1e-9) {
      // Colours already swept leave a faint spectrum for each order on the screen (marks just left of it).
      ctx.save(); ctx.globalAlpha = 0.6;
      for (let k = 1; (k * LAM0) / g.d < 1; k++) for (let l = LAM0; l <= m.lam + 1e-9; l += 5) {
        const sn = (k * l) / g.d; if (sn >= 1) break;
        const ey = Math.tan(Math.asin(sn)) * L; if (ey > 4) break;
        ctx.fillStyle = wlColor(l); for (const sgn of [1, -1]) ctx.fillRect(sx - 8, Y(sgn * ey) - 1.5, 6, 3);
      }
      ctx.restore();
      // The orders for the current wavelength; each beam ends on the screen at x = gx + L. An order is named on the
      // screen when its name has room (14 px from the last one); a beam that misses the screen is named at its end.
      const named = { 1: [Y(0), -1e9], '-1': [Y(0), -1e9] };
      for (let k = 0; k <= g.kmax; k++) for (const sgn of k ? [1, -1] : [1]) {
        const a = (sgn * g.phi[k]) / R2D, ey = Math.tan(a) * L, cl = Math.abs(ey) > 4 ? 4 / Math.abs(ey) : 1, kk = `k = ${sgn < 0 ? '−' : ''}${k}`, last = named[sgn];
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = k ? 1.75 : 2.5; ctx.globalAlpha = k ? 0.85 : 1; ctx.beginPath(); ctx.moveTo(X(gx), Y(0)); ctx.lineTo(X(gx + L * cl), Y(ey * cl)); ctx.stroke(); ctx.restore();
        if (cl === 1) { ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(sx, Y(ey), 5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); if (!k || Math.abs(Y(ey) - last[0]) >= 14) { hint(ctx, kk, sx + 10, Y(ey), c); last[0] = Y(ey); } }
        else { const ex = X(gx + L * cl); if (Math.abs(ex - last[1]) >= 46 &&ex + 44 < sx - 6) { hint(ctx, kk, ex + 6, Y(sgn * 4), c); last[1] = ex; } }
      }
    }
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, Y(4)); ctx.lineTo(sx, Y(-4)); ctx.stroke(); ctx.restore();
    // Names beside the grating (no beam is left of it) and above the screen (the orders are named right of it).
    hint(ctx, text.draw.grating, X(gx) - 8, Y(-1.05), c, 'right'); hint(ctx, text.draw.screen, sx, Y(4) - 16, c, 'center');
    label(ctx, `d sin φ = kλ:  d = ${num(g.d / 1000, 2)} μm,  λ = ${num(m.lam, 0)} nm`, 12, 20, c, 'left');
  },
};

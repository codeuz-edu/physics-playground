import { num } from '../../core/format.js';
import { drawArrow, ink, label, vectorLabel } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { resistor, wire } from '../elec.js';

const PERIODS = 3, SLOW = 2, W50 = 2 * Math.PI * 50; // one 50 Hz period lasts 2 s on screen
const params = [
  { key: 'U1', symbol: 'U₁', unit: 'V', min: 12, max: 380, step: 1, default: 220, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'N1', symbol: 'N₁', unit: '', min: 20, max: 2000, step: 10, default: 1000, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'N2', symbol: 'N₂', unit: '', min: 10, max: 2000, step: 1, default: 50, kind: 'initial', decimals: 0, color: '--vel' },
  { key: 'R', symbol: 'R', unit: 'Ω', min: 1, max: 5000, step: 1, default: 11, kind: 'initial', decimals: 0, color: '--pos' },
];
const solve = (P) => { const U2 = (P.U1 * P.N2) / P.N1, I2 = U2 / P.R; return { U2, I2, I1: (I2 * P.N2) / P.N1, k: P.N1 / P.N2, P: U2 * I2 }; };

/**
 * Ideal transformer at 50 Hz with a resistive load: U₁/U₂ = N₁/N₂, I₁U₁ = I₂U₂. Slow motion; time shown in ms.
 * u₁ = N₁ dΦ/dt, so the core flux Φ = −Φ_m cos ωt lags u₁ by a quarter period, Φ_m = √2 U₁ / (N₁ω).
 */
class TrModel {
  t = 0; ang = 0; u1 = 0; u2 = 0; phi = 0; s = null; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.ang = 0; this.reason = ''; this.s = solve(P); this.calc(); }
  calc() { const k = Math.SQRT2 * Math.sin(this.ang); this.u1 = this.P.U1 * k; this.u2 = this.s.U2 * k; this.phi = -((Math.SQRT2 * this.P.U1) / (this.P.N1 * W50)) * Math.cos(this.ang) * 1000; }
  step(dt) {
    if (this.reason) return false;
    this.ang = Math.min(2 * Math.PI * PERIODS, this.ang + (2 * Math.PI * dt) / SLOW); this.t = (this.ang / (2 * Math.PI)) * 20; this.calc();
    if (this.ang >= 2 * Math.PI * PERIODS - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.s.U2); }
  sample() { return { u1: this.u1, u2: this.u2, phi: this.phi, U2: this.s.U2, I1: this.s.I1, I2: this.s.I2 }; }
  clone() { return Object.assign(new TrModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { const s = this.s; return this.reason ? text.msg.end(num(s.U2, 1), num(s.I2, 2), num(s.I1, 2), num(s.k, 2), num(s.P, 0)) : ''; }
}

export default {
  id: 'transformer',
  params,
  timeUnit: 'ms',
  presets: [
    { values: { U1: 220, N1: 1000, N2: 50, R: 11 } },
    { values: { U1: 220, N1: 100, N2: 1000, R: 2200 } },
    { values: { U1: 220, N1: 440, N2: 24, R: 6 } },
  ],
  toggles: [],
  readouts: [
    { key: 'U2', unit: 'V', decimals: 1, color: '--vel' },
    { key: 'I1', unit: 'A', decimals: 2, color: '--force' },
    { key: 'I2', unit: 'A', decimals: 2, color: '--pos' },
  ],
  graphs: [
    { id: 'u', unit: 'V', series: [{ key: 'u1', color: '--force' }, { key: 'u2', color: '--vel' }] },
    { id: 'phi', unit: 'mWb', series: [{ key: 'phi', color: '--acc' }] },
  ],
  createModel: () => new TrModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),
  noTape: true, // a schematic: distances on it are not lengths

  draw({ ctx, view, model: m, params: p, colors: c }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    // Laminated core as a thick square frame.
    const cx0 = X(3.3), cx1 = X(6.7), cy0 = Y(5.2), cy1 = Y(1), th = 0.45 * S;
    ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.rect(cx0, cy0, cx1 - cx0, cy1 - cy0); ctx.rect(cx0 + th, cy0 + th, cx1 - cx0 - 2 * th, cy1 - cy0 - 2 * th); ctx.fill('evenodd'); ctx.stroke(); ctx.restore();
    const coil = (x, n, col) => {
      const k = Math.max(3, Math.min(16, Math.round(3 + Math.log2(n) * 1.3))), top = cy0 + th + 10, bot = cy1 - th - 10;
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2;
      for (let i = 0; i < k; i++) { const yy = top + ((i + 0.5) * (bot - top)) / k; ctx.beginPath(); ctx.ellipse(x + th / 2, yy, th / 2 + 7, 4, 0, 0, Math.PI * 2); ctx.stroke(); }
      ctx.restore(); return [top + (0.5 * (bot - top)) / k, bot - (0.5 * (bot - top)) / k]; // the first and the last turn, where the leads join
    };
    const [t1, b1] = coil(cx0, p.N1, c.force), [t2, b2] = coil(cx1 - th, p.N2, c.vel);
    // The leads run right up to the source's circle and to the ends of the load, whatever the scale.
    wire(ctx, [[cx0 - 7, t1], [X(1.4), t1], [X(1.4), Y(3.1) - 0.45 * S]], c); wire(ctx, [[cx0 - 7, b1], [X(1.4), b1], [X(1.4), Y(3.1) + 0.45 * S]], c);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(1.4), Y(3.1), 0.45 * S, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath();
    for (let k = 0; k <= 20; k++) { const xx = X(1.4) - 0.3 * S + (k / 20) * 0.6 * S, yy = Y(3.1) - Math.sin((k / 20) * Math.PI * 2) * 0.18 * S; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.stroke(); ctx.restore();
    hint(ctx, `~ ${num(p.U1, 0)} V`, X(1.4) - 0.55 * S, Y(3.1), c, 'right');
    wire(ctx, [[cx1 + 7, t2], [X(8.6), t2], [X(8.6), Y(3.1) - 17]], c); wire(ctx, [[cx1 + 7, b2], [X(8.6), b2], [X(8.6), Y(3.1) + 17]], c);
    resistor(ctx, X(8.6), Y(3.1), c, '', true, 34); hint(ctx, `R = ${num(p.R, 0)} Ω`, X(8.6) + 14, Y(3.1), c);
    hint(ctx, `N₁ = ${num(p.N1, 0)}`, cx0 + th / 2, cy1 + 14, c, 'center'); hint(ctx, `N₂ = ${num(p.N2, 0)}`, cx1 - th / 2, cy1 + 14, c, 'center');
    // Flux in the core: Φ = −Φ_m cos ωt lags u₁ by a quarter period and reverses every half period. The dashed loop
    // brightens with |Φ|; arrows on the upper and lower limbs show which way it goes round (clockwise for Φ > 0).
    const f = -Math.cos(m.ang), ox0 = cx0 + th / 2, oy0 = cy0 + th / 2, ox1 = cx1 - th / 2, oy1 = cy1 - th / 2, mid = (ox0 + ox1) / 2, d = Math.sign(f);
    ctx.save(); ctx.strokeStyle = c.accent; ctx.lineWidth = 2; ctx.globalAlpha = 0.2 + 0.6 * Math.abs(f); ctx.setLineDash([6, 8]);
    ctx.strokeRect(ox0, oy0, ox1 - ox0, oy1 - oy0); ctx.setLineDash([]);
    // Its name beside the arrow in the upper limb; where the limb is too thin for it (a phone), just above the core.
    if (Math.abs(f) > 0.05) { drawArrow(ctx, mid - d * 14, oy0, mid + d * 14, oy0, c.accent, ''); drawArrow(ctx, mid + d * 14, oy1, mid - d * 14, oy1, c.accent, ''); }
    ctx.restore();
    if (Math.abs(f) > 0.05) vectorLabel(ctx, 'Φ', th >= 34 ? mid + 30 : mid, th >= 34 ? oy0 : cy0 - 12, c.accent);
    label(ctx, `U₂ = U₁·N₂/N₁ = ${num(m.s.U2, 1)} V`, 12, 20, c, 'left');
  },
};

import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { region, wlColor } from '../optics.js';

const DUR = 3, B = 2.898e-3, TSUN = 5772, SIGMA = 5.67e-8;
const params = [
  { key: 'T', symbol: 'T', unit: 'K', min: 2500, max: 30000, step: 1, default: 5772, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'R', symbol: 'R', unit: 'R☉', min: 0.1, max: 1000, step: 0.1, default: 1, kind: 'initial', decimals: 1, color: '--pos' },
];
const TC = [[2500, [255, 138, 61]], [3500, [255, 180, 107]], [5000, [255, 228, 181]], [6000, [255, 244, 234]], [7500, [232, 238, 255]], [10000, [202, 215, 255]], [30000, [155, 176, 255]]];
/** Approximate colour of a star of temperature T as the eye sees it. */
const starColor = (T) => { let i = 0; while (i < TC.length - 2 && T > TC[i + 1][0]) i++; const [t0, a] = TC[i], [t1, b] = TC[i + 1], f = Math.max(0, Math.min(1, (T - t0) / (t1 - t0))); return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(',')})`; };
const planck = (lam, T) => { const x = 1.4388e-2 / (lam * T); return 1 / (lam ** 5 * (Math.exp(x) - 1)); };
/** Luminosity in L☉ as text: whole numbers from 100, two decimals from 1, otherwise two significant digits. */
const fmtL = (L) => (L >= 100 ? num(L, 0) : L >= 0.995 ? num(L, 2) : num(L, Math.min(8, Math.max(2, 1 - Math.floor(Math.log10(L))))));

/**
 * Black-body spectrum of the star drawn from short to long wavelengths over DUR seconds; Wien: λmax = b/T;
 * Stefan–Boltzmann: each m² radiates σT⁴ (q, MW/m²), so in t seconds it gives out E = σT⁴t (MJ); L ∝ R²T⁴.
 */
class StarModel {
  t = 0; s = 0; lm = 0; L = 0; q = 0; E = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.s = 0; this.E = 0; this.reason = ''; this.lm = (B / P.T) * 1e9; this.L = P.R * P.R * Math.pow(P.T / TSUN, 4); this.q = (SIGMA * Math.pow(P.T, 4)) / 1e6; }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt); this.s = this.t / DUR; this.E = this.q * this.t;
    if (this.t >= DUR - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.L); }
  sample() { return { lm: this.lm, L: this.L, q: this.q, E: this.E }; }
  clone() { return Object.assign(new StarModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { return this.reason ? text.msg.end(num(this.lm, 0), region(this.lm), fmtL(this.L), num(this.t, 0), num(this.E, 0), num(this.q, 1)) : ''; }
}

export default {
  id: 'wien',
  params,
  noTape: true,
  presets: [
    { values: { T: 5772, R: 1 } },
    { values: { T: 3000, R: 100 } },
    { values: { T: 10000, R: 2 } },
  ],
  toggles: [],
  readouts: [
    { key: 'lm', unit: 'nm', decimals: 0, color: '--acc' },
    { key: 'L', unit: 'L☉', decimals: 2, color: '--force' },
    { key: 'q', unit: 'MW/m²', decimals: 1, color: '--acc' },
  ],
  graphs: [{ id: 'E', yLabel: 'E', unit: 'MJ', series: [{ key: 'E', color: '--acc' }] }],
  createModel: () => new StarModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    // Star disc: colour of its brightest visible light, size grows slowly with R.
    const sc = starColor(p.T), r = (0.5 + 0.35 * Math.log10(p.R * 10)) * S;
    ctx.save(); ctx.fillStyle = sc; ctx.beginPath(); ctx.arc(X(1.8), Y(3.2), Math.max(8, r), 0, Math.PI * 2); ctx.fill(); ctx.restore();
    hint(ctx, `${num(p.T, 0)} K`, X(1.8), Y(3.2) + Math.max(8, r) + 14, c, 'center');
    // Spectrum plot 100–2000 nm with the visible band shaded.
    const px0 = X(3.8), px1 = X(9.6), py0 = Y(5.2), py1 = Y(1), lx = (l) => px0 + ((l - 100) / 1900) * (px1 - px0);
    for (let l = 380; l <= 750; l += 4) { ctx.fillStyle = wlColor(l, 0.35); ctx.fillRect(lx(l), py0, lx(l + 4) - lx(l) + 0.5, py1 - py0); }
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px0, py0 - 6); ctx.lineTo(px0, py1); ctx.lineTo(px1 + 6, py1); ctx.stroke();
    const peak = planck(m.lm * 1e-9, p.T); ctx.strokeStyle = c.force; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 300 * m.s; i++) { const l = 100 + (i / 300) * 1900, y = py1 - (planck(l * 1e-9, p.T) / peak) * (py1 - py0); i ? ctx.lineTo(lx(l), y) : ctx.moveTo(lx(l), y); }
    ctx.stroke();
    const peakLine = m.s > 0.99 && m.lm >= 100 && m.lm <= 2000;
    if (peakLine) { ctx.setLineDash([4, 4]); ctx.strokeStyle = c.fg; ctx.beginPath(); ctx.moveTo(lx(m.lm), py1); ctx.lineTo(lx(m.lm), py0); ctx.stroke(); ctx.setLineDash([]); }
    // Ticks every 500 nm under the wavelength axis.
    ctx.strokeStyle = c.fg; ctx.lineWidth = 1; ctx.beginPath(); for (const l of [500, 1000, 1500, 2000]) { ctx.moveTo(lx(l), py1); ctx.lineTo(lx(l), py1 + 4); } ctx.stroke();
    ctx.restore();
    // The dashed line marks the peak: its foot on the axis is named λ_max, in place of the numbers next to it.
    for (const l of [100, 500, 1000, 1500, 2000]) if (!peakLine || Math.abs(lx(l) - lx(m.lm)) > 30) hint(ctx, `${l}`, lx(l), py1 + 14, c, 'center');
    if (peakLine) hint(ctx, 'λ_max', lx(m.lm), py1 + 14, c, 'center');
    // Axis names: the wavelength under the middle of its axis, the intensity over the top of its own.
    hint(ctx, 'λ, nm', (px0 + px1) / 2, py1 + 30, c, 'center'); hint(ctx, text.draw.intensity, px0 - 4, py0 - 16, c);
    label(ctx, `λ_max = b/T = ${num(m.lm, 0)} nm,  L = ${fmtL(m.L)} L☉`, 12, 20, c, 'left');
  },
};

import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';

const DUR = 4, D2R = Math.PI / 180;
const params = [
  { key: 'mode', symbol: '', unit: '', min: 0, max: 1, step: 1, default: 0, kind: 'initial', options: ['polarizerAnalyzer', 'threePolarizers'] },
  { key: 'I0', symbol: 'I₀', unit: 'W/m²', min: 10, max: 200, step: 10, default: 100, kind: 'initial', decimals: 0, color: '--acc' },
  { key: 'phi', symbol: 'φ', unit: '°', min: 0, max: 90, step: 1, default: 60, kind: 'initial', decimals: 0, color: '--force' },
];
const out = (P, a) => (P.mode === 0 ? (P.I0 / 2) * Math.cos(a * D2R) ** 2 : (P.I0 / 2) * Math.cos(a * D2R) ** 2 * Math.cos((90 - a) * D2R) ** 2);

/** Natural light through a polariser (I₀/2), then the rotating sheet turns from 0° to φ; Malus: I = I₁ cos²φ. */
class PolModel {
  t = 0; a = 0; I1 = 0; I = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.a = 0; this.reason = ''; this.I1 = P.I0 / 2; this.I = out(P, 0); }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt); this.a = (this.P.phi * this.t) / DUR; this.I = out(this.P, this.a);
    if (this.t >= DUR - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.I); }
  sample() { return { a: this.a, I1: this.I1, I: this.I }; }
  clone() { return Object.assign(new PolModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const phi = num(this.P.phi, 0), I = num(this.I, 1);
    return this.P.mode === 0 ? text.msg.analyzer(phi, I) : text.msg.middle(phi, I);
  }
}

export default {
  id: 'polarization',
  params,
  presets: [
    { values: { mode: 0, I0: 100, phi: 60 } },
    { values: { mode: 0, I0: 100, phi: 30 } },
    { values: { mode: 1, I0: 100, phi: 45 } },
  ],
  toggles: [],
  readouts: [
    { key: 'a', unit: '°', decimals: 0, color: '--force' },
    { key: 'I1', unit: 'W/m²', decimals: 1, color: '--acc' },
    { key: 'I', unit: 'W/m²', decimals: 1, color: '--vel' },
  ],
  graphs: [{ id: 'I', yLabel: 'I', unit: 'W/m²', series: [{ key: 'I', color: '--vel' }] }],
  createModel: () => new PolModel(),
  noTape: true,
  // The scene: the beam at y = 3, the sheets from 1.7 to 4.3, their names above and their angles below.
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0.9, yMax: 5.1 }),
  viewPadding: { left: 16, right: 16, top: 40, bottom: 12 },

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, cy = Y(3), d = text.draw;
    const sheets = p.mode === 0 ? [[3, 0], [6.5, m.a]] : [[2.6, 0], [5, m.a], [7.4, 90]];
    const I = [p.I0, m.I1, ...(p.mode === 0 ? [m.I] : [m.I1 * Math.cos(m.a * D2R) ** 2, m.I])];
    const names = p.mode === 0 ? [d.polarizer, d.analyzer] : [d.polarizer, d.polarizer, d.polarizer], Is = p.mode === 0 ? ['I₀', 'I₁', 'I'] : ['I₀', 'I₁', 'I₂', 'I'];
    // Light segments: width and opacity follow intensity; arrows show the vibration direction.
    const xs = [0.4, ...sheets.map((s) => s[0]), 9.6];
    for (let i = 0; i < xs.length - 1; i++) {
      const f = I[i] / Math.max(1, p.I0);
      ctx.save(); ctx.fillStyle = c.accent; ctx.globalAlpha = 0.12 + 0.5 * f; ctx.fillRect(X(xs[i]), cy - 0.35 * S, X(xs[i + 1]) - X(xs[i]), 0.7 * S); ctx.restore();
      const mx = X((xs[i] + xs[i + 1]) / 2), L = 0.55 * S * Math.sqrt(f);
      ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.5;
      const angs = i === 0 ? [0, 45, 90, 135] : [sheets[i - 1][1]];
      if (L > 2) for (const a of angs) { const dx = Math.sin(a * D2R) * L, dy = -Math.cos(a * D2R) * L; ctx.beginPath(); ctx.moveTo(mx - dx, cy - dy); ctx.lineTo(mx + dx, cy + dy); ctx.stroke(); }
      ctx.restore();
      // The intensity of each stretch of the beam, named above it (clear of the longest vibration line).
      hint(ctx, Is[i], mx, cy - 0.55 * S - 10, c, 'center');
    }
    sheets.forEach(([x, a], i) => {
      ctx.save(); ctx.strokeStyle = c.fg; ctx.fillStyle = c.surface; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(X(x), cy, 0.25 * S, 1.3 * S, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = c.force; ctx.lineWidth = 2; const dx = Math.sin(a * D2R) * 0.22 * S, dy = -Math.cos(a * D2R) * 1.1 * S; ctx.beginPath(); ctx.moveTo(X(x) - dx, cy - dy); ctx.lineTo(X(x) + dx, cy + dy); ctx.stroke(); ctx.restore();
      hint(ctx, `${num(a, 0)}°`, X(x), cy + 1.55 * S, c, 'center'); hint(ctx, names[i], X(x), cy - 1.3 * S - 12, c, 'center');
    });
    // Under the beam, below the star of vibration lines and left of the first sheet.
    hint(ctx, d.natural, X(0.1), cy + 0.55 * S + 11, c);
    label(ctx, `I = ${num(m.I, 1)} W/m²`, 12, 20, c, 'left');
  },
};

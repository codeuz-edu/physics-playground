import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';

const DUR = 3, D2R = Math.PI / 180;
const params = [
  { key: 'n1', symbol: 'n₁', unit: '', min: 1, max: 2.4, step: 0.01, default: 1, kind: 'initial', decimals: 2, color: '--vel' },
  { key: 'n2', symbol: 'n₂', unit: '', min: 1, max: 2.4, step: 0.01, default: 1.5, kind: 'initial', decimals: 2, color: '--pos' },
  { key: 'a', symbol: 'α', unit: '°', min: 0, max: 89, step: 0.5, default: 40, kind: 'initial', decimals: 1, color: '--force' },
];
/** Snell's law at incidence a (degrees). γ and α₀ are NaN where they do not exist (total internal reflection; n₁ ≤ n₂). */
const solve = (P, a) => {
  const s = (P.n1 * Math.sin(a * D2R)) / P.n2, tir = s > 1 + 1e-12;
  return { tir, g: tir ? NaN : Math.asin(Math.min(1, s)) / D2R, a0: P.n1 > P.n2 ? Math.asin(P.n2 / P.n1) / D2R : NaN };
};

/** The lamp turns from the normal (α = 0) to the chosen α; the reflected and refracted rays follow (only the reflected one under TIR). */
class RefrModel {
  t = 0; a = 0; g = 0; a0 = NaN; tir = false; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.reason = ''; this.aim(); }
  aim() { this.a = this.t >= DUR ? this.P.a : (this.P.a * this.t) / DUR; Object.assign(this, solve(this.P, this.a)); }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt);
    if (this.t >= DUR - 1e-9) { this.t = DUR; this.aim(); this.reason = 'end'; return false; }
    this.aim();
    return true;
  }
  isValid() { return Number.isFinite(this.a); }
  sample() { return { a: this.a, g: this.g, a0: this.a0 }; }
  clone() { return Object.assign(new RefrModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const P = this.P;
    if (this.tir) return text.msg.totalReflection(num(P.a, 1), num(this.a0, 1));
    return text.msg.refracted(num(this.g, 1), num(P.n2 / P.n1, 3));
  }
}

export default {
  id: 'refraction',
  params,
  noTape: true,
  presets: [
    { values: { n1: 1, n2: 1.5, a: 40 } },
    { values: { n1: 1.33, n2: 1, a: 30 } },
    { values: { n1: 1.5, n2: 1, a: 45 } },
  ],
  toggles: [],
  readouts: [
    { key: 'a', unit: '°', decimals: 1, color: '--force' },
    { key: 'g', unit: '°', decimals: 1, color: '--pos' },
    { key: 'a0', unit: '°', decimals: 1 },
  ],
  graphs: [{ id: 'angles', unit: '°', range: [0, 90], series: [{ key: 'a', color: '--force' }, { key: 'g', color: '--pos' }] }],
  createModel: () => new RefrModel(),
  worldBounds: () => ({ xMin: -1.6, xMax: 1.6, yMin: -1.1, yMax: 1.1 }),
  viewPadding: { left: 16, right: 16, top: 40, bottom: 16 },

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), a = m.a * D2R, R = 1, O = [X(0), Y(0)], tir = m.tir;
    ctx.save(); ctx.fillStyle = c.accent;
    ctx.globalAlpha = Math.min(0.4, (p.n1 - 1) * 0.3); ctx.fillRect(X(-1.6), Y(1.1), X(1.6) - X(-1.6), Y(0) - Y(1.1));
    ctx.globalAlpha = Math.min(0.4, (p.n2 - 1) * 0.3 + 0.02); ctx.fillRect(X(-1.6), Y(0), X(1.6) - X(-1.6), Y(-1.1) - Y(0));
    ctx.globalAlpha = 1; ctx.strokeStyle = c.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(-1.6), Y(0)); ctx.lineTo(X(1.6), Y(0)); ctx.stroke();
    ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(X(0), Y(1.05)); ctx.lineTo(X(0), Y(-1.05)); ctx.stroke();
    // Critical angle (only from the optically denser medium): beyond this line the light no longer leaves.
    if (Number.isFinite(m.a0)) { const q = m.a0 * D2R; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(X(-0.9 * Math.sin(q)), Y(0.9 * Math.cos(q))); ctx.stroke(); }
    ctx.restore();
    // α₀ beside the end of its line, on the side away from the incident ray (the two can nearly coincide).
    if (Number.isFinite(m.a0)) { const q = m.a0 * D2R + ((m.a > m.a0 ? -1 : 1) * 14) / (0.96 * view.scale); hint(ctx, 'α₀', X(-0.96 * Math.sin(q)), Y(0.96 * Math.cos(q)), c, 'center'); }
    // Each medium named just above / below the boundary, at its right end, beyond the reach of the rays.
    hint(ctx, `n₁ = ${num(p.n1, 2)}`, X(1.55), Y(0) - 12, c, 'right'); hint(ctx, `n₂ = ${num(p.n2, 2)}`, X(1.55), Y(0) + 13, c, 'right');
    // A ray from O to (x1, y1), with a head at the fraction `at` of it showing which way the light goes (`inward`: towards O).
    const line = (x1, y1, w, inward, at = 0.5) => {
      const ex = X(x1), ey = Y(y1), ux = (ex - O[0]) / (Math.hypot(ex - O[0], ey - O[1]) || 1), uy = (ey - O[1]) / (Math.hypot(ex - O[0], ey - O[1]) || 1), d = inward ? -1 : 1;
      const hx = O[0] + (ex - O[0]) * at + d * ux * 5, hy = O[1] + (ey - O[1]) * at + d * uy * 5;
      ctx.save(); ctx.strokeStyle = c.force; ctx.fillStyle = c.force; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - d * (ux * 10 - uy * 4), hy - d * (uy * 10 + ux * 4)); ctx.lineTo(hx - d * (ux * 10 + uy * 4), hy - d * (uy * 10 - ux * 4)); ctx.closePath(); ctx.fill(); ctx.restore();
    };
    line(-R * Math.sin(a), R * Math.cos(a), 2.25, true);
    // Reflected ray: all the light under TIR; none when the two media are the same.
    if (tir || Math.abs(p.n1 - p.n2) > 1e-9) line(R * Math.sin(a), R * Math.cos(a), tir ? 2.25 : 1.25, false, 0.75);
    if (!tir) { const g = m.g * D2R; line(R * Math.sin(g), -R * Math.cos(g), 2.25); }
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1;
    if (a > 1e-6) { ctx.beginPath(); ctx.arc(O[0], O[1], 0.3 * view.scale, -Math.PI / 2 - a, -Math.PI / 2); ctx.stroke(); }
    if (!tir && m.g > 1e-6) { const g = m.g * D2R; ctx.beginPath(); ctx.arc(O[0], O[1], 0.3 * view.scale, Math.PI / 2 - g, Math.PI / 2); ctx.stroke(); }
    ctx.restore();
    // An angle's name sits on its bisector, out where it is at least 10 px from either side; none while the angle is zero.
    const at = (q) => Math.min(0.9, Math.max(0.4, 10 / (view.scale * Math.sin(q / 2) || 1e-9)));
    if (a > 1e-6) { const r = at(a); hint(ctx, 'α', X(-r * Math.sin(a / 2)), Y(r * Math.cos(a / 2)), c, 'center'); }
    if (!tir && m.g > 1e-6) { const g = m.g * D2R, r = at(g); hint(ctx, 'γ', X(r * Math.sin(g / 2)), Y(-r * Math.cos(g / 2)), c, 'center'); }
    label(ctx, tir ? text.draw.totalReflection(num(m.a, 1)) : text.draw.snell(num(m.a, 1), num(m.g, 1)), 12, 20, c, 'left');
  },
};

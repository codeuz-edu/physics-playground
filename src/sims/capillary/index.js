import { num } from '../../core/format.js';
import { ink, label } from '../../ui/canvas.js';
import { gParam, hint } from '../kit.js';

const DUR = 5, TAU = 0.7;
// [key, σ (N/m), ρ (kg/m³), contact angle θ (°)]. Names are in the text file (liquids, params.liq.options).
const LIQ = [['water', 0.073, 1000, 0], ['ethanol', 0.022, 790, 0], ['mercury', 0.47, 13600, 140]];
const params = [
  { key: 'liq', symbol: '', unit: '', min: 0, max: 2, step: 1, default: 0, kind: 'initial', options: LIQ.map(([key]) => key) },
  // Jurin's law ignores the liquid in the meniscus itself; up to r = 1 mm that error stays near 2 % for water.
  { key: 'r', symbol: 'r', unit: 'mm', min: 0.1, max: 1, step: 0.05, default: 0.5, kind: 'initial', decimals: 2, color: '--pos' },
  gParam,
];
const heqOf = (p) => { const [, s, rho, th] = LIQ[p.liq]; return ((2 * s * Math.cos((th * Math.PI) / 180)) / (rho * p.g * p.r * 1e-3)) * 1000; };
/** Millimetres: the tube's open lower end and the dish floor, always deeper than a mercury depression h < 0 (meniscus edges included). */
const dish = (h) => { const end = Math.min(-30, h - 15); return { end, floor: end - 10 }; };

/** Liquid in a capillary settles where surface tension σ·2πr·cosθ balances the column weight ρgπr²h. */
class CapModel {
  t = 0; h = 0; heq = 0; F = 0; W = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.reason = ''; this.heq = heqOf(P); this.calc(); }
  calc() {
    const [, s, rho, th] = LIQ[this.P.liq], r = this.P.r * 1e-3;
    this.h = this.reason ? this.heq : this.heq * (1 - Math.exp(-this.t / TAU));
    // Magnitudes in mN. For mercury (cos θ < 0) the surface-tension force pushes the meniscus down, and the weight
    // of the missing column ρgπr²|h| (the outside liquid's hydrostatic push) balances it.
    this.F = Math.abs(s * 2 * Math.PI * r * Math.cos((th * Math.PI) / 180)) * 1000;
    this.W = rho * this.P.g * Math.PI * r * r * (Math.abs(this.h) / 1000) * 1000;
  }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt);
    if (this.t >= DUR - 1e-9) this.reason = 'end';
    this.calc(); return !this.reason;
  }
  isValid() { return [this.h, this.F].every(Number.isFinite); }
  sample() { return { h: this.h, F: this.F, W: this.W }; }
  clone() { return Object.assign(new CapModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const name = text.liquids[LIQ[this.P.liq][0]], h = num(Math.abs(this.h), 1), F = num(this.F, 3);
    return this.h >= 0 ? text.msg.rise(name, h, F) : text.msg.fall(name, h, F);
  }
}

export default {
  id: 'capillary',
  params,
  presets: [
    { values: { liq: 0, r: 0.5, g: 9.81 } },
    { values: { liq: 1, r: 0.5, g: 9.81 } },
    { values: { liq: 2, r: 0.5, g: 9.81 } },
    { values: { liq: 0, r: 0.1, g: 9.81 } },
  ],
  toggles: [],
  readouts: [
    { key: 'h', unit: 'mm', decimals: 1, color: '--pos' },
    { key: 'F', unit: 'mN', decimals: 3, color: '--force' },
    { key: 'W', unit: 'mN', decimals: 3, color: '--acc' },
  ],
  graphs: [
    { id: 'h', yLabel: 'h', unit: 'mm', series: [{ key: 'h', color: '--pos' }] },
    { id: 'F', yLabel: 'F', unit: 'mN', series: [{ key: 'F', color: '--force' }, { key: 'W', color: '--acc' }] },
  ],
  lengthUnit: 'mm',
  createModel: () => new CapModel(),
  worldBounds: (p) => { const h = heqOf(p); return { xMin: -60, xMax: 60, yMin: dish(h).floor - 4, yMax: Math.max(30, h * 1.15 + 12) }; },

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    const merc = p.liq === 2, wHalf = 2 + p.r * 5, top = Math.max(24, m.heq * 1.08 + 8), { end, floor } = dish(m.heq);
    const fillLiquid = () => { ctx.fillStyle = merc ? c.muted : c.accent; ctx.globalAlpha = merc ? 0.55 : 0.3; };
    // All the liquid as one path, filled once: the dish beside the tube, the dish under the tube's open end, and the column
    // inside the tube up to its meniscus (wetting liquid climbs the walls, mercury bulges up in the middle). Inside the tube,
    // between a depressed mercury meniscus and the outside level, there is only air.
    const bend = Math.min(wHalf * 0.7, 4) * (merc ? -1 : 1);
    const box = (x0, y0, x1, y1) => ctx.rect(X(x0), Y(y1), X(x1) - X(x0), Y(y0) - Y(y1));
    ctx.save(); fillLiquid(); ctx.beginPath();
    box(-50, floor, -wHalf, 0); box(wHalf, floor, 50, 0); box(-wHalf, floor, wHalf, end);
    ctx.moveTo(X(-wHalf), Y(end)); ctx.lineTo(X(-wHalf), Y(m.h + bend)); ctx.quadraticCurveTo(X(0), Y(m.h - bend), X(wHalf), Y(m.h + bend)); ctx.lineTo(X(wHalf), Y(end)); ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.moveTo(X(-50), Y(8)); ctx.lineTo(X(-50), Y(floor)); ctx.lineTo(X(50), Y(floor)); ctx.lineTo(X(50), Y(8)); ctx.stroke();
    for (const s of [-1, 1]) { ctx.strokeRect(Math.min(X(s * wHalf), X(s * (wHalf + 1.5))), Y(top), Math.abs(X(1.5) - X(0)), Y(end) - Y(top)); }
    ctx.lineWidth = 1; ctx.strokeStyle = c.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(-58), Y(0)); ctx.lineTo(X(58), Y(0)); ctx.stroke(); ctx.setLineDash([]);
    // Height dimension; none while h is still too small to show (its two end ticks would be a stray dash on the level line).
    const dx = X(wHalf + 10); ctx.strokeStyle = c.fg; ctx.beginPath(); if (Math.abs(Y(m.h) - Y(0)) > 4) { ctx.moveTo(dx, Y(0)); ctx.lineTo(dx, Y(m.h)); ctx.moveTo(dx - 4, Y(0)); ctx.lineTo(dx + 4, Y(0)); ctx.moveTo(dx - 4, Y(m.h)); ctx.lineTo(dx + 4, Y(m.h)); } ctx.stroke();
    ctx.restore();
    if (Math.abs(Y(m.h) - Y(0)) > 14) hint(ctx, `h = ${num(m.h, 1)} mm`, dx + 8, (Y(0) + Y(m.h)) / 2, c);
    hint(ctx, text.draw.widened, X(-48), Y(floor) + 14 > view.height - 4 ? view.height - 10 : Y(floor) + 14, c);
    label(ctx, `h = 2σ cos θ / (ρgr) = ${num(m.heq, 1)} mm`, 12, 20, c, 'left');
  },
};

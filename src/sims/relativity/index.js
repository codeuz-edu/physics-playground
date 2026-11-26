import { num } from '../../core/format.js';
import { drawArrow, ink, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';

const DUR = 6;
const params = [
  { key: 'b', symbol: 'υ/c', unit: '', min: 0, max: 0.99, step: 0.01, default: 0.8, kind: 'initial', decimals: 2, color: '--vel' },
  { key: 't0', symbol: 'Δt₀', unit: 'yr', min: 1, max: 20, step: 0.5, default: 10, kind: 'initial', decimals: 1, color: '--acc' },
  { key: 'l0', symbol: 'l₀', unit: 'm', min: 10, max: 200, step: 5, default: 100, kind: 'initial', decimals: 0, color: '--pos' },
];
const gam = (b) => 1 / Math.sqrt(1 - b * b);

/** Ship clock runs to Δt₀ in 6 s of screen time; the Earth clock shows γ times more. Time axis: years on the ship. */
class RelModel {
  t = 0; g = 1; ts = 0; te = 0; l = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.ts = 0; this.te = 0; this.reason = ''; this.g = gam(P.b); this.l = P.l0 / this.g; }
  step(dt) {
    if (this.reason) return false;
    this.ts = Math.min(this.P.t0, this.ts + (this.P.t0 * dt) / DUR); this.t = this.ts; this.te = this.g * this.ts;
    if (this.ts >= this.P.t0 - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.g); }
  sample() { return { ts: this.ts, te: this.te, g: this.g, l: this.l }; }
  clone() { return Object.assign(new RelModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { return this.reason ? text.msg.end(num(this.P.t0, 1), num(this.te, 2), num(this.g, 3), num(this.l, 1)) : ''; }
}

const clock = (ctx, x, y, r, frac, text, c) => {
  ctx.save(); ctx.strokeStyle = c.fg; ctx.fillStyle = c.surface; ctx.lineWidth = ink.object; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  const a = -Math.PI / 2 + frac * Math.PI * 2; ctx.strokeStyle = c.force; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); ctx.stroke();
  ctx.fillStyle = c.fg; ctx.font = '600 13px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText(text, x, y + r + 6); ctx.restore();
};

export default {
  id: 'relativity',
  params,
  timeUnit: 'yr',
  noTape: true,
  presets: [
    { values: { b: 0.8, t0: 10, l0: 100 } },
    { values: { b: 0.6, t0: 8, l0: 100 } },
    { values: { b: 0.99, t0: 1, l0: 100 } },
  ],
  toggles: [],
  readouts: [
    { key: 'ts', unit: 'yr', decimals: 2, color: '--acc' },
    { key: 'te', unit: 'yr', decimals: 2, color: '--force' },
    { key: 'g', unit: '', decimals: 3 },
    { key: 'l', unit: 'm', decimals: 1, color: '--pos' },
  ],
  graphs: [{ id: 't', yLabel: 't', unit: 'yr', series: [{ key: 'ts', color: '--acc' }, { key: 'te', color: '--force' }] }],
  createModel: () => new RelModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    // Ship drawn at its own length and below at the length seen from Earth.
    const L0 = 3.2 * S, L = L0 / m.g, x0 = X(0.6) + ((m.ts / p.t0) * (X(9.4) - X(0.6) - L0)), y1 = Y(4.6), y2 = Y(3.2);
    // The nose is 18 px long, or half the ship when it is very short (υ near c), so the outline never folds back.
    const ship = (x, y, len, tag) => { const nz = Math.min(18, len / 2); ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.beginPath(); ctx.moveTo(x, y - 12); ctx.lineTo(x + len - nz, y - 12); ctx.lineTo(x + len, y); ctx.lineTo(x + len - nz, y + 12); ctx.lineTo(x, y + 12); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); hint(ctx, tag, x, y - 22, c); };
    ship(X(0.6), y1, L0, text.draw.shipOwn(num(p.l0, 0)));
    ship(x0, y2, L, text.draw.shipSeen(num(m.l, 1)));
    // Its velocity, ahead of the nose (shorter near the right edge, so it stays on the stage).
    const nose = x0 + L + 4, len = Math.min(44, view.width - 24 - nose);
    if (p.b > 0 && len > 14) drawArrow(ctx, nose, y2, nose + len, y2, c.vel, 'υ');
    clock(ctx, X(3), Y(1.6), 0.6 * S, (m.ts % 1), text.draw.clockShip(num(m.ts, 2)), c);
    clock(ctx, X(7), Y(1.6), 0.6 * S, (m.te % 1), text.draw.clockEarth(num(m.te, 2)), c);
    label(ctx, `γ = 1/√(1 − υ²/c²) = ${num(m.g, 3)}`, 12, 20, c, 'left');
  },
};

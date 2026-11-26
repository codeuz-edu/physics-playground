import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { wlColor } from '../optics.js';

// The run: waves spread from the slits to the screen at L₀ (TA s), then the screen moves back to L and the fringes widen.
const TA = 1, DUR = 3.4, L0 = 0.5;
const params = [
  { key: 'lam', symbol: 'λ', unit: 'nm', min: 380, max: 750, step: 5, default: 600, kind: 'initial', decimals: 0, color: '--acc' },
  { key: 'd', symbol: 'd', unit: 'mm', min: 0.1, max: 1, step: 0.01, default: 0.2, kind: 'initial', decimals: 2, color: '--pos' },
  { key: 'L', symbol: 'L', unit: 'm', min: L0, max: 3, step: 0.1, default: 1.5, kind: 'initial', decimals: 1, color: '--vel' },
];
const fringe = (P, L) => ((P.lam * 1e-9 * L) / (P.d * 1e-3)) * 1000; // mm
const screenX = (L) => 4.2 + ((L - L0) / (3 - L0)) * 3.6; // where the screen is drawn (world units)

/** Two coherent slits: waves spread to the screen, the pattern I ∝ cos²(πdy/λL) appears, then the screen moves back. */
class YoungModel {
  t = 0; s = 0; L = L0; dx = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.reason = ''; this.place(); }
  place() {
    const u = Math.max(0, Math.min(1, (this.t - TA) / (DUR - TA)));
    this.s = this.t / DUR; this.L = u >= 1 ? this.P.L : L0 + (this.P.L - L0) * u; this.dx = fringe(this.P, this.L);
  }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt);
    if (this.t >= DUR - 1e-9) { this.t = DUR; this.place(); this.reason = 'end'; return false; }
    this.place();
    return true;
  }
  isValid() { return Number.isFinite(this.dx); }
  sample() { return { L: this.L, dx: this.dx }; }
  clone() { return Object.assign(new YoungModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { return this.reason ? text.msg.end(num(this.dx, 2)) : ''; }
}

export default {
  id: 'young',
  params,
  presets: [
    { values: { lam: 600, d: 0.2, L: 1.5 } },
    { values: { lam: 500, d: 0.25, L: 2 } },
    { values: { lam: 750, d: 0.3, L: 1.2 } },
  ],
  toggles: [],
  readouts: [
    { key: 'L', unit: 'm', decimals: 2, color: '--vel' },
    { key: 'dx', unit: 'mm', decimals: 2, color: '--acc' },
  ],
  graphs: [{ id: 'dx', unit: 'mm', series: [{ key: 'dx', color: '--acc' }] }],
  noTape: true,
  createModel: () => new YoungModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),

  draw({ ctx, view, model: m, params: p, colors: c }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, col = wlColor(p.lam);
    const bx = X(2.2), sx = X(screenX(m.L)), cy = Y(3), gap = (0.25 + p.d * 1.2) * S, top = Y(5.4), bot = Y(0.6);
    // Barrier with two slits and incoming plane waves.
    ctx.save(); ctx.fillStyle = c.fg; ctx.fillRect(bx - 3, top, 6, cy - gap / 2 - 4 - top); ctx.fillRect(bx - 3, cy - gap / 2 + 4, 6, gap - 8); ctx.fillRect(bx - 3, cy + gap / 2 + 4, 6, bot - cy - gap / 2 - 4);
    const wl = (0.28 + (p.lam - 380) / 1400) * S;
    ctx.strokeStyle = col; ctx.lineWidth = 1.5;
    for (let x = X(0.4) + ((m.t * 40) % wl); x < bx - 4; x += wl) { ctx.beginPath(); ctx.moveTo(x, Y(4.6)); ctx.lineTo(x, Y(1.4)); ctx.stroke(); }
    // Circular wavelets from each slit, clipped between the barrier and the screen; they reach the screen at 0.6·TA.
    ctx.beginPath(); ctx.rect(bx + 3, top, Math.max(0, sx - bx - 3), bot - top); ctx.clip(); ctx.globalAlpha = 0.55; ctx.lineWidth = 1;
    const reach = Math.min(1, m.t / (0.6 * TA)) * (sx - bx + 40);
    for (const y0 of [cy - gap / 2, cy + gap / 2]) for (let r = (m.t * 40) % wl; r < reach; r += wl) { ctx.beginPath(); ctx.arc(bx, y0, r, -Math.PI / 2, Math.PI / 2); ctx.stroke(); }
    ctx.restore();
    // Screen with the fringe pattern. At the end it shows ±6 fringes whatever Δx is; while the screen moves back the
    // millimetres per pixel stay fixed, so the fringes visibly widen in proportion to L.
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, top); ctx.lineTo(sx, bot); ctx.stroke(); ctx.restore();
    const show = Math.max(0, Math.min(1, (m.t - 0.6 * TA) / (0.4 * TA))), rel = m.L / p.L;
    if (show > 0) {
      for (let py = top; py < bot; py++) { const u = ((py - cy) / ((bot - top) / 2)) * (6 / rel), I = Math.cos(Math.PI * u) ** 2; ctx.fillStyle = wlColor(p.lam, I * show); ctx.fillRect(sx + 4, py, 0.45 * S, 1); }
      ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1; const y1 = cy, y2 = cy + ((bot - top) / 12) * rel, xx = sx + 0.55 * S + 6; ctx.beginPath(); ctx.moveTo(xx, y1); ctx.lineTo(xx, y2); ctx.moveTo(xx - 4, y1); ctx.lineTo(xx + 4, y1); ctx.moveTo(xx - 4, y2); ctx.lineTo(xx + 4, y2); ctx.stroke(); ctx.restore();
      hint(ctx, `Δx = ${num(m.dx, 2)} mm`, sx + 0.55 * S + 12, (y1 + y2) / 2, c);
    }
    // d under the slits, L on the next line: the two would run together while the screen is still close.
    hint(ctx, `d = ${num(p.d, 2)} mm`, bx, bot + 14, c, 'center'); hint(ctx, `L = ${num(m.L, 2)} m`, (bx + sx) / 2, bot + 31, c, 'center');
    label(ctx, `Δx = λL/d = ${num(m.dx, 2)} mm`, 12, 20, c, 'left');
  },
};

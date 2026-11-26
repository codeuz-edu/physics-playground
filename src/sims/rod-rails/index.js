import { num } from '../../core/format.js';
import { drawArrow, ink, label, reserve } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { resistor, wire, drift } from '../elec.js';

const DIST = 2; // m the rod is pulled
const params = [
  { key: 'B', symbol: 'B', unit: 'T', min: 0.1, max: 1, step: 0.05, default: 0.5, kind: 'initial', decimals: 2, color: '--acc' },
  { key: 'l', symbol: 'l', unit: 'm', min: 0.1, max: 1, step: 0.05, default: 0.4, kind: 'initial', decimals: 2, color: '--pos' },
  { key: 'v', symbol: 'υ', unit: 'm/s', min: 0.5, max: 5, step: 0.1, default: 2, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'R', symbol: 'R', unit: 'Ω', min: 0.5, max: 10, step: 0.5, default: 2, kind: 'initial', decimals: 1 },
];

/** Rod on rails in a field B, pulled at constant υ: ℰ = Bυl, I = ℰ/R, braking Ampère force BIl, heat I²Rt. */
class RodModel {
  t = 0; x = 0; E = 0; I = 0; F = 0; Q = 0; ph = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.x = 0; this.ph = 0; this.Q = 0; this.reason = ''; this.E = P.B * P.v * P.l; this.I = this.E / P.R; this.F = P.B * this.I * P.l; }
  step(dt) {
    if (this.reason) return false;
    const end = DIST / this.P.v; this.t = Math.min(end, this.t + dt); this.x = this.P.v * this.t; this.Q = this.I * this.I * this.P.R * this.t; this.ph += this.I * dt * 40;
    if (this.t >= end - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.E); }
  /** A = F·s is the work of the pulling force (equal to F_A at constant speed); it always equals the heat Q. */
  sample() { return { E: this.E, I: this.I, F: this.F, Q: this.Q, A: this.F * this.x, x: this.x }; }
  clone() { return Object.assign(new RodModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { return this.reason ? text.msg.end(num(DIST, 0), num(this.E, 2), num(this.I, 2), num(this.F, 3), num(this.Q, 3)) : ''; }
}

export default {
  id: 'rod-rails',
  params,
  stageSize: 'strip',
  presets: [
    { values: { B: 0.5, l: 0.4, v: 2, R: 2 } },
    { values: { B: 0.5, l: 0.4, v: 4, R: 2 } },
    { values: { B: 1, l: 0.5, v: 1, R: 1 } },
  ],
  toggles: [{ key: 'forces', default: true }],
  readouts: [
    { key: 'E', unit: 'V', decimals: 2, color: '--force' },
    { key: 'I', unit: 'A', decimals: 2, color: '--vel' },
    { key: 'F', unit: 'N', decimals: 3, color: '--acc' },
    { key: 'Q', unit: 'J', decimals: 3 },
    { key: 'A', unit: 'J', decimals: 3, color: '--pos' },
  ],
  graphs: [{ id: 'Q', unit: 'J', series: [{ key: 'A', color: '--pos' }, { key: 'Q', color: '--acc' }] }],
  createModel: () => new RodModel(),
  worldBounds: () => ({ xMin: -0.6, xMax: 2.5, yMin: -0.25, yMax: 1.25 }),
  viewPadding: { left: 20, right: 20, top: 40, bottom: 16 },

  draw({ ctx, view, model: m, params: p, toggles, colors: c }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y);
    const y0 = Y(0.5 - p.l / 2), y1 = Y(0.5 + p.l / 2), rx = X(m.x + 0.1);
    // R beside the resistor; where the stage is too narrow for that (a phone), above the top rail at its left end.
    const rText = `R = ${num(p.R, 1)} Ω`; ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; const rw = ctx.measureText(rText).width; ctx.restore();
    const [rlx, rly] = X(-0.4) - 14 - rw >= 4 ? [X(-0.4) - 14 - rw, (y0 + y1) / 2] : [Math.max(4, X(-0.4) - 4), y1 - 13];
    ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1;
    for (let gx = -0.3; gx <= 2.4; gx += 0.2) for (let gy = 0; gy <= 1.01; gy += 0.2) { const px = X(gx), py = Y(gy); if (px + 3 > rlx - 3 && px - 3 < rlx + rw + 3 && Math.abs(py - rly) < 11) continue; ctx.beginPath(); ctx.moveTo(px - 3, py - 3); ctx.lineTo(px + 3, py + 3); ctx.moveTo(px + 3, py - 3); ctx.lineTo(px - 3, py + 3); ctx.stroke(); }
    ctx.restore();
    wire(ctx, [[X(-0.4), y0], [X(2.4), y0]], c); wire(ctx, [[X(-0.4), y1], [X(2.4), y1]], c);
    wire(ctx, [[X(-0.4), y0], [X(-0.4), y1]], c);
    resistor(ctx, X(-0.4), (y0 + y1) / 2, c, '', true, Math.max(8, Math.min(46, Math.abs(y1 - y0) - 10))); // still a box with the rails close
    hint(ctx, rText, rlx, rly, c);
    if (m.t > 0) drift(ctx, [[rx, y0], [rx, y1], [X(-0.4), y1], [X(-0.4), y0], [rx, y0]], m.ph, c);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(rx, y0 + 6); ctx.lineTo(rx, y1 - 6); ctx.stroke(); ctx.restore();
    hint(ctx, 'B ⊗', X(2.3), Y(1.15), c, 'right');
    if (toggles.forces) {
      // The names of the vectors keep off the rails and the rod. Every arrow has one length all run (υ and the forces are
      // constant), short enough to stay on the rails at the end.
      for (const y of [y0, y1]) reserve(ctx, X(-0.4), y - 2, X(2.4) - X(-0.4), 4);
      reserve(ctx, rx - 3, y1, 6, y0 - y1);
      const ym = (y0 + y1) / 2, L = Math.min(56, X(2.4) - X(DIST + 0.1) - 6);
      drawArrow(ctx, rx + 4, y1 - 14, rx + 4 + L, y1 - 14, c.vel, 'υ');
      if (m.t > 0) { drawArrow(ctx, rx + 4, ym, rx + 4 + L, ym, c.fg, 'F_t'); drawArrow(ctx, rx - 4, ym, rx - 4 - L, ym, c.acc || c.force, 'F_A'); }
    }
    label(ctx, `ℰ = Bυl = ${num(m.E, 2)} V,  F_A = BIl = ${num(m.F, 3)} N`, 12, 20, c, 'left');
  },
};

import { num } from '../../core/format.js';
import { drawArrow, ink, label, vectorLabel } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { wire } from '../elec.js';

const PERIODS = 3;
const params = [
  { key: 'N', symbol: 'N', unit: '', min: 10, max: 500, step: 10, default: 100, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'B', symbol: 'B', unit: 'T', min: 0.05, max: 1, step: 0.05, default: 0.2, kind: 'initial', decimals: 2, color: '--acc' },
  { key: 'S', symbol: 'S', unit: 'cm²', min: 20, max: 400, step: 10, default: 100, kind: 'initial', decimals: 0 },
  { key: 'nu', symbol: 'ν', unit: 'Hz', min: 0.5, max: 5, step: 0.5, default: 2, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'R', symbol: 'R', unit: 'Ω', min: 1, max: 50, step: 1, default: 5, kind: 'initial', decimals: 0, color: '--force' },
];
const emax = (P) => P.N * P.B * P.S * 1e-4 * 2 * Math.PI * P.nu;

/** Frame turning in a uniform field: Φ = BS cos ωt per turn, ℰ = NBSω sin ωt, current through the load R. */
class GenModel {
  t = 0; e = 0; i = 0; phi = 0; Em = 0; ang = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.reason = ''; this.Em = emax(P); this.calc(); }
  calc() { this.ang = 2 * Math.PI * this.P.nu * this.t; this.phi = this.P.B * this.P.S * 1e-4 * Math.cos(this.ang) * 1000; this.e = this.Em * Math.sin(this.ang); this.i = this.e / this.P.R; }
  step(dt) {
    if (this.reason) return false;
    const end = PERIODS / this.P.nu; this.t = Math.min(end, this.t + dt); this.calc();
    if (this.t >= end - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.e); }
  sample() { return { phi: this.phi, e: this.e, i: this.i, p: this.e * this.i }; }
  clone() { return Object.assign(new GenModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const Ee = this.Em / Math.SQRT2;
    return text.msg.end(PERIODS, num(this.Em, 3), num(Ee, 3), num((Ee * Ee) / this.P.R, 3));
  }
}

export default {
  id: 'ac-generator',
  params,
  presets: [
    { values: { N: 100, B: 0.2, S: 100, nu: 2, R: 5 } },
    { values: { N: 100, B: 0.2, S: 100, nu: 4, R: 5 } },
    { values: { N: 200, B: 0.5, S: 200, nu: 1, R: 10 } },
  ],
  toggles: [],
  readouts: [
    { key: 'phi', unit: 'mWb', decimals: 3, color: '--pos' },
    { key: 'e', unit: 'V', decimals: 3, color: '--force' },
    { key: 'i', unit: 'A', decimals: 3, color: '--vel' },
    { key: 'p', unit: 'W', decimals: 3, color: '--acc' },
  ],
  graphs: [
    { id: 'phi', unit: 'mWb', series: [{ key: 'phi', color: '--pos' }] },
    { id: 'e', unit: 'V', series: [{ key: 'e', color: '--force' }] },
    { id: 'p', unit: 'W', series: [{ key: 'p', color: '--acc' }] },
  ],
  createModel: () => new GenModel(),
  worldBounds: () => ({ xMin: 0.4, xMax: 9.6, yMin: 1.35, yMax: 5.4 }), // from the slip rings to the ω arrow over the frame
  viewPadding: { left: 16, right: 16, top: 40, bottom: 16 },
  noTape: true, // a schematic: distances on it are not lengths

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    const cx = X(3.6), cy = Y(3.4);
    // Pole pieces with field lines between them.
    ctx.save(); ctx.lineWidth = ink.object; ctx.strokeStyle = c.fg;
    ctx.fillStyle = c.force; ctx.fillRect(X(0.6), Y(4.6), X(1.3) - X(0.6), Y(2.2) - Y(4.6)); ctx.strokeRect(X(0.6), Y(4.6), X(1.3) - X(0.6), Y(2.2) - Y(4.6));
    ctx.fillStyle = c.vel; ctx.fillRect(X(5.9), Y(4.6), X(6.6) - X(5.9), Y(2.2) - Y(4.6)); ctx.strokeRect(X(5.9), Y(4.6), X(6.6) - X(5.9), Y(2.2) - Y(4.6));
    ctx.fillStyle = c.surface; ctx.font = '700 15px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('N', X(0.95), cy); ctx.fillText('S', X(6.25), cy);
    ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.setLineDash([4, 5]);
    for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(X(1.3), cy + k * 0.45 * S); ctx.lineTo(X(5.9), cy + k * 0.45 * S); ctx.stroke(); }
    ctx.setLineDash([]); ctx.restore();
    drawArrow(ctx, X(1.45), cy - 0.45 * S, X(2.35), cy - 0.45 * S, c.acc, 'B');
    // The frame turns about its vertical axis; it is drawn in an oblique view (depth goes up and to the right), so its turning
    // shows. Its normal n makes the angle ωt with B, so Φ = BS cos ωt: at t = 0 the frame stands across the field (Φ largest,
    // ℰ = 0), at ωt = 90° along it (Φ = 0, ℰ largest). Seen from above it turns clockwise: from B towards the viewer.
    const a = 0.8 * S, hh = 0.95 * S, q = 0.35, sn = Math.sin(m.ang), cs = Math.cos(m.ang);
    const edge = (e) => { const z = e * a * cs; return [cx - e * a * sn - q * z, q * z]; }; // a vertical side: its x and its drop
    const [x1, d1] = edge(1), [x2, d2] = edge(-1), [xf, df] = cs >= 0 ? [x2, d2] : [x1, d1], [xn, dn] = cs >= 0 ? [x1, d1] : [x2, d2];
    const top = cy - hh - q * a - 16, ry = Y(1.65); // the axis rises above the frame's highest corner; the rings sit below the magnets
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(cx, ry + 10); ctx.stroke();
    ctx.fillStyle = c.accent; ctx.globalAlpha = 0.15; ctx.beginPath(); ctx.moveTo(x1, cy - hh + d1); ctx.lineTo(x2, cy - hh + d2); ctx.lineTo(x2, cy + hh + d2); ctx.lineTo(x1, cy + hh + d1); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = c.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xf, cy - hh + df); ctx.lineTo(xf, cy + hh + df); ctx.stroke(); // far side
    ctx.strokeStyle = c.fg; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(xf, cy - hh + df); ctx.lineTo(xn, cy - hh + dn); ctx.lineTo(xn, cy + hh + dn); ctx.lineTo(xf, cy + hh + df); ctx.stroke();
    // ω: a turning arrow round the top of the axis, front (lower) part running from right to left.
    const ey = top + 7; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(cx, ey, 15, 5, 0, Math.PI, 2.4 * Math.PI); ctx.stroke();
    const ex = cx + 15 * Math.cos(2.4 * Math.PI), eyy = ey + 5 * Math.sin(2.4 * Math.PI); ctx.fillStyle = c.fg; ctx.beginPath(); ctx.moveTo(ex - 7, eyy + 2); ctx.lineTo(ex + 1, eyy - 3); ctx.lineTo(ex + 1, eyy + 5); ctx.closePath(); ctx.fill();
    ctx.restore();
    vectorLabel(ctx, 'ω', cx + 26, ey, c.fg, 'center'); hint(ctx, text.draw.frame, cx - 22, ey, c, 'right');
    drawArrow(ctx, cx, cy, cx + 0.75 * S * (cs - q * sn), cy + 0.75 * S * q * sn, c.fg, 'n', 'part');
    // Slip rings, their brushes and the leads to the load.
    ctx.save(); ctx.strokeStyle = c.fg; ctx.fillStyle = c.fg; ctx.lineWidth = 1.5; for (const dy of [0, 10]) { ctx.beginPath(); ctx.ellipse(cx, ry + dy, 10, 4, 0, 0, Math.PI * 2); ctx.stroke(); ctx.fillRect(cx + 10, ry + dy - 3, 5, 6); } ctx.restore();
    hint(ctx, text.draw.rings, cx - 16, ry + 5, c, 'right');
    const lx = X(8.3), ly = Y(3.4), lr = 0.38 * S;
    wire(ctx, [[cx + 15, ry], [lx, ry], [lx, ly + lr]], c); wire(ctx, [[cx + 15, ry + 10], [X(9.3), ry + 10], [X(9.3), ly - lr - 14], [lx, ly - lr - 14], [lx, ly - lr]], c);
    // The lamp glows with the power ℰ²/R, so brightness follows (ℰ/ℰ_m)².
    ctx.save(); ctx.fillStyle = c.force; ctx.globalAlpha = 0.1 + 0.75 * (m.e / Math.max(1e-9, m.Em)) ** 2; ctx.beginPath(); ctx.arc(lx, ly, lr, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.stroke(); ctx.restore();
    hint(ctx, text.draw.lamp(num(p.R, 0)), lx, ly - lr - 26, c, 'center');
    label(ctx, `ℰ = NBSω sin ωt,  ℰ_m = ${num(m.Em, 3)} V`, 12, 20, c, 'left');
  },
};

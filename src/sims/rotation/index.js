import { num } from '../../core/format.js';
import { drawArrow, drawGround, drawSky, ink, label, reserve } from '../../ui/canvas.js';
import { advance, gParam, hint, rope, support, weight } from '../kit.js';

// Menu values of the wheel; their names are in the text file, in this order.
const SHAPES = ['disc', 'ring'];
const H = 1.0; // m the weight falls
const params = [
  { key: 'shape', symbol: '', unit: '', min: 0, max: 1, step: 1, default: 0, kind: 'initial', options: SHAPES },
  { key: 'M', symbol: 'M', unit: 'kg', min: 0.5, max: 5, step: 0.1, default: 2, kind: 'initial', decimals: 1, color: '--vy' },
  { key: 'R', symbol: 'R', unit: 'm', min: 0.05, max: 0.3, step: 0.01, default: 0.1, kind: 'initial', decimals: 2 },
  { key: 'm', symbol: 'm', unit: 'kg', min: 0.05, max: 2, step: 0.05, default: 0.5, kind: 'initial', decimals: 2, color: '--pos' },
  gParam,
];

/** A weight on a string wound round a wheel on a fixed axle: a = mg / (m + I/R²), ε = a / R. */
class RotationModel {
  t = 0; s = 0; v = 0; a = 0; I = 0; eps = 0; w = 0; phi = 0; T = 0; reason = ''; R = 0.1; m = 0; g = 0;
  reset(p) {
    this.t = 0; this.s = 0; this.v = 0; this.phi = 0; this.w = 0; this.reason = ''; this.R = p.R; this.m = p.m; this.g = p.g;
    this.I = (p.shape === 0 ? 0.5 : 1) * p.M * p.R * p.R;
    this.a = (p.m * p.g) / (p.m + this.I / (p.R * p.R));
    this.eps = this.a / p.R; this.T = p.m * (p.g - this.a);
  }
  step(dt) {
    if (this.reason) return false;
    const r = advance(this.s, this.v, this.a, dt, H);
    this.s = r.s; this.v = r.v; this.t += r.tau; this.w = this.v / this.R; this.phi = this.s / this.R;
    if (r.hit) { this.reason = 'floor'; return false; }
    return true;
  }
  isValid() { return [this.t, this.s, this.v].every(Number.isFinite); }
  sample() {
    // The weight's loss of potential energy mgs is shared: ½mυ² to the weight, ½Iω² to the wheel.
    const Ekl = 0.5 * this.m * this.v * this.v, Ekw = 0.5 * this.I * this.w * this.w;
    return { v: this.v, w: this.w, eps: this.eps, a: this.a, s: this.s, Ekl, Ekw, Ek: Ekl + Ekw, Wg: this.m * this.g * this.s, M: this.T * this.R };
  }
  clone() { return Object.assign(new RotationModel(), this); }
  /** The run's outcome in words; `text` is this simulation's text (sims/rotation/<locale>.js). */
  finishMessage(text) {
    if (!this.reason) return '';
    const s = this.sample();
    return text.msg.floor(num(this.t, 2), num(H, 1), num(this.eps, 1), num(this.w, 1), num(this.I, 4), num(s.Wg, 2), num(s.Ekl, 2), num(s.Ekw, 2));
  }
}

export default {
  id: 'rotation',
  params,
  stageSize: 'tall',
  viewPadding: { left: 24, right: 24, top: 24, bottom: 24 },
  presets: [
    { values: { shape: 0, M: 2, R: 0.1, m: 0.5, g: 9.81 } },
    { values: { shape: 1, M: 2, R: 0.1, m: 0.5, g: 9.81 } },
    { values: { shape: 0, M: 2, R: 0.25, m: 0.5, g: 9.81 } },
  ],
  toggles: [{ key: 'forces', default: true }, { key: 'omega', default: true }],
  readouts: [
    { key: 'eps', unit: 'rad/s²', decimals: 1, color: '--acc' },
    { key: 'w', unit: 'rad/s', decimals: 1, color: '--vy' },
    { key: 'a', unit: 'm/s²', decimals: 2, color: '--pos' },
    { key: 'M', unit: 'N·m', decimals: 3, color: '--force' },
    { key: 'Ekl', unit: 'J', decimals: 2, color: '--pos' },
    { key: 'Ekw', unit: 'J', decimals: 2, color: '--vy' },
  ],
  graphs: [
    { id: 'w', yLabel: 'ω', unit: 'rad/s', series: [{ key: 'w', color: '--vy' }] },
    { id: 'v', yLabel: 'υ', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
    { id: 'E', yLabel: 'E', unit: 'J', series: [{ key: 'Wg', color: '--fg' }, { key: 'Ekl', color: '--pos' }, { key: 'Ekw', color: '--vy' }] },
  ],
  createModel: () => new RotationModel(),
  // Room under the floor for the weight arrow and its name when the load lands.
  worldBounds: () => ({ xMin: -1.1, xMax: 1.1, yMin: -0.6, yMax: 1.95 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, gy = Y(0);
    drawSky(ctx, view, c, gy);
    drawGround(ctx, view, c, gy);
    // The wheel is drawn to scale (only a very small one is drawn a little bigger, so it stays visible).
    const cx = X(0), cy = Y(1.55), Rp = Math.max(12, p.R * S);
    // Beam above the axle, clear of the largest wheel (R = 0,3 m).
    support(ctx, X(-0.45), X(0.45), Y(1.9), c, 'up');
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.beginPath(); ctx.moveTo(cx, Y(1.9)); ctx.lineTo(cx, cy); ctx.stroke(); ctx.restore();
    // Wheel: a solid disc, or a ring with spokes; a mark shows the turning.
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(m.phi);
    ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    if (p.shape === 0) { ctx.fillStyle = c.track; ctx.beginPath(); ctx.arc(0, 0, Rp, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    else { ctx.fillStyle = c.track; ctx.beginPath(); ctx.arc(0, 0, Rp, 0, Math.PI * 2); ctx.arc(0, 0, Rp - 6, 0, Math.PI * 2, true); ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, Rp, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, Rp - 6, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1; for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (Rp - 6), Math.sin(a) * (Rp - 6)); ctx.stroke(); } }
    ctx.fillStyle = c.vy; ctx.fillRect(Rp * 0.45, -3, Rp * 0.4, 6);
    ctx.restore();
    ctx.save(); ctx.fillStyle = c.fg; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // String from the wheel's right edge down to the weight, which lands on the floor after its fall H.
    const bottom = H - m.s, w = Math.min(0.3, Math.max(0.12, 0.17 * Math.cbrt(p.m))) * S, top = Y(bottom) - w - 6;
    rope(ctx, [[cx + Rp, cy], [cx + Rp, top]], c);
    // The mass is written in the box when it fits, else beside it; the wheel is a body for the vector names.
    const mass = `${num(p.m, 2)} kg`;
    ctx.save(); ctx.font = `600 ${Math.min(13, Math.max(11, w * 0.42))}px Barlow, sans-serif`; const fits = w > 26 && ctx.measureText(mass).width <= w - 6; ctx.restore();
    weight(ctx, cx + Rp, top, w, w, c, fits ? mass : '');
    if (!fits) hint(ctx, mass, cx + Rp + w / 2 + 6, top + 6 + w / 2, c);
    reserve(ctx, cx - Rp, cy - Rp, 2 * Rp, 2 * Rp);
    if (toggles.forces) {
      // One scale for the whole run, short enough that the weight arrow and its name stay on the stage
      // (and above the result line that covers the stage's bottom edge on a phone) when the load reaches the floor.
      const per = Math.min(70, 0.2 * view.height, view.height - gy - 58) / (p.m * p.g);
      drawArrow(ctx, cx + Rp, top, cx + Rp, top - m.T * per, c.force, 'T');
      drawArrow(ctx, cx + Rp, top + 6 + w, cx + Rp, top + 6 + w + p.m * p.g * per, c.fg, 'mg');
    }
    if (toggles.omega && m.w > 0.05) { ctx.save(); ctx.strokeStyle = c.vy; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, Rp + 14, -Math.PI * 0.9, -Math.PI * 0.2); ctx.stroke(); ctx.restore(); drawArrow(ctx, cx + Math.cos(-Math.PI * 0.25) * (Rp + 14), cy + Math.sin(-Math.PI * 0.25) * (Rp + 14), cx + Math.cos(-Math.PI * 0.2) * (Rp + 14), cy + Math.sin(-Math.PI * 0.2) * (Rp + 14) + 1, c.vy, 'ω'); }
    label(ctx, `I = ${p.shape === 0 ? 'MR²/2' : 'MR²'} = ${num(m.I, 4)} kg·m²`, 12, 20, c, 'left');
  },
};

import { num } from '../../core/format.js';
import { drawArrow, ink, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { dot, wlColor } from '../optics.js';

const DUR = 4, HC = 1240, E = 1.602e-19, ME = 9.109e-31;
// Work function A (eV) of each cathode metal, in the order of the menu (caesium, potassium, sodium, zinc).
const WORK = [1.9, 2.2, 2.3, 4.2];
const params = [
  { key: 'metal', symbol: '', unit: '', min: 0, max: 3, step: 1, default: 0, kind: 'initial', options: ['caesium', 'potassium', 'sodium', 'zinc'] },
  { key: 'lam', symbol: 'λ', unit: 'nm', min: 150, max: 750, step: 5, default: 400, kind: 'initial', decimals: 0, color: '--acc' },
  { key: 'I', symbol: '', unit: '%', min: 10, max: 100, step: 10, default: 60, kind: 'initial', decimals: 0 },
];
const solve = (P) => { const Ef = HC / P.lam, A = WORK[P.metal], Ek = Ef - A; return { Ef, A, Ek, v: Ek > 0 ? Math.sqrt((2 * Ek * E) / ME) : 0 }; };

/** Photons hit the cathode; if hν > A each knocks out an electron with Ek = hν − A, which flies to the anode. */
class PhotoModel {
  t = 0; s = null; n = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.n = 0; this.reason = ''; this.s = solve(P); }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt); this.n = this.s.Ek > 0 ? Math.floor(this.t * this.P.I * 0.1) : 0;
    if (this.t >= DUR - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return true; }
  // With hν ≤ A no electron leaves the metal, so its energy and speed do not exist (NaN, shown as “—”).
  sample() { const on = this.s.Ek > 0; return { Ef: this.s.Ef, Ek: on ? this.s.Ek : NaN, v: on ? this.s.v / 1000 : NaN, n: this.n }; }
  clone() { return Object.assign(new PhotoModel(), this, { P: { ...this.P }, s: { ...this.s } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const s = this.s;
    return s.Ek > 0 ? text.msg.emitted(num(s.Ef, 2), num(s.Ek, 2), num(s.v / 1000, 0)) : text.msg.noEffect(num(s.Ef, 2), num(HC / s.A, 0));
  }
}

export default {
  id: 'photoeffect',
  params,
  presets: [
    { values: { metal: 0, lam: 400, I: 60 } },
    { values: { metal: 3, lam: 400, I: 100 } },
    { values: { metal: 3, lam: 200, I: 60 } },
  ],
  toggles: [],
  readouts: [
    { key: 'Ef', unit: 'eV', decimals: 2, color: '--acc' },
    { key: 'Ek', unit: 'eV', decimals: 2, color: '--vel' },
    { key: 'v', unit: 'km/s', decimals: 0, color: '--pos' },
    { key: 'n', unit: '', decimals: 0 },
  ],
  graphs: [{ id: 'n', yLabel: 'N', unit: '', series: [{ key: 'n', color: '--pos' }] }],
  createModel: () => new PhotoModel(),
  noTape: true,
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), col = wlColor(p.lam), s = m.s;
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.beginPath(); ctx.ellipse(X(5), Y(3), X(9.4) - X(5), Y(1) - Y(3), 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.fillRect(X(2), Y(4.2), X(2.4) - X(2), Y(1.8) - Y(4.2)); ctx.strokeRect(X(2), Y(4.2), X(2.4) - X(2), Y(1.8) - Y(4.2));
    ctx.fillRect(X(7.6), Y(4.2), X(7.9) - X(7.6), Y(1.8) - Y(4.2)); ctx.strokeRect(X(7.6), Y(4.2), X(7.9) - X(7.6), Y(1.8) - Y(4.2)); ctx.restore();
    // Names inside the bulb, beside the lower ends of the electrodes: under them the glass curves too close.
    hint(ctx, text.draw.cathode(text.draw.metals[p.metal]), X(2.4) + 6, Y(1.75), c); hint(ctx, text.draw.anode, X(7.6) - 6, Y(1.75), c, 'right');
    // Photons as short wavy arrows coming in from the upper left; their number, like the electrons', follows the intensity.
    const nPh = Math.max(1, Math.round(p.I / 10));
    for (let i = 0; i < nPh; i++) {
      const ph = (m.t * 1.2 + i / nPh) % 1, x0 = X(0.3) + ph * (X(2) - X(0.3)), y0 = Y(5.4) + ph * (Y(3 + (i - nPh / 2) * 0.3) - Y(5.4));
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.75; ctx.beginPath();
      for (let k = 0; k <= 12; k++) { const u = k / 12, xx = x0 - 22 * (1 - u), yy = y0 - 14 * (1 - u) + Math.sin(u * Math.PI * 4) * 3; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke(); ctx.restore();
    }
    if (s.Ek > 0 && m.t > 0) {
      const speed = Math.min(1.6, 0.35 + Math.sqrt(s.Ek) * 0.45);
      for (let i = 0; i < nPh; i++) { const ph = ((m.t * speed) + i / nPh) % 1, x = X(2.4) + ph * (X(7.6) - X(2.4)), y = Y(3 + ((i * 4) % 9 - 4) * 0.22); dot(ctx, x, y, 3.5, c.vel); }
      drawArrow(ctx, X(3), Y(4.3), X(4.4), Y(4.3), c.vel, 'e⁻'); // low enough that its name stays inside the bulb
    }
    label(ctx, s.Ek > 0 ? `hν = A + Ek:  ${num(s.Ef, 2)} = ${num(s.A, 2)} + ${num(s.Ek, 2)} eV` : `hν = ${num(s.Ef, 2)} eV ≤ A = ${num(s.A, 2)} eV`, 12, 20, c, 'left');
    if (s.Ek <= 0) hint(ctx, text.draw.noEmission, 12, 46, c);
  },
};

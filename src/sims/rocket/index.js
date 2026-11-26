import { num } from '../../core/format.js';
import { drawArrow, drawGround, ink, label, reserve, theme } from '../../ui/canvas.js';
import { gParam, hint } from '../kit.js';

const params = [
  { key: 'M', symbol: 'M', unit: 'kg', min: 100, max: 2000, step: 50, default: 500, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'mf', symbol: '', unit: 'kg', min: 100, max: 5000, step: 50, default: 1500, kind: 'initial', decimals: 0 },
  { key: 'u', symbol: 'u', unit: 'm/s', min: 1000, max: 4000, step: 100, default: 2500, kind: 'initial', decimals: 0, color: '--vel' },
  { key: 'q', symbol: 'μ', unit: 'kg/s', min: 25, max: 100, step: 5, default: 50, kind: 'initial', decimals: 0 },
  // 0: in space, no gravity; 1: straight up from the ground.
  { key: 'mode', symbol: '', unit: '', min: 0, max: 1, step: 1, default: 0, kind: 'initial', options: ['space', 'ground'] },
  gParam,
];

/**
 * Rocket burning fuel at μ kg/s, gas leaving at u relative to it. Tsiolkovsky: υ = u ln(m₀/m) − g′t (g′ = 0 in space).
 * From the ground the rocket only rises once the thrust μu exceeds its weight mg: until then it stands on the pad
 * (υ = 0) while the fuel burns. It lifts off at t₁ with mass m₁ = μu/g, and then υ = u ln(m₁/m) − g(t − t₁).
 */
class RocketModel {
  t = 0; y = 0; v = 0; m = 0; F = 0; a = 0; tb = 0; tl = 0; ml = 0; reason = ''; p = null;
  reset(p) {
    this.p = { ...p }; this.t = 0; this.y = 0; this.v = 0; this.m = p.M + p.mf; this.F = p.q * p.u; this.tb = p.mf / p.q; this.reason = '';
    // Lift-off: at once if the thrust beats the starting weight, later (or never) if it does not.
    const g = this.gg(), m0 = p.M + p.mf;
    this.ml = g > 0 ? Math.min(m0, this.F / g) : m0;
    this.tl = (m0 - this.ml) / p.q; // ≥ tb means the rocket never leaves the pad
    this.acc();
  }
  gg() { return this.p.mode === 1 ? this.p.g : 0; }
  onPad(t) { return this.gg() > 0 && t < this.tl; }
  /** Speed and height (exact for the burning phase). */
  motion(t) {
    const p = this.p, g = this.gg();
    if (this.onPad(t)) return { v: 0, y: 0 };
    const tau = t - this.tl, m = this.ml - p.q * tau, L = Math.log(this.ml / m);
    return { v: p.u * L - g * tau, y: p.u * (tau - (m / p.q) * L) - 0.5 * g * tau * tau };
  }
  acc() { this.a = this.onPad(this.t) ? 0 : this.F / this.m - this.gg(); }
  step(dt) {
    if (this.reason) return false;
    const d = Math.min(dt, this.tb - this.t);
    this.t += d; this.m = this.p.M + this.p.mf - this.p.q * this.t;
    const s = this.motion(Math.min(this.t, this.tb)); this.v = s.v; this.y = Math.max(0, s.y);
    if (this.t >= this.tb - 1e-9) { this.m = this.p.M; this.F = 0; this.a = this.y > 0 ? -this.gg() : 0; this.reason = this.tl >= this.tb - 1e-9 && this.gg() > 0 ? 'pad' : 'out'; return false; }
    this.acc(); return true;
  }
  isValid() { return [this.t, this.y, this.v, this.m].every(Number.isFinite); }
  sample() { return { v: this.v, m: this.m, F: this.F / 1000, a: this.a, y: this.y / 1000 }; }
  clone() { return Object.assign(new RocketModel(), this, { p: { ...this.p } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const p = this.p, msg = text.msg;
    if (this.reason === 'pad') return msg.pad(num(this.tb, 1), num(this.F0() / 1000, 1), num((p.M * p.g) / 1000, 1));
    const wait = this.gg() > 0 && this.tl > 1e-9 ? msg.waited(num(this.tl, 1), num(this.ml, 0)) : '';
    return (this.gg() > 0 ? msg.ground : msg.space)(num(this.tb, 1), num(this.v, 1), num(this.y / 1000, 1)) + wait;
  }
  F0() { return this.p.q * this.p.u; }
}

export default {
  id: 'rocket',
  params,
  noTape: true,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { M: 500, mf: 1500, u: 2500, q: 50, mode: 0, g: 9.81 } },
    { values: { M: 500, mf: 1500, u: 2500, q: 50, mode: 1, g: 9.81 } },
    { values: { M: 200, mf: 1800, u: 3000, q: 60, mode: 0, g: 9.81 } },
  ],
  toggles: [{ key: 'forces', default: true }, { key: 'gas', default: true }],
  readouts: [
    { key: 'v', unit: 'm/s', decimals: 1, color: '--vel' },
    { key: 'm', unit: 'kg', decimals: 0, color: '--pos' },
    { key: 'a', unit: 'm/s²', decimals: 2, color: '--acc' },
    { key: 'F', unit: 'kN', decimals: 1, color: '--force' },
    { key: 'y', unit: 'km', decimals: 2 },
  ],
  graphs: [
    { id: 'v', yLabel: 'υ', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
    { id: 'm', yLabel: 'm', unit: 'kg', series: [{ key: 'm', color: '--pos' }] },
  ],
  createModel: () => new RocketModel(),
  worldBounds: () => ({ xMin: -6, xMax: 6, yMin: 0, yMax: 10 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    // Space is dark in both themes: the darker of the body ink and the page colour, with the other one for the stars and the text.
    const lum = (s) => { const h = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})/i.exec(s); return h ? 2 * parseInt(h[1], 16) + 3 * parseInt(h[2], 16) + parseInt(h[3], 16) : 0; };
    const [night, starInk] = lum(c.body) <= lum(c.surface) ? [c.body, c.surface] : [c.surface, c.body];
    ctx.fillStyle = p.mode === 1 ? c.surface : night; ctx.fillRect(0, 0, view.width, view.height);
    const ink2 = p.mode === 1 ? c.fg : starInk;
    // Scenery scrolls past (schematic, not to scale): marks every 1.8 km on Earth, stars in space.
    ctx.save(); ctx.fillStyle = ink2; ctx.strokeStyle = c.line; ctx.lineWidth = 1;
    const k = 10 / 600; // with the 0.05 below: 1/1200 world units of scroll per metre of flight
    for (let i = -2; i < 14; i++) {
      const yy = (((i * 1.5 - m.y * k * 0.05) % 21) + 21) % 21 - 3;
      if (p.mode === 1) { ctx.beginPath(); ctx.moveTo(X(-6), Y(yy)); ctx.lineTo(X(-4.5), Y(yy)); ctx.stroke(); }
      else for (const sx of [-5, -3.2, 3.6, 5.1]) { const qx = X(sx + (i % 3)), qy = Y(yy + (sx % 2)); if (qx > 250 || qy > 84) ctx.fillRect(qx, qy, 2, 2); } // none behind the text at the top left
    }
    ctx.restore();
    // On Earth: the launch pad, scrolling down as the rocket climbs.
    const padY = Y(2.8 - m.y * k * 0.05);
    if (p.mode === 1 && padY < view.height) { ctx.save(); drawGround(ctx, view, c, padY); ctx.restore(); }
    // Rocket body: a column with a nose and fins; fuel level drawn inside.
    const cx = X(0), base = Y(3), Hh = 4 * S, Wd = 0.9 * S;
    ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.moveTo(cx - Wd / 2, base); ctx.lineTo(cx - Wd / 2, base - Hh); ctx.lineTo(cx, base - Hh - 0.9 * S); ctx.lineTo(cx + Wd / 2, base - Hh); ctx.lineTo(cx + Wd / 2, base); ctx.closePath(); ctx.fill(); ctx.stroke();
    const fuel = (m.m - p.M) / Math.max(1, p.mf);
    ctx.fillStyle = c.accent; ctx.fillRect(cx - Wd / 2 + 4, base - 4 - (Hh * 0.7 - 8) * fuel, Wd - 8, (Hh * 0.7 - 8) * fuel);
    for (const sgn of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx + sgn * Wd / 2, base - 0.9 * S); ctx.lineTo(cx + sgn * (Wd / 2 + 0.45 * S), base + 0.2 * S); ctx.lineTo(cx + sgn * Wd / 2, base); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.restore();
    // Text first, so the vector names keep off it.
    const late = p.mode === 1 && m.tl > 1e-9;
    label(ctx, `υ = u ln(${late ? 'm₁' : 'm₀'}/m)${p.mode === 1 ? (late ? ' − g(t − t₁)' : ' − gt') : ''} = ${num(m.v, 0)} m/s`, 12, 20, c, 'left');
    if (late) hint(ctx, m.tl < m.tb ? text.draw.waits(num(m.tl, 1)) : text.draw.stuck, 12, 70, { ...c, muted: ink2 });
    hint(ctx, `F = μu = ${num((p.q * p.u) / 1000, 1)} kN`, 12, 46, { ...c, muted: ink2 });
    reserve(ctx, cx - Wd / 2 - 0.45 * S, base - Hh - 0.9 * S, Wd + 0.9 * S, Hh + 1.1 * S); // the rocket and its fins
    // The outline behind the vector names is the colour they sit on: in space, the night (restored at the end).
    const halo = theme.halo;
    if (p.mode !== 1) theme.halo = night;
    if (toggles.gas && !m.reason) {
      // Exhaust: dashes leaving the nozzle straight down, in a plume that widens with distance; the middle is
      // left clear for the arrow of the gas velocity u.
      ctx.save(); ctx.strokeStyle = c.vel; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7;
      for (let i = 0; i < 12; i++) {
        const ph = (m.t * 6 + i / 12) % 1, side = i % 2 ? 1 : -1, lane = 1 + ((i * 5) % 3);
        const yy = base + 3 + ph * 2 * S, xx = cx + side * lane * (Wd / 7) * (0.7 + 0.6 * ph);
        ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + 10); ctx.stroke();
      }
      ctx.restore();
      drawArrow(ctx, cx, base + 3, cx, base + 3 + Math.max(24, Math.min(60, 1.6 * S, view.height - 30 - base)), c.vel, 'u');
    }
    if (toggles.forces) {
      // One scale for all forces: the largest of F and mg is 70 px (less where the stage over the nose is short).
      // F is drawn from the nose, mg from the middle of the body, beside it; on the pad the ground pushes up with N = mg − F.
      const nose = base - Hh - 0.9 * S, W = p.mode === 1 ? m.m * p.g : 0, pad = p.mode === 1 && m.y <= 0 && m.v <= 0;
      // mg, beyond the fins, ends above the pad.
      const k70 = Math.min(Math.max(24, Math.min(70, nose - 34)) / Math.max(1, m.F, W), W > 0 ? (Hh / 2 + 0.2 * S - 20) / W : Infinity);
      if (m.F > 0) drawArrow(ctx, cx, nose - 3, cx, nose - 3 - m.F * k70, c.force, 'F');
      if (W > 0) drawArrow(ctx, cx - Wd / 2 - 0.45 * S - 10, base - Hh / 2, cx - Wd / 2 - 0.45 * S - 10, base - Hh / 2 + W * k70, ink2, 'mg');
      if (pad && W - m.F > 1) drawArrow(ctx, cx + Wd + 4, base + 0.2 * S, cx + Wd + 4, base + 0.2 * S - (W - m.F) * k70, c.fg, 'N');
    }
    theme.halo = halo;
  },
};

import { num } from '../../core/format.js';
import { drawArrow, drawGround, drawSky, ink, label, reserve } from '../../ui/canvas.js';
import { gParam, hint } from '../kit.js';

const params = [
  { key: 'k', symbol: 'k', unit: 'N/m', min: 100, max: 2000, step: 50, default: 500, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'x', symbol: 'x', unit: 'm', min: 0.02, max: 0.3, step: 0.01, default: 0.1, kind: 'initial', decimals: 2, color: '--force' },
  { key: 'm', symbol: 'm', unit: 'kg', min: 0.05, max: 1, step: 0.05, default: 0.1, kind: 'initial', decimals: 2, color: '--pos' },
  gParam,
];

/**
 * On the spring the ball swings harmonically about y = −mg/k, from y = −x up to y = x − 2mg/k.
 * It reaches the free end (y = 0) and flies off only if x > 2mg/k (energy: ½kx² > mgx).
 */
const launches = (p) => p.x > (2 * p.m * p.g) / p.k + 1e-9;
/** Where the launcher's floor is drawn: below the lowest point the spring's top ever reaches. */
const floorY = (p) => -Math.max(0.35, Math.max(p.x, (2 * p.m * p.g) / p.k - p.x) + 0.05);

/**
 * A ball on a vertical spring compressed by x is released. On the spring the motion is harmonic about
 * y = −mg/k (solved exactly); off it the ball flies up and falls back. y = 0 is the spring's free end.
 * If x ≤ 2mg/k the ball never reaches the free end: it rides one full oscillation on the spring.
 * Energies: elastic ½ky² (y < 0), kinetic ½mυ², potential mg(y + x) counted from the start.
 */
class SpringEnergyModel {
  t = 0; y = 0; v = 0; t1 = 0; v1 = 0; w = 0; A = 0; yeq = 0; launch = false; end = 0; reason = ''; top = 0; p = null; eLo = 0; eHi = 0;
  reset(p) {
    this.p = { ...p }; this.t = 0; this.reason = '';
    this.w = Math.sqrt(p.k / p.m); this.yeq = -(p.m * p.g) / p.k; this.A = -p.x - this.yeq;
    this.launch = launches(p);
    if (this.launch) {
      this.t1 = Math.acos(-this.yeq / this.A) / this.w;
      this.v1 = -this.A * this.w * Math.sin(this.w * this.t1);
      this.end = this.t1 + (2 * this.v1) / p.g;
    } else { this.t1 = Infinity; this.v1 = 0; this.end = (2 * Math.PI) / this.w; }
    // Highest point of the ball above its start: in flight from energy, on the spring the top of the swing.
    this.top = this.launch ? p.x + (this.v1 * this.v1) / (2 * p.g) : Math.max(0, 2 * (p.x + this.yeq));
    // Range of every energy over the whole run, so the bars share one honest scale.
    this.eLo = 0; this.eHi = 0;
    for (let i = 0; i <= 400; i++) {
      this.place((this.end * i) / 400);
      const s = this.sample();
      for (const v of [s.Ee, s.Ek, s.Ep, s.E]) { this.eLo = Math.min(this.eLo, v); this.eHi = Math.max(this.eHi, v); }
    }
    this.place(0);
  }
  place(t) {
    if (t <= this.t1) { this.y = this.yeq + this.A * Math.cos(this.w * t); this.v = -this.A * this.w * Math.sin(this.w * t); }
    else { const u = t - this.t1, g = this.p.g; this.y = this.v1 * u - 0.5 * g * u * u; this.v = this.v1 - g * u; }
  }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(this.end, this.t + dt); this.place(this.t);
    if (this.t >= this.end - 1e-12) { this.reason = this.launch ? 'back' : 'weak'; return false; }
    return true;
  }
  isValid() { return [this.t, this.y, this.v].every(Number.isFinite); }
  sample() {
    const p = this.p, Ee = this.y < 0 ? 0.5 * p.k * this.y * this.y : 0, Ek = 0.5 * p.m * this.v * this.v, Ep = p.m * p.g * (this.y + p.x);
    return { Ee, Ek, Ep, E: Ee + Ek + Ep, h: this.y + p.x, v: this.v };
  }
  clone() { return Object.assign(new SpringEnergyModel(), this, { p: { ...this.p } }); }
  /** The run's outcome in words; `text` is this simulation's text (sims/energy-forms/<locale>.js). */
  finishMessage(text) {
    const msg = text.msg;
    const p = this.p, E = 0.5 * p.k * p.x * p.x, x0 = (p.m * p.g) / p.k;
    if (this.reason === 'weak') {
      const why = msg.weak(num(2 * x0, 3), num(p.x, 2));
      if (this.top > 1e-9) return msg.weakRose(why, num(this.top, 2));
      if (p.x >= x0 - 1e-9) return msg.weakBalanced(why);
      return msg.weakSank(why, num(x0, 3));
    }
    if (this.reason === 'back') return msg.back(num(this.top, 2), num(this.v1, 2), num(E, 2));
    return '';
  }
}

export default {
  id: 'energy-forms',
  params,
  stageSize: 'tall',
  viewPadding: { left: 24, right: 24, top: 24, bottom: 24 },
  presets: [
    { values: { k: 500, x: 0.1, m: 0.1, g: 9.81 } },
    { values: { k: 500, x: 0.2, m: 0.1, g: 9.81 } },
    { values: { k: 1000, x: 0.15, m: 0.5, g: 9.81 } },
    { values: { k: 100, x: 0.02, m: 0.5, g: 9.81 } },
  ],
  toggles: [
    { key: 'bars', default: true },
    { key: 'vel', default: true },
  ],
  readouts: [
    { key: 'Ee', unit: 'J', decimals: 2, color: '--force' },
    { key: 'Ek', unit: 'J', decimals: 2, color: '--vel' },
    { key: 'Ep', unit: 'J', decimals: 2, color: '--pos' },
    { key: 'h', unit: 'm', decimals: 2 },
  ],
  graphs: [
    { id: 'E', yLabel: 'E', unit: 'J', series: [{ key: 'Ee', color: '--force' }, { key: 'Ek', color: '--vel' }, { key: 'Ep', color: '--pos' }, { key: 'E', color: '--fg' }] },
    { id: 'h', yLabel: 'h', unit: 'm', series: [{ key: 'h', color: '--pos' }] },
  ],
  createModel: () => new SpringEnergyModel(),
  worldBounds(p) {
    const top = launches(p) ? (0.5 * p.k * p.x * p.x) / (p.m * p.g) - p.x : 0.1;
    const yMax = Math.max(top + 0.15, 0.6);
    return { xMin: -yMax * 0.45, xMax: yMax * 0.55, yMin: floorY(p) - 0.1, yMax };
  },

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    const base = floorY(p); // floor of the launcher, below the lowest point of the spring's top
    drawSky(ctx, view, c, Y(base));
    drawGround(ctx, view, c, Y(base));
    const r = Math.min(22, Math.max(11, (0.04 + 0.05 * Math.cbrt(p.m)) * S));
    const springTop = Math.min(0, m.y); // the spring follows the ball while they touch
    // Launcher tube and spring coil from the floor to its top.
    const tw = Math.max(2.6 * r, 0.12 * S, 26);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.moveTo(X(0) - tw / 2, Y(base)); ctx.lineTo(X(0) - tw / 2, Y(0.02)); ctx.moveTo(X(0) + tw / 2, Y(base)); ctx.lineTo(X(0) + tw / 2, Y(0.02)); ctx.stroke();
    const n = 10, y0 = Y(base), y1 = Y(springTop);
    ctx.strokeStyle = c.iron; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(0), y0);
    for (let i = 1; i < n; i++) ctx.lineTo(X(0) + (i % 2 ? -1 : 1) * (tw / 2 - 3), y0 + ((y1 - y0) * i) / n);
    ctx.lineTo(X(0), y1); ctx.stroke();
    ctx.fillStyle = c.fg; ctx.fillRect(X(0) - tw / 2 + 2, y1 - 2, tw - 4, 3);
    ctx.restore();
    // Ball resting on the spring's end.
    const by = Y(m.y) - r - 1;
    ctx.save(); ctx.fillStyle = c.body; ctx.beginPath(); ctx.arc(X(0), by, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // Highest point mark.
    const hText = `H = kx² / (2mg) = ${num(m.top, 2)} m`, ty = m.launch ? Y(m.top - p.x) - 2 * r - 1 : -Infinity;
    if (m.launch) {
      ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = c.ghost; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(0) - 3 * r, ty); ctx.lineTo(X(0) + 3 * r, ty); ctx.stroke(); ctx.restore();
      hint(ctx, hText, X(0) + 3 * r + 6, ty, c);
    }
    // Velocity beside the ball; going down it stops short of the floor, so it and its name stay above the ground.
    // The launcher and the ball are bodies: the name goes beside them, not on them.
    reserve(ctx, X(0) - tw / 2, Math.min(Y(0.02), y1), tw, Y(base) - Math.min(Y(0.02), y1)); reserve(ctx, X(0) - r, by - r, 2 * r, 2 * r);
    if (toggles.vel && Math.abs(m.v) > 0.05) drawArrow(ctx, X(0) - 2 * r, by, X(0) - 2 * r, by - Math.sign(m.v) * Math.min(80, 9 * Math.abs(m.v), m.v < 0 ? Math.max(12, Y(base) - by - 24) : 80), c.vel, 'υ');
    if (toggles.bars) {
      // One scale for the whole run: from the lowest energy (Eₚ < 0 when the ball sinks below its start)
      // to the highest (Eₑ can exceed the total then), so no bar leaves its box.
      // The bars stand in the top-right corner, right of the ball's path; when the line of the highest
      // point and its value would run into them, they move down below that line.
      const sm = m.sample(), hi = Math.max(m.eHi, 1e-9), lo = Math.min(0, m.eLo), span = hi - lo, bx0 = view.width - 175;
      ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; const hEnd = X(0) + 3 * r + 6 + ctx.measureText(hText).width; ctx.restore();
      const bh0 = Math.min(150, view.height * 0.45), by0 = m.launch && hEnd > bx0 - 6 && ty < 24 + bh0 + 30 ? ty + 16 : 24, bh = Math.min(bh0, Y(base) - 24 - by0);
      const zero = by0 + (bh * hi) / span;
      const bar = (i, v, col, name) => {
        const x = bx0 + i * 46, hh = (v / span) * bh;
        ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, by0 + 0.5, 24, bh);
        ctx.fillStyle = col; ctx.fillRect(x + 1, hh >= 0 ? zero - hh : zero, 23, Math.abs(hh));
        if (lo < 0) { ctx.beginPath(); ctx.moveTo(x, Math.round(zero) + 0.5); ctx.lineTo(x + 25, Math.round(zero) + 0.5); ctx.stroke(); }
        ctx.fillStyle = c.fg; ctx.font = '500 12px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText(name, x + 12, by0 + bh + 4); ctx.restore();
      };
      const names = text.draw.bars;
      bar(0, sm.Ee, c.force, names.Ee); bar(1, sm.Ek, c.vel, names.Ek); bar(2, sm.Ep, c.pos, names.Ep); bar(3, sm.E, c.fg, names.E);
    }
    label(ctx, `E = kx²/2 = ${num(0.5 * p.k * p.x * p.x, 2)} J`, 12, 20, c, 'left');
  },
};

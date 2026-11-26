import { num } from '../../core/format.js';
import { drawArrow, fonts, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { dot } from '../optics.js';

const DUR = 5, C = 299792.458, GROW = 0.6; // the picture expands by 60 % over the run
const params = [
  { key: 'H', symbol: 'H₀', unit: 'km/(s·Mpc)', min: 50, max: 100, step: 1, default: 70, kind: 'initial', decimals: 0, color: '--acc' },
  { key: 'r', symbol: 'r', unit: 'Mpc', min: 10, max: 1000, step: 10, default: 100, kind: 'initial', decimals: 0, color: '--pos' },
];
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
const GAL = (() => { const r = rnd(9); return Array.from({ length: 46 }, () => { const a = r() * Math.PI * 2, d = 0.15 + 0.85 * Math.sqrt(r()); return [Math.cos(a) * d, Math.sin(a) * d]; }); })();

/** Every distance grows by the same factor, so far galaxies recede faster: υ = H₀r. The picture is a sketch; values are from the law. */
class HubbleModel {
  t = 0; k = 1; v = 0; z = 0; age = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.k = 1; this.reason = ''; this.v = P.H * P.r; this.z = this.v / C; this.age = 977.8 / P.H; }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt); this.k = 1 + GROW * (this.t / DUR);
    if (this.t >= DUR - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.v); }
  sample() { return { v: this.v, z: this.z, age: this.age, k: this.k }; }
  clone() { return Object.assign(new HubbleModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { return this.reason ? text.msg.end(num(this.v, 0), num(this.z, 4), num(this.age, 1)) : ''; }
}

export default {
  id: 'hubble',
  params,
  noTape: true,
  presets: [
    { values: { H: 70, r: 100 } },
    { values: { H: 70, r: 500 } },
    { values: { H: 100, r: 50 } },
  ],
  toggles: [],
  readouts: [
    { key: 'v', unit: 'km/s', decimals: 0, color: '--vel' },
    { key: 'z', unit: '', decimals: 4, color: '--force' },
    { key: 'age', unit: 'Gyr', decimals: 1, color: '--acc' },
  ],
  graphs: [{ id: 'k', yLabel: 'a', unit: '', series: [{ key: 'k', color: '--pos' }] }],
  createModel: () => new HubbleModel(),
  worldBounds: () => ({ xMin: -1.8, xMax: 1.8, yMin: -1.6, yMax: 1.6 }),
  viewPadding: { left: 12, right: 12, top: 40, bottom: 12 },

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), k = m.k / (1 + GROW), X0 = X(0), Y0 = Y(0);
    const d = (0.25 + 0.75 * Math.min(1, p.r / 1000)) * 1.6 * k, gx = X(d * 0.8), gy = Y(d * 0.6), L = 30 * (0.4 + d), tx = gx + 0.8 * L, ty = gy - 0.6 * L;
    // The other galaxies drift outward and are left out where one would sit on a caption, on the chosen galaxy or on
    // its arrow (as if behind them).
    ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; const mw = ctx.measureText(text.draw.milkyWay).width, rw = ctx.measureText(text.draw.distance(num(p.r, 0))).width, sw = ctx.measureText(text.draw.sketch).width;
    ctx.font = `700 12px ${fonts.mono}`; const lw = ctx.measureText(`υ = H₀r = ${num(m.v, 0)} km/s`).width + 16; ctx.restore();
    const keep = [[0, 0, 12 + Math.max(lw, sw) + 6, 56], [X0 - mw / 2, Y0 - 8, X0 + mw / 2, Y0 + 24], [gx - 8, gy - 8, gx + 10 + rw, gy + 24], [gx - 6, ty - 24, tx + 24, gy + 6]];
    for (const [ax, ay] of GAL) { const x = X(ax * k * 1.6), y = Y(ay * k * 1.6); if (!keep.some((q) => x > q[0] - 4 && x < q[2] + 4 && y > q[1] - 4 && y < q[3] + 4)) dot(ctx, x, y, 3, c.muted); }
    dot(ctx, X0, Y0, 6, c.accent); hint(ctx, text.draw.milkyWay, X0, Y0 + 16, c, 'center');
    dot(ctx, gx, gy, 6, c.force);
    drawArrow(ctx, gx, gy, tx, ty, c.vel, 'υ');
    hint(ctx, text.draw.distance(num(p.r, 0)), gx + 8, gy + 16, c);
    label(ctx, `υ = H₀r = ${num(m.v, 0)} km/s`, 12, 20, c, 'left');
    hint(ctx, text.draw.sketch, 12, 46, c);
  },
};

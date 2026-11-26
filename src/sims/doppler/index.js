import { num } from '../../core/format.js';
import { drawArrow, ink, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { dot } from '../optics.js';

const C_S = 340, DUR = 5, EMIT = 0.25; // m/s, s, s between drawn fronts
const START = [[-680, 680], [-170, 170]]; // x of the source and of the observer at t = 0, m: approaching / receding
const params = [
  { key: 'f0', symbol: 'ν₀', unit: 'Hz', min: 200, max: 1000, step: 10, default: 500, kind: 'initial', decimals: 0, color: '--acc' },
  { key: 'vs', symbol: 'υ_m', unit: 'm/s', min: 0, max: 100, step: 1, default: 25, kind: 'initial', decimals: 0, color: '--vel' },
  { key: 'vo', symbol: 'υ_k', unit: 'm/s', min: 0, max: 100, step: 1, default: 0, kind: 'initial', decimals: 0 },
  { key: 'dir', symbol: '', unit: '', min: 0, max: 1, step: 1, default: 0, kind: 'initial', options: ['approaching', 'receding'] },
];

/**
 * Source and observer on one line, both moving towards (dir 0) or away from (dir 1) each other; sound speed 340 m/s in still air.
 * Heard frequency ν = ν₀(υ ± υ_k)/(υ ∓ υ_m), but only once the first front has reached the observer. World units are metres.
 * `fronts` only grows, so snapshots share it and keep their own count `nF`; a copy that appends to a shared array copies it first.
 */
class DopplerModel {
  t = 0; xs = 0; xo = 0; fh = 0; f = NaN; lam = 0; dist = 0; tHear = 0; reason = ''; P = null; fronts = []; nF = 0;
  reset(P) {
    this.P = { ...P }; this.t = 0; this.reason = '';
    const s = P.dir === 0 ? 1 : -1, [a, b] = START[P.dir];
    this.fh = (P.f0 * (C_S + s * P.vo)) / (C_S - s * P.vs);
    this.lam = (C_S - s * P.vs) / P.f0;
    this.tHear = (b - a) / (C_S + s * P.vo); // the front sent at t = 0 meets the observer
    this.fronts = []; this.nF = 0; this.pos();
  }
  pos() {
    const P = this.P, s = P.dir === 0 ? 1 : -1, [a, b] = START[P.dir];
    this.xs = a + s * P.vs * this.t; this.xo = b - s * P.vo * this.t; this.dist = Math.abs(this.xo - this.xs);
    this.f = this.t >= this.tHear - 1e-9 ? this.fh : NaN;
  }
  emit() {
    const P = this.P, s = P.dir === 0 ? 1 : -1, a = START[P.dir][0];
    while (this.nF * EMIT <= this.t + 1e-9) {
      const te = this.nF * EMIT;
      if (this.fronts.length !== this.nF) this.fronts = this.fronts.slice(0, this.nF);
      this.fronts.push({ te, x: a + s * P.vs * te }); this.nF++;
    }
  }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt); this.emit(); this.pos();
    if (this.t >= DUR - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return [this.fh, this.lam, this.dist].every(Number.isFinite); }
  sample() { return { f: this.f, f0: this.P.f0, dist: this.dist, lam: this.lam }; }
  clone() { return Object.assign(new DopplerModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { return this.reason ? text.msg.end(num(this.fh, 1), num(this.P.f0, 0), num(this.lam, 3), num(this.tHear, 2)) : ''; }
}

export default {
  id: 'doppler',
  params,
  stageSize: 'strip',
  presets: [
    { values: { f0: 500, vs: 25, vo: 0, dir: 0 } },
    { values: { f0: 500, vs: 25, vo: 0, dir: 1 } },
    { values: { f0: 700, vs: 30, vo: 0, dir: 0 } },
    { values: { f0: 500, vs: 0, vo: 25, dir: 0 } },
  ],
  toggles: [],
  readouts: [
    { key: 'f', unit: 'Hz', decimals: 1, color: '--acc' },
    { key: 'lam', unit: 'm', decimals: 3, color: '--vel' },
    { key: 'dist', unit: 'm', decimals: 0, color: '--pos' },
  ],
  graphs: [
    { id: 'f', yLabel: 'ν', unit: 'Hz', series: [{ key: 'f', color: '--acc' }, { key: 'f0', color: '--ghost', ahead: true }] },
    { id: 'd', yLabel: 's', unit: 'm', series: [{ key: 'dist', color: '--pos' }] },
  ],
  createModel: () => new DopplerModel(),
  worldBounds: () => ({ xMin: -850, xMax: 850, yMin: -480, yMax: 480 }), // tall enough that the fronts read as circles on a phone
  viewPadding: { left: 12, right: 12, top: 40, bottom: 12 },

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    // The fronts fill the stage below the two caption lines at the top.
    ctx.save(); ctx.beginPath(); ctx.rect(0, 56, view.width, view.height - 56); ctx.clip();
    ctx.strokeStyle = c.accent; ctx.lineWidth = 1.25;
    for (let i = 0; i < m.nF; i++) { const f = m.fronts[i], r = C_S * (m.t - f.te) * S; if (r > 0) { ctx.beginPath(); ctx.arc(X(f.x), Y(0), r, 0, Math.PI * 2); ctx.stroke(); } }
    ctx.restore();
    // A caption on a clear patch of the stage, so the fronts do not run through its letters.
    const caption = (s, x, y) => {
      ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; const w = ctx.measureText(s).width, l = Math.max(4, Math.min(x - w / 2, view.width - w - 4));
      ctx.fillStyle = c.surface; ctx.fillRect(l - 3, y - 8, w + 6, 16); ctx.restore(); hint(ctx, s, x, y, c, 'center');
    };
    ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.fillRect(X(m.xs) - 14, Y(0) - 9, 28, 18); ctx.strokeRect(X(m.xs) - 14, Y(0) - 9, 28, 18); ctx.restore();
    caption(text.draw.source, X(m.xs), Y(0) + 22);
    dot(ctx, X(m.xo), Y(0), 7, c.force); caption(text.draw.observer, X(m.xo), Y(0) + 22);
    if (!Number.isFinite(m.f)) caption(text.draw.notYet, X(m.xo), Y(0) - 22);
    // Velocities, both on one scale (at most 2.2 px per m/s), each pointing the way its body moves.
    const s = p.dir === 0 ? 1 : -1, k = Math.min(2.2, (0.3 * view.width) / 100);
    drawArrow(ctx, X(m.xs) + s * 16, Y(0), X(m.xs) + s * (16 + p.vs * k), Y(0), c.vel, 'υ_m');
    drawArrow(ctx, X(m.xo) - s * 9, Y(0), X(m.xo) - s * (9 + p.vo * k), Y(0), c.vel, 'υ_k');
    const up = p.dir === 0;
    label(ctx, `ν = ν₀·(υ ${up ? '+' : '−'} υ_k)/(υ ${up ? '−' : '+'} υ_m) = ${num(m.fh, 1)} Hz`, 12, 20, c, 'left');
    hint(ctx, text.draw.fronts(num(EMIT, 2)), 12, 46, c);
  },
};

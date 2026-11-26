import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { dot, region, wlColor } from '../optics.js';

// The run: the electron circles on orbit n, jumps to orbit k at TJ (a Bohr jump has no in-between states), and the photon flies off.
const DUR = 4, TJ = 1.2, RY = 1.097e7;
const params = [
  { key: 'n', symbol: 'n', unit: '', min: 2, max: 7, step: 1, default: 3, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'k', symbol: 'k', unit: '', min: 0, max: 2, step: 1, default: 1, kind: 'initial', options: ['lyman', 'balmer', 'paschen'] },
];
/** Lower orbit k (the menu is 0-based) and upper orbit n; n must be above k, so it is raised to k + 1 if needed. */
const levels = (P) => { const k = P.k + 1, n = Math.max(P.n, k + 1); return { n, k, raised: n !== P.n }; };
const level = (q) => -13.6 / (q * q); // eV
const solve = (P) => { const { n, k, raised } = levels(P), dE = 13.6 * (1 / (k * k) - 1 / (n * n)), lam = 1e9 / (RY * (1 / (k * k) - 1 / (n * n))); return { n, k, raised, dE, lam }; };

/** Bohr model of hydrogen: the electron jumps from orbit n to k and emits a photon hν = E_n − E_k. */
class BohrModel {
  t = 0; s = null; f = 0; E = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.f = 0; this.reason = ''; this.s = solve(P); this.E = level(this.s.n); }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt); this.f = this.t / DUR; this.E = level(this.t >= TJ ? this.s.k : this.s.n);
    if (this.t >= DUR - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.E); }
  sample() { return { E: this.E, dE: this.s.dE, lam: this.s.lam, En: level(this.s.n) }; }
  clone() { return Object.assign(new BohrModel(), this, { P: { ...this.P }, s: { ...this.s } }); }
  finishMessage(text) {
    const s = this.s;
    if (!this.reason) return '';
    const note = s.raised ? text.msg.raised(s.n) : '';
    return text.msg.jump(s.n, s.k, num(s.dE, 2), num(s.lam, 0), region(s.lam)) + note;
  }
}

export default {
  id: 'bohr',
  params,
  noTape: true,
  // The upper orbit must lie above the lower one: the n slider moves up when needed, so it always shows the jump simulated.
  restartValues: (p) => ({ n: Math.max(p.n, p.k + 2) }),
  presets: [
    { values: { n: 3, k: 1 } },
    { values: { n: 2, k: 0 } },
    { values: { n: 4, k: 1 } },
  ],
  toggles: [],
  readouts: [
    { key: 'E', unit: 'eV', decimals: 2, color: '--force' },
    { key: 'dE', unit: 'eV', decimals: 2, color: '--acc' },
    { key: 'lam', unit: 'nm', decimals: 0, color: '--vel' },
    { key: 'En', unit: 'eV', decimals: 2 },
  ],
  graphs: [{ id: 'E', unit: 'eV', series: [{ key: 'E', color: '--force' }] }],
  createModel: () => new BohrModel(),
  worldBounds: () => ({ xMin: -6, xMax: 10, yMin: -4.2, yMax: 4.2 }),
  viewPadding: { left: 12, right: 12, top: 40, bottom: 12 },

  draw({ ctx, view, model: m, colors: c }) {
    // Orbit radii are not to scale (true radii grow as n²: r₇ = 49 r₁ would not fit); they only keep their order.
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, s = m.s, rr = (q) => 0.075 * q * q * S + 0.2 * S, cx = X(-1.5), cy = Y(0);
    const jumped = m.t >= TJ, q = jumped ? s.k : s.n;
    ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1;
    for (let o = 1; o <= 7; o++) { const r = rr(o); if (r > 4 * S) break; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
    dot(ctx, cx, cy, 6, c.force);
    // The electron circles on its orbit; at TJ it is on orbit k at once (dashed arrow: where it jumped from).
    const aj = -Math.PI / 4 + TJ * 1.6, a = -Math.PI / 4 + m.t * 1.6;
    if (jumped) {
      ctx.save(); ctx.strokeStyle = c.vel; ctx.lineWidth = 1.25; ctx.setLineDash([3, 3]); ctx.beginPath();
      ctx.moveTo(cx + Math.cos(aj) * rr(s.n), cy + Math.sin(aj) * rr(s.n)); ctx.lineTo(cx + Math.cos(aj) * rr(s.k), cy + Math.sin(aj) * rr(s.k)); ctx.stroke(); ctx.restore();
    }
    dot(ctx, cx + Math.cos(a) * rr(q), cy + Math.sin(a) * rr(q), 4.5, c.vel);
    if (jumped) {
      const col = wlColor(s.lam), w = (m.t - TJ) / (DUR - TJ), x0 = cx + Math.cos(aj) * rr(s.k), y0 = cy + Math.sin(aj) * rr(s.k), x1 = x0 + w * (X(8) - x0);
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath();
      for (let x = x0; x <= x1; x += 2) { const yy = y0 - Math.sin((x - x0) / 7) * 6; x === x0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); ctx.restore();
      // The photon's energy over the wave once it is past the outermost orbit (inside, the circles would cross it).
      const out = cx + rr(7) + 8;
      if (x1 > out + 40) hint(ctx, `hν = ${num(s.dE, 2)} eV`, out, y0 - 18, c);
    }
    // Energy level ladder on the right; the dot marks the electron's level now.
    const lx = X(6.2), lw = Math.min(X(9.6), view.width - 38) - lx, Ey = (o) => Y(-3.6 + 7.2 * (1 - 1 / (o * o)));
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.25; ctx.font = '500 12px Barlow, sans-serif'; ctx.fillStyle = c.fg; ctx.textBaseline = 'middle';
    for (let o = 1; o <= 7; o++) { const y = Ey(o); ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(lx + lw, y); ctx.stroke(); if (o <= 3 || (o === 4 && Ey(3) - Ey(4) >= 13)) ctx.fillText(`n = ${o}`, lx + lw + 4, y); }
    ctx.strokeStyle = wlColor(s.lam); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(lx + lw / 2, Ey(s.n)); ctx.lineTo(lx + lw / 2, Ey(s.k)); ctx.stroke(); ctx.restore();
    dot(ctx, lx + lw / 2, Ey(q), 4, c.vel);
    label(ctx, `hν = ${num(13.6, 1)} eV (1/k² − 1/n²) = ${num(s.dE, 2)} eV,  λ = ${num(s.lam, 0)} nm`, 12, 20, c, 'left');
  },
};

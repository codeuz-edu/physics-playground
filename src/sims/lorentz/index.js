import { num } from '../../core/format.js';
import { drawArrow, label, vectorLabel } from '../../ui/canvas.js';
import { hint } from '../kit.js';

// The same e, mₑ and mₚ as the photoeffect and de Broglie sims and the reference page.
// Particles as [mass, charge], in the order of the `part` menu: proton, alpha particle, electron.
const E_CH = 1.602e-19, PART = [[1.673e-27, E_CH], [6.64e-27, 2 * E_CH], [9.109e-31, -E_CH]];
const params = [
  { key: 'part', symbol: '', unit: '', min: 0, max: 2, step: 1, default: 0, kind: 'initial', options: ['proton', 'alpha', 'electron'] },
  { key: 'v', symbol: 'υ', unit: 'm/s', min: 0.1, max: 5, step: 0.1, default: 1, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'B', symbol: 'B', unit: 'mT', min: 1, max: 200, step: 1, default: 100, kind: 'initial', decimals: 0, color: '--acc' },
];
const geo = (P) => { const [m, q] = PART[P.part], v = P.v * 1e6, B = P.B / 1000; const r = (m * v) / (Math.abs(q) * B); return { r, T: (2 * Math.PI * m) / (Math.abs(q) * B), F: Math.abs(q) * v * B, s: Math.sign(q) }; };

/** Enough digits for any particle: at least `min` decimals and at least three significant figures. */
const fmt = (v, min) => num(v, Math.max(min, v > 0 ? 2 - Math.floor(Math.log10(v)) : min));
/** World position (cm) after turning through angle a on the circle that starts at the origin moving along +x. */
const at = (g, a) => [g.r * Math.sin(a) * 100, g.s * g.r * (1 - Math.cos(a)) * 100];

/**
 * Charge in a uniform field B pointing into the page: a circle of radius mυ/(|q|B). Shown in slow motion, one turn in 4 s.
 * Time t is in nanoseconds. The path drawn so far follows from the angle alone, so snapshots carry no trail.
 */
class LorentzModel {
  t = 0; x = 0; y = 0; g = null; ang = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.ang = 0; this.reason = ''; this.g = geo(P); this.pos(); }
  pos() { [this.x, this.y] = at(this.g, this.ang); }
  step(dt) {
    if (this.reason) return false;
    this.ang = Math.min(2 * Math.PI, this.ang + (dt * 2 * Math.PI) / 4); this.t = (this.ang / (2 * Math.PI)) * this.g.T * 1e9; this.pos();
    if (this.ang >= 2 * Math.PI - 1e-9) { this.reason = 'turn'; return false; }
    return true;
  }
  isValid() { return [this.x, this.y].every(Number.isFinite); }
  sample() { return { r: this.g.r * 100, T: this.g.T * 1e6, F: this.g.F * 1e15, x: this.x, y: this.y }; }
  clone() { return Object.assign(new LorentzModel(), this, { P: { ...this.P } }); }
  finishMessage(text) { return this.reason ? text.msg.turn(fmt(this.g.r * 100, 2), fmt(this.g.T * 1e6, 3), fmt(this.g.F * 1e15, 1)) : ''; }
}

export default {
  id: 'lorentz',
  params,
  timeUnit: 'ns', // an electron turns in tens of nanoseconds: in μs its graph and time chip would hold only 1–3 samples
  presets: [
    { values: { part: 0, v: 1, B: 100 } },
    { values: { part: 1, v: 1, B: 100 } },
    { values: { part: 0, v: 2, B: 50 } },
    { values: { part: 2, v: 1, B: 1 } },
  ],
  toggles: [{ key: 'forces', default: true }],
  readouts: [
    { key: 'r', unit: 'cm', decimals: 2, color: '--pos' },
    { key: 'T', unit: 'μs', decimals: 4, color: '--acc' },
    { key: 'F', unit: 'fN', decimals: 2, color: '--force' },
  ],
  graphs: [
    { id: 'x', unit: 'cm', series: [{ key: 'x', color: '--pos' }, { key: 'y', color: '--vel' }] },
  ],
  createModel: () => new LorentzModel(),
  worldBounds: (p) => { const r = geo(p).r * 100, s = geo(p).s; return { xMin: -1.35 * r, xMax: 1.35 * r, yMin: s > 0 ? -0.35 * r : -2.35 * r, yMax: s > 0 ? 2.35 * r : 0.35 * r }; },
  lengthUnit: 'cm',
  viewPadding: { left: 16, right: 16, top: 40, bottom: 16 },

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), g = m.g;
    ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1; const step = 34;
    for (let px = step / 2; px < view.width; px += step) for (let py = step / 2; py < view.height; py += step) { if (py < 62 && px < 300) continue; ctx.beginPath(); ctx.moveTo(px - 3, py - 3); ctx.lineTo(px + 3, py + 3); ctx.moveTo(px + 3, py - 3); ctx.lineTo(px - 3, py + 3); ctx.stroke(); }
    ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(X(0), Y(g.s * g.r * 100), g.r * 100 * view.scale, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    // Path so far: the arc from the entry point to the current angle (one point per degree).
    ctx.strokeStyle = c.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0), Y(0));
    for (let k = 1, n = Math.ceil(m.ang / (Math.PI / 180)); k <= n; k++) { const [x, y] = at(g, Math.min(m.ang, (k * Math.PI) / 180)); ctx.lineTo(X(x), Y(y)); }
    ctx.stroke();
    ctx.restore();
    hint(ctx, text.draw.field, 12, 46, c);
    const qx = X(m.x), qy = Y(m.y);
    // Radius from the centre of the circle to the charge, named r beside its middle.
    const ox = X(0), oy = Y(g.s * g.r * 100), rl = Math.hypot(qx - ox, qy - oy) || 1;
    ctx.save(); ctx.strokeStyle = c.muted; ctx.fillStyle = c.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(qx, qy); ctx.stroke(); ctx.beginPath(); ctx.arc(ox, oy, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    vectorLabel(ctx, 'r', (ox + qx) / 2 + ((qy - oy) / rl) * 12, (oy + qy) / 2 - ((qx - ox) / rl) * 12, c.muted);
    if (toggles.forces) {
      const ux = Math.cos(m.ang), uy = g.s * Math.sin(m.ang);
      drawArrow(ctx, qx, qy, qx + ux * 60, qy - uy * 60, c.vel, 'υ');
      const cx = X(0) - qx, cy = Y(g.s * g.r * 100) - qy, L = Math.hypot(cx, cy) || 1;
      drawArrow(ctx, qx, qy, qx + (cx / L) * 44, qy + (cy / L) * 44, c.force, 'F');
    }
    ctx.save(); ctx.fillStyle = g.s > 0 ? c.force : c.vel; ctx.beginPath(); ctx.arc(qx, qy, 7, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    label(ctx, text.draw.radius(fmt(g.r * 100, 2)), 12, 20, c, 'left');
  },
};

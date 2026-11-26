import { num } from '../../core/format.js';
import { drawArrow, ink, label, reserve, vectorLabel } from '../../ui/canvas.js';
import { DEG } from '../kit.js';

const R = 0.03; // m, ball radius
const TX = 0.6, TY = 0.33; // m, half the table's length and width
const params = [
  { key: 'm1', symbol: 'm₁', unit: 'kg', min: 0.1, max: 1, step: 0.01, default: 0.17, kind: 'initial', decimals: 2, color: '--vx' },
  { key: 'm2', symbol: 'm₂', unit: 'kg', min: 0.1, max: 1, step: 0.01, default: 0.17, kind: 'initial', decimals: 2, color: '--vy' },
  { key: 'v0', symbol: 'υ₀', unit: 'm/s', min: 0.5, max: 3, step: 0.1, default: 1.5, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'b', symbol: 'b', unit: '', min: 0, max: 0.9, step: 0.05, default: 0.5, kind: 'initial', decimals: 2 },
  { key: 'e', symbol: 'e', unit: '', min: 0, max: 1, step: 0.05, default: 1, kind: 'initial', decimals: 2 },
];

/** Two discs on a table, the second at rest; the hit is solved exactly at contact along the line of centres. */
class Collision2DModel {
  t = 0; b1 = null; b2 = null; hit = false; reason = ''; p = null; after = null; Ek0 = 0;
  reset(p) {
    this.p = { ...p }; this.t = 0; this.hit = false; this.reason = ''; this.after = null;
    this.b1 = { x: -0.35, y: -p.b * 2 * R, vx: p.v0, vy: 0 }; this.b2 = { x: 0, y: 0, vx: 0, vy: 0 };
    this.Ek0 = 0.5 * p.m1 * p.v0 * p.v0;
  }
  step(dt) {
    if (this.reason) return false;
    const p = this.p, a = this.b1, b = this.b2;
    let left = dt;
    if (!this.hit) {
      // Time to contact: |Δr + Δv τ| = 2R.
      const dx = a.x - b.x, dy = a.y - b.y, dvx = a.vx - b.vx, dvy = a.vy - b.vy;
      const A = dvx * dvx + dvy * dvy, B = 2 * (dx * dvx + dy * dvy), C = dx * dx + dy * dy - 4 * R * R, D = B * B - 4 * A * C;
      const tc = A > 0 && D >= 0 ? (-B - Math.sqrt(D)) / (2 * A) : Infinity;
      if (tc >= 0 && tc <= dt) {
        for (const s of [a, b]) { s.x += s.vx * tc; s.y += s.vy * tc; }
        const nx = (b.x - a.x) / (2 * R), ny = (b.y - a.y) / (2 * R), vn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        const J = ((1 + p.e) * p.m1 * p.m2 * vn) / (p.m1 + p.m2);
        a.vx -= (J / p.m1) * nx; a.vy -= (J / p.m1) * ny; b.vx += (J / p.m2) * nx; b.vy += (J / p.m2) * ny;
        this.hit = true; left = dt - tc;
        const s1 = Math.hypot(a.vx, a.vy), s2 = Math.hypot(b.vx, b.vy);
        const ang = s1 > 1e-9 && s2 > 1e-9 ? Math.acos(Math.max(-1, Math.min(1, (a.vx * b.vx + a.vy * b.vy) / (s1 * s2)))) / DEG : NaN;
        this.after = { s1, s2, ang, Ek: 0.5 * p.m1 * s1 * s1 + 0.5 * p.m2 * s2 * s2 };
      }
    }
    for (const s of [a, b]) { s.x += s.vx * left; s.y += s.vy * left; }
    this.t += dt;
    const out = (s) => Math.abs(s.x) > 0.55 || Math.abs(s.y) > 0.28;
    if ((this.hit && (out(a) || out(b))) || this.t > 6) { this.reason = this.hit ? 'done' : 'miss'; return false; }
    return true;
  }
  isValid() { return [this.b1.x, this.b1.y, this.b2.x, this.b2.y].every(Number.isFinite); }
  sample() {
    const p = this.p, a = this.b1, b = this.b2;
    return { px: p.m1 * a.vx + p.m2 * b.vx, py: p.m1 * a.vy + p.m2 * b.vy, Ek: 0.5 * p.m1 * (a.vx ** 2 + a.vy ** 2) + 0.5 * p.m2 * (b.vx ** 2 + b.vy ** 2), x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  }
  clone() { const c = Object.assign(new Collision2DModel(), this); c.b1 = { ...this.b1 }; c.b2 = { ...this.b2 }; c.p = { ...this.p }; return c; }
  /** The run's outcome in words; `text` is this simulation's text (sims/collision-2d/<locale>.js). */
  finishMessage(text) {
    const msg = text.msg;
    if (this.reason === 'miss') return msg.miss;
    if (!this.after) return '';
    const f = this.after, ang = Number.isFinite(f.ang) ? msg.angle(num(f.ang, 1)) : '';
    // An elastic hit keeps the energy to rounding; say so instead of "changed from 0,113 to 0,112".
    const dE = this.Ek0 - f.Ek;
    const energy = Math.abs(dE) <= 1e-9 * this.Ek0 ? msg.energyKept(num(this.Ek0, 3)) : msg.energyLost(num(this.Ek0, 3), num(f.Ek, 3));
    return msg.after(num(f.s1, 2), num(f.s2, 2), ang, num(this.p.m1 * this.p.v0, 3), energy);
  }
}

export default {
  id: 'collision-2d',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { m1: 0.17, m2: 0.17, v0: 1.5, b: 0.5, e: 1 } },
    { values: { m1: 0.17, m2: 0.17, v0: 1.5, b: 0, e: 1 } },
    { values: { m1: 0.17, m2: 0.17, v0: 1.5, b: 0.5, e: 0.5 } },
    { values: { m1: 0.1, m2: 0.5, v0: 1.5, b: 0.4, e: 1 } },
  ],
  toggles: [{ key: 'vel', default: true }, { key: 'pvec', default: true }, { key: 'path', default: true }],
  readouts: [
    { key: 'px', unit: 'kg·m/s', decimals: 3, color: '--vx' },
    { key: 'py', unit: 'kg·m/s', decimals: 3, color: '--vy' },
    { key: 'Ek', unit: 'J', decimals: 3, color: '--vel' },
  ],
  graphs: [
    { id: 'p', yLabel: 'p', unit: 'kg·m/s', series: [{ key: 'px', color: '--vx' }, { key: 'py', color: '--vy' }] },
    { id: 'E', yLabel: 'E', unit: 'J', series: [{ key: 'Ek', color: '--vel' }] },
  ],
  createModel: () => new Collision2DModel(),
  // The table's edge (±TX, ±TY) lies a ball's radius beyond where the run stops (|x| > 0,55 or |y| > 0,28), so a ball stays on it.
  // A strip above the table for the angle's badge.
  worldBounds: () => ({ xMin: -TX - 0.02, xMax: TX + 0.02, yMin: -TY - 0.02, yMax: TY + 0.06 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c, history, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    ctx.fillStyle = c.surface; ctx.fillRect(0, 0, view.width, view.height);
    ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.scenery; ctx.fillRect(X(-TX), Y(TY), 2 * TX * S, 2 * TY * S); ctx.strokeRect(X(-TX), Y(TY), 2 * TX * S, 2 * TY * S);
    ctx.setLineDash([3, 5]); ctx.strokeStyle = c.ghost; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(-TX + 0.01), Y(0)); ctx.lineTo(X(TX - 0.01), Y(0)); ctx.stroke(); ctx.restore();
    if (toggles.path && history.length > 1 && history.series.x1) {
      for (const [kx, ky, col] of [['x1', 'y1', c.vx], ['x2', 'y2', c.vy]]) {
        ctx.save(); ctx.strokeStyle = col; ctx.globalAlpha = 0.6; ctx.lineWidth = 1.5; ctx.beginPath();
        history.series[kx].forEach((x, i) => { const y = history.series[ky][i]; i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); }); ctx.stroke(); ctx.restore();
      }
    }
    for (const [b, col, name] of [[m.b1, c.vx, '1'], [m.b2, c.vy, '2']]) {
      ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = c.fg; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(X(b.x), Y(b.y), R * S, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = c.surface; ctx.font = `700 ${Math.round(Math.max(12, Math.min(16, 0.6 * R * S)))}px Barlow, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(name, X(b.x), Y(b.y) + 0.5); ctx.restore();
      reserve(ctx, X(b.x) - R * S, Y(b.y) - R * S, 2 * R * S, 2 * R * S);
    }
    if (m.after && Number.isFinite(m.after.ang)) label(ctx, text.draw.angle(num(m.after.ang, 1)), 12, 20, c, 'left');
    const k = 0.09 * S;
    // A velocity arrow is shortened where it would run off the stage (a ball at the table's edge).
    const onStage = (x0, y0, dx, dy) => {
      let f = 1;
      const lim = (a, d, lo, hi) => { if (a + d > hi && d > 0) f = Math.min(f, (hi - a) / d); if (a + d < lo && d < 0) f = Math.min(f, (lo - a) / d); };
      lim(x0, dx, 8, view.width - 8); lim(y0, dy, 8, view.height - 8);
      return [dx * Math.max(0, f), dy * Math.max(0, f)];
    };
    if (toggles.vel) for (const [b, col, lab] of [[m.b1, c.vx, 'υ₁'], [m.b2, c.vy, 'υ₂']]) if (Math.hypot(b.vx, b.vy) > 0.01) { const [dx, dy] = onStage(X(b.x), Y(b.y), b.vx * k, -b.vy * k); drawArrow(ctx, X(b.x), Y(b.y), X(b.x) + dx, Y(b.y) + dy, col, lab); }
    if (toggles.pvec) {
      // p₁′ + p₂′ = p₀, drawn tip to tail in the table's top left corner, where neither ball goes (the struck ball
      // moves up and right, the striking one is turned downwards). Its size is set from the whole hit, known from
      // the start (the line of centres at contact is at the aiming offset b), so that the triangle fits that corner.
      const p0 = p.m1 * p.v0, nx = Math.sqrt(Math.max(0, 1 - p.b * p.b)), J = ((1 + p.e) * p.m1 * p.m2 * p.v0 * nx) / (p.m1 + p.m2);
      const xl = X(-TX) + 16, xr = X(-0.08), oy = Y(TY) + 30, yb = Y(0.07), p1x = p0 - J * nx;
      const q = Math.min((0.3 * S) / Math.max(1e-6, p0), (yb - oy) / Math.max(1e-9, J * p.b), (xr - xl) / Math.max(1e-9, p0 - Math.min(0, p1x)));
      const ox = xl - Math.min(0, p1x) * q;
      const p1 = [p.m1 * m.b1.vx * q, -p.m1 * m.b1.vy * q], p2 = [p.m2 * m.b2.vx * q, -p.m2 * m.b2.vy * q];
      const T0 = [ox + p0 * q, oy], T1 = [ox + p1[0], oy + p1[1]];
      drawArrow(ctx, ox, oy, T0[0], oy, c.fg, '', 'part');
      if (m.hit) { drawArrow(ctx, ox, oy, T1[0], T1[1], c.vx, '', 'part'); drawArrow(ctx, T1[0], T1[1], T1[0] + p2[0], T1[1] + p2[1], c.vy, '', 'part'); }
      // Each side's name at its middle, outside the triangle: p₀ above (the triangle hangs below it), the other
      // two away from the triangle's centre, or below the line when the triangle is flat.
      const gx = (ox + T0[0] + T1[0]) / 3, gyc = (oy + oy + T1[1]) / 3 - 1e-3;
      const side = (a, b, name, col) => {
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (len < 4) return;
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        let ux = -(b[1] - a[1]) / len, uy = (b[0] - a[0]) / len;
        if (ux * (mx - gx) + uy * (my - gyc) < -1e-6) { ux = -ux; uy = -uy; }
        vectorLabel(ctx, name, mx + ux * 13, my + uy * 13, col, 'center', 'middle', [[mx + ux * 24, my + uy * 24], [mx - ux * 13, my - uy * 13]]);
      };
      vectorLabel(ctx, 'p₀', ox + (p0 * q) / 2, oy - 13, c.fg, 'center', 'middle', [[ox + (p0 * q) / 2, oy - 24]]);
      if (m.hit) { side([ox, oy], T1, 'p₁′', c.vx); side(T1, [T1[0] + p2[0], T1[1] + p2[1]], 'p₂′', c.vy); }
    }
  },
};

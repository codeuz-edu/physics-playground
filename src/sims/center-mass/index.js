import { num } from '../../core/format.js';
import { drawArrow, ink, label, reserve } from '../../ui/canvas.js';
import { DEG, gParam, hint } from '../kit.js';

const POLY = [
  [[0, 0], [0.6, 0], [0.6, 0.4], [0, 0.4]],
  [[0, 0], [0.6, 0], [0.6, 0.2], [0.2, 0.2], [0.2, 0.6], [0, 0.6]],
  [[0, 0], [0.6, 0], [0.2, 0.5]],
];
const HOLES = [
  [[0.05, 0.35], [0.55, 0.35], [0.55, 0.05]],
  [[0.05, 0.55], [0.55, 0.15], [0.05, 0.05]],
  [[0.2, 0.42], [0.06, 0.03], [0.53, 0.03]],
];
const PIVOT = [0, 0.78]; // m, the nail on the board

/** Area, centre of mass and moment of inertia (per unit area density) about the centre, for a polygon. */
function props(poly) {
  let A = 0, cx = 0, cy = 0, Ixx = 0, Iyy = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i], [x1, y1] = poly[(i + 1) % poly.length], k = x0 * y1 - x1 * y0;
    A += k / 2; cx += ((x0 + x1) * k) / 6; cy += ((y0 + y1) * k) / 6;
    Ixx += ((y0 * y0 + y0 * y1 + y1 * y1) * k) / 12; Iyy += ((x0 * x0 + x0 * x1 + x1 * x1) * k) / 12;
  }
  cx /= A; cy /= A;
  const Io = Ixx + Iyy, Ic = Io - A * (cx * cx + cy * cy);
  return { A, cx, cy, Ic };
}

/** A thin uniform plate hung on a nail through one of its holes swings, damped, until its centre of mass is under the nail. */
class PlateModel {
  t = 0; phi = 0; w = 0; reason = ''; shape = 0; hole = 0; d = 0; I = 0; base = 0;
  // Shape index → holes the plate has already hung from (their plumb lines stay drawn). Kept across
  // resets of this model, so only runs that really reached rest count; a planning copy has its own list.
  hung = {};
  reset(p) {
    this.t = 0; this.w = 0; this.reason = ''; this.shape = p.shape; this.hole = p.hole;
    const P = props(POLY[p.shape]), [hx, hy] = HOLES[p.shape][p.hole];
    const rx = P.cx - hx, ry = P.cy - hy;
    this.d = Math.hypot(rx, ry);
    this.I = P.Ic / P.A + this.d * this.d; // per unit mass
    this.base = Math.atan2(ry, rx); // direction of the centre of mass from the hole, plate unrotated
    this.phi = 0;
  }
  /** Angle of the hole→centre line from straight down. */
  off() { let a = this.base + this.phi + Math.PI / 2; while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }
  step(dt, p) {
    if (this.reason) return false;
    const al = (-p.g * this.d * Math.sin(this.off())) / this.I - 1.6 * this.w;
    this.w += al * dt; this.phi += this.w * dt; this.t += dt;
    if ((this.t > 1 && Math.abs(this.w) < 2e-3 && Math.abs(this.off()) < 2e-3) || this.t >= 15) {
      this.reason = 'rest';
      const list = (this.hung[this.shape] ||= []);
      if (!list.includes(this.hole)) list.push(this.hole);
      return false;
    }
    return true;
  }
  isValid() { return [this.t, this.phi, this.w].every(Number.isFinite); }
  sample() { const P = props(POLY[this.shape]); return { off: this.off() / DEG, xc: P.cx * 100, yc: P.cy * 100 }; }
  clone() { return Object.assign(new PlateModel(), this, { hung: Object.fromEntries(Object.entries(this.hung).map(([k, v]) => [k, v.slice()])) }); }
  finishMessage(text) {
    const n = (this.hung[this.shape] || []).length, P = props(POLY[this.shape]);
    if (n >= 2) return text.msg.found(num(P.cx * 100, 1), num(P.cy * 100, 1));
    return text.msg.rest;
  }
}

export default {
  id: 'center-mass',
  params: [
    // Shape names are in the text file (params.shape.options), in this order.
    { key: 'shape', symbol: '', unit: '', min: 0, max: 2, step: 1, default: 0, kind: 'initial', options: ['rectangle', 'L-plate', 'triangle'] },
    { key: 'hole', symbol: '', unit: '', min: 0, max: 2, step: 1, default: 0, kind: 'initial', options: ['A', 'B', 'C'] },
    gParam,
  ],
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { shape: 0, hole: 0, g: 9.81 } },
    { values: { shape: 1, hole: 0, g: 9.81 } },
    { values: { shape: 2, hole: 0, g: 9.81 } },
  ],
  toggles: [
    { key: 'plumb', default: true },
    { key: 'marks', default: true },
    { key: 'com', default: false },
    { key: 'force', default: false },
  ],
  readouts: [
    { key: 'off', unit: '°', decimals: 1, color: '--pos' },
  ],
  graphs: [
    { id: 'off', yLabel: 'φ', unit: '°', series: [{ key: 'off', color: '--pos' }] },
  ],
  createModel: () => new PlateModel(),
  worldBounds: () => ({ xMin: -0.85, xMax: 0.85, yMin: -0.02, yMax: 0.95 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    ctx.fillStyle = c.surface; ctx.fillRect(0, 0, view.width, view.height);
    // Wooden board with the nail.
    ctx.save(); ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.strokeRect(X(-0.8), Y(0.92), 1.6 * S, 0.9 * S); ctx.restore();
    const poly = POLY[m.shape], [hx, hy] = HOLES[m.shape][m.hole], P = props(poly);
    const rot = m.phi, cr = Math.cos(rot), sr = Math.sin(rot);
    const T = ([x, y]) => { const dx = x - hx, dy = y - hy; return [X(PIVOT[0] + dx * cr - dy * sr), Y(PIVOT[1] + dx * sr + dy * cr)]; };
    ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.beginPath();
    poly.forEach((q, i) => { const [a, b] = T(q); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Holes (their letters come after the plumb lines, so they are written over them).
    HOLES[m.shape].forEach((q) => { const [a, b] = T(q); ctx.fillStyle = c.surface; ctx.beginPath(); ctx.arc(a, b, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    ctx.restore();
    // Earlier plumb lines, drawn on the plate: each runs from its hole through the centre of mass.
    if (toggles.marks) for (const h of m.hung[m.shape] || []) {
      if (h === m.hole && !m.reason) continue;
      const [ax, ay] = HOLES[m.shape][h], dx = P.cx - ax, dy = P.cy - ay, L = 1.4 / Math.hypot(dx, dy);
      ctx.save(); ctx.beginPath(); poly.forEach((q, i) => { const [a, b] = T(q); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.closePath(); ctx.clip();
      ctx.strokeStyle = c.vy; ctx.lineWidth = 1.25; ctx.setLineDash([6, 4]); ctx.beginPath();
      const [a0, b0] = T([ax, ay]), [a1, b1] = T([ax + dx * L, ay + dy * L]); ctx.moveTo(a0, b0); ctx.lineTo(a1, b1); ctx.stroke(); ctx.restore();
    }
    // Nail and plumb line straight down from it.
    if (toggles.plumb) {
      ctx.save(); ctx.strokeStyle = c.vx; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(PIVOT[0]), Y(PIVOT[1])); ctx.lineTo(X(PIVOT[0]), Y(0.06)); ctx.stroke();
      ctx.fillStyle = c.vx; ctx.beginPath(); ctx.moveTo(X(0) - 5, Y(0.06)); ctx.lineTo(X(0) + 5, Y(0.06)); ctx.lineTo(X(0), Y(0.06) + 10); ctx.closePath(); ctx.fill(); ctx.restore();
      hint(ctx, text.draw.plumb, X(0) + 8, Y(0.12), c);
    }
    ctx.save(); ctx.fillStyle = c.fg; ctx.beginPath(); ctx.arc(X(PIVOT[0]), Y(PIVOT[1]), 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // Hole letters, a little inside the plate from each hole, outlined in the plate's colour so a plumb
    // line passing under a letter does not cut it.
    ctx.save(); ctx.font = '600 13px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = c.track; ctx.fillStyle = c.fg;
    HOLES[m.shape].forEach((q, i) => { const [ox, oy] = T([q[0] + (q[0] < 0.3 ? 0.045 : -0.045), q[1] + (q[1] < 0.3 ? 0.045 : -0.045)]); ctx.strokeText(['A', 'B', 'C'][i], ox, oy); ctx.fillText(['A', 'B', 'C'][i], ox, oy); });
    ctx.restore();
    const [gx, gy2] = T([P.cx, P.cy]);
    if (toggles.com || (m.hung[m.shape] || []).length >= 2 && m.reason) {
      ctx.save(); ctx.fillStyle = c.acc; ctx.beginPath(); ctx.arc(gx, gy2, 5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      // Named in words (the holes already use the letters A, B, C), outlined in the plate's colour like the
      // hole letters, so the plate's edge or a plumb line under the words does not cut them.
      ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = c.track; ctx.fillStyle = c.fg;
      ctx.strokeText(text.draw.com, gx + 9, gy2 - 10); ctx.fillText(text.draw.com, gx + 9, gy2 - 10); reserve(ctx, gx + 9, gy2 - 17, ctx.measureText(text.draw.com).width, 14); ctx.restore();
    }
    // The weight arrow: 70 px, shorter on a small stage so it stays on the board.
    if (toggles.force) drawArrow(ctx, gx, gy2, gx, gy2 + Math.min(70, 0.3 * S), c.fg, 'mg');
    label(ctx, text.draw.hung(text.params.shape.options[m.shape], ['A', 'B', 'C'][m.hole]), 12, 20, c, 'left');
  },
};

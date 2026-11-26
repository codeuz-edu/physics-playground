import { num } from '../../core/format.js';
import { drawArrow, drawHatch, ink, label } from '../../ui/canvas.js';
import { DEG, gParam, hint } from '../kit.js';

const QW = 4; // m, half the road width, measured along the slope
const EDGE = QW - 0.9; // m, the car's middle can slide this far from the middle of the road before a wheel leaves it
const Y0 = 0.4; // m, height of the road's inner edge in the picture

const params = [
  { key: 'v', symbol: 'υ', unit: 'm/s', min: 5, max: 50, step: 0.1, default: 16, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'R', symbol: 'R', unit: 'm', min: 20, max: 300, step: 5, default: 100, kind: 'initial', decimals: 0 },
  { key: 'th', symbol: 'θ', unit: '°', min: 0, max: 45, step: 1, default: 15, kind: 'initial', decimals: 0 },
  { key: 'mu', symbol: 'μ', unit: '', min: 0, max: 1, step: 0.05, default: 0.3, kind: 'initial', decimals: 2, color: '--friction' },
  gParam,
];

/** Per kilogram, for speed υ on a circle of radius r: the road's reaction N and the push D up the slope that friction has to cancel. */
function forces(p, r) {
  const t = p.th * DEG, ac = (p.v * p.v) / r;
  return { ac, N: p.g * Math.cos(t) + ac * Math.sin(t), D: ac * Math.cos(t) - p.g * Math.sin(t) };
}

/** The forces needed in the middle of the road, and the speed range friction allows. */
function solve(p) {
  const t = p.th * DEG, s = Math.sin(t), c = Math.cos(t), { ac, N, D } = forces(p, p.R);
  const f = -D; // per kg, + up the slope
  const v0 = Math.sqrt(p.g * p.R * Math.tan(t));
  const den = c - p.mu * s;
  const vmax = den > 1e-9 ? Math.sqrt((p.g * p.R * (s + p.mu * c)) / den) : Infinity;
  const vminSq = (p.g * p.R * (s - p.mu * c)) / (c + p.mu * s);
  return { ac, N, f, v0, vmax, vmin: vminSq > 0 ? Math.sqrt(vminSq) : 0, need: Math.abs(f) / N };
}

/**
 * Banked curve, seen from behind the car. The car drives a quarter-circle bend at a steady speed υ.
 * Static friction keeps it in its lane while it can (|F| ≤ μN). If it can't, the car slides along the
 * slope against sliding friction μN: outwards (up) when too fast, inwards (down) when too slow; the
 * radius of its path changes as it slides.
 */
class BankedModel {
  t = 0; q = 0; w = 0; qa = 0; slip = 0; dir = 0; f = 0; N = 0; ac = 0; maxQ = 0; T = 0; reason = ''; r = null; p = null;
  reset(p) {
    this.p = { ...p }; this.r = solve(p);
    this.t = 0; this.q = 0; this.w = 0; this.slip = 0; this.dir = 0; this.maxQ = 0; this.reason = '';
    this.T = ((Math.PI / 2) * p.R) / p.v; // time to drive round the bend
    this.update();
  }
  /** Forces in the car's lane; static friction holds the car while it can. */
  update() {
    const p = this.p, F = forces(p, p.R + this.q * Math.cos(p.th * DEG));
    this.N = F.N; this.ac = F.ac;
    if (!this.slip && Math.abs(F.D) > p.mu * F.N + 1e-9) { this.slip = Math.sign(F.D); this.dir ||= this.slip; }
    this.f = this.slip ? -this.slip * p.mu * F.N : -F.D; // per kg, + up the slope
    this.qa = F.D + this.f; // acceleration along the slope: 0 while the car holds its lane
  }
  step(dt) {
    if (this.reason) return false;
    const d = Math.min(dt, this.T - this.t);
    if (this.slip) {
      const w1 = this.w + this.qa * d;
      if (w1 * this.slip <= 0) { this.q -= this.qa ? (this.w * this.w) / (2 * this.qa) : 0; this.w = 0; this.slip = 0; } // the slide stops inside this step
      else { this.q += ((this.w + w1) / 2) * d; this.w = w1; }
    }
    this.t += d;
    if (Math.abs(this.q) >= EDGE) { this.q = Math.sign(this.q) * EDGE; this.maxQ = EDGE; this.update(); this.reason = 'off'; return false; }
    this.maxQ = Math.max(this.maxQ, Math.abs(this.q));
    this.update();
    if (this.t >= this.T - 1e-9) { this.reason = 'done'; return false; }
    return true;
  }
  isValid() { return [this.t, this.q, this.w, this.f, this.N, this.r.v0, this.r.vmin].every(Number.isFinite); }
  sample() {
    const r = this.r, lim = this.p.mu * this.N;
    // υ_max is undefined (NaN, shown as "—") when friction allows any speed. The needed μ is the one in the middle of the road.
    return { v0: r.v0, vmax: Number.isFinite(r.vmax) ? r.vmax : NaN, vmin: r.vmin, need: r.need, q: this.q, f: this.f, lim, nlim: -lim };
  }
  clone() { return Object.assign(new BankedModel(), this); } // p and r are replaced, never changed, on reset
  finishMessage(text) {
    if (!this.reason) return '';
    const r = this.r, p = this.p, vmax = Number.isFinite(r.vmax) ? `${num(r.vmax, 1)} m/s` : text.msg.unlimited;
    const range = text.msg.range(num(r.vmin, 1), vmax), out = this.dir > 0, need = num(r.need, 2), mu = num(p.mu, 2);
    if (this.reason === 'off') return text.msg.off(need, mu, out, range);
    if (this.dir) return text.msg.slid(need, mu, num(this.maxQ, 2), out, range);
    if (Math.abs(p.v - r.v0) < 0.05) return text.msg.ideal(num(r.v0, 1), range);
    return text.msg.held(need, mu, r.f > 0, range);
  }
}

export default {
  id: 'banked',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { v: 16.2, R: 100, th: 15, mu: 0.3, g: 9.81 } },
    { values: { v: 24, R: 100, th: 15, mu: 0.3, g: 9.81 } },
    { values: { v: 10, R: 100, th: 15, mu: 0.3, g: 9.81 } },
    { values: { v: 24, R: 100, th: 15, mu: 0.05, g: 9.81 } },
  ],
  toggles: [{ key: 'forces', default: true }, { key: 'sum', default: true }],
  readouts: [
    { key: 'v0', unit: 'm/s', decimals: 1, color: '--vel' },
    { key: 'vmin', unit: 'm/s', decimals: 1 },
    { key: 'vmax', unit: 'm/s', decimals: 1 },
    { key: 'need', unit: '', decimals: 2, color: '--friction' },
    { key: 'q', unit: 'm', decimals: 2, color: '--pos' },
  ],
  graphs: [
    { id: 'f', yLabel: 'F', unit: 'N/kg', series: [{ key: 'f', color: '--friction' }, { key: 'lim', color: '--muted' }, { key: 'nlim', color: '--muted' }] },
    { id: 'q', yLabel: 'q', unit: 'm', series: [{ key: 'q', color: '--pos' }] },
  ],
  createModel: () => new BankedModel(),
  // Tall enough for the steepest bank with the car at its outer edge.
  worldBounds: (p) => ({ xMin: -5, xMax: 5, yMin: -0.6, yMax: Math.max(4.2, Y0 + 2 * QW * Math.sin(p.th * DEG) + 2.4) }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, t = p.th * DEG, st = Math.sin(t), ct = Math.cos(t), r = m.r;
    ctx.fillStyle = c.surface; ctx.fillRect(0, 0, view.width, view.height);
    // Road cross-section rising to the right (the centre of the curve is to the left), 2·QW wide along the slope.
    const ym = Y0 + QW * st, at = (q) => [q * ct, ym + q * st]; // world point q metres up the slope from the middle of the road
    const [xi, yi] = at(-QW), [xo, yo] = at(QW);
    ctx.save(); ctx.beginPath(); ctx.moveTo(X(-5), Y(yi)); ctx.lineTo(X(xi), Y(yi)); ctx.lineTo(X(xo), Y(yo)); ctx.lineTo(X(5), Y(yo)); ctx.lineTo(X(5), Y(-0.6)); ctx.lineTo(X(-5), Y(-0.6)); ctx.closePath();
    ctx.fillStyle = c.ground; ctx.fill(); ctx.clip(); drawHatch(ctx, X(-5), Y(yo), X(5) - X(-5), Y(-0.6) - Y(yo), c.hatch, 0, 9); ctx.restore();
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.scenery; ctx.beginPath(); ctx.moveTo(X(-5), Y(yi)); ctx.lineTo(X(xi), Y(yi)); ctx.lineTo(X(xo), Y(yo)); ctx.lineTo(X(5), Y(yo)); ctx.stroke();
    // A mark in the middle of the road, so a slide shows.
    const [xm] = at(0);
    ctx.strokeStyle = c.ghost; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(xm), Y(ym)); ctx.lineTo(X(xm) + st * 0.5 * S, Y(ym) + ct * 0.5 * S); ctx.stroke(); ctx.restore();
    // Bank angle at the road's inner edge, between the level line (dashed, into the bank) and the road;
    // its value just left of the corner, above the level ground where the car never comes.
    if (p.th > 0) {
      const ra = Math.min(40, 1.1 * S);
      ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(X(xi), Y(yi) + 0.5); ctx.lineTo(X(xi) + ra + 10, Y(yi) + 0.5); ctx.stroke();
      ctx.setLineDash([]); ctx.beginPath(); ctx.arc(X(xi), Y(yi), ra, -t, 0); ctx.stroke(); ctx.restore();
      hint(ctx, `θ = ${num(p.th, 0)}°`, X(xi) - 6, Y(yi) - 11, c, 'right');
    }
    // Which side the centre of the bend is on: under the badge, clear of the road and its hatching.
    hint(ctx, text.draw.centre, 12, 46, c);
    // Car seen from behind, its middle q metres up the slope from the middle of the road. The body is
    // drawn see-through, so the forces on it and their names read through it.
    const [qx, qy] = at(m.q), W = 1.8 * S, H = 1.3 * S, bx = X(qx), by = Y(qy);
    ctx.save(); ctx.translate(bx, by); ctx.rotate(-t);
    ctx.globalAlpha = 0.45; ctx.fillStyle = c.body; ctx.beginPath(); ctx.rect(-W / 2, -H, W, H * 0.75); ctx.rect(-W * 0.35, -H * 1.25, W * 0.7, H * 0.25); ctx.fill();
    ctx.globalAlpha = 1; ctx.fillStyle = c.fg; ctx.fillRect(-W / 2, -H * 0.3, W * 0.18, H * 0.3); ctx.fillRect(W / 2 - W * 0.18, -H * 0.3, W * 0.18, H * 0.3);
    ctx.restore();
    // All forces to one scale (per kilogram): the largest is about one and a half car heights, so the
    // arrows reach out of the body, but never more than 30 % of the stage.
    const cx = bx - st * H * 0.55, cy = by - ct * H * 0.55, per = Math.min(Math.max(90, 1.5 * H), 0.3 * view.height) / Math.max(p.g, r.N, r.ac);
    if (toggles.forces) {
      drawArrow(ctx, cx, cy, cx, cy + p.g * per, c.fg, 'mg');
      drawArrow(ctx, bx, by, bx - st * m.N * per, by - ct * m.N * per, c.force, 'N');
      if (Math.abs(m.f) > 1e-3) drawArrow(ctx, bx, by + 3, bx + ct * m.f * per, by + 3 - st * m.f * per, c.friction, text.draw.friction);
    }
    // Resultant: ma towards the centre, tilted along the slope while the car slides.
    if (toggles.sum) drawArrow(ctx, cx, cy - 6, cx + (-m.ac + m.qa * ct) * per, cy - 6 - m.qa * st * per, c.acc, 'ma');
    // The bend seen from above, in the corner: where the car is on its quarter circle.
    // The inset sits over the middle of its caption, which keeps 12 px from the right edge like the badge on the left.
    const Rp = 34, ix = view.width - 70, iy = 30, ph = (Math.PI / 2) * Math.min(1, m.t / m.T), rr = Rp * (1 + (m.q * ct) / p.R);
    ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ix - 16, iy + Rp); ctx.lineTo(ix, iy + Rp); ctx.arc(ix, iy, Rp, Math.PI / 2, 0, true); ctx.lineTo(ix + Rp, iy - 12); ctx.stroke();
    ctx.fillStyle = c.fg; ctx.beginPath(); ctx.arc(ix, iy, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c.body; ctx.beginPath(); ctx.arc(ix + rr * Math.sin(ph), iy + rr * Math.cos(ph), 4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    hint(ctx, text.draw.topView, view.width - 12, iy + Rp + 14, c, 'right');
    label(ctx, text.draw.ideal(num(r.v0, 1)), 12, 20, c, 'left');
  },
};

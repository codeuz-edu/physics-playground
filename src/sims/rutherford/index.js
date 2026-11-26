import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { dot } from '../optics.js';

const KE = 1.44, R2D = 180 / Math.PI, V0 = 90; // MeV·fm; fm per screen second far from the nucleus
// The α-particle comes from XFAR (practically infinity) on its exact path; the run shows it from X_START until it is
// R_OUT away again (outside the picture), and its final direction is found by flying on to XFAR off screen.
const XFAR = 1e6, X_START = -318, R_OUT = 380, ETA = 0.002;
// Atomic number Z of each foil metal, in the order of the menu (gold, silver, aluminium).
const ZS = [79, 47, 13];
const params = [
  { key: 'tgt', symbol: '', unit: '', min: 0, max: 2, step: 1, default: 0, kind: 'initial', options: ['gold', 'silver', 'aluminium'] },
  { key: 'E', symbol: 'E', unit: 'MeV', min: 2, max: 10, step: 0.5, default: 5, kind: 'initial', decimals: 1, color: '--acc' },
  { key: 'b', symbol: 'b', unit: 'fm', min: 0, max: 120, step: 1, default: 20, kind: 'initial', decimals: 0, color: '--pos' },
];
const dOf = (P) => (KE * 2 * ZS[P.tgt]) / P.E;
const theta = (P) => (P.b === 0 ? 180 : 2 * Math.atan(dOf(P) / (2 * P.b)) * R2D);

/**
 * Velocity-Verlet flight in the repulsive field a = κ r⃗ / r³ (κ = υ₀² d / 2, so the head-on turning point is r = d).
 * Steps are a fixed small fraction of r/υ₀, so the far part costs little and the close pass stays accurate.
 * Runs for at most `span` seconds (or until `stop` says so) and calls `each` after every step; `eta` sets the step size.
 */
function fly(q, kap, span, stop, each, eta = ETA) {
  let r = Math.hypot(q.x, q.y), ax = (kap * q.x) / r ** 3, ay = (kap * q.y) / r ** 3, left = span;
  for (let i = 0; i < 1e6 && left > 1e-12; i++) {
    const h = Math.min(left, (eta * r) / V0);
    q.vx += 0.5 * ax * h; q.vy += 0.5 * ay * h; q.x += q.vx * h; q.y += q.vy * h;
    r = Math.hypot(q.x, q.y); ax = (kap * q.x) / r ** 3; ay = (kap * q.y) / r ** 3;
    q.vx += 0.5 * ax * h; q.vy += 0.5 * ay * h; left -= h;
    if (each) each(q, r);
    if (stop && stop(q, r)) break;
  }
  return q;
}
/** State on the true incoming path at x = X_START: start far away at height b with the speed energy conservation gives there. */
function entry(P, eta = ETA) {
  const kap = (V0 * V0 * dOf(P)) / 2, r0 = Math.hypot(XFAR, P.b);
  const q = { x: -XFAR, y: P.b, vx: V0 * Math.sqrt(1 - dOf(P) / r0), vy: 0 };
  return fly(q, kap, Infinity, (s) => s.x >= X_START, null, eta);
}
const outgoing = (q) => q.x * q.vx + q.y * q.vy > 0;

/** Faint paths of other particles of the beam (other impact parameters), per foil and energy; cached. */
const FAN_B = [8, 18, 30, 45, 65, 90, 120], fanCache = new Map();
function fan(P) {
  const key = `${P.tgt}|${P.E}`;
  if (!fanCache.has(key)) {
    const kap = (V0 * V0 * dOf(P)) / 2;
    fanCache.set(key, FAN_B.map((b) => {
      const q = entry({ ...P, b }, 4 * ETA), pts = [[q.x, q.y]]; // coarser steps: these paths are only a backdrop
      let last = q.x;
      fly(q, kap, 60, (s, r) => r > R_OUT + 40 && outgoing(s), (s) => { if (Math.abs(s.x - last) > 3 || Math.abs(s.y - pts[pts.length - 1][1]) > 3) { pts.push([s.x, s.y]); last = s.x; } }, 4 * ETA);
      pts.push([q.x, q.y]);
      return pts;
    }));
  }
  return fanCache.get(key);
}

/** α-particle in the Coulomb field of a fixed nucleus, integrated in fm. */
class RuthModel {
  t = 0; x = 0; y = 0; vx = 0; vy = 0; r = 0; rmin = 1e9; th = NaN; reason = ''; P = null; trail = []; n = 0;
  reset(P) {
    this.P = { ...P }; this.t = 0; this.reason = ''; this.th = NaN;
    Object.assign(this, entry(P));
    this.trail = [[this.x, this.y]]; this.n = 1; this.r = Math.hypot(this.x, this.y); this.rmin = this.r;
  }
  step(dt) {
    if (this.reason) return false;
    const kap = (V0 * V0 * dOf(this.P)) / 2, q = { x: this.x, y: this.y, vx: this.vx, vy: this.vy };
    fly(q, kap, dt, null, (s, r) => { if (r < this.rmin) this.rmin = r; });
    Object.assign(this, q);
    this.t += dt; this.r = Math.hypot(this.x, this.y);
    // The trail is append-only and shared with snapshots, which keep their own length n: fork it if someone else appended.
    if (this.trail.length !== this.n) this.trail = this.trail.slice(0, this.n);
    this.trail.push([this.x, this.y]); this.n++;
    if (this.r > R_OUT && outgoing(this)) {
      this.reason = 'out';
      const far = fly({ x: this.x, y: this.y, vx: this.vx, vy: this.vy }, kap, Infinity, (s, r) => r > XFAR);
      this.th = Math.atan2(far.vy, far.vx) * R2D;
    } else if (this.t > 40) this.reason = 'time';
    return !this.reason;
  }
  isValid() { return [this.x, this.y, this.vx, this.vy].every(Number.isFinite); }
  sample() { return { r: this.r, v: (Math.hypot(this.vx, this.vy) / V0) * 100 }; }
  clone() { return Object.assign(new RuthModel(), this, { P: { ...this.P } }); } // shares the trail; n marks its end
  finishMessage(text) {
    if (!this.reason) return '';
    const th = Number.isFinite(this.th) ? this.th : theta(this.P);
    return text.msg.end(num(th, 1), num(this.rmin, 1), num(dOf(this.P), 1));
  }
}

export default {
  id: 'rutherford',
  params,
  lengthUnit: 'fm',
  presets: [
    { values: { tgt: 0, E: 5, b: 20 } },
    { values: { tgt: 0, E: 5, b: 0 } },
    { values: { tgt: 2, E: 5, b: 20 } },
  ],
  toggles: [{ key: 'beam', default: true }],
  readouts: [
    { key: 'r', unit: 'fm', decimals: 0, color: '--pos' },
    { key: 'v', unit: '%', decimals: 0, color: '--vel' },
  ],
  graphs: [{ id: 'r', yLabel: 'r', unit: 'fm', series: [{ key: 'r', color: '--pos' }] }],
  createModel: () => new RuthModel(),
  worldBounds: () => ({ xMin: -310, xMax: 310, yMin: -150, yMax: 190 }),
  viewPadding: { left: 12, right: 12, top: 40, bottom: 12 },

  draw({ ctx, view, model: m, params: p, toggles: tg, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), d = dOf(p), S = view.scale, R = d * S, X0 = X(0), Y0 = Y(0), bx = X(-280);
    const done = Number.isFinite(m.th) && p.b > 0, th = m.th / R2D, cxw = -p.b * Math.tan(th / 2), C = [X(cxw), Y(p.b)];
    // Captions are placed first, each at the first of its places that is free. No caption is put on the α-particle's
    // path (it stays above the axis, the θ caption goes inside the angle or below its side); the faint paths, the dashed
    // lines and the θ construction are broken where a caption stands, as in a technical drawing.
    const boxes = [[X0 - 9, Y0 - 9, 18, 18]], caps = [];
    const put = (s, ...at) => {
      ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; const w = ctx.measureText(s).width; ctx.restore();
      const box = ([x, y, al]) => [al === 'right' ? x - w : al === 'center' ? x - w / 2 : x, y - 8, w, 16];
      const free = (b) => b[0] > 4 && b[0] + b[2] < view.width - 4 && !boxes.some((q) => b[0] < q[0] + q[2] + 4 && b[0] + b[2] + 4 > q[0] && b[1] < q[1] + q[3] && b[1] + b[3] > q[1]);
      const at1 = at.find((a) => free(box(a))) || at[0]; boxes.push(box(at1)); caps.push([s, ...at1]);
    };
    if (done) put(`θ = ${num(m.th, 1)}°`, ...(m.th >= 50 ? [[C[0] + 34 * Math.cos(th / 2), C[1] - 34 * Math.sin(th / 2) - 6, 'left']] : [[C[0] + 34, C[1] + 12, 'left'], [C[0] + 50, C[1] - 10, 'left']]));
    // d is the radius of the dashed circle: drawn down and to the left, where no path comes inside it.
    const ra = (-3 * Math.PI) / 4, showD = R > 16;
    if (showD) put(`d = ${num(d, 1)} fm`, [X(d * Math.cos(ra)) - 4, Y(d * Math.sin(ra)) + 10, 'right']);
    if (p.b > 8) put(`b = ${num(p.b, 0)} fm`, [bx + 6, p.b * S >= 26 ? Y(p.b / 2) : Y0 + 10, 'left']);
    // The positive x axis behind the nucleus: no path ever crosses it.
    put(text.draw.nucleus(ZS[p.tgt]), [X0 + Math.max(12, R + 6), Y0, 'left'], [X0 + 10, Y0 + 18, 'left'], [X0 - 10, Y0 + 18, 'right']);
    const world = () => { ctx.beginPath(); ctx.rect(X(-310), Y(190), X(310) - X(-310), Y(-150) - Y(190)); };
    ctx.save(); world(); for (const [x, y, w, h] of boxes.slice(1)) ctx.rect(x - 3, y, w + 6, h); ctx.clip('evenodd');
    if (!tg || tg.beam !== false) {
      ctx.save(); ctx.strokeStyle = c.muted; ctx.globalAlpha = 0.45; ctx.lineWidth = 1;
      for (const pts of fan(p)) for (const sg of [1, -1]) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(sg * y)) : ctx.moveTo(X(x), Y(sg * y)))); ctx.stroke(); }
      ctx.restore();
    }
    ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.setLineDash([4, 5]);
    ctx.beginPath(); ctx.moveTo(X(-310), Y(p.b)); ctx.lineTo(X0, Y(p.b)); ctx.stroke();
    // No α-particle of this energy gets closer to the nucleus than d (the head-on turning point).
    ctx.beginPath(); ctx.arc(X0, Y0, R, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    if (showD) { ctx.beginPath(); ctx.moveTo(X0 + 8 * Math.cos(ra), Y0 - 8 * Math.sin(ra)); ctx.lineTo(X0 + R * Math.cos(ra), Y0 - R * Math.sin(ra)); ctx.stroke(); }
    // After the run: the outgoing asymptote and the scattering angle θ between it and the incoming direction.
    if (done) {
      ctx.strokeStyle = c.fg; ctx.setLineDash([2, 4]); ctx.beginPath();
      ctx.moveTo(C[0], C[1]); ctx.lineTo(X(cxw + 260 * Math.cos(th)), Y(p.b + 260 * Math.sin(th)));
      ctx.moveTo(C[0], C[1]); ctx.lineTo(X(cxw + 80), Y(p.b)); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(C[0], C[1], 26, -th, 0); ctx.stroke();
    }
    ctx.restore(); ctx.restore();
    ctx.save(); world(); ctx.clip();
    ctx.strokeStyle = c.accent; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i < m.n; i++) { const [x, y] = m.trail[i]; i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); }
    ctx.stroke();
    dot(ctx, X(m.x), Y(m.y), 5, c.vel);
    ctx.restore();
    dot(ctx, X0, Y0, 7, c.force);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, Y0); ctx.lineTo(bx, Y(p.b)); ctx.stroke(); ctx.restore();
    for (const [s, x, y, al] of caps) hint(ctx, s, x, y, c, al);
    label(ctx, text.draw.formula(num(theta(p), 1)), 12, 20, c, 'left');
  },
};

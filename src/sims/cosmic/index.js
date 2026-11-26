import { num } from '../../core/format.js';
import { drawArrow, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { dot } from '../optics.js';

/** Earth, Moon, Mars: GM (m³/s²) and radius (m). Their names are the `bodies` of the text file. */
const PL = [[3.986e14, 6.371e6], [4.905e12, 1.737e6], [4.283e13, 3.39e6]];
const params = [
  { key: 'pl', symbol: '', unit: '', min: 0, max: 2, step: 1, default: 0, kind: 'initial', options: ['earth', 'moon', 'mars'] },
  { key: 'v', symbol: 'υ₀', unit: 'km/s', min: 0.5, max: 13, step: 0.01, default: 7.91, kind: 'initial', decimals: 2, color: '--vel' },
  { key: 'h0', symbol: 'h₀', unit: 'km', min: 0, max: 1000, step: 10, default: 0, kind: 'initial', decimals: 0, color: '--pos' },
];
/** Half a slider step: a speed this close to υ₁ is taken as υ₁ itself (the slider cannot hit it exactly). */
const TOL = 0.005;
/**
 * What kind of path a horizontal launch at r₀ = R + h₀ gives. The launch point is an apsis, and the other
 * apsis is r′ = r₀ υ²/(υ₂² − υ²). Distances are in planet radii R, times in minutes.
 */
const kinds = (P) => {
  const [GM, R] = PL[P.pl], q = (R + (P.h0 || 0) * 1000) / R, v1 = Math.sqrt(GM / (q * R)) / 1000, v2 = v1 * Math.SQRT2, v = P.v, Tc = (2 * Math.PI * q * R) / (v1 * 1000) / 60;
  const base = { v1, v2, Tc, q };
  if (Math.abs(v - v1) <= TOL) return { kind: 'circle', ...base };
  if (v >= v2) {
    // Time to fly out to r = 3.8 R (the edge of the view), from the hyperbolic Kepler equation M = e sinh F − F.
    // (Barker's equation for the parabola when the speed is υ₂ to within 1e-6 of the energy scale.)
    const r0 = q * R, rEnd = 3.8 * R, eps = (v * 1000) ** 2 / 2 - GM / r0;
    let tOut;
    if (eps < 1e-6 * (GM / r0)) { const D = Math.sqrt(Math.max(0, rEnd / r0 - 1)); tOut = (Math.sqrt((2 * r0 ** 3) / GM) * (D + D ** 3 / 3)) / 60; }
    else { const A = GM / (2 * eps), e = 1 + r0 / A, F = Math.acosh(Math.max(1, (rEnd / A + 1) / e)); tOut = (e * Math.sinh(F) - F) / Math.sqrt(GM / (A * A * A)) / 60; }
    return { kind: 'escape', ...base, tOut };
  }
  const rr = (q * v * v) / (v2 * v2 - v * v), a = (q + rr) / 2, T = Tc * Math.pow(a / q, 1.5);
  if (v > v1) return { kind: 'ellipse', ...base, ra: rr, rp: q, a, T };
  if (rr > 1) return { kind: 'inner', ...base, ra: q, rp: rr, a, T };
  // It falls. From the surface (h₀ = 0) it touches the ground at once; from a height, Kepler's equation gives
  // the time from the launch point (E = π) to r = R: r = a(1 − e cos E), t = T (E − e sin E − π) / 2π.
  if (q <= 1 + 1e-9) return { kind: 'fall', ...base, rp: rr, a, T, tl: 0 };
  const e = (q - rr) / (q + rr), E = 2 * Math.PI - Math.acos(Math.max(-1, Math.min(1, (1 - 1 / a) / e)));
  return { kind: 'fall', ...base, rp: rr, a, T, tl: (T * (E - e * Math.sin(E) - Math.PI)) / (2 * Math.PI) };
};

/** Body launched horizontally from the surface or a mountain top (no air): Newton's gravity, velocity Verlet; time axis in minutes. */
class OrbitModel {
  t = 0; x = 0; y = 0; vx = 0; vy = 0; h = 0; sp = 0; k = null; reason = ''; P = null; trail = []; n = 0; R = 1; GM = 1; dur = 0;
  reset(P) {
    this.P = { ...P }; const [GM, R] = PL[P.pl]; this.GM = GM; this.R = R; this.k = kinds(P);
    // A speed within half a slider step of υ₁ is launched at exactly υ₁, so the circle does not dip into the ground.
    const k = this.k, v0 = (k.kind === 'circle' ? k.v1 : P.v) * 1000;
    this.t = 0; this.x = 0; this.y = k.q * R; this.vx = v0; this.vy = 0; this.reason = '';
    this.trail = [[0, k.q]]; this.n = 1;
    this.dur = k.kind === 'ellipse' || k.kind === 'inner' ? k.T : k.kind === 'escape' ? k.tOut : k.kind === 'fall' ? k.tl : k.Tc; this.calc();
  }
  calc() { const r = Math.hypot(this.x, this.y); this.h = (r - this.R) / 1000; this.sp = Math.hypot(this.vx, this.vy) / 1000; }
  /** The trail is append-only and shared with snapshots (each keeps its own length n); copy it only if another model has appended. */
  push(pt) { if (this.trail.length !== this.n) this.trail = this.trail.slice(0, this.n); this.trail.push(pt); this.n++; }
  step(dt) {
    if (this.reason) return false;
    if (this.k.kind === 'fall' && this.k.tl <= 0) { this.reason = 'land'; return false; }
    const span = this.dur * 60, simDt = (span / 8) * dt, n = 40, h = simDt / n; // the whole run lasts ~8 s on screen
    const end = this.k.kind === 'fall' ? this.dur * 1.1 : this.dur, GM = this.GM;
    let r = Math.hypot(this.x, this.y), f = -GM / (r * r * r), ax = f * this.x, ay = f * this.y;
    for (let i = 0; i < n; i++) {
      this.vx += 0.5 * h * ax; this.vy += 0.5 * h * ay; this.x += h * this.vx; this.y += h * this.vy;
      r = Math.hypot(this.x, this.y); f = -GM / (r * r * r); ax = f * this.x; ay = f * this.y;
      this.vx += 0.5 * h * ax; this.vy += 0.5 * h * ay; this.t += h / 60;
      if (r < this.R * (1 - 1e-7) && this.t > 1e-3) { const s = this.R / r; this.x *= s; this.y *= s; this.reason = 'land'; break; }
      if (this.t >= end) { this.reason = 'end'; break; }
    }
    this.push([this.x / this.R, this.y / this.R]); this.calc();
    return !this.reason;
  }
  isValid() { return [this.x, this.y, this.vx, this.vy].every(Number.isFinite); }
  sample() { return { h: this.h, v: this.sp }; }
  clone() { return Object.assign(new OrbitModel(), this, { P: { ...this.P }, k: { ...this.k } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const k = this.k, P = this.P, msg = text.msg, at = k.q > 1 + 1e-9 ? '/(R + h₀)' : '/R';
    if (this.reason === 'land' || k.kind === 'fall') {
      if (k.q <= 1 + 1e-9) return msg.fallAtOnce(num(P.v, 2), num(k.v1, 2));
      return msg.fall(num(P.v, 2), num(k.v1, 2), num(this.t, 1));
    }
    if (k.kind === 'circle') return msg.circle(at, num(k.v1, 2), num(k.Tc, 0));
    if (k.kind === 'ellipse') return msg.ellipse(num(k.ra, 2), num(k.T, 0));
    if (k.kind === 'inner') return msg.inner(num(k.v1, 2), num(k.rp, 2), num(k.T, 0));
    return msg.escape(at, num(k.v2, 2));
  }
}

export default {
  id: 'cosmic',
  params,
  timeUnit: 'min',
  lengthUnit: 'R',
  presets: [
    { values: { pl: 0, v: 7.91, h0: 0 } },
    { values: { pl: 0, v: 9, h0: 0 } },
    { values: { pl: 0, v: 11.2, h0: 0 } },
    { values: { pl: 0, v: 6, h0: 1000 } },
  ],
  toggles: [],
  readouts: [
    { key: 'h', unit: 'km', decimals: 0, color: '--pos' },
    { key: 'v', unit: 'km/s', decimals: 2, color: '--vel' },
  ],
  graphs: [
    { id: 'h', yLabel: 'h', unit: 'km', series: [{ key: 'h', color: '--pos' }] },
    { id: 'v', yLabel: 'υ', unit: 'km/s', series: [{ key: 'v', color: '--vel' }] },
  ],
  createModel: () => new OrbitModel(),
  worldBounds: (p) => {
    const k = kinds(p), top = Math.max(1.6, k.q + 0.3);
    if (k.kind === 'ellipse') { const s = Math.max(1.4, Math.sqrt(k.q * k.ra)) + 0.2; return { xMin: -s, xMax: s, yMin: -k.ra - 0.2, yMax: top }; }
    const s = k.kind === 'escape' ? Math.max(4, k.q + 0.4) : Math.max(1.4, k.q + 0.2);
    return { xMin: -s - 0.2, xMax: s + 0.2, yMin: -s - 0.2, yMax: top };
  },
  viewPadding: { left: 12, right: 12, top: 40, bottom: 12 },

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    // At υ₁ from the surface the orbit is the planet's own outline (r = R, no air): drawn there, the path would hide
    // the edge. So everything within 12 px of the surface is drawn up to 5 px higher (fading out with height): the
    // orbit shows as a ring just outside the planet, and a body on the ground rests on it. Only the picture moves.
    const P = (x, y) => { const r = Math.hypot(x, y) || 1, k = 1 + (5 * Math.max(0, Math.min(1, 1 - ((r - 1) * S) / 12))) / (r * S); return [X(x * k), Y(y * k)]; };
    ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(0), Y(0), S, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    hint(ctx, text.draw.bodies[p.pl], X(0), Y(0), c, 'center');
    // Newton's mountain: a peak up to the launch point (only when h₀ > 0).
    const q = m.k.q;
    if (q > 1 + 1e-9) { const w = 0.07; ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(-Math.sin(w)), Y(Math.cos(w))); ctx.lineTo(...P(0, q)); ctx.lineTo(X(Math.sin(w)), Y(Math.cos(w))); ctx.fill(); ctx.stroke(); ctx.restore(); }
    // Path so far: the first n points of the shared trail.
    ctx.save(); ctx.strokeStyle = c.accent; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i < m.n; i++) { const [x, y] = m.trail[i], [u, w] = P(x, y); i ? ctx.lineTo(u, w) : ctx.moveTo(u, w); }
    ctx.stroke(); ctx.restore();
    const [bx, by] = P(m.x / m.R, m.y / m.R); dot(ctx, bx, by, 5, c.force);
    // Velocity: υ₀ at the launch, then υ along the path (its length follows the speed) until the body is down.
    const sp = Math.hypot(m.vx, m.vy) || 1, vl = (50 * m.sp) / (m.k.kind === 'circle' ? m.k.v1 : p.v), ux = m.vx / sp, uy = m.vy / sp;
    if (m.reason !== 'land' && vl > 4) drawArrow(ctx, bx, by, bx + ux * vl, by - uy * vl, c.vel, m.t === 0 ? 'υ₀' : 'υ');
    label(ctx, q > 1 + 1e-9 ? text.draw.speedsAt(num(m.k.v1, 2), num(m.k.v2, 2), num(p.h0, 0)) : text.draw.speeds(num(m.k.v1, 2), num(m.k.v2, 2)), 12, 20, c, 'left');
  },
};

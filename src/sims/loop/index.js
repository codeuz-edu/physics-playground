import { num } from '../../core/format.js';
import { drawArrow, drawGround, drawSky, ink, label, reserve } from '../../ui/canvas.js';
import { DEG, gParam, hint } from '../kit.js';

const RAMP = 2.5; // m, horizontal length of the straight slope, measured to where it would meet the floor
const BEND = 0.8; // m, radius of the curve that joins the slope to the floor
const RUN = 0.3;  // m, level rail between the end of the curve and the loop's leftmost point

/**
 * The rail before the loop: a straight slope from height h, a curve of radius BEND that brings it
 * level, then level rail to the loop's lowest point (x = 0). The whole of it lies to the left of the
 * loop, so the rail meets the circle only at the bottom, where the two are tangent.
 * th: angle of the slope; xs: x of its top; xe: x where the curve reaches the floor;
 * a, b: lengths of the slope and of the curve; len: length up to the loop.
 */
function rail(p) {
  const th = Math.atan2(p.h, RAMP), T = BEND * Math.tan(th / 2), xe = -p.R - RUN;
  const a = Math.hypot(RAMP, p.h) - T, b = BEND * th;
  return { th, xs: xe - T - RAMP, xe, a, b, len: a + b - xe };
}

const params = [
  { key: 'h', symbol: 'h', unit: 'm', min: 0.5, max: 5, step: 0.1, default: 3, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'R', symbol: 'R', unit: 'm', min: 0.4, max: 1.5, step: 0.05, default: 1, kind: 'initial', decimals: 2 },
  { key: 'm', symbol: 'm', unit: 'kg', min: 0.5, max: 5, step: 0.5, default: 1, kind: 'initial', decimals: 1 },
  gParam,
];

/**
 * Frictionless track: the rail described by rail(), then a vertical loop of radius R.
 * Speed from energy, υ² = 2g(h − y). On the rail N = m(g cos β + υ²/ρ), where β is the slope and ρ the
 * radius of the curve (no second term on the straight parts). In the loop N = m(υ²/R + g cos φ)
 * (φ from the bottom); if N would become negative the cart leaves the track and flies as a projectile.
 */
class LoopModel {
  t = 0; s = 0; phi = 0; x = 0; y = 0; v = 0; N = 0; stage = 'ramp'; reason = ''; vx = 0; vy = 0; leave = null; p = null; k = null; slope = 0; bend = false;
  reset(p) { this.p = { ...p }; this.t = 0; this.s = 0; this.stage = 'ramp'; this.reason = ''; this.leave = null; this.k = rail(p); this.place(); }
  place() {
    const p = this.p;
    if (this.stage === 'ramp') {
      const k = this.k, s = this.s;
      this.bend = s >= k.a && s < k.a + k.b;
      if (s < k.a) { this.slope = k.th; this.x = k.xs + s * Math.cos(k.th); this.y = p.h - s * Math.sin(k.th); }
      else if (this.bend) { this.slope = k.th - (s - k.a) / BEND; this.x = k.xe - BEND * Math.sin(this.slope); this.y = BEND * (1 - Math.cos(this.slope)); }
      else { this.slope = 0; this.x = k.xe + (s - k.a - k.b); this.y = 0; }
    }
    else if (this.stage === 'loop') { this.x = p.R * Math.sin(this.phi); this.y = p.R * (1 - Math.cos(this.phi)); }
    this.v = Math.sqrt(Math.max(0, 2 * p.g * (p.h - this.y)));
    this.N = this.stage === 'loop' ? p.m * ((this.v * this.v) / p.R + p.g * Math.cos(this.phi)) : this.stage === 'ramp' ? p.m * (p.g * Math.cos(this.slope) + (this.bend ? (this.v * this.v) / BEND : 0)) : 0;
  }
  step(dt) {
    if (this.reason) return false;
    const p = this.p;
    this.t += dt;
    if (this.stage === 'fly') {
      this.x += this.vx * dt; this.vy -= p.g * dt; this.y += this.vy * dt;
      this.v = Math.hypot(this.vx, this.vy);
      if (Math.hypot(this.x, this.y - p.R) >= p.R || this.y <= 0) { this.reason = 'fell'; return false; }
      return true;
    }
    if (this.stage === 'ramp') {
      this.s += this.v * dt + 0.5 * p.g * Math.sin(this.slope) * dt * dt;
      if (this.s >= this.k.len) { this.stage = 'loop'; this.phi = (this.s - this.k.len) / p.R; this.slope = 0; this.bend = false; }
      this.place(); return true;
    }
    // In the loop: advance the angle by the arc travelled.
    const w = this.v / p.R;
    if (w < 1e-6 && this.phi > 0) { this.reason = 'back'; return false; }
    this.phi += w * dt; this.place();
    if (this.phi >= 2 * Math.PI) { this.reason = 'ok'; this.phi = 2 * Math.PI; this.place(); return false; }
    if (this.N < -1e-6 * p.m * p.g) {
      this.leave = { phi: this.phi, y: this.y };
      this.vx = this.v * Math.cos(this.phi); this.vy = this.v * Math.sin(this.phi); this.stage = 'fly'; this.N = 0;
    }
    if (this.y >= p.h - 1e-6) { this.reason = 'back'; return false; }
    return true;
  }
  isValid() { return [this.t, this.x, this.y, this.v].every(Number.isFinite); }
  sample() { return { v: this.v, N: this.N, y: this.y, x: this.x }; }
  clone() { return Object.assign(new LoopModel(), this, { p: { ...this.p }, leave: this.leave && { ...this.leave } }); }
  finishMessage(text) {
    const p = this.p, top = p.m * ((2 * p.g * (p.h - 2 * p.R)) / p.R - p.g);
    if (this.reason === 'ok') return text.msg.ok(num(top, 1), num(2.5 * p.R, 2));
    if (this.reason === 'fell' || this.leave) return text.msg.fell(num(this.leave.y, 2), num(this.leave.phi / DEG, 0), num(2.5 * p.R, 2));
    if (this.reason === 'back') return text.msg.back(num(p.h, 2));
    return '';
  }
}

export default {
  id: 'loop',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { h: 3, R: 1, m: 1, g: 9.81 } },
    { values: { h: 2.5, R: 1, m: 1, g: 9.81 } },
    { values: { h: 2, R: 1, m: 1, g: 9.81 } },
    { values: { h: 0.8, R: 1, m: 1, g: 9.81 } },
  ],
  toggles: [{ key: 'forces', default: true }, { key: 'path', default: true }],
  readouts: [
    { key: 'v', unit: 'm/s', decimals: 2, color: '--vel' },
    { key: 'N', unit: 'N', decimals: 1, color: '--force' },
    { key: 'y', unit: 'm', decimals: 2, color: '--pos' },
  ],
  graphs: [
    { id: 'N', yLabel: 'N', unit: 'N', series: [{ key: 'N', color: '--force' }] },
    { id: 'v', yLabel: 'υ', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
  ],
  createModel: () => new LoopModel(),
  // Room under the floor for the weight arrow and its name when the cart is at the bottom of the loop.
  worldBounds: (p) => ({ xMin: rail(p).xs - 0.3, xMax: p.R + 1.2, yMin: -0.45, yMax: Math.max(p.h, 2 * p.R) + 0.3 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c, history }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, gy = Y(0);
    drawSky(ctx, view, c, gy);
    drawGround(ctx, view, c, gy);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 2.5;
    // Slope, curve (arc() joins it to the top of the slope with a straight line), then level rail under the loop.
    const k = rail(p);
    ctx.beginPath(); ctx.moveTo(X(k.xs), Y(p.h)); ctx.arc(X(k.xe), Y(BEND), BEND * S, Math.PI / 2 + k.th, Math.PI / 2, true); ctx.lineTo(X(p.R + 1.1), gy); ctx.stroke();
    ctx.beginPath(); ctx.arc(X(0), Y(p.R), p.R * S, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = c.ghost; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(k.xs), Y(2.5 * p.R)); ctx.lineTo(X(p.R + 1.1), Y(2.5 * p.R)); ctx.stroke(); ctx.restore();
    hint(ctx, `${num(2.5, 1)}R`, X(p.R + 0.2), Y(2.5 * p.R) - 8, c);
    // The vector names keep off the 2,5R line and off the straight slope (marked by small squares along it).
    reserve(ctx, X(k.xs), Y(2.5 * p.R) - 2, X(p.R + 1.1) - X(k.xs), 4);
    const sx0 = X(k.xs), sy0 = Y(p.h), sl = k.a * S, n = Math.max(1, Math.floor(sl / 10));
    for (let i = 0; i <= n; i++) reserve(ctx, sx0 + (i / n) * sl * Math.cos(k.th) - 3, sy0 + (i / n) * sl * Math.sin(k.th) - 3, 6, 6);
    if (toggles.path && history.length > 1 && history.series.x) {
      ctx.save(); ctx.strokeStyle = m.leave ? c.warn : c.accent; ctx.lineWidth = 1.5; ctx.beginPath();
      history.series.x.forEach((x, i) => { const y = history.series.y[i]; i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); }); ctx.stroke(); ctx.restore();
    }
    // Cart: a small box on the track, its wheels on the rail.
    const r = Math.max(7, 0.12 * S), ang = m.stage === 'loop' ? m.phi : m.stage === 'ramp' ? -m.slope : Math.atan2(m.vy, m.vx);
    const nx = m.stage === 'loop' ? -Math.sin(m.phi) : -Math.sin(ang), ny = m.stage === 'loop' ? Math.cos(m.phi) : Math.cos(ang);
    const cx = X(m.x) + nx * r * 0.9 * (m.stage === 'loop' ? 1 : 1), cy = Y(m.y) - ny * r * 0.9;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-ang); ctx.fillStyle = c.body; ctx.fillRect(-r * 1.2, -r * 0.8, r * 2.4, r * 1.6); ctx.restore();
    reserve(ctx, cx - r * 1.2, cy - r * 1.2, r * 2.4, r * 2.4); // the vector names stay off the cart
    // The badge at the top right, away from the start of the slope at the top left.
    label(ctx, `h = ${num(p.h, 1)} m,  ${num(2.5, 1)}R = ${num(2.5 * p.R, 2)} m`, view.width - 12, 20, c, 'right');
    if (toggles.forces) {
      // mg at the bottom of the loop ends high enough above the stage's lower edge for its name; N (up to 6mg
      // at the bottom) is capped at 2,2mg, and in the loop at the radius, so it stays inside the loop.
      const per = Math.min(55, 0.18 * view.height, view.height - gy + 0.9 * r - 24) / (p.m * p.g);
      drawArrow(ctx, cx, cy, cx, cy + p.m * p.g * per, c.fg, 'mg');
      const Lp = Math.min(m.N * per, 2.2 * p.m * p.g * per, m.stage === 'loop' ? p.R * S - r : Infinity);
      if (m.N > 0.01) drawArrow(ctx, cx, cy, cx + nx * Lp, cy - ny * Lp, c.force, 'N');
    }
  },
};

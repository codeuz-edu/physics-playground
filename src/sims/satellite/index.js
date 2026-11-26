import { num } from '../../core/format.js';
import { drawArrow, ink, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';

const GM = 398600; // km³/s², Earth
const RE = 6371; // km
const HOUR = 3600;
const ATMO = 100; // km: below this the air is dense enough to brake and bring the satellite down
const MAX_HOURS = 60; // the run stops here if the satellite has not gone round once

const params = [
  { key: 'h', symbol: 'h', unit: 'km', min: 200, max: 40000, step: 100, default: 400, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'v', symbol: 'υ₀', unit: 'km/s', min: 1, max: 12, step: 0.01, default: 7.67, kind: 'initial', decimals: 2, color: '--vel' },
];

const v1 = (h) => Math.sqrt(GM / (RE + h));
const preview = { key: '', pts: [] };

/** Satellite launched horizontally at height h; Newton's law of gravitation, RK4. Time is in hours. */
class SatelliteModel {
  t = 0; x = 0; y = 0; vx = 0; vy = 0; turned = 0; prevAng = 0; reason = ''; period = 0; far = 0;
  reset(p) {
    this.t = 0; this.x = 0; this.y = RE + p.h; this.vx = p.v; this.vy = 0;
    this.turned = 0; this.prevAng = Math.atan2(this.y, this.x); this.reason = ''; this.period = 0;
    this.far = extent(p) * 0.98;
  }
  deriv(s) { const r = Math.hypot(s[0], s[1]), k = -GM / (r * r * r); return [s[2], s[3], k * s[0], k * s[1]]; }
  step(dt) {
    if (this.reason) return false;
    const n = 4, h = (dt * HOUR) / n;
    for (let i = 0; i < n; i++) {
      const s0 = [this.x, this.y, this.vx, this.vy];
      const k1 = this.deriv(s0), k2 = this.deriv(s0.map((v, j) => v + (k1[j] * h) / 2)), k3 = this.deriv(s0.map((v, j) => v + (k2[j] * h) / 2)), k4 = this.deriv(s0.map((v, j) => v + k3[j] * h));
      const s1 = s0.map((v, j) => v + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
      const r0 = Math.hypot(s0[0], s0[1]), r1 = Math.hypot(s1[0], s1[1]);
      if (r1 <= RE + ATMO) {
        // Entered the dense atmosphere inside this substep: stop exactly on the 100-km line.
        const f = r0 > r1 ? (r0 - RE - ATMO) / (r0 - r1) : 1;
        [this.x, this.y, this.vx, this.vy] = s0.map((v, j) => v + f * (s1[j] - v));
        this.t += ((i + f) * h) / HOUR; this.reason = 'crash'; return false;
      }
      [this.x, this.y, this.vx, this.vy] = s1;
    }
    this.t += dt;
    const ang = Math.atan2(this.y, this.x);
    let d = ang - this.prevAng; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
    this.turned += -d; this.prevAng = ang; // clockwise is forward for a launch to the right at the top
    const r = Math.hypot(this.x, this.y);
    if (this.turned >= 2 * Math.PI) { const inc = -d, f = inc > 0 ? (this.turned - 2 * Math.PI) / inc : 0; this.period = this.t - f * dt; this.reason = 'orbit'; return false; }
    if (r >= this.far) { this.reason = 'escape'; return false; }
    if (this.t >= MAX_HOURS) { this.reason = 'time'; return false; }
    return true;
  }
  isValid() { return [this.t, this.x, this.y, this.vx, this.vy].every(Number.isFinite); }
  sample() { const r = Math.hypot(this.x, this.y); return { x: this.x, y: this.y, alt: r - RE, v: Math.hypot(this.vx, this.vy) }; }
  clone() { return Object.assign(new SatelliteModel(), this); }
  finishMessage(text) {
    const msg = text.msg;
    if (this.reason === 'orbit') return msg.orbit(num(this.period, 2), num(this.period * 60, 0));
    if (this.reason === 'crash') return msg.crash(num(this.t, 2), ATMO);
    if (this.reason === 'escape') return msg.escape;
    if (this.reason === 'time') return msg.time(MAX_HOURS);
    return '';
  }
}

/** Half-size of the view, from the orbit's farthest point (or a fixed frame for unbound orbits). */
function extent(p) {
  const r = RE + p.h, eps = (p.v * p.v) / 2 - GM / r;
  if (eps >= 0) return Math.max(4 * RE, 3 * r);
  const a = -GM / (2 * eps), apo = 2 * a - r;
  return Math.max(apo, r, 1.6 * RE) * 1.12;
}

export default {
  id: 'satellite',
  params,
  timeUnit: 'h',
  lengthUnit: 'km',
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { h: 400, v: 7.67 } },
    { values: { h: 35800, v: 3.07 } },
    { values: { h: 400, v: 7 } },
    { values: { h: 400, v: 8.5 } },
    { values: { h: 400, v: 11 } },
  ],
  toggles: [
    { key: 'vel', default: true },
    { key: 'force', default: true },
    { key: 'pre', default: true },
  ],
  readouts: [
    { key: 'alt', unit: 'km', decimals: 0, color: '--pos' },
    { key: 'v', unit: 'km/s', decimals: 2, color: '--vel' },
  ],
  graphs: [
    { id: 'alt', yLabel: 'h', unit: 'km', series: [{ key: 'alt', color: '--pos' }] },
    { id: 'v', yLabel: 'υ', unit: 'km/s', series: [{ key: 'v', color: '--vel' }] },
  ],
  createModel: () => new SatelliteModel(),
  worldBounds(p) { const e = extent(p); return { xMin: -e, xMax: e, yMin: -e, yMax: e }; },

  draw({ ctx, view, model: m, params: p, toggles, colors: c, history, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    ctx.fillStyle = c.surface; ctx.fillRect(0, 0, view.width, view.height);
    // Earth, drawn to scale, with a thin line at the top of the dense atmosphere (100 km).
    ctx.save();
    ctx.fillStyle = c.water; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.arc(X(0), Y(0), RE * S, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = c['water-line']; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(X(0), Y(0), (RE + ATMO) * S, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    hint(ctx, text.draw.earth, X(0), Y(0), c, 'center');
    // Expected path before launch.
    if (toggles.pre && m.t === 0) {
      const key = `${p.h}|${p.v}`;
      if (preview.key !== key) {
        const q = new SatelliteModel(); q.reset(p); const pts = [[q.x, q.y]];
        for (let i = 0; i < 3000 && q.step(1 / 60); i++) pts.push([q.x, q.y]);
        pts.push([q.x, q.y]); preview.key = key; preview.pts = pts;
      }
      ctx.save(); ctx.setLineDash([2, 6]); ctx.strokeStyle = c.accent; ctx.globalAlpha = 0.6; ctx.lineWidth = 1.5; ctx.beginPath();
      preview.pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))));
      ctx.stroke(); ctx.restore();
    }
    if (history.length > 1 && history.series.x) {
      ctx.save(); ctx.strokeStyle = c.accent; ctx.lineWidth = 2; ctx.beginPath();
      history.series.x.forEach((x, i) => { const y = history.series.y[i]; i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); });
      ctx.stroke(); ctx.restore();
    }
    const sx = X(m.x), sy = Y(m.y);
    const r = Math.hypot(m.x, m.y);
    if (toggles.force) { const L = Math.min(60, 60 * ((RE + p.h) / r) ** 2); drawArrow(ctx, sx, sy, sx - (m.x / r) * L, sy + (m.y / r) * L, c.force, 'F'); }
    if (toggles.vel) { const sp = Math.hypot(m.vx, m.vy), L = 7 * sp; drawArrow(ctx, sx, sy, sx + (m.vx / sp) * L, sy - (m.vy / sp) * L, c.vel, 'υ'); }
    ctx.save(); ctx.fillStyle = c.body; ctx.fillRect(sx - 4, sy - 4, 8, 8); ctx.strokeStyle = c.fg; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx - 12, sy); ctx.lineTo(sx + 12, sy); ctx.stroke(); ctx.fillStyle = c.accent; ctx.fillRect(sx - 13, sy - 2, 6, 4); ctx.fillRect(sx + 7, sy - 2, 6, 4); ctx.restore();
    label(ctx, `υ₁ = ${num(v1(p.h), 2)} km/s   υ₂ = ${num(v1(p.h) * Math.SQRT2, 2)} km/s`, 12, 20, c, 'left');
  },
};

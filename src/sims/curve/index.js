import { num } from '../../core/format.js';
import { drawArrow, ink, label } from '../../ui/canvas.js';
import { gParam, hint } from '../kit.js';

const HALF = 4; // m, half the road width

const params = [
  { key: 'v', symbol: 'υ', unit: 'm/s', min: 5, max: 40, step: 0.5, default: 15, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'R', symbol: 'R', unit: 'm', min: 20, max: 150, step: 5, default: 50, kind: 'initial', decimals: 0 },
  { key: 'mu', symbol: 'μ', unit: '', min: 0.05, max: 1, step: 0.05, default: 0.6, kind: 'initial', decimals: 2, color: '--friction' },
  { key: 'm', symbol: 'm', unit: 'kg', min: 800, max: 2500, step: 50, default: 1200, kind: 'initial', decimals: 0 },
  gParam,
];

/**
 * Car on a flat curve (seen from above). Friction can supply at most μmg towards the centre; if the
 * curve needs more (mυ²/R > μmg) the car follows a wider circle of radius υ²/(μg) and runs off the road.
 */
class CurveModel {
  t = 0; s = 0; x = 0; y = 0; hd = 0; need = 0; max = 0; vmax = 0; skid = false; reason = ''; L0 = 0; dev = 0; maxDev = 0;
  reset(p) {
    this.t = 0; this.s = 0; this.reason = ''; this.dev = 0; this.maxDev = 0;
    this.need = (p.m * p.v * p.v) / p.R;
    this.max = p.mu * p.m * p.g;
    this.vmax = Math.sqrt(p.mu * p.g * p.R);
    this.skid = this.need > this.max + 1e-9;
    this.L0 = 1.4 * p.R;
    this.place(p);
  }
  place(p) {
    const s = this.s, R = p.R;
    if (s < this.L0) { this.x = -this.L0 + s; this.y = -R; this.hd = 0; return; }
    const u = s - this.L0;
    const r = this.skid ? (p.v * p.v) / (p.mu * p.g) : R;
    const th = u / r;
    if (th >= Math.PI / 2) { this.x = r; this.y = -R + r + (u - (Math.PI / 2) * r); this.hd = Math.PI / 2; }
    else { this.x = r * Math.sin(th); this.y = -R + r - r * Math.cos(th); this.hd = th; }
    // Distance from the middle of the road: round the bend, or along the straight way out.
    this.dev = this.y <= 0 && this.x >= 0 ? Math.hypot(this.x, this.y) - R : this.x - R;
  }
  step(dt, p) {
    if (this.reason) return false;
    this.s += p.v * dt; this.t += dt; this.place(p);
    this.maxDev = Math.max(this.maxDev, this.dev);
    if (this.dev > HALF - 1) { this.reason = 'off'; return false; }
    if (this.y > 0.6 * p.R || this.t > 30) { this.reason = this.skid ? 'drift' : 'ok'; return false; }
    return true;
  }
  isValid() { return [this.t, this.x, this.y].every(Number.isFinite); }
  sample() { const inCurve = this.s > this.L0 && this.hd < Math.PI / 2 - 1e-9; return { need: this.need, max: this.max, vmax: this.vmax, f: inCurve ? Math.min(this.need, this.max) : 0, dev: this.dev, x: this.x, y: this.y }; }
  clone() { return Object.assign(new CurveModel(), this); }
  finishMessage(text) {
    const need = num(this.need, 0), max = num(this.max, 0);
    if (this.reason === 'off') return text.msg.off(need, max, num(this.vmax, 1), num(this.vmax * 3.6, 0));
    if (this.reason === 'drift') return text.msg.drift(num(this.maxDev, 1), need, max);
    if (this.reason === 'ok') return text.msg.ok(need, max);
    return '';
  }
}

export default {
  id: 'curve',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { v: 15, R: 50, mu: 0.6, m: 1200, g: 9.81 } },
    { values: { v: 15, R: 50, mu: 0.4, m: 1200, g: 9.81 } },
    { values: { v: 15, R: 50, mu: 0.1, m: 1200, g: 9.81 } },
    { values: { v: 25, R: 40, mu: 0.6, m: 1200, g: 9.81 } },
  ],
  toggles: [
    { key: 'forces', default: true },
    { key: 'vel', default: true },
    { key: 'path', default: true },
  ],
  readouts: [
    { key: 'need', unit: 'N', decimals: 0, color: '--acc' },
    { key: 'max', unit: 'N', decimals: 0, color: '--friction' },
    { key: 'vmax', unit: 'm/s', decimals: 1, color: '--vel' },
    { key: 'f', unit: 'N', decimals: 0, color: '--friction' },
  ],
  graphs: [
    { id: 'F', yLabel: 'F', unit: 'N', series: [{ key: 'f', color: '--friction' }, { key: 'need', color: '--acc' }, { key: 'max', color: '--muted' }] },
    { id: 'dev', yLabel: 'Δ', unit: 'm', series: [{ key: 'dev', color: '--pos' }] },
  ],
  createModel: () => new CurveModel(),
  worldBounds: (p) => ({ xMin: -1.45 * p.R, xMax: 1.25 * p.R + 6, yMin: -1.12 * p.R - 6, yMax: 0.65 * p.R }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c, history, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, R = p.R;
    ctx.fillStyle = c.ground; ctx.fillRect(0, 0, view.width, view.height);
    // Road: straight in from the left, a quarter circle round the centre (0, 0), straight out upwards.
    const road = (r, close) => {
      ctx.beginPath();
      ctx.moveTo(X(-2 * R), Y(-r));
      ctx.lineTo(X(0), Y(-r));
      ctx.arc(X(0), Y(0), r * S, Math.PI / 2, 0, true);
      ctx.lineTo(X(r), Y(R));
      if (close) ctx.stroke();
    };
    ctx.save();
    ctx.strokeStyle = c.track; ctx.lineWidth = 2 * HALF * S; ctx.lineCap = 'butt'; road(R, true);
    ctx.strokeStyle = c.fg; ctx.lineWidth = ink.scenery; road(R + HALF, true); road(R - HALF, true);
    ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.setLineDash([8, 8]); road(R, true);
    ctx.restore();
    ctx.save(); ctx.fillStyle = c.fg; ctx.beginPath(); ctx.arc(X(0), Y(0), 3, 0, Math.PI * 2); ctx.fill();
    ctx.setLineDash([3, 4]); ctx.strokeStyle = c.ghost; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(R * Math.SQRT1_2), Y(-R * Math.SQRT1_2)); ctx.stroke(); ctx.restore();
    // The centre is named on its left; the radius below-left of its middle, on the side away from the
    // friction arrow while the car is in the second half of the bend.
    hint(ctx, text.draw.centre, X(0) - 8, Y(0), c, 'right');
    hint(ctx, `R = ${num(R, 0)} m`, X(R * 0.354) - 6, Y(-R * 0.354) + 10, c, 'right');
    // Trail.
    if (toggles.path && history.length > 1 && history.series.x) {
      ctx.save(); ctx.strokeStyle = m.skid ? c.warn : c.accent; ctx.lineWidth = 1.5; ctx.beginPath();
      history.series.x.forEach((x, i) => { const y = history.series.y[i]; i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); });
      ctx.stroke(); ctx.restore();
    }
    // Car: 4.5 m by 1.9 m, seen from above, nose in the direction of travel.
    const L = Math.max(30, 4.5 * S), W = Math.max(13, 1.9 * S);
    ctx.save(); ctx.translate(X(m.x), Y(m.y)); ctx.rotate(-m.hd);
    ctx.fillStyle = c.body; ctx.fillRect(-L / 2, -W / 2, L, W);
    ctx.fillStyle = c.surface; ctx.fillRect(L * 0.05, -W / 2 + 2, L * 0.22, W - 4);
    ctx.restore();
    const inCurve = m.s > m.L0 && m.hd < Math.PI / 2 - 1e-9;
    if (toggles.vel) drawArrow(ctx, X(m.x), Y(m.y), X(m.x) + Math.cos(m.hd) * 60, Y(m.y) - Math.sin(m.hd) * 60, c.vel, 'υ');
    if (toggles.forces && inCurve) {
      const f = Math.min(m.need, m.max), per = 70 / Math.max(m.need, m.max);
      const ux = -Math.sin(m.hd), uy = Math.cos(m.hd); // towards the centre of the car's own turn
      drawArrow(ctx, X(m.x), Y(m.y), X(m.x) + ux * f * per, Y(m.y) - uy * f * per, c.friction, text.draw.friction);
    }
    const ok = !m.skid;
    label(ctx, ok ? `mυ²/R = ${num(m.need, 0)} N ≤ μmg = ${num(m.max, 0)} N` : `mυ²/R = ${num(m.need, 0)} N > μmg = ${num(m.max, 0)} N`, 12, 20, c, 'left');
    hint(ctx, text.draw.speed(num(p.v, 1), num(p.v * 3.6, 0)), 12, 46, c);
  },
};

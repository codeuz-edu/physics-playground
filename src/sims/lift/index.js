import { num } from '../../core/format.js';
import { drawArrow, ink, label, reserve } from '../../ui/canvas.js';
import { gParam, hint } from '../kit.js';

const params = [
  { key: 'm', symbol: 'm', unit: 'kg', min: 20, max: 120, step: 1, default: 60, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'a', symbol: 'a', unit: 'm/s²', min: 0.5, max: 5, step: 0.1, default: 2, kind: 'initial', decimals: 1, color: '--acc' },
  // Mode names are in the text file (params.mode.options), in this order.
  { key: 'mode', symbol: '', unit: '', min: 0, max: 2, step: 1, default: 0, kind: 'initial', options: ['up', 'down', 'rope-cut'] },
  gParam,
];

/**
 * Lift ride in three parts: speeding up for 2 s, steady for 3 s, slowing to a stop for 2 s.
 * Mode 2 (the rope snapped): the cabin falls freely for 1.5 s. The scale reads the weight P = m(g + a_y).
 */
class LiftModel {
  t = 0; y = 0; v = 0; ay = 0; P = 0; seen = [0, 0, 0]; end = 7; lift = false; floor0 = 1;
  reset(p) {
    this.t = 0; this.y = 0; this.v = 0; this.end = p.mode === 2 ? 1.5 : 7;
    // Floor the ride starts from: a lift going down starts high enough to stay above the 1st floor.
    this.floor0 = p.mode === 0 ? 1 : 1 + Math.ceil((p.mode === 1 ? 10 * p.a : 0.5 * p.g * this.end * this.end) / 3);
    const dir = p.mode === 1 ? -1 : 1;
    // The scale can only push, never pull: when the cabin's downward acceleration exceeds g it reads 0.
    this.seen = p.mode === 2 ? [0, 0, 0] : [p.m * (p.g + dir * p.a), p.m * p.g, p.m * (p.g - dir * p.a)].map((P) => Math.max(0, P));
    this.lift = p.mode !== 2 && p.a > p.g; // the person floats off the scale for part of the ride
    this.acc(p);
  }
  acc(p) {
    const dir = p.mode === 1 ? -1 : 1;
    if (p.mode === 2) this.ay = -p.g;
    else this.ay = this.t < 2 - 1e-9 ? dir * p.a : this.t < 5 - 1e-9 ? 0 : this.t < this.end - 1e-9 ? -dir * p.a : 0;
    this.P = Math.max(0, p.m * (p.g + this.ay));
  }
  step(dt, p) {
    if (this.t >= this.end - 1e-9) return false;
    const d = Math.min(dt, this.end - this.t);
    this.acc(p);
    this.y += this.v * d + 0.5 * this.ay * d * d;
    this.v += this.ay * d;
    this.t += d;
    if (this.t >= this.end - 1e-9) { if (p.mode !== 2) this.v = 0; this.ay = 0; this.P = p.mode === 2 ? 0 : p.m * p.g; if (p.mode === 2) { this.ay = -p.g; this.P = 0; } return false; }
    this.acc(p);
    return true;
  }
  isValid() { return [this.t, this.y, this.v, this.ay, this.P].every(Number.isFinite); }
  sample() { return { ay: this.ay, v: this.v, P: this.P, y: this.y }; }
  clone() { return Object.assign(new LiftModel(), this, { seen: this.seen.slice() }); }
  finishMessage(text) {
    if (this.end < 2) return text.msg.freeFall;
    const [a, b, c] = this.seen;
    return text.msg.ride(num(a, 1), num(b, 1), num(c, 1), this.lift);
  }
}

export default {
  id: 'lift',
  params,
  stageSize: 'tall',
  viewPadding: { left: 24, right: 24, top: 24, bottom: 16 },
  presets: [
    { values: { m: 60, a: 2, mode: 0, g: 9.81 } },
    { values: { m: 50, a: 1.5, mode: 1, g: 9.81 } },
    { values: { m: 60, a: 2, mode: 2, g: 9.81 } },
  ],
  toggles: [
    { key: 'forces', default: true },
    { key: 'acc', default: true },
  ],
  readouts: [
    { key: 'ay', unit: 'm/s²', decimals: 2, color: '--acc' },
    { key: 'v', unit: 'm/s', decimals: 2, color: '--vel' },
    { key: 'P', unit: 'N', decimals: 1, color: '--force' },
  ],
  graphs: [
    { id: 'a', yLabel: 'aᵧ', unit: 'm/s²', series: [{ key: 'ay', color: '--acc' }] },
    { id: 'P', yLabel: 'P', unit: 'N', series: [{ key: 'P', color: '--force' }] },
  ],
  createModel: () => new LiftModel(),
  // A wider strip left of the shaft, so the badge in the top-left corner stays clear of the shaft wall.
  worldBounds: () => ({ xMin: -2.6, xMax: 2.2, yMin: 0, yMax: 3.6 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    ctx.fillStyle = c.surface; ctx.fillRect(0, 0, view.width, view.height);
    // The shaft scrolls past the cabin: floor lines every 3 m with their numbers.
    const floor = 3;
    ctx.save(); ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.fillStyle = c.muted; ctx.font = '500 12px Barlow, sans-serif'; ctx.textBaseline = 'bottom';
    const base = Math.floor((m.y - 4) / floor) * floor;
    for (let f = base; f < m.y + 8; f += floor) {
      const yy = Math.round(Y(f - m.y + 0.3)) + 0.5;
      ctx.beginPath(); ctx.moveTo(X(-2.6), yy); ctx.lineTo(X(-1.05), yy); ctx.moveTo(X(1.05), yy); ctx.lineTo(X(2.2), yy); ctx.stroke();
      const n = Math.round(f / floor) + m.floor0;
      // A floor name passing under the badge at the top, or half out at the bottom edge, is left out.
      if (n >= 1 && yy > 50 && yy < view.height - 16) ctx.fillText(text.draw.floor(n), X(-2.5), yy - 3);
    }
    ctx.restore();
    // Shaft walls and the cabin.
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.scenery;
    for (const x of [-1.05, 1.05]) { ctx.beginPath(); ctx.moveTo(X(x), 0); ctx.lineTo(X(x), view.height); ctx.stroke(); }
    const cx0 = X(-0.85), cx1 = X(0.85), cTop = Y(3.1), cBot = Y(0.3);
    ctx.fillStyle = c.bg || c.surface; ctx.fillRect(cx0, cTop, cx1 - cx0, cBot - cTop);
    ctx.lineWidth = ink.object; ctx.strokeRect(cx0, cTop, cx1 - cx0, cBot - cTop);
    ctx.lineWidth = 1.25; ctx.beginPath(); ctx.moveTo(X(0), 0); ctx.lineTo(X(0), cTop); ctx.stroke();
    if (p.mode === 2 && m.t > 0) { ctx.strokeStyle = c.warn; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(0) - 8, cTop - 28); ctx.lineTo(X(0) + 8, cTop - 40); ctx.stroke(); }
    ctx.restore();
    // Scale on the floor with its reading, and the person standing on it.
    const sx = X(-0.35), sw = 0.7 * S, sy = cBot - 0.1 * S;
    ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.fillRect(sx, sy, sw, 0.1 * S); ctx.strokeRect(sx, sy, sw, 0.1 * S);
    const head = 0.12 * S, bodyTop = sy - 1.55 * S;
    ctx.fillStyle = c.track;
    ctx.beginPath(); ctx.arc(X(0), bodyTop - head, head, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillRect(X(-0.2), bodyTop, 0.4 * S, 0.8 * S); ctx.strokeRect(X(-0.2), bodyTop, 0.4 * S, 0.8 * S);
    ctx.fillRect(X(-0.17), bodyTop + 0.8 * S, 0.14 * S, 0.75 * S); ctx.strokeRect(X(-0.17), bodyTop + 0.8 * S, 0.14 * S, 0.75 * S);
    ctx.fillRect(X(0.03), bodyTop + 0.8 * S, 0.14 * S, 0.75 * S); ctx.strokeRect(X(0.03), bodyTop + 0.8 * S, 0.14 * S, 0.75 * S);
    ctx.restore();
    // The person and the scale are bodies: no vector name is put on them.
    reserve(ctx, X(-0.2), bodyTop - 2 * head, 0.4 * S, 1.55 * S + 2 * head); reserve(ctx, sx, sy, sw, 0.1 * S);
    label(ctx, `${num(m.P / p.g, 1)} kg`, X(0), sy + 0.05 * S + 18, c, 'center');
    const per = Math.min(0.9 * S, 0.24 * view.height) / (p.m * p.g);
    const midY = bodyTop + 0.4 * S;
    if (toggles.forces) {
      // Weight on the left of the person, the scale's push on the right: the two names never meet.
      drawArrow(ctx, X(-0.32), midY, X(-0.32), midY + p.m * p.g * per, c.fg, 'mg');
      if (m.P > 0.5) drawArrow(ctx, X(0.32), sy, X(0.32), sy - m.P * per, c.force, 'N');
    }
    if (toggles.acc && Math.abs(m.ay) > 1e-6) {
      const L = Math.min(1.2 * S, (Math.abs(m.ay) / p.g) * 0.9 * S);
      drawArrow(ctx, X(1.45), Y(1.7), X(1.45), Y(1.7) - Math.sign(m.ay) * L, c.acc, 'a');
    }
    if (Math.abs(m.v) > 0.01) hint(ctx, m.v > 0 ? text.draw.up : text.draw.down, X(1.3), Y(2.6), c);
    label(ctx, `P = m(g + aᵧ) = ${num(m.P, 0)} N`, 12, 20, c, 'left');
  },
};

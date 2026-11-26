import { num } from '../../core/format.js';
import { drawArrow, drawGround, drawSky, ink, label, reserve } from '../../ui/canvas.js';
import { advance, box, gParam, hint, pulley, rope, weight } from '../kit.js';

const RUN = 1.0; // m the hanging load falls before it reaches the floor
const TOP = 1.5; // m, height of the table top
const START = -1.55; // m, left edge of the block at t = 0 (the biggest block stops short of the pulley)

const params = [
  { key: 'm1', symbol: 'm₁', unit: 'kg', min: 0.5, max: 10, step: 0.1, default: 2, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'm2', symbol: 'm₂', unit: 'kg', min: 0.1, max: 10, step: 0.1, default: 1, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'mu', symbol: 'μ', unit: '', min: 0, max: 0.8, step: 0.01, default: 0, kind: 'initial', decimals: 2, color: '--friction' },
  gParam,
];

class ConnectedModel {
  t = 0; s = 0; v = 0; a = 0; T = 0; f = 0; pull = 0; hold = 0; moving = false; reason = '';
  reset(p) {
    this.t = 0; this.s = 0; this.v = 0; this.reason = '';
    this.pull = p.m2 * p.g;
    this.hold = p.mu * p.m1 * p.g;
    this.moving = this.pull > this.hold + 1e-9;
    this.a = this.moving ? (this.pull - this.hold) / (p.m1 + p.m2) : 0;
    this.f = this.moving ? this.hold : this.pull;
    this.T = p.m2 * (p.g - this.a);
  }
  step(dt) {
    if (this.reason) return false;
    if (!this.moving) {
      this.t += dt;
      if (this.t >= 2 - 1e-9) { this.reason = 'rest'; return false; }
      return true;
    }
    const r = advance(this.s, this.v, this.a, dt, RUN);
    this.s = r.s; this.v = r.v; this.t += r.tau;
    if (r.hit) { this.reason = 'floor'; return false; }
    return true;
  }
  isValid() { return [this.t, this.s, this.v, this.a, this.T].every(Number.isFinite); }
  sample() { return { s: this.s, v: this.v, a: this.a, T: this.T, f: this.f }; }
  clone() { return Object.assign(new ConnectedModel(), this); }
  finishMessage(text) {
    if (this.reason === 'floor') return text.msg.floor(num(this.t, 2), num(this.v, 2), num(this.T, 2));
    if (this.reason === 'rest') return text.msg.rest(num(this.pull, 1), num(this.hold, 1));
    return '';
  }
}

const side = (m, k) => Math.min(0.46, Math.max(0.16, k * Math.cbrt(m)));

export default {
  id: 'connected',
  params,
  stageSize: 'tall',
  viewPadding: { left: 24, right: 24, top: 40, bottom: 28 },
  presets: [
    { values: { m1: 2, m2: 1, mu: 0, g: 9.81 } },
    { values: { m1: 4, m2: 1.5, mu: 0.2, g: 9.81 } },
    { values: { m1: 5, m2: 1, mu: 0.3, g: 9.81 } },
    { values: { m1: 0.5, m2: 8, mu: 0, g: 9.81 } },
  ],
  toggles: [
    { key: 'forces', default: true },
    { key: 'values', default: true },
  ],
  readouts: [
    { key: 'a', unit: 'm/s²', decimals: 2, color: '--acc' },
    { key: 'T', unit: 'N', decimals: 2, color: '--force' },
    { key: 'v', unit: 'm/s', decimals: 2, color: '--vel' },
  ],
  graphs: [
    { id: 'v', yLabel: 'υ', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
    { id: 's', yLabel: 's', unit: 'm', series: [{ key: 's', color: '--pos' }] },
  ],
  createModel: () => new ConnectedModel(),
  // Room under the floor for the weight of the load when it has come down (its arrow reaches into the floor).
  worldBounds: () => ({ xMin: -1.95, xMax: 0.75, yMin: -0.4, yMax: 1.95 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, gy = Y(0);
    drawSky(ctx, view, c, gy);
    drawGround(ctx, view, c, gy);
    // Table: a top slab on two legs, its right edge at x = 0 where the pulley is clamped.
    ctx.save();
    ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.fillRect(X(-1.8), Y(TOP), X(0) - X(-1.8), 0.05 * S);
    ctx.strokeRect(X(-1.8), Y(TOP), X(0) - X(-1.8), 0.05 * S);
    for (const lx of [-1.7, -0.12]) { ctx.fillRect(X(lx), Y(TOP - 0.05), 0.05 * S, Y(0) - Y(TOP - 0.05)); ctx.strokeRect(X(lx), Y(TOP - 0.05), 0.05 * S, Y(0) - Y(TOP - 0.05)); }
    ctx.restore();
    // Block on the table (sized first: the pulley is set to the height of its rope).
    const w1 = Math.max(36, side(p.m1, 0.22) * S), h1 = Math.max(22, side(p.m1, 0.22) * S * 0.66);
    const bx = X(START + m.s), by = Y(TOP) - h1;
    // Pulley on a bracket at the table edge, the wheel clear of the edge. Its top is level with the middle
    // of the block's side, where the rope is tied, so the rope runs parallel to the table.
    const r = Math.max(7, 0.06 * S), px = X(0) + r + 2, py = by + h1 / 2 + r;
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.moveTo(X(-0.02), Y(TOP)); ctx.lineTo(px, py); ctx.stroke(); ctx.restore();
    pulley(ctx, px, py, r, c, (m.s * S) / r);
    reserve(ctx, px - r - 2, py - r - 2, 2 * r + 4, 2 * r + 4); // the names of the arrows keep off the wheel
    // Hanging load: never so small that its mass does not fit on it.
    const w2 = Math.max(36, side(p.m2, 0.18) * S), h2 = Math.max(27, side(p.m2, 0.18) * S * 0.9);
    const lx = px + r, lyBottom = Y(RUN - m.s), lyTop = lyBottom - h2 - 6;
    rope(ctx, [[bx + w1, by + h1 / 2], [px, py - r]], c);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.arc(px, py, r, -Math.PI / 2, 0); ctx.stroke(); ctx.restore();
    rope(ctx, [[lx, py], [lx, lyTop]], c);
    box(ctx, bx, by, w1, h1, c, `${num(p.m1, 1)} kg`);
    weight(ctx, lx, lyTop, w2, h2, c, `${num(p.m2, 1)} kg`);
    // Floor mark under the load. Its name sits on the half of the mark the load (and the badge beside it) is
    // not passing.
    const cyW = lyTop + 6 + h2 / 2;
    hint(ctx, `h = ${num(RUN, 1)} m`, lx + w2 / 2 + 10, Y(cyW < Y(RUN / 2) ? RUN * 0.25 : RUN * 0.75), c);
    ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = c.ghost; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(lx + w2 / 2 + 4, Y(RUN)); ctx.lineTo(lx + w2 / 2 + 4, gy); ctx.stroke(); ctx.restore();

    if (toggles.forces) {
      // One scale for the run: the T on the load stays under the pulley at the start, and the weight stays on
      // the stage when the load has come down to the floor.
      const big = Math.max(p.m2 * p.g, m.T, m.f, 1e-6), top0 = Y(RUN) - h2 - 6, per0 = Math.min(90, 0.22 * view.height) / big;
      const per = Math.max(0.35 * per0, Math.min(per0, (top0 - (py + r + 4)) / Math.max(m.T, 1e-6), (view.height - 26 - gy) / (p.m2 * p.g)));
      const v = toggles.values;
      const cyB = by + h1 / 2, cxB = bx + w1 / 2;
      // The values first, so the names of the arrows keep off them.
      if (v) {
        label(ctx, `T = ${num(m.T, 1)} N`, cxB, by - 18, c, 'center');
        label(ctx, `m₂g = ${num(p.m2 * p.g, 1)} N`, lx + w2 / 2 + 12, cyW, c, 'left');
      }
      drawArrow(ctx, bx + w1, cyB, bx + w1 + m.T * per, cyB, c.force, 'T');
      if (m.f > 1e-6) drawArrow(ctx, bx, by + h1 - 3, bx - m.f * per, by + h1 - 3, c.friction, text.draw.friction);
      drawArrow(ctx, lx, lyTop, lx, lyTop - m.T * per, c.force, 'T');
      drawArrow(ctx, lx, lyTop + 6 + h2, lx, lyTop + 6 + h2 + p.m2 * p.g * per, c.fg, 'm₂g');
    }
  },
};

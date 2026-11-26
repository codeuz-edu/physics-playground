import { num } from '../../core/format.js';
import { drawArrow, drawGround, drawSky, ink, label, reserve, subText } from '../../ui/canvas.js';
import { DEG, box, dim, gParam, hint } from '../kit.js';

const HALF = 1.1; // m, half the beam length
const STOP = 12; // °, the beam rests on the stops at this tilt
const PIV = 0.9; // m, height of the pivot

const params = [
  { key: 'm1', symbol: 'm₁', unit: 'kg', min: 0.1, max: 10, step: 0.1, default: 2, kind: 'initial', decimals: 1, color: '--vx' },
  { key: 'd1', symbol: 'd₁', unit: 'm', min: 0.05, max: 1, step: 0.05, default: 0.3, kind: 'initial', decimals: 2, color: '--vx' },
  { key: 'm2', symbol: 'm₂', unit: 'kg', min: 0.1, max: 10, step: 0.1, default: 1, kind: 'initial', decimals: 1, color: '--vy' },
  { key: 'd2', symbol: 'd₂', unit: 'm', min: 0.05, max: 1, step: 0.05, default: 0.5, kind: 'initial', decimals: 2, color: '--vy' },
  gParam,
];

/** Light lever on a pivot; released at rest, it turns until a stop if the moments differ. θ > 0: right side down. */
class LeverModel {
  t = 0; th = 0; w = 0; M1 = 0; M2 = 0; reason = '';
  reset(p) { this.t = 0; this.th = 0; this.w = 0; this.reason = ''; this.M1 = p.m1 * p.g * p.d1; this.M2 = p.m2 * p.g * p.d2; }
  step(dt, p) {
    if (this.reason) return false;
    const net = this.M2 - this.M1;
    if (Math.abs(net) < 1e-6) { this.t += dt; if (this.t >= 2 - 1e-9) { this.reason = 'balance'; return false; } return true; }
    const I = p.m1 * p.d1 * p.d1 + p.m2 * p.d2 * p.d2 + 0.05;
    const al = (net * Math.cos(this.th)) / I;
    this.w += al * dt; this.th += this.w * dt; this.t += dt;
    if (Math.abs(this.th) >= STOP * DEG) { this.th = Math.sign(this.th) * STOP * DEG; this.w = 0; this.reason = 'tip'; return false; }
    return true;
  }
  isValid() { return [this.t, this.th, this.w].every(Number.isFinite); }
  sample() { return { M1: this.M1, M2: this.M2, net: this.M2 - this.M1, th: this.th / DEG }; }
  clone() { return Object.assign(new LeverModel(), this); }
  finishMessage(text) {
    const M = `M₁ = ${num(this.M1, 2)} N·m, M₂ = ${num(this.M2, 2)} N·m`;
    if (this.reason === 'balance') return text.msg.balance(M);
    if (this.reason === 'tip') return text.msg.tip(this.th > 0, M);
    return '';
  }
}

const size = (m) => Math.min(0.32, Math.max(0.14, 0.18 * Math.cbrt(m)));

export default {
  id: 'lever',
  params,
  stageSize: 'tall',
  viewPadding: { left: 24, right: 24, top: 30, bottom: 24 },
  presets: [
    { values: { m1: 2, d1: 0.3, m2: 1, d2: 0.6, g: 9.81 } },
    { values: { m1: 3, d1: 0.4, m2: 2, d2: 0.5, g: 9.81 } },
    { values: { m1: 5, d1: 0.2, m2: 1, d2: 1, g: 9.81 } },
  ],
  toggles: [
    { key: 'forces', default: true },
    { key: 'arms', default: true },
    { key: 'ticks', default: true },
  ],
  readouts: [
    { key: 'M1', unit: 'N·m', decimals: 2, color: '--vx' },
    { key: 'M2', unit: 'N·m', decimals: 2, color: '--vy' },
    { key: 'th', unit: '°', decimals: 1, color: '--pos' },
  ],
  graphs: [
    { id: 'th', yLabel: 'θ', unit: '°', series: [{ key: 'th', color: '--pos' }] },
  ],
  createModel: () => new LeverModel(),
  worldBounds: () => ({ xMin: -HALF - 0.35, xMax: HALF + 0.35, yMin: -0.05, yMax: PIV + 0.75 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, gy = Y(0);
    drawSky(ctx, view, c, gy);
    drawGround(ctx, view, c, gy);
    // Fulcrum: a wedge from the ground up to the pivot, and the two stops.
    ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.moveTo(X(0), Y(PIV)); ctx.lineTo(X(-0.16), gy); ctx.lineTo(X(0.16), gy); ctx.closePath(); ctx.fill(); ctx.stroke();
    const stopY = PIV - Math.sin(STOP * DEG) * (HALF - 0.05);
    for (const sx of [-(HALF - 0.05) * Math.cos(STOP * DEG), (HALF - 0.05) * Math.cos(STOP * DEG)]) { ctx.fillRect(X(sx) - 3, Y(stopY), 6, gy - Y(stopY)); ctx.strokeRect(X(sx) - 3, Y(stopY), 6, gy - Y(stopY)); }
    ctx.restore();
    // Beam, rotated about the pivot.
    const ct = Math.cos(m.th), st = Math.sin(m.th);
    const at = (d) => [X(0) + d * ct * S, Y(PIV) + d * st * S]; // point on the beam d metres right of the pivot
    const bh = 0.05 * S;
    ctx.save(); ctx.translate(X(0), Y(PIV)); ctx.rotate(m.th);
    ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.fillRect(-HALF * S, -bh, 2 * HALF * S, bh); ctx.strokeRect(-HALF * S, -bh, 2 * HALF * S, bh);
    if (toggles.ticks) {
      ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.fillStyle = c.muted; ctx.font = '500 11px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      // A number right where a weight arrow leaves the beam is left out: the arm's own value says it.
      const under = (d) => toggles.forces && (Math.abs(d + p.d1) < 0.06 || Math.abs(d - p.d2) < 0.06);
      for (let d = -1; d <= 1 + 1e-9; d += 0.1) { const x = d * S, big = Math.abs(Math.round(d * 10) % 5) === 0; ctx.beginPath(); ctx.moveTo(x, -bh); ctx.lineTo(x, -bh + (big ? 0.6 : 0.35) * bh); ctx.stroke(); if (big && Math.abs(d) > 1e-6 && !under(d)) ctx.fillText(num(Math.abs(d), 1), x, 3); }
    }
    // Loads stand on the beam.
    // A load close to the pivot is drawn narrower, so the two loads never overlap across the pivot.
    const w1 = Math.max(0.06, Math.min(size(p.m1), 2 * p.d1 - 0.01)) * S, w2 = Math.max(0.06, Math.min(size(p.m2), 2 * p.d2 - 0.01)) * S;
    const h1 = size(p.m1) * 0.8 * S, h2 = size(p.m2) * 0.8 * S;
    // The mass is written in the box when it fits; otherwise just above the box.
    const fits = (t, w, h) => { ctx.font = `600 ${Math.min(13, Math.max(11, h * 0.42))}px Barlow, sans-serif`; return w > 26 && h > 14 && ctx.measureText(t).width <= w - 6; };
    const t1 = `${num(p.m1, 1)} kg`, t2 = `${num(p.m2, 1)} kg`, in1 = fits(t1, w1, h1), in2 = fits(t2, w2, h2);
    box(ctx, -p.d1 * S - w1 / 2, -bh - h1, w1, h1, c, in1 ? t1 : '');
    box(ctx, p.d2 * S - w2 / 2, -bh - h2, w2, h2, c, in2 ? t2 : '');
    ctx.restore();
    ctx.save(); ctx.fillStyle = c.fg; ctx.beginPath(); ctx.arc(X(0), Y(PIV), 3.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    const [l1x, l1y] = at(-p.d1), [l2x, l2y] = at(p.d2);
    const over = (x, y, h, up = 0) => [x + (bh + h + 10 + up) * st, y - (bh + h + 10 + up) * ct]; // just above a box standing at (x, y) on the beam
    // Two loads close to the pivot: the second mass goes one line higher, so the two never run together.
    ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; const near = !in1 && !in2 && l2x - l1x < (ctx.measureText(t1).width + ctx.measureText(t2).width) / 2 + 6; ctx.restore();
    if (!in1) hint(ctx, t1, ...over(l1x, l1y, h1), c, 'center');
    if (!in2) hint(ctx, t2, ...over(l2x, l2y, h2, near ? Math.max(0, h1 - h2) + 15 : 0), c, 'center');
    // The fulcrum is a body for the vector names: a few strips down the wedge.
    for (let i = 0; i < 4; i++) { const w = 0.16 * S * (i + 1) / 4, ya = Y(PIV) + ((gy - Y(PIV)) * i) / 4; reserve(ctx, X(0) - w, ya, 2 * w, (gy - Y(PIV)) / 4); }
    // Arms: from the pivot to each weight's line of action, below the beam. The value goes just outside
    // the outer end, beyond the weight arrow, so it is crossed neither by the arrow nor by the fulcrum.
    if (toggles.arms) {
      const y1 = Y(PIV) + Math.max(0.16 * S, 30), y2 = Y(PIV) + Math.max(0.3 * S, 60), e1 = y1 + (l1y - Y(PIV)), e2 = y2 + (l2y - Y(PIV));
      dim(ctx, l1x, e1, X(0), y1, '', c);
      dim(ctx, X(0), y2, l2x, e2, '', c);
      // The arm lines are taken too, piece by piece (they tilt with the beam): a weight's name is not put on them.
      for (const [xa, ya, xb, yb] of [[l1x, e1, X(0), y1], [X(0), y2, l2x, e2]]) {
        const k = Math.max(1, Math.ceil(Math.abs(xb - xa) / 12));
        for (let i = 0; i < k; i++) { const x0 = xa + ((xb - xa) * i) / k, y0 = ya + ((yb - ya) * i) / k, x1 = xa + ((xb - xa) * (i + 1)) / k, y1b = ya + ((yb - ya) * (i + 1)) / k; reserve(ctx, Math.min(x0, x1), Math.min(y0, y1b) - 4, Math.abs(x1 - x0), Math.abs(y1b - y0) + 8); }
      }
      // Outlined in the sky's colour, so a stop post behind a value does not cut through it.
      const tag = (t, x, y, right) => {
        ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        const line = subText(ctx, t), l = right ? x - line.width : x;
        ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = c['sky-bottom'] || c.surface; line.draw(l, y, true);
        ctx.fillStyle = c.muted; line.draw(l, y); ctx.restore();
        reserve(ctx, l, y - 7, line.width, 14);
      };
      tag(`d₁ = ${num(p.d1, 2)} m`, l1x - 7, e1, true);
      tag(`d₂ = ${num(p.d2, 2)} m`, l2x + 7, e2, false);
    }
    if (toggles.forces) {
      const per = Math.min(90, 0.22 * view.height) / (Math.max(p.m1, p.m2) * p.g);
      drawArrow(ctx, l1x, l1y, l1x, l1y + p.m1 * p.g * per, c.vx, 'm₁g');
      drawArrow(ctx, l2x, l2y, l2x, l2y + p.m2 * p.g * per, c.vy, 'm₂g');
    }
    const net = m.M2 - m.M1;
    label(ctx, Math.abs(net) < 1e-6 ? text.draw.balance(num(m.M1, 2)) : `M₁ = ${num(m.M1, 2)} N·m ${net > 0 ? '<' : '>'} M₂ = ${num(m.M2, 2)} N·m`, 12, 20, c, 'left');
    if (m.t === 0) hint(ctx, text.draw.hint, X(0), Y(PIV + 0.66), c, 'center');
  },

  drag: {
    hit(x, y, model, p) {
      if (model.t > 0 && !model.reason) return null;
      if (Math.abs(y - PIV - 0.12) < 0.25) { if (Math.abs(x + p.d1) < 0.15) return 'l'; if (Math.abs(x - p.d2) < 0.15) return 'r'; }
      return null;
    },
    move(h, x) { return h === 'l' ? { d1: Math.max(0.05, -x) } : { d2: Math.max(0.05, x) }; },
  },
};

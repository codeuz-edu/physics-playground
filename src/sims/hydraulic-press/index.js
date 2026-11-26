import { num } from '../../core/format.js';
import { drawArrow, drawGround, ink, label, vectorLabel } from '../../ui/canvas.js';
import { box, gParam, hint } from '../kit.js';
import { dashed, liquidFill, liquidLine, vdim } from '../fluids.js';

const D = 0.2, U = 0.6; // small-piston stroke (m) and its speed (m/s), both ways
// The run lasts about 2·h·(S₂/S₁)/U, so the area ratio is capped at 800/4 = 200: at h = 30 cm the longest run is 200 s.
const OIL = 900;
const geo = (p) => {
  const r1 = Math.max(0.012, Math.sqrt(p.S1 / Math.PI) / 100), r2 = Math.sqrt(p.S2 / Math.PI) / 100;
  const x1 = 0.12, xb0 = Math.max(0.3, x1 + r1 + 0.12);
  return { r1, r2, x1, xb0, x2: xb0 + r2 };
};

const params = [
  { key: 'M', symbol: 'M', unit: 'kg', min: 10, max: 3000, step: 10, default: 1500, kind: 'initial', decimals: 0 },
  { key: 'S1', symbol: 'S₁', unit: 'cm²', min: 4, max: 50, step: 1, default: 10, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'S2', symbol: 'S₂', unit: 'cm²', min: 50, max: 800, step: 10, default: 500, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'H', symbol: 'h', unit: 'cm', min: 0.5, max: 30, step: 0.1, default: 4, kind: 'initial', decimals: 1, color: '--pos' },
  gParam,
];

/** A hand pump: the small piston strokes down (pushing oil into the big cylinder through a valve) and back up (refilling from the tank). */
class PressModel {
  t = 0; s = 0; y2 = 0; n = 1; phase = 'down'; pushed = 0; reason = ''; p = null;
  reset(p) { this.p = { ...p }; this.t = 0; this.s = 0; this.y2 = 0; this.n = 1; this.phase = 'down'; this.pushed = 0; this.reason = ''; }
  step(dt) {
    if (this.reason) return false;
    const k = this.p.S1 / this.p.S2, H = this.p.H / 100;
    let left = dt;
    while (left > 1e-12) {
      const go = U * left;
      if (this.phase === 'down') {
        const need = (H - this.y2) / k, room = D - this.s;
        if (need <= Math.min(go, room) + 1e-9) { this.s += need; this.pushed += need; this.y2 = H; this.t += need / U; this.reason = 'top'; return false; }
        if (room <= go) { this.s = D; this.y2 += room * k; this.pushed += room; this.t += room / U; left -= room / U; this.phase = 'up'; continue; }
        this.s += go; this.y2 += go * k; this.pushed += go; this.t += left; left = 0;
      } else {
        if (this.s <= go) { this.t += this.s / U; left -= this.s / U; this.s = 0; this.phase = 'down'; this.n += 1; continue; }
        this.s -= go; this.t += left; left = 0;
      }
    }
    return true;
  }
  isValid() { return [this.t, this.s, this.y2].every(Number.isFinite); }
  force() { const q = this.p; return (q.M * q.g * q.S1) / q.S2; }
  sample() {
    const q = this.p;
    return { F1: this.phase === 'down' && !this.reason ? this.force() : this.reason ? this.force() : 0, p: (q.M * q.g) / (q.S2 / 1e4) / 1000, h2: this.y2 * 100, n: this.n, A: this.force() * this.pushed };
  }
  clone() { return Object.assign(new PressModel(), this, { p: { ...this.p } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const q = this.p, Mg = q.M * q.g, F1 = this.force();
    // Mg with as many decimals as F₁ needs to be compared with it (14715 N, but 196,2 N).
    const W = num(Mg, Math.abs(Mg - Math.round(Mg)) < 0.05 ? 0 : 1);
    const gain = q.S2 === q.S1 ? text.msg.noGain(num(F1, 1), W) : text.msg.gain(num(F1, 1), W, num(q.S2 / q.S1, 1));
    return text.msg.top(num(q.H, 1), this.n, gain, num(Mg * q.H / 100, 1));
  }
}

export default {
  id: 'hydraulic-press',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { M: 1500, S1: 10, S2: 500, H: 4, g: 9.81 } },
    { values: { M: 1200, S1: 4, S2: 800, H: 2, g: 9.81 } },
    { values: { M: 600, S1: 20, S2: 400, H: 6, g: 9.81 } },
    { values: { M: 20, S1: 50, S2: 50, H: 20, g: 9.81 } },
  ],
  toggles: [{ key: 'forces', default: true }, { key: 'dims', default: true }],
  readouts: [
    { key: 'F1', unit: 'N', decimals: 1, color: '--force' },
    { key: 'p', unit: 'kPa', decimals: 1, color: '--acc' },
    { key: 'h2', unit: 'cm', decimals: 2, color: '--pos' },
    { key: 'n', unit: '', decimals: 0 },
  ],
  graphs: [
    { id: 'h', yLabel: 'h', unit: 'cm', series: [{ key: 'h2', color: '--pos' }] },
    { id: 'F', yLabel: 'F₁', unit: 'N', series: [{ key: 'F1', color: '--force' }] },
  ],
  createModel: () => new PressModel(),
  // The press stands on the ground (its bottom at 0,04 m).
  worldBounds: (p) => { const g = geo(p); return { xMin: -0.24, xMax: Math.max(0.75, g.x2 + Math.max(g.r2, 0.12) + 0.16), yMin: 0.02, yMax: 0.98 }; },

  draw({ ctx, view, model: m, params: p, toggles: tg, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, g = geo(p);
    const ys = 0.5 - m.s, yb = 0.2 + m.y2, fill = liquidFill(c, OIL), surf = liquidLine(c, OIL);
    drawGround(ctx, view, c, Y(0.04));
    const rect = (x0, y0, x1, y1) => ctx.fillRect(X(x0), Y(y1), X(x1) - X(x0), Y(y0) - Y(y1));
    ctx.save(); ctx.fillStyle = fill;
    rect(-0.2, 0.04, -0.06, 0.2); rect(-0.06, 0.04, g.x1 - g.r1, 0.08); rect(g.x1 - g.r1, 0.04, g.x1 + g.r1, ys);
    rect(g.x1 + g.r1, 0.04, g.xb0, 0.08); rect(g.xb0, 0.04, g.x2 + g.r2, yb);
    ctx.strokeStyle = surf; ctx.lineWidth = ink.scenery; ctx.beginPath(); ctx.moveTo(X(-0.2), Y(0.2)); ctx.lineTo(X(-0.06), Y(0.2)); ctx.stroke();
    const seg = (pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke(); };
    ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.lineJoin = 'miter';
    seg([[-0.2, 0.3], [-0.2, 0.04], [g.x2 + g.r2, 0.04], [g.x2 + g.r2, 0.6]]);
    seg([[-0.06, 0.3], [-0.06, 0.08], [g.x1 - g.r1, 0.08], [g.x1 - g.r1, 0.62]]);
    seg([[g.x1 + g.r1, 0.62], [g.x1 + g.r1, 0.08], [g.xb0, 0.08], [g.xb0, 0.6]]);
    // One-way valves: the open one is drawn solid.
    const valve = (x, open) => {
      const vx = X(x), vy = Y(0.06), k = 5;
      ctx.beginPath(); ctx.moveTo(vx - k, vy - k); ctx.lineTo(vx + k, vy); ctx.lineTo(vx - k, vy + k); ctx.closePath();
      ctx.fillStyle = open ? c.fg : c.surface; ctx.fill(); ctx.lineWidth = 1.25; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(vx + k, vy - k); ctx.lineTo(vx + k, vy + k); ctx.stroke();
    };
    const running = m.t > 0 && !m.reason;
    valve((-0.06 + g.x1 - g.r1) / 2, running && m.phase === 'up');
    valve((g.x1 + g.r1 + g.xb0) / 2, running && m.phase === 'down');
    ctx.restore();
    // Small piston, rod and handle.
    ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    const pw = X(g.x1 + g.r1) - X(g.x1 - g.r1), ph = 0.03 * S;
    ctx.fillRect(X(g.x1 - g.r1), Y(ys) - ph, pw, ph); ctx.strokeRect(X(g.x1 - g.r1), Y(ys) - ph, pw, ph);
    const rodTop = Y(ys + 0.27);
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(g.x1), Y(ys) - ph); ctx.lineTo(X(g.x1), rodTop); ctx.stroke();
    ctx.lineWidth = ink.object; ctx.beginPath(); ctx.moveTo(X(g.x1) - 12, rodTop); ctx.lineTo(X(g.x1) + 12, rodTop); ctx.stroke();
    // Big piston and its load.
    const bw = X(g.x2 + g.r2) - X(g.xb0), bph = 0.04 * S;
    ctx.fillRect(X(g.xb0), Y(yb) - bph, bw, bph); ctx.strokeRect(X(g.xb0), Y(yb) - bph, bw, bph); ctx.restore();
    // The load sits on the piston inside the cylinder, so it is as wide as the bore; its mass is written on it,
    // or above it when the bore is too narrow for the text.
    const lw = bw - 4, lh = 0.14 * S, mass = `${num(p.M, 0)} kg`;
    ctx.save(); ctx.font = `600 ${Math.min(13, Math.max(11, lh * 0.42))}px Barlow, sans-serif`; const fits = ctx.measureText(mass).width <= lw - 8; ctx.restore();
    box(ctx, X(g.x2) - lw / 2, Y(yb) - bph - lh, lw, lh, c, fits ? mass : '');
    if (!fits) hint(ctx, mass, X(g.x2), Math.min(Y(yb) - bph - lh, Y(0.6)) - 10, c, 'center');
    if (tg.forces) {
      // F₁ is drawn at least 24 px long (to scale it would be a few pixels beside F₂), its name left of it, off the handle.
      const k = p.S1 / p.S2, L2 = Math.min(70, 0.16 * view.height), L1 = Math.max(24, L2 * k), fx = X(g.x1);
      if (m.phase === 'down' || m.reason) {
        drawArrow(ctx, fx, rodTop - 4 - L1, fx, rodTop - 2, c.force, '');
        const lx = Math.min(fx - 16, X(g.x1 - g.r1) - 14); // clear of the cylinder's wall when the handle is low
        vectorLabel(ctx, 'F₁', lx, rodTop - 4 - L1 / 2, c.force, 'center', 'middle', [[2 * fx - lx, rodTop - 4 - L1 / 2], [fx, rodTop - L1 - 16]]);
      }
      // F₂, the oil's push on the big piston, beside the load; its name right of the tip, off the load.
      const f2x = X(g.x2 + g.r2) + 14;
      drawArrow(ctx, f2x, Y(yb), f2x, Y(yb) - L2, c.pos, '');
      vectorLabel(ctx, 'F₂', f2x + 14, Y(yb) - L2 + 6, c.pos, 'center', 'middle', [[f2x, Y(yb) - L2 - 12]]);
    }
    if (tg.dims && m.y2 > 1e-4) {
      dashed(ctx, X(g.x2 + g.r2), Y(0.2), X(g.x2 + g.r2) + 40, Y(0.2), c.ghost);
      vdim(ctx, X(g.x2 + g.r2) + 34, Y(0.2), Y(yb), text.draw.lift(num(m.y2 * 100, 1)), c);
    }
    label(ctx, `p = F₁/S₁ = F₂/S₂ = ${num((p.M * p.g) / (p.S2 / 1e4) / 1000, 1)} kPa`, 12, 20, c, 'left');
  },
};

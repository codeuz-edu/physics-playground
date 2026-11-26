import { num } from '../../core/format.js';
import { drawGround, ink, label } from '../../ui/canvas.js';
import { advance, gParam, hint } from '../kit.js';
import { LIQUIDS, dashed, liquidFill, liquidLine, liquidName, liquidParam, pick, vdim } from '../fluids.js';

const BASE = [LIQUIDS[0], LIQUIDS[4]];
const TOP = [LIQUIDS[2], LIQUIDS[3], LIQUIDS[0]];
// U-tube in metres: two arms 6 cm wide joined by a channel at the bottom; liquid starts at Y0.
const AL = [-0.23, -0.17], AR = [0.17, 0.23], CH = [0.05, 0.11], TOPY = 0.75, Y0 = 0.38;

const params = [
  liquidParam(BASE, 'liq1', 'ρ₁'),
  liquidParam(TOP, 'liq2', 'ρ₂'),
  { key: 'H2', symbol: 'h₂', unit: 'cm', min: 2, max: 40, step: 0.1, default: 20, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'q', symbol: 'q', unit: 'cm/s', min: 0.5, max: 10, step: 0.5, default: 4, kind: 'live', decimals: 1 },
  gParam,
];

/** A second, lighter liquid is poured into the right arm; at the interface level ρ₁gh₁ = ρ₂gh₂. */
class VesselsModel {
  t = 0; h2 = 0; reason = ''; p = null;
  reset(p) { this.p = { ...p }; this.t = 0; this.h2 = 0; this.reason = ''; }
  step(dt, p) {
    if (this.reason) return false;
    const r = advance(this.h2, p.q / 100, 0, dt, this.p.H2 / 100);
    this.h2 = r.s; this.t += r.tau;
    if (r.hit) { this.reason = 'full'; return false; }
    return true;
  }
  /** Half the water-column height: how far the interface sinks and the free arm rises. */
  shift() { const q = this.p; return (pick(TOP, q.liq2).rho * this.h2) / (2 * pick(BASE, q.liq1).rho); }
  isValid() { return Number.isFinite(this.h2) && Number.isFinite(this.t); }
  sample() {
    const q = this.p, x = this.shift(), r1 = pick(BASE, q.liq1).rho, r2 = pick(TOP, q.liq2).rho;
    return { h1: 200 * x, h2: 100 * this.h2, dh: 100 * this.h2 - 200 * x, p1: r1 * q.g * 2 * x, p2: r2 * q.g * this.h2 };
  }
  clone() { return Object.assign(new VesselsModel(), this, { p: { ...this.p } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const q = this.p, a = pick(BASE, q.liq1), b = pick(TOP, q.liq2), s = this.sample();
    return text.msg.full(liquidName(a), liquidName(b), num(s.h1, 1), num(q.H2, 1), num(b.rho / a.rho, 3));
  }
}

export default {
  id: 'communicating',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { liq1: 0, liq2: 0, H2: 20, q: 4, g: 9.81 } },
    { values: { liq1: 0, liq2: 1, H2: 25, q: 4, g: 9.81 } },
    { values: { liq1: 1, liq2: 2, H2: 27.2, q: 4, g: 9.81 } },
    { values: { liq1: 0, liq2: 2, H2: 20, q: 4, g: 9.81 } },
  ],
  toggles: [
    { key: 'dims', default: true },
    { key: 'level', default: true },
  ],
  readouts: [
    { key: 'h1', unit: 'cm', decimals: 1, color: '--pos' },
    { key: 'h2', unit: 'cm', decimals: 1, color: '--vel' },
    { key: 'dh', unit: 'cm', decimals: 1 },
    { key: 'p2', unit: 'Pa', decimals: 0, color: '--acc' },
  ],
  graphs: [
    { id: 'h', yLabel: 'h', unit: 'cm', series: [{ key: 'h1', color: '--pos' }, { key: 'h2', color: '--vel' }] },
    { id: 'p', yLabel: 'p', unit: 'Pa', series: [{ key: 'p1', color: '--pos' }, { key: 'p2', color: '--acc' }] },
  ],
  createModel: () => new VesselsModel(),
  // The tube stands on the ground (its bottom at CH[0]).
  worldBounds: () => ({ xMin: -0.42, xMax: 0.42, yMin: CH[0] - 0.01, yMax: 0.9 }),

  draw({ ctx, view, model: m, params: p, toggles: tg, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y);
    const a = pick(BASE, p.liq1), b = pick(TOP, p.liq2), x = m.shift(), yL = Y0 + x, yI = Y0 - x, yT = yI + m.h2;
    drawGround(ctx, view, c, Y(CH[0]));
    const rect = (x0, y0, x1, y1, fill) => { ctx.fillStyle = fill; ctx.fillRect(X(x0), Y(y1), X(x1) - X(x0), Y(y0) - Y(y1)); };
    const line = (x0, x1, y, col) => { ctx.strokeStyle = col; ctx.lineWidth = ink.scenery; ctx.beginPath(); ctx.moveTo(X(x0), Math.round(Y(y)) + 0.5); ctx.lineTo(X(x1), Math.round(Y(y)) + 0.5); ctx.stroke(); };
    ctx.save();
    const f1 = liquidFill(c, a.rho), f2 = liquidFill(c, b.rho);
    rect(AL[0], CH[0], AR[1], CH[1], f1); rect(AL[0], CH[1], AL[1], yL, f1); rect(AR[0], CH[1], AR[1], yI, f1);
    if (m.h2 > 0) rect(AR[0], yI, AR[1], yT, f2);
    line(AL[0], AL[1], yL, liquidLine(c, a.rho));
    if (m.h2 > 0) { line(AR[0], AR[1], yI, liquidLine(c, b.rho)); line(AR[0], AR[1], yT, liquidLine(c, b.rho)); } else line(AR[0], AR[1], yI, liquidLine(c, a.rho));
    // Glass: the outer U and the inner U.
    ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(X(AL[0]), Y(TOPY)); ctx.lineTo(X(AL[0]), Y(CH[0])); ctx.lineTo(X(AR[1]), Y(CH[0])); ctx.lineTo(X(AR[1]), Y(TOPY));
    ctx.moveTo(X(AL[1]), Y(TOPY)); ctx.lineTo(X(AL[1]), Y(CH[1])); ctx.lineTo(X(AR[0]), Y(CH[1])); ctx.lineTo(X(AR[0]), Y(TOPY)); ctx.stroke();
    // Funnel over the right arm and, while pouring, the stream.
    const fx = (AR[0] + AR[1]) / 2;
    ctx.beginPath(); ctx.moveTo(X(fx - 0.075), Y(0.86)); ctx.lineTo(X(fx - 0.012), Y(0.79)); ctx.lineTo(X(fx - 0.012), Y(0.72));
    ctx.moveTo(X(fx + 0.075), Y(0.86)); ctx.lineTo(X(fx + 0.012), Y(0.79)); ctx.lineTo(X(fx + 0.012), Y(0.72)); ctx.stroke();
    if (m.t > 0 && !m.reason) { ctx.strokeStyle = liquidLine(c, b.rho); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(fx), Y(0.72)); ctx.lineTo(X(fx), Y(yT)); ctx.stroke(); }
    ctx.restore();
    hint(ctx, text.draw.liquid(liquidName(a)), X(AL[0]) - 8, Y(Math.min(yL + 0.05, 0.7)), c, 'right');
    if (m.h2 > 0) hint(ctx, text.draw.liquid(liquidName(b)), X(AR[1]) + 8, Y(Math.min(yT + 0.05, 0.7)), c, 'left');
    if (m.h2 > 0.002) {
      if (tg.level) dashed(ctx, X(AL[0] - 0.08), Y(yI), X(AR[1] + 0.08), Y(yI), c.ghost);
      if (tg.dims) {
        // The values are set beside the lines here (not by vdim) so that h₁, h₂ get real subscripts.
        vdim(ctx, X(AL[0]) - 16, Y(yI), Y(yL), '', c, 'left');
        vdim(ctx, X(AR[1]) + 16, Y(yI), Y(yT), '', c, 'right');
        // Beside the middle of the line; under the interface's dashed line while the column is still short.
        const ink = { ...c, muted: c.fg }, at = (y1) => (Y(y1) - Y(yI) > -18 ? Y(yI) + 10 : (Y(yI) + Y(y1)) / 2);
        if (Math.abs(Y(yL) - Y(yI)) >= 2) hint(ctx, text.draw.h1(num(200 * x, 1)), X(AL[0]) - 23, at(yL), ink, 'right');
        if (Math.abs(Y(yT) - Y(yI)) >= 2) hint(ctx, text.draw.h2(num(100 * m.h2, 1)), X(AR[1]) + 23, at(yT), ink, 'left');
      }
    }
    label(ctx, `ρ₁gh₁ = ρ₂gh₂`, 12, 20, c, 'left');
  },
};

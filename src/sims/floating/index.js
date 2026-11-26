import { num } from '../../core/format.js';
import { drawArrow, drawGround, ink, label, reserve, vectorLabel } from '../../ui/canvas.js';
import { box, gParam, hint } from '../kit.js';
import { LIQUIDS, dashed, liquidFill, liquidLine, liquidName, liquidParam, pick, vessel } from '../fluids.js';

// Metres: tank 1 m wide and 1 m tall, liquid 0,8 m deep; the cube starts with its centre 0,4 m under the surface.
// TMAX only guards against a run that never settles; no slider combination comes near it (the slowest settles in about 20 s).
const TW = 1, TH = 1, DL = 0.8, START = 0.4, CD = 1, GAMMA = 2, TMAX = 200, SHELL_DT = 1 / 240;

const params = [
  { key: 'rhoB', symbol: 'ρ', unit: 'kg/m³', min: 100, max: 12000, step: 10, default: 500, kind: 'initial', decimals: 0, color: '--pos' },
  liquidParam(LIQUIDS, 'liq', 'ρₛ'),
  { key: 'a', symbol: 'a', unit: 'cm', min: 10, max: 30, step: 1, default: 20, kind: 'initial', decimals: 0 },
  gParam,
];

/**
 * A cube released under the surface: weight, buoyancy of the wetted part and the liquid's drag; it rises and floats, sinks, or stays.
 * Drag is the quadratic form drag of the wetted part, plus a linear term for the waves the body makes while it pierces the surface
 * (that is what stops the bobbing). Both are taken implicitly in the new velocity, so the step stays stable for a light body in
 * mercury, where the drag rate is far above 1/dt, and the drag can only slow the body down, never reverse it.
 */
class FloatModel {
  t = 0; yb = 0; v = 0; reason = ''; p = null;
  reset(p) { this.p = { ...p }; this.t = 0; this.v = 0; this.yb = DL - START - p.a / 200; this.reason = ''; }
  dims() { const q = this.p, a = q.a / 100, rl = pick(LIQUIDS, q.liq).rho; return { a, rl, rb: q.rhoB, r: q.rhoB / rl, m: q.rhoB * a * a * a }; }
  /** Buoyancy of the wetted part minus the weight (N), with the bottom face at height yb. */
  force(yb) { const { a, rl, m } = this.dims(), hs = Math.max(0, Math.min(a, DL - yb)); return rl * this.p.g * a * a * hs - m * this.p.g; }
  step(dt) {
    if (this.reason) return false;
    const { a, rl, r, m } = this.dims(), hs = Math.max(0, Math.min(a, DL - this.yb)), wet = hs / a;
    const c2 = wet * 0.5 * CD * rl * a * a, c1 = wet > 0 && wet < 1 ? wet * GAMMA * rl * a * a * a : 0;
    // Backward Euler in v: m(v' − v)/dt = F − c1·v' − c2·|v'|·v'. The sign of v' is the sign of P = mv/dt + F.
    const P = (m * this.v) / dt + this.force(this.yb), B = m / dt + c1, q = Math.abs(P);
    this.v = (Math.sign(P) * 2 * q) / (B + Math.sqrt(B * B + 4 * c2 * q));
    this.yb += this.v * dt; this.t += dt;
    if (this.yb <= 0) { this.yb = 0; if (this.force(0) <= 0) { this.v = 0; this.reason = 'bottom'; return false; } this.v = Math.max(0, this.v); }
    if (Math.abs(r - 1) < 1e-9 && this.t >= 1.5) { this.reason = 'neutral'; return false; }
    const d = DL - this.yb;
    if (r < 1 && this.t > 0.5 && Math.abs(this.v) < 0.001 && Math.abs(d - a * r) < 0.0003) { this.yb = DL - a * r; this.v = 0; this.reason = 'float'; return false; }
    if (this.t >= TMAX) { this.reason = 'time'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.yb) && Number.isFinite(this.v); }
  sample() {
    const { a, rl, m } = this.dims(), g = this.p.g, hs = Math.max(0, Math.min(a, DL - this.yb));
    return { FA: rl * g * a * a * hs, mg: m * g, frac: (100 * hs) / a, d: 100 * (DL - this.yb), v: this.v };
  }
  clone() { return Object.assign(new FloatModel(), this, { p: { ...this.p } }); }
  finishMessage(text) {
    const { a, rl, rb, r, m } = this.dims(), mg = m * this.p.g;
    if (this.reason === 'float') return text.msg.float(num(100 * r, 0), num(r, 2), num(mg, 1));
    if (this.reason === 'bottom') return text.msg.bottom(num(rb, 0), num(rl, 0), num(rl * this.p.g * a * a * a, 1), num(mg, 1));
    if (this.reason === 'neutral') return text.msg.neutral(num(mg, 1));
    if (this.reason === 'time') return text.msg.time(num(TMAX, 0), num(rb, 0), num(rl, 0));
    return '';
  }
}

/** Highest point the cube's top reaches during the run (m), so the view can hold a light cube that leaps out of a dense liquid. */
let peakKey = '', peakVal = 0;
function peakTop(p) {
  const key = `${p.rhoB}|${p.liq}|${p.a}|${p.g}`;
  if (key !== peakKey) {
    const m = new FloatModel(), a = p.a / 100;
    m.reset(p);
    let top = m.yb + a;
    for (let n = 0; n < TMAX / SHELL_DT + 10 && m.step(SHELL_DT); n++) top = Math.max(top, m.yb + a);
    peakKey = key; peakVal = Number.isFinite(top) ? top : TH;
  }
  return peakVal;
}

export default {
  id: 'floating',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { rhoB: 240, liq: 0, a: 20, g: 9.81 } },
    { values: { rhoB: 500, liq: 0, a: 20, g: 9.81 } },
    { values: { rhoB: 900, liq: 1, a: 20, g: 9.81 } },
    { values: { rhoB: 900, liq: 2, a: 20, g: 9.81 } },
    { values: { rhoB: 7800, liq: 0, a: 20, g: 9.81 } },
    { values: { rhoB: 7800, liq: 4, a: 20, g: 9.81 } },
    { values: { rhoB: 1000, liq: 0, a: 20, g: 9.81 } },
  ],
  toggles: [{ key: 'forces', default: true }, { key: 'eq', default: true }],
  readouts: [
    { key: 'FA', unit: 'N', decimals: 1, color: '--current' },
    { key: 'mg', unit: 'N', decimals: 1, color: '--muted' },
    { key: 'frac', unit: '%', decimals: 0, color: '--pos' },
    { key: 'd', unit: 'cm', decimals: 1 },
  ],
  graphs: [
    { id: 'F', yLabel: 'F', unit: 'N', series: [{ key: 'FA', color: '--current' }, { key: 'mg', color: '--muted' }] },
    { id: 'd', yLabel: 'd', unit: 'cm', series: [{ key: 'd', color: '--pos' }] },
  ],
  createModel: () => new FloatModel(),
  // Room under the floor for the weight arrow of a cube that rests on it, and its name.
  worldBounds: (p) => ({ xMin: -0.06, xMax: TW + 0.06, yMin: -0.12, yMax: Math.max(TH + 0.05, peakTop(p) + 0.04) }),

  draw({ ctx, view, model: m, params: p, toggles: tg, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    const liq = pick(LIQUIDS, p.liq), a = p.a / 100, r = p.rhoB / liq.rho, s = m.sample();
    drawGround(ctx, view, c, Y(0));
    ctx.save(); ctx.fillStyle = liquidFill(c, liq.rho); ctx.fillRect(X(0), Y(DL), X(TW) - X(0), Y(0) - Y(DL)); ctx.restore();
    const bx = X(TW / 2 - a / 2), by = Y(m.yb + a), bs = a * S;
    box(ctx, bx, by, bs, bs, c, '', c.track);
    const hs = Math.max(0, Math.min(a, DL - m.yb));
    if (hs > 0) { ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = liquidFill(c, liq.rho); ctx.fillRect(bx - 1, Y(Math.min(DL, m.yb + a)), bs + 2, Y(m.yb) - Y(Math.min(DL, m.yb + a))); ctx.restore(); }
    ctx.save(); ctx.strokeStyle = liquidLine(c, liq.rho); ctx.lineWidth = ink.scenery; ctx.beginPath(); ctx.moveTo(X(0), Math.round(Y(DL)) + 0.5); ctx.lineTo(X(TW), Math.round(Y(DL)) + 0.5); ctx.stroke(); ctx.restore();
    vessel(ctx, X(0), Y(TH), X(TW), Y(0), c);
    if (tg.eq && r < 1) {
      const yq = Y(DL - a * r);
      dashed(ctx, bx - 26, yq, bx + bs + 26, yq, c.acc);
      reserve(ctx, bx - 26, yq - 3, bs + 52, 6); // the vector names stay off this line
      hint(ctx, text.draw.depth(num(a * r * 100, 1)), bx + bs + 32, yq, c);
    }
    if (tg.forces) {
      // The names go beside the tips, on the far side from the other arrow: inside the cube when the tip is,
      // clear of its edges and of the waterline drawn across it.
      // A cube resting on the floor has its weight arrow through the floor: it ends high enough above the stage's
      // lower edge for its name, which then sits under the floor's hatching.
      const L = Math.min(80, 0.18 * view.height, view.height - Y(0) + (a / 2) * S - 26) / Math.max(1e-9, s.mg, liq.rho * p.g * a * a * a), cx = X(TW / 2), cy = Y(m.yb + a / 2);
      const tipG = cy + s.mg * L, tipA = cy - s.FA * L, gl = tipG > Y(0) - 4 ? Math.max(tipG - 8, Y(0) + 22) : tipG - 8;
      drawArrow(ctx, cx - 6, cy, cx - 6, tipG, c.fg, '');
      vectorLabel(ctx, 'mg', cx - 22, gl, c.fg, 'center', 'middle', [[cx - 22, tipG + 12], [cx - 6, tipG + 14]]);
      if (s.FA > 1e-6) {
        drawArrow(ctx, cx + 6, cy, cx + 6, tipA, c.current, '');
        vectorLabel(ctx, 'F_A', cx + 24, tipA + 8, c.current, 'center', 'middle', [[cx + 24, tipA - 12], [cx + 6, tipA - 14]]);
      }
    }
    hint(ctx, text.draw.liquid(liquidName(liq)), X(0) + 10, Y(DL) + 14, c);
    const verdict = Math.abs(r - 1) < 1e-9 ? 'neutral' : r < 1 ? 'float' : 'sink';
    label(ctx, text.draw.ratio(num(r, 2), text.draw.verdict[verdict]), 12, 20, c, 'left');
  },
};

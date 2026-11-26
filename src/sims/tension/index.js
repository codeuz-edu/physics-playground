import { num } from '../../core/format.js';
import { drawArrow, drawSky, ink, label } from '../../ui/canvas.js';
import { DEG, gParam, hint, rope, support, weight } from '../kit.js';

const CEIL = 2.4; // m, height of the beam the ropes hang from

const params = [
  { key: 'm', symbol: 'm', unit: 'kg', min: 0.5, max: 50, step: 0.5, default: 10, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'al', symbol: 'α', unit: '°', min: 5, max: 85, step: 1, default: 30, kind: 'initial', decimals: 0, color: '--vx' },
  { key: 'be', symbol: 'β', unit: '°', min: 5, max: 85, step: 1, default: 30, kind: 'initial', decimals: 0, color: '--vy' },
  gParam,
];

const A0 = 85; // °, the ropes start almost vertical
const PULL = 4; // s, the rope ends are drawn apart slowly, so the knot is in equilibrium all the time

/** A load hanging on two ropes at angles α, β (degrees, from the horizontal): the knot's equilibrium. */
function tensions(m, g, al, be) {
  const a = al * DEG, b = be * DEG, W = m * g, s = Math.sin(a + b);
  return { W, T1: (W * Math.cos(b)) / s, T2: (W * Math.cos(a)) / s };
}
/** Rope angles k of the way (0…1) from the start to the chosen ones. */
const anglesAt = (p, k) => [A0 + (p.al - A0) * k, A0 + (p.be - A0) * k];
/**
 * Layout for the two angles: the knot hangs under the middle of the beam and each rope rises at its
 * angle to its own hook. The depth shrinks for shallow ropes so both hooks stay on the beam.
 */
function layout(al, be) {
  const ta = Math.tan(al * DEG), tb = Math.tan(be * DEG);
  const D = Math.min(1.2, 2.0 * Math.min(ta, tb));
  return { knot: [0, CEIL - D], a: [-D / ta, CEIL], b: [D / tb, CEIL] };
}

/**
 * The rope ends slide apart along the beam, slowly enough that the knot is always at rest: the angles
 * fall linearly from 85° to the chosen α and β, and the tensions follow the equilibrium at each moment.
 */
class TensionModel {
  t = 0; a = A0; b = A0; T1 = 0; T2 = 0; W = 0; p = null;
  reset(p) { this.p = { ...p }; this.t = 0; this.set(); }
  set() {
    const p = this.p, [a, b] = anglesAt(p, Math.min(1, this.t / PULL)), r = tensions(p.m, p.g, a, b);
    this.a = a; this.b = b; this.T1 = r.T1; this.T2 = r.T2; this.W = r.W;
  }
  step(dt) {
    if (this.t >= PULL - 1e-9) return false;
    this.t = Math.min(PULL, this.t + dt); this.set();
    return this.t < PULL - 1e-9;
  }
  isValid() { return [this.t, this.a, this.b, this.T1, this.T2, this.W].every(Number.isFinite); }
  sample() { return { T1: this.T1, T2: this.T2, W: this.W, a: this.a, b: this.b }; }
  clone() { return Object.assign(new TensionModel(), this, { p: { ...this.p } }); }
  finishMessage(text) { return text.msg.done(num(this.T1, 1), num(this.T2, 1), num(this.W, 1)); }
}

export default {
  id: 'tension',
  params,
  stageSize: 'tall',
  viewPadding: { left: 24, right: 24, top: 30, bottom: 24 },
  presets: [
    { values: { m: 10, al: 30, be: 30, g: 9.81 } },
    { values: { m: 10, al: 10, be: 10, g: 9.81 } },
    { values: { m: 5, al: 30, be: 60, g: 9.81 } },
    { values: { m: 10, al: 80, be: 80, g: 9.81 } },
  ],
  toggles: [
    { key: 'forces', default: true },
    { key: 'comp', default: false },
    { key: 'tri', default: true },
  ],
  readouts: [
    { key: 'T1', unit: 'N', decimals: 1, color: '--vx' },
    { key: 'T2', unit: 'N', decimals: 1, color: '--vy' },
    { key: 'W', unit: 'N', decimals: 1, color: '--fg' },
    { key: 'a', unit: '°', decimals: 0, color: '--vx' },
    { key: 'b', unit: '°', decimals: 0, color: '--vy' },
  ],
  graphs: [
    { id: 'T', yLabel: 'T', unit: 'N', series: [{ key: 'T1', color: '--vx' }, { key: 'T2', color: '--vy' }, { key: 'W', color: '--fg' }] },
    { id: 'ang', yLabel: 'α', unit: '°', series: [{ key: 'a', color: '--vx' }, { key: 'b', color: '--vy' }] },
  ],
  createModel: () => new TensionModel(),
  worldBounds: () => ({ xMin: -2.3, xMax: 3.6, yMin: -0.2, yMax: CEIL + 0.25 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    drawSky(ctx, view, c, Y(-0.2));
    support(ctx, X(-2.2), X(2.2), Y(CEIL), c, 'up');
    // The two tensions, above the left end of the beam (drawn first, so the names of the arrows keep off it).
    label(ctx, `T₁ = ${num(m.T1, 1)} N   T₂ = ${num(m.T2, 1)} N`, X(-2.2), Y(CEIL) - 24, c, 'left');
    // Until the ropes reach the chosen angles, those are shown as dashed lines.
    if (Math.abs(m.a - p.al) > 0.5 || Math.abs(m.b - p.be) > 0.5) {
      const G = layout(p.al, p.be), gk = [X(G.knot[0]), Y(G.knot[1])];
      ctx.save(); ctx.setLineDash([4, 5]); ctx.strokeStyle = c.ghost; ctx.lineWidth = 1; ctx.beginPath();
      ctx.moveTo(X(G.a[0]), Y(G.a[1])); ctx.lineTo(gk[0], gk[1]); ctx.lineTo(X(G.b[0]), Y(G.b[1])); ctx.stroke(); ctx.restore();
    }
    const L = layout(m.a, m.b);
    const K = [X(L.knot[0]), Y(L.knot[1])], A = [X(L.a[0]), Y(L.a[1])], B = [X(L.b[0]), Y(L.b[1])];
    rope(ctx, [A, K, B], c);
    // Angle marks at the hooks, measured from the beam; with steep ropes the hooks are close together,
    // so the arcs shrink and the values move outside the ropes.
    // A value goes inside, between its rope and the beam, only where that gap is tall enough for it (a rope
    // at 27° or more), and both go inside only when the hooks are far enough apart for the two side by side.
    const ra = Math.min(34, Math.max(12, 0.45 * (B[0] - A[0]))), both = B[0] - A[0] > 170;
    const roomA = K[0] - A[0] > 70 && m.a > 27, roomB = B[0] - K[0] > 70 && m.b > 27;
    const inA = roomA && (both || !roomB), inB = roomB && (both || !roomA);
    ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(A[0], A[1], ra, 0, m.a * DEG); ctx.stroke();
    ctx.beginPath(); ctx.arc(B[0], B[1], ra, Math.PI - m.b * DEG, Math.PI); ctx.stroke(); ctx.restore();
    hint(ctx, `α = ${num(m.a, 0)}°`, inA ? A[0] + 40 : A[0] - 8, A[1] + 12, c, inA ? 'left' : 'right');
    hint(ctx, `β = ${num(m.b, 0)}°`, inB ? B[0] - 40 : B[0] + 8, B[1] + 12, c, inB ? 'right' : 'left');
    for (const P of [A, B]) { ctx.save(); ctx.fillStyle = c.fg; ctx.beginPath(); ctx.arc(P[0], P[1], 3, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    // Load under the knot: never so small that its mass does not fit on it.
    const w = Math.max(46, Math.min(0.5, Math.max(0.16, 0.12 * Math.cbrt(p.m))) * S), hang = 0.35 * S;
    rope(ctx, [K, [K[0], K[1] + hang]], c);
    weight(ctx, K[0], K[1] + hang, w, Math.max(28, w * 0.7), c, `${num(p.m, 1)} kg`);
    ctx.save(); ctx.fillStyle = c.surface; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.arc(K[0], K[1], 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    // Forces on the knot, to one scale for the whole run: mg is 70 px, unless the largest tension of
    // the run would then not fit on the stage.
    const per = Math.min(70, 0.18 * view.height) / m.W;
    const a = m.a * DEG, b = m.b * DEG;
    const t1 = [-Math.cos(a) * m.T1 * per, -Math.sin(a) * m.T1 * per], t2 = [Math.cos(b) * m.T2 * per, -Math.sin(b) * m.T2 * per];
    let top = 0;
    for (let i = 0; i <= 20; i++) { const [ai, bi] = anglesAt(p, i / 20), r = tensions(p.m, p.g, ai, bi); top = Math.max(top, r.T1, r.T2); }
    const longest = top * per;
    const clip = longest > 0.42 * view.height ? (0.42 * view.height) / longest : 1; // keep very long tensions on stage
    if (toggles.forces) {
      drawArrow(ctx, K[0], K[1], K[0] + t1[0] * clip, K[1] + t1[1] * clip, c.vx, 'T₁');
      drawArrow(ctx, K[0], K[1], K[0] + t2[0] * clip, K[1] + t2[1] * clip, c.vy, 'T₂');
      // The pull of the load on the knot, beside its rope and clear of the load itself.
      const gx = K[0] + Math.max(14, w / 2 + 10);
      drawArrow(ctx, gx, K[1], gx, K[1] + m.W * per * clip, c.fg, 'mg');
      if (clip < 1) hint(ctx, text.draw.scaled(num(1 / clip, 1)), X(-2.2), Y(0.05), c);
    }
    if (toggles.comp && toggles.forces) {
      ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = c.ghost; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(K[0] + t1[0] * clip, K[1] + t1[1] * clip); ctx.lineTo(K[0] + t1[0] * clip, K[1]);
      ctx.moveTo(K[0] + t2[0] * clip, K[1] + t2[1] * clip); ctx.lineTo(K[0] + t2[0] * clip, K[1]);
      ctx.stroke(); ctx.restore();
      drawArrow(ctx, K[0], K[1], K[0] + t1[0] * clip, K[1], c.vx, 'T₁ cos α', 'part');
      drawArrow(ctx, K[0], K[1], K[0] + t2[0] * clip, K[1], c.vy, 'T₂ cos β', 'part');
    }
    // Force triangle on the right: mg, then T₁, then T₂ close the figure, as equilibrium requires.
    if (toggles.tri) {
      const ox = X(2.95), oy = Y(CEIL - 0.25), k = clip * 0.9;
      const P0 = [ox, oy], P1 = [ox, oy + m.W * per * k], P2 = [P1[0] + t1[0] * k, P1[1] + t1[1] * k];
      // Its caption above it, on two lines when one would reach back over the end of the beam.
      ctx.save(); ctx.font = '500 12px Barlow, sans-serif';
      const cap = text.draw.triangle, room = view.width - 4 - (X(2.2) + 10), cut = cap.lastIndexOf(' ');
      const two = ctx.measureText(cap).width > room && cut > 0;
      ctx.restore();
      if (two) { hint(ctx, cap.slice(0, cut), Math.max(ox, view.width - 4 - room / 2), oy - 44, c, 'center'); hint(ctx, cap.slice(cut + 1), Math.max(ox, view.width - 4 - room / 2), oy - 30, c, 'center'); }
      else hint(ctx, cap, ox, oy - 30, c, 'center');
      drawArrow(ctx, P0[0], P0[1], P1[0], P1[1], c.fg, 'mg', 'part');
      drawArrow(ctx, P1[0], P1[1], P2[0], P2[1], c.vx, 'T₁', 'part');
      drawArrow(ctx, P2[0], P2[1], P0[0], P0[1], c.vy, 'T₂', 'part');
    }
  },
};

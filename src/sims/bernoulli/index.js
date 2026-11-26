import { num } from '../../core/format.js';
import { drawArrow, ink, label, vectorLabel } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { dashed, vdim } from '../fluids.js';

// Metres along the pipe: wide 0–1, taper 1–1,3, narrow 1,3–1,9, taper back 1,9–2,2, wide to 3. Radii are drawn enlarged.
const LEN = 3, X1 = 1, X2 = 1.3, X3 = 1.9, X4 = 2.2, RHO = 1000, G = 9.81, TUBES = [0.5, 1.6, 2.6], TW = 0.03;
const R = (S) => 0.16 * Math.sqrt(S / 40);
function rad(p, x) {
  const r1 = R(p.S1), r2 = R(p.S2);
  if (x <= X1 || x >= X4) return r1;
  if (x >= X2 && x <= X3) return r2;
  const f = x < X2 ? (x - X1) / (X2 - X1) : (X4 - x) / (X4 - X3);
  return r1 + (r2 - r1) * f;
}
// Pressures are gauge (above the atmosphere). The absolute pressure of water cannot fall below its saturated vapour pressure:
// where Bernoulli asks for less, the water boils into vapour bubbles (cavitation) and the pressure stays at P_MIN.
const P_ATM = 101.325, P_VAP = 2.34, P_MIN = (P_VAP - P_ATM) * 1000; // kPa, kPa (20 °C), Pa gauge
const vel = (p, x) => p.v1 * (R(p.S1) / rad(p, x)) ** 2;
const bern = (p, x) => p.p1 * 1000 + 0.5 * RHO * (p.v1 * p.v1 - vel(p, x) ** 2);
const pres = (p, x) => Math.max(P_MIN, bern(p, x));
/** The middle part: speed, Bernoulli's pressure there (kPa, may be below what water can hold) and whether it cavitates. */
const narrow = (p) => { const v2 = (p.v1 * p.S1) / p.S2, p2 = p.p1 - (0.5 * RHO * (v2 * v2 - p.v1 * p.v1)) / 1000; return { v2, p2, cav: p2 * 1000 < P_MIN }; };
const tubeTop = (p) => Math.max(0.6, (Math.max(p.p1, narrow(p).p2) * 1000) / (RHO * G) + 0.15);

const params = [
  { key: 'v1', symbol: 'υ₁', unit: 'm/s', min: 0.1, max: 2, step: 0.05, default: 0.6, kind: 'initial', decimals: 2, color: '--vel' },
  { key: 'S1', symbol: 'S₁', unit: 'cm²', min: 5, max: 40, step: 1, default: 20, kind: 'initial', decimals: 0 },
  { key: 'S2', symbol: 'S₂', unit: 'cm²', min: 2, max: 40, step: 1, default: 5, kind: 'initial', decimals: 0 },
  { key: 'p1', symbol: 'p₁', unit: 'kPa', min: 1, max: 15, step: 0.5, default: 5, kind: 'initial', decimals: 2, color: '--acc' },
];

/** A marked particle of water travels through the pipe at υ(x) = υ₁S₁/S(x); its pressure follows Bernoulli. */
class BernoulliModel {
  t = 0; x = 0; reason = ''; p = null;
  reset(p) { this.p = { ...p }; this.t = 0; this.x = 0; this.reason = ''; }
  step(dt) {
    if (this.reason) return false;
    const va = vel(this.p, this.x), vb = vel(this.p, Math.min(LEN, this.x + (va * dt) / 2)), nx = this.x + vb * dt;
    if (nx >= LEN) { this.t += Math.min(dt, (LEN - this.x) / vb); this.x = LEN; this.reason = 'out'; return false; }
    this.x = nx; this.t += dt;
    return true;
  }
  isValid() { return Number.isFinite(this.x) && Number.isFinite(this.t); }
  sample() { const q = this.p; return { v: vel(q, this.x), p: pres(q, this.x) / 1000, Q: (q.S1 * q.v1) / 10 }; }
  clone() { return Object.assign(new BernoulliModel(), this, { p: { ...this.p } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const q = this.p, { v2, p2, cav } = narrow(q), k = q.S1 / q.S2;
    if (q.S1 === q.S2) return text.msg.same(num(q.v1, 2), num(q.p1, 2));
    if (k < 1) {
      const dh = ((p2 - q.p1) * 1000) / (RHO * G) * 100;
      return text.msg.wider(num(1 / k, 1), num(v2, 2), num(q.p1, 2), num(p2, 2), num(dh, 1));
    }
    if (cav) return text.msg.cavitation(num(k, 1), num(v2, 2), num(p2 + P_ATM, 1), num(P_VAP, 2));
    if (p2 < 0) return text.msg.suction(num(k, 1), num(v2, 2), num(-p2, 2));
    const dh = ((q.p1 - p2) * 1000) / (RHO * G) * 100;
    return text.msg.narrower(num(k, 1), num(v2, 2), num(q.p1, 2), num(p2, 2), num(dh, 1));
  }
}

export default {
  id: 'bernoulli',
  params,
  stageSize: 'wide',
  viewPadding: { left: 16, right: 16, top: 60, bottom: 16 },
  presets: [
    { values: { v1: 0.6, S1: 20, S2: 5, p1: 5 } },
    { values: { v1: 1, S1: 30, S2: 10, p1: 10 } },
    { values: { v1: 1.2, S1: 20, S2: 10, p1: 8 } },
    { values: { v1: 0.8, S1: 30, S2: 4, p1: 5 } },
    { values: { v1: 1.5, S1: 10, S2: 30, p1: 3 } },
  ],
  toggles: [{ key: 'flow', default: true }, { key: 'vel', default: true }, { key: 'dims', default: true }],
  readouts: [
    { key: 'v', unit: 'm/s', decimals: 2, color: '--vel' },
    { key: 'p', unit: 'kPa', decimals: 2, color: '--acc' },
    { key: 'Q', unit: 'l/s', decimals: 2 },
  ],
  graphs: [
    { id: 'v', yLabel: 'υ', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
    { id: 'p', yLabel: 'p', unit: 'kPa', series: [{ key: 'p', color: '--acc' }] },
  ],
  createModel: () => new BernoulliModel(),
  worldBounds: (p) => ({ xMin: -0.12, xMax: LEN + 0.12, yMin: -R(Math.max(p.S1, p.S2)) - 0.06, yMax: tubeTop(p) + 0.04 }),

  draw({ ctx, view, model: m, params: p, toggles: tg, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y);
    const xs = [0, X1, X2, X3, X4, LEN], top = tubeTop(p);
    // Water in the pipe, then the walls.
    ctx.save(); ctx.fillStyle = c.water; ctx.beginPath();
    xs.forEach((x, i) => (i ? ctx.lineTo(X(x), Y(rad(p, x))) : ctx.moveTo(X(x), Y(rad(p, x)))));
    [...xs].reverse().forEach((x) => ctx.lineTo(X(x), Y(-rad(p, x))));
    ctx.closePath(); ctx.fill();
    for (const tx of TUBES) {
      const h = pres(p, tx) / (RHO * G), r = rad(p, tx);
      if (h > r) {
        ctx.fillStyle = c.water; ctx.fillRect(X(tx - TW), Y(h), X(tx + TW) - X(tx - TW), Y(r) - Y(h) + 1);
        ctx.strokeStyle = c['water-line']; ctx.lineWidth = ink.scenery; ctx.beginPath(); ctx.moveTo(X(tx - TW), Math.round(Y(h)) + 0.5); ctx.lineTo(X(tx + TW), Math.round(Y(h)) + 0.5); ctx.stroke();
      }
    }
    ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.lineJoin = 'round';
    // Upper wall with an opening under each manometer tube, then the lower wall.
    const pts = [...new Set([...xs, ...TUBES.flatMap((t) => [t - TW, t + TW])])].sort((a, b) => a - b);
    ctx.beginPath(); ctx.moveTo(X(0), Y(rad(p, 0)));
    for (let i = 1; i < pts.length; i++) {
      const x = pts[i], prev = pts[i - 1];
      if (TUBES.some((t) => Math.abs(t - TW - prev) < 1e-9)) { ctx.lineTo(X(prev), Y(top)); ctx.moveTo(X(x), Y(top)); }
      ctx.lineTo(X(x), Y(rad(p, x)));
    }
    ctx.stroke();
    ctx.beginPath(); xs.forEach((x, i) => (i ? ctx.lineTo(X(x), Y(-rad(p, x))) : ctx.moveTo(X(x), Y(-rad(p, x))))); ctx.stroke();
    ctx.restore();
    // Tracers: dots spaced evenly in travel time, so they bunch out where the water speeds up.
    if (tg.flow) {
      const n = 240, tau = [0];
      for (let i = 1; i <= n; i++) { const xa = (LEN * (i - 1)) / n, xb = (LEN * i) / n; tau.push(tau[i - 1] + (xb - xa) * 0.5 * (1 / vel(p, xa) + 1 / vel(p, xb))); }
      const T = tau[n], gap = Math.max(0.12, T / 22), at = (tt) => { let lo = 0, hi = n; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (tau[mid] <= tt) lo = mid; else hi = mid; } const f = (tt - tau[lo]) / Math.max(1e-12, tau[hi] - tau[lo]); return (LEN * (lo + f)) / n; };
      ctx.save(); ctx.fillStyle = c['water-line'];
      [-0.62, -0.22, 0.22, 0.62].forEach((f, k) => {
        for (let tt = (m.t + (k % 2) * gap * 0.5) % gap; tt <= T; tt += gap) {
          const x = at(tt); ctx.fillRect(X(x) - 1.5, Y(f * rad(p, x)) - 1.5, 3, 3);
        }
      });
      ctx.restore();
    }
    const mx = X(m.x), v = vel(p, m.x);
    if (tg.vel) {
      // The arrow starts at the edge of the particle's dot; its name sits on the pipe's axis past the tip, between
      // the rows of tracers, where a narrow pipe's wall cannot run through it. At the pipe's end the arrow is
      // shortened to stay on the stage with its name.
      const vmax = Math.max(p.v1, (p.v1 * p.S1) / p.S2), L = Math.min(110, Math.max(60, 0.12 * view.width)), tip = Math.min(mx + 6 + (L * v) / vmax, view.width - 22);
      drawArrow(ctx, mx + 6, Y(0), tip, Y(0), c.vel, '');
      vectorLabel(ctx, 'υ', tip + 10, Y(0) - 1, c.vel, 'center', 'middle', [[tip + 4, Y(0) - 14]]);
    }
    ctx.save(); ctx.fillStyle = c.acc; ctx.strokeStyle = c.surface; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(mx, Y(0), 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    TUBES.forEach((tx, i) => {
      const h = pres(p, tx) / (RHO * G);
      hint(ctx, `p${'₁₂₃'[i]} = ${num(pres(p, tx) / 1000, 2)} kPa`, X(tx), Y(top) - 10, c, 'center');
      // Over the tube's pressure (not across the tube's walls or the tapering pipe).
      if (h <= rad(p, tx)) hint(ctx, bern(p, tx) < P_MIN ? text.draw.cavitation : h < 0 ? text.draw.suction : text.draw.inPipe, X(tx), Y(top) - 26, c, 'center');
    });
    // Cavitation: vapour bubbles in the narrow part, where Bernoulli's pressure would fall below the vapour pressure.
    if (narrow(p).cav) {
      // Bubble size and spread in pixels, so every bubble stays inside the narrow part's walls.
      const rp = R(p.S2) * view.scale, br = Math.max(1, Math.min(3, 0.3 * rp)), room = Math.max(0, rp - br - 1.5);
      ctx.save(); ctx.strokeStyle = c.fg; ctx.fillStyle = c.surface; ctx.lineWidth = 1;
      for (let i = 0; i < 14; i++) {
        const bx = X2 + ((i * 0.37) % 1) * (X3 - X2), dy = (((i * 0.61) % 1) * 2 - 1) * room;
        ctx.beginPath(); ctx.arc(X(bx), Y(0) + dy, br * (0.7 + 0.15 * (i % 3)), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    }
    if (tg.dims) {
      const h1 = pres(p, TUBES[0]) / (RHO * G), h2 = pres(p, TUBES[1]) / (RHO * G);
      if (Math.abs(h1 - h2) > 0.005 && h2 > rad(p, TUBES[1])) {
        dashed(ctx, X(TUBES[0] + TW), Y(h1), X(TUBES[1] + TW + 0.12), Y(h1), c.ghost);
        vdim(ctx, X(TUBES[1] + TW + 0.1), Y(h1), Y(h2), text.draw.dh(num(Math.abs(h1 - h2) * 100, 1)), c);
      }
    }
    label(ctx, 'S₁υ₁ = S₂υ₂,   p + ρυ²/2 = const', 12, 20, c, 'left');
  },
};

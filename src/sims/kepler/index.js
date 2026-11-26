import { num } from '../../core/format.js';
import { drawArrow, ink, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';

const GM = 4 * Math.PI * Math.PI; // AU³/yr², Sun
const KMS = 4.74; // 1 AU/yr in km/s

const params = [
  { key: 'a', symbol: 'a', unit: 'au', min: 0.4, max: 5.5, step: 0.01, default: 1, kind: 'initial', decimals: 2, color: '--pos' },
  { key: 'e', symbol: 'e', unit: '', min: 0, max: 0.8, step: 0.001, default: 0.5, kind: 'initial', decimals: 3 },
  { key: 'n', symbol: 'n', unit: '', min: 4, max: 16, step: 1, default: 8, kind: 'initial', decimals: 0 },
];

/** Eccentric anomaly E at time t after perihelion, from Kepler's equation M = E − e sin E (T = a^1.5 years). */
function keplerE(a, e, t) {
  const T = Math.pow(a, 1.5), M = (2 * Math.PI * t) / T;
  let E = M + 0.85 * e * Math.sign(Math.sin(M));
  for (let i = 0; i < 30; i++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-12) break; }
  return E;
}

/** A planet around the Sun, from perihelion; RK4 in astronomical units and years. */
class KeplerModel {
  t = 0; x = 0; y = 0; vx = 0; vy = 0; turned = 0; prev = 0; T = 0; reason = ''; a = 1;
  reset(p) {
    const rp = p.a * (1 - p.e);
    this.a = p.a; this.t = 0; this.x = rp; this.y = 0; this.vx = 0; this.vy = Math.sqrt((GM * (1 + p.e)) / rp); this.turned = 0; this.prev = 0; this.T = 0; this.reason = '';
  }
  d(s) { const r = Math.hypot(s[0], s[1]), k = -GM / (r * r * r); return [s[2], s[3], k * s[0], k * s[1]]; }
  step(dt) {
    if (this.reason) return false;
    // More substeps near perihelion: about 300 per dynamical time r^1.5 (at least 6 per step).
    const r0 = Math.hypot(this.x, this.y), n = Math.min(400, Math.max(6, Math.ceil((dt * 300) / Math.pow(r0, 1.5)))), h = dt / n;
    // The angle swept is counted per substep, so the end of the orbit is timed to a small fraction of a substep.
    const t0 = this.t;
    for (let i = 0; i < n; i++) {
      const s = [this.x, this.y, this.vx, this.vy], k1 = this.d(s), k2 = this.d(s.map((v, j) => v + (k1[j] * h) / 2)), k3 = this.d(s.map((v, j) => v + (k2[j] * h) / 2)), k4 = this.d(s.map((v, j) => v + k3[j] * h));
      [this.x, this.y, this.vx, this.vy] = s.map((v, j) => v + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
      const ang = Math.atan2(this.y, this.x); let dd = ang - this.prev; if (dd < -Math.PI) dd += 2 * Math.PI; if (dd > Math.PI) dd -= 2 * Math.PI;
      this.turned += dd; this.prev = ang;
      if (this.turned >= 2 * Math.PI) { const f = dd > 0 ? (this.turned - 2 * Math.PI) / dd : 0; this.t = t0 + (i + 1) * h; this.T = this.t - f * h; this.reason = 'orbit'; return false; }
    }
    this.t = t0 + dt;
    return true;
  }
  isValid() { return [this.x, this.y, this.vx, this.vy].every(Number.isFinite); }
  sample() { return { r: Math.hypot(this.x, this.y), v: Math.hypot(this.vx, this.vy) * KMS, x: this.x, y: this.y }; }
  clone() { return Object.assign(new KeplerModel(), this); }
  finishMessage(text) { return this.reason ? text.msg.orbit(num(this.T, 2), num((this.T * this.T) / Math.pow(this.a || 1, 3), 3)) : ''; }
}

export default {
  id: 'kepler',
  params,
  timeUnit: 'yr',
  lengthUnit: 'au',
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { a: 1, e: 0.017, n: 12 } },
    { values: { a: 1.52, e: 0.093, n: 12 } },
    { values: { a: 5.2, e: 0.048, n: 12 } },
    { values: { a: 2, e: 0.7, n: 8 } },
  ],
  toggles: [{ key: 'areas', default: true }, { key: 'vel', default: true }, { key: 'orbit', default: true }],
  readouts: [
    { key: 'r', unit: 'au', decimals: 3, color: '--pos' },
    { key: 'v', unit: 'km/s', decimals: 1, color: '--vel' },
  ],
  graphs: [
    { id: 'r', yLabel: 'r', unit: 'au', series: [{ key: 'r', color: '--pos' }] },
    { id: 'v', yLabel: 'υ', unit: 'km/s', series: [{ key: 'v', color: '--vel' }] },
  ],
  createModel: () => new KeplerModel(),
  worldBounds: (p) => { const ra = p.a * (1 + p.e), b = p.a * Math.sqrt(1 - p.e * p.e), w = Math.max(ra, b) * 1.08; return { xMin: -ra - 0.08 * p.a, xMax: p.a * (1 - p.e) + 0.12 * p.a, yMin: -b * 1.1, yMax: b * 1.1 }; },

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    ctx.fillStyle = c.surface; ctx.fillRect(0, 0, view.width, view.height);
    const b = p.a * Math.sqrt(1 - p.e * p.e), cxw = -p.a * p.e;
    if (toggles.orbit) { ctx.save(); ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.ellipse(X(cxw), Y(0), p.a * S, b * S, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    // Equal-time sectors: each spans exactly T/n of time. Their ends come from Kepler's equation, so every
    // finished sector has the same area πab/n (the recorded path is sampled too coarsely to cut them exactly).
    const T = Math.pow(p.a, 1.5);
    if (toggles.areas && m.t > 0) {
      const dt = T / p.n, tNow = Math.min(m.t, T), pt = (E) => [X(p.a * (Math.cos(E) - p.e)), Y(b * Math.sin(E))];
      for (let k = 0; k < p.n && k * dt < tNow - 1e-9; k++) {
        const E1 = keplerE(p.a, p.e, k * dt), E2 = keplerE(p.a, p.e, Math.min((k + 1) * dt, tNow)), steps = Math.max(2, Math.ceil((E2 - E1) / 0.02));
        ctx.save(); ctx.fillStyle = k % 2 ? c.accent : c.vy; ctx.globalAlpha = 0.22; ctx.beginPath(); ctx.moveTo(X(0), Y(0));
        for (let j = 0; j <= steps; j++) { const [xx, yy] = pt(E1 + ((E2 - E1) * j) / steps); ctx.lineTo(xx, yy); }
        ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }
    // Path so far, also from Kepler's equation: the recorded samples (every 1/60 yr) are too sparse near perihelion.
    if (m.t > 0) {
      const Ee = keplerE(p.a, p.e, Math.min(m.t, T)), steps = Math.max(2, Math.ceil(Ee / 0.02));
      ctx.save(); ctx.strokeStyle = c.accent; ctx.lineWidth = 1.75; ctx.beginPath();
      for (let j = 0; j <= steps; j++) { const E = (Ee * j) / steps, xx = X(p.a * (Math.cos(E) - p.e)), yy = Y(b * Math.sin(E)); j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke(); ctx.restore();
    }
    // Sun at the focus, planet.
    ctx.save(); ctx.fillStyle = c.vx; ctx.beginPath(); ctx.arc(X(0), Y(0), 9, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = c.body; ctx.beginPath(); ctx.arc(X(m.x), Y(m.y), 6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    hint(ctx, text.draw.sun, X(0) + 12, Y(0) + 14, c);
    if (toggles.vel) { const sp = Math.hypot(m.vx, m.vy), L = 9 * sp; drawArrow(ctx, X(m.x), Y(m.y), X(m.x) + (m.vx / sp) * L * (p.a ** 0.5), Y(m.y) - (m.vy / sp) * L * (p.a ** 0.5), c.vel, 'υ'); }
    label(ctx, text.draw.period(num(T, 2)), 12, 20, c, 'left');
  },
};

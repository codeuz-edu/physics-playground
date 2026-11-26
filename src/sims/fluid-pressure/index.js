import { num } from '../../core/format.js';
import { drawArrow, drawGround, formatTick, ink, label, niceStep, vectorLabel } from '../../ui/canvas.js';
import { advance, gParam, hint } from '../kit.js';
import { LIQUIDS, depthRuler, liquid, liquidParam, pick, vdim, vessel } from '../fluids.js';

const tankW = (H) => Math.max(1.4, 0.8 * H);
const tankH = (H) => H + Math.max(0.25, 0.15 * H);
const P_VAPOUR = 2.34; // kPa, saturated vapour pressure of water at 20 °C
const WATERS = ['water', 'seawater']; // the liquids that boil when p₀ is below P_VAPOUR

const params = [
  liquidParam(LIQUIDS),
  { key: 'H', symbol: 'H', unit: 'm', min: 0.2, max: 10, step: 0.01, default: 4, kind: 'initial', decimals: 2, color: '--pos' },
  { key: 'u', symbol: 'υ', unit: 'm/s', min: 0.1, max: 2, step: 0.1, default: 0.5, kind: 'live', decimals: 1 },
  { key: 'p0', symbol: 'p₀', unit: 'kPa', min: 0, max: 110, step: 0.1, default: 101.3, kind: 'initial', decimals: 1 },
  gParam,
];

/** A pressure probe sinks at constant speed from the free surface to the floor: p = p₀ + ρgh. */
class PressureModel {
  t = 0; h = 0; reason = ''; p = null;
  reset(p) { this.p = { ...p }; this.t = 0; this.h = 0; this.reason = ''; }
  step(dt, p) {
    if (this.reason) return false;
    const r = advance(this.h, p.u, 0, dt, this.p.H);
    this.h = r.s; this.t += r.tau;
    if (r.hit) { this.reason = 'bottom'; return false; }
    return true;
  }
  isValid() { return Number.isFinite(this.h) && Number.isFinite(this.t); }
  sample() { const q = this.p, ph = (pick(LIQUIDS, q.liq).rho * q.g * this.h) / 1000; return { h: this.h, ph, p: q.p0 + ph }; }
  clone() { return Object.assign(new PressureModel(), this, { p: { ...this.p } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const s = this.sample(), liq = pick(LIQUIDS, this.p.liq);
    // Open water boils when the pressure on its surface is below its saturated vapour pressure (2.3 kPa at 20 °C).
    const boils = WATERS.includes(liq.key) && this.p.p0 < P_VAPOUR;
    return text.msg.bottom(num(this.p.H, 2), num(s.ph, 1), num(s.p, 1)) + (boils ? text.msg.boils : '');
  }
}

export default {
  id: 'fluid-pressure',
  params,
  stageSize: 'tall',
  viewPadding: { left: 60, right: 16, top: 16, bottom: 18 },
  presets: [
    { values: { liq: 0, H: 4, u: 0.5, p0: 101.3, g: 9.81 } },
    { values: { liq: 1, H: 10, u: 1, p0: 101.3, g: 9.81 } },
    { values: { liq: 2, H: 2.5, u: 0.5, p0: 101.3, g: 9.81 } },
    { values: { liq: 4, H: 0.76, u: 0.1, p0: 101.3, g: 9.81 } },
    { values: { liq: 0, H: 4, u: 0.5, p0: 0, g: 1.62 } },
  ],
  toggles: [
    { key: 'arrows', default: true },
    { key: 'atm', default: true },
    { key: 'ruler', default: true },
  ],
  readouts: [
    { key: 'h', unit: 'm', decimals: 2, color: '--pos' },
    { key: 'ph', unit: 'kPa', decimals: 1, color: '--current' },
    { key: 'p', unit: 'kPa', decimals: 1, color: '--acc' },
  ],
  graphs: [
    { id: 'p', yLabel: 'p', unit: 'kPa', series: [{ key: 'p', color: '--acc' }, { key: 'ph', color: '--current' }] },
    { id: 'h', yLabel: 'h', unit: 'm', series: [{ key: 'h', color: '--pos' }] },
  ],
  createModel: () => new PressureModel(),
  worldBounds: (p) => { const W = tankW(p.H), T = tankH(p.H); return { xMin: -0.06 * W, xMax: 1.06 * W, yMin: -0.04 * T, yMax: 1.3 * T }; },

  draw({ ctx, view, model: m, params: p, toggles: tg, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    const liq = pick(LIQUIDS, p.liq), W = tankW(p.H), T = tankH(p.H), gy = Y(0), ys = Y(p.H);
    drawGround(ctx, view, c, gy);
    liquid(ctx, X(0), ys, X(W), gy, c, liq.rho);
    vessel(ctx, X(0), Y(T), X(W), gy, c);
    if (tg.ruler) {
      // Where the ruler's last number sits on the floor line, the ground line is broken around it.
      const step = niceStep(p.H, Math.max(2, Math.min(8, (p.H * S) / 46))), last = Math.floor(p.H / step + 1e-9) * step, ly = ys + last * S;
      if (gy - ly < 9) {
        ctx.save(); ctx.font = '500 11px Barlow, sans-serif';
        const tw = ctx.measureText(formatTick(last, step)).width;
        ctx.fillStyle = c.surface; ctx.fillRect(X(0) - 18 - tw - 3, ly - 7, tw + 6, 14); ctx.restore();
      }
      depthRuler(ctx, X(0) - 10, ys, S, p.H, c);
    }
    const s = m.sample(), phMax = (liq.rho * p.g * p.H) / 1000;
    if (tg.atm && p.p0 > 0) {
      [0.14, 0.32, 0.68, 0.86].forEach((f) => drawArrow(ctx, X(W * f), ys - 30, X(W * f), ys - 3, c.muted, '', 'main'));
      // The name above the arrows, in the air (at a tip it would sit in the liquid).
      vectorLabel(ctx, 'p₀', X(W * 0.23), ys - 26, c.muted);
    }
    // Probe: a small capsule with a membrane, on a tube that runs up to the manometer. On the floor it rests on
    // the floor instead of half sinking into it.
    const px = X(W / 2), r = 8, py = Math.min(Y(p.H - m.h), gy - r * 0.7 - 2);
    const room = Y(T) - 6, R = Math.max(10, Math.min(26, (room - 14) / 2)), gx = px, gyc = Math.max(R + 4, Y(T) - 12 - R);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.25;
    ctx.beginPath(); ctx.moveTo(px, py - r * 0.7); ctx.lineTo(px, gyc + R); ctx.stroke(); ctx.restore();
    if (tg.arrows && s.ph > 1e-9) {
      // The liquid presses on the probe from every side: arrows from all round, kept inside the liquid (near the
      // floor, the arrows that would come up through it are left out).
      const len = 6 + 44 * (s.ph / Math.max(1e-9, phMax));
      ctx.save(); ctx.beginPath(); ctx.rect(X(0) + 1, ys, X(W) - X(0) - 2, gy - ys - 1); ctx.clip();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 + Math.PI / 8, ex = Math.cos(a), ey = Math.sin(a);
        if (py + ey * (r + 3 + len) > gy) continue;
        drawArrow(ctx, px + ex * (r + 3 + len), py + ey * (r + 3 + len), px + ex * (r + 3), py + ey * (r + 3), c.current, '', 'part');
      }
      ctx.restore();
      // The name beyond the tail of the upper left arrow, out of the bunch (the depth's dimension line is on the right).
      const e = [Math.cos((-7 * Math.PI) / 8), Math.sin((-7 * Math.PI) / 8)], d = r + 3 + len + 9;
      vectorLabel(ctx, 'p', px + e[0] * d - 4, py + e[1] * d - 4, c.current, 'center', 'middle', [[px + e[0] * d - 4, py + e[1] * d + 12]]);
    }
    ctx.save(); ctx.fillStyle = c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.fillRect(px - r, py - r * 0.7, 2 * r, 1.4 * r); ctx.strokeRect(px - r, py - r * 0.7, 2 * r, 1.4 * r);
    ctx.beginPath(); ctx.moveTo(px - r + 3, py + r * 0.7 - 3); ctx.lineTo(px + r - 3, py + r * 0.7 - 3); ctx.stroke(); ctx.restore();
    // Manometer dial: its back is open to the air, so like a school membrane manometer it shows the excess over p₀, i.e. ρgh.
    // The needle sweeps 270° from zero to a round full scale.
    const st = niceStep(Math.max(phMax, 1e-6), 5), full = Math.max(st, Math.ceil(phMax / st) * st);
    ctx.save(); ctx.fillStyle = c.surface; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.beginPath(); ctx.arc(gx, gyc, R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = c.muted; ctx.beginPath();
    for (let i = 0; i <= 10; i++) { const a = 0.75 * Math.PI + (i / 10) * 1.5 * Math.PI, k = i % 5 ? 0.82 : 0.7; ctx.moveTo(gx + Math.cos(a) * R * k, gyc + Math.sin(a) * R * k); ctx.lineTo(gx + Math.cos(a) * (R - 2), gyc + Math.sin(a) * (R - 2)); }
    ctx.stroke();
    const na = 0.75 * Math.PI + Math.min(1, s.ph / full) * 1.5 * Math.PI;
    ctx.strokeStyle = c.acc; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx, gyc); ctx.lineTo(gx + Math.cos(na) * R * 0.78, gyc + Math.sin(na) * R * 0.78); ctx.stroke();
    ctx.fillStyle = c.fg; ctx.beginPath(); ctx.arc(gx, gyc, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // The dial's name over its full scale, on two lines, so it fits beside the dial on a phone too.
    text.draw.gauge(formatTick(full, st)).forEach((line, i, all) => hint(ctx, line, gx + R + 8, gyc + (i - (all.length - 1) / 2) * 15, c));
    vdim(ctx, px + 46, ys, Y(p.H - m.h), `h = ${num(m.h, 2)} m`, c);
    label(ctx, `p = p₀ + ρgh = ${num(s.p, 1)} kPa`, 12, 20, c, 'left');
  },

  drag: {
    hit(x, y, model, p, view) {
      if (model.t > 0 && !model.reason) return null;
      return Math.abs(y - p.H) * view.scale < 10 && x > 0 && x < tankW(p.H) ? 'surface' : null;
    },
    move(h, x, y) { return { H: Math.max(0.2, y) }; },
  },
};

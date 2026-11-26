import { num } from '../../core/format.js';
import { drawArrow, drawGround, formatTick, ink, label, niceStep, reserve } from '../../ui/canvas.js';
import { advance, gParam, hint } from '../kit.js';
import { LIQUIDS, dashed, liquidFill, liquidLine, liquidParam, pick, vdim, vessel } from '../fluids.js';

// Material names (with their densities) are in the text file (params.mat.options), in this order.
const MATS = [{ key: 'aluminium', rho: 2700 }, { key: 'iron', rho: 7800 }, { key: 'copper', rho: 8900 }, { key: 'lead', rho: 11300 }];
const LIQ = LIQUIDS.slice(0, 4);
// Metres: a round beaker 34 cm across with liquid 22 cm deep; a 10 cm tall cylinder starts 5 cm above the surface.
// The liquid the cylinder pushes aside raises the level by V_b / A (A = beaker cross-section, about 908 cm²).
const BW = 0.34, L0 = 0.22, HB = 0.1, GAP = 0.05, TRAVEL = GAP + HB + 0.03, CX = BW / 2, AREA = Math.PI * (BW / 2) ** 2;

const params = [
  { key: 'mat', symbol: '', unit: '', min: 0, max: MATS.length - 1, step: 1, default: 1, kind: 'initial', options: MATS.map((m) => m.key) },
  { key: 'V', symbol: 'V', unit: 'cm³', min: 20, max: 1000, step: 10, default: 200, kind: 'initial', decimals: 0, color: '--pos' },
  liquidParam(LIQ),
  { key: 'u', symbol: 'υ', unit: 'cm/s', min: 0.5, max: 5, step: 0.5, default: 2, kind: 'live', decimals: 1 },
  gParam,
];

/** A cylinder on a spring balance is lowered at constant speed into a wide beaker: P = mg − ρgV_b. */
class ArchimedesModel {
  t = 0; s = 0; reason = ''; p = null;
  reset(p) { this.p = { ...p }; this.t = 0; this.s = 0; this.reason = ''; }
  step(dt, p) {
    if (this.reason) return false;
    const r = advance(this.s, p.u / 100, 0, dt, TRAVEL);
    this.s = r.s; this.t += r.tau;
    if (r.hit) { this.reason = 'under'; return false; }
    return true;
  }
  /**
   * Height of the cylinder below the surface, 0 … HB. The surface rises as the cylinder goes in:
   * h = (s − GAP) + A_b·h/A, so h = (s − GAP)/(1 − A_b/A), with A_b the cylinder's base area.
   */
  sub() { const k = this.p.V / 1e6 / HB / AREA; return Math.max(0, Math.min(HB, (this.s - GAP) / (1 - k))); }
  /** Liquid level in the beaker above its floor (m). */
  level() { return L0 + (this.p.V / 1e6 / HB) * this.sub() / AREA; }
  isValid() { return Number.isFinite(this.s) && Number.isFinite(this.t); }
  sample() {
    const q = this.p, Vb = (q.V / 1e6) * (this.sub() / HB);
    const mg = (pick(MATS, q.mat).rho * q.V) / 1e6 * q.g, FA = pick(LIQ, q.liq).rho * q.g * Vb;
    return { P: mg - FA, FA, mg, Vb: Vb * 1e6, dL: 100 * (this.level() - L0) };
  }
  clone() { return Object.assign(new ArchimedesModel(), this, { p: { ...this.p } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const s = this.sample();
    return text.msg.under(num(s.mg, 2), num(s.P, 2), num(s.FA, 2));
  }
}

export default {
  id: 'archimedes',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { mat: 1, V: 200, liq: 0, u: 2, g: 9.81 } },
    { values: { mat: 1, V: 200, liq: 2, u: 2, g: 9.81 } },
    { values: { mat: 0, V: 100, liq: 0, u: 2, g: 9.81 } },
    { values: { mat: 2, V: 800, liq: 1, u: 2, g: 9.81 } },
  ],
  toggles: [{ key: 'forces', default: true }],
  readouts: [
    { key: 'P', unit: 'N', decimals: 2, color: '--force' },
    { key: 'FA', unit: 'N', decimals: 2, color: '--current' },
    { key: 'Vb', unit: 'cm³', decimals: 0, color: '--pos' },
    { key: 'dL', unit: 'cm', decimals: 2 },
  ],
  graphs: [
    { id: 'F', yLabel: 'F', unit: 'N', series: [{ key: 'mg', color: '--muted' }, { key: 'P', color: '--force' }, { key: 'FA', color: '--current' }] },
    { id: 'V', yLabel: 'V', unit: 'cm³', series: [{ key: 'Vb', color: '--pos' }] },
  ],
  createModel: () => new ArchimedesModel(),
  worldBounds: () => ({ xMin: -0.1, xMax: 0.66, yMin: -0.02, yMax: 0.86 }),

  draw({ ctx, view, model: m, params: p, toggles: tg, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    const liq = pick(LIQ, p.liq), s = m.sample(), w = 2 * Math.sqrt(p.V / 1e6 / HB / Math.PI);
    const yb = L0 + GAP - m.s, yTop = yb + HB, lv = m.level(), hook = yTop + 0.06, c0 = hook + 0.02, c1 = c0 + 0.22, arm = c1 + 0.02;
    drawGround(ctx, view, c, Y(0));
    // Stand: base, pole, the arm with its clamp (it slides down with the balance).
    ctx.save(); ctx.strokeStyle = c.fg; ctx.fillStyle = c.track; ctx.lineWidth = ink.object;
    ctx.fillRect(X(0.44), Y(0.02), 0.2 * S, 0.02 * S); ctx.strokeRect(X(0.44), Y(0.02), 0.2 * S, 0.02 * S);
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(0.54), Y(0.02)); ctx.lineTo(X(0.54), Y(0.82)); ctx.stroke();
    ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X(0.555), Y(arm)); ctx.lineTo(X(CX), Y(arm)); ctx.stroke();
    ctx.lineWidth = ink.object; ctx.fillRect(X(0.525), Y(arm + 0.02), 0.03 * S, 0.04 * S); ctx.strokeRect(X(0.525), Y(arm + 0.02), 0.03 * S, 0.04 * S);
    ctx.restore();
    liquid0(ctx, X, Y, liq, c, lv);
    vessel(ctx, X(0), Y(0.3), X(BW), Y(0), c);
    // Spring balance: case, scale, spring, pointer; full scale is a round number above mg.
    const st = niceStep(s.mg, 4), full = Math.max(st, Math.ceil(s.mg / st) * st);
    const cw = 0.05 * S, z0 = Y(c1 - 0.03), span = 0.15 * S, py = z0 + span * Math.max(0, s.P) / full;
    ctx.save(); ctx.fillStyle = c.surface; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.fillRect(X(CX) - cw / 2, Y(c1), cw, Y(c0) - Y(c1)); ctx.strokeRect(X(CX) - cw / 2, Y(c1), cw, Y(c0) - Y(c1));
    ctx.beginPath(); ctx.moveTo(X(CX), Y(arm)); ctx.lineTo(X(CX), Y(c1)); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = c.muted; ctx.beginPath();
    for (let i = 0; i <= 10; i++) { const y = Math.round(z0 + (span * i) / 10) + 0.5, k = i % 5 ? 4 : 7; ctx.moveTo(X(CX) + cw / 2 - k, y); ctx.lineTo(X(CX) + cw / 2, y); }
    ctx.stroke();
    ctx.strokeStyle = c.fg; ctx.beginPath(); const coils = 9, sx = X(CX), top = Y(c1) + 3;
    ctx.moveTo(sx, top); for (let i = 1; i <= coils * 2; i++) ctx.lineTo(sx + (i % 2 ? -5 : 5), top + ((py - top) * i) / (coils * 2)); ctx.lineTo(sx, py); ctx.stroke();
    ctx.strokeStyle = c.force; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx - 6, py); ctx.lineTo(X(CX) + cw / 2 - 1, py); ctx.stroke();
    ctx.strokeStyle = c.fg; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.moveTo(sx, py); ctx.lineTo(sx, Y(hook)); ctx.stroke();
    ctx.beginPath(); ctx.arc(sx, Y(hook) + 3, 3, -Math.PI / 2, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx, Y(hook) + 6); ctx.lineTo(sx, Y(yTop)); ctx.stroke();
    ctx.restore();
    hint(ctx, '0', X(CX) + cw / 2 + 5, z0, c);
    hint(ctx, `${formatTick(full, st)} N`, X(CX) + cw / 2 + 5, z0 + span, c);
    // The cylinder, then the liquid in front of its submerged part.
    const bx = X(CX - w / 2), bwp = w * S;
    ctx.save(); ctx.fillStyle = c['iron-hi']; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
    ctx.fillRect(bx, Y(yTop), bwp, HB * S); ctx.strokeRect(bx, Y(yTop), bwp, HB * S); ctx.restore();
    const hs = m.sub();
    if (hs > 0) {
      ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = liquidFill(c, liq.rho); const wetTop = Math.min(lv, yTop); ctx.fillRect(bx - 1, Y(wetTop), bwp + 2, (wetTop - yb) * S); ctx.restore();
      ctx.save(); ctx.strokeStyle = liquidLine(c, liq.rho); ctx.lineWidth = ink.scenery; ctx.beginPath(); ctx.moveTo(X(0), Math.round(Y(lv)) + 0.5); ctx.lineTo(X(BW), Math.round(Y(lv)) + 0.5); ctx.stroke(); ctx.restore();
    }
    // The level before the body went in, and how far the liquid has risen since.
    if ((lv - L0) * S > 1.5) {
      dashed(ctx, X(BW) - 4, Y(L0), X(BW) + 16, Y(L0), c.ghost);
      vdim(ctx, X(BW) + 10, Y(L0), Y(lv), text.draw.rise(num(s.dL, 1)), c);
    }
    // The badge names what the drawing shows: the balance reads the thread's pull T, which is mg − F_A.
    label(ctx, `P = T = mg − F_A = ${num(s.P, 2)} N`, 12, 20, c, 'left');
    reserve(ctx, bx, Y(yTop), bwp, HB * S); // the vector names stay off the body
    if (tg.forces) {
      // One scale for the three forces; mg, from the body's middle at its lowest, ends 22 px above the beaker's floor.
      const low = Y(L0 + GAP - TRAVEL + HB / 2), L = Math.min(80, 0.18 * view.height, Y(0) - 22 - low) / Math.max(1e-9, s.mg), cx = X(CX), cy = Y(yb + HB / 2);
      drawArrow(ctx, cx, cy, cx, cy + s.mg * L, c.fg, 'mg');
      if (s.FA > 1e-6) drawArrow(ctx, bx + bwp + 12, cy, bx + bwp + 12, cy - s.FA * L, c.current, 'F_A');
      drawArrow(ctx, bx - 12, Y(yTop), bx - 12, Y(yTop) - s.P * L, c.force, 'T');
    }
  },
};

function liquid0(ctx, X, Y, liq, c, lv) {
  ctx.save();
  ctx.fillStyle = liquidFill(c, liq.rho);
  ctx.fillRect(X(0), Y(lv), X(BW) - X(0), Y(0) - Y(lv));
  ctx.strokeStyle = liquidLine(c, liq.rho);
  ctx.lineWidth = ink.scenery;
  ctx.beginPath(); ctx.moveTo(X(0), Math.round(Y(lv)) + 0.5); ctx.lineTo(X(BW), Math.round(Y(lv)) + 0.5); ctx.stroke();
  ctx.restore();
}

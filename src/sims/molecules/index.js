import { num } from '../../core/format.js';
import { formatTick, ink, label, niceStep, vectorLabel } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { R, kB, drawParticles, makeParticles, thermometer } from '../thermo.js';

const DUR = 10;
const PARTS = makeParticles(70, 5);
// Symbol, molar mass (kg/mol), temperature (K) at which the gas starts to condense at normal pressure,
// and whether it then turns into a solid (dry ice) rather than a liquid.
const GAS = [['H₂', 0.002, 20, false], ['He', 0.004, 4, false], ['N₂', 0.028, 77, false], ['O₂', 0.032, 90, false], ['CO₂', 0.044, 195, true]];
const params = [
  { key: 'gas', symbol: '', unit: '', min: 0, max: 4, step: 1, default: 2, kind: 'initial', options: ['H₂', 'He', 'N₂', 'O₂', 'CO₂'] },
  { key: 'T0', symbol: 'T₀', unit: 'K', min: 200, max: 1000, step: 10, default: 300, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'rate', symbol: '', unit: 'K/s', min: -20, max: 60, step: 5, default: 0, kind: 'initial', decimals: 0 },
  { key: 'n', symbol: 'n', unit: 'm⁻³', min: 0.5, max: 5, step: 0.1, default: 2.5, kind: 'initial', decimals: 1 },
];

/** Maxwell speed distribution f(υ) = 4/√π · υ²/υₑ³ · exp(−υ²/υₑ²), with the most probable speed υₑ = √(2RT/M). */
const vProb = (T, M) => Math.sqrt((2 * R * T) / M);
const maxwell = (u, T, M) => { const a = vProb(T, M); return ((4 / Math.sqrt(Math.PI)) * u * u * Math.exp(-(u * u) / (a * a))) / (a * a * a); };

/**
 * Molecular-kinetic picture of an ideal gas: υ = √(3RT/M), Ē = 3kT/2, p = nkT. Temperature may rise or fall
 * at a constant rate; cooling stops where the gas starts to condense, because below that it is no ideal gas.
 */
class MolModel {
  t = 0; ph = 0; T = 0; v = 0; E = 0; p = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.ph = 0; this.reason = ''; this.calc(); }
  calc() { const P = this.P, g = GAS[P.gas]; this.T = Math.max(g[2], P.T0 + P.rate * this.t); this.v = Math.sqrt((3 * R * this.T) / g[1]); this.E = 1.5 * kB * this.T * 1e21; this.p = (P.n * 1e25 * kB * this.T) / 1000; }
  step(dt) {
    if (this.reason) return false;
    const P = this.P, Tc = GAS[P.gas][2];
    let t1 = Math.min(DUR, this.t + dt);
    if (P.rate < 0 && P.T0 + P.rate * t1 <= Tc) { t1 = Math.min(t1, (Tc - P.T0) / P.rate); this.reason = 'cond'; }
    this.t = t1; this.calc(); this.ph += (this.v / 500) * dt * 0.4;
    if (this.reason) return false;
    if (this.t >= DUR - 1e-9) { this.reason = 'end'; return false; }
    return true;
  }
  isValid() { return [this.T, this.v, this.p].every(Number.isFinite); }
  sample() { return { v: this.v, E: this.E, p: this.p, T: this.T }; }
  clone() { return Object.assign(new MolModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const g = GAS[this.P.gas];
    if (this.reason === 'cond') return text.msg.condensed(num(this.T, 0), g[0], g[3], num(this.v, 0), num(this.p, 1));
    return text.msg.end(num(this.T, 0), g[0], num(this.v, 0), num(this.E, 2), num(this.p, 1));
  }
}

/** The speed distribution of this run in a pixel box: now (solid), at the start (dashed), the rms speed marked. */
function speedPlot(ctx, bx, by, bw, bh, m, c) {
  const P = m.P, g = GAS[P.gas], M = g[1];
  const Tend = Math.max(g[2], P.T0 + P.rate * DUR), Thi = Math.max(P.T0, Tend), Tlo = Math.min(P.T0, Tend);
  const uMax = 3.1 * vProb(Thi, M), fMax = 1.15 * maxwell(vProb(Tlo, M), Tlo, M);
  const X = (u) => bx + (u / uMax) * bw, Y = (f) => by + bh - (f / fMax) * bh;
  const curve = (T) => { ctx.beginPath(); for (let i = 0; i <= 90; i++) { const u = (i / 90) * uMax; i ? ctx.lineTo(X(u), Y(maxwell(u, T, M))) : ctx.moveTo(X(u), Y(0)); } };
  ctx.save();
  curve(m.T); ctx.lineTo(X(uMax), Y(0)); ctx.closePath(); ctx.fillStyle = c.accent; ctx.globalAlpha = 0.14; ctx.fill(); ctx.globalAlpha = 1;
  if (Math.abs(m.T - P.T0) > 0.5) { ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); curve(P.T0); ctx.stroke(); ctx.setLineDash([]); }
  ctx.strokeStyle = c.accent; ctx.lineWidth = 2; curve(m.T); ctx.stroke();
  ctx.strokeStyle = c.vel; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(m.v), Y(0)); ctx.lineTo(X(m.v), Y(maxwell(m.v, m.T, M))); ctx.stroke();
  ctx.strokeStyle = c.fg; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, by - 6); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw + 6, by + bh); ctx.stroke();
  ctx.font = 'italic 700 14px "Times New Roman", serif'; ctx.textBaseline = 'bottom';
  ctx.fillStyle = c.fg; ctx.textAlign = 'left'; ctx.fillText('f(υ)', bx + 5, by + 6);
  ctx.fillStyle = c.muted; ctx.font = 'italic 14px "Times New Roman", serif'; ctx.textAlign = 'right'; ctx.fillText('υ, m/s', bx + bw + 6, by + bh - 4);
  const st = niceStep(uMax, 3); ctx.font = '500 11px Barlow, sans-serif'; ctx.fillStyle = c.muted; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  for (let u = 0; u <= uMax + 1e-9; u += st) { ctx.fillText(formatTick(u, st), X(u), by + bh + 4); ctx.beginPath(); ctx.moveTo(X(u), by + bh); ctx.lineTo(X(u), by + bh + 3); ctx.stroke(); }
  ctx.restore();
  // The rms speed named above and right of where its line meets the curve: the curve falls there, so the name stays off it.
  vectorLabel(ctx, 'υ', X(m.v) + 9, Y(maxwell(m.v, m.T, M)) - 11, c.vel);
}

export default {
  id: 'molecules',
  params,
  noTape: true,
  presets: [
    { values: { gas: 2, T0: 300, rate: 0, n: 2.5 } },
    { values: { gas: 0, T0: 300, rate: 0, n: 2.5 } },
    { values: { gas: 2, T0: 300, rate: 30, n: 2.5 } },
  ],
  toggles: [],
  readouts: [
    { key: 'v', unit: 'm/s', decimals: 0, color: '--vel' },
    { key: 'E', unit: 'J', decimals: 2, color: '--acc' },
    { key: 'p', unit: 'kPa', decimals: 1, color: '--force' },
    { key: 'T', unit: 'K', decimals: 0 },
  ],
  graphs: [
    { id: 'v', yLabel: 'υ', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
    { id: 'p', yLabel: 'p', unit: 'kPa', series: [{ key: 'p', color: '--force' }] },
  ],
  createModel: () => new MolModel(),
  worldBounds: () => ({ xMin: 0, xMax: 10, yMin: 0, yMax: 6 }),

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y);
    const bx = X(0.6), by = Y(5.3), bw = X(4.6) - bx, bh = Y(0.8) - by;
    ctx.save(); ctx.fillStyle = c.accent; ctx.globalAlpha = 0.06; ctx.fillRect(bx, by, bw, bh); ctx.restore();
    drawParticles(ctx, bx + 2, by + 2, bw - 4, bh - 4, PARTS, m.ph, c, 2.4 + GAS[p.gas][1] * 60, 0);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.strokeRect(bx, by, bw, bh); ctx.restore();
    thermometer(ctx, X(5.15), Y(5.1), Y(1.4) - Y(5.1), m.T / 1700, `${num(m.T, 0)} K`, c);
    hint(ctx, GAS[p.gas][0], bx + bw, by - 12, c, 'right'); // above the vessel, where the molecules do not run over it
    speedPlot(ctx, X(6.8), Y(4.9), X(9.7) - X(6.8), Y(1.35) - Y(4.9), m, c);
    // The plot's caption; on a narrow stage it breaks into two lines so it stays under the plot, off the stage edge.
    const cap = text.draw.distribution, cut = cap.lastIndexOf(' '), mid = (X(6.8) + X(9.7)) / 2;
    ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; const wide = ctx.measureText(cap).width / 2 > view.width - 6 - mid; ctx.restore();
    if (wide && cut > 0) { hint(ctx, cap.slice(0, cut), mid, Y(0.55), c, 'center'); hint(ctx, cap.slice(cut + 1), mid, Y(0.55) + 15, c, 'center'); }
    else hint(ctx, cap, mid, Y(0.55), c, 'center');
    label(ctx, `υ = √(3RT/M) = ${num(m.v, 0)} m/s`, 12, 20, c, 'left');
    hint(ctx, `p = nkT = ${num(m.p, 1)} kPa`, 12, 46, c);
  },
};

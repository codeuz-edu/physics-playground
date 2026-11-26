import { num } from '../../core/format.js';
import { drawArrow, ink, label, vectorLabel } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { wire } from '../elec.js';

const L = 0.2, X0 = -0.32; // m: half-width of the region where the coil feels the magnet, start of the magnet centre
const params = [
  { key: 'N', symbol: 'N', unit: '', min: 50, max: 500, step: 10, default: 200, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'F', symbol: 'Φ', unit: 'mWb', min: 0.1, max: 2, step: 0.05, default: 1, kind: 'initial', decimals: 2, color: '--acc' },
  { key: 'v', symbol: 'υ', unit: 'm/s', min: 0.1, max: 2, step: 0.05, default: 0.5, kind: 'initial', decimals: 2, color: '--vel' },
];

/** Bar magnet pushed at constant speed through a coil. One turn's flux Φ(x) = Φ cos²(πx/2L) for |x| < L, zero outside. */
class InductionModel {
  t = 0; x = 0; phi = 0; E = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.x = X0; this.reason = ''; this.calc(); }
  calc() {
    const P = this.P, u = this.x / L, inside = Math.abs(u) < 1;
    this.phi = inside ? P.F * Math.cos((Math.PI * u) / 2) ** 2 : 0;
    // ℰ = −N dΦ/dt = −N (dΦ/dx) υ
    this.E = inside ? (P.N * P.F * 1e-3 * P.v * Math.PI * Math.sin(Math.PI * u)) / (2 * L) : 0;
  }
  step(dt) {
    if (this.reason) return false;
    this.t += dt; this.x = X0 + this.P.v * this.t;
    if (this.x >= -X0) { this.x = -X0; this.t = (-2 * X0) / this.P.v; this.reason = 'end'; }
    this.calc(); return !this.reason;
  }
  isValid() { return [this.x, this.E].every(Number.isFinite); }
  sample() { return { phi: this.phi, E: this.E, x: this.x * 100 }; }
  clone() { return Object.assign(new InductionModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const P = this.P, avg = (P.N * P.F * 1e-3 * P.v) / L, max = (P.N * P.F * 1e-3 * P.v * Math.PI) / (2 * L);
    // ℰ = −N dΦ/dt: negative while the flux grows (entry), positive while it falls (exit), as the readout and graph show.
    return text.msg.end(num(avg, 3), num(max, 3));
  }
}

export default {
  id: 'induction',
  params,
  presets: [
    { values: { N: 200, F: 1, v: 0.5 } },
    { values: { N: 200, F: 1, v: 1 } },
    { values: { N: 500, F: 0.4, v: 0.8 } },
  ],
  toggles: [],
  readouts: [
    { key: 'phi', unit: 'mWb', decimals: 3, color: '--acc' },
    { key: 'E', unit: 'V', decimals: 3, color: '--force' },
  ],
  graphs: [
    { id: 'phi', unit: 'mWb', series: [{ key: 'phi', color: '--acc' }] },
    { id: 'E', unit: 'V', series: [{ key: 'E', color: '--force' }] },
  ],
  createModel: () => new InductionModel(),
  worldBounds: () => ({ xMin: -0.45, xMax: 0.45, yMin: -0.2, yMax: 0.2 }),
  viewPadding: { left: 16, right: 16, top: 40, bottom: 16 },

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale;
    const cw = 0.14 * S, ch = 0.12 * S, cx = X(0), cy = Y(0.06), turns = Math.round(6 + p.N / 50);
    // Back halves of the turns, then the magnet, then the front halves: the magnet reads as passing through.
    ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1.5;
    for (let i = 0; i < turns; i++) { const xx = cx - cw / 2 + (i * cw) / (turns - 1); ctx.beginPath(); ctx.ellipse(xx, cy, 5, ch / 2, 0, Math.PI / 2, (3 * Math.PI) / 2); ctx.stroke(); }
    ctx.restore();
    const mw = 0.16 * S, mh = 0.05 * S, mx = X(m.x);
    ctx.save(); ctx.fillStyle = c.force; ctx.fillRect(mx, cy - mh / 2, mw / 2, mh); ctx.fillStyle = c.vel; ctx.fillRect(mx - mw / 2, cy - mh / 2, mw / 2, mh);
    ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.strokeRect(mx - mw / 2, cy - mh / 2, mw, mh);
    ctx.fillStyle = c.surface; ctx.font = '700 13px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('N', mx + mw / 4, cy + 0.5); ctx.fillText('S', mx - mw / 4, cy + 0.5);
    ctx.restore();
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.5;
    for (let i = 0; i < turns; i++) { const xx = cx - cw / 2 + (i * cw) / (turns - 1); ctx.beginPath(); ctx.ellipse(xx, cy, 5, ch / 2, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke(); }
    ctx.restore();
    // Galvanometer below the coil; the needle swings with ℰ.
    const gx = X(0), gy = Y(-0.12), gr = 0.06 * S, Emax = (p.N * p.F * 1e-3 * p.v * Math.PI) / (2 * L);
    wire(ctx, [[cx - cw / 2, cy + ch / 2], [cx - cw / 2, gy], [gx - gr, gy]], c); wire(ctx, [[cx + cw / 2, cy + ch / 2], [cx + cw / 2, gy], [gx + gr, gy]], c);
    ctx.save(); ctx.fillStyle = c.surface; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = c.muted; ctx.beginPath(); ctx.arc(gx, gy + gr * 0.35, gr * 0.85, -Math.PI * 0.8, -Math.PI * 0.2); ctx.stroke();
    const a = -Math.PI / 2 + (m.E / Math.max(1e-9, Emax * 1.15)) * Math.PI * 0.3; ctx.strokeStyle = c.force; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(gx, gy + gr * 0.35); ctx.lineTo(gx + Math.cos(a) * gr * 0.85, gy + gr * 0.35 + Math.sin(a) * gr * 0.85); ctx.stroke(); ctx.restore();
    hint(ctx, text.draw.galvanometer, Math.max(gx + gr, cx + cw / 2) + 8, gy, c); // right of the lead, not on it
    // Lenz's rule: the coil becomes a magnet that opposes the change. Entry (ℰ < 0, flux growing): N on the face the magnet
    // comes in through, so the coil pushes it back; exit (ℰ > 0): N on the far face, so the coil holds the S end back.
    // Seen from the front, the induced current then runs up (entry) or down (exit) the near side of the turns.
    const f = m.E / Math.max(1e-9, Emax);
    if (Math.abs(f) > 0.02) {
      const nLeft = f < 0, ty = cy - ch / 2 - 12;
      ctx.save(); ctx.globalAlpha = 0.35 + 0.65 * Math.min(1, Math.abs(f)); ctx.font = '700 14px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = nLeft ? c.force : c.vel; ctx.fillText(nLeft ? 'N' : 'S', cx - cw / 2, ty);
      ctx.fillStyle = nLeft ? c.vel : c.force; ctx.fillText(nLeft ? 'S' : 'N', cx + cw / 2, ty);
      ctx.restore();
      // On the near side of the middle turn, above the magnet's path.
      const yA = cy - mh / 2 - 3, yB = cy - ch / 2 + 2;
      drawArrow(ctx, cx, nLeft ? yA : yB, cx, nLeft ? yB : yA, c.current, '', 'part'); vectorLabel(ctx, 'I', cx + 8, (yA + yB) / 2, c.current, 'left');
      hint(ctx, nLeft ? text.draw.lenzEntry : text.draw.lenzExit, 12, 46, c);
    }
    label(ctx, `ℰ = −N ΔΦ/Δt = ${num(m.E, 3)} V`, 12, 20, c, 'left');
  },
};

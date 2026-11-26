import { num } from '../../core/format.js';
import { drawArrow, drawGround, drawHatch, drawSky, ink, label, reserve, vectorLabel } from '../../ui/canvas.js';
import { DEG, advance, box, gParam, hint, pulley, rope } from '../kit.js';

const L = 3; // m of slope the load is pulled along

const params = [
  { key: 'm', symbol: 'm', unit: 'kg', min: 5, max: 100, step: 1, default: 20, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'angle', symbol: 'α', unit: '°', min: 5, max: 60, step: 1, default: 30, kind: 'initial', decimals: 0 },
  { key: 'mu', symbol: 'μ', unit: '', min: 0, max: 0.6, step: 0.05, default: 0.2, kind: 'initial', decimals: 2, color: '--friction' },
  { key: 'u', symbol: 'υ', unit: 'm/s', min: 0.2, max: 2, step: 0.1, default: 0.5, kind: 'initial', decimals: 1, color: '--vel' },
  gParam,
];

/** A winch pulls the load up the slope at constant speed: F = mg(sin α + μ cos α), useful work mgh, efficiency mgh / (F l). */
class WorkModel {
  t = 0; s = 0; F = 0; f = 0; P = 0; Pu = 0; eta = 0; a = 0; reason = '';
  reset(p) {
    const a = p.angle * DEG;
    this.t = 0; this.s = 0; this.reason = ''; this.a = a;
    this.f = p.mu * p.m * p.g * Math.cos(a);
    this.F = p.m * p.g * Math.sin(a) + this.f;
    this.P = this.F * p.u;
    this.eta = (p.m * p.g * Math.sin(a)) / this.F;
  }
  step(dt, p) {
    if (this.reason) return false;
    const r = advance(this.s, p.u, 0, dt, L);
    this.s = r.s; this.t += r.tau;
    if (r.hit) { this.reason = 'top'; return false; }
    return true;
  }
  isValid() { return [this.t, this.s, this.F].every(Number.isFinite); }
  sample() {
    const A = this.F * this.s, Au = A * this.eta;
    return { s: this.s, F: this.F, A, Au, Af: this.f * this.s, P: this.s > 0 || this.t > 0 ? this.P : 0, eta: this.eta * 100 };
  }
  clone() { return Object.assign(new WorkModel(), this); }
  /** The run's outcome in words; `text` is this simulation's text (sims/work-power/<locale>.js). */
  finishMessage(text) {
    if (!this.reason) return '';
    const A = this.F * L;
    // L is the distance along the slope; the height gained is h = L sin α (= A_f / mg).
    return text.msg.top(num(this.t, 1), num(L, 1), num(L * Math.sin(this.a), 2), num(A, 1), num(A * this.eta, 1), num(this.eta * 100, 1), num(this.P, 1));
  }
}

export default {
  id: 'work-power',
  params,
  stageSize: 'tall',
  viewPadding: { left: 24, right: 24, top: 30, bottom: 24 },
  presets: [
    { values: { m: 20, angle: 30, mu: 0, u: 0.5, g: 9.81 } },
    { values: { m: 20, angle: 30, mu: 0.2, u: 0.5, g: 9.81 } },
    { values: { m: 20, angle: 10, mu: 0.2, u: 0.5, g: 9.81 } },
    { values: { m: 50, angle: 20, mu: 0.1, u: 1.2, g: 9.81 } },
  ],
  toggles: [
    { key: 'forces', default: true },
    { key: 'bars', default: true },
  ],
  readouts: [
    { key: 'F', unit: 'N', decimals: 1, color: '--force' },
    { key: 'A', unit: 'J', decimals: 1, color: '--force' },
    { key: 'Au', unit: 'J', decimals: 1, color: '--pos' },
    { key: 'P', unit: 'W', decimals: 1, color: '--acc' },
    { key: 'eta', unit: '%', decimals: 1 },
  ],
  graphs: [
    { id: 'A', yLabel: 'A', unit: 'J', series: [{ key: 'A', color: '--force' }, { key: 'Au', color: '--pos' }, { key: 'Af', color: '--friction' }] },
    { id: 'P', yLabel: 'P', unit: 'W', series: [{ key: 'P', color: '--acc' }] },
  ],
  createModel: () => new WorkModel(),
  // Below the ground: room for the weight arrow and its name while the load is low on the slope.
  worldBounds: (p) => { const a = p.angle * DEG, W = (L + 1) * Math.cos(a), Hh = (L + 1) * Math.sin(a); return { xMin: -0.6, xMax: W + 1.6, yMin: -0.45, yMax: Math.max(Hh + 0.9, 1.8) }; },

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, gy = Y(0), a = p.angle * DEG;
    drawSky(ctx, view, c, gy);
    drawGround(ctx, view, c, gy);
    const len = L + 1, top = [len * Math.cos(a), len * Math.sin(a)];
    // Wedge.
    ctx.save(); ctx.beginPath(); ctx.moveTo(X(0), gy); ctx.lineTo(X(top[0]), Y(top[1])); ctx.lineTo(X(top[0]), gy); ctx.closePath();
    ctx.fillStyle = c.ground; ctx.fill(); ctx.clip(); drawHatch(ctx, X(0), Y(top[1]), X(top[0]) - X(0), gy - Y(top[1]), c.hatch, 0, 9); ctx.restore();
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.scenery; ctx.beginPath(); ctx.moveTo(X(0), gy); ctx.lineTo(X(top[0]), Y(top[1])); ctx.lineTo(X(top[0]), gy); ctx.stroke(); ctx.restore();
    // The load's size and the directions along the slope and out of it (screen): the winch is set by them.
    const bw = Math.min(0.55, Math.max(0.3, 0.1 * Math.cbrt(p.m))) * S, bh = bw * 0.65;
    const ux = Math.cos(a), uy = -Math.sin(a), nx = -Math.sin(a), ny = -Math.cos(a);
    // Winch past the top of the slope, on a bracket from the wedge. The rope leaves the middle of the load's
    // front face; the drum touches that line, so the rope runs parallel to the slope whatever the load's size.
    const r = Math.max(8, 0.16 * S), past = r + 0.12 * S;
    const wx = X(top[0]) + ux * past + nx * (bh / 2 - r), wy = Y(top[1]) + uy * past + ny * (bh / 2 - r);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.lineJoin = 'round'; ctx.beginPath();
    ctx.moveTo(X(top[0]), Y(top[1])); ctx.lineTo(wx, wy); ctx.lineTo(X(top[0]), Math.min(gy, Y(top[1]) + 0.3 * S)); ctx.stroke(); ctx.restore();
    pulley(ctx, wx, wy, r, c, (m.s * S) / r);
    // Slope angle at the foot; its value left of the foot, where the load never comes.
    // On a steep slope the friction's name comes down left of the foot, so there the value goes inside the
    // wedge, right of the arc, on a patch of the wedge's own colour that hides the hatching.
    const ra = Math.min(40, 0.6 * S), aText = `α = ${num(p.angle, 0)}°`;
    ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(X(0), gy, ra, -a, 0); ctx.stroke(); ctx.restore();
    if (p.angle > 50) { ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; ctx.fillStyle = c.ground; ctx.fillRect(X(0) + ra + 4, gy - 17, ctx.measureText(aText).width + 4, 16); ctx.restore(); hint(ctx, aText, X(0) + ra + 6, gy - 9, c); }
    else hint(ctx, aText, X(0) - 22, gy - 8, c, 'right');
    // The height's value beside the wedge's wall; on a low wedge the winch hangs there, so it goes past the drum.
    hint(ctx, `h = l sin α = ${num(L * Math.sin(a), 2)} m`, Math.abs(Y(top[1] / 2) - wy) < r + 10 ? wx + r + 8 : X(top[0]) + 8, Y(top[1] / 2), c);
    label(ctx, `η = mgh / (F l) = ${num(m.eta * 100, 1)} %`, 12, 20, c, 'left');
    // Work bars in the empty sky over the foot of the slope, under the badge, each with its value.
    if (toggles.bars) {
      const sm = m.sample(), full = m.F * L, bx0 = 12, by0 = 40, bhgt = Math.min(140, view.height * 0.34);
      const bar = (i, v, col, name) => {
        const x = bx0 + i * 46, hh = full > 0 ? (v / full) * bhgt : 0;
        ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, by0 + 0.5, 22, bhgt);
        ctx.fillStyle = col; ctx.fillRect(x + 1, by0 + bhgt - hh, 21, hh);
        ctx.fillStyle = c.fg; ctx.font = '500 12px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText(name, x + 11, by0 + bhgt + 4);
        ctx.fillStyle = c.muted; ctx.fillText(`${num(v, 0)} J`, x + 11, by0 + bhgt + 18); ctx.restore();
        reserve(ctx, x - 10, by0, 42, bhgt + 32);
      };
      const names = text.draw.bars;
      bar(0, sm.A, c.force, names.A); bar(1, sm.Au, c.pos, names.Au); bar(2, sm.Af, c.friction, names.Af);
    }
    // Load on the slope, 0,6 m from the foot at t = 0.
    const d0 = 0.6, d = d0 + m.s;
    const cx = X(d * Math.cos(a)), cy = Y(d * Math.sin(a));
    const cmx = cx + nx * bh / 2, cmy = cy + ny * bh / 2;
    // The forces start at the load's centre and are drawn first: the load then covers their tails and its mass label stays clear.
    const hw = (bw * Math.abs(ux) + bh * Math.abs(nx)) / 2, hv = (bw * Math.abs(uy) + bh * Math.abs(ny)) / 2; // half-size of the tilted load's outline
    reserve(ctx, cmx - hw - 2, cmy - hv - 2, 2 * hw + 4, 2 * hv + 4);
    reserve(ctx, wx - r, wy - r, 2 * r, 2 * r); // the winch drum
    reserve(ctx, 0, gy - 3, X(0), 6); // the ground line left of the foot: no vector name on it
    if (toggles.forces) {
      // One scale for the whole run: at the start, low on the slope, the weight arrow and its name still fit on the stage.
      const room = view.height - 26 - (Y(d0 * Math.sin(a)) + ny * bh / 2);
      const per = Math.min(80, 0.2 * view.height, Math.max(30, room)) / (p.m * p.g);
      drawArrow(ctx, cmx, cmy, cmx + ux * m.F * per, cmy + uy * m.F * per, c.force, 'F');
      drawArrow(ctx, cmx, cmy, cmx, cmy + p.m * p.g * per, c.fg, 'mg');
      if (m.f > 1e-6) {
        // Friction along the slope behind the load; its name above the slope, never down on the ground line.
        const tx = cx - ux * (bw / 2 + m.f * per), ty = cy - uy * (bw / 2 + m.f * per) - 2, at = (back, out) => [tx - ux * back + nx * out, ty - uy * back + ny * out];
        drawArrow(ctx, cx - ux * bw / 2, cy - uy * bw / 2 - 2, tx, ty, c.friction);
        vectorLabel(ctx, text.draw.friction, ...at(4, 16), c.friction, 'center', 'middle', [at(16, 14), at(-4, 26), at(20, 26), at(-4, 36), at(12, 38)]);
      }
    }
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-a); box(ctx, -bw / 2, -bh, bw, bh, c, `${num(p.m, 0)} kg`); ctx.restore();
    const ropeFrom = [cx + ux * bw / 2 + nx * bh / 2, cy + uy * bw / 2 + ny * bh / 2];
    rope(ctx, [ropeFrom, [wx - r * Math.sin(a), wy - r * Math.cos(a)]], c);
  },
};

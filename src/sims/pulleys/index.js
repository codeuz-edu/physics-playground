import { num } from '../../core/format.js';
import { drawArrow, drawGround, drawSky, ink, label } from '../../ui/canvas.js';
import { advance, gParam, hint, pulley, rope, support, weight } from '../kit.js';

const N = [1, 2, 4];
const H = 1.0; // m the load is lifted
const CEIL = 3.1;
// Drawing only: the load hangs this high (its bottom, m) when the lifting starts, so the weight arrow
// under it has room above the floor and one scale serves the whole run.
const LOW = 0.9;

const params = [
  { key: 'm', symbol: 'm', unit: 'kg', min: 5, max: 200, step: 1, default: 50, kind: 'initial', decimals: 0, color: '--pos' },
  // Mechanism names are in the text file (params.mode.options), in this order; N below gives each one's rope count.
  { key: 'mode', symbol: '', unit: '', min: 0, max: 2, step: 1, default: 0, kind: 'initial', options: ['fixed', 'movable', 'block-and-tackle'] },
  { key: 'u', symbol: 'u', unit: 'm/s', min: 0.2, max: 2, step: 0.1, default: 1, kind: 'initial', decimals: 1, color: '--vel' },
  gParam,
];

/** Ideal (light, frictionless) pulleys, load lifted slowly at constant speed: F = mg / n, rope pulled n times the lift. */
class PulleyModel {
  t = 0; s = 0; h = 0; n = 1; F = 0; reason = '';
  reset(p) { this.t = 0; this.s = 0; this.h = 0; this.n = N[p.mode]; this.F = (p.m * p.g) / this.n; this.reason = ''; }
  step(dt, p) {
    if (this.reason) return false;
    const r = advance(this.s, p.u, 0, dt, this.n * H);
    this.s = r.s; this.t += r.tau; this.h = this.s / this.n;
    if (r.hit) { this.reason = 'up'; return false; }
    return true;
  }
  isValid() { return [this.t, this.s, this.h, this.F].every(Number.isFinite); }
  sample() { return { s: this.s, h: this.h, F: this.F, A: this.F * this.s }; }
  clone() { return Object.assign(new PulleyModel(), this); }
  finishMessage(text) { return this.reason ? text.msg.done(num(H, 1), num(this.s, 1), num(this.F, 1), num(this.F * this.s, 1)) : ''; }
}

export default {
  id: 'pulleys',
  params,
  stageSize: 'tall',
  viewPadding: { left: 24, right: 24, top: 30, bottom: 24 },
  presets: [
    { values: { m: 50, mode: 0, u: 1, g: 9.81 } },
    { values: { m: 50, mode: 1, u: 1, g: 9.81 } },
    { values: { m: 50, mode: 2, u: 1, g: 9.81 } },
    { values: { m: 200, mode: 2, u: 1, g: 9.81 } },
  ],
  toggles: [
    { key: 'forces', default: true },
    { key: 'ruler', default: true },
  ],
  readouts: [
    { key: 'F', unit: 'N', decimals: 1, color: '--force' },
    { key: 'h', unit: 'm', decimals: 2, color: '--pos' },
    { key: 's', unit: 'm', decimals: 2, color: '--vel' },
    { key: 'A', unit: 'J', decimals: 1, color: '--acc' },
  ],
  graphs: [
    { id: 'hs', yLabel: 'l', unit: 'm', series: [{ key: 'h', color: '--pos' }, { key: 's', color: '--vel' }] },
    { id: 'A', yLabel: 'A', unit: 'J', series: [{ key: 'A', color: '--acc' }] },
  ],
  createModel: () => new PulleyModel(),
  worldBounds: () => ({ xMin: -1.4, xMax: 1.6, yMin: -0.1, yMax: CEIL + 0.15 }),

  draw({ ctx, view, model: m, params: p, toggles, colors: c }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y), S = view.scale, gy = Y(0);
    drawSky(ctx, view, c, gy);
    drawGround(ctx, view, c, gy);
    support(ctx, X(-0.9), X(0.9), Y(CEIL), c, 'up');
    const r = Math.max(8, 0.12 * S), n = m.n;
    const w = Math.min(0.5, Math.max(0.22, 0.09 * Math.cbrt(p.m))) * S, hb = w * 0.75;
    const loadTop = Y(LOW + m.h) - hb - 6; // rope / hook point above the load
    const hand = (x, y) => { ctx.save(); ctx.fillStyle = c.body; ctx.fillRect(x - 7, y, 14, 10); ctx.restore(); };
    const turn = (m.s * S) / r;
    // The mass is written on the load when it fits, else beside it (left: the pulling rope is on the right).
    const mass = `${num(p.m, 0)} kg`;
    ctx.save(); ctx.font = `600 ${Math.min(13, Math.max(11, hb * 0.42))}px Barlow, sans-serif`; const inside = w > 26 && hb > 14 && ctx.measureText(mass).width <= w - 6 ? mass : ''; ctx.restore();
    let pull = [0, 0]; // where the worker's hand holds the rope
    if (n === 1) {
      const cx = X(0), cy = Y(CEIL - 0.25);
      rope(ctx, [[cx, Y(CEIL)], [cx, cy]], c);
      rope(ctx, [[cx - r, cy], [cx - r, loadTop]], c);
      const hy = Y(CEIL - 0.6) + m.s * S;
      rope(ctx, [[cx + r, cy], [cx + r, hy]], c);
      ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.stroke(); ctx.restore();
      pulley(ctx, cx, cy, r, c, turn);
      weight(ctx, cx - r, loadTop, w, hb, c, inside);
      pull = [cx + r, hy];
    } else if (n === 2) {
      const fx = X(0.35), fy = Y(CEIL - 0.25); // fixed pulley that turns the rope down to the worker
      const mx = X(-0.1), my = loadTop - r; // movable pulley on the load
      rope(ctx, [[fx, Y(CEIL)], [fx, fy]], c);
      rope(ctx, [[mx - r, Y(CEIL)], [mx - r, my]], c);
      rope(ctx, [[mx + r, my], [fx - r, fy]], c); // up to the fixed pulley's left side; the arc below wraps it over the top
      ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.arc(mx, my, r, 0, Math.PI); ctx.stroke(); ctx.beginPath(); ctx.arc(fx, fy, r, Math.PI, 0); ctx.stroke(); ctx.restore();
      const hy = Y(CEIL - 0.6) + m.s * S * 0.5;
      rope(ctx, [[fx + r, fy], [fx + r, hy]], c);
      pulley(ctx, fx, fy, r, c, turn);
      pulley(ctx, mx, my, r, c, turn / 2);
      rope(ctx, [[mx, my], [mx, loadTop]], c);
      weight(ctx, mx, loadTop, w, hb, c, inside);
      pull = [fx + r, hy];
    } else {
      // Polispast: a block of two fixed pulleys above, two movable ones on the load, four rope strands between.
      const tx = [X(-0.32), X(0.08)], ty = Y(CEIL - 0.25), by = loadTop - r;
      const sx = [tx[0] - r, tx[0] + r, tx[1] - r, tx[1] + r];
      for (const x of tx) rope(ctx, [[x, Y(CEIL)], [x, ty]], c);
      for (const x of sx) rope(ctx, [[x, ty], [x, by]], c);
      const hy = Y(CEIL - 0.6) + m.s * S * 0.25;
      rope(ctx, [[tx[1] + r, ty], [X(0.75), ty], [X(0.75), hy]], c);
      for (const x of tx) { pulley(ctx, x, ty, r, c, turn); pulley(ctx, x, by, r, c, turn / 4); }
      ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object; ctx.beginPath(); ctx.moveTo(tx[0], by); ctx.lineTo(tx[1], by); ctx.moveTo((tx[0] + tx[1]) / 2, by); ctx.lineTo((tx[0] + tx[1]) / 2, loadTop); ctx.stroke(); ctx.restore();
      weight(ctx, (tx[0] + tx[1]) / 2, loadTop, w, hb, c, inside);
      pull = [X(0.75), hy];
    }
    hand(pull[0], pull[1]);
    const loadX = n === 1 ? X(0) - r : n === 2 ? X(-0.1) : (X(-0.32) + X(0.08)) / 2;
    if (!inside) hint(ctx, mass, loadX - w / 2 - 6, loadTop + 6 + hb / 2, c, 'right');
    if (toggles.ruler) {
      // Ruler from the load's starting level up: dashed lines at the start and at the end of the 1-m lift,
      // its length written beside the ruler between them.
      const rx = X(-1.05);
      ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(rx, Y(LOW)); ctx.lineTo(rx, Y(LOW + 1.2));
      for (let y = 0; y <= 1.2 + 1e-9; y += 0.1) { const yy = Math.round(Y(LOW + y)) + 0.5; ctx.moveTo(rx, yy); ctx.lineTo(rx + (Math.round(y * 10) % 5 === 0 ? 9 : 5), yy); }
      ctx.stroke();
      ctx.setLineDash([3, 4]); ctx.strokeStyle = c.ghost; ctx.beginPath();
      for (const y of [LOW, LOW + H]) { const yy = Math.round(Y(y)) + 0.5; ctx.moveTo(rx, yy); ctx.lineTo(loadX - w / 2 - 4, yy); }
      ctx.stroke(); ctx.restore();
      hint(ctx, `${num(H, 0)} m`, rx + 13, Y(LOW + H / 2), c);
    }
    if (toggles.forces) {
      label(ctx, `F = mg / ${n} = ${num(m.F, 1)} N`, 12, 20, c, 'left');
      // One scale for the whole run; at the start the weight arrow and its name fit between the load and the floor.
      const per = Math.min(90, 0.22 * view.height, LOW * S - 24) / (p.m * p.g);
      drawArrow(ctx, pull[0], pull[1] + 10, pull[0], pull[1] + 10 + m.F * per, c.force, 'F');
      drawArrow(ctx, loadX, loadTop + 6 + hb, loadX, loadTop + 6 + hb + p.m * p.g * per, c.fg, 'mg');
    }
  },
};

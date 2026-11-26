import { num } from '../../core/format.js';
import { drawArrow, drawGround, drawHatch, drawSky, fonts, label, reserve } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { amplitude, params, SpringModel, springPeriod, X_LIM } from './model.js';

const objScale = (view) => Math.min(1.9, Math.max(0.9, Math.min(view.width / 640, view.height / 170)));
const WALL_X = -1.0; // m, where the spring is fixed
const V_PX = 24; // px per m/s (× objScale)

/** A coil spring from (x0, y) to (x1, y): a zigzag between two straight ends. */
function drawSpring(ctx, x0, x1, y, amp, coils, color) {
  const end = Math.min(14, Math.abs(x1 - x0) * 0.1);
  const dir = Math.sign(x1 - x0) || 1;
  const a = x0 + dir * end;
  const b = x1 - dir * end;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(a, y);
  const n = coils * 2;
  for (let i = 1; i <= n; i++) {
    const x = a + ((b - a) * (i - 0.5)) / n;
    ctx.lineTo(x, y + (i % 2 ? -amp : amp));
  }
  ctx.lineTo(b, y);
  ctx.lineTo(x1, y);
  ctx.stroke();
  ctx.restore();
}

export default {
  id: 'spring',
  params,
  stageSize: 'strip',
  viewPadding: { left: 16, right: 16, top: 12, bottom: 40 },
  presets: [
    { values: { m: 0.5, k: 20, x0: 0.2, v0: 0, b: 0 } },
    { values: { m: 2, k: 200, x0: 0.1, v0: 0, b: 0 } },
    { values: { m: 4, k: 20, x0: 0.2, v0: 0, b: 0 } },
    { values: { m: 0.5, k: 20, x0: 0, v0: 1, b: 0 } },
    { values: { m: 0.5, k: 20, x0: 0.3, v0: 0, b: 0.5 } },
  ],
  toggles: [
    { key: 'force', default: true },
    { key: 'vel', default: true },
    { key: 'amp', default: true },
  ],
  readouts: [
    { key: 'x', unit: 'm', decimals: 3, color: '--pos' },
    { key: 'v', unit: 'm/s', decimals: 2, color: '--vel' },
    { key: 'F', unit: 'N', decimals: 2, color: '--force' },
    { key: 'period', unit: 's', decimals: 3 },
  ],
  graphs: [
    {
      id: 'xv',
      yLabel: 'x, υ',
      unit: '',
      series: [
        { key: 'x', color: '--pos' },
        { key: 'v', color: '--vel' },
      ],
    },
    {
      id: 'energy',
      yLabel: 'E',
      unit: 'J',
      series: [
        { key: 'ke', color: '--vel' },
        { key: 'pe', color: '--force' },
        { key: 'e', color: '--fg' },
      ],
    },
  ],
  createModel: () => new SpringModel(),
  worldBounds: () => ({ xMin: WALL_X - 0.12, xMax: 1.0, yMin: -0.1, yMax: 0.55 }),

  draw({ ctx, view, model, params: p, toggles, colors, text }) {
    const m = model ;
    const k = objScale(view);
    const gy = Math.round(view.py(0));
    drawSky(ctx, view, colors, gy);
    drawGround(ctx, view, colors, gy);

    // The wall the spring is fixed to.
    const wx = Math.round(view.px(WALL_X));
    const wallH = Math.min(gy, 110 * k);
    ctx.fillStyle = colors.ground;
    ctx.fillRect(wx - 14, gy - wallH, 14, wallH);
    drawHatch(ctx, wx - 14, gy - wallH, 14, wallH, colors.hatch, 0, 7);
    ctx.strokeStyle = colors.hatch;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    ctx.moveTo(wx, gy - wallH);
    ctx.lineTo(wx, gy);
    ctx.stroke();

    // Block size. The block is never wider than the room the spring leaves at its limit, so the
    // spring still shows between wall and block when it is squeezed as far as it goes.
    const room = 2 * Math.max(6, (-X_LIM - WALL_X) * view.scale - 8);
    const bw = Math.min(room, 60 * k * Math.cbrt(p.m / 0.5) ** 0.5);
    const bh = Math.min(bw * 0.77, 46 * k * Math.cbrt(p.m / 0.5) ** 0.5);
    // Rows over the block, bottom up: the force F, the velocity υ, then the amplitude's names, so nothing
    // crosses the block's name, the spring or another arrow.
    const fy = gy - bh - 14 * k, ay = gy - bh - 36 * k, aTop = gy - bh - 60 * k;

    // Equilibrium mark and amplitude limits.
    const ex = Math.round(view.px(0)) + 0.5;
    ctx.strokeStyle = colors.ghost;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ex, aTop);
    ctx.lineTo(ex, gy + 14);
    ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, 'x = 0', ex, gy + 24, colors, 'center');
    const A = amplitude(p);
    if (toggles.amp && A > 0.005 && p.b === 0) {
      // The amplitude, or, when the spring can't take it, the limits where the run will stop; both lines named.
      const over = A > X_LIM;
      const R = over ? X_LIM : A;
      ctx.strokeStyle = over ? colors.friction : colors.pos;
      ctx.setLineDash([2, 4]);
      for (const s of [-1, 1]) {
        const ax = Math.round(view.px(s * R)) + 0.5;
        ctx.beginPath();
        ctx.moveTo(ax, aTop + 2);
        ctx.lineTo(ax, gy);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      const badge = over ? `A = ${num(A, 2)} m > ${num(X_LIM, 2)} m` : `A = ${num(A, 2)} m`, neg = over ? `−${num(X_LIM, 2)} m` : '−A';
      label(ctx, badge, view.px(R), aTop - 9, colors, 'center');
      // The left line's name one row higher when a small amplitude brings it against the badge.
      ctx.save(); ctx.font = `700 12px ${fonts.mono}`; const half = ctx.measureText(badge).width / 2 + 8; ctx.font = '500 12px Barlow, sans-serif'; const nw = ctx.measureText(neg).width / 2; ctx.restore();
      hint(ctx, neg, view.px(-R), view.px(-R) + nw + 6 > view.px(R) - half ? aTop - 31 : aTop - 9, colors, 'center');
    }
    const cx = view.px(m.x);
    const sy = gy - bh / 2;
    drawSpring(ctx, wx, cx - bw / 2, sy, 9 * k, 9 + Math.round(p.k / 25), colors.iron);
    ctx.fillStyle = colors.track;
    ctx.strokeStyle = colors.body;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(cx - bw / 2, gy - bh, bw, bh);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = colors.fg;
    ctx.font = `600 ${Math.max(11, 11 * Math.min(k, 1.3))}px ${fonts.body}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // The mass alone on a block too narrow for "m = …".
    const name = `m = ${num(p.m, 1)} kg`;
    ctx.fillText(ctx.measureText(name).width <= bw - 8 ? name : `${num(p.m, 1)} kg`, cx, gy - bh / 2);
    reserve(ctx, cx - bw / 2, gy - bh, bw, bh); // the vector names stay off the block

    // Force and velocity, each in its row over the block.
    const F = -p.k * m.x;
    const fs = (70 * k) / Math.max(1, p.k * Math.max(A, 0.05));
    if (toggles.force && Math.abs(F) > 0.05) drawArrow(ctx, cx, fy, cx + F * fs, fy, colors.force, 'F');
    if (toggles.vel && Math.abs(m.v) > 0.01) drawArrow(ctx, cx, ay, cx + m.v * V_PX * k, ay, colors.vel, 'υ');

    // Period from the formula, for comparison with the measured one.
    ctx.font = `500 12px ${fonts.mono}`;
    ctx.fillStyle = colors.muted;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`T = 2π√(m/k) = ${num(springPeriod(p.m, p.k), 3)} s`, 16, view.width < 560 ? 60 : 22);

    // Drag cue right of the block, where the stage has room for it (the page says the same under the stage).
    if (m.t === 0) {
      ctx.font = '500 12px Barlow, sans-serif';
      const cue = text.draw.dragBlock, w = Math.max(...cue.map((t) => ctx.measureText(t).width));
      if (cx + bw / 2 + 10 + w < view.width - 4) cue.forEach((t, i) => hint(ctx, t, cx + bw / 2 + 10, gy - bh / 2 + (i - (cue.length - 1) / 2) * 15, colors));
    }
  },

  drag: {
    hit(x, y, model, _p, view) {
      const m = model ;
      if (m.t !== 0) return null;
      return Math.abs(view.px(x) - view.px(m.x)) < 40 && y > -0.1 && y < 0.5 ? 'block' : null;
    },
    move(_h, x) {
      return { x0: x };
    },
  },
};

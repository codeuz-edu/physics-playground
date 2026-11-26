import { drawArrow, drawComponents, drawBall, fonts, formatTick, niceStep, reserve, vectorLabel } from '../../ui/canvas.js';
import { CircularModel, params } from './model.js';

/** Ball size: grows with the stage, within limits. */
const objScale = (view) => Math.min(1.6, Math.max(1, view.height / 420));

/** Axes through the centre, with ticks in metres. */
function drawAxes(ctx, view, c) {
  const cx = Math.round(view.px(0)) + 0.5;
  const cy = Math.round(view.py(0)) + 0.5;
  const vis = view.visible();
  const step = niceStep(vis.yMax - vis.yMin, Math.max(3, Math.floor(view.height / 100)));
  ctx.save();
  ctx.strokeStyle = c.axis;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(view.width, cy);
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, view.height);
  for (let v = Math.ceil(vis.xMin / step) * step; v <= vis.xMax; v += step) {
    const p = Math.round(view.px(v)) + 0.5;
    ctx.moveTo(p, cy - 4);
    ctx.lineTo(p, cy + 4);
  }
  for (let v = Math.ceil(vis.yMin / step) * step; v <= vis.yMax; v += step) {
    const p = Math.round(view.py(v)) + 0.5;
    ctx.moveTo(cx - 4, p);
    ctx.lineTo(cx + 4, p);
  }
  ctx.stroke();
  ctx.fillStyle = c.muted;
  ctx.font = `12px ${fonts.mono}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  // Each number is marked as taken, so the names of the vectors are not put on it.
  for (let v = Math.ceil(vis.xMin / step) * step; v <= vis.xMax; v += step) {
    if (Math.abs(v) < 1e-9 || view.px(v) > view.width - 48) continue; // leave room for "x (m)"
    const t = formatTick(v, step), w = ctx.measureText(t).width;
    ctx.fillText(t, view.px(v), cy + 7);
    reserve(ctx, view.px(v) - w / 2, cy + 6, w, 14);
  }
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let v = Math.ceil(vis.yMin / step) * step; v <= vis.yMax; v += step) {
    if (Math.abs(v) < 1e-9 || view.py(v) < view.padding.top) continue;
    const t = formatTick(v, step), w = ctx.measureText(t).width;
    ctx.fillText(t, cx - 8, view.py(v));
    reserve(ctx, cx - 8 - w, view.py(v) - 7, w, 14);
  }
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('x (m)', view.width - 10, cy + 7);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText('y (m)', cx + 8, view.padding.top - 4);
  ctx.restore();
}

export default {
  id: 'circular',
  params,
  stageSize: 'tall',
  // Top padding keeps the axis labels clear of the time display.
  viewPadding: { left: 16, right: 16, top: 60, bottom: 16 },
  presets: [
    { values: { r: 3, v: 6 } },
    { values: { r: 1.5, v: 6 } },
    { values: { r: 3, v: 12 } },
    { values: { r: 8, v: 4 } },
  ],
  toggles: [
    { key: 'vel', default: true },
    { key: 'acc', default: true },
    { key: 'proj', default: true },
    { key: 'vcomp', default: false },
  ],
  readouts: [
    { key: 'period', unit: 's', decimals: 2 },
    { key: 'omega', unit: 'rad/s', decimals: 2 },
    { key: 'ac', unit: 'm/s²', decimals: 2, color: '--acc' },
  ],
  graphs: [
    {
      id: 'pos',
      unit: 'm',
      series: [
        { key: 'x', color: '--vx' },
        { key: 'y', color: '--vy' },
      ],
    },
    {
      id: 'vel',
      unit: 'm/s',
      series: [
        { key: 'vx', color: '--vx' },
        { key: 'vy', color: '--vy' },
      ],
    },
  ],
  createModel: () => new CircularModel(),
  worldBounds: (p) => ({ xMin: -1.8 * p.r, xMax: 1.8 * p.r, yMin: -1.45 * p.r, yMax: 1.45 * p.r }),

  draw({ ctx, view, model, toggles, colors, text }) {
    const m = model ;
    const s = m.sample();
    const cx = view.px(0);
    const cy = view.py(0);
    const R = m.r * view.scale;
    const bx = view.px(s.x);
    const by = view.py(s.y);
    const k = objScale(view);

    // The circle the ball runs on, under the axes so their labels stay readable.
    ctx.strokeStyle = colors.track;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    drawAxes(ctx, view, colors);

    // Shadows of the ball on the axes: each moves back and forth like a sine wave.
    if (toggles.proj) {
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = colors.ghost;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx, cy);
      ctx.moveTo(bx, by);
      ctx.lineTo(cx, by);
      ctx.stroke();
      ctx.setLineDash([]);
      for (const [x, y, color] of [
        [bx, cy, colors.vx],
        [cx, by, colors.vy],
      ] ) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Each shadow is named by its coordinate (the colours of the x and y graphs), beside its dashed
      // line on the far side from the centre; not while it sits under the ball or on the centre.
      const sx = bx >= cx ? 1 : -1, sy = by <= cy ? -1 : 1, rb = 9 * k + 6;
      if (Math.abs(by - cy) > rb && Math.abs(bx - cx) > 14) vectorLabel(ctx, 'x', bx + sx * 11, cy - sy * 12, colors.vx, 'center', 'middle', [[bx - sx * 11, cy - sy * 12], [bx + sx * 11, cy + sy * 14]]);
      if (Math.abs(bx - cx) > rb && Math.abs(by - cy) > 14) vectorLabel(ctx, 'y', cx - sx * 12, by - sy * 12, colors.vy, 'center', 'middle', [[cx - sx * 12, by + sy * 12], [cx + sx * 12, by - sy * 12]]);
    }

    // Radius
    ctx.strokeStyle = colors.muted;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.fillStyle = colors.fg;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    // The radius is named near the centre, on the side the ball is heading for (the name of the acceleration
    // arrow, which runs along the radius from the ball, goes on the other side).
    if (R > 40) {
      const ex = (bx - cx) / R, ey = (by - cy) / R, turn = s.vx * -ey - s.vy * ex < 0 ? -1 : 1; // (−ey, ex)·turn: the way the ball goes
      const at = (f, side) => [cx + ex * R * f - ey * turn * side * 12, cy + ey * R * f + ex * turn * side * 12];
      vectorLabel(ctx, 'r', ...at(0.28, 1), colors.muted, 'center', 'middle', [at(0.28, -1), at(0.18, 1), at(0.18, -1)]);
    }

    drawBall(ctx, bx, by, 9 * k, colors);

    // Arrows are scaled to the circle, so they read the same at any radius.
    const vs = R / 12;
    if (toggles.vel) {
      if (toggles.vcomp) {
        drawComponents(
          ctx,
          bx,
          by,
          bx + s.vx * vs,
          by - s.vy * vs,
          [
            { dx: s.vx * vs, dy: 0, color: colors.vx, label: 'υₓ' },
            { dx: 0, dy: -s.vy * vs, color: colors.vy, label: 'υᵧ' },
          ],
          colors.ghost,
        );
      }
      drawArrow(ctx, bx, by, bx + s.vx * vs, by - s.vy * vs, colors.vel, 'υ');
    }
    if (toggles.acc && s.ac > 0) {
      const len = Math.min(R * 0.9, (s.ac * R) / 24);
      const ux = (cx - bx) / R;
      const uy = (cy - by) / R;
      if (toggles.vcomp) {
        drawComponents(
          ctx,
          bx,
          by,
          bx + ux * len,
          by + uy * len,
          [
            { dx: ux * len, dy: 0, color: colors.vx, label: 'aₓ' },
            { dx: 0, dy: uy * len, color: colors.vy, label: 'aᵧ' },
          ],
          colors.ghost,
        );
      }
      drawArrow(ctx, bx, by, bx + ux * len, by + uy * len, colors.acc, 'a');
    }

    if (m.t === 0) {
      ctx.fillStyle = colors.muted;
      ctx.font = `500 12px ${fonts.body}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      // Kept inside the stage: the ball starts near the right edge on narrow screens.
      const cue = text.draw.cue;
      const half = ctx.measureText(cue).width / 2;
      ctx.fillText(cue, Math.max(half + 8, Math.min(bx, view.width - half - 8)), by + 30);
    }
  },

  drag: {
    hit(x, y, model, _p, view) {
      const m = model ;
      if (m.t > 0) return null;
      return Math.hypot(view.px(x) - view.px(m.r), view.py(y) - view.py(0)) < 24 ? 'ball' : null;
    },
    move(_h, x, y) {
      return { r: Math.hypot(x, y) };
    },
  },
};

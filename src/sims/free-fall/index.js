import { num } from '../../core/format.js';
import { decimalMark } from '../../core/i18n.js';
import { drawArrow, drawBall, drawGround, drawHatch, drawShadow, drawSky, fonts, formatTick, label, niceStep } from '../../ui/canvas.js';
import { FreeFallModel, idealFall, params } from './model.js';

/** Drawing scale for the ball and tower: grows with the stage, within limits. */
const objScale = (view) => Math.min(1.6, Math.max(1, view.height / 420));
const V_PX = 3.2; // pixels per m/s for the velocity arrow
const A_PX = 5; // pixels per m/s² for the acceleration arrow
const SNAP_STEPS = [0.1, 0.2, 0.25, 0.5, 1, 2, 5];

/** Equal-time snapshot interval: the shortest that gives at most 14 snapshots for this throw. */
function snapEvery(p) {
  const T = idealFall(p.h0, p.v0, p.g).flightTime;
  return SNAP_STEPS.find((s) => T / s <= 14) ?? 10;
}

/** Height scale beside the ball: a slim ruler from the ground to the top of the view. */
function drawHeightScale(ctx, view, x, c) {
  const top = view.wy(view.padding.top);
  const step = niceStep(top, Math.max(3, Math.floor(view.height / 70)));
  const ax = Math.round(x) + 0.5;
  const yTop = Math.floor(top / step) * step;
  ctx.save();
  ctx.strokeStyle = c.axis;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ax, view.py(0));
  ctx.lineTo(ax, view.py(yTop));
  for (let y = step; y <= yTop + 1e-9; y += step) {
    const py = Math.round(view.py(y)) + 0.5;
    ctx.moveTo(ax, py);
    ctx.lineTo(ax + 6, py);
  }
  ctx.stroke();
  ctx.fillStyle = c.muted;
  ctx.font = `12px ${fonts.mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (let y = step; y <= yTop + 1e-9; y += step) ctx.fillText(formatTick(y, step), ax + 10, view.py(y));
  ctx.fillText('y (m)', ax + 10, view.py(yTop) - 18);
  ctx.restore();
}

export default {
  id: 'free-fall',
  params,
  stageSize: 'tall',
  // Top padding keeps the time display clear of the highest point.
  viewPadding: { left: 16, right: 16, top: 56, bottom: 30 },
  presets: [
    { values: { h0: 20, v0: 0, g: 9.81, k: 0 } },
    { values: { h0: 20, v0: 0, g: 1.62, k: 0 } },
    { values: { h0: 20, v0: 0, g: 3.71, k: 0 } },
    { values: { h0: 0, v0: 15, g: 9.81, k: 0 } },
    { values: { h0: 30, v0: 10, g: 9.81, k: 0 } },
    { values: { h0: 30, v0: -10, g: 9.81, k: 0 } },
    { values: { h0: 100, v0: 0, g: 9.81, k: 0.02 } },
  ],
  toggles: [
    { key: 'vel', default: true },
    { key: 'acc', default: true },
    { key: 'snap', default: true },
  ],
  readouts: [
    { key: 'y', unit: 'm', decimals: 2, color: '--pos' },
    { key: 'v', unit: 'm/s', decimals: 2, color: '--vel' },
    { key: 'a', unit: 'm/s²', decimals: 2, color: '--acc' },
  ],
  graphs: [
    { id: 'y', unit: 'm', series: [{ key: 'y', color: '--pos' }] },
    { id: 'v', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
    { id: 'a', unit: 'm/s²', series: [{ key: 'a', color: '--acc' }] },
  ],
  createModel: () => new FreeFallModel(),
  worldBounds(p) {
    const yMax = Math.max(idealFall(p.h0, p.v0, p.g).maxHeight * 1.06, 4);
    // Room under the ground for the velocity arrow at landing.
    return { xMin: -yMax * 0.25, xMax: yMax * 0.25, yMin: -Math.max(0.5, yMax * 0.12), yMax };
  },

  draw({ ctx, view, model, params: p, toggles, colors, history, text }) {
    const m = model ;
    const gy = view.py(0);
    const k = objScale(view);
    const r = 9 * k;
    const bx = view.px(0);
    const by = view.py(m.y) - r; // the ball rests on its position point, so it sits on the ground

    drawSky(ctx, view, colors, gy);
    drawGround(ctx, view, colors, gy);
    drawHeightScale(ctx, view, bx + 70 * k, colors);

    // Tower the ball starts from, drawn like the projectile's cliff.
    if (p.h0 > 0) {
      // A slim tower with a floor line every 3 m and a ledge the ball leaves from.
      const right = Math.round(bx - r - 6);
      const w = Math.round(26 * k);
      const left = right - w;
      const ty = Math.round(view.py(p.h0));
      ctx.fillStyle = colors.track;
      ctx.fillRect(left, ty, w, gy - ty);
      const floor = Math.max(14, 3 * view.scale);
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = ty + floor; y < gy - 6; y += floor) {
        ctx.moveTo(left, Math.round(y) + 0.5);
        ctx.lineTo(right, Math.round(y) + 0.5);
      }
      ctx.stroke();
      ctx.strokeStyle = colors.fg;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(left + 0.75, ty + 0.75, w - 1.5, gy - ty - 0.75);
      ctx.fillStyle = colors.fg;
      ctx.fillRect(left - 4, ty - 1, w + 4 + Math.round(r * 0.6) + 6, 3);
    }

    // Snapshots at equal time steps: the gaps grow as the ball speeds up.
    if (toggles.snap && history.length > 1) {
      const every = snapEvery(p);
      const ys = history.series.y;
      ctx.strokeStyle = colors.ghost;
      ctx.lineWidth = 1.5;
      let next = 0;
      for (let i = 0; i < history.length; i++) {
        if (history.t[i] + 1e-6 < next) continue;
        ctx.beginPath();
        ctx.arc(bx, view.py(ys[i]) - r, r, 0, Math.PI * 2);
        ctx.stroke();
        next += every;
      }
      // `every` is one of SNAP_STEPS (or 10): print it as is, with the language's decimal mark.
      // Under the ground, right below the column of snapshots it describes, so it covers none of them.
      if (m.landed) label(ctx, text.draw.snapEvery(String(every).replace('.', decimalMark())), bx, gy + 28, colors, 'center');
    }

    // Highest point, once the ball is on its way down.
    if (m.maxHeight > p.h0 + 0.05 && m.v < 0) {
      const ty = view.py(m.maxHeight) - r;
      ctx.strokeStyle = colors.pos;
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx - r - 4, Math.round(ty) + 0.5);
      ctx.lineTo(bx + 70 * k, Math.round(ty) + 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
      label(ctx, text.draw.highest(num(m.maxHeight, 1)), bx - r - 10, ty, colors, 'right');
    }

    drawShadow(ctx, bx, gy, gy - by - r, 22 * k, colors);
    drawBall(ctx, bx, by, r, colors);

    // One scale per run, chosen so the longest arrows (at landing) still fit above the bottom edge.
    const room = view.height - 22 - (gy - r);
    const vs = Math.min(V_PX * k, room / Math.max(1, idealFall(p.h0, p.v0, p.g).impactSpeed));
    // |a| = |−g − k|υ|υ| is largest at the launch: g + kυ₀² going up, |kυ₀² − g| ≤ g + kυ₀² thrown down.
    const as = Math.min(A_PX * k, room / Math.max(1, p.g + p.k * p.v0 ** 2));
    if (!m.landed || m.t === 0) {
      if (toggles.vel) drawArrow(ctx, bx, by, bx, by - m.v * vs, colors.vel, 'υ');
      if (toggles.acc) drawArrow(ctx, bx + r + 12, by, bx + r + 12, by - m.a * as, colors.acc, 'a');
    }

    if (m.t === 0) {
      ctx.fillStyle = colors.muted;
      ctx.font = `500 12px ${fonts.body}`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      // Left of the ball and above it; on a small stage, where the ball starts at the top edge, it stays on the stage.
      ctx.fillText(text.draw.cue, bx - r - 8, Math.max(18, by - r - 6));
    }
  },

  drag: {
    hit(x, y, model, _p, view) {
      const m = model ;
      return Math.hypot(view.px(x) - view.px(0), view.py(y) - (view.py(m.y) - 9 * objScale(view))) < 24 ? 'ball' : null;
    },
    move(_h, _x, y, _p, view) {
      return { h0: y - (9 * objScale(view)) / view.scale };
    },
  },
};

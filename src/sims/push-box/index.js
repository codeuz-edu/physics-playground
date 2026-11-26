import { drawArrow, drawFlag, drawGrid, drawGround, drawShadow, drawSky, fonts, label, vectorLabel } from '../../ui/canvas.js';
import { num } from '../../core/format.js';
import { BoxModel, FLOOR, params } from './model.js';

/** Drawing scale for the box: grows with the stage, within limits. */
const objScale = (view) => Math.min(1.6, Math.max(0.85, Math.min(view.width / 700, view.height / 200)));
/** Pixels per newton for force arrows. */
const nScale = (view) => Math.min(1.1, Math.max(0.5, view.width / 700));
const MAX_ARROW = 170; // px; friction on a heavy box can be far larger than the push
const HANDLE = 12; // px from the tip of the push arrow to the centre of its handle (clear of the centre dot at F = 0)

const arrowLen = (force, view) => Math.sign(force) * Math.min(MAX_ARROW, Math.abs(force) * nScale(view));

export default {
  id: 'push-box',
  params,
  stageSize: 'strip',
  viewPadding: { left: 16, right: 16, top: 12, bottom: 40 },
  presets: [
    { values: { F: 60, m: 10, mus: 0.5, muk: 0.3, v0: 0 } },
    { values: { F: 40, m: 10, mus: 0.5, muk: 0.3, v0: 0 } },
    { values: { F: 50, m: 10, mus: 0.5, muk: 0.3, v0: 0 } },
    { values: { F: 0, m: 10, mus: 0.5, muk: 0.3, v0: 8 } },
    { values: { F: 60, m: 20, mus: 0.5, muk: 0.3, v0: 0 } },
    { values: { F: 20, m: 10, mus: 0.05, muk: 0.03, v0: 0 } },
  ],
  toggles: [
    { key: 'forces', default: true },
    { key: 'net', default: true },
  ],
  readouts: [
    { key: 'f', unit: 'N', decimals: 1, color: '--friction' },
    { key: 'a', unit: 'm/s²', decimals: 2, color: '--acc' },
    { key: 'v', unit: 'm/s', decimals: 2, color: '--vel' },
  ],
  graphs: [
    {
      id: 'forces',
      unit: 'N',
      series: [
        { key: 'F', color: '--force' },
        { key: 'f', color: '--friction' },
        { key: 'net', color: '--acc' },
      ],
    },
    { id: 'v', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
  ],
  createModel: () => new BoxModel(),
  // Sliding friction is never above the static limit: a μₛ set above μₜ is brought down to it,
  // and the slider shows the value the run really uses.
  restartValues: (p) => ({ muk: Math.min(p.muk, p.mus) }),
  // Room on the left for the friction arrow, on the right for the finish flag and the push arrow with its
  // handle and name (the longest push, on a phone, when the box has stopped at the flag).
  worldBounds: () => ({ xMin: -7, xMax: FLOOR + 6, yMin: -1.5, yMax: 4.5 }),

  draw({ ctx, view, model, params: p, toggles, colors, text }) {
    const m = model ;
    const gy = Math.round(view.py(0));
    const k = objScale(view);
    const B = 46 * k;
    const H = 40 * k;
    const bx = view.px(m.x);
    const left = bx - B / 2;
    const top = gy - H;
    const cy = top + H / 2;

    drawSky(ctx, view, colors, gy);
    drawGround(ctx, view, colors, gy);
    drawGrid(ctx, view, { grid: colors.grid, axis: colors.axis, label: colors.muted }, { xLabel: 'x (m)', showY: false, xLabelRange: [0, FLOOR], clipBelow: gy, lines: false });

    // Finish flag at the end of the floor: the run ends when the box's centre reaches its pole.
    // The cloth flies just above the box, under the net-force arrow.
    drawFlag(ctx, view.px(FLOOR), gy, top - 2 - 3 * 4, colors, 4);

    // The box: a light crate, so arrows drawn over it stay visible.
    drawShadow(ctx, bx, gy - 1, 0, B + 6, colors);
    ctx.fillStyle = colors.track;
    ctx.strokeStyle = colors.body;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(left, top, B, H);
    ctx.fill();
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeRect(left + 4.5, top + 4.5, B - 9, H - 9);
    ctx.fillStyle = colors.fg;
    ctx.font = `600 ${Math.max(11, Math.round(11 * k))}px ${fonts.body}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Mass in the upper half, clear of the force arrows along the centre line.
    ctx.fillText(`${num(p.m, Number.isInteger(p.m) ? 0 : 1)} kg`, bx, top + H * 0.27 + 0.5);

    // Forces start at the centre of the box, as in a textbook free-body diagram (the box is
    // treated as a point): the push to the right, friction to the left. The push handle sits
    // past the tip of its arrow, so F is named above the handle and friction beyond its own tip.
    const tip = bx + arrowLen(m.F, view);
    if (toggles.forces) {
      if (m.F > 0) {
        drawArrow(ctx, bx, cy, tip, cy, colors.force);
        vectorLabel(ctx, 'F', tip + HANDLE, cy - 11, colors.force, 'center', 'bottom');
      }
      if (m.f < 0) {
        const fx = bx + arrowLen(m.f, view);
        drawArrow(ctx, bx, cy, fx, cy, colors.friction);
        vectorLabel(ctx, text.draw.friction, fx - 6, cy - 2, colors.friction, 'right', 'middle');
      }
    }
    ctx.fillStyle = colors.fg;
    ctx.beginPath();
    ctx.arc(bx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    // Net force above the box, centred on it, clear of the wall.
    const net = arrowLen(m.F + m.f, view);
    if (toggles.net && Math.abs(m.F + m.f) > 0.05) drawArrow(ctx, bx - net / 2, top - 26, bx + net / 2, top - 26, colors.acc, 'ΣF');
    // Why it holds or slides, with the numbers (as on the inclined plane).
    const push = num(Math.abs(m.F), 0);
    const hold = num(m.holdMax, 1);
    const state = m.v > 0 ? text.draw.sliding(num(Math.min(p.muk, p.mus), 2)) : m.sliding ? text.draw.starts(push, hold) : text.draw.holds(push, hold);
    // Centred over the box, but never closer than 12 px to an edge of the stage; hidden at the finish flag, where it has stopped.
    ctx.font = `700 12px ${fonts.mono}`;
    const half = ctx.measureText(state).width / 2 + 8;
    if (m.x < FLOOR) label(ctx, state, Math.min(Math.max(bx, half + 12), view.width - half - 12), top - 58, colors);

    // Handle on the end of the push arrow: drag it right to push harder.
    const hx = tip + HANDLE;
    ctx.fillStyle = colors.surface;
    ctx.strokeStyle = colors.force;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    ctx.arc(hx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (m.t === 0) {
      ctx.fillStyle = colors.muted;
      ctx.font = `500 12px ${fonts.body}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.draw.cue, hx + 14, cy); // right of the handle, on open floor
    }
  },

  drag: {
    // Worked out from the model, not from the last picture, so it holds even when nothing has
    // been drawn since. The handle carries the model, so a drag keeps up with a sliding box.
    hit(x, y, model, _p, view) {
      const m = model ;
      const k = objScale(view);
      const hx = view.px(m.x) + arrowLen(m.F, view) + HANDLE;
      const hy = Math.round(view.py(0)) - (40 * k) / 2;
      return Math.hypot(view.px(x) - hx, view.py(y) - hy) < 20 ? { kind: 'push', model: m } : null;
    },
    move(h, x, _y, _p, view) {
      if (!h || !h.model) return {};
      return { F: (view.px(x) - HANDLE - view.px(h.model.x)) / nScale(view) };
    },
  },
};

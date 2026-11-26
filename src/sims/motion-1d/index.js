
import { drawArrow, drawFlag, drawGrid, drawGround, drawShadow, drawSky, fonts } from '../../ui/canvas.js';
import { Motion1DModel, params, TRACK_LENGTH } from './model.js';

const V_PX = 5; // pixels per m/s for the velocity arrow
const A_PX = 22; // pixels per m/s² for the acceleration arrow
const CAR_W = 42;
const WHEEL_R = 5.5;

/** Side view of a small car standing on the ground at (cx, groundY); `dir` = 1 faces right. */
export function drawCar(ctx, cx, groundY, dir, wheelAngle, c, scale = 1) {
  ctx.save();
  ctx.translate(cx, groundY);
  ctx.scale(dir * scale, scale);

  // Body: one smooth profile with wheel arches cut out of the sill, in flat ink.
  ctx.fillStyle = c.body;
  ctx.beginPath();
  ctx.moveTo(-21, -6);
  ctx.lineTo(-21.6, -12.5);
  ctx.quadraticCurveTo(-21.4, -16.4, -18, -16.8);
  ctx.lineTo(-11, -17.2);
  ctx.quadraticCurveTo(-8.2, -25.4, -3, -25.6);
  ctx.lineTo(3.5, -25.6);
  ctx.quadraticCurveTo(6.8, -25.4, 10.5, -17.4);
  ctx.lineTo(18, -15.6);
  ctx.quadraticCurveTo(21.8, -14.6, 21.8, -10.5);
  ctx.lineTo(21.8, -6);
  ctx.lineTo(19.6, -6);
  ctx.arc(12, -5.5, 7.4, -0.05, Math.PI + 0.05, true);
  ctx.lineTo(-4.4, -6);
  ctx.arc(-12, -5.5, 7.4, -0.05, Math.PI + 0.05, true);
  ctx.closePath();
  ctx.fill();

  // Glass
  ctx.fillStyle = '#d3e2ec';
  ctx.beginPath();
  ctx.moveTo(-9.6, -17.4);
  ctx.quadraticCurveTo(-7.6, -23.4, -3.4, -23.6);
  ctx.lineTo(-0.8, -23.6);
  ctx.lineTo(-0.8, -17.4);
  ctx.closePath();
  ctx.moveTo(1, -17.4);
  ctx.lineTo(1, -23.6);
  ctx.lineTo(3.4, -23.6);
  ctx.quadraticCurveTo(5.8, -23.3, 8.6, -17.4);
  ctx.closePath();
  ctx.fill();

  // Waist highlight, door seam, lights
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-19.5, -14.2);
  ctx.lineTo(19, -13.4);
  ctx.moveTo(0.1, -17.2);
  ctx.lineTo(0.1, -7.5);
  ctx.stroke();
  ctx.fillStyle = '#f4b740';
  ctx.beginPath();
  ctx.roundRect(19.4, -14, 2.2, 2.4, 0.8);
  ctx.fill();
  ctx.fillStyle = '#d6334d';
  ctx.beginPath();
  ctx.roundRect(-21.6, -13.4, 1.8, 2.6, 0.6);
  ctx.fill();

  // Wheels: tyre, alloy rim and spokes that turn with distance travelled
  for (const wx of [-12, 12]) {
    ctx.save();
    ctx.translate(wx, -WHEEL_R);
    // dark wheel well behind the tyre
    ctx.fillStyle = '#0b1115';
    ctx.beginPath();
    ctx.arc(0, -0.2, 7.2, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#121a20';
    ctx.beginPath();
    ctx.arc(0, 0, WHEEL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c5ced4';
    ctx.beginPath();
    ctx.arc(0, 0, WHEEL_R * 0.58, 0, Math.PI * 2);
    ctx.fill();
    ctx.rotate(wheelAngle * dir);
    ctx.strokeStyle = '#6b7882';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    for (let k = 0; k < 5; k++) {
      const a = (k * 2 * Math.PI) / 5;
      ctx.moveTo(Math.cos(a) * 0.9, Math.sin(a) * 0.9);
      ctx.lineTo(Math.cos(a) * WHEEL_R * 0.55, Math.sin(a) * WHEEL_R * 0.55);
    }
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

export default {
  id: 'motion-1d',
  params,
  stageSize: 'strip',
  viewPadding: { left: 16, right: 16, top: 12, bottom: 40 },
  presets: [
    { values: { x0: 0, v0: 0, a: 2 } },
    { values: { x0: 10, v0: 5, a: 0 } },
    { values: { x0: 0, v0: 15, a: -2.5 } },
    { values: { x0: 50, v0: 10, a: -2 } },
    { values: { x0: 95, v0: -12, a: 1.5 } },
  ],
  toggles: [
    { key: 'vel', default: true },
    { key: 'acc', default: true },
    { key: 'dots', default: true },
    { key: 'grid', default: false },
  ],
  readouts: [
    { key: 'x', unit: 'm', decimals: 2, color: '--pos' },
    { key: 'v', unit: 'm/s', decimals: 2, color: '--vel' },
    { key: 'a', unit: 'm/s²', decimals: 2, color: '--acc' },
  ],
  graphs: [
    { id: 'x', unit: 'm', series: [{ key: 'x', color: '--pos' }] },
    { id: 'v', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
    { id: 'a', unit: 'm/s²', series: [{ key: 'a', color: '--acc' }] },
  ],
  createModel: () => new Motion1DModel(),
  // Margin on both ends leaves room for arrows when the car sits at an end of the track.
  worldBounds: () => ({ xMin: -13, xMax: TRACK_LENGTH + 16, yMin: -2, yMax: 6 }),

  draw({ ctx, view, model, toggles, colors, history, text }) {
    const m = model ;
    const gy = Math.round(view.py(0)); // ground surface
    const x1 = view.px(TRACK_LENGTH);

    drawSky(ctx, view, colors, gy);
    drawGround(ctx, view, colors, gy);
    drawGrid(ctx, view, { grid: colors.grid, axis: colors.axis, label: colors.muted }, { xLabel: 'x (m)', showY: false, xLabelRange: [0, TRACK_LENGTH], clipBelow: gy, lines: !!toggles.grid });

    // Finish flag exactly at the 100 m end: the run ends when the car's centre (where every
    // position here is measured) reaches its pole. The cloth flies just above the car's roof and
    // under the arrows, so it still shows when the car stops at the pole.
    const carScale = Math.min(1.9, Math.max(0.9, Math.min(view.width / 640, view.height / 170)));
    const sq = carScale < 1.4 ? 4 : 5;
    drawFlag(ctx, x1, gy, gy - 25.6 * carScale - 2 - 3 * sq, colors, sq);

    // Motion dots: where the car was at each whole second, just under the ground line
    // so the car never covers them. A white ring keeps them clear of the hatching.
    if (toggles.dots && history.length > 1) {
      const xs = history.series.x;
      ctx.fillStyle = colors.pos;
      ctx.strokeStyle = colors.surface;
      ctx.lineWidth = 1.5;
      let next = 0;
      for (let i = 0; i < history.length; i++) {
        if (history.t[i] + 1e-6 < next) continue;
        ctx.beginPath();
        ctx.arc(view.px(xs[i]), gy + 7, 3.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        next += 1;
      }
    }

    // Car
    const cx = view.px(m.x);
    drawShadow(ctx, cx, gy - 1, 0, (CAR_W + 4) * carScale, colors);
    drawCar(ctx, cx, gy, m.v < 0 ? -1 : 1, (m.x * view.scale) / (WHEEL_R * carScale), colors, carScale);

    // Vectors just above the roof (25.6 units high), one row each; their lengths grow with the car so they
    // stay readable on large stages.
    const vy = gy - 25.6 * carScale - 14;
    if (toggles.vel) drawArrow(ctx, cx, vy, cx + m.v * V_PX * carScale, vy, colors.vel, 'υ');
    if (toggles.acc) drawArrow(ctx, cx, vy - 26, cx + m.a * A_PX * carScale, vy - 26, colors.acc, 'a');

    if (m.t === 0) {
      // Beside the car at wheel height, clear of the arrows above it; on its left near the right edge.
      const cue = text.draw.cue;
      const gap = (CAR_W / 2) * carScale + 12;
      ctx.fillStyle = colors.muted;
      ctx.font = `500 12px ${fonts.body}`;
      const right = cx + gap + ctx.measureText(cue).width > view.width - 8;
      ctx.textAlign = right ? 'right' : 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(cue, cx + (right ? -1 : 1) * gap, gy - 8);
    }
  },

  drag: {
    hit(x, y, model, _p, view) {
      const m = model ;
      const dx = Math.abs(view.px(x) - view.px(m.x));
      const dy = Math.abs(view.py(y) - (view.py(0) - 14));
      return dx < 28 && dy < 30 ? 'car' : null;
    },
    move(_h, x) {
      return { x0: x };
    },
  },
};

import { drawArrow, drawGrid, drawGround, drawShadow, drawSky, fonts } from '../../ui/canvas.js';
import { drawCar } from '../motion-1d/index.js';
import { MatchModel, params, TARGETS, TRACK, T_RUN, V_MAX } from './model.js';

const V_PX = 5; // pixels per m/s for the velocity arrow

const targetOf = (p) => TARGETS[Math.min(TARGETS.length, Math.max(1, Math.round(p.target))) - 1];

const carScaleOf = (view) => Math.min(1.9, Math.max(0.9, Math.min(view.width / 640, view.height / 240)));

/**
 * The playing field: a position–time chart above the track, so the target and your
 * line are in view while you drive. Dashed: the target. Solid: you.
 * `key` holds the two captions of the key: { target, you }.
 */
function drawChart(ctx, view, target, history, t, top, bottom, c, key) {
  const left = 52;
  const right = view.width - 50; // room for "t (s)" at the end of the axis
  if (bottom - top < 60 || right - left < 120) return;
  const X = (tt) => left + ((right - left) * tt) / T_RUN;
  const Y = (x) => bottom - ((bottom - top) * x) / TRACK;

  ctx.save();
  // A clean sheet for the chart: the stage's dot grid does not show through it.
  ctx.fillStyle = c['sky-top'];
  ctx.fillRect(0, top - 26, view.width, bottom - top + 50);
  // Grid and labels
  ctx.strokeStyle = c.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= TRACK; x += 10) {
    ctx.moveTo(left, Math.round(Y(x)) + 0.5);
    ctx.lineTo(right, Math.round(Y(x)) + 0.5);
  }
  for (let tt = 0; tt <= T_RUN; tt += 2) {
    ctx.moveTo(Math.round(X(tt)) + 0.5, top);
    ctx.lineTo(Math.round(X(tt)) + 0.5, bottom);
  }
  ctx.stroke();
  ctx.strokeStyle = c.axis;
  ctx.beginPath();
  ctx.moveTo(left + 0.5, top);
  ctx.lineTo(left + 0.5, bottom + 0.5);
  ctx.lineTo(right, bottom + 0.5);
  ctx.stroke();
  ctx.fillStyle = c.muted;
  ctx.font = `12px ${fonts.mono}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let x = 0; x <= TRACK; x += 10) ctx.fillText(String(x), left - 6, Y(x));
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let tt = 0; tt <= T_RUN; tt += 2) ctx.fillText(String(tt), X(tt), bottom + 5);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText('x (m)', 8, top - 6);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('t (s)', right + 12, bottom); // at the end of the time axis, past its last number

  // Key on the line of the "x (m)" label: which target this is, and which line is yours.
  const ky = top - 6;
  let kx = left + 34;
  const swatch = (dash, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(kx, ky - 6);
    ctx.lineTo(kx + 18, ky - 6);
    ctx.stroke();
    ctx.setLineDash([]);
    kx += 24;
  };
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  const name = key.target;
  swatch([6, 5], c.ghost, 2);
  ctx.fillText(name, kx, ky);
  kx += ctx.measureText(name).width + 16;
  swatch([], c.pos, 2.5);
  ctx.fillText(key.you, kx, ky);

  // Target, dashed, for the whole run
  ctx.strokeStyle = c.ghost;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  for (let i = 0; i <= 200; i++) {
    const tt = (T_RUN * i) / 200;
    if (i === 0) ctx.moveTo(X(tt), Y(target.x(tt)));
    else ctx.lineTo(X(tt), Y(target.x(tt)));
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Your line so far, and where you are now
  const xs = history.series.x;
  if (xs && history.length > 1) {
    ctx.strokeStyle = c.pos;
    ctx.lineWidth = 1.75;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(X(history.t[0]), Y(xs[0]));
    for (let i = 1; i < history.length; i++) ctx.lineTo(X(history.t[i]), Y(xs[i]));
    ctx.stroke();
  }
  if (xs && history.length) {
    ctx.fillStyle = c.pos;
    ctx.beginPath();
    ctx.arc(X(t), Y(xs[history.length - 1]), 4.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export default {
  id: 'graph-match',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 12, bottom: 40 },
  presets: [], // the target menu is the list of setups
  toggles: [
    { key: 'vel', default: true },
    { key: 'marker', default: false },
  ],
  readouts: [
    { key: 'x', unit: 'm', decimals: 1, color: '--pos' },
    { key: 'xt', unit: 'm', decimals: 1, color: '--ghost' },
    { key: 'gap', unit: 'm', decimals: 1 },
  ],
  // The position graph is on the stage itself; the velocity graph shows its slope.
  graphs: [
    {
      id: 'v',
      unit: 'm/s',
      range: [-V_MAX, V_MAX],
      series: [
        { key: 'v', color: '--vel' },
        { key: 'vt', color: '--ghost', ahead: true },
      ],
    },
  ],
  createModel: () => new MatchModel(),
  // Every try starts with the car where the target starts.
  restartValues: (p) => ({ xp: targetOf(p).x(0) }),
  worldBounds: () => ({ xMin: -5, xMax: TRACK + 5, yMin: -2, yMax: 6 }),
  // The x–t chart is drawn above the track in pixels: the stage is made this much taller for it.
  stageExtra: 200,

  draw({ ctx, view, model, params: p, toggles, colors, history, text }) {
    const m = model ;
    const s = m.sample();
    const gy = Math.round(view.py(0));
    const carScale = carScaleOf(view);
    const target = targetOf(p);

    drawSky(ctx, view, colors, gy);
    drawGround(ctx, view, colors, gy);
    drawGrid(ctx, view, { grid: colors.grid, axis: colors.axis, label: colors.muted }, { xLabel: 'x (m)', showY: false, xLabelRange: [0, TRACK], clipBelow: gy, lines: false });
    // Chart from below the time display down to just above the car and its arrow.
    // The target's name is its entry in the menu of the `target` parameter.
    const key = { target: text.draw.target(text.params.target.options[TARGETS.indexOf(target)]), you: text.draw.you };
    drawChart(ctx, view, target, history, m.t, 64, gy - 74 * carScale, colors, key);

    if (toggles.marker) {
      const tx = Math.round(view.px(s.xt)) + 0.5;
      ctx.strokeStyle = colors.ghost;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(tx, gy - 48 * carScale);
      ctx.lineTo(tx, gy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = colors.ghost;
      ctx.beginPath();
      ctx.moveTo(tx - 6, gy - 56 * carScale);
      ctx.lineTo(tx + 6, gy - 56 * carScale);
      ctx.lineTo(tx, gy - 48 * carScale);
      ctx.fill();
    }

    const cx = view.px(m.x);
    // The model remembers the way it last moved, so a snapshot or a thumbnail faces correctly too.
    drawShadow(ctx, cx, gy - 1, 0, 46 * carScale, colors);
    drawCar(ctx, cx, gy, m.facing || 1, (m.x * view.scale) / (5.5 * carScale), colors, carScale);
    if (toggles.vel) {
      const vy = gy - 30 * carScale - 14;
      drawArrow(ctx, cx, vy, cx + m.v * V_PX * carScale, vy, colors.vel, 'υ');
    }

    if (m.t === 0) {
      ctx.fillStyle = colors.muted;
      ctx.font = `500 12px ${fonts.body}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(text.draw.cue, cx + 26 * carScale, gy - 8);
    }
  },

  drag: {
    hit(x, y, _m, _p, view) {
      // Anywhere along the track, so the car is easy to catch while it moves.
      return Math.abs(view.py(y) - (view.py(0) - 16)) < 40 && x > -3 && x < TRACK + 3 ? 'car' : null;
    },
    move(_h, x) {
      return { xp: x };
    },
  },
};

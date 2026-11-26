import { num } from '../../core/format.js';
import { drawArrow, drawBall, drawComponents, drawHatch, drawSky, fillSub, fonts, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { exactPeriod, params, PendulumModel, smallPeriod } from './model.js';

const DEG = Math.PI / 180;
const objScale = (view) => Math.min(1.6, Math.max(0.9, view.height / 420));

export default {
  id: 'pendulum',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 56, bottom: 16 },
  presets: [
    { values: { L: 0.99, theta0: 5, g: 9.81, m: 1, b: 0 } },
    { values: { L: 1, theta0: 60, g: 9.81, m: 1, b: 0 } },
    { values: { L: 1, theta0: 20, g: 1.62, m: 1, b: 0 } },
    { values: { L: 4, theta0: 15, g: 9.81, m: 1, b: 0 } },
    { values: { L: 1, theta0: 40, g: 9.81, m: 1, b: 0.3 } },
  ],
  toggles: [
    { key: 'vel', default: true },
    { key: 'acc', default: false },
    { key: 'forces', default: false },
    { key: 'arc', default: true },
  ],
  readouts: [
    { key: 'theta', unit: '°', decimals: 1, color: '--pos' },
    { key: 'v', unit: 'm/s', decimals: 2, color: '--vel' },
    { key: 'tension', unit: 'N', decimals: 2, color: '--force' },
    { key: 'period', unit: 's', decimals: 3 },
  ],
  graphs: [
    {
      id: 'theta',
      yLabel: 'α',
      unit: '°',
      series: [
        { key: 'theta', color: '--pos' },
        { key: 'small', color: '--ghost', ahead: true },
      ],
    },
    { id: 'v', yLabel: 'υ', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
  ],
  createModel: () => new PendulumModel(),
  // The pivot is at the origin; room for the full swing either side.
  worldBounds: (p) => {
    const r = p.L + 0.25;
    return { xMin: -r, xMax: r, yMin: -p.L - 0.35, yMax: 0.35 };
  },

  draw({ ctx, view, model, params: p, toggles, colors, text }) {
    const m = model ;
    const k = objScale(view);
    const px = view.px(0);
    const py = view.py(0);
    const r = 14 * k * Math.cbrt(p.m);
    drawSky(ctx, view, colors, view.height);

    // Ceiling bracket the string hangs from.
    const bw = 110 * k;
    ctx.fillStyle = colors.ground;
    ctx.fillRect(px - bw / 2, py - 14, bw, 14);
    drawHatch(ctx, px - bw / 2, py - 14, bw, 14, colors.hatch, 0, 7);
    ctx.strokeStyle = colors.hatch;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    ctx.moveTo(px - bw / 2, py);
    ctx.lineTo(px + bw / 2, py);
    ctx.stroke();

    const Lpx = p.L * view.scale;
    const bx = px + Lpx * Math.sin(m.th);
    const by = py + Lpx * Math.cos(m.th);

    // Rest position and the arc the bob moves on.
    ctx.strokeStyle = colors.ghost;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, py + Lpx + r + 4);
    ctx.stroke();
    if (toggles.arc) {
      const a0 = p.theta0 * DEG;
      ctx.beginPath();
      ctx.arc(px, py, Lpx, Math.PI / 2 - a0, Math.PI / 2 + a0);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    // Angle mark, between the vertical and the string: the string points at canvas angle π/2 − α (y is down).
    if (Math.abs(m.th) > 2 * DEG) {
      ctx.strokeStyle = colors.pos;
      ctx.beginPath();
      ctx.arc(px, py, 40 * k, Math.PI / 2, Math.PI / 2 - m.th, m.th > 0);
      ctx.stroke();
      // The value beside the arc, past the string; on the other side of the vertical when the stage has no room there.
      const sg = m.th >= 0 ? 1 : -1, ly = py + 56 * k, past = (56 * k + 11) * Math.tan(Math.min(Math.abs(m.th), 85 * DEG)) + 10;
      ctx.save(); ctx.font = `700 12px ${fonts.mono}`; const lw = ctx.measureText(`α = ${num(m.th / DEG, 1)}°`).width + 16; ctx.restore();
      const off = Math.max(48 * k, past), x0 = sg > 0 ? px + off : px - off - lw;
      const onBob = x0 < bx + r + 4 && x0 + lw > bx - r - 4 && ly - 11 < by + r + 4 && ly + 11 > by - r - 4;
      const fits = !onBob && (sg > 0 ? px + off + lw < view.width - 4 : px - off - lw > 4);
      label(ctx, `α = ${num(m.th / DEG, 1)}°`, px + sg * (fits ? off : -12), ly, colors, (sg > 0) === fits ? 'left' : 'right');
    }

    // String and bob.
    ctx.strokeStyle = colors.body;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(bx, by);
    ctx.stroke();
    drawBall(ctx, bx, by, r, colors);
    ctx.fillStyle = colors.fg;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();

    // Arrow scales are set per run so the largest velocity and acceleration of this swing are
    // about a third of the string: a 5° swing and a 90° swing both read clearly.
    const a0 = p.theta0 * DEG;
    const vMax = Math.sqrt(2 * p.g * p.L * (1 - Math.cos(a0)));
    const aMax = Math.max(p.g * Math.sin(a0), (vMax * vMax) / p.L, 1e-6);
    const vs = (0.35 * Lpx) / Math.max(vMax, 1e-6);
    const as = (0.35 * Lpx) / aMax;
    // Velocity along the tangent.
    const v = p.L * m.om;
    if (toggles.vel && Math.abs(v) > 0.03 * vMax) {
      const tx = Math.cos(m.th);
      const ty = -Math.sin(m.th);
      drawArrow(ctx, bx, by, bx + tx * v * vs, by + ty * v * vs, colors.vel, 'υ');
    }
    // Acceleration: the tangential part g sin α towards the lowest point, the centripetal part
    // υ²/l along the string, and their sum.
    if (toggles.acc) {
      const s = m.sample();
      const tx = Math.cos(m.th);
      const ty = -Math.sin(m.th);
      const nx = -Math.sin(m.th);
      const ny = -Math.cos(m.th);
      const dtx = tx * s.at * as;
      const dty = ty * s.at * as;
      const dnx = nx * s.an * as;
      const dny = ny * s.an * as;
      drawComponents(
        ctx,
        bx,
        by,
        bx + dtx + dnx,
        by + dty + dny,
        [
          { dx: dtx, dy: dty, color: colors.vx, label: 'a_τ' },
          { dx: dnx, dy: dny, color: colors.vy, label: 'a_n' },
        ],
        colors.ghost,
      );
      drawArrow(ctx, bx, by, bx + dtx + dnx, by + dty + dny, colors.acc, 'a');
    }
    if (toggles.forces) {
      const T = m.sample().tension;
      const per = (60 * k) / (p.m * p.g); // px per newton: mg is always 60k px
      drawArrow(ctx, bx, by, bx, by + p.m * p.g * per, colors.fg, 'mg');
      drawArrow(ctx, bx, by, bx - Math.sin(m.th) * T * per, by - Math.cos(m.th) * T * per, colors.force, 'T');
    }

    // Periods: the measured one against the formula.
    const T0 = smallPeriod(p.L, p.g);
    const Tex = exactPeriod(p.L, p.g, p.theta0);
    const lines = [`T_0 = 2π√(l/g) = ${num(T0, 3)} s`, text.draw.exact(num(Tex, 3), p.b > 0)];
    if (Number.isFinite(m.period)) lines.push(text.draw.measured(num(m.period, 3)));
    ctx.font = `500 12px ${fonts.mono}`;
    ctx.fillStyle = colors.muted;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    lines.forEach((t, i) => fillSub(ctx, t, 16, (view.width < 560 ? 60 : 22) + i * 16));

    // Drag cue beside the bob, on the side it swings out to; under the bob when the stage has no room there.
    if (m.t === 0) {
      ctx.save();
      ctx.font = '500 12px Barlow, sans-serif';
      const cue = text.draw.dragBob, w = Math.max(...cue.map((t) => ctx.measureText(t).width)), sg = m.th >= 0 ? 1 : -1;
      ctx.restore();
      const side = sg > 0 ? bx + r + 10 + w < view.width - 4 : bx - r - 10 - w > 4;
      cue.forEach((t, i) => {
        if (side) hint(ctx, t, bx + sg * (r + 10), by + (i - (cue.length - 1) / 2) * 15, colors, sg > 0 ? 'left' : 'right');
        else hint(ctx, t, bx, by + r + 14 + i * 15, colors, 'center');
      });
    }
  },

  drag: {
    hit(x, y, model, p, view) {
      const m = model ;
      if (m.t !== 0) return null;
      const bx = p.L * Math.sin(m.th);
      const by = -p.L * Math.cos(m.th);
      return Math.hypot(view.px(x) - view.px(bx), view.py(y) - view.py(by)) < 30 ? 'bob' : null;
    },
    move(_h, x, y) {
      const a = Math.atan2(Math.abs(x), Math.max(1e-6, -y)) / DEG;
      return { theta0: a };
    },
  },
};

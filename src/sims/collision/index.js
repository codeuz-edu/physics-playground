import { num } from '../../core/format.js';
import { drawArrow, drawFlag, drawGround, drawSky, fillSub, fonts, label, reserve, subText } from '../../ui/canvas.js';
import { drawCart } from '../cart.js';
import { CollisionModel, halfWidth, params, TRACK } from './model.js';

const objScale = (view) => Math.min(1.9, Math.max(0.9, Math.min(view.width / 640, view.height / 170)));
const V_PX = 14; // px per m/s (× objScale)

export default {
  id: 'collision',
  params,
  stageSize: 'strip',
  viewPadding: { left: 16, right: 16, top: 12, bottom: 40 },
  presets: [
    { values: { m1: 2, v1: 3, m2: 2, v2: 0, e: 1 } },
    { values: { m1: 3, v1: 4, m2: 1, v2: -2, e: 0 } },
    { values: { m1: 1, v1: 6, m2: 3, v2: 0, e: 1 } },
    { values: { m1: 5, v1: 3, m2: 1, v2: 1, e: 1 } },
    { values: { m1: 2, v1: 2, m2: 2, v2: -2, e: 0 } },
    { values: { m1: 2, v1: 3, m2: 2, v2: 0, e: 0.5 } },
  ],
  toggles: [
    { key: 'vel', default: true },
    { key: 'p', default: false },
    { key: 'marks', default: true },
  ],
  readouts: [
    { key: 'v1', unit: 'm/s', decimals: 2, color: '--pos' },
    { key: 'v2', unit: 'm/s', decimals: 2, color: '--vel' },
    { key: 'p', unit: 'kg·m/s', decimals: 2 },
    { key: 'ke', unit: 'J', decimals: 2 },
  ],
  graphs: [
    {
      id: 'v',
      yLabel: 'υ',
      unit: 'm/s',
      series: [
        { key: 'v1', color: '--pos' },
        { key: 'v2', color: '--vel' },
      ],
    },
    {
      id: 'pke',
      yLabel: 'p, E',
      unit: '',
      series: [
        { key: 'p', color: '--fg' },
        { key: 'ke', color: '--acc' },
      ],
    },
  ],
  createModel: () => new CollisionModel(),
  worldBounds: () => ({ xMin: -0.3, xMax: TRACK + 0.3, yMin: -0.5, yMax: 2.2 }),

  draw({ ctx, view, model, params: p, toggles, colors, text }) {
    const m = model ;
    const k = objScale(view);
    const gy = Math.round(view.py(0));
    drawSky(ctx, view, colors, gy);
    drawGround(ctx, view, colors, gy);
    // Track ends; each flag flies outwards, off the track, so a cart that reaches the end stops at the pole.
    const sq = k < 1.4 ? 4 : 5, fx0 = Math.round(view.px(0)), fx1 = Math.round(view.px(TRACK));
    drawFlag(ctx, fx1, gy, gy - 34 * k, colors, sq);
    ctx.save();
    ctx.translate(2 * fx0, 0);
    ctx.scale(-1, 1);
    drawFlag(ctx, fx0, gy, gy - 34 * k, colors, sq);
    ctx.restore();
    reserve(ctx, fx0 - 5 * sq - 2, gy - 34 * k - 6, 5 * sq + 4, 3 * sq + 8);
    reserve(ctx, fx1 - 2, gy - 34 * k - 6, 5 * sq + 4, 3 * sq + 8);

    const hpx = 30 * k;
    const cartH = (mass) => hpx * (0.75 + 0.25 * Math.cbrt(mass / 2));
    // Where they met, kept on the track after the impact; its time above both carts and their arrows.
    if (toggles.marks && m.hit) {
      const top = gy - 1.26 * Math.max(cartH(p.m1), cartH(p.m2)) - 16 * k - (toggles.p ? 22 * k : 0) - 22;
      ctx.strokeStyle = colors.ghost;
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.round(view.px(m.impactX)) + 0.5, top);
      ctx.lineTo(Math.round(view.px(m.impactX)) + 0.5, gy);
      ctx.stroke();
      ctx.setLineDash([]);
      label(ctx, text.draw.impact(num(m.tHit, 2)), view.px(m.impactX), top - 11, colors, 'center');
    }

    const carts = [
      [m.x1, p.m1, m.v1, colors.pos, '1'],
      [m.x2, p.m2, m.v2, colors.vel, '2'],
    ];
    for (const [x, mass, v, color, name] of carts) {
      const w = 2 * halfWidth(mass) * view.scale;
      const h = cartH(mass);
      const cx = view.px(x);
      drawCart(ctx, cx, gy, w, h, colors, 0, colors.track, color);
      // Name and mass on the body; on a cart too short for both, the mass alone (its colour and arrow name it).
      ctx.fillStyle = colors.fg;
      ctx.font = `600 ${Math.max(12, 11 * Math.min(k, 1.3))}px ${fonts.body}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const mid = gy - h * 0.26 - h / 2 - 2, whole = `m_${name} = ${num(mass, 1)} kg`;
      fillSub(ctx, subText(ctx, whole).width <= w - 8 ? whole : `${num(mass, 1)} kg`, cx, mid);
      reserve(ctx, cx - w / 2, gy - 1.26 * h, w, 1.26 * h); // the vector names stay off both carts
    }
    for (const [x, mass, v, color, name] of carts) {
      const h = cartH(mass), cx = view.px(x);
      const ay = gy - h - 0.26 * h - 16 * k;
      if (toggles.vel && Math.abs(v) > 0.02) drawArrow(ctx, cx, ay, cx + v * V_PX * k, ay, color, name === '1' ? 'υ_1' : 'υ_2');
      if (toggles.p && Math.abs(v) > 0.02) drawArrow(ctx, cx, ay - 22 * k, cx + (mass * v * V_PX * k) / 3, ay - 22 * k, colors.acc, name === '1' ? 'p_1' : 'p_2', 'part');
    }
    if (m.hit && p.e === 0) label(ctx, text.draw.stuck, view.px((m.x1 + m.x2) / 2), gy + 20, colors, 'center');
  },
};

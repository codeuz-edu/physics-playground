import { num } from '../../core/format.js';
import { drawArrow, drawFlag, drawHatch, fonts, reserve, vectorLabel } from '../../ui/canvas.js';
import { idealCrossing, params, RiverModel } from './model.js';

const DEG = Math.PI / 180;
/** Drawing scale for the boat: grows with the stage, within limits. */
const objScale = (view) => Math.min(1.6, Math.max(1, view.height / 420));
/** Pixels per m/s for the velocity arrows: a fixed share of the river's width on screen. */
// A tenth of the river per m/s keeps the v′ + u triangle big enough to read, even at the default speeds.
const vScale = (view, w) => Math.min(56, Math.max(16, (w * view.scale) / 10));

/**
 * Where the boat is on screen (px). Seen from the water (`fromWater`) the picture moves with the
 * water, so everything shifts back by the drift. draw() and the steering handle both use this.
 */
function boatPx(view, m, fromWater) {
  return [view.px(m.x - (fromWater ? m.drift : 0)), view.py(m.y)];
}

/** Boat seen from above, bow along +x before rotation. */
function drawBoat(ctx, x, y, angle, k, c) {
  const L = 16 * k;
  const W = 6.5 * k;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = c.body;
  ctx.beginPath();
  ctx.moveTo(L, 0);
  ctx.quadraticCurveTo(L * 0.3, -W * 1.1, -L * 0.6, -W);
  ctx.lineTo(-L, -W * 0.75);
  ctx.lineTo(-L, W * 0.75);
  ctx.lineTo(-L * 0.6, W);
  ctx.quadraticCurveTo(L * 0.3, W * 1.1, L, 0);
  ctx.fill();
  // deck and seat
  ctx.fillStyle = c['ball-hi'];
  ctx.beginPath();
  ctx.moveTo(L * 0.72, 0);
  ctx.quadraticCurveTo(L * 0.25, -W * 0.72, -L * 0.82, -W * 0.55);
  ctx.lineTo(-L * 0.82, W * 0.55);
  ctx.quadraticCurveTo(L * 0.25, W * 0.72, L * 0.72, 0);
  ctx.fill();
  ctx.fillStyle = c.body;
  ctx.fillRect(-L * 0.2, -W * 0.6, 3 * k, W * 1.2);
  ctx.restore();
}

/** Screen offset (px) of the tip of the boat's own velocity v′, from the boat. */
function ownVelocity(view, p) {
  const s = vScale(view, p.w);
  const { vb, heading } = p;
  return [-vb * Math.sin(heading * DEG) * s, -vb * Math.cos(heading * DEG) * s];
}

export default {
  id: 'river-boat',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 16, bottom: 16 },
  presets: [
    { values: { w: 60, vb: 3, heading: 0, u: 1.5 } },
    { values: { w: 60, vb: 3, heading: 30, u: 1.5 } },
    { values: { w: 60, vb: 3, heading: 0, u: 0 } },
    { values: { w: 60, vb: 2, heading: 0, u: 4 } },
    { values: { w: 60, vb: 2, heading: 60, u: 4 } },
  ],
  toggles: [
    { key: 'vec', default: true },
    { key: 'frame', default: false },
  ],
  readouts: [
    { key: 'y', unit: 'm', decimals: 1, color: '--pos' },
    { key: 'x', unit: 'm', decimals: 1, color: '--pos' },
    { key: 'speed', unit: 'm/s', decimals: 2, color: '--vel' },
  ],
  graphs: [
    { id: 'y', unit: 'm', series: [{ key: 'y', color: '--pos' }] },
    {
      id: 'x',
      unit: 'm',
      series: [
        { key: 'x', color: '--pos' },
        { key: 'xw', color: '--vy' },
      ],
    },
  ],
  createModel: () => new RiverModel(),
  worldBounds(p) {
    const c = idealCrossing(p);
    // Room for the trip as seen from the shore and from the water.
    const xs = [0, c.downstream, -c.drift, c.downstream - c.drift];
    const margin = Math.max(10, p.w * 0.25);
    return { xMin: Math.min(...xs) - margin, xMax: Math.max(...xs) + margin, yMin: -p.w * 0.22, yMax: p.w * 1.22 };
  },

  draw({ ctx, view, model, params: p, toggles, colors, history, text }) {
    const m = model ;
    const fromWater = !!toggles.frame;
    const shift = fromWater ? m.drift : 0;
    const X = (x) => view.px(x - shift);
    const k = objScale(view);
    const yb = view.py(0);
    const yt = view.py(m.w);

    // Water, with ripples that drift with it (not arrows: on the stage, arrows are vectors).
    ctx.fillStyle = colors.water;
    ctx.fillRect(0, yt, view.width, yb - yt);
    const S = Math.max(6, m.w / 4); // streak spacing along the river (m)
    ctx.strokeStyle = colors['water-line'];
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let row = 0; row < 4; row++) {
      const yy = view.py((m.w * (row + 0.5)) / 4);
      const off = m.drift + (row % 2) * S * 0.5;
      const j0 = Math.floor((view.wx(0) + shift - off) / S) - 1;
      const j1 = Math.ceil((view.wx(view.width) + shift - off) / S) + 1;
      for (let j = j0; j <= j1; j++) {
        const x1 = X(j * S + off);
        const len = Math.min(28, S * view.scale * 0.4);
        ctx.moveTo(x1 - len, yy);
        for (let q = 1; q <= 4; q++) ctx.quadraticCurveTo(x1 - len + (len * (q - 0.5)) / 4, yy + (q % 2 ? -3 : 3), x1 - len + (len * q) / 4, yy);
      }
    }
    ctx.stroke();

    // Banks: hatching on the land side, fixed to the shore.
    const anchor = X(0);
    drawHatch(ctx, 0, yt - 12, view.width, 12, colors.hatch, anchor);
    drawHatch(ctx, 0, yb, view.width, 12, colors.hatch, anchor);
    ctx.strokeStyle = colors.hatch;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    ctx.moveTo(0, yt);
    ctx.lineTo(view.width, yt);
    ctx.moveTo(0, yb);
    ctx.lineTo(view.width, yb);
    ctx.stroke();

    // Jetty at the start, and a flag directly opposite it, labelled clear of the hatching.
    const jx = X(0);
    ctx.fillStyle = colors.track;
    ctx.strokeStyle = colors.body;
    ctx.lineWidth = 1.5;
    ctx.fillRect(jx - 12 * k, yb, 24 * k, 12 * k);
    ctx.strokeRect(jx - 12 * k, yb, 24 * k, 12 * k);
    const flagTop = yt - 6 - 3 * 4;
    drawFlag(ctx, jx, yt, flagTop, colors, 4);
    ctx.font = `500 12px ${fonts.body}`;
    ctx.fillStyle = colors.muted;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(text.draw.start, jx, yb + 16 * k);
    ctx.textBaseline = 'bottom';
    ctx.fillText(text.draw.opposite, jx, flagTop - 8);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Width of the river, as a dimension line on the left.
    const dx = 18;
    ctx.strokeStyle = colors.axis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dx + 0.5, yb);
    ctx.lineTo(dx + 0.5, yt);
    ctx.moveTo(dx - 4, yb + 0.5);
    ctx.lineTo(dx + 5, yb + 0.5);
    ctx.moveTo(dx - 4, yt + 0.5);
    ctx.lineTo(dx + 5, yt + 0.5);
    ctx.stroke();
    ctx.fillStyle = colors.muted;
    ctx.fillText(`d = ${num(m.w, 0)} m`, dx + 8, (yb + yt) / 2);

    // A float dropped in near the start: it moves with the water, so from the water it stays put.
    const fx = X(m.w * 0.2 + m.drift);
    const fy = view.py(m.w * 0.15);
    ctx.fillStyle = colors.surface;
    ctx.strokeStyle = colors.current;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(fx, fy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Named on its right, or on its left once it has drifted near the right edge; marked as taken, so the
    // names of the vectors keep off it.
    ctx.fillStyle = colors.muted;
    const fw = ctx.measureText(text.draw.float).width, fl = fx + 9 + fw > view.width - 4 ? fx - 9 - fw : fx + 9;
    ctx.fillText(text.draw.float, fl, fy - 1);
    reserve(ctx, fl, fy - 8, fw, 14);

    // The boat's track, as seen in the chosen frame.
    if (history.length > 1) {
      const xs = fromWater ? history.series.xw : history.series.x;
      const ys = history.series.y;
      ctx.strokeStyle = colors.pos;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(view.px(xs[0]), view.py(ys[0]));
      for (let i = 1; i < xs.length; i++) ctx.lineTo(view.px(xs[i]), view.py(ys[i]));
      ctx.stroke();
    }

    // Boat: points where it steers (its heading), even when it moves another way.
    const [bx, by] = boatPx(view, m, fromWater);
    const th = p.heading * DEG;
    drawBoat(ctx, bx, by, Math.atan2(-Math.cos(th), -Math.sin(th)), k, colors);

    const [ox, oy] = ownVelocity(view, p);
    if (toggles.vec && !m.arrived) {
      const s = vScale(view, p.w);
      if (fromWater) {
        // From the water only the boat's own velocity counts; the shore moves at −u.
        drawArrow(ctx, bx, by, bx + ox, by + oy, colors.vy, 'υ′');
        drawArrow(ctx, jx, yb + 26 * k, jx - p.u * s, yb + 26 * k, colors.current, '−u');
      } else {
        // Head to tail: v′ then u; their sum v is where the boat actually goes.
        // u is labelled under its middle: its tip is shared with v.
        drawArrow(ctx, bx + ox, by + oy, bx + ox + p.u * s, by + oy, colors.current);
        if (p.u > 0) {
          const ux = bx + ox + (p.u * s) / 2, uy = by + oy + 13;
          vectorLabel(ctx, 'u', ux, uy, colors.current, 'center', 'middle', [[ux + 14, uy], [ux, by + oy - 13]]);
        }
        drawArrow(ctx, bx, by, bx + ox, by + oy, colors.vy, 'υ′');
        drawArrow(ctx, bx, by, bx + ox + p.u * s, by + oy, colors.vel, 'υ');
      }
    }

    // Steering handle at the tip of v′.
    if (!m.arrived) {
      ctx.globalAlpha = m.t === 0 ? 1 : 0.6;
      ctx.fillStyle = colors.surface;
      ctx.strokeStyle = colors.vy;
      ctx.lineWidth = 1.75;
      ctx.beginPath();
      ctx.arc(bx + ox, by + oy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.globalAlpha = 1;
      if (m.t === 0) {
        ctx.fillStyle = colors.muted;
        ctx.font = `500 12px ${fonts.body}`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        // Below the handle's height: the υ′ label sits just above it.
        ctx.fillText(text.draw.cue, bx + ox - 14, by + oy + 14);
      }
    }
  },

  drag: {
    // The handle is worked out from the model, not from the last picture, so it holds even when
    // nothing has been drawn since. It carries the model, so a drag keeps up with a moving boat.
    hit(x, y, model, p, view, toggles) {
      const m = model ;
      if (m.arrived) return null;
      const [ox, oy] = ownVelocity(view, p);
      // Which frame the picture is in. If the shell does not pass the toggles, try both: they
      // coincide until the water has moved.
      const frames = toggles ? [!!toggles.frame] : [false, true];
      let handle = null;
      let best = 22;
      for (const fromWater of frames) {
        const [bx, by] = boatPx(view, m, fromWater);
        const d = Math.hypot(view.px(x) - (bx + ox), view.py(y) - (by + oy));
        if (d < best) {
          best = d;
          handle = { kind: 'steer', model: m, fromWater };
        }
      }
      return handle;
    },
    move(h, x, y, p, view) {
      if (!h || !h.model) return {};
      const [bx, by] = boatPx(view, h.model, h.fromWater);
      const dx = view.px(x) - bx;
      const up = by - view.py(y);
      return { heading: Math.atan2(-dx, up) / DEG, vb: Math.hypot(dx, up) / vScale(view, p.w) };
    },
  },
};

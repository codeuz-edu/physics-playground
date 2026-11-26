import { drawArrow, drawGround, drawHatch, drawSky, fonts, label, reserve, vectorLabel } from '../../ui/canvas.js';
import { num } from '../../core/format.js';
import { G } from '../friction.js';
import { InclineModel, params, RUN, SLOPE, START } from './model.js';

const DEG = Math.PI / 180;
/** Drawing scale for the block and arrows: grows with the stage, within limits. */
const objScale = (view) => Math.min(1.4, Math.max(0.9, view.height / 380));

/** Top of the slope in world coordinates; the bottom corner stays at (SLOPE, 0). */
const topOf = (angle) => [SLOPE - SLOPE * Math.cos(angle * DEG), SLOPE * Math.sin(angle * DEG)];

export default {
  id: 'incline',
  params,
  stageSize: 'tall',
  // The view fits every angle up to 60°, so tilting never moves the picture.
  viewPadding: { left: 16, right: 16, top: 48, bottom: 24 },
  presets: [
    { values: { angle: 30, m: 5, mus: 0.4, muk: 0.3 } },
    { values: { angle: 15, m: 5, mus: 0.4, muk: 0.3 } },
    { values: { angle: 10, m: 5, mus: 0.5, muk: 0.4 } },
    { values: { angle: 30, m: 5, mus: 0, muk: 0 } },
    { values: { angle: 30, m: 15, mus: 0.4, muk: 0.3 } },
  ],
  toggles: [
    { key: 'forces', default: true },
    { key: 'comp', default: true },
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
        { key: 'along', color: '--fg' },
        { key: 'f', color: '--friction' },
        { key: 'net', color: '--acc' },
      ],
    },
    { id: 'v', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
  ],
  createModel: () => new InclineModel(),
  // Sliding friction is never above the static limit: a μₛ set above μₜ is brought down to it,
  // and the slider shows the value the run really uses.
  restartValues: (p) => ({ muk: Math.min(p.muk, p.mus) }),
  // Fits every angle up to 60°, with room under the ground for the weight arrow near the bottom.
  // Framed for the current tilt (at least 30°), so the slope fills the stage instead of leaving room for 60°.
  worldBounds: (p) => ({ xMin: -0.4, xMax: SLOPE + 0.9, yMin: -2, yMax: SLOPE * Math.sin(Math.max(30, p.angle) * DEG) + 1.1 }),
  // Room above the slope for the caption at the top left, so the arrow N does not run into it on a phone.
  stageExtra: 40,

  draw({ ctx, view, model, params: p, toggles, colors, text }) {
    const m = model ;
    const k = objScale(view);
    const th = p.angle * DEG;
    const gy = view.py(0);
    const [tx, ty] = topOf(p.angle);
    const Tx = view.px(tx);
    const Ty = view.py(ty);
    const Bx = view.px(SLOPE);

    drawSky(ctx, view, colors, gy);
    drawGround(ctx, view, colors, gy);

    // The wedge, hatched like the ground it stands on.
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(Tx, gy);
    ctx.lineTo(Tx, Ty);
    ctx.lineTo(Bx, gy);
    ctx.closePath();
    ctx.fillStyle = colors.ground;
    ctx.fill();
    ctx.clip();
    drawHatch(ctx, Tx, Ty, Bx - Tx, gy - Ty, colors.hatch, 0, 9);
    ctx.restore();
    ctx.strokeStyle = colors.hatch;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(Tx, gy);
    ctx.lineTo(Tx, Ty);
    ctx.lineTo(Bx, gy);
    ctx.stroke();

    // Why it holds or slides, top left (below the time display when the stage is too narrow for both on one
    // line). Drawn before the arrows, so their names keep off it.
    const tan = num(Math.tan(th), 2);
    const why = m.v > 0 ? text.draw.sliding(num(Math.min(p.muk, p.mus), 2)) : m.sliding ? text.draw.slips(tan, num(p.mus, 2)) : text.draw.holds(tan, num(p.mus, 2));
    label(ctx, why, 16, view.width < 560 ? 60 : 22, colors, 'left');
    // Names of the forces keep off the slope surface and the ground line.
    const slopeLen = Math.hypot(Bx - Tx, gy - Ty);
    for (let q = 0; q <= slopeLen; q += 8) reserve(ctx, Tx + ((Bx - Tx) * q) / slopeLen - 5, Ty + ((gy - Ty) * q) / slopeLen - 5, 10, 10);
    reserve(ctx, 0, gy - 3, view.width, 16);

    // Angle at the bottom corner.
    if (p.angle > 0) {
      // Its name inside the arc, where the wedge is tall enough for it: on a shallow slope the arc is drawn wider.
      // (Below about 4° there is no room for it: the value is in the badge.)
      const dl = Math.max(40 * k * 0.62, 10 / Math.sin(th / 2)), named = dl + 12 < 0.6 * slopeLen, rr = named ? Math.max(40 * k, dl + 12) : 40 * k;
      ctx.strokeStyle = colors.muted;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(Bx, gy, rr, Math.PI, Math.PI + th);
      ctx.stroke();
      if (named) vectorLabel(ctx, 'α', Bx - Math.cos(th / 2) * dl, gy - Math.sin(th / 2) * dl, colors.muted);
      // Its value outside the wedge, where the block never passes.
      label(ctx, `α = ${num(p.angle, 0)}°`, Tx - 10, gy - 14, colors, 'right'); // left of the wedge: the block now slides all the way to the right-hand corner
    }

    // Block, sitting on the slope surface. It slides the model's RUN metres, and that run is drawn to end
    // exactly at the foot of the slope: the block's front edge meets the ground when the run is over.
    const W = 36 * k;
    const H = 24 * k;
    const d = (SLOPE - RUN + m.s) * view.scale - W / 2; // px from the top to the block's centre, along the slope
    const ux = Math.cos(th); // down the slope, on screen
    const uy = Math.sin(th);
    const nx = Math.sin(th); // out of the surface, on screen
    const ny = -Math.cos(th);
    const cx = Tx + ux * d + (nx * H) / 2;
    const cy = Ty + uy * d + (ny * H) / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(th);
    ctx.fillStyle = colors.track;
    ctx.strokeStyle = colors.body;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(-W / 2, -H / 2, W, H);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Forces drawn to scale: the weight is always the same length, the rest in proportion.
    const L = Math.min(2.4 * 36 * k, 0.24 * view.height); // mg is 2.4 block-widths long
    const per = L / (p.m * G); // px per newton
    // The resultant lies along mg sin α, and is shorter: its name goes first, beside its tip on the open side
    // of the slope (just past the block's top face), so the other names keep off it.
    const net = m.along + m.f, showNet = toggles.net && Math.abs(net) > 0.05;
    const sx = cx + ux * net * per, sy = cy + uy * net * per, off = H / 2 + 10;
    if (showNet) vectorLabel(ctx, 'ΣF', sx + nx * off, sy + ny * off, colors.acc, 'center', 'middle', [[sx + nx * off + ux * 14, sy + ny * off + uy * 14], [sx + nx * (off + 14), sy + ny * (off + 14)]]);
    // Weight resolved along and into the slope, with the dashed construction lines from the
    // tip of mg that close the rectangle, as the textbook figure draws a projection.
    if (toggles.comp) {
      const ax = cx + ux * m.along * per;
      const ay = cy + uy * m.along * per;
      const px = cx - nx * m.N * per;
      const py = cy - ny * m.N * per;
      ctx.save();
      ctx.strokeStyle = colors.ghost;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy + L);
      ctx.lineTo(ax, ay);
      ctx.moveTo(cx, cy + L);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.restore();
      // Named just right of its tip (it points down the slope), above or below it, off the slope and the ground line.
      drawArrow(ctx, cx, cy, ax, ay, colors.muted, '', 'part');
      vectorLabel(ctx, 'mg sin α', ax + 8, ay - 12, colors.muted, 'left', 'middle', [[ax + 30, ay - 14], [ax + 8, ay + 12], [ax + 8, ay + 26], [ax + 8, ay - 26], [ax + 8, ay + 40], [ax + 8, ay - 40]]);
      drawArrow(ctx, cx, cy, px, py, colors.muted, 'mg cos α', 'part');
    }
    // Every force starts at the centre of the block, as in a textbook free-body diagram
    // (the block is treated as a point): weight down, the support reaction out of the
    // surface, friction up the slope.
    if (toggles.forces) {
      drawArrow(ctx, cx, cy, cx, cy + L, colors.fg, 'mg');
      drawArrow(ctx, cx, cy, cx + nx * m.N * per, cy + ny * m.N * per, colors.force, 'N');
      if (m.f < 0) drawArrow(ctx, cx, cy, cx + ux * m.f * per, cy + uy * m.f * per, colors.friction, text.draw.friction);
    }
    ctx.fillStyle = colors.fg;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    // The resultant starts at the centre too, like every force on a point mass; it is drawn
    // last so it lies on top of the components it is the sum of (its name is placed above).
    if (showNet) drawArrow(ctx, cx, cy, sx, sy, colors.acc);

    // Handle at the top of the slope: drag it to tilt.
    ctx.fillStyle = colors.surface;
    ctx.strokeStyle = colors.fg;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    ctx.arc(Tx, Ty, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (m.t === 0) {
      const cue = text.draw.cue;
      ctx.fillStyle = colors.muted;
      ctx.font = `500 12px ${fonts.body}`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      // In the open sky left of the handle, clear of the force arrows above the block;
      // wrapped onto more lines when the stage is too narrow for one. On a shallow slope the handle is
      // near the left edge: then above it, from the left edge.
      const widest = Math.max(...cue.split(' ').map((word) => ctx.measureText(word).width));
      const beside = widest <= Tx - 22;
      const room = beside ? Math.max(40, Tx - 22) : Math.max(widest, Tx + 60);
      const lines = [];
      for (const word of cue.split(' ')) {
        const last = lines.length - 1;
        if (last >= 0 && ctx.measureText(`${lines[last]} ${word}`).width <= room) lines[last] += ` ${word}`;
        else lines.push(word);
      }
      // Never higher than just under the friction tag (top left) on a steep slope.
      const top = Math.max(Ty, (view.width < 560 ? 60 : 22) + 24);
      if (beside) lines.forEach((line, i) => ctx.fillText(line, Tx - 14, top + i * 14));
      else {
        ctx.textAlign = 'left';
        lines.forEach((line, i) => ctx.fillText(line, 8, Ty - 18 - (lines.length - 1 - i) * 14));
      }
    }
  },

  drag: {
    hit(x, y, _m, p, view) {
      const [tx, ty] = topOf(p.angle);
      return Math.hypot(view.px(x) - view.px(tx), view.py(y) - view.py(ty)) < 20 ? 'top' : null;
    },
    move(_h, x, y) {
      return { angle: Math.atan2(Math.max(0, y), SLOPE - x) / DEG };
    },
  },
};

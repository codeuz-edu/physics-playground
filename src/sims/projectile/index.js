import { num } from '../../core/format.js';
import { drawArrow, drawComponents, drawBall, drawGrid, drawGround, drawHatch, drawShadow, drawSky, fonts, label, reserve, vectorLabel } from '../../ui/canvas.js';
import { ideal, params, ProjectileModel } from './model.js';

const DEG = Math.PI / 180;

/** Drawing scale for objects (cannon, ball): grows with the stage, within limits. */
const objScale = (view) => Math.min(1.8, Math.max(1, 1.25 * Math.min(view.height / 440, view.width / 720)));
/** Pixels per m/s for velocity arrows; shrinks on narrow screens. */
const vScale = (view) => Math.min(6, Math.max(2.2, view.width / 160));
/**
 * Radius of the drawn ball, pixels. The model's point is the ball's centre, and y = 0 is the height of
 * that centre when the ball rests on the ground. So everything of the model (path, ball, grid, cannon
 * pivot) is drawn one radius above the ground line: the path runs through the ball's centre all the way,
 * and the ball touches the ground at the very moment the model lands.
 */
const ballRadius = (view) => 7.5 * objScale(view);
/** Barrel length in pixels; the aim arrow starts at the muzzle. */
const barrelLen = (view) => 36 * objScale(view);

function muzzle(view, p) {
  const a = p.angle * DEG;
  const L = barrelLen(view);
  return [view.px(0) + Math.cos(a) * L, view.py(p.h0) - Math.sin(a) * L];
}
function aimTip(view, p) {
  const a = p.angle * DEG;
  const [mx, my] = muzzle(view, p);
  const s = vScale(view);
  return [mx + Math.cos(a) * p.v0 * s, my - Math.sin(a) * p.v0 * s];
}

/**
 * Mortar-style cannon drawn flat, as a figure: a tapered barrel with two bands and a
 * muzzle ring in solid grey with dark outlines, pivoting inside a dome that sits on the
 * ground. The pivot (x, y) is exactly the launch point used by the physics; the ground (or platform)
 * is `foot` pixels below it, and the dome stands there, a little larger so it still covers the breech.
 */
function drawCannon(ctx, x, y, angle, k, c, foot = 0) {
  const L = 36 * k;
  const rB = 8.5 * k;
  const rM = 6.2 * k;
  const r = (t) => rB + (rM - rB) * t;

  ctx.save();
  // Nothing of the barrel may show below the ground (or platform) it stands on.
  const base = y + foot;
  ctx.beginPath();
  ctx.rect(x - 200 * k, base - 200 * k, 400 * k, 200 * k);
  ctx.clip();
  ctx.translate(x, y);
  ctx.rotate(-angle);
  ctx.lineJoin = 'miter';
  // barrel body
  ctx.fillStyle = c.iron;
  ctx.strokeStyle = c['iron-dark'];
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-4 * k, -rB);
  ctx.lineTo(L - 4 * k, -rM);
  ctx.lineTo(L - 4 * k, rM);
  ctx.lineTo(-4 * k, rB);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // reinforcing bands
  ctx.fillStyle = c['iron-dark'];
  for (const t of [0.34, 0.66]) {
    const rr = r(t) + 1.3 * k;
    ctx.fillRect(t * L - 1.6 * k, -rr, 3.2 * k, rr * 2);
  }
  // muzzle ring and bore
  const rm = rM + 1.8 * k;
  ctx.fillStyle = c.iron;
  ctx.fillRect(L - 5 * k, -rm, 5 * k, rm * 2);
  ctx.strokeRect(L - 5 * k, -rm, 5 * k, rm * 2);
  ctx.fillStyle = c['iron-dark'];
  ctx.fillRect(L - 2 * k, -rM * 0.72, 2 * k, rM * 1.44);
  ctx.restore();

  // dome mount (covers the breech)
  const R = 13 * k + 0.6 * foot;
  ctx.fillStyle = c.iron;
  ctx.strokeStyle = c['iron-dark'];
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, base, R, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // base plate
  ctx.fillStyle = c['iron-dark'];
  ctx.fillRect(x - R - 5 * k, base - 3 * k, (R + 5 * k) * 2, 3 * k);
  // pivot bolt, on the pivot
  ctx.fillStyle = c['iron-hi'];
  ctx.beginPath();
  ctx.arc(x, y, 2.4 * k, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = c['iron-dark'];
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

/** Full path for the current settings (with drag), cached so it is only solved when inputs change. */
let previewKey = '';
let previewPath = { xs: [], ys: [] };
function predictedPath(p) {
  const key = `${p.v0}|${p.angle}|${p.h0}|${p.g}|${p.k}`;
  if (key === previewKey) return previewPath;
  const m = new ProjectileModel();
  m.reset(p);
  const xs = [m.x];
  const ys = [m.y];
  let n = 0;
  while (m.step(1 / 120, p) && n++ < 20000) {
    if (n % 2 === 0) {
      xs.push(m.x);
      ys.push(m.y);
    }
  }
  xs.push(m.x);
  ys.push(m.y);
  previewKey = key;
  previewPath = { xs, ys };
  return previewPath;
}

/** The whole picture; `view` is already shifted up by `lift` (see ballRadius and draw). */
function drawScene({ ctx, view, model, params: p, toggles, colors, history, previous, text }, lift) {
  const m = model;
  const gy = view.py(0) + lift; // the ground surface: one ball radius below the model's y = 0
  const k = objScale(view);

  // Scene: white plate, hatched ground, rulers (grid lines only if switched on).
  drawSky(ctx, view, colors, gy);
  drawGround(ctx, view, colors, gy);
  drawGrid(ctx, view, { grid: colors.grid, axis: colors.axis, label: colors.muted }, { xLabel: 'x (m)', yLabel: 'y (m)', clipBelow: gy, lines: !!toggles.grid });
  reserve(ctx, view.width - 52, Math.min(view.height - view.padding.bottom + 8, gy + 18), 44, 14); // the axis name "x (m)": vector names keep off it

  const path = (xs, ys, color, width, dash = []) => {
    if (!xs || xs.length < 2) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(view.px(xs[0]), view.py(ys[0]));
    for (let i = 1; i < xs.length; i++) ctx.lineTo(view.px(xs[i]), view.py(ys[i]));
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const atStart = m.t === 0;

  // Before launch: a faint preview of where this shot will go (drag included).
  if (atStart) {
    const pv = predictedPath(p);
    ctx.globalAlpha = 0.45;
    path(pv.xs, pv.ys, colors.pos, 2, [1, 7]);
    ctx.globalAlpha = 1;
    const n = pv.xs.length - 1;
    if (n > 0 && pv.xs[n] > 0.3) {
      const lx2 = view.px(pv.xs[n]);
      ctx.strokeStyle = colors.pos;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lx2 - 5, gy - 5);
      ctx.lineTo(lx2 + 5, gy + 5);
      ctx.moveTo(lx2 + 5, gy - 5);
      ctx.lineTo(lx2 - 5, gy + 5);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  // Earlier shots, faded, with a small landing tick
  if (toggles.prev) {
    previous.forEach((h, i) => {
      ctx.globalAlpha = 0.6 - i * 0.17;
      path(h.series.x, h.series.y, colors.ghost, 2, [6, 5]);
      const n = h.length - 1;
      if (n > 0) {
        const lx2 = view.px(h.series.x[n]);
        ctx.strokeStyle = colors.ghost;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(lx2, gy - 6);
        ctx.lineTo(lx2, gy);
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;
  }

  // Current path
  if (history.length > 1) {
    const xs = history.series.x;
    const ys = history.series.y;
    path(xs, ys, colors.pos, 2.6);

    // Highest point marker once the ball is past it
    let iMax = 0;
    for (let i = 1; i < ys.length; i++) if (ys[i] > ys[iMax]) iMax = i;
    if (iMax < ys.length - 2 && ys[iMax] > p.h0 + 0.05) {
      const ax = view.px(xs[iMax]);
      const ay = view.py(ys[iMax]);
      ctx.fillStyle = colors.surface;
      ctx.strokeStyle = colors.pos;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ax, ay, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Centred over the marker, but kept inside the stage when the peak is near the left edge.
      const top = text.draw.highest(num(ys[iMax], 1));
      ctx.font = `600 12px ${fonts.mono}`;
      const half = ctx.measureText(top).width / 2 + 6;
      let lx0 = Math.min(Math.max(ax, half + 4), view.width - half - 4);
      // After landing the faded aim handle shows again: the badge moves right of it rather than lie on it.
      if (m.landed) {
        const [hx, hy] = aimTip(view, p);
        if (Math.abs(hy - (ay - 16)) < 22 && Math.abs(hx - lx0) < half + 12) lx0 = Math.min(hx + 12 + half, view.width - half - 4);
      }
      label(ctx, top, lx0, ay - 16, colors, 'center');
    }
  }

  // Launch platform for h0 > 0: a solid block drawn like a cliff in a textbook figure
  const lx = view.px(0);
  const ly = view.py(p.h0);
  if (p.h0 > 0) {
    const left = lx - 34 * k;
    const w = 56 * k;
    ctx.fillStyle = colors.ground;
    const top = ly + lift; // its surface, like the ground's, is one ball radius below the launch point
    ctx.fillRect(left, top, w, gy - top);
    drawHatch(ctx, left, top, w, gy - top, colors.hatch, 0, 9);
    ctx.strokeStyle = colors.hatch;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(left, top, w, gy - top);
  }

  // Ball (inside the barrel until launch) with ground shadow. Its centre is the model's point, so the path
  // runs through it, and it meets the ground line exactly when the model lands.
  const bx = view.px(m.x);
  const by = view.py(m.y);
  if (!atStart) drawShadow(ctx, bx, gy, gy - by, 18 * k, colors);

  drawCannon(ctx, lx, ly, p.angle * DEG, k, colors, lift);
  if (!atStart) drawBall(ctx, bx, by, 7.5 * k, colors);

  // Aim arrow from the muzzle + round handle: hidden in flight, faded after landing.
  const [mx, my] = muzzle(view, p);
  const [tipX, tipY] = aimTip(view, p);
  if (atStart || m.landed) {
    ctx.globalAlpha = atStart ? 1 : 0.45;
    drawArrow(ctx, mx, my, tipX, tipY, colors.vel);
    ctx.fillStyle = colors.surface;
    ctx.strokeStyle = colors.vel;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = colors.vel;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  if (atStart) {
    // υ₀ on the clear side of the handle (the path heads up and right)
    vectorLabel(ctx, 'υ₀', tipX + 14, tipY + 12, colors.vel, 'left');
    // angle arc
    if (p.angle > 0 && p.v0 > 0) {
      const a = p.angle * DEG;
      const rr = 20 * k + 26;
      ctx.strokeStyle = colors.muted;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(lx, ly, rr, -a, 0);
      ctx.stroke();
      ctx.fillStyle = colors.fg;
      ctx.font = `600 12px ${fonts.body}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${num(p.angle, 0)}°`, lx + rr + 6, ly - Math.max(9, Math.sin(a / 2) * rr));
    }
    // cue for the drag handle
    ctx.fillStyle = colors.muted;
    ctx.font = `500 12px ${fonts.body}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    // Above-left of the handle: the path heads up and to the right, so this space is clear.
    // The clamp keeps the whole cue on the stage when the handle is near the left edge.
    ctx.textAlign = 'right';
    const cue = text.draw.cue;
    ctx.fillText(cue, Math.max(ctx.measureText(cue).width + 8, tipX - 14), tipY - 16);
  }

  // Velocity vectors on the ball. Near the ground, a fast fall is drawn shorter, so the tip stays on the stage.
  const s = m.vy < 0 ? Math.min(vScale(view), (view.height - 20 - by) / -m.vy) : vScale(view);
  if (!atStart && !m.landed) {
    if (toggles.comp) {
      drawComponents(
        ctx,
        bx,
        by,
        bx + m.vx * s,
        by - m.vy * s,
        [
          { dx: m.vx * s, dy: 0, color: colors.vx, label: 'υₓ' },
          { dx: 0, dy: -m.vy * s, color: colors.vy, label: 'υᵧ' },
        ],
        colors.ghost,
      );
    }
    if (toggles.vel) drawArrow(ctx, bx, by, bx + m.vx * s, by - m.vy * s, colors.vel, 'υ');
  }

  // Landing: where it came down, nothing more. Beside the ball on the open ground ahead of it (the path
  // comes down from the left); above the ball, clear of it, when the ball lands near the right edge.
  if (m.landed) {
    const t = `${num(m.x, 1)} m`, rb = 7.5 * k;
    ctx.font = `700 12px ${fonts.mono}`;
    const w = ctx.measureText(t).width + 16;
    if (bx + rb + 8 + w < view.width - 4) label(ctx, t, bx + rb + 8, Math.min(by, gy - 14), colors, 'left');
    else label(ctx, t, bx, by - rb - 18, colors, 'center');
  }
}

export default {
  id: 'projectile',
  params,
  stageSize: 'tall',
  alignX: 'left',
  // draw() renders the earlier shots passed in `previous` (the `prev` toggle).
  showsPrevious: true,
  // Top padding keeps the time display clear of the highest point.
  viewPadding: { left: 48, right: 20, top: 58, bottom: 44 },
  presets: [
    { values: { v0: 18, angle: 45, h0: 0, g: 9.81, k: 0 } },
    { values: { v0: 20, angle: 30, h0: 0, g: 9.81, k: 0 } },
    { values: { v0: 20, angle: 60, h0: 0, g: 9.81, k: 0 } },
    { values: { v0: 10, angle: 0, h0: 20, g: 9.81, k: 0 } },
    { values: { v0: 12, angle: 65, h0: 15, g: 9.81, k: 0 } },
    { values: { v0: 18, angle: 45, h0: 0, g: 1.62, k: 0 } },
    { values: { v0: 18, angle: 45, h0: 0, g: 3.71, k: 0 } },
    { values: { v0: 35, angle: 45, h0: 0, g: 9.81, k: 0.01 } },
  ],
  toggles: [
    { key: 'vel', default: true },
    { key: 'comp', default: false },
    { key: 'prev', default: true },
    { key: 'grid', default: false },
  ],
  readouts: [
    { key: 'x', unit: 'm', decimals: 2, color: '--pos' },
    { key: 'y', unit: 'm', decimals: 2, color: '--pos' },
    { key: 'speed', unit: 'm/s', decimals: 2, color: '--vel' },
  ],
  graphs: [
    { id: 'y', unit: 'm', series: [{ key: 'y', color: '--pos' }] },
    {
      id: 'v',
      unit: 'm/s',
      series: [
        { key: 'vx', color: '--vx' },
        { key: 'vy', color: '--vy' },
      ],
    },
  ],
  createModel: () => new ProjectileModel(),
  worldBounds(p) {
    const id = ideal(p.v0, p.angle, p.h0, p.g);
    const xMax = Math.max(id.range * 1.06, 12);
    const yMax = Math.max(id.maxHeight * 1.12, 6);
    const ground = Math.max(0.6, 0.04 * Math.max(xMax, yMax));
    return { xMin: -Math.max(2.5, xMax * 0.06), xMax, yMin: -ground, yMax };
  },

  draw(args) {
    // See ballRadius: the scene is drawn with the model one ball radius above the ground line.
    const { view } = args, lift = ballRadius(view);
    view.oy -= lift;
    try { drawScene(args, lift); } finally { view.oy += lift; }
  },

  drag: {
    hit(x, y, model, p, view) {
      const m = model ;
      if (m.t > 0 && !m.landed) return null; // the handle is hidden during the flight
      // The handle is drawn one ball radius above where the unshifted view puts it (see ballRadius).
      const [tx, ty] = aimTip(view, p);
      return Math.hypot(view.px(x) - tx, view.py(y) - (ty - ballRadius(view))) < 24 ? 'aim' : null;
    },
    move(_h, x, y, p, view) {
      const dx = Math.max(0, view.px(x) - view.px(0));
      const dy = Math.max(0, view.py(p.h0) - ballRadius(view) - view.py(y));
      const angle = Math.atan2(dy, dx) / DEG;
      const len = Math.hypot(dx, dy) - barrelLen(view);
      return { angle, v0: Math.max(0, len) / vScale(view) };
    },
  },
};

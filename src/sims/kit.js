// Shared pieces for the dynamics and statics figures: one motion step, one set of drawn parts
// (supports, ropes, pulleys, boxes, weights), all on the line weights in ui/canvas.js.
import { drawHatch, ink, reserve, subText } from '../ui/canvas.js';

export const DEG = Math.PI / 180;

/** g as every new sim declares it; the shell shows it as a planet menu. */
export const gParam = { key: 'g', symbol: 'g', unit: 'm/s²', min: 0.5, max: 25, step: 0.01, default: 9.81, kind: 'initial', decimals: 2 };

/**
 * One step of motion with constant acceleration along a line, stopping exactly at `end`
 * (distance measured from the start, motion in the + direction). Returns the new state and the
 * time actually used, so the run ends on the very instant the body arrives.
 */
export function advance(s, v, a, dt, end) {
  const s1 = s + v * dt + 0.5 * a * dt * dt;
  if (s1 < end) return { s: s1, v: v + a * dt, tau: dt, hit: false };
  const d = end - s;
  let tau = dt;
  if (Math.abs(a) < 1e-12) tau = v > 0 ? d / v : dt;
  else tau = (-v + Math.sqrt(Math.max(0, v * v + 2 * a * d))) / a;
  tau = Math.min(dt, Math.max(0, tau));
  return { s: end, v: v + a * tau, tau, hit: true };
}

/** Fixed support (ceiling or wall) drawn as in a textbook: a line with hatching on the solid side. */
export function support(ctx, x0, x1, y, c, side = 'up') {
  const h = 8;
  drawHatch(ctx, x0, side === 'up' ? y - h : y, x1 - x0, h, c.hatch, 0, 7);
  ctx.save();
  ctx.strokeStyle = c.fg;
  ctx.lineWidth = ink.scenery;
  ctx.beginPath();
  ctx.moveTo(x0, Math.round(y) + 0.5);
  ctx.lineTo(x1, Math.round(y) + 0.5);
  ctx.stroke();
  ctx.restore();
}

/** Rope through a list of points. */
export function rope(ctx, pts, c, color) {
  ctx.save();
  ctx.strokeStyle = color || c.fg;
  ctx.lineWidth = 1.25;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
  ctx.restore();
}

/** Pulley wheel with its groove and axle; `turn` (radians) spins the spokes so motion reads. */
export function pulley(ctx, x, y, r, c, turn = 0) {
  ctx.save();
  ctx.fillStyle = c.surface;
  ctx.strokeStyle = c.fg;
  ctx.lineWidth = ink.object;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.strokeStyle = c.muted;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(2, r - 3), 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const a = turn + (i * Math.PI * 2) / 3;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * (r - 3), y + Math.sin(a) * (r - 3));
  }
  ctx.stroke();
  ctx.fillStyle = c.fg;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(1.5, r * 0.16), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Solid body as a framed box with its name inside (x, y = top-left, pixels). */
export function box(ctx, x, y, w, h, c, text, fill) {
  ctx.save();
  ctx.fillStyle = fill || c.track;
  ctx.strokeStyle = c.fg;
  ctx.lineWidth = ink.object;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x + 0.75, y + 0.75, w - 1.5, h - 1.5);
  reserve(ctx, x, y, w, h); // the name of a vector is not put on the body
  if (text && w > 26 && h > 14) {
    ctx.fillStyle = c.fg;
    ctx.font = `600 ${Math.min(13, Math.max(11, h * 0.42))}px Barlow, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2 + 0.5);
  }
  ctx.restore();
}

/** Hanging weight: a ring to tie the rope to, then the body. `top` is where the rope ends. */
export function weight(ctx, cx, top, w, h, c, text) {
  ctx.save();
  ctx.strokeStyle = c.fg;
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.arc(cx, top + 3, 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  box(ctx, cx - w / 2, top + 6, w, h, c, text, c.iron === undefined ? c.track : c.track);
}

/** Dimension line with end ticks and its value beside the middle, on the upper side of the line. */
export function dim(ctx, x0, y0, x1, y1, text, c) {
  const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a) * 4, ny = Math.cos(a) * 4, up = ny > 0 ? -1 : 1;
  ctx.save();
  ctx.strokeStyle = c.muted;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
  ctx.moveTo(x0 - nx, y0 - ny); ctx.lineTo(x0 + nx, y0 + ny);
  ctx.moveTo(x1 - nx, y1 - ny); ctx.lineTo(x1 + nx, y1 + ny);
  ctx.stroke();
  ctx.fillStyle = c.muted;
  ctx.font = '500 12px Barlow, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  const line = subText(ctx, text), tw = line.width, tx = (x0 + x1) / 2 + up * nx * 2, ty = (y0 + y1) / 2 + up * ny * 2 - 2;
  reserve(ctx, tx - tw / 2, ty - 13, tw, 13);
  line.draw(tx - tw / 2, ty);
  ctx.restore();
}

/** Small grey hint text on the stage. */
export function hint(ctx, text, x, y, c, align = 'left') {
  ctx.save();
  ctx.fillStyle = c.muted;
  ctx.font = '500 12px Barlow, sans-serif';
  ctx.textBaseline = 'middle';
  // Keep the whole hint on the stage: slide it inward when it would run past an edge.
  ctx.textAlign = 'left';
  const line = subText(ctx, text), w = line.width, stageW = ctx.canvas.width / (ctx.getTransform().a || 1);
  let left = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  left = Math.max(4, Math.min(left, stageW - w - 4));
  // The same for the top and bottom edges (a caption above a body that starts at the top of a small stage).
  const stageH = ctx.canvas.height / (ctx.getTransform().d || 1);
  if (y > -20 && y < stageH + 20) y = Math.max(9, Math.min(y, stageH - 9));
  reserve(ctx, left, y - 7, w, 14);
  line.draw(left, y);
  ctx.restore();
}

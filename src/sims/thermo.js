// Shared pieces for the molecular-physics, thermodynamics and electricity figures.
import { fillSub, ink } from '../ui/canvas.js';

export const R = 8.314, kB = 1.380649e-23, NA = 6.022e23;

const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
/** A fixed cloud of molecules: start point, direction and a speed factor with a Maxwell-like spread. */
export function makeParticles(n, seed = 7) {
  const r = rnd(seed);
  return Array.from({ length: n }, () => ({ x: r(), y: r(), a: r() * Math.PI * 2, s: 0.35 + 1.2 * r() * r() + 0.35 * r() }));
}
const bounce = (u) => { const r = ((u % 2) + 2) % 2; return r > 1 ? 2 - r : r; };

/** Molecules bouncing inside a pixel rectangle. `phase` grows with ∫υ dt, so the picture depends only on model state. */
export function drawParticles(ctx, x, y, w, h, parts, phase, c, r = 3, hi = -1) {
  if (w < 2 * r + 2 || h < 2 * r + 2) return;
  ctx.save();
  parts.forEach((p, i) => {
    const px = x + r + bounce(p.x + Math.cos(p.a) * p.s * phase) * (w - 2 * r);
    const py = y + r + bounce(p.y + Math.sin(p.a) * p.s * phase * (w / h)) * (h - 2 * r);
    ctx.fillStyle = i === hi ? c.force : c.accent;
    ctx.beginPath(); ctx.arc(px, py, i === hi ? r + 1.5 : r, 0, Math.PI * 2); ctx.fill();
  });
  ctx.restore();
}

/** Open-top vessel walls (left, bottom, right). */
export function vessel(ctx, x, y, w, h, c) {
  ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y); ctx.stroke(); ctx.restore();
}

/** Flame row under a vessel; flickers with t. */
export function flame(ctx, x, y, w, t, c) {
  ctx.save(); ctx.strokeStyle = c.force; ctx.lineWidth = 1.5;
  const n = Math.max(3, Math.round(w / 16));
  for (let i = 0; i < n; i++) {
    const cx = x + ((i + 0.5) * w) / n, hh = 12 + 4 * Math.sin(t * 9 + i * 1.7);
    ctx.beginPath(); ctx.moveTo(cx - 4, y); ctx.quadraticCurveTo(cx - 5, y - hh * 0.6, cx, y - hh); ctx.quadraticCurveTo(cx + 5, y - hh * 0.6, cx + 4, y); ctx.stroke();
  }
  ctx.restore();
}

/** Vertical thermometer: bulb at the bottom, column filled to `frac` (0..1), value text on the right. */
export function thermometer(ctx, x, y, h, frac, text, c) {
  ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 1.25; ctx.fillStyle = c.surface;
  ctx.fillRect(x - 4, y, 8, h); ctx.strokeRect(x - 4, y, 8, h);
  ctx.beginPath(); ctx.arc(x, y + h + 6, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = c.force; ctx.beginPath(); ctx.arc(x, y + h + 6, 5.5, 0, Math.PI * 2); ctx.fill();
  const f = Math.max(0, Math.min(1, frac)); ctx.fillRect(x - 2, y + h * (1 - f), 4, h * f + 4);
  ctx.fillStyle = c.fg; ctx.font = '600 13px Barlow, sans-serif'; ctx.textBaseline = 'middle'; fillSub(ctx, text, x + 12, y + h * (1 - f));
  ctx.restore();
}

/**
 * A small p–V (or any x–y) diagram in a pixel box: axes with names, the whole path dashed,
 * the travelled part solid, and the current point. `path` and `done` are arrays of [x, y].
 */
export function plotBox(ctx, bx, by, bw, bh, path, done, c, xName = 'V', yName = 'p', fill = false) {
  const xs = path.map((q) => q[0]), ys = path.map((q) => q[1]);
  const xMax = Math.max(...xs) * 1.12 || 1, yMax = Math.max(...ys) * 1.12 || 1;
  const X = (v) => bx + (v / xMax) * bw, Y = (v) => by + bh - (v / yMax) * bh;
  ctx.save();
  ctx.strokeStyle = c.fg; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(bx, by - 6); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw + 6, by + bh); ctx.stroke();
  ctx.fillStyle = c.fg; ctx.font = 'italic 700 15px "Times New Roman", serif'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(yName, bx - 14, by + 4); ctx.fillText(xName, bx + bw + 2, by + bh + 16);
  if (fill && done.length > 2) { ctx.fillStyle = c.accent; ctx.globalAlpha = 0.18; ctx.beginPath(); done.forEach((q, i) => (i ? ctx.lineTo(X(q[0]), Y(q[1])) : ctx.moveTo(X(q[0]), Y(q[1])))); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
  ctx.strokeStyle = c.muted; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
  ctx.beginPath(); path.forEach((q, i) => (i ? ctx.lineTo(X(q[0]), Y(q[1])) : ctx.moveTo(X(q[0]), Y(q[1])))); ctx.stroke();
  ctx.setLineDash([]); ctx.strokeStyle = c.accent; ctx.lineWidth = 2;
  ctx.beginPath(); done.forEach((q, i) => (i ? ctx.lineTo(X(q[0]), Y(q[1])) : ctx.moveTo(X(q[0]), Y(q[1])))); ctx.stroke();
  const last = done[done.length - 1];
  if (last) { ctx.fillStyle = c.force; ctx.beginPath(); ctx.arc(X(last[0]), Y(last[1]), 4.5, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

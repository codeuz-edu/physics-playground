// Shared pieces for the waves, optics and modern-physics figures.
import { common } from '../core/i18n.js';
import { ink } from '../ui/canvas.js';

/** Approximate colour of light of wavelength `nm` (380–750 nm visible); outside it, a grey. */
export function wlColor(nm, alpha = 1) {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = (440 - nm) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = (645 - nm) / 65; }
  else if (nm <= 750) { r = 1; }
  else return `rgba(150,150,150,${alpha})`;
  if (nm < 380) return `rgba(150,120,200,${alpha})`;
  return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${alpha})`;
}

/** Name of the spectral region in the active language (text: optics.uz.js, read at call time). */
export function region(nm) {
  const r = common().optics.regions;
  if (nm < 380) return r.ultraviolet;
  if (nm < 450) return r.violet;
  if (nm < 495) return r.blue;
  if (nm < 570) return r.green;
  if (nm < 590) return r.yellow;
  if (nm < 620) return r.orange;
  if (nm <= 750) return r.red;
  return r.infrared;
}

/** Polyline drawn up to fraction s (0..1) of its length; dashed for virtual rays. */
export function partial(ctx, pts, s, color, width = 1.75, dashed = false) {
  let L = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  let left = Math.max(0, Math.min(1, s)) * L;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; if (dashed) ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && left > 0; i++) {
    const d = seg[i - 1], f = Math.min(1, left / (d || 1));
    ctx.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f); left -= d;
  }
  ctx.stroke(); ctx.restore();
}

/** Upright (or inverted) arrow standing on the optical axis: object or image. */
export function standArrow(ctx, x, yAxis, yTip, color, dashed = false) {
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.5; if (dashed) ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(x, yAxis); ctx.lineTo(x, yTip); ctx.stroke(); ctx.setLineDash([]);
  // The head is 10 px, smaller on a short arrow, so a small image is still an arrow and not just a head.
  const d = Math.sign(yTip - yAxis) || -1, head = Math.min(10, 0.45 * Math.abs(yTip - yAxis));
  ctx.beginPath(); ctx.moveTo(x, yTip); ctx.lineTo(x - head * 0.6, yTip - d * head); ctx.lineTo(x + head * 0.6, yTip - d * head); ctx.closePath(); ctx.fill(); ctx.restore();
}

/** Thin dashed optical axis. */
export function axisLine(ctx, x0, x1, y, c) {
  ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.setLineDash([8, 4, 2, 4]); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
}

/** Point at abscissa x on the straight line through a and b (world [x, y] pairs); b itself if the line is vertical. */
export function atX(a, b, x) {
  const dx = b[0] - a[0];
  return Math.abs(dx) < 1e-12 ? [b[0], b[1]] : [x, a[1] + ((b[1] - a[1]) * (x - a[0])) / dx];
}

/** Small filled dot. */
export function dot(ctx, x, y, r, color) { ctx.save(); ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }

export { ink };

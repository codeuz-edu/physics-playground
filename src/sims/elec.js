// Shared pieces for the electricity and magnetism figures: circuit symbols, moving charges, charged balls.
import { ink, fillSub } from '../ui/canvas.js';

export const K = 9e9, EPS0 = 8.85e-12, MU0 = 4 * Math.PI * 1e-7;

/** Wire through a list of pixel points. */
export function wire(ctx, pts, c, color) {
  ctx.save(); ctx.strokeStyle = color || c.fg; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
}

/** Charges drifting along a polyline: `phase` is the distance (px) travelled, so speed follows the current. */
export function drift(ctx, pts, phase, c, gap = 22, color) {
  const seg = []; let L = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push([L, d, pts[i - 1], pts[i]]); L += d; }
  if (L < 1) return;
  ctx.save(); ctx.fillStyle = color || c.accent;
  for (let s = ((phase % gap) + gap) % gap; s < L; s += gap) {
    const g = seg.find((q) => s >= q[0] && s <= q[0] + q[1]); if (!g) continue;
    const f = (s - g[0]) / (g[1] || 1); ctx.beginPath(); ctx.arc(g[2][0] + (g[3][0] - g[2][0]) * f, g[2][1] + (g[3][1] - g[2][1]) * f, 2.6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

/** Resistor box centred at (x, y); horizontal unless `vertical`. */
export function resistor(ctx, x, y, c, text, vertical = false, len = 46) {
  const w = vertical ? 16 : len, h = vertical ? len : 16;
  ctx.save(); ctx.fillStyle = c.surface; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
  ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.strokeRect(x - w / 2, y - h / 2, w, h);
  if (text) { ctx.fillStyle = c.fg; ctx.font = '600 13px Barlow, sans-serif'; ctx.textAlign = vertical ? 'left' : 'center'; ctx.textBaseline = vertical ? 'middle' : 'bottom'; fillSub(ctx, text, vertical ? x + 14 : x, vertical ? y : y - 12); }
  ctx.restore();
}

/** Cell symbol: long thin plate (+) and short thick plate (−), centred at (x, y). */
export function cell(ctx, x, y, c, text, vertical = true) {
  ctx.save(); ctx.strokeStyle = c.fg; ctx.fillStyle = c.fg;
  const L = (dx, dy, len, w) => { ctx.lineWidth = w; ctx.beginPath(); if (vertical) { ctx.moveTo(x - len / 2, y + dy); ctx.lineTo(x + len / 2, y + dy); } else { ctx.moveTo(x + dx, y - len / 2); ctx.lineTo(x + dx, y + len / 2); } ctx.stroke(); };
  L(-4, -4, 30, 1.5); L(4, 4, 15, 4);
  ctx.font = '600 13px Barlow, sans-serif'; ctx.textBaseline = 'middle';
  if (vertical) { ctx.textAlign = 'right'; fillSub(ctx, text || '', x - 22, y); } else { ctx.textAlign = 'center'; fillSub(ctx, text || '', x, y - 24); }
  ctx.restore();
}

/** Capacitor: two plates across the wire at (x, y). */
export function capacitor(ctx, x, y, c, text, vertical = true, gap = 10, len = 34) {
  ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 3;
  ctx.beginPath();
  if (vertical) { ctx.moveTo(x - len / 2, y - gap / 2); ctx.lineTo(x + len / 2, y - gap / 2); ctx.moveTo(x - len / 2, y + gap / 2); ctx.lineTo(x + len / 2, y + gap / 2); }
  else { ctx.moveTo(x - gap / 2, y - len / 2); ctx.lineTo(x - gap / 2, y + len / 2); ctx.moveTo(x + gap / 2, y - len / 2); ctx.lineTo(x + gap / 2, y + len / 2); }
  ctx.stroke();
  if (text) {
    ctx.fillStyle = c.fg; ctx.font = '600 13px Barlow, sans-serif'; ctx.textBaseline = 'middle';
    // Beside the plates on the right; where the stage ends too soon for that (a phone), on the left instead.
    const tx = vertical ? x + len / 2 + 8 : x + 10, room = ctx.canvas.width / (ctx.getTransform().a || 1) - 4 - tx;
    if (ctx.measureText(text).width > room) { ctx.textAlign = 'right'; fillSub(ctx, text, vertical ? x - len / 2 - 8 : x - 10, vertical ? y : y - len / 2 - 8); }
    else { ctx.textAlign = 'left'; fillSub(ctx, text, tx, vertical ? y : y - len / 2 - 8); }
  }
  ctx.restore();
}

/** Meter (A or V) as a circle with its letter. */
export function meter(ctx, x, y, letter, c, r = 13) {
  ctx.save(); ctx.fillStyle = c.surface; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = c.fg; ctx.font = '700 13px Barlow, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(letter, x, y + 0.5);
  ctx.restore();
}

/** Charged ball with its sign; positive in the force colour, negative in the velocity colour. */
export function chargeBall(ctx, x, y, r, q, c) {
  ctx.save();
  ctx.fillStyle = q > 0 ? c.force : q < 0 ? c.vel : c.track; ctx.strokeStyle = c.fg; ctx.lineWidth = ink.object;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = c.surface; ctx.lineWidth = 2; const s = r * 0.45;
  if (q !== 0) { ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x + s, y); if (q > 0) { ctx.moveTo(x, y - s); ctx.lineTo(x, y + s); } ctx.stroke(); }
  ctx.restore();
}

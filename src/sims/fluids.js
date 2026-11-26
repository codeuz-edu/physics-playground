// Shared pieces for the fluids chapter: the liquids table, vessels, liquid columns and a depth ruler.
// The liquids' names are text: they live in fluids.<locale>.js and are read through common().fluids.
import { common } from '../core/i18n.js';
import { fillSub, formatTick, ink, niceStep, reserve } from '../ui/canvas.js';

export const LIQUIDS = [
  { key: 'water', rho: 1000 },
  { key: 'seawater', rho: 1030 },
  { key: 'kerosene', rho: 800 },
  { key: 'vegetableOil', rho: 920 },
  { key: 'mercury', rho: 13600 },
];

/** Name of a liquid in the active language, as the menus show it (capitalised). */
export const liquidName = (l) => common().fluids?.liquids?.[l.key] ?? l.key;

const thousands = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
const rhoLabel = (name, rho) => `${name} (${thousands(rho)} kg/m³)`;

/**
 * A liquid picked from a menu; `list` is a subset of LIQUIDS. The value is the index into `list`.
 * The parameter's label is in each simulation's text. The option names are a getter, so they are read
 * when the simulation is loaded (sims/load.js copies the parameter after setting the language), not at import.
 */
export const liquidParam = (list = LIQUIDS, key = 'liq', symbol = 'ρ') => ({
  key, symbol, unit: '', min: 0, max: list.length - 1, step: 1, default: 0, kind: 'initial',
  get options() { return list.map((l) => rhoLabel(liquidName(l), l.rho)); },
});
export const pick = (list, i) => list[Math.max(0, Math.min(list.length - 1, Math.round(i)))];

/** Fill and surface colours: mercury reads as metal, oils as a grey, water and brine as water. */
export function liquidFill(c, rho) { return rho > 5000 ? c.iron : rho < 960 ? c['iron-hi'] : c.water; }
export function liquidLine(c, rho) { return rho > 5000 ? c['iron-dark'] : rho < 960 ? c.muted : c['water-line']; }

/** Open vessel drawn as one line: two walls and the floor (pixels). */
export function vessel(ctx, x0, yTop, x1, yBot, c) {
  ctx.save();
  ctx.strokeStyle = c.fg;
  ctx.lineWidth = ink.object;
  ctx.lineJoin = 'miter';
  ctx.beginPath();
  ctx.moveTo(x0, yTop); ctx.lineTo(x0, yBot); ctx.lineTo(x1, yBot); ctx.lineTo(x1, yTop);
  ctx.stroke();
  ctx.restore();
}

/** A body of liquid from its free surface down to `yBot` (pixels), with the surface drawn as a line. */
export function liquid(ctx, x0, ySurf, x1, yBot, c, rho, surface = true) {
  if (yBot - ySurf < 0.5) return;
  ctx.save();
  ctx.fillStyle = liquidFill(c, rho);
  ctx.fillRect(x0, ySurf, x1 - x0, yBot - ySurf);
  if (surface) {
    ctx.strokeStyle = liquidLine(c, rho);
    ctx.lineWidth = ink.scenery;
    ctx.beginPath();
    ctx.moveTo(x0, Math.round(ySurf) + 0.5);
    ctx.lineTo(x1, Math.round(ySurf) + 0.5);
    ctx.stroke();
  }
  ctx.restore();
}

/** Depth scale beside a vessel: 0 at the free surface, growing downwards, ticks to the left of x. */
export function depthRuler(ctx, x, ySurf, pxPerM, depthM, c, unit = 'm', factor = 1) {
  if (depthM <= 0) return;
  const span = depthM * factor, step = niceStep(span, Math.max(2, Math.min(8, (depthM * pxPerM) / 46)));
  ctx.save();
  ctx.strokeStyle = c.axis;
  ctx.lineWidth = 1;
  ctx.fillStyle = c.muted;
  ctx.font = '500 11px Barlow, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.beginPath();
  ctx.moveTo(Math.round(x) + 0.5, ySurf);
  ctx.lineTo(Math.round(x) + 0.5, ySurf + depthM * pxPerM);
  for (let d = 0; d <= span + 1e-9; d += step) {
    const y = Math.round(ySurf + (d / factor) * pxPerM) + 0.5;
    ctx.moveTo(x - 5, y); ctx.lineTo(x + 0.5, y);
    ctx.fillText(formatTick(d, step), x - 8, y);
  }
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.font = 'italic 14px "Times New Roman", serif';
  ctx.fillText(`h, ${unit}`, x - 10, ySurf - 6);
  ctx.restore();
}

/** Vertical dimension line with end ticks and a value to its right (pixels). */
export function vdim(ctx, x, y0, y1, text, c, side = 'right') {
  if (Math.abs(y1 - y0) < 2) return;
  ctx.save();
  ctx.strokeStyle = c.muted;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const X = Math.round(x) + 0.5;
  ctx.moveTo(X, y0); ctx.lineTo(X, y1);
  ctx.moveTo(X - 4, y0); ctx.lineTo(X + 4, y0);
  ctx.moveTo(X - 4, y1); ctx.lineTo(X + 4, y1);
  ctx.stroke();
  ctx.fillStyle = c.fg;
  ctx.font = '500 12px Barlow, sans-serif';
  ctx.textAlign = side === 'right' ? 'left' : 'right';
  ctx.textBaseline = 'middle';
  fillSub(ctx, text, X + (side === 'right' ? 7 : -7), (y0 + y1) / 2);
  // The value is marked as taken, so the name of a vector drawn afterwards does not land on it.
  const tw = ctx.measureText(text).width;
  reserve(ctx, side === 'right' ? X + 7 : X - 7 - tw, (y0 + y1) / 2 - 7, tw, 14);
  ctx.restore();
}

/** Dashed construction line (pixels). */
export function dashed(ctx, x0, y0, x1, y1, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.restore();
}

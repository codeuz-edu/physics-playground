import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { atX, axisLine, dot, partial, standArrow } from '../optics.js';

// The run: rays are drawn from the object at its start position (TR s), then the object slides to d and the image follows.
const TR = 0.8, DUR = 3.2, KY = 3; // heights are drawn 3× taller than distances
const DMIN = 2, DMAX = 50, XCAP = 120, HCAP = 10; // cm; the view grows to show the image up to XCAP and HCAP
const params = [
  { key: 'type', symbol: '', unit: '', min: 0, max: 1, step: 1, default: 0, kind: 'initial', options: ['converging', 'diverging'] },
  { key: 'F', symbol: 'F', unit: 'cm', min: 5, max: 25, step: 1, default: 10, kind: 'initial', decimals: 0, color: '--acc' },
  { key: 'd', symbol: 'd', unit: 'cm', min: DMIN, max: DMAX, step: 1, default: 30, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'h', symbol: 'h', unit: 'cm', min: 1, max: 5, step: 0.5, default: 2, kind: 'initial', decimals: 1, color: '--vel' },
];
/** Thin-lens image: f > 0 real (behind the lens), f < 0 virtual (on the object's side); null when d = F. */
export const lensImage = (F, d, conv) => { const Fs = conv ? F : -F; if (Math.abs(d - Fs) < 1e-9) return null; return (d * Fs) / (d - Fs); };
/** Where the object starts: far away, or next to the lens when d is inside F, so the slide never crosses the focus. */
const startOf = (P) => (P.type === 0 && P.d < P.F ? DMIN : DMAX);
/** Image distance, magnification and image height for the object at distance d (NaN when there is no image). */
const imageAt = (P, d) => { const f = lensImage(P.F, d, P.type === 0), G = f == null ? NaN : Math.abs(f) / d; return { f, G, H: G * P.h }; };

/** World box: the object, the lens and the image (start and end of the slide), capped so the drawing stays readable. */
function bounds(p) {
  let xMin = -55, xMax = 55, hm = Math.max(4.4, p.h);
  for (const s of [imageAt(p, p.d), imageAt(p, startOf(p))]) {
    if (s.f == null) { hm = Math.max(hm, HCAP); continue; } // object at F: the image grows without limit on the way
    if (s.f > 0) xMax = Math.max(xMax, Math.min(XCAP, s.f + 8)); else xMin = Math.min(xMin, -Math.min(XCAP, 8 - s.f));
    hm = Math.max(hm, Math.min(HCAP, s.H));
  }
  const yH = KY * (hm + 0.7) + 1.5;
  return { xMin, xMax, yMin: -yH, yMax: yH };
}

class LensModel {
  t = 0; s = 0; d = 0; d0 = 0; f = null; G = 0; H = 0; reason = ''; P = null;
  reset(P) { this.P = { ...P }; this.t = 0; this.reason = ''; this.d0 = startOf(P); this.place(); }
  place() {
    const u = Math.max(0, Math.min(1, (this.t - TR) / (DUR - TR)));
    this.s = Math.min(1, this.t / TR);
    this.d = u >= 1 ? this.P.d : this.d0 + (this.P.d - this.d0) * u;
    Object.assign(this, imageAt(this.P, this.d));
  }
  step(dt) {
    if (this.reason) return false;
    this.t = Math.min(DUR, this.t + dt);
    if (this.t >= DUR - 1e-9) { this.t = DUR; this.place(); this.reason = 'end'; return false; }
    this.place();
    return true;
  }
  isValid() { return Number.isFinite(this.d); }
  sample() { return { d: this.d, f: this.f ?? NaN, G: this.G, H: this.H }; }
  clone() { return Object.assign(new LensModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    if (this.f == null) return text.msg.atFocus;
    const G = num(this.G, 2), H = num(this.H, 2);
    return this.f > 0 ? text.msg.real(num(this.f, 1), G, H) : text.msg.virtual(num(-this.f, 1), G, H);
  }
}

export default {
  id: 'lens',
  params,
  lengthUnit: 'cm',
  presets: [
    { values: { type: 0, F: 10, d: 30, h: 2 } },
    { values: { type: 0, F: 10, d: 5, h: 2 } },
    { values: { type: 1, F: 10, d: 30, h: 2 } },
  ],
  toggles: [],
  readouts: [
    { key: 'd', unit: 'cm', decimals: 1, color: '--pos' },
    { key: 'f', unit: 'cm', decimals: 1, color: '--force' },
    { key: 'G', unit: '', decimals: 2, color: '--acc' },
    { key: 'H', unit: 'cm', decimals: 2, color: '--vel' },
  ],
  graphs: [{ id: 'distances', unit: 'cm', series: [{ key: 'd', color: '--pos' }, { key: 'f', color: '--force' }] }],
  createModel: () => new LensModel(),
  worldBounds: bounds,
  viewPadding: { left: 12, right: 12, top: 40, bottom: 12 },

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const B = bounds(p), X = (x) => view.px(x), Y = (y) => view.py(y * KY), W = (q) => [X(q[0]), Y(q[1])];
    const conv = p.type === 0, F = p.F, d = m.d, h = p.h, f = m.f, ray = c.force, s = m.s, yTop = B.yMax / KY;
    const Hs = f == null ? null : -(f / d) * h; // signed image height (negative = inverted)
    // Object or image arrow; a short one (a small image on a phone) gets a smaller head, so it is not all head.
    const arrow = (x, y0, y1, col, dash) => {
      const len = Math.abs(y1 - y0), q = Math.sign(y1 - y0) || -1, hd = Math.max(4, len * 0.45);
      if (len >= 24) { standArrow(ctx, x, y0, y1, col, dash); return; }
      ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.5; if (dash) ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1 - q * hd); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x - hd * 0.6, y1 - q * hd); ctx.lineTo(x + hd * 0.6, y1 - q * hd); ctx.closePath(); ctx.fill(); ctx.restore();
    };
    ctx.save(); ctx.beginPath(); ctx.rect(X(B.xMin), Y(yTop), X(B.xMax) - X(B.xMin), Y(-yTop) - Y(yTop)); ctx.clip();
    axisLine(ctx, X(B.xMin), X(B.xMax), Y(0), c);
    // Lens: a vertical line with arrowheads pointing out (converging) or in (diverging), tall enough for every ray that meets it.
    const lh = Math.min(yTop - 0.3, Math.max(4.4, h + 0.6, Hs == null ? 0 : Math.abs(Hs) + 0.6));
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0), Y(lh)); ctx.lineTo(X(0), Y(-lh));
    for (const k of [1, -1]) { const tip = Y(k * lh), e = conv ? -k * 8 : k * 8; ctx.moveTo(X(0) - 7, tip - e); ctx.lineTo(X(0), tip); ctx.lineTo(X(0) + 7, tip - e); }
    ctx.stroke(); ctx.restore();
    for (const k of [-1, 1]) dot(ctx, X(k * F), Y(0), 3.5, c.fg);
    arrow(X(-d), Y(0), Y(h), c.pos || c.vel);
    // Characteristic rays in world coordinates: (1) parallel to the axis, then through the far focus (or as if from the
    // near one); (2) through the optical centre, unbent; (3) through the near focus (or aimed at the far one), then parallel.
    const top = [-d, h], L0 = [0, h], O = [0, 0], xR = B.xMax, solid = [], dashed = [];
    if (f == null) {
      solid.push([top, L0, atX(L0, [F, 0], xR)], [top, O, atX(top, O, xR)]); // both leave parallel to each other
    } else {
      const I = [f, Hs], L3 = [0, Hs];
      if (f > 0) solid.push([top, L0, atX(L0, I, xR)], [top, O, atX(O, I, xR)], [top, L3, [xR, Hs]]);
      else {
        solid.push([top, L0, atX(L0, [conv ? F : -F, 0], xR)], [top, O, atX(top, O, xR)], [top, L3, [xR, Hs]]);
        dashed.push([L0, I], [O, I], [L3, I]);
      }
    }
    for (const r of solid) partial(ctx, r.map(W), s, ray);
    if (s > 0.6) for (const r of dashed) partial(ctx, r.map(W), (s - 0.6) / 0.4, ray, 1, true);
    const shown = f != null && s >= 0.98, inside = shown && f > B.xMin && f < B.xMax && Math.abs(Hs) < yTop - 0.5;
    if (inside) arrow(X(f), Y(0), Y(Hs), ray, f < 0);
    ctx.restore();
    // Captions where no line of the figure passes: the first free of the places offered, else the first one.
    const segs = [], taken = [], add = (pts) => { for (let i = 1; i < pts.length; i++) segs.push([...W(pts[i - 1]), ...W(pts[i])]); };
    [...solid, ...dashed].forEach(add); add([[B.xMin, 0], [B.xMax, 0]]); add([[-d, 0], [-d, h]]); add([[0, lh], [0, -lh]]); if (inside) add([[f, 0], [f, Hs]]);
    const cuts = (l, t, r, b) => segs.some(([x0, y0, x1, y1]) => {
      if (Math.max(x0, x1) < l || Math.min(x0, x1) > r || Math.max(y0, y1) < t || Math.min(y0, y1) > b) return false;
      const side = [[l, t], [r, t], [l, b], [r, b]].map(([x, y]) => Math.sign((x1 - x0) * (y - y0) - (y1 - y0) * (x - x0)));
      return !(side.every((v) => v > 0) || side.every((v) => v < 0));
    }) || taken.some((q) => l < q[2] && r > q[0] && t < q[3] && b > q[1]);
    const put = (str, places) => {
      ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; const w = ctx.measureText(str).width; ctx.restore();
      const box = ([x, y, al]) => { const l = Math.max(4, Math.min(al === 'center' ? x - w / 2 : al === 'right' ? x - w : x, view.width - w - 4)); return [l - 3, y - 9, l + w + 3, y + 9]; };
      const at = places.find((q) => q[1] > 40 && q[1] < view.height - 10 && !cuts(...box(q))) || places[0]; // under the badge row, on the stage
      taken.push(box(at)); hint(ctx, str, at[0], at[1], c, at[2]);
    };
    // Places in rows at the heights given: centred on x, then just right of it, then just left.
    const around = (x, ys) => ys.flatMap((y) => [[x, y, 'center'], [x + 9, y, 'left'], [x - 9, y, 'right']]);
    const y0 = Y(0);
    for (const k of [-1, 1]) put('F', around(X(k * F), [y0 + 14, y0 - 14, y0 + 28, y0 - 28]));
    if (inside) {
      const yi = Y(Hs), ya = Math.min(yi, y0), yb = Math.max(yi, y0);
      put(f > 0 ? text.draw.realImage : text.draw.virtualImage, around(X(f), [ya - 12, (ya + yb) / 2, yb + 14, ya - 26, yb + 28, ya - 40, yb + 42, ya - 54]));
    } else if (shown) hint(ctx, text.draw.offPicture(num(Math.abs(f), 0)), f > 0 ? X(B.xMax) - 6 : X(B.xMin) + 6, Y(0) - 14, c, f > 0 ? 'right' : 'left');
    label(ctx, text.draw.formula(num(d, 1), f == null ? '∞' : text.draw.cm(num(f, 1))), 12, 20, c, 'left');
  },
};

import { num } from '../../core/format.js';
import { label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { atX, axisLine, dot, partial, standArrow } from '../optics.js';

// The run: rays are drawn from the object at its start position (TR s), then the object slides to d and the image follows.
const TR = 0.8, DUR = 3.2, KY = 3; // heights are drawn 3× taller than distances
const DMIN = 2, DMAX = 45, XCAP = 110, XCAP_BACK = 70, HCAP = 10; // cm; the view grows to show the image up to these sizes
const params = [
  { key: 'type', symbol: '', unit: '', min: 0, max: 1, step: 1, default: 0, kind: 'initial', options: ['concave', 'convex'] },
  { key: 'R', symbol: 'R', unit: 'cm', min: 10, max: 60, step: 2, default: 20, kind: 'initial', decimals: 0, color: '--acc' },
  { key: 'd', symbol: 'd', unit: 'cm', min: DMIN, max: DMAX, step: 1, default: 15, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'h', symbol: 'h', unit: 'cm', min: 1, max: 5, step: 0.5, default: 2, kind: 'initial', decimals: 1, color: '--vel' },
];
/** Signed focal length: F = R/2 for a concave mirror, −R/2 for a convex one. */
const focal = (P) => (P.type === 0 ? 1 : -1) * (P.R / 2);
/** Where the object starts: far away, or next to the mirror when d is inside F, so the slide never crosses the focus. */
const startOf = (P) => (P.type === 0 && P.d < P.R / 2 ? DMIN : DMAX);
/** Image for the object at distance d: f > 0 real (in front of the mirror), f < 0 virtual (behind it), null when d = F. */
const imageAt = (P, d) => {
  const Fs = focal(P), f = Math.abs(d - Fs) < 1e-9 ? null : (d * Fs) / (d - Fs), G = f == null ? NaN : Math.abs(f) / d;
  return { f, G, H: G * P.h };
};

/** World box: the object, C, the mirror and the image (start and end of the slide), capped so the drawing stays readable. */
function bounds(p) {
  let xMin = -60, xMax = 30, hm = Math.max(4.3, p.h);
  for (const s of [imageAt(p, p.d), imageAt(p, startOf(p))]) {
    if (s.f == null) { hm = Math.max(hm, HCAP); continue; } // object at F: the image grows without limit on the way
    if (s.f > 0) xMin = Math.min(xMin, -Math.min(XCAP, s.f + 8)); else xMax = Math.max(xMax, Math.min(XCAP_BACK, 8 - s.f));
    hm = Math.max(hm, Math.min(HCAP, s.H));
  }
  const yH = KY * (hm + 0.7) + 1.5;
  return { xMin, xMax, yMin: -yH, yMax: yH };
}

/** Spherical mirror at x = 0 facing left, F = R/2. */
class MirrorModel {
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
  clone() { return Object.assign(new MirrorModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    if (this.f == null) return text.msg.atFocus;
    const G = num(this.G, 2), H = num(this.H, 2);
    return this.f > 0 ? text.msg.real(num(this.f, 1), G, H) : text.msg.virtual(num(-this.f, 1), G, H);
  }
}

export default {
  id: 'mirror',
  params,
  lengthUnit: 'cm',
  presets: [
    { values: { type: 0, R: 20, d: 15, h: 2 } },
    { values: { type: 0, R: 20, d: 6, h: 2 } },
    { values: { type: 1, R: 40, d: 20, h: 2 } },
  ],
  toggles: [],
  readouts: [
    { key: 'd', unit: 'cm', decimals: 1, color: '--pos' },
    { key: 'f', unit: 'cm', decimals: 1, color: '--force' },
    { key: 'G', unit: '', decimals: 2, color: '--acc' },
    { key: 'H', unit: 'cm', decimals: 2, color: '--vel' },
  ],
  graphs: [{ id: 'distances', unit: 'cm', series: [{ key: 'd', color: '--pos' }, { key: 'f', color: '--force' }] }],
  createModel: () => new MirrorModel(),
  worldBounds: bounds,
  viewPadding: { left: 12, right: 12, top: 40, bottom: 12 },

  draw({ ctx, view, model: m, params: p, colors: c, text }) {
    const B = bounds(p), X = (x) => view.px(x), Y = (y) => view.py(y * KY), W = (q) => [X(q[0]), Y(q[1])];
    const conc = p.type === 0, F = p.R / 2, d = m.d, h = p.h, f = m.f, s = m.s, ray = c.force, yTop = B.yMax / KY;
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
    // Mirror: an arc whose rim curves towards the object (concave) or away from it (convex), hatched behind.
    // Its depth is exaggerated (×3, at most 1.2 cm) so the shape reads. The rays meet it on the drawn arc, not on the
    // plane x = 0, and go on to the image the mirror formula gives.
    const mh = Math.min(yTop - 0.3, Math.max(4.3, h + 0.5, Hs == null ? 0 : Math.abs(Hs) + 0.5));
    const k = (conc ? -1 : 1) * Math.min(3 / (2 * p.R), 1.2 / (mh * mh)), sag = (y) => k * y * y;
    ctx.save(); ctx.strokeStyle = c.fg; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let i = 0; i <= 40; i++) { const y = -mh + (i / 40) * 2 * mh; i ? ctx.lineTo(X(sag(y)), Y(y)) : ctx.moveTo(X(sag(y)), Y(y)); }
    ctx.stroke(); ctx.lineWidth = 1; ctx.strokeStyle = c.muted;
    const nH = Math.max(5, Math.round(mh / 0.8));
    for (let i = 0; i <= 2 * nH; i++) { const y = -mh + (i / (2 * nH)) * 2 * mh; ctx.beginPath(); ctx.moveTo(X(sag(y)), Y(y)); ctx.lineTo(X(sag(y)) + 6, Y(y) - 6); ctx.stroke(); }
    ctx.restore();
    const fx = conc ? -F : F; dot(ctx, X(fx), Y(0), 3.5, c.fg);
    if (conc) dot(ctx, X(-p.R), Y(0), 3, c.muted);
    arrow(X(-d), Y(0), Y(h), c.pos || c.vel);
    // Characteristic rays in world coordinates: (1) parallel to the axis, reflected through F (or as if from F behind a
    // convex mirror); (2) to the pole, reflected symmetrically; (3) through F (or aimed at it), reflected parallel.
    const top = [-d, h], M = [sag(h), h], O = [0, 0], xL = B.xMin, solid = [], dashed = [];
    if (f == null) {
      solid.push([top, M, atX(M, [-F, 0], xL)], [top, O, atX(O, [-d, -h], xL)]); // both leave parallel to each other
    } else {
      // A ray that passes a real focus has it as a corner, so it goes through F and the image exactly; the bend (a degree
      // or two, from the arc's exaggerated depth) sits under the F dot. Ray 3 leaves exactly parallel, at the image's height.
      const I = [-f, Hs], M3 = [sag(Hs), Hs], Fp = [fx, 0];
      if (f > 0) solid.push([top, M, Fp, atX(Fp, I, xL)], [top, O, atX(O, I, xL)], [top, Fp, M3, [xL, Hs]]);
      else {
        solid.push([top, M, conc ? atX(M, Fp, xL) : atX(I, M, xL)], [top, O, atX(I, O, xL)], [top, M3, [xL, Hs]]);
        dashed.push([M, I], [O, I], [M3, I]);
      }
    }
    for (const r of solid) partial(ctx, r.map(W), s, ray);
    if (s > 0.6) for (const r of dashed) partial(ctx, r.map(W), (s - 0.6) / 0.4, ray, 1, true);
    const xi = f == null ? 0 : -f, shown = f != null && s >= 0.98, inside = shown && xi > B.xMin && xi < B.xMax && Math.abs(Hs) < yTop - 0.5;
    if (inside) arrow(X(xi), Y(0), Y(Hs), ray, f < 0);
    ctx.restore();
    // Captions where no line of the figure passes: the first free of the places offered, else the first one.
    const segs = [], taken = [], add = (pts) => { for (let i = 1; i < pts.length; i++) segs.push([...W(pts[i - 1]), ...W(pts[i])]); };
    [...solid, ...dashed].forEach(add); add([[B.xMin, 0], [B.xMax, 0]]); add([[-d, 0], [-d, h]]); add(Array.from({ length: 21 }, (_, i) => { const y = -mh + (i / 20) * 2 * mh; return [sag(y), y]; })); if (inside) add([[xi, 0], [xi, Hs]]);
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
    put('F', around(X(fx), [y0 + 14, y0 - 14, y0 + 28, y0 - 28]));
    if (conc) put('C', around(X(-p.R), [y0 + 14, y0 - 14, y0 + 28, y0 - 28]));
    if (inside) {
      const yi = Y(Hs), ya = Math.min(yi, y0), yb = Math.max(yi, y0);
      put(f > 0 ? text.draw.realImage : text.draw.virtualImage, around(X(xi), [ya - 12, (ya + yb) / 2, yb + 14, ya - 26, yb + 28, ya - 40, yb + 42, ya - 54]));
    } else if (shown) hint(ctx, text.draw.offPicture(num(Math.abs(f), 0)), f > 0 ? X(B.xMin) + 6 : X(B.xMax) - 6, Y(0) - 14, c, f > 0 ? 'left' : 'right');
    label(ctx, text.draw.formula(conc ? '' : '−', num(focal(p), 1), num(d, 1), f == null ? '∞' : text.draw.cm(num(f, 1))), 12, 20, c, 'left');
  },
};

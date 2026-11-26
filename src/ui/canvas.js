/** Outline colour behind vector labels; the page sets it for the light or dark theme. */
export const theme = { halo: 'rgba(255, 255, 255, 0.92)' };
/**
 * Line weights shared by every figure, so scenery, objects and vectors read as one drawing:
 * scenery and object outlines 1.5 px, vectors 2 px with a 9 px head, components 1.5 px with a 7 px head,
 * construction lines 1 px.
 */
export const ink = { scenery: 1.5, object: 1.5, vector: 2, part: 1.5, guide: 1, head: 9, headPart: 7, hatch: 1 };
import { num } from '../core/format.js';

/**
 * Canvas helpers: crisp hi-DPI drawing, a world↔pixel viewport with a single
 * uniform scale (so angles and lengths are never distorted), grids and arrows.
 */








export class Viewport {
  /** CSS pixel size of the drawing area. */
  width = 0;
  height = 0;
  /** Pixels per metre (same on both axes). */
  scale = 1;
  /** Pixel position of world origin. */
  ox = 0;
  oy = 0;
  padding = { left: 44, right: 16, top: 16, bottom: 34 };
  /** Where spare horizontal room goes when the world is narrower than the canvas. */
  alignX = 'center';

  /** Fit world bounds into the canvas: equal x/y scale, world min anchored bottom-left. */
  fit(b, width, height) {
    this.width = width;
    this.height = height;
    const pw = Math.max(1, width - this.padding.left - this.padding.right);
    const ph = Math.max(1, height - this.padding.top - this.padding.bottom);
    const wx = Math.max(1e-6, b.xMax - b.xMin);
    const wy = Math.max(1e-6, b.yMax - b.yMin);
    this.scale = Math.min(pw / wx, ph / wy);
    // Centre horizontally if the world is narrower than the canvas.
    const extraX = pw - wx * this.scale;
    this.ox = this.padding.left + (this.alignX === 'left' ? 0 : extraX / 2) - b.xMin * this.scale;
    this.oy = height - this.padding.bottom + b.yMin * this.scale - (this.alignY === 'center' ? Math.max(0, ph - wy * this.scale) * 0.45 : 0);
  }

  px(x) {
    return this.ox + x * this.scale;
  }
  py(y) {
    return this.oy - y * this.scale;
  }
  wx(px) {
    return (px - this.ox) / this.scale;
  }
  wy(py) {
    return (this.oy - py) / this.scale;
  }
  /** Visible world rectangle. */
  visible() {
    return { xMin: this.wx(0), xMax: this.wx(this.width), yMin: this.wy(this.height), yMax: this.wy(0) };
  }
}

/** Resize a canvas backing store to match its CSS size × devicePixelRatio. Returns CSS size. */
export function fitCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));
  const bw = Math.round(w * dpr);
  const bh = Math.round(h * dpr);
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw;
    canvas.height = bh;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h };
}

/** "Nice" tick step (1, 2 or 5 × 10ⁿ) so that about `target` ticks fit in `span`. */
export function niceStep(span, target = 6) {
  if (!(span > 0) || !Number.isFinite(span)) return 1;
  const raw = span / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  return nice * mag;
}

export function formatTick(v, step) {
  const d = step >= 1 ? 0 : Math.min(4, Math.ceil(-Math.log10(step)));
  return num(v, d);
}







/**
 * Where the labels of the figure being drawn already are, per canvas, so that the name of a vector is
 * not put on top of another label or on a body. Whoever draws a figure calls beginFigure() first; a
 * caller that does not still gets a fresh list for every drawing pass.
 */
const placed = new WeakMap();
const open = new WeakSet();
const frame = new WeakMap(); // inverse of the transform the figure is drawn in, per canvas
export function beginFigure(ctx) {
  placed.set(ctx, []);
  frame.set(ctx, ctx.getTransform().inverse());
  open.add(ctx);
  Promise.resolve().then(() => open.delete(ctx));
}
function taken(ctx) {
  if (!open.has(ctx)) beginFigure(ctx);
  return placed.get(ctx);
}
/**
 * Mark a rectangle (pixels) as occupied by a label or a body. Called while the context is moved or turned
 * (a body drawn in its own frame), the rectangle is mapped back to the figure and its bounding box is taken.
 */
export function reserve(ctx, x, y, w, h) {
  const list = taken(ctx), m = frame.get(ctx).multiply(ctx.getTransform());
  if (Math.abs(m.a - 1) < 1e-6 && Math.abs(m.d - 1) < 1e-6 && Math.abs(m.b) < 1e-6 && Math.abs(m.c) < 1e-6 && Math.abs(m.e) < 1e-6 && Math.abs(m.f) < 1e-6) { list.push([x, y, x + w, y + h]); return; }
  const xs = [], ys = [];
  for (const [px, py] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) { xs.push(m.a * px + m.c * py + m.e); ys.push(m.b * px + m.d * py + m.f); }
  list.push([Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]);
}
const isFree = (ctx, l, t, r, b) => !taken(ctx).some((q) => l < q[2] && r > q[0] && t < q[3] && b > q[1]);

/** Metre grid with labelled axes along the bottom and left edges. */
export function drawGrid(ctx, view, c, opts = {}) {
  const vis = view.visible();
  const stepX = niceStep(vis.xMax - vis.xMin, Math.max(3, Math.floor(view.width / 90)));
  const stepY = niceStep(vis.yMax - vis.yMin, Math.max(3, Math.floor(view.height / 70)));
  const step = Math.max(stepX, stepY); // same step both ways keeps squares square
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = c.grid;
  const bottom = opts.clipBelow ?? view.height;
  const inLabelRange = (x) => !opts.xLabelRange || (x >= opts.xLabelRange[0] - 1e-9 && x <= opts.xLabelRange[1] + 1e-9);
  if (opts.lines !== false) {
    // Full grid (optional): faint lines over the sky only.
    ctx.beginPath();
    for (let x = Math.ceil(vis.xMin / step) * step; x <= vis.xMax; x += step) {
      const p = Math.round(view.px(x)) + 0.5;
      ctx.moveTo(p, 0);
      ctx.lineTo(p, bottom);
    }
    if (opts.showY !== false) {
      for (let y = Math.ceil(vis.yMin / step) * step; y <= vis.yMax; y += step) {
        const p = Math.round(view.py(y)) + 0.5;
        if (p > bottom) continue;
        ctx.moveTo(0, p);
        ctx.lineTo(view.width, p);
      }
    }
    ctx.stroke();
  } else {
    // Textbook style: a ruler along the ground and a slim height scale; instead of a line grid,
    // a faint dot at every metre crossing above the ground (the dot-grid of a printed page).
    ctx.save();
    ctx.fillStyle = c.axis;
    ctx.globalAlpha = 0.35;
    const dotTop = view.padding.top;
    for (let x = Math.ceil(vis.xMin / step) * step; x <= vis.xMax; x += step) {
      const px = Math.round(view.px(x));
      if (px < view.padding.left || px > view.width - view.padding.right) continue;
      for (let y = Math.ceil(vis.yMin / step) * step; y <= vis.yMax; y += step) {
        const py = Math.round(view.py(y));
        if (py >= bottom - 2 || py < dotTop) continue;
        ctx.fillRect(px - 1, py - 1, 2, 2);
      }
    }
    ctx.restore();
    ctx.strokeStyle = c.axis;
    ctx.beginPath();
    for (let x = Math.ceil(vis.xMin / step) * step; x <= vis.xMax; x += step) {
      if (!inLabelRange(x)) continue;
      const p = Math.round(view.px(x)) + 0.5;
      ctx.moveTo(p, bottom - 6);
      ctx.lineTo(p, bottom);
    }
    if (opts.showY !== false && opts.lines !== false) {
      const ax = Math.round(view.padding.left - 4) + 0.5;
      const yTop = Math.max(view.padding.top, view.py(Math.floor(vis.yMax / step) * step));
      ctx.moveTo(ax, bottom);
      ctx.lineTo(ax, yTop);
      for (let y = step; y <= vis.yMax; y += step) {
        const p = Math.round(view.py(y)) + 0.5;
        if (p < view.padding.top - 1 || p > bottom) continue;
        ctx.moveTo(ax, p);
        ctx.lineTo(ax + 5, p);
      }
    }
    ctx.stroke();
  }

  ctx.fillStyle = c.label;
  ctx.font = `12px ${fonts.mono}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const baseY = Math.min(view.height - view.padding.bottom + 8, bottom + 18);
  for (let x = Math.ceil(vis.xMin / step) * step; x <= vis.xMax; x += step) {
    const p = view.px(x);
    if (p < 16 || p > view.width - (opts.xLabel ? 52 : 16)) continue;
    if (!inLabelRange(x)) continue;
    ctx.fillText(formatTick(x, step), p, baseY);
  }
  if (opts.showY !== false && opts.lines !== false) {
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = Math.ceil(vis.yMin / step) * step; y <= vis.yMax; y += step) {
      const p = view.py(y);
      if (p < 10 || p > bottom + 2) continue;
      ctx.fillText(formatTick(y, step), view.padding.left - 10, p);
    }
  }
  if (opts.xLabel) {
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(opts.xLabel, view.width - 10, baseY);
  }
  if (opts.yLabel && opts.showY !== false && opts.lines !== false) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(opts.yLabel, 6, 6);
  }
  ctx.restore();
}

/**
 * Vector arrow in pixel space. Every quantity in every sim is drawn with this one look:
 * a straight shaft and a plain triangular head of fixed size (smaller only when the arrow
 * itself is too short for it). `part` is a thinner arrow for components of a vector.
 */
export function drawArrow(ctx, x0, y0, x1, y1, color, label, style = 'main') {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  if (len < 2) return;
  const width = style === 'main' ? ink.vector : ink.part;
  const head = Math.min(style === 'main' ? ink.head : ink.headPart, len * 0.5);
  const half = head * 0.4;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x1 - ux * head;
  const by = y1 - uy * head;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(bx + ux, by + uy); // run just into the head so no gap shows
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(bx - uy * half, by + ux * half);
  ctx.lineTo(bx + uy * half, by - ux * half);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  // Just past the tip, nudged to one side so it never sits on the shaft: left for a vector,
  // right for a component, so a vector and its component don't label the same spot.
  const side = style === 'main' ? 1 : -1;
  if (label) {
    // Other places to try, in order, when that spot is taken: the other side, further past the tip, beside the tip.
    const at = (along, across) => [x1 + ux * along + side * uy * across, y1 + uy * along - side * ux * across];
    vectorLabel(ctx, label, ...at(11, 10), color, 'center', 'middle', [at(11, -10), at(26, 10), at(26, -10), at(0, 24), at(0, -24), at(40, 0)]);
  }
}

/**
 * A vector resolved into components, drawn the way the textbooks do: each component as a thin
 * arrow from the same origin, and dashed construction lines from the vector's tip to the tip of
 * each component, closing the rectangle. `parts` are pixel offsets from the origin.
 */
export function drawComponents(ctx, x0, y0, tipX, tipY, parts, guide) {
  ctx.save();
  ctx.strokeStyle = guide;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  for (const q of parts) {
    if (Math.hypot(q.dx, q.dy) < 2) continue;
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(x0 + q.dx, y0 + q.dy);
  }
  ctx.stroke();
  ctx.restore();
  for (const q of parts) drawArrow(ctx, x0, y0, x0 + q.dx, y0 + q.dy, q.color, q.label, 'part');
}

/**
 * Name of a vector, as on its arrow: italic serif (the textbook convention) with a thin
 * white outline, so it stays readable over hatching, water or another arrow.
 */
export function vectorLabel(ctx, text, x, y, color, align = 'center', baseline = 'middle', alts = []) {
  // "F_fr", "υ₁": subscripts are set upright and smaller, as the textbooks do.
  const main = `italic 600 17px 'Times New Roman', 'STIX Two Text', Georgia, serif`;
  const small = `600 12px 'Times New Roman', 'STIX Two Text', Georgia, serif`;
  ctx.save();
  ctx.font = main;
  ctx.textAlign = 'left';
  const line = subText(ctx, text, small, 5), width = line.width, sub = line.sub;
  // An arrow that ends at the edge of the stage keeps its name on the stage: the name slides inward
  // instead of being cut. (An arrow that has left the stage altogether takes its name with it.)
  const t = ctx.getTransform(), flat = !t.b && !t.c && baseline === 'middle';
  const W = ctx.canvas.width / t.a, H = ctx.canvas.height / t.d, near = 30;
  const settle = (px, py) => {
    let l = align === 'center' ? px - width / 2 : align === 'right' || align === 'end' ? px - width : px;
    if (flat) {
      if (l + width > -near && l < W + near) l = Math.max(4, Math.min(l, W - width - 4));
      if (py > -near && py < H + near) py = Math.max(10, Math.min(py, H - 11));
    }
    return [l, py];
  };
  // The first of the offered places that is not on another label or on a body; the usual one if none is free.
  let [left, top] = settle(x, y);
  if (flat) {
    const fits = ([l, py]) => isFree(ctx, l - 1, py - 9, l + width + 1, py + (sub ? 12 : 9));
    if (!fits([left, top])) { const other = alts.map(([ax, ay]) => settle(ax, ay)).find(fits); if (other) [left, top] = other; }
    reserve(ctx, left - 1, top - 9, width + 2, sub ? 21 : 18);
  }
  y = top;
  ctx.textBaseline = baseline;
  ctx.lineJoin = 'round';
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = theme.halo; // plates are always white
  ctx.fillStyle = color;
  // The whole outline first, so a subscript's outline never covers the letter before it.
  line.draw(left, y, true);
  line.draw(left, y);
  ctx.restore();
}

/**
 * Finish flag on a pole standing at x on the ground line `groundY`: the place a moving object
 * reaches. The chequered cloth (5 × 3 squares of `sq` px) flies right of the pole, top at `topY`.
 */
export function drawFlag(ctx, x, groundY, topY, c, sq = 4) {
  const px = Math.round(x);
  const top = Math.round(topY);
  ctx.save();
  ctx.fillStyle = c.body;
  ctx.fillRect(px - 1, top - 2, 2, groundY - top + 2); // pole
  ctx.beginPath();
  ctx.arc(px, top - 3, 2.2, 0, Math.PI * 2); // knob
  ctx.fill();
  for (let r = 0; r < 3; r++)
    for (let q = 0; q < 5; q++) {
      ctx.fillStyle = (r + q) % 2 ? c.surface : c.body;
      ctx.fillRect(px + 1 + q * sq, top + r * sq, sq, sq);
    }
  ctx.strokeStyle = c.body;
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 1.5, top + 0.5, 5 * sq - 1, 3 * sq - 1);
  ctx.restore();
}

/** Font stacks for canvas text (canvas cannot resolve CSS variables). */
export const fonts = { mono: "'JetBrains Mono', ui-monospace, monospace", body: "'DM Sans', system-ui, sans-serif" };

export function refreshFonts(el) {
  const cs = getComputedStyle(el);
  const mono = cs.getPropertyValue('--font-mono').trim();
  const body = cs.getPropertyValue('--font-body').trim();
  if (mono) fonts.mono = mono;
  if (body) fonts.body = body;
}

/** Read the theme colour tokens used on canvases. */
export function readColors(el, names) {
  const cs = getComputedStyle(el);
  const out = {};
  for (const n of names) out[n] = cs.getPropertyValue(`--${n}`).trim() || '#888';
  return out;
}

/** Soft vertical sky gradient behind the scene (above `groundY` in pixels). */
export function drawSky(ctx, view, c, groundY) {
  const top = c['sky-top'], bottom = c['sky-bottom'];
  if (top === bottom) ctx.fillStyle = top; // both themes use one colour: no gradient object every frame
  else {
    const g = ctx.createLinearGradient(0, 0, 0, Math.max(1, groundY));
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
  }
  ctx.fillRect(0, 0, view.width, Math.max(0, groundY));
}

/**
 * Ground drawn the way physics diagrams show a fixed surface: a solid line with
 * dense diagonal hatching beneath it, over a soft earth fill. Hatching is pinned
 * to world x so it scrolls with the scene, not the screen.
 */
export function drawGround(ctx, view, c, groundY, x0 = 0, x1 = view.width) {
  ctx.fillStyle = c.ground;
  ctx.fillRect(x0, groundY, x1 - x0, view.height - groundY);
  drawHatch(ctx, x0, groundY, x1 - x0, 12, c.hatch, view.ox);
  ctx.strokeStyle = c.hatch;
  ctx.lineWidth = ink.scenery;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(x0, groundY + 1);
  ctx.lineTo(x1, groundY + 1);
  ctx.stroke();
}

/** Diagonal hatch lines (/////) inside a rectangle. */
export function drawHatch(ctx, x, y, w, h, color, anchor = 0, spacing = 7) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.lineWidth = ink.hatch;
  ctx.beginPath();
  const start = x - h - ((((x - anchor) % spacing) + spacing) % spacing);
  for (let px = start; px < x + w + h; px += spacing) {
    ctx.moveTo(px + h, y);
    ctx.lineTo(px, y + h);
  }
  ctx.stroke();
  ctx.restore();
}

/** Flat solid disc with a small square glint, so a ball reads as a drawn object, not a render. */
export function drawBall(ctx, x, y, r, c) {
  ctx.fillStyle = c.body;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  if (r >= 5) {
    const s = Math.max(2, r * 0.3);
    ctx.fillStyle = c['ball-hi'];
    ctx.fillRect(x - r * 0.45, y - r * 0.5, s, s);
  }
}

/** Contact shadow on the ground: a flat bar that shrinks and fades as the object rises. */
export function drawShadow(ctx, x, groundY, heightPx, width, c) {
  const k = Math.max(0.25, 1 - heightPx / 260);
  ctx.save();
  ctx.globalAlpha = k;
  ctx.fillStyle = c.shadow;
  ctx.fillRect(x - (width / 2) * k, groundY + 1, width * k, 3);
  ctx.restore();
}

/** Unicode subscript characters and the plain characters they stand for. */
const SUBS = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₐ': 'a', 'ₑ': 'e', 'ₒ': 'o', 'ₓ': 'x', 'ₘ': 'm', 'ₙ': 'n', 'ₛ': 's', 'ₜ': 't', 'ₚ': 'p', 'ₖ': 'k', 'ₗ': 'l', 'ᵢ': 'i', 'ⱼ': 'j', 'ᵧ': 'y' };

/**
 * Text with subscripts, set the way a book sets them: smaller and lower, but large enough to read. A
 * subscript is written either as "_" and the letters or digits after it ("F_A", "λ_max") or with Unicode
 * subscript characters ("υ₁", "m₂g"), whose own glyphs are only a few pixels tall in the site's fonts.
 * Uses the context's current font (or `small` for the subscripts) and expects textAlign 'left'. Returns the
 * width and a function that draws the text at (x, y), outlined instead of filled when `stroke` is set.
 */
export function subText(ctx, text, small, drop = 3) {
  const segs = [];
  let last = 0, width = 0;
  for (const m of text.matchAll(/_([\p{L}\p{N}]+)|([₀-₉ₐₑₒₓₘₙₛₜₚₖₗᵢⱼᵧ]+)/gu)) {
    if (m.index > last) segs.push([text.slice(last, m.index), false]);
    segs.push([m[1] ?? [...m[2]].map((ch) => SUBS[ch]).join(''), true]);
    last = m.index + m[0].length;
  }
  if (!segs.length) return { width: ctx.measureText(text).width, sub: false, draw: (x, y, stroke) => (stroke ? ctx.strokeText(text, x, y) : ctx.fillText(text, x, y)) };
  if (last < text.length) segs.push([text.slice(last), false]);
  const font = ctx.font;
  small ||= font.replace(/(\d+(?:\.\d+)?)px/, (_, n) => `${Math.round(n * 8) / 10}px`);
  for (const s of segs) { ctx.font = s[1] ? small : font; s[2] = ctx.measureText(s[0]).width + (s[1] ? 1 : 0); width += s[2]; }
  ctx.font = font;
  return {
    width,
    sub: true,
    draw(x, y, stroke) {
      for (const [str, sub, w] of segs) {
        ctx.font = sub ? small : font;
        if (stroke) ctx.strokeText(str, x + (sub ? 1 : 0), sub ? y + drop : y);
        else ctx.fillText(str, x + (sub ? 1 : 0), sub ? y + drop : y);
        x += w;
      }
      ctx.font = font;
    },
  };
}

/** fillText for text with subscripts (see subText), honouring the context's textAlign. */
export function fillSub(ctx, text, x, y) {
  const line = subText(ctx, text), align = ctx.textAlign;
  ctx.textAlign = 'left';
  line.draw(align === 'center' ? x - line.width / 2 : align === 'right' || align === 'end' ? x - line.width : x, y);
  ctx.textAlign = align;
}

/** Solid ink badge with white text: the way a figure on the page carries its number. */
export function label(ctx, text, x, y, c, align = 'center') {
  ctx.save();
  ctx.font = `700 12px ${fonts.mono}`;
  const line = subText(ctx, text), w = line.width + 16;
  const h = 22;
  let left = Math.round(align === 'center' ? x - w / 2 : align === 'right' ? x - w : x);
  // Never run off the stage: a long badge near an edge slides inward instead of being cut.
  const stageW = ctx.canvas.width / (ctx.getTransform().a || 1);
  left = Math.max(4, Math.min(left, stageW - Math.ceil(w) - 4));
  reserve(ctx, left, Math.round(y - h / 2), Math.ceil(w), h);
  ctx.fillStyle = c.fg;
  ctx.fillRect(left, Math.round(y - h / 2), Math.ceil(w), h);
  ctx.fillStyle = c.surface;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  line.draw(left + 8, y + 0.5);
  ctx.restore();
}

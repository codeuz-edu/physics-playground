import { num } from '../../core/format.js';
import { ink, label } from '../../ui/canvas.js';
import { hint } from '../kit.js';
import { K, chargeBall } from '../elec.js';

const B = { xMin: -50, xMax: 50, yMin: -30, yMax: 30 }, SPEED = 14; // cm, cm/s along the line
const PER_UC = 4; // field lines per microcoulomb, so the number of lines is proportional to |q|
const params = [
  { key: 'q1', symbol: 'q₁', unit: 'μC', min: -5, max: 5, step: 0.5, default: 2, kind: 'initial', decimals: 1, color: '--force' },
  { key: 'q2', symbol: 'q₂', unit: 'μC', min: -5, max: 5, step: 0.5, default: -2, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'd', symbol: 'd', unit: 'cm', min: 10, max: 60, step: 2, default: 40, kind: 'initial', decimals: 0 },
  { key: 'x0', symbol: 'x', unit: 'cm', min: -45, max: 45, step: 1, default: 0, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'y0', symbol: 'y', unit: 'cm', min: -25, max: 25, step: 1, default: 8, kind: 'initial', decimals: 0, color: '--pos' },
];
const srcs = (P) => [[-P.d / 2, P.q1], [P.d / 2, P.q2]].filter((s) => s[1] !== 0);
/** Field (V/m) and potential (V) at (x, y) cm. */
function field(P, x, y) {
  let ex = 0, ey = 0, phi = 0;
  for (const [sx, q] of srcs(P)) { const dx = (x - sx) / 100, dy = y / 100, r = Math.hypot(dx, dy) || 1e-9, k = (K * q * 1e-6) / (r * r * r); ex += k * dx; ey += k * dy; phi += (K * q * 1e-6) / r; }
  return { ex, ey, E: Math.hypot(ex, ey), phi };
}
/** One field line from the charge at sx, started at angle a; dir = 1 runs along E, −1 against it. Points are returned in the direction of E. */
function trace(P, sx, a, dir) {
  let x = sx + 2.5 * Math.cos(a), y = 2.5 * Math.sin(a), end = 'out'; const pts = [[x, y]];
  for (let k = 0; k < 400; k++) {
    const f = field(P, x, y); if (f.E < 1e-6) { end = 'null'; break; }
    x += (dir * 0.9 * f.ex) / f.E; y += (dir * 0.9 * f.ey) / f.E; pts.push([x, y]);
    if (x < B.xMin - 5 || x > B.xMax + 5 || y < B.yMin - 5 || y > B.yMax + 5) break;
    const hit = srcs(P).find(([s]) => Math.hypot(x - s, y) < 2); if (hit) { end = hit[1] > 0 ? 'pos' : 'neg'; break; }
  }
  if (dir < 0) pts.reverse();
  // Arrowhead half-way along the part of the line inside the box, pointing along E.
  const inB = ([px, py]) => px >= B.xMin && px <= B.xMax && py >= B.yMin && py <= B.yMax;
  let total = 0; for (let i = 1; i < pts.length; i++) if (inB(pts[i - 1]) && inB(pts[i])) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let arrow = null;
  if (total > 4) {
    let acc = 0;
    for (let i = 1; i < pts.length && !arrow; i++) {
      if (!(inB(pts[i - 1]) && inB(pts[i]))) continue;
      const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1], d = Math.hypot(dx, dy);
      if (acc + d >= total / 2 && d > 0) { const f = (total / 2 - acc) / d; arrow = [pts[i - 1][0] + dx * f, pts[i - 1][1] + dy * f, dx / d, dy / d]; }
      acc += d;
    }
  }
  return { pts, end, arrow };
}
/**
 * Field lines: PER_UC·|q| lines leave every positive charge; every negative charge sends PER_UC·|q| lines back
 * against E, and those that run into a positive charge are dropped (that line is already drawn from there).
 * So the number of lines on each charge is proportional to |q|.
 */
function lines(P) {
  const out = [];
  for (const [sx, q] of srcs(P)) {
    const n = Math.max(2, Math.round(PER_UC * Math.abs(q))), dir = q > 0 ? 1 : -1;
    // Start angles half a step off the axis, so the set (and the picture) is mirror-symmetric about the line through the charges, as the field is.
    for (let i = 0; i < n; i++) { const t = trace(P, sx, ((i + 0.5) / n) * Math.PI * 2, dir); if (dir < 0 && t.end === 'pos') continue; out.push(t); }
  }
  return out;
}
/**
 * Path of a real positive charge released from rest at (x0, y0): m·a = qE. From rest its shape does not depend on q/m
 * (that only sets how fast it is run), so it is integrated in scaled time with a step of at most ~0.2 cm.
 */
function freePath(P, x0, y0) {
  const f0 = field(P, x0, y0); if (f0.E < 50) return [];
  const k = 1 / f0.E, pts = [[x0, y0]]; let x = x0, y = y0, vx = 0, vy = 0, ax = f0.ex * k, ay = f0.ey * k, len = 0, last = pts[0];
  for (let n = 0; n < 40000; n++) {
    const h = 0.2 / (Math.hypot(vx, vy) + Math.sqrt(0.1 * Math.hypot(ax, ay)) + 1e-12);
    const nx = x + vx * h + 0.5 * ax * h * h, ny = y + vy * h + 0.5 * ay * h * h, f = field(P, nx, ny), bx = f.ex * k, by = f.ey * k;
    vx += 0.5 * (ax + bx) * h; vy += 0.5 * (ay + by) * h; len += Math.hypot(nx - x, ny - y); x = nx; y = ny; ax = bx; ay = by;
    const stop = srcs(P).some(([sx, q]) => q < 0 && Math.hypot(x - sx, y) < 2.5) || x < B.xMin || x > B.xMax || y < B.yMin || y > B.yMax || len > 600 || !Number.isFinite(x + y);
    if (stop || Math.hypot(x - last[0], y - last[1]) > 0.5) { if (Number.isFinite(x + y)) pts.push([x, y]); last = [x, y]; }
    if (stop) break;
  }
  return pts;
}

/**
 * A tracer point (not a charge) slides at constant speed along the field line through its start point, so the panel can
 * show E and φ along the line. `free` is the path a real charge released there from rest would take.
 * The trail is append-only and shared by snapshots: a clone keeps only its length `trailN`.
 */
class FieldModel {
  t = 0; x = 0; y = 0; E = 0; phi = 0; E0 = 0; phi0 = 0; reason = ''; P = null; trail = []; trailN = 0; lines = []; free = [];
  reset(P) {
    this.P = { ...P }; this.t = 0; this.x = P.x0; this.y = P.y0; this.reason = ''; this.trail = [[this.x, this.y]]; this.trailN = 1; this.lines = lines(P);
    const f = field(P, this.x, this.y); this.E0 = f.E; this.phi0 = f.phi; this.E = f.E; this.phi = f.phi;
    if (srcs(P).some(([s]) => Math.hypot(this.x - s, this.y) < 2.5)) this.reason = 'on';
    this.free = this.reason ? [] : freePath(P, this.x, this.y);
  }
  /** Append to the shared trail; a model whose trail was extended by another copy takes its own copy first. */
  addPoint(pt) { if (this.trail.length !== this.trailN) this.trail = this.trail.slice(0, this.trailN); this.trail.push(pt); this.trailN++; }
  step(dt) {
    if (this.reason) return false;
    const n = 6, h = (SPEED * dt) / n;
    for (let i = 0; i < n; i++) {
      const f = field(this.P, this.x, this.y);
      if (f.E < 50) { this.reason = 'zero'; break; }
      this.x += (h * f.ex) / f.E; this.y += (h * f.ey) / f.E;
      if (srcs(this.P).some(([s, q]) => q < 0 && Math.hypot(this.x - s, this.y) < 2.5)) { this.reason = 'sink'; break; }
      if (this.x < B.xMin || this.x > B.xMax || this.y < B.yMin || this.y > B.yMax) { this.reason = 'out'; break; }
    }
    this.t += dt; if (!this.reason && this.t > 20) this.reason = 'time';
    this.addPoint([this.x, this.y]);
    const f = field(this.P, this.x, this.y); this.E = f.E; this.phi = f.phi;
    return !this.reason;
  }
  isValid() { return [this.x, this.y, this.E].every(Number.isFinite); }
  sample() { return { E: this.E / 1000, phi: this.phi / 1000, x: this.x, y: this.y }; }
  clone() { return Object.assign(new FieldModel(), this, { P: { ...this.P } }); }
  finishMessage(text) {
    if (!this.reason) return '';
    const z = (v) => (Math.abs(v) < 1e-6 ? 0 : v);
    return text.msg.start(num(z(this.E0) / 1000, 1), num(z(this.phi0) / 1000, 1), text.msg.why[this.reason]);
  }
}

export default {
  id: 'efield',
  params,
  presets: [
    { values: { q1: 2, q2: -2, d: 40, x0: 0, y0: 0 } },
    { values: { q1: 2, q2: 2, d: 40, x0: 0, y0: 0 } },
    { values: { q1: 3, q2: 0, d: 40, x0: 10, y0: 0 } },
    { values: { q1: 2, q2: -2, d: 40, x0: -14, y0: 6 } },
  ],
  toggles: [{ key: 'lines', default: true }, { key: 'grid', default: false }, { key: 'free', default: false }],
  readouts: [
    { key: 'E', unit: 'kN/C', decimals: 1, color: '--force' },
    { key: 'phi', unit: 'kV', decimals: 1, color: '--acc' },
  ],
  graphs: [
    { id: 'E', unit: 'kN/C', series: [{ key: 'E', color: '--force' }] },
    { id: 'phi', unit: 'kV', series: [{ key: 'phi', color: '--acc' }] },
  ],
  createModel: () => new FieldModel(),
  worldBounds: () => B,
  lengthUnit: 'cm',
  viewPadding: { left: 16, right: 16, top: 40, bottom: 16 },

  draw({ ctx, view, model: m, params: p, toggles, colors: c, text }) {
    const X = (x) => view.px(x), Y = (y) => view.py(y);
    // A caption on a plate of the background colour, so the field lines and vectors under it do not strike through it.
    const plate = (t, x, y, align = 'center') => { ctx.save(); ctx.font = '500 12px Barlow, sans-serif'; const w = ctx.measureText(t).width, l = align === 'center' ? x - w / 2 : Math.max(4, Math.min(x, view.width - w - 4)); ctx.fillStyle = c.surface; ctx.fillRect(l - 3, y - 8, w + 6, 16); ctx.restore(); hint(ctx, t, x, y, c, align); };
    ctx.save(); ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.strokeRect(X(B.xMin), Y(B.yMax), X(B.xMax) - X(B.xMin), Y(B.yMin) - Y(B.yMax)); ctx.restore();
    if (toggles.lines) {
      ctx.save(); ctx.beginPath(); ctx.rect(X(B.xMin), Y(B.yMax), X(B.xMax) - X(B.xMin), Y(B.yMin) - Y(B.yMax)); ctx.clip(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1;
      for (const { pts } of m.lines) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke(); }
      // Arrowheads show the direction of E along each line.
      ctx.fillStyle = c.muted;
      for (const { arrow } of m.lines) {
        if (!arrow) continue;
        const [ax, ay, ux, uy] = arrow, px = X(ax), py = Y(ay), vx = ux, vy = -uy, hl = ink.headPart, hw = hl * 0.45;
        ctx.beginPath(); ctx.moveTo(px + vx * hl * 0.5, py + vy * hl * 0.5); ctx.lineTo(px - vx * hl * 0.5 - vy * hw, py - vy * hl * 0.5 + vx * hw); ctx.lineTo(px - vx * hl * 0.5 + vy * hw, py - vy * hl * 0.5 - vx * hw); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    if (toggles.grid) {
      ctx.save(); ctx.strokeStyle = c.accent; ctx.lineWidth = 1.25;
      for (let gx = -45; gx <= 45; gx += 7.5) for (let gy = -25; gy <= 25; gy += 7.5) {
        const f = field(p, gx, gy); if (f.E < 1) continue;
        const L = Math.min(14, 3 + 2.2 * Math.log10(f.E / 1000 + 1) * 3), ux = f.ex / f.E, uy = -f.ey / f.E, x = X(gx), y = Y(gy);
        ctx.beginPath(); ctx.moveTo(x - ux * L / 2, y - uy * L / 2); ctx.lineTo(x + ux * L / 2, y + uy * L / 2);
        ctx.lineTo(x + ux * L / 2 - (ux * 4 - uy * 3), y + uy * L / 2 - (uy * 4 + ux * 3)); ctx.stroke();
      }
      ctx.restore();
    }
    if (toggles.free && m.free.length > 1) {
      ctx.save(); ctx.beginPath(); ctx.rect(X(B.xMin), Y(B.yMax), X(B.xMax) - X(B.xMin), Y(B.yMin) - Y(B.yMax)); ctx.clip();
      ctx.strokeStyle = c.vel; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); m.free.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke(); ctx.restore();
      const [hx, hy] = m.free[Math.floor(m.free.length / 2)]; plate(text.draw.free, X(hx) + 8, Y(hy) - 10, 'left');
    }
    const n = Math.min(m.trailN, m.trail.length);
    ctx.save(); ctx.strokeStyle = c.force; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < n; i++) { const [x, y] = m.trail[i]; i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); } ctx.stroke(); ctx.restore();
    for (const [sx, q] of [[-p.d / 2, p.q1], [p.d / 2, p.q2]]) if (q !== 0) { chargeBall(ctx, X(sx), Y(0), 11, q, c); plate(`${num(q, 1)} μC`, X(sx), Y(0) + 24); }
    ctx.save(); ctx.fillStyle = c.surface; ctx.strokeStyle = c.force; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(m.x), Y(m.y), 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    label(ctx, `E = ${num(m.E / 1000, 1)} kN/C,  φ = ${num(Math.abs(m.phi) < 1e-6 ? 0 : m.phi / 1000, 1)} kV`, 12, 20, c, 'left');
  },
};

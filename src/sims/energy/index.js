import { num } from '../../core/format.js';
import { drawArrow, drawComponents, drawHatch, drawSky, fillSub, fonts, label, reserve } from '../../ui/canvas.js';
import { drawCart } from '../cart.js';
import { CREST, EnergyModel, L1, L2, params, PLATEAU, trackDeriv, trackY } from './model.js';

const objScale = (view) => Math.min(1.6, Math.max(0.9, view.height / 420));
const V_PX = 9; // px per m/s on the velocity arrow (× objScale)

export default {
  id: 'energy',
  params,
  stageSize: 'tall',
  viewPadding: { left: 16, right: 16, top: 56, bottom: 20 },
  presets: [
    { values: { h: 5, v0: 0, H: 3, m: 2, mu: 0 } },
    { values: { h: 3, v0: 0, H: 4, m: 2, mu: 0 } },
    { values: { h: 4, v0: 0, H: 4, m: 2, mu: 0 } },
    { values: { h: 2, v0: 7.7, H: 5, m: 2, mu: 0 } },
    { values: { h: 5, v0: 0, H: 3, m: 2, mu: 0.1 } },
  ],
  toggles: [
    { key: 'bars', default: true },
    { key: 'vel', default: true },
    { key: 'vcomp', default: false },
    { key: 'levels', default: true },
  ],
  readouts: [
    { key: 'ke', unit: 'J', decimals: 1, color: '--vel' },
    { key: 'pe', unit: 'J', decimals: 1, color: '--pos' },
    { key: 'e', unit: 'J', decimals: 1 },
    { key: 'v', unit: 'm/s', decimals: 2, color: '--vel' },
  ],
  graphs: [
    {
      id: 'energy',
      yLabel: 'E',
      unit: 'J',
      series: [
        { key: 'ke', color: '--vel' },
        { key: 'pe', color: '--pos' },
        { key: 'e', color: '--fg' },
        { key: 'loss', color: '--friction' },
      ],
    },
    { id: 'v', yLabel: 'υ', unit: 'm/s', series: [{ key: 'v', color: '--vel' }] },
  ],
  createModel: () => new EnergyModel(),
  worldBounds: (p) => ({ xMin: -PLATEAU - 0.4, xMax: L1 + L2 + 2.6, yMin: -1.3, yMax: Math.max(4, p.h * CREST, p.H) + 1.1 }),

  draw({ ctx, view, model, params: p, toggles, colors, text }) {
    const m = model ;
    const k = objScale(view);
    const gy = view.py(0);
    drawSky(ctx, view, colors, view.height);

    // Rails: the track line with hatched earth beneath it, right across the stage.
    const xl = view.wx(0);
    const xr = view.wx(view.width);
    const n = Math.max(60, Math.round(view.width / 3));
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const x = xl + ((xr - xl) * i) / n;
      const px = view.px(x);
      const py = view.py(trackY(x, p.h, p.H));
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.lineTo(view.width, view.height);
    ctx.lineTo(0, view.height);
    ctx.closePath();
    ctx.save();
    ctx.fillStyle = colors.ground;
    ctx.fill();
    ctx.clip();
    // A hatched band just under the rails, as under a drawn ground line; the rest stays plain.
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const x = xl + ((xr - xl) * i) / n;
      ctx.lineTo(view.px(x), view.py(trackY(x, p.h, p.H)) - 1);
    }
    for (let i = n; i >= 0; i--) {
      const x = xl + ((xr - xl) * i) / n;
      ctx.lineTo(view.px(x), view.py(trackY(x, p.h, p.H)) + 13);
    }
    ctx.closePath();
    ctx.clip();
    drawHatch(ctx, 0, 0, view.width, view.height, colors.hatch, view.ox, 7);
    ctx.restore();
    ctx.strokeStyle = colors.hatch;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const x = xl + ((xr - xl) * i) / n;
      const px = view.px(x);
      const py = view.py(trackY(x, p.h, p.H));
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Height lines for h and H, from the ground up, as in the textbook figure.
    if (toggles.levels) {
      ctx.strokeStyle = colors.ghost;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      for (const [x, y, name] of [
        [0, p.h, 'h'],
        [L1 + L2, p.H, 'H'],
      ] ) {
        const px = Math.round(view.px(x)) + 0.5;
        ctx.beginPath();
        ctx.moveTo(px, gy);
        ctx.lineTo(px, view.py(y));
        ctx.stroke();
        // Beside its line, on whichever side has room (the start line can sit near the left edge). On a narrow
        // stage the slopes run close over the whole line, so the name goes under its foot, in the earth.
        const leftSide = name === 'h' ? px > 96 : px > view.width - 96;
        if (y > 0.3 && view.width >= 560) label(ctx, `${name} = ${num(y, 1)} m`, px + (leftSide ? -8 : 8), (gy + view.py(y)) / 2, colors, leftSide ? 'right' : 'left');
        else if (y > 0.3) label(ctx, `${name} = ${num(y, 1)} m`, px, gy + 14, colors, 'center');
      }
      // Ground level, so the heights have something to be measured from.
      ctx.beginPath();
      ctx.moveTo(0, Math.round(gy) + 0.5);
      ctx.lineTo(view.width, Math.round(gy) + 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Energy bars: one scale (E₀) for all three, so the bars add up to the first one's height. The box hangs
    // over the dip between the hills, where the rails are lowest, and ends above the rails and the cart there;
    // it is drawn before the cart so that the name of the velocity stays off it.
    if (toggles.bars) {
      const s = m.sample();
      const E0 = Math.max(1e-9, s.e + s.loss);
      const bw = 18 * k, step = bw + 14 * k, boxW = 3 * step + 14;
      const left = Math.max(8, Math.min(view.width - boxW - 8, view.px(L1) - boxW / 2));
      let rail = 0;
      for (let i = 0; i <= 12; i++) rail = Math.max(rail, trackY(view.wx(left + (boxW * i) / 12), p.h, p.H));
      const top = 8, room = view.py(rail) - 34 * k - top;
      const bh = Math.max(24, Math.min(120 * k, view.height * 0.24, room - 64));
      const bx = left + 12, by = top + 38 + bh;
      ctx.save();
      ctx.fillStyle = colors.surface;
      ctx.beginPath();
      ctx.rect(left, top, boxW, bh + 64);
      ctx.fill();
      ctx.strokeStyle = colors.fg;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      reserve(ctx, left, top, boxW, bh + 64);
      const bars = [
        [s.ke, colors.vel, 'Eₖ'],
        [s.pe, colors.pos, 'Eₚ'],
        [s.loss, colors.friction, text.draw.work],
      ];
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      bars.forEach(([val, color, name], i) => {
        const x = bx + i * step;
        const hpx = (Math.max(0, val) / E0) * bh;
        ctx.strokeStyle = colors.line;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, by - bh + 0.5, bw, bh);
        ctx.fillStyle = color;
        ctx.fillRect(x, by - hpx, bw, hpx);
        ctx.fillStyle = colors.fg;
        ctx.font = `600 12px ${fonts.body}`;
        fillSub(ctx, name, x + bw / 2, by + 4);
        ctx.fillStyle = colors.muted;
        ctx.font = `12px ${fonts.mono}`;
        ctx.fillText(num(val, 0), x + bw / 2, by - bh - 16);
      });
      // What the numbers are: energies in joules.
      ctx.textAlign = 'left';
      ctx.fillStyle = colors.muted;
      ctx.font = `500 12px ${fonts.body}`;
      ctx.fillText('E, J', left + 8, top + 5);
      ctx.restore();
    }

    // The cart, sitting on the rails, tilted with them.
    const cx = view.px(m.x);
    const cy = view.py(m.y);
    const ang = -m.angle; // screen y points down
    const W = 40 * k;
    const H = 20 * k;
    drawCart(ctx, cx, cy, W, H, colors, ang);

    // Velocity along the rails.
    if (toggles.vel && Math.abs(m.v) > 0.05) {
      const [yp] = trackDeriv(m.x, p.h, p.H);
      const c = 1 / Math.sqrt(1 + yp * yp);
      const ux = c;
      const uy = -yp * c;
      const ox = cx - Math.sin(ang) * (H + 12 * k) * -1;
      const oy = cy - Math.cos(ang) * (H + 12 * k);
      const dx = ux * m.v * V_PX * k;
      const dy = uy * m.v * V_PX * k;
      if (toggles.vcomp) {
        drawComponents(
          ctx,
          ox,
          oy,
          ox + dx,
          oy + dy,
          [
            { dx, dy: 0, color: colors.vx, label: 'υₓ' },
            { dx: 0, dy, color: colors.vy, label: 'υᵧ' },
          ],
          colors.ghost,
        );
      }
      drawArrow(ctx, ox, oy, ox + dx, oy + dy, colors.vel, 'υ');
    }

    // Drag cues, where the stage has room for them.
    if (m.t === 0 && view.width >= 560) {
      ctx.fillStyle = colors.muted;
      ctx.font = `500 12px ${fonts.body}`;
      // Under the cart, inside the plain ground, where nothing else is drawn.
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      // Above the cart, in the open sky, clear of the track hatching.
      ctx.textBaseline = 'bottom';
      const cue = text.draw.dragCart; // one string per line, the last one just above the cart
      cue.forEach((line, i) => ctx.fillText(line, cx - 10, cy - 26 * k - 10 - 14 * (cue.length - 1 - i)));
      ctx.textBaseline = 'top';
      const tx = view.px(L1 + L2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(text.draw.dragCrest, tx - 14, view.py(p.H) - 12);
    }
    // Hill crest handle.
    ctx.fillStyle = colors.surface;
    ctx.strokeStyle = colors.fg;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    ctx.arc(view.px(L1 + L2), view.py(p.H), 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  },

  drag: {
    hit(x, y, model, p, view) {
      const m = model ;
      const near = (wx, wy, r) => Math.hypot(view.px(x) - view.px(wx), view.py(y) - view.py(wy)) < r;
      if (near(L1 + L2, p.H, 18)) return 'crest';
      if (m.t === 0 && near(m.x, m.y + 0.3, 34)) return 'cart';
      return null;
    },
    move(handle, _x, y) {
      return handle === 'crest' ? { H: y } : { h: y };
    },
  },
};

import { num } from '../../core/format.js';
import { rk4 } from '../../core/integrators.js';


import { G } from '../friction.js';

/**
 * The track: a cosine hill whose crest is just behind the start, a dip down to the ground
 * at x = L1, a cosine rise up a second hill of height H, then level rails. The cart starts
 * at x = 0, a little below the first crest, so it is on a slope and rolls off from rest.
 */
export const L1 = 8; // m, from the start to the bottom of the dip
export const L2 = 8; // m, horizontal length of the second hill
export const XS = 1.2; // m, the first crest is this far behind the start
export const PLATEAU = XS + 1.2; // m, where the level rails behind the first crest end
/** Height of the first crest for a start height of 1. */
export const CREST = 2 / (1 + Math.cos((Math.PI * XS) / (L1 + XS)));
export const T_MAX = 20; // s

export const params = [
  { key: 'h', symbol: 'h', unit: 'm', min: 0, max: 10, step: 0.1, default: 5, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'v0', symbol: 'υ₀', unit: 'm/s', min: 0, max: 10, step: 0.1, default: 0, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'H', symbol: 'H', unit: 'm', min: 0, max: 10, step: 0.1, default: 3, kind: 'initial', decimals: 1 },
  { key: 'm', symbol: 'm', unit: 'kg', min: 0.5, max: 10, step: 0.5, default: 2, kind: 'initial', decimals: 1 },
  { key: 'mu', symbol: 'μ', unit: '', min: 0, max: 0.3, step: 0.01, default: 0, kind: 'live', decimals: 2, color: '--friction' },
];

/** Height of the rails at x. */
export function trackY(x, h, H) {
  if (x <= -XS) return h * CREST;
  if (x <= L1) return (h * CREST * (1 + Math.cos((Math.PI * (x + XS)) / (L1 + XS)))) / 2;
  if (x <= L1 + L2) return (H * (1 - Math.cos((Math.PI * (x - L1)) / L2))) / 2;
  return H;
}

/** Slope dy/dx and curvature d²y/dx² of the rails at x. */
export function trackDeriv(x, h, H) {
  if (x <= -XS || x >= L1 + L2) return [0, 0];
  if (x <= L1) {
    const k = Math.PI / (L1 + XS);
    const a = h * CREST;
    return [(-a * k * Math.sin(k * (x + XS))) / 2, (-a * k * k * Math.cos(k * (x + XS))) / 2];
  }
  const k = Math.PI / L2;
  const u = x - L1;
  return [(H * k * Math.sin(k * u)) / 2, (H * k * k * Math.cos(k * u)) / 2];
}

/**
 * A cart on rails shaped like a dip and a hill, moving under gravity and sliding friction.
 * Along the rails (speed υ, positive towards +x) Newton's second law gives
 *   dυ/dt = −g sin θ − μ |N|/m · sign υ,  N/m = g cos θ + κ υ²,
 * where θ is the slope angle and κ the curvature (the rails hold the cart, so N may point
 * either way). With μ = 0 the mechanical energy ½mυ² + mgy is conserved exactly, so the
 * speed at any height follows from energy alone, whatever the shape of the track.
 */
export class EnergyModel  {
  t = 0;
  x = 0;
  v = 0;
  /** Highest point reached on the second hill. */
  hmax = 0;
  crossed = false;
  /** Mechanical energy lost to friction so far, J. */
  loss = 0;
   E0 = 0;
   h = 0;
   H = 0;
   m = 1;
   reason = null;

  reset(p) {
    this.t = 0;
    this.x = 0;
    this.v = p.v0;
    this.h = p.h;
    this.H = p.H;
    this.m = p.m;
    this.hmax = 0;
    this.loss = 0;
    this.crossed = false;
    this.reason = null;
    this.E0 = this.energy();
  }

  get y() {
    return trackY(this.x, this.h, this.H);
  }

  /** Slope angle of the rails under the cart, radians (positive = rising towards +x). */
  get angle() {
    return Math.atan(trackDeriv(this.x, this.h, this.H)[0]);
  }

   energy() {
    return 0.5 * this.m * this.v * this.v + this.m * G * this.y;
  }

  /** Normal force per unit mass at (x, υ): gravity's part plus the centripetal part. */
   normal(x, v) {
    const [yp, ypp] = trackDeriv(x, this.h, this.H);
    const c = 1 / Math.sqrt(1 + yp * yp);
    return G * c + ypp * c * c * c * v * v;
  }

  step(dt, p) {
    if (this.reason) return false;
    // Nothing to set it moving: at rest on level rails (h = 0, υ₀ = 0).
    if (this.t === 0 && this.v === 0 && trackDeriv(this.x, this.h, this.H)[0] === 0) return this.stop('still');
    const mu = p.mu;
    // State (x, υ, work against friction). The work is integrated with the motion, at the rate
    // μ|N|·|υ|, so the books E₀ − A match ½mυ² + mgy to the integrator's accuracy.
    const f = (_t, s) => {
      const [x, v] = s;
      const [yp] = trackDeriv(x, this.h, this.H);
      const c = 1 / Math.sqrt(1 + yp * yp);
      const sin = yp * c;
      const n = mu * Math.abs(this.normal(x, v));
      return [v * c, -G * sin - n * Math.sign(v), n * this.m * Math.abs(v)];
    };
    const [x0, v0] = [this.x, this.v];
    // Friction brings the cart to rest within this step, and can hold it there: stop it exactly.
    // (Stepping through υ = 0 with RK4 instead can freeze a slow cart at a few mm/s, because the
    // friction term flips sign between the stages and cancels.)
    if (mu > 0 && v0 !== 0) {
      const [yp] = trackDeriv(x0, this.h, this.H);
      const c = 1 / Math.sqrt(1 + yp * yp);
      const decel = G * yp * c * Math.sign(v0) + mu * Math.abs(this.normal(x0, v0));
      if (decel > 0 && Math.abs(v0) <= decel * dt && Math.abs(G * yp * c) <= mu * Math.abs(this.normal(x0, 0))) {
        const tau = Math.abs(v0) / decel;
        this.x = x0 + (v0 * c * tau) / 2;
        this.v = 0;
        this.t += tau;
        this.loss = this.E0 - this.energy();
        return this.stop('rest');
      }
    }
    const [x1, v1, w1] = rk4(f, this.t, [x0, v0, 0], dt);
    // Work done against friction over this step.
    const work = () => (mu === 0 ? 0 : w1);
    const end = L1 + L2;
    if (x1 >= end) {
      // Interpolate to the moment the cart reaches the top of the hill.
      const k = (end - x0) / (x1 - x0);
      this.t += k * dt;
      this.x = end;
      this.v = v0 + (v1 - v0) * k;
      this.crossed = true;
      this.hmax = this.H;
      this.loss += work() * k;
      return this.stop('crossed');
    }
    if (x1 <= -PLATEAU) {
      this.x = -PLATEAU;
      this.v = v1;
      this.t += dt;
      return this.stop('back');
    }
    // Friction reversed the velocity across the step and can now hold the cart: it stops.
    if (mu > 0 && v0 !== 0 && Math.sign(v1) !== Math.sign(v0)) {
      const [yp] = trackDeriv(x1, this.h, this.H);
      const c = 1 / Math.sqrt(1 + yp * yp);
      if (Math.abs(G * yp * c) <= mu * Math.abs(this.normal(x1, 0))) {
        this.x = x1;
        this.v = 0;
        this.t += dt;
        // At rest the books balance exactly: everything not left as height is gone.
        this.loss = this.E0 - this.energy();
        return this.stop('rest');
      }
    }
    this.x = x1;
    this.v = v1;
    this.t += dt;
    this.loss += work();
    if (this.x > L1) this.hmax = Math.max(this.hmax, this.y);
    if (this.t >= T_MAX - 1e-9) return this.stop('time');
    return true;
  }

   stop(reason) {
    this.reason = reason;
    return false;
  }

  isValid() {
    return [this.t, this.x, this.v, this.loss].every(Number.isFinite);
  }

  sample() {
    const ke = 0.5 * this.m * this.v * this.v;
    const pe = this.m * G * this.y;
    // The total is kept by the books (E₀ minus the work of friction), not by the integrator,
    // so it is exactly constant without friction and only ever falls with it.
    const e = this.E0 - this.loss;
    return { x: this.x, y: this.y, v: this.v, ke, pe, e, loss: this.loss, hmax: this.hmax };
  }

  clone() {
    return Object.assign(new EnergyModel(), this);
  }

  /** The run's outcome in words; `text` is this simulation's text (sims/energy/<locale>.js). */
  finishMessage(text) {
    const msg = text.msg;
    if (this.reason === 'crossed') return msg.crossed(num(this.t, 2), num(Math.abs(this.v), 2));
    if (this.reason === 'back') return msg.back(num(this.hmax, 2));
    if (this.reason === 'rest') return msg.rest(num(this.t, 2), num(this.y, 2), num(this.loss, 1));
    if (this.reason === 'still') return msg.still;
    if (this.reason === 'time') return msg.time(T_MAX, num(this.hmax, 2));
    return '';
  }
}

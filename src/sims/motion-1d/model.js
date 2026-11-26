import { num } from '../../core/format.js';

export const TRACK_LENGTH = 100; // m
export const T_MAX = 60; // s

export const params = [
  { key: 'x0', symbol: 'x₀', unit: 'm', min: 0, max: TRACK_LENGTH, step: 0.5, default: 10, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'v0', symbol: 'υ₀', unit: 'm/s', min: -20, max: 20, step: 0.5, default: 4, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'a', symbol: 'a', unit: 'm/s²', min: -5, max: 5, step: 0.1, default: 1, kind: 'live', decimals: 1, color: '--acc' },
];

/**
 * A car on a straight 100 m track with constant (but adjustable) acceleration.
 *
 * Within one step the acceleration is constant, so the update below is exact:
 * x(t+dt) = x + v·dt + ½·a·dt²,  v(t+dt) = v + a·dt.
 * The run ends when the car reaches either end of the track or after T_MAX.
 */
export class Motion1DModel  {
  t = 0;
  x = 0;
  v = 0;
  a = 0;
   reason = null;

  reset(p) {
    this.t = 0;
    this.x = p.x0;
    this.v = p.v0;
    this.a = p.a;
    this.reason = null;
  }

  step(dt, p) {
    if (this.reason) return false;
    this.a = p.a;
    const { x, v, a } = this;

    // Starting on an end and moving outward: nothing to simulate.
    if ((x <= 0 && v < 0) || (x <= 0 && v === 0 && a < 0)) return this.stop('start', 0);
    if ((x >= TRACK_LENGTH && v > 0) || (x >= TRACK_LENGTH && v === 0 && a > 0)) return this.stop('end', TRACK_LENGTH);

    const xNew = x + v * dt + 0.5 * a * dt * dt;
    if (xNew > TRACK_LENGTH || xNew < 0) {
      const bound = xNew > TRACK_LENGTH ? TRACK_LENGTH : 0;
      const tau = firstRoot(0.5 * a, v, x - bound, dt);
      this.t += tau;
      this.x = bound;
      this.v = v + a * tau;
      return this.stop(bound === 0 ? 'start' : 'end', bound);
    }

    this.x = xNew;
    this.v = v + a * dt;
    this.t += dt;
    if (this.t >= T_MAX - 1e-9) return this.stop('time', this.x);
    return true;
  }

   stop(reason, x) {
    this.reason = reason;
    this.x = x;
    return false;
  }

  isValid() {
    return Number.isFinite(this.x) && Number.isFinite(this.v) && Number.isFinite(this.a) && Number.isFinite(this.t);
  }

  sample() {
    return { x: this.x, v: this.v, a: this.a };
  }

  clone() {
    return Object.assign(new Motion1DModel(), this);
  }

  /** `text` is the simulation's text object (sims/motion-1d/<locale>.js). */
  finishMessage(text) {
    const t = num(this.t, 2);
    const speed = num(Math.abs(this.v), 2);
    switch (this.reason) {
      case 'end':
        return text.msg.reached(t, TRACK_LENGTH, speed);
      case 'start':
        return text.msg.reached(t, 0, speed);
      case 'time':
        return text.msg.timeUp(T_MAX);
      default:
        return '';
    }
  }
}

/**
 * Smallest root in (0, dtMax] of  A·τ² + B·τ + C = 0.
 * Falls back to dtMax if none is found (numerical edge cases).
 */
export function firstRoot(A, B, C, dtMax) {
  const eps = 1e-12;
  const roots = [];
  if (Math.abs(A) < eps) {
    if (Math.abs(B) > eps) roots.push(-C / B);
  } else {
    const disc = B * B - 4 * A * C;
    if (disc >= 0) {
      const s = Math.sqrt(disc);
      // Numerically stable quadratic formula.
      const q = -0.5 * (B + Math.sign(B || 1) * s);
      roots.push(q / A);
      if (Math.abs(q) > eps) roots.push(C / q);
    }
  }
  let best = dtMax;
  for (const r of roots) if (r >= -1e-12 && r <= dtMax + 1e-12 && r < best) best = Math.max(0, r);
  return best;
}

import { num } from '../../core/format.js';
import { rk4 } from '../../core/integrators.js';
import { firstRoot } from '../motion-1d/model.js';

export const T_MAX = 60; // s

export const params = [
  { key: 'h0', symbol: 'h₀', unit: 'm', min: 0, max: 100, step: 0.5, default: 20, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'v0', symbol: 'υ₀', unit: 'm/s', min: -30, max: 30, step: 0.5, default: 0, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'g', symbol: 'g', unit: 'm/s²', min: 0.5, max: 25, step: 0.01, default: 9.81, kind: 'live', decimals: 2, color: '--acc' },
  // k of the drag law a = −k|υ|υ (terminal speed √(g/k)): 0 switches drag off, 0.02 1/m gives about 22 m/s.
  { key: 'k', symbol: 'k', unit: '1/m', min: 0, max: 0.05, step: 0.001, default: 0, kind: 'live', decimals: 3 },
];

/** Closed-form results without drag (tests, view bounds). */
export function idealFall(h0, v0, g) {
  const flightTime = (v0 + Math.sqrt(v0 * v0 + 2 * g * h0)) / g;
  const maxHeight = h0 + (v0 > 0 ? (v0 * v0) / (2 * g) : 0);
  return { flightTime, maxHeight, impactSpeed: Math.sqrt(v0 * v0 + 2 * g * h0) };
}

/**
 * A ball moving straight up and down, up positive:  a = −g − k·|v|·v.
 * Integrated with RK4 (exact when k = 0, since then the motion is a parabola in t).
 * The landing moment is found inside the last step, as in the projectile sim.
 */
export class FreeFallModel  {
  t = 0;
  y = 0;
  v = 0;
  a = 0;
  maxHeight = 0;
  landed = false;
   timedOut = false;
   h0 = 0;

  reset(p) {
    this.t = 0;
    this.h0 = p.h0;
    this.y = p.h0;
    this.v = p.v0;
    this.a = accel(this.v, p);
    this.maxHeight = p.h0;
    this.landed = false;
    this.timedOut = false;
  }

  step(dt, p) {
    if (this.landed || this.timedOut) return false;
    // On the ground and not moving up: nothing to simulate.
    if (this.y <= 0 && this.v <= 0) {
      this.landed = true;
      return false;
    }
    const [y, v] = rk4((_t, s) => [s[1], accel(s[1], p)], this.t, [this.y, this.v], dt);
    if (y < 0) {
      const a = accel(this.v, p);
      const tau = firstRoot(0.5 * a, this.v, this.y, dt);
      this.t += tau;
      this.v += a * tau;
      this.y = 0;
      this.a = accel(this.v, p);
      this.landed = true;
      return false;
    }
    this.y = y;
    this.v = v;
    this.a = accel(v, p);
    this.t += dt;
    if (y > this.maxHeight) this.maxHeight = y;
    if (this.t >= T_MAX - 1e-9) {
      this.timedOut = true;
      return false;
    }
    return true;
  }

  isValid() {
    return [this.t, this.y, this.v, this.a].every(Number.isFinite);
  }

  sample() {
    return { y: this.y, v: this.v, a: this.a };
  }

  clone() {
    return Object.assign(new FreeFallModel(), this);
  }

  /** `text` is the simulation's text object (sims/free-fall/<locale>.js). */
  finishMessage(text) {
    if (this.timedOut) return text.msg.timeUp(T_MAX);
    if (!this.landed) return '';
    if (this.t === 0) return text.msg.onGround;
    // The highest point is named only when the ball rose above where it started.
    const top = this.maxHeight > this.h0 + 0.005 ? num(this.maxHeight, 2) : null;
    return text.msg.landed(num(this.t, 2), num(Math.abs(this.v), 2), top);
  }
}

function accel(v, p) {
  return -p.g - p.k * Math.abs(v) * v;
}

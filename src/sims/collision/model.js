import { num } from '../../core/format.js';



export const TRACK = 10; // m
export const T_MAX = 15; // s
/** Where the carts start (centres). */
export const START1 = 2.5;
export const START2 = 7.5;

export const params = [
  { key: 'm1', symbol: 'm₁', unit: 'kg', min: 0.5, max: 10, step: 0.5, default: 2, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'v1', symbol: 'υ₁', unit: 'm/s', min: -6, max: 6, step: 0.1, default: 3, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'm2', symbol: 'm₂', unit: 'kg', min: 0.5, max: 10, step: 0.5, default: 2, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'v2', symbol: 'υ₂', unit: 'm/s', min: -6, max: 6, step: 0.1, default: 0, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'e', symbol: 'e', unit: '', min: 0, max: 1, step: 0.05, default: 1, kind: 'initial', decimals: 2 },
];

/** Half the length of a cart of mass m, metres: heavier carts are drawn bigger. */
export function halfWidth(m) {
  return 0.42 + 0.14 * Math.cbrt(m);
}

/**
 * Velocities after a head-on impact with coefficient of restitution e
 * (e = 1 elastic, e = 0 the carts stick together). Momentum is always conserved;
 * the relative speed of separation is e times the relative speed of approach.
 */
export function afterImpact(m1, v1, m2, v2, e) {
  const M = m1 + m2;
  const p = m1 * v1 + m2 * v2;
  return { v1: (p + m2 * e * (v2 - v1)) / M, v2: (p + m1 * e * (v1 - v2)) / M };
}

/**
 * Two carts on a frictionless straight track. Between events they move at constant
 * velocity, so every step is exact: the impact and the moment a cart leaves the track
 * are found analytically inside the step.
 */
export class CollisionModel  {
  t = 0;
  x1 = START1;
  x2 = START2;
  v1 = 0;
  v2 = 0;
  hit = false;
  tHit = NaN;
  /** Where the carts touched (the contact point), m. */
  impactX = NaN;
  /** Kinetic energy lost in the impact, J. */
  lost = 0;
   m1 = 1;
   m2 = 1;
   e = 1;
   reason = null;

  reset(p) {
    this.t = 0;
    this.x1 = START1;
    this.x2 = START2;
    this.v1 = p.v1;
    this.v2 = p.v2;
    this.m1 = p.m1;
    this.m2 = p.m2;
    this.e = p.e;
    this.hit = false;
    this.tHit = NaN;
    this.impactX = NaN;
    this.lost = 0;
    this.reason = null;
  }

  halfWidth(i) {
    return halfWidth(i === 1 ? this.m1 : this.m2);
  }

   get ke() {
    return 0.5 * this.m1 * this.v1 * this.v1 + 0.5 * this.m2 * this.v2 * this.v2;
  }

  /** Time until a cart's outer edge reaches the end of the track, or Infinity. */
   timeToLeave() {
    let t = Infinity;
    if (this.v1 < 0) t = Math.min(t, (this.x1 - this.halfWidth(1)) / -this.v1);
    if (this.v1 > 0) t = Math.min(t, (TRACK - this.x1 - this.halfWidth(1)) / this.v1);
    if (this.v2 < 0) t = Math.min(t, (this.x2 - this.halfWidth(2)) / -this.v2);
    if (this.v2 > 0) t = Math.min(t, (TRACK - this.x2 - this.halfWidth(2)) / this.v2);
    return Math.max(0, t);
  }

   move(tau) {
    this.x1 += this.v1 * tau;
    this.x2 += this.v2 * tau;
    this.t += tau;
  }

  step(dt, _p) {
    if (this.reason) return false;
    if (this.v1 === 0 && this.v2 === 0) return this.stop('rest');
    let left = dt;
    // The impact, if it falls inside this step.
    if (!this.hit) {
      const closing = this.v1 - this.v2;
      const gap = this.x2 - this.halfWidth(2) - (this.x1 + this.halfWidth(1));
      if (closing > 0 && gap / closing <= left) {
        const tau = Math.max(0, gap / closing);
        // A cart runs off the end of the track before they meet: move to that moment and stop.
        const tl = this.timeToLeave();
        if (tl < tau) {
          this.move(tl);
          return this.leave();
        }
        this.move(tau);
        left -= tau;
        const before = this.ke;
        const r = afterImpact(this.m1, this.v1, this.m2, this.v2, this.e);
        this.v1 = r.v1;
        this.v2 = r.v2;
        this.hit = true;
        this.tHit = this.t;
        this.impactX = this.x1 + this.halfWidth(1);
        this.lost = Math.max(0, before - this.ke);
        if (Math.abs(this.v1) < 1e-12 && Math.abs(this.v2) < 1e-12) {
          this.v1 = 0;
          this.v2 = 0;
          return this.stop('rest');
        }
      }
    }
    const tl = this.timeToLeave();
    if (tl <= left) {
      this.move(tl);
      return this.leave();
    }
    this.move(left);
    if (this.t >= T_MAX - 1e-9) return this.stop('time');
    return true;
  }

   leave() {
    return this.stop('left');
  }

   stop(reason) {
    this.reason = reason;
    return false;
  }

  isValid() {
    return [this.t, this.x1, this.x2, this.v1, this.v2].every(Number.isFinite);
  }

  sample() {
    return {
      x1: this.x1,
      x2: this.x2,
      v1: this.v1,
      v2: this.v2,
      p: this.m1 * this.v1 + this.m2 * this.v2,
      ke: this.ke,
      lost: this.lost,
    };
  }

  clone() {
    return Object.assign(new CollisionModel(), this);
  }

  /** The run's outcome in words; `text` is this simulation's text (sims/collision/<locale>.js). */
  finishMessage(text) {
    const msg = text.msg;
    const after = this.hit ? msg.after(num(this.tHit, 2), num(this.v1, 2), num(this.v2, 2)) : msg.noHit;
    const energy = this.hit ? (this.lost > 1e-9 ? msg.energyLost(num(this.lost, 1)) : msg.energyKept) : msg.noHitEnd;
    if (this.reason === 'rest') return this.hit ? msg.restAfterHit(after, energy) : msg.rest;
    if (this.reason === 'left') return msg.left(after, energy);
    if (this.reason === 'time') return msg.time(after, energy, T_MAX);
    return '';
  }
}

import { num } from '../../core/format.js';
import { advance, contact, G } from '../friction.js';

export const FLOOR = 24; // m of floor in front of the box
export const T_MAX = 10; // s

export const params = [
  { key: 'F', symbol: 'F', unit: 'N', min: 0, max: 100, step: 1, default: 60, kind: 'live', decimals: 0, color: '--force' },
  { key: 'm', symbol: 'm', unit: 'kg', min: 1, max: 50, step: 0.5, default: 10, kind: 'initial', decimals: 1 },
  { key: 'mus', symbol: 'μₜ', unit: '', min: 0, max: 1, step: 0.01, default: 0.5, kind: 'initial', decimals: 2, color: '--friction' },
  // Kept ≤ μₜ by the sim's restartValues: kinetic friction is never above the static limit.
  { key: 'muk', symbol: 'μₛ', unit: '', min: 0, max: 1, step: 0.01, default: 0.3, kind: 'initial', decimals: 2, color: '--friction' },
  { key: 'v0', symbol: 'υ₀', unit: 'm/s', min: 0, max: 15, step: 0.5, default: 0, kind: 'initial', decimals: 1, color: '--vel' },
];

/**
 * A box on a level floor, pushed to the right with force F:   m·a = F + f,
 * where f is static friction (up to μs·m·g, as much as needed to hold the box)
 * or kinetic friction (μk·m·g against the motion). The run ends at the end of
 * the floor or after T_MAX.
 */
export class BoxModel  {
  t = 0;
  x = 0;
  v = 0;
  a = 0;
  F = 0;
  f = 0;
  sliding = false;
  /** Most that static friction can hold: μs·m·g. */
  holdMax = 0;
   moved = false;
   reason = null;

  reset(p) {
    this.t = 0;
    this.x = 0;
    this.v = p.v0;
    this.moved = p.v0 > 0;
    this.reason = null;
    this.update(p);
  }

   update(p) {
    const c = contact(this.v, p.F, p.m * G, p.mus, p.muk, p.m);
    this.F = p.F;
    this.f = c.f;
    this.a = c.a;
    this.sliding = c.sliding;
    this.holdMax = p.mus * p.m * G;
  }

  step(dt, p) {
    if (this.reason) return false;
    this.update(p);
    const r = advance(this.x, this.v, this.a, dt, FLOOR);
    this.x = r.s;
    this.v = r.v;
    this.t += r.tau;
    if (this.v > 0) this.moved = true;
    if (r.atEnd) {
      this.reason = 'end';
      return false;
    }
    // Slid and came to rest: friction now holds it for good (only a live change could restart it).
    if (this.moved && this.v === 0) {
      this.reason = 'rest';
      this.update(p);
      return false;
    }
    this.update(p);
    if (this.t >= T_MAX - 1e-9) {
      this.reason = 'time';
      return false;
    }
    return true;
  }

  isValid() {
    return [this.t, this.x, this.v, this.a, this.f].every(Number.isFinite);
  }

  sample() {
    return { x: this.x, v: this.v, a: this.a, F: this.F, f: this.f, net: this.F + this.f };
  }

  clone() {
    return Object.assign(new BoxModel(), this);
  }

  /** `text` is the simulation's text object (sims/push-box/<locale>.js). */
  finishMessage(text) {
    if (this.reason === 'end') return text.msg.finish(num(this.t, 2), FLOOR, num(this.v, 2));
    if (this.reason === 'rest') return text.msg.rest(num(this.x, 2));
    if (this.reason !== 'time') return '';
    if (!this.moved) return text.msg.stuck(num(this.F, 0), num(this.holdMax, 1));
    return text.msg.timeUp(T_MAX, num(this.x, 2));
  }
}

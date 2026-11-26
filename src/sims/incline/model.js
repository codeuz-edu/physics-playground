import { num } from '../../core/format.js';
import { advance, contact, G } from '../friction.js';

export const SLOPE = 10; // m, length of the slope
export const START = 2; // m from the top, where the block starts
export const RUN = SLOPE - START - 1.2; // m the block can slide before the bottom
export const T_MAX = 20; // s
const DEG = Math.PI / 180;

export const params = [
  { key: 'angle', symbol: 'α', unit: '°', min: 0, max: 60, step: 1, default: 30, kind: 'live', decimals: 0 },
  { key: 'm', symbol: 'm', unit: 'kg', min: 1, max: 20, step: 0.5, default: 5, kind: 'initial', decimals: 1 },
  { key: 'mus', symbol: 'μₜ', unit: '', min: 0, max: 1, step: 0.01, default: 0.4, kind: 'initial', decimals: 2, color: '--friction' },
  // Kept ≤ μₜ by the sim's restartValues: kinetic friction is never above the static limit.
  { key: 'muk', symbol: 'μₛ', unit: '', min: 0, max: 1, step: 0.01, default: 0.3, kind: 'initial', decimals: 2, color: '--friction' },
];

/**
 * A block on a slope at angle θ, starting at rest. Along the slope (down positive),
 * gravity pulls with m·g·sin θ and the surface pushes back with N = m·g·cos θ, so
 * static friction holds the block while tan θ ≤ μs; once it slides,
 * a = g·(sin θ − μk·cos θ). `s` is the distance slid from the start.
 */
export class InclineModel  {
  t = 0;
  s = 0;
  v = 0;
  a = 0;
  /** Pull of gravity along the slope, m·g·sin θ. */
  along = 0;
  N = 0;
  f = 0;
  sliding = false;
   tan = 0;
   mus = 0;
   moved = false;
   reason = null;

  reset(p) {
    this.t = 0;
    this.s = 0;
    this.v = 0;
    this.moved = false;
    this.reason = null;
    this.update(p);
  }

   update(p) {
    const th = p.angle * DEG;
    this.along = p.m * G * Math.sin(th);
    this.N = p.m * G * Math.cos(th);
    const c = contact(this.v, this.along, this.N, p.mus, p.muk, p.m);
    this.f = c.f;
    this.a = c.a;
    this.sliding = c.sliding;
    this.tan = Math.tan(th);
    this.mus = p.mus;
  }

  step(dt, p) {
    if (this.reason) return false;
    this.update(p);
    const r = advance(this.s, this.v, this.a, dt, RUN);
    this.s = r.s;
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
    return [this.t, this.s, this.v, this.a, this.f, this.N].every(Number.isFinite);
  }

  sample() {
    return { s: this.s, v: this.v, a: this.a, along: this.along, f: this.f, net: this.along + this.f };
  }

  clone() {
    return Object.assign(new InclineModel(), this);
  }

  /** `text` is the simulation's text object (sims/incline/<locale>.js). */
  finishMessage(text) {
    if (this.reason === 'end') return text.msg.bottom(num(this.t, 2), num(this.v, 2));
    if (this.reason === 'rest') return text.msg.rest(num(this.s, 2));
    if (this.reason !== 'time') return '';
    if (!this.moved) return text.msg.stuck(num(this.tan, 2), num(this.mus, 2));
    return text.msg.timeUp(T_MAX, num(this.s, 2));
  }
}

import { num } from '../../core/format.js';

export const T_MAX = 90; // s, long enough for two turns of a slow, wide circle
export const TURNS = 2;

export const params = [
  { key: 'r', symbol: 'R', unit: 'm', min: 1, max: 10, step: 0.1, default: 3, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'v', symbol: 'υ', unit: 'm/s', min: 0, max: 20, step: 0.1, default: 6, kind: 'live', decimals: 1, color: '--vel' },
];

/**
 * A ball going round a circle of radius r at constant speed v, counter-clockwise,
 * starting at (r, 0). Its angle grows at ω = v / r, so each step is exact.
 * The run ends after TURNS full turns (or after T_MAX if it is too slow).
 */
export class CircularModel  {
  t = 0;
  r = 1;
  v = 0;
  angle = 0;
   done = false;
   timedOut = false;

  reset(p) {
    this.t = 0;
    this.r = p.r;
    this.v = p.v;
    this.angle = 0;
    this.done = false;
    this.timedOut = false;
  }

  step(dt, p) {
    if (this.done || this.timedOut) return false;
    this.v = p.v;
    const omega = this.v / this.r;
    const end = TURNS * 2 * Math.PI;
    if (omega > 0 && this.angle + omega * dt >= end) {
      this.t += (end - this.angle) / omega;
      this.angle = end;
      this.done = true;
      return false;
    }
    this.angle += omega * dt;
    this.t += dt;
    if (this.t >= T_MAX - 1e-9) {
      this.timedOut = true;
      return false;
    }
    return true;
  }

  isValid() {
    return [this.t, this.r, this.v, this.angle].every(Number.isFinite);
  }

  sample() {
    const c = Math.cos(this.angle);
    const s = Math.sin(this.angle);
    return {
      x: this.r * c,
      y: this.r * s,
      vx: -this.v * s,
      vy: this.v * c,
      omega: this.v / this.r,
      ac: (this.v * this.v) / this.r,
      // A ball at rest never comes round: no period.
      period: this.v > 0 ? (2 * Math.PI * this.r) / this.v : NaN,
    };
  }

  clone() {
    return Object.assign(new CircularModel(), this);
  }

  /** `text` is the simulation's text object (sims/circular/<locale>.js). */
  finishMessage(text) {
    if (this.timedOut) return text.msg.timeUp(T_MAX, num(this.angle / (2 * Math.PI), 2));
    if (!this.done) return '';
    return text.msg.done(num(this.t, 2), TURNS, num((2 * Math.PI * this.r) / this.v, 2));
  }
}

import { num } from '../../core/format.js';

export const T_MAX = 240; // s
const DEG = Math.PI / 180;

export const params = [
  { key: 'w', symbol: 'd', unit: 'm', min: 20, max: 100, step: 1, default: 60, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'vb', symbol: 'υ′', unit: 'm/s', min: 1, max: 6, step: 0.1, default: 3, kind: 'live', decimals: 1, color: '--vy' },
  { key: 'heading', symbol: 'α', unit: '°', min: -60, max: 60, step: 1, default: 0, kind: 'live', decimals: 0 },
  { key: 'u', symbol: 'u', unit: 'm/s', min: 0, max: 5, step: 0.1, default: 1.5, kind: 'live', decimals: 1, color: '--current' },
];

/** Velocity of the boat relative to the shore: its velocity in the water plus the water's. */
export function shoreVelocity(p) {
  const th = p.heading * DEG;
  return { vx: p.u - p.vb * Math.sin(th), vy: p.vb * Math.cos(th) };
}

/** Closed-form crossing with constant settings (tests, view bounds). */
export function idealCrossing(p) {
  const { vx, vy } = shoreVelocity(p);
  const time = p.w / vy;
  return { time, downstream: vx * time, drift: p.u * time };
}

/**
 * A boat crossing a river, seen from above. x runs downstream along the near bank,
 * y straight across, both measured from the start. The boat keeps a heading θ
 * (from straight across, positive pointing upstream) and a speed v′ relative to
 * the water, which flows at u:   v = v′ + u.
 * Velocities are constant within a step, so the update is exact.
 * `drift` is how far the water itself has moved, which gives the boat's position
 * as seen from the water: x − drift.
 */
export class RiverModel  {
  t = 0;
  x = 0;
  y = 0;
  drift = 0;
  vx = 0;
  vy = 0;
  w = 0;
  arrived = false;
   timedOut = false;

  reset(p) {
    this.t = 0;
    this.x = 0;
    this.y = 0;
    this.drift = 0;
    this.w = p.w;
    ({ vx: this.vx, vy: this.vy } = shoreVelocity(p));
    this.arrived = false;
    this.timedOut = false;
  }

  step(dt, p) {
    if (this.arrived || this.timedOut) return false;
    ({ vx: this.vx, vy: this.vy } = shoreVelocity(p));
    const arrive = this.y + this.vy * dt >= this.w;
    const tau = arrive ? (this.w - this.y) / this.vy : dt;
    this.x += this.vx * tau;
    this.y = arrive ? this.w : this.y + this.vy * tau;
    this.drift += p.u * tau;
    this.t += tau;
    if (arrive) {
      this.arrived = true;
      return false;
    }
    if (this.t >= T_MAX - 1e-9) {
      this.timedOut = true;
      return false;
    }
    return true;
  }

  isValid() {
    return [this.t, this.x, this.y, this.drift, this.vx, this.vy].every(Number.isFinite);
  }

  sample() {
    return { x: this.x, y: this.y, xw: this.x - this.drift, speed: Math.hypot(this.vx, this.vy) };
  }

  clone() {
    return Object.assign(new RiverModel(), this);
  }

  /** `text` is the simulation's text object (sims/river-boat/<locale>.js). */
  finishMessage(text) {
    if (this.timedOut) return text.msg.timeUp(T_MAX);
    if (!this.arrived) return '';
    const d = Math.abs(this.x);
    const where = d < 0.05 ? text.msg.opposite : this.x > 0 ? text.msg.downstream(num(d, 1)) : text.msg.upstream(num(d, 1));
    return text.msg.arrived(num(this.t, 2), where);
  }
}

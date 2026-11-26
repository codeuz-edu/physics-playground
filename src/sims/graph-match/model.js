import { num } from '../../core/format.js';

export const TRACK = 40; // m
export const T_RUN = 10; // s
export const V_MAX = 10; // m/s, top speed of the car
const LAG = 0.15; // s, how quickly the car closes the gap to where you put it

/**
 * Target graphs. Each starts with a 1 s wait, so there is time to grab the car after pressing Play.
 * Their names are the options of the `target` parameter in the text file, in this order.
 */
export const TARGETS = [
  {
    id: 'steady',
    x: (t) => (t < 1 ? 5 : 5 + 3 * (t - 1)),
    v: (t) => (t < 1 ? 0 : 3),
  },
  {
    id: 'wait-then-go',
    x: (t) => (t < 4 ? 8 : 8 + 4 * (t - 4)),
    v: (t) => (t < 4 ? 0 : 4),
  },
  {
    id: 'speed-up',
    x: (t) => (t < 1 ? 5 : 5 + 0.35 * (t - 1) ** 2),
    v: (t) => (t < 1 ? 0 : 0.7 * (t - 1)),
  },
  {
    id: 'there-and-back',
    x: (t) => (t < 1 ? 5 : t < 5.5 ? 5 + 6 * (t - 1) : 32 - 6 * (t - 5.5)),
    v: (t) => (t < 1 ? 0 : t < 5.5 ? 6 : -6),
  },
  {
    id: 'slow-down',
    x: (t) => (t < 1 ? 5 : t < 9 ? 5 + 6 * (t - 1) - 0.375 * (t - 1) ** 2 : 29),
    v: (t) => (t < 1 ? 0 : t < 9 ? 6 - 0.75 * (t - 1) : 0),
  },
];

export const params = [
  { key: 'target', symbol: '', options: TARGETS.map((t) => t.id), unit: '', min: 1, max: TARGETS.length, step: 1, default: 1, kind: 'initial', decimals: 0 },
  { key: 'xp', symbol: 'x', unit: 'm', min: 0, max: TRACK, step: 0.1, default: 5, kind: 'live', decimals: 1, color: '--pos' },
];

const target = (p) => TARGETS[Math.min(TARGETS.length, Math.max(1, Math.round(p.target))) - 1];

/**
 * A car you drive by hand: it chases the position you set (`xp`, by dragging the car or
 * with the slider), closing the gap with a short lag and at most V_MAX, so its velocity
 * stays finite and readable. The run lasts T_RUN, scored by the average gap to the target.
 */
export class MatchModel  {
  t = 0;
  x = 0;
  v = 0;
  /** Way the car faces (+1 right, −1 left); kept while it stands still. */
  facing = 1;
   goal = TARGETS[0];
   gapTime = 0; // ∫|x − x_target| dt

  reset(p) {
    this.t = 0;
    this.x = p.xp;
    this.v = 0;
    this.facing = 1;
    this.goal = target(p);
    this.gapTime = 0;
  }

  step(dt, p) {
    if (this.t >= T_RUN - 1e-9) return false;
    let dx = (p.xp - this.x) * (1 - Math.exp(-dt / LAG));
    dx = Math.max(-V_MAX * dt, Math.min(V_MAX * dt, dx));
    this.x += dx;
    this.v = dx / dt;
    if (Math.abs(this.v) > 0.05) this.facing = Math.sign(this.v);
    this.t += dt;
    this.gapTime += Math.abs(this.x - this.goal.x(this.t)) * dt;
    return this.t < T_RUN - 1e-9;
  }

  /** Average distance from the target over the run so far. */
  averageGap() {
    return this.t > 0 ? this.gapTime / this.t : 0;
  }

  isValid() {
    return [this.t, this.x, this.v, this.gapTime].every(Number.isFinite);
  }

  sample() {
    const xt = this.goal.x(this.t);
    return { x: this.x, v: this.v, xt, vt: this.goal.v(this.t), gap: Math.abs(this.x - xt) };
  }

  clone() {
    return Object.assign(new MatchModel(), this);
  }

  /** `text` is the simulation's text object (sims/graph-match/<locale>.js). */
  finishMessage(text) {
    const gap = this.averageGap();
    const verdict = gap < 1.5 ? text.msg.great : gap < 3 ? text.msg.good : text.msg.tryAgain;
    return text.msg.result(num(gap, 1), verdict);
  }
}

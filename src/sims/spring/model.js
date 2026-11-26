import { num } from '../../core/format.js';
import { rk4 } from '../../core/integrators.js';



export const T_MAX = 12; // s, the shortest run; longer periods get a longer run
/** The spring can be squeezed or stretched by at most this much (it is 1 m long): the block stops there. */
export const X_LIM = 0.7; // m

export const params = [
  { key: 'm', symbol: 'm', unit: 'kg', min: 0.1, max: 5, step: 0.1, default: 0.5, kind: 'initial', decimals: 1 },
  { key: 'k', symbol: 'k', unit: 'N/m', min: 1, max: 200, step: 1, default: 20, kind: 'initial', decimals: 0, color: '--force' },
  { key: 'x0', symbol: 'x₀', unit: 'm', min: -0.5, max: 0.5, step: 0.01, default: 0.2, kind: 'initial', decimals: 2, color: '--pos' },
  { key: 'v0', symbol: 'υ₀', unit: 'm/s', min: -3, max: 3, step: 0.1, default: 0, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'b', symbol: 'b', unit: 'kg/s', min: 0, max: 5, step: 0.1, default: 0, kind: 'live', decimals: 1, color: '--friction' },
];

/** Period of the undamped oscillation, 2π√(m/k). */
export function springPeriod(m, k) {
  return 2 * Math.PI * Math.sqrt(m / k);
}

/** Period with the drag force −bυ, 2π/√(k/m − (b/2m)²); Infinity when b ≥ 2√(km) (no oscillation). */
export function dampedPeriod(m, k, b) {
  const w2 = k / m - (b / (2 * m)) ** 2;
  return w2 > 0 ? (2 * Math.PI) / Math.sqrt(w2) : Infinity;
}

/** Amplitude the initial conditions give without drag: ½kA² = ½kx₀² + ½mυ₀². */
export function amplitude(p) {
  return Math.sqrt(p.x0 * p.x0 + (p.v0 * p.v0 * p.m) / p.k);
}

/**
 * A block on a frictionless table held by a spring: Hooke's law F = −kx, with an optional
 * drag force −bυ.   m ẍ = −k x − b ẋ.
 * Integrated with RK4. The period is measured from the run itself: the time from one turning
 * point to the next turning point on the same side (υ = 0 twice in the same direction), so it
 * can be compared with 2π√(m/k). The spring has a limited travel (±X_LIM); a run that would go
 * past it stops there.
 */
export class SpringModel  {
  t = 0;
  x = 0;
  v = 0;
  /** Measured period, s (NaN until one full swing has been timed). */
  period = NaN;
   m = 1;
   k = 1;
   b = 0;
   /** Times of the last two turning points (υ = 0). */
   turn1 = NaN;
   turn2 = NaN;
   tEnd = T_MAX;
   A0 = 0;
   reason = null;

  reset(p) {
    this.t = 0;
    this.x = p.x0;
    this.v = p.v0;
    this.m = p.m;
    this.k = p.k;
    this.b = p.b;
    this.period = NaN;
    // Released from rest away from x = 0: the release itself is a turning point.
    this.turn1 = p.v0 === 0 && p.x0 !== 0 ? 0 : NaN;
    this.turn2 = NaN;
    this.A0 = amplitude(p);
    // Long enough to time one full swing (the first turning point can come half a period late).
    const T = dampedPeriod(p.m, p.k, p.b);
    this.tEnd = Math.max(T_MAX, Math.min(30, 1.6 * (Number.isFinite(T) ? T : 0)));
    this.reason = null;
  }

  get a() {
    return (-this.k * this.x - this.b * this.v) / this.m;
  }

  step(dt, p) {
    if (this.reason) return false;
    if (this.t === 0 && this.x === 0 && this.v === 0) return this.stop('rest');
    this.b = p.b;
    const { m, k } = this;
    const f = (_t, s) => [s[1], (-k * s[0] - p.b * s[1]) / m];
    const [x0, v0] = [this.x, this.v];
    const [x1, v1] = rk4(f, this.t, [x0, v0], dt);
    // The spring is fully squeezed or stretched: stop at the limit, at the moment it is reached.
    if (Math.abs(x1) >= X_LIM) {
      const lim = Math.sign(x1) * X_LIM;
      const q = Math.max(0, Math.min(1, (lim - x0) / (x1 - x0)));
      this.t += q * dt;
      this.x = lim;
      this.v = v0 + (v1 - v0) * q;
      return this.stop('limit');
    }
    // A turning point (υ changes sign): time it against the turning point before the last one.
    if ((v0 > 0 && v1 <= 0) || (v0 < 0 && v1 >= 0)) {
      const tt = this.t + (v0 / (v0 - v1)) * dt;
      if (Number.isFinite(this.turn2)) this.period = tt - this.turn2;
      this.turn2 = this.turn1;
      this.turn1 = tt;
    }
    this.x = x1;
    this.v = v1;
    this.t += dt;
    if (p.b > 0 && this.t > 2 && Math.abs(this.x) < 5e-4 && Math.abs(this.v) < 5e-3) return this.stop('still');
    if (this.t >= this.tEnd - 1e-9) return this.stop('time');
    return true;
  }

   stop(reason) {
    this.reason = reason;
    return false;
  }

  isValid() {
    return [this.t, this.x, this.v].every(Number.isFinite);
  }

  sample() {
    const ke = 0.5 * this.m * this.v * this.v;
    const pe = 0.5 * this.k * this.x * this.x;
    return { x: this.x, v: this.v, a: this.a, F: -this.k * this.x, ke, pe, e: ke + pe, period: this.period };
  }

  clone() {
    return Object.assign(new SpringModel(), this);
  }

  /** The measured period against the formulas, with the drag version when there is drag. */
   periodText(text) {
    const T0 = springPeriod(this.m, this.k);
    if (!(this.b > 0)) return text.msg.period(num(this.period, 2), num(T0, 2));
    const Td = dampedPeriod(this.m, this.k, this.b);
    return text.msg.periodDrag(num(this.period, 2), num(T0, 2), Number.isFinite(Td) ? num(Td, 2) : '∞');
  }

  /** The run's outcome in words; `text` is this simulation's text (sims/spring/<locale>.js). */
  finishMessage(text) {
    const msg = text.msg;
    const measured = Number.isFinite(this.period);
    const over = this.b > 0 && !Number.isFinite(dampedPeriod(this.m, this.k, this.b));
    const why = over ? msg.overdamped(num(2 * Math.sqrt(this.k * this.m), 2)) : msg.noFullSwing;
    if (this.reason === 'rest') return msg.rest;
    if (this.reason === 'limit') return msg.limit(num(this.t, 2), num(this.x, 2), this.x < 0, num(this.A0, 2), num(X_LIM, 2));
    if (this.reason === 'still') return msg.still(num(this.t, 1), measured ? this.periodText(text) : why);
    if (this.reason !== 'time') return '';
    if (!measured) return over ? why : msg.tooShort(num(this.tEnd, 1));
    return this.periodText(text);
  }
}

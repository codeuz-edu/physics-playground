import { num } from '../../core/format.js';
import { rk4 } from '../../core/integrators.js';



export const T_MAX = 20; // s
const DEG = Math.PI / 180;

export const params = [
  { key: 'L', symbol: 'l', unit: 'm', min: 0.2, max: 5, step: 0.01, default: 1, kind: 'initial', decimals: 2 },
  { key: 'theta0', symbol: 'α₀', unit: '°', min: 1, max: 90, step: 1, default: 20, kind: 'initial', decimals: 0, color: '--pos' },
  { key: 'g', symbol: 'g', unit: 'm/s²', min: 1, max: 25, step: 0.01, default: 9.81, kind: 'live', decimals: 2 },
  { key: 'm', symbol: 'm', unit: 'kg', min: 0.1, max: 5, step: 0.1, default: 1, kind: 'initial', decimals: 1 },
  { key: 'b', symbol: 'β', unit: '1/s', min: 0, max: 1, step: 0.01, default: 0, kind: 'live', decimals: 2, color: '--friction' },
];

/** Complete elliptic integral of the first kind, K(k), by the arithmetic–geometric mean. */
function ellipticK(k) {
  let a = 1;
  let b = Math.sqrt(1 - k * k);
  for (let i = 0; i < 40 && Math.abs(a - b) > 1e-16; i++) {
    const an = (a + b) / 2;
    b = Math.sqrt(a * b);
    a = an;
  }
  return Math.PI / (2 * a);
}

/** Exact period of an undamped pendulum released from rest at θ₀ degrees: 4√(l/g)·K(sin θ₀/2). */
export function exactPeriod(L, g, theta0) {
  return 4 * Math.sqrt(L / g) * ellipticK(Math.sin((theta0 * DEG) / 2));
}

/** Small-angle period, 2π√(l/g). */
export function smallPeriod(L, g) {
  return 2 * Math.PI * Math.sqrt(L / g);
}

/**
 * A simple pendulum: a point mass on a weightless rod of length l, released from rest at θ₀.
 *   θ̈ = −(g/l) sin θ − β θ̇
 * integrated with RK4, so large swings follow the true (non-sinusoidal) motion. The period
 * is measured from the run itself: the time from one turning point (ω = 0) to the next turning
 * point on the same side. The release, from rest, is the first turning point.
 */
export class PendulumModel  {
  t = 0;
  /** Angle from the vertical, radians, positive to the right. */
  th = 0;
  om = 0;
  /** Measured period, s (NaN until one full swing has been timed). */
  period = NaN;
   theta0 = 0;
   L = 1;
   m = 1;
   g = 9.81;
   b = 0;
   /** Times of the last two turning points. */
   turn1 = NaN;
   turn2 = NaN;
   reason = null;

  reset(p) {
    this.t = 0;
    this.theta0 = p.theta0 * DEG;
    this.th = this.theta0;
    this.om = 0;
    this.L = p.L;
    this.m = p.m;
    this.g = p.g;
    this.b = p.b;
    this.period = NaN;
    this.turn1 = 0;
    this.turn2 = NaN;
    this.reason = null;
  }

  step(dt, p) {
    if (this.reason) return false;
    this.g = p.g;
    this.b = p.b;
    const { L } = this;
    const f = (_t, s) => [s[1], -(p.g / L) * Math.sin(s[0]) - p.b * s[1]];
    const [th1, om1] = rk4(f, this.t, [this.th, this.om], dt);
    // A turning point (ω changes sign): time it against the turning point before the last one,
    // which was on the same side.
    const om0 = this.om;
    if ((om0 > 0 && om1 <= 0) || (om0 < 0 && om1 >= 0)) {
      const tp = this.t + (om0 / (om0 - om1)) * dt;
      if (Number.isFinite(this.turn2)) this.period = tp - this.turn2;
      this.turn2 = this.turn1;
      this.turn1 = tp;
    }
    this.th = th1;
    this.om = om1;
    this.t += dt;
    // Damped out: the swing is too small to see.
    if (p.b > 0 && this.t > 2 && Math.abs(this.th) < 0.2 * DEG && Math.abs(this.om * L) < 0.01) return this.stop('still');
    if (this.t >= T_MAX - 1e-9) return this.stop('time');
    return true;
  }

   stop(reason) {
    this.reason = reason;
    return false;
  }

  isValid() {
    return [this.t, this.th, this.om].every(Number.isFinite);
  }

  sample() {
    const { L, m, g } = this;
    const v = L * this.om;
    const height = L * (1 - Math.cos(this.th));
    const ke = 0.5 * m * v * v;
    const pe = m * g * height;
    return {
      theta: this.th / DEG,
      // What the small-angle formula predicts: a cosine with the period 2π√(l/g).
      small: (this.theta0 / DEG) * Math.cos(Math.sqrt(g / L) * this.t),
      omega: this.om,
      v,
      x: L * Math.sin(this.th),
      y: -L * Math.cos(this.th),
      tension: m * g * Math.cos(this.th) + m * L * this.om * this.om,
      // Acceleration along the arc (gravity's part towards the lowest point, plus the damping
      // part against the motion) and towards the pivot.
      at: -g * Math.sin(this.th) - this.b * L * this.om,
      an: L * this.om * this.om,
      ke,
      pe,
      e: ke + pe,
      period: this.period,
    };
  }

  clone() {
    return Object.assign(new PendulumModel(), this);
  }

  /** The run's outcome in words; `text` is this simulation's text (sims/pendulum/<locale>.js). */
  finishMessage(text) {
    const msg = text.msg;
    const T0 = smallPeriod(this.L, this.g);
    const measured = Number.isFinite(this.period);
    // Small-angle period with damping: 2π/√(g/l − β²/4); no swing at all once β ≥ 2√(g/l).
    const w2 = this.g / this.L - (this.b * this.b) / 4;
    const over = this.b > 0 && w2 <= 0;
    const why = over ? msg.overdamped(num(2 * Math.sqrt(this.g / this.L), 2)) : msg.noFullSwing;
    if (this.reason === 'still') return msg.still(num(this.t, 1), measured ? msg.measured(num(this.period, 2)) : why);
    if (this.reason !== 'time') return '';
    if (!measured) return over ? why : msg.tooShort(T_MAX);
    const period = msg.period(num(this.period, 2), num(T0, 2), num(((this.period - T0) / T0) * 100, 1));
    if (!(this.b > 0) || over) return period;
    return msg.periodDamped(period, num((2 * Math.PI) / Math.sqrt(w2), 2));
  }
}

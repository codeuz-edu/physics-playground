import { num } from '../../core/format.js';
import { rk4 } from '../../core/integrators.js';
import { firstRoot } from '../motion-1d/model.js';

export const T_MAX = 120; // s

export const params = [
  { key: 'v0', symbol: 'υ₀', unit: 'm/s', min: 0, max: 50, step: 0.5, default: 18, kind: 'initial', decimals: 1, color: '--vel' },
  { key: 'angle', symbol: 'α', unit: '°', min: 0, max: 90, step: 1, default: 45, kind: 'initial', decimals: 0 },
  { key: 'h0', symbol: 'h₀', unit: 'm', min: 0, max: 50, step: 0.5, default: 0, kind: 'initial', decimals: 1, color: '--pos' },
  { key: 'g', symbol: 'g', unit: 'm/s²', min: 0.5, max: 25, step: 0.01, default: 9.81, kind: 'live', decimals: 2 },
  // k = ρ·C·S/(2m) of the drag law a = −k|υ|υ: about 0.01 1/m for a football, 0 switches drag off.
  { key: 'k', symbol: 'k', unit: '1/m', min: 0, max: 0.05, step: 0.001, default: 0, kind: 'live', decimals: 3 },
];

const DEG = Math.PI / 180;

/** Closed-form results for motion without drag (used for tests, view bounds and the "no drag" readout). */
export function ideal(v0, angleDeg, h0, g) {
  const vx = v0 * Math.cos(angleDeg * DEG);
  const vy = v0 * Math.sin(angleDeg * DEG);
  const flightTime = (vy + Math.sqrt(vy * vy + 2 * g * h0)) / g;
  const range = vx * flightTime;
  const maxHeight = h0 + (vy > 0 ? (vy * vy) / (2 * g) : 0);
  return { vx, vy, flightTime, range, maxHeight };
}

/**
 * Point projectile with optional quadratic air drag:
 *   a = −g ŷ − k·|v|·v
 * Integrated with RK4 at a fixed step. Landing time is found inside the last
 * step by solving y(τ) = 0 with the acceleration at the start of that step,
 * which is exact when k = 0.
 */
export class ProjectileModel  {
  t = 0;
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  maxHeight = 0;
  landed = false;
   timedOut = false;

  reset(p) {
    this.t = 0;
    this.x = 0;
    this.y = p.h0;
    this.vx = p.v0 * Math.cos(p.angle * DEG);
    this.vy = p.v0 * Math.sin(p.angle * DEG);
    this.maxHeight = p.h0;
    this.landed = false;
    this.timedOut = false;
  }

  accel(vx, vy, p) {
    const speed = Math.hypot(vx, vy);
    return [-p.k * speed * vx, -p.g - p.k * speed * vy];
  }

  step(dt, p) {
    if (this.landed || this.timedOut) return false;
    const y0 = [this.x, this.y, this.vx, this.vy];
    const f = (_t, s) => {
      const [ax, ay] = this.accel(s[2], s[3], p);
      return [s[2], s[3], ax, ay];
    };
    const next = rk4(f, this.t, y0, dt);

    if (next[1] < 0) {
      // Find the landing moment inside this step.
      const [ax, ay] = this.accel(this.vx, this.vy, p);
      const tau = firstRoot(0.5 * ay, this.vy, this.y, dt);
      this.x += this.vx * tau + 0.5 * ax * tau * tau;
      this.vx += ax * tau;
      this.vy += ay * tau;
      this.y = 0;
      this.t += tau;
      this.landed = true;
      return false;
    }

    [this.x, this.y, this.vx, this.vy] = next;
    this.t += dt;
    if (this.y > this.maxHeight) this.maxHeight = this.y;
    if (this.t >= T_MAX - 1e-9) {
      this.timedOut = true;
      return false;
    }
    return true;
  }

  isValid() {
    return [this.t, this.x, this.y, this.vx, this.vy].every(Number.isFinite);
  }

  sample() {
    return { x: this.x, y: this.y, vx: this.vx, vy: this.vy, speed: Math.hypot(this.vx, this.vy), hmax: this.maxHeight };
  }

  clone() {
    return Object.assign(new ProjectileModel(), this);
  }

  /** `text` is the simulation's text object (sims/projectile/<locale>.js). */
  finishMessage(text) {
    if (this.timedOut) return text.msg.timeUp(T_MAX);
    if (!this.landed) return '';
    // Launched from the ground and not upwards (α = 0° or υ₀ = 0): it is down again at once.
    if (this.t === 0) return text.msg.onGround;
    return text.msg.landed(num(this.t, 2), num(this.x, 2), num(this.maxHeight, 2));
  }
}

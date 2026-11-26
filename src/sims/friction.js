import { firstRoot } from './motion-1d/model.js';

export const G = 9.81; // m/s²








/**
 * A block of mass m on a surface, pushed along it by a force `push` ≥ 0 and moving the
 * same way (v ≥ 0), pressed on with normal force N. At rest, static friction matches the
 * push up to μs·N and holds it; past that, or once moving, kinetic friction μk·N opposes
 * the motion. Kinetic friction is never taken above the static limit.
 */
export function contact(v, push, N, mus, muk, m) {
  if (v > 0 || push > mus * N) {
    const fk = Math.min(muk, mus) * N;
    return { f: -fk, a: (push - fk) / m, sliding: true };
  }
  return { f: -push, a: 0, sliding: false };
}

/**
 * Move a distance s at speed v ≥ 0 for dt with constant acceleration a, stopping exactly
 * when the block comes to rest or reaches `end`. Exact, since a is constant over the step.
 * `tau` is the time used (less than dt only when it reaches the end).
 */
export function advance(s, v, a, dt, end) {
  const tStop = v > 0 && a < 0 ? -v / a : Infinity;
  const tau = Math.min(dt, tStop);
  const sNew = s + v * tau + 0.5 * a * tau * tau;
  if (sNew >= end) {
    const tc = firstRoot(0.5 * a, v, s - end, tau);
    return { s: end, v: v + a * tc, tau: tc, atEnd: true };
  }
  return { s: sNew, v: tStop <= dt ? 0 : v + a * dt, tau: dt, atEnd: false };
}

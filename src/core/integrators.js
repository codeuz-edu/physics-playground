/**
 * Numerical integrators for first-order systems  dy/dt = f(t, y).
 * State vectors are plain number arrays so models stay simple and testable.
 */

 

/** Classic 4th-order Runge–Kutta step. Returns the new state. */
export function rk4(f, t, y, dt) {
  const n = y.length;
  const k1 = f(t, y);
  const y2 = new Array(n);
  for (let i = 0; i < n; i++) y2[i] = y[i] + (dt / 2) * k1[i];
  const k2 = f(t + dt / 2, y2);
  const y3 = new Array(n);
  for (let i = 0; i < n; i++) y3[i] = y[i] + (dt / 2) * k2[i];
  const k3 = f(t + dt / 2, y3);
  const y4 = new Array(n);
  for (let i = 0; i < n; i++) y4[i] = y[i] + dt * k3[i];
  const k4 = f(t + dt, y4);
  const out = new Array(n);
  for (let i = 0; i < n; i++) out[i] = y[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  return out;
}

export function allFinite(values) {
  for (const v of values) if (!Number.isFinite(v)) return false;
  return true;
}

/**
 * Smallest root in (0, dtMax] of  A·τ² + B·τ + C = 0: the moment inside one step at which a body
 * reaches a wall or the ground. Falls back to dtMax if none is found (numerical edge cases).
 */
export function firstRoot(A, B, C, dtMax) {
  const eps = 1e-12;
  const roots = [];
  if (Math.abs(A) < eps) {
    if (Math.abs(B) > eps) roots.push(-C / B);
  } else {
    const disc = B * B - 4 * A * C;
    if (disc >= 0) {
      const s = Math.sqrt(disc);
      // Numerically stable quadratic formula.
      const q = -0.5 * (B + Math.sign(B || 1) * s);
      roots.push(q / A);
      if (Math.abs(q) > eps) roots.push(C / q);
    }
  }
  let best = dtMax;
  for (const r of roots) if (r >= -1e-12 && r <= dtMax + 1e-12 && r < best) best = Math.max(0, r);
  return best;
}

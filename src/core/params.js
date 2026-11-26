import { num } from './format.js';

/**
 * Parameter specs and validation.
 *
 * Every user-facing number in a sim is declared here with its unit and range,
 * so the UI, the URL loader and the model all agree on what a valid value is.
 */

 


























export function decimalsFor(spec) {
  if (spec.decimals !== undefined) return spec.decimals;
  const s = String(spec.step);
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
}







/**
 * Turn any input (typed text, URL value, slider value) into a valid number for
 * this parameter. Never returns NaN or Infinity.
 *
 * - Non-numeric or non-finite input falls back to `fallback` (last good value).
 * - Out-of-range input is clamped to [min, max].
 * - Values are snapped to the parameter's step grid (relative to min).
 */
export function sanitize(spec, raw, fallback = spec.default) {
  let n;
  if (typeof raw === 'number') {
    n = raw;
  } else if (typeof raw === 'string') {
    const trimmed = raw.trim().replace(',', '.');
    n = trimmed === '' ? NaN : Number(trimmed);
  } else {
    n = NaN;
  }

  if (!Number.isFinite(n)) {
    const safeFallback = Number.isFinite(fallback) ? clamp(fallback, spec.min, spec.max) : spec.default;
    return { value: safeFallback, corrected: true };
  }

  let v = clamp(n, spec.min, spec.max);
  if (spec.step > 0) {
    const steps = Math.round((v - spec.min) / spec.step);
    v = clamp(spec.min + steps * spec.step, spec.min, spec.max);
    // Remove floating point noise like 0.30000000000000004.
    v = Number(v.toFixed(Math.max(decimalsFor(spec), 6)));
  }
  return { value: v, corrected: Math.abs(v - n) > 1e-9 };
}

export function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

export function defaults(specs) {
  const out = {};
  for (const s of specs) out[s.key] = s.default;
  return out;
}

/** Read parameters from URL search params; unknown or bad values fall back to defaults. */
export function fromSearch(specs, search) {
  const out = defaults(specs);
  let q;
  try {
    q = new URLSearchParams(search);
  } catch {
    return out;
  }
  for (const s of specs) {
    const raw = q.get(s.key);
    if (raw !== null) out[s.key] = sanitize(s, raw).value;
  }
  return out;
}

export function toSearch(specs, values) {
  const q = new URLSearchParams();
  for (const s of specs) {
    const v = values[s.key];
    if (v !== undefined && v !== s.default) q.set(s.key, v.toFixed(decimalsFor(s)));
  }
  const str = q.toString();
  return str ? `?${str}` : '';
}

/** The value as the number box shows it, with a decimal comma. */
export function formatValue(spec, v) {
  return num(v, decimalsFor(spec));
}

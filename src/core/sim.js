


/** The physics of one simulation. Pure: no DOM, no drawing. */

























/**
 * Steps a copy of `model` to the end of its run, so graph axes can be sized for the whole
 * run before it is drawn. Uses the clock's fixed dt, so the plan matches the real run exactly
 * (unless a live parameter changes on the way, in which case plan again from that moment).
 * `cut` is true when the run is longer than `maxSteps`: plan again from where the run then is.
 */
export function planRun(model, p, dt, every = 1 / 60, maxSteps = 60000) {
  return planner(model, p, dt, every, maxSteps).advance(Infinity);
}

/**
 * planRun in pieces, so a long plan can be spread over several frames: `advance(n)` takes at
 * most n more steps and returns the finished plan, or null while there is more to do. It works
 * on its own copies of the model and the parameters, so later changes to them do not leak in.
 */
export function planner(model, p, dt, every = 1 / 60, maxSteps = 60000) {
  const m = model.clone();
  const params = { ...p };
  const samples = new History(every);
  const lo = {};
  const hi = {};
  const take = (s) => {
    for (const k in s) {
      const v = s[k];
      if (!Number.isFinite(v)) continue;
      if (lo[k] === undefined || v < lo[k]) lo[k] = v;
      if (hi[k] === undefined || v > hi[k]) hi[k] = v;
    }
  };
  take(m.sample());
  samples.record(m.t, m.sample(), true);
  let n = 0;
  let result = null;
  return {
    advance(steps) {
      if (result) return result;
      const stop = Math.min(maxSteps, n + steps);
      let ended = false;
      while (n < stop) {
        n++;
        const more = m.step(dt, params);
        if (!m.isValid()) { ended = true; break; }
        const s = m.sample();
        take(s);
        samples.record(m.t, s, !more);
        if (!more) { ended = true; break; }
      }
      if (ended || n >= maxSteps) result = { tEnd: m.t, lo, hi, samples, cut: !ended };
      return result;
    },
  };
}






































































































































/**
 * Fixed-rate record of model samples, used by graphs and strobe images. It never stops: when
 * `max` samples are stored, every second one is dropped and the interval doubles, so a long
 * run keeps its whole span at a coarser rate. `gen` counts these halvings, so a caller that
 * keeps something per sample (the app's snapshots) can drop the same entries.
 */
export class History {
   every;
   max;
  t = [];
  series = {};
   nextT = 0;
   gen = 0;

  constructor(every = 1 / 60, max = 20000) {
    this.every = every;
    this.max = max;
  }

  clear() {
    this.t = [];
    this.series = {};
    this.nextT = 0;
  }

  /** Record a sample if enough simulated time has passed (or if forced). Returns true if it was stored. */
  record(t, sample, force = false) {
    if (!force && t + 1e-9 < this.nextT) return false;
    // Avoid duplicate timestamps (e.g. forced final sample right after a regular one).
    if (this.t.length && Math.abs(this.t[this.t.length - 1] - t) < 1e-9) {
      for (const k in sample) this.series[k][this.series[k].length - 1] = sample[k];
      return true;
    }
    if (this.t.length >= this.max) {
      this.decimate();
      if (!force && t + 1e-9 < this.nextT) return false;
    }
    this.t.push(t);
    for (const k in sample) (this.series[k] ??= []).push(sample[k]);
    this.nextT = t + this.every;
    return true;
  }

  /** Keep the samples at even indices (0, 2, 4, …) and double the interval. */
  decimate() {
    const half = (a) => { const out = []; for (let i = 0; i < a.length; i += 2) out.push(a[i]); return out; };
    this.t = half(this.t);
    for (const k in this.series) this.series[k] = half(this.series[k]);
    this.every *= 2;
    this.gen++;
    this.nextT = this.t.length ? this.t[this.t.length - 1] + this.every : 0;
  }

  clone() {
    const h = new History(this.every, this.max);
    h.t = this.t.slice();
    for (const k in this.series) h.series[k] = this.series[k].slice();
    h.nextT = this.nextT;
    h.gen = this.gen;
    return h;
  }

  get length() {
    return this.t.length;
  }
}

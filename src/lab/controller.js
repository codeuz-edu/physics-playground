import { planRun, planner, History } from '../core/sim.js';
import { sanitize, defaults } from '../core/params.js';
import { num } from '../core/format.js';
import { Viewport, niceStep, formatTick, label as badge, beginFigure } from '../ui/canvas.js';

/**
 * The lab: one simulation's model, its run (fixed-step clock, history, snapshots for scrubbing,
 * previous runs), its parameters, and the painting of the stage, the graphs and the live numbers.
 * Framework-free: the page component (SimLab.vue) renders the controls and hands this class the
 * DOM nodes it paints into; this class tells the component what changed through `onUI` (rarely:
 * run state, values, scrub state), never per frame. Ported from the logic class of the original single-page app.
 *
 * Painting on demand: a frame every tick only while running; otherwise one frame when something
 * changed (`dirty`), and none at all while the lab is off-screen or the browser tab is hidden. The
 * readouts, the time chip, the graph legends and the time scale are written straight into their nodes.
 */

export const DT = 1 / 240;
export const STEP_T = 1 / 30;
export const SPEEDS = [0.25, 0.5, 1, 2];
/** The g menu: free-fall acceleration on the bodies of the solar system (names in the lab text, `planets`). */
export const PLANETS = [
  { key: 'earth', g: 9.81 }, { key: 'moon', g: 1.62 }, { key: 'mars', g: 3.71 },
  { key: 'mercury', g: 3.7 }, { key: 'venus', g: 8.87 }, { key: 'jupiter', g: 24.79 },
];
/**
 * The canvas palette: the names a drawing finds in `colors`. Their values are CSS custom properties
 * on the lab (lab.css, light and dark), read with readColors; `halo` is the outline behind vector labels.
 */
export const COLOR_NAMES = [
  'bg', 'surface', 'fg', 'muted', 'line', 'grid', 'axis', 'accent', 'pos', 'vel', 'acc', 'vx', 'vy', 'current', 'force', 'friction',
  'body', 'track', 'ghost', 'warn', 'sky-top', 'sky-bottom', 'ground', 'ground-edge', 'hatch', 'road', 'shadow', 'ball-hi', 'iron', 'iron-hi',
  'iron-dark', 'water', 'water-line', 'dot', 'gridline', 'cursor', 'hot',
];

export class Lab {
  /** @param {{ onUI: (snapshot: object) => void }} hooks */
  constructor({ onUI }) {
    this.onUI = onUI;
    // DOM nodes, given by the component.
    this.canvas = null; this.gEls = []; this.roEls = []; this.legEls = {}; this.tEl = null; this.scrubEl = null; this.scrubLblEl = null;
    this.wiredG = new WeakSet();
    // The simulation.
    this.def = null; this.model = null; this.p = {}; this.tg = {}; this.view = new Viewport(); this.colors = {};
    this.hist = null; this.snaps = []; this.truncCache = null; this.plan = null; this.ranges = null; this.prevRuns = [];
    this.run = 'ready'; this.speed = 1; this.acc = 0; this.fc = 0; this.scrub = null; this.hoverT = null; this.drag = null; this.errored = false;
    this.preset = '';
    this.tape = { a: [0, 0], b: [5, 0] };
    // Slider and drag input: applied once per frame (pend); the plan behind the graph axes is made in pieces (planner).
    this.pend = null; this.planWant = false; this.planFresh = false; this.planner = null; this.plannerFresh = false; this.planStart = -1e9;
    // Painting on demand.
    this.dirty = true; this.raf = 0; this.last = 0; this.onScreen = false; this.hidden = false; this.graphsOn = true;
    /** No time chip on screen (a narrow lab): the label of the time scale says what moment is shown. */
    this.chipless = false;
    this.roText = null; this.paintErr = null; this.cvK = 1; this.emitQueued = false; this.destroyed = false;
    /** Counters for tests and profiling. */
    this.stats = { paints: 0, frames: 0 };
  }

  // ---------- setup ----------
  /** The stage canvas: drag on it through def.drag, and the tape measure. */
  attach(canvas) {
    this.canvas = canvas;
    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerup', this.onUp);
    canvas.addEventListener('pointercancel', this.onUp);
    // The page scrolls under a finger on the stage, except when the finger lands on something it can drag.
    canvas.addEventListener('touchstart', this.onTouch, { passive: false });
  }
  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf); this.raf = 0;
    const cv = this.canvas;
    if (cv) {
      cv.removeEventListener('pointerdown', this.onDown); cv.removeEventListener('pointermove', this.onMove);
      cv.removeEventListener('pointerup', this.onUp); cv.removeEventListener('pointercancel', this.onUp);
      cv.removeEventListener('touchstart', this.onTouch);
    }
    this.def = null; this.model = null;
  }
  /** Forget the simulation (another one is loading): no frames until setDef. */
  unload() {
    cancelAnimationFrame(this.raf); this.raf = 0;
    this.def = null; this.model = null; this.drag = null; this.pend = null; this.planner = null; this.planWant = false; this.roText = null;
  }
  /** Show simulation `def` with parameter values `values` (already valid, e.g. from the URL), at t = 0. */
  setDef(def, values) {
    this.def = def;
    this.p = { ...defaults(def.params), ...(values || {}) };
    this.model = def.createModel();
    const tg = {}; for (const t of def.toggles) tg[t.key] = t.default; tg.__tape = false;
    this.tg = tg;
    this.view = new Viewport(); if (def.alignX) this.view.alignX = def.alignX;
    this.prevRuns = []; this.hist = null; this.errored = false; this.scrub = null; this.hoverT = null; this.drag = null;
    this.preset = ''; this.speed = this.speed || 1; this.pend = null; this.planner = null; this.planWant = false;
    this.run = 'ready';
    this.resetRun(false, false);
    this.invalidate();
  }

  // ---------- what the component sees ----------
  /** Tell the component that the run state, the values or the toggles changed (once per task, however many calls). */
  emit() {
    if (this.emitQueued || this.destroyed) return;
    this.emitQueued = true;
    queueMicrotask(() => { this.emitQueued = false; if (!this.destroyed && this.def) this.onUI(this.snapshot()); });
  }
  snapshot() {
    let fin = '';
    if (this.run === 'finished' && this.model) { try { fin = this.model.finishMessage(this.def.text) || ''; } catch (e) { console.error(e); } }
    return {
      run: this.run, errored: this.errored, scrubbing: this.scrub != null, canScrub: !!this.model && this.model.t > 0 && this.run !== 'running',
      fin, values: { ...this.p }, tg: { ...this.tg }, preset: this.preset, hasPrev: this.prevRuns.length > 0, speed: this.speed,
    };
  }

  // ---------- run ----------
  setRun(s) { this.run = s; this.dirty = true; this.emit(); this.kick(); }
  /** Record a sample, and a snapshot for scrubbing at the same index. When History halves itself (a long run), so do the snapshots. */
  record(force) {
    const H = this.hist, gen = H.gen;
    const stored = H.record(this.model.t, this.model.sample(), force);
    if (H.gen !== gen) { const s = []; for (let i = 0; i < this.snaps.length; i += 2) s.push(this.snaps[i]); this.snaps = s; }
    if (stored) this.snaps[H.length - 1] = this.model.clone();
  }
  /** One fixed step. A model that throws or goes invalid stops the run in the 'errored' state. */
  stepModel(dt) {
    try {
      const ok = this.model.step(dt, this.p);
      if (!this.model.isValid()) { this.errored = true; return false; }
      this.record(!ok);
      return ok;
    } catch (e) { console.error(e); this.errored = true; return false; }
  }
  /** Last resort for an exception outside the model step: stop the run, show the error, keep the loop alive. */
  halt(e) {
    if (this.errored && this.run === 'finished') return;
    console.error(e); this.errored = true; this.acc = 0; this.run = 'finished'; this.dirty = true; this.emit();
  }
  /**
   * Back to t = 0 with the current parameters. With `later` (a slider or canvas drag in progress) the graph
   * axes stay as they are and the plan behind them is made over the next frames (wantPlan); otherwise at once.
   */
  resetRun(keepPrev = true, restore = true, later = false) {
    const def = this.def;
    if (!def) return;
    if (!later) { this.pend = null; this.planWant = false; this.planner = null; }
    if (keepPrev && def.showsPrevious && this.hist && this.model.t > 0 && this.hist.length > 1) { this.prevRuns.unshift(this.hist.clone()); if (this.prevRuns.length > 3) this.prevRuns.pop(); }
    if (restore && def.restartValues) {
      for (const [k, v] of Object.entries(def.restartValues(this.p))) {
        const spec = def.params.find((s) => s.key === k); if (!spec || v === undefined) continue;
        this.p[k] = sanitize(spec, v).value;
      }
    }
    this.errored = false;
    this.hist = new History(1 / 60); this.snaps = []; this.truncCache = null;
    this.acc = 0; this.scrub = null; this.hoverT = null;
    try {
      this.model.reset(this.p);
      // Some parameter sets have no valid starting state: say so now instead of drawing nothing until Play.
      if (!this.model.isValid()) this.errored = true;
      this.record(true);
      if (!later) this.plan = planRun(this.model, this.p, DT, 1 / 60);
    } catch (e) {
      console.error(e); this.errored = true; later = false;
      this.plan = { tEnd: 0, lo: {}, hi: {}, samples: new History(1 / 60) };
    }
    if (later && this.plan) this.wantPlan(true); else this.ranges = this.rangesFrom(this.plan, null);
    this.setRun('ready');
    this.pushRo();
  }
  /** Ask for a new plan (graph axes) for the current state; `fresh` after a reset, so the axes may also shrink. */
  wantPlan(fresh) { this.planWant = true; this.planFresh = this.planFresh || fresh; this.kick(); }
  /**
   * Called every frame. Starts a wanted plan (at most every 100 ms while input keeps coming, at once when
   * `now` is true) and advances the one in progress by about 4 ms of work; the old axes stay until it is done.
   */
  pumpPlan(now) {
    const t0 = performance.now();
    if (this.planWant && (now || !this.planner) && (now || t0 - this.planStart >= 100)) {
      this.planner = planner(this.model, this.p, DT, 1 / 60);
      this.plannerFresh = this.planFresh; this.planWant = false; this.planFresh = false; this.planStart = t0;
    }
    if (!this.planner) return;
    let res = null;
    do res = this.planner.advance(400); while (!res && performance.now() - t0 < 4);
    if (!res) return;
    this.planner = null; this.plan = res;
    this.ranges = this.rangesFrom(res, this.plannerFresh ? null : this.ranges);
    this.dirty = true;
  }
  /** Apply slider or drag input that is waiting for the next frame. */
  applyPending() {
    const q = this.pend; if (!q) return;
    this.pend = null;
    if (q.restart || this.run === 'ready') this.resetRun(q.keepPrev && this.run !== 'ready', q.restart, true);
    else { this.wantPlan(false); this.dirty = true; }
    if (q.render) { this.preset = ''; this.emit(); }
  }
  /** The input has ended (pointer released, value committed, Play, step): apply it and start its plan now. */
  settle() {
    if (!this.def) return;
    try { this.applyPending(); if (this.planWant) this.pumpPlan(true); } catch (e) { this.halt(e); }
    this.kick();
  }
  rangesFrom(plan, old) {
    const tMax = Math.max(old ? old.tMax : 0, 1, plan.tEnd * 1.05);
    const g = this.def.graphs.map((spec, i) => {
      if (spec.range) return { lo: spec.range[0], hi: spec.range[1] };
      let lo = old ? old.g[i].rawLo : Infinity, hi = old ? old.g[i].rawHi : -Infinity;
      for (const s of spec.series) { if (plan.lo[s.key] !== undefined) lo = Math.min(lo, plan.lo[s.key]); if (plan.hi[s.key] !== undefined) hi = Math.max(hi, plan.hi[s.key]); }
      if (!Number.isFinite(lo) || !Number.isFinite(hi)) { lo = -1; hi = 1; }
      const rawLo = lo, rawHi = hi;
      lo = Math.min(0, lo); hi = Math.max(0, hi);
      if (hi - lo < 1e-6) { lo -= 1; hi += 1; }
      const pad = (hi - lo) * 0.1;
      return { lo: lo < 0 ? lo - pad : lo, hi: hi > 0 ? hi + pad : hi, rawLo, rawHi };
    });
    return { tMax, g };
  }
  togglePlay() {
    if (!this.def) return;
    this.settle();
    if (this.errored) return;
    if (this.run === 'running') { this.setRun('paused'); this.record(true); this.pushRo(); }
    else if (this.run === 'finished') { this.resetRun(true); this.setRun('running'); }
    else { const was = this.scrub; this.scrub = null; this.setRun('running'); if (was != null) this.pushRo(); }
    this.last = performance.now();
  }
  /** Start the run from where it is (a worked example's button). */
  start() {
    if (!this.def || this.errored || this.run === 'running') return;
    if (this.run === 'finished') this.resetRun(true);
    this.scrub = null; this.setRun('running'); this.last = performance.now();
  }
  stepOnce() {
    if (!this.def) return;
    this.settle();
    if (this.scrub != null) { this.setScrub(this.scrub + STEP_T); return; }
    if (this.run === 'finished' || this.errored) return;
    try {
      let left = STEP_T, ok = true;
      while (left > 1e-9 && ok) { const d = Math.min(DT, left); ok = this.stepModel(d); left -= d; }
      if (!ok) this.finish(); else { this.setRun('paused'); this.record(true); }
      this.pushRo();
    } catch (e) { this.halt(e); }
    this.paint();
  }
  reset() { if (this.def) this.resetRun(true); }
  finish() { this.acc = 0; this.setRun('finished'); this.pushRo(); }
  setScrub(t) {
    if (!this.model || this.model.t <= 0) return;
    if (this.run === 'running') this.setRun('paused');
    const was = this.scrub, tt = Math.max(0, Math.min(this.model.t, t));
    this.scrub = tt >= this.model.t - 1e-6 ? null : tt;
    this.dirty = true; this.pushRo(); this.kick();
    // "Oxiriga" and the step button depend on whether a past moment is shown.
    if ((was == null) !== (this.scrub == null)) this.emit();
  }
  toLive() { this.scrub = null; this.dirty = true; this.pushRo(); this.emit(); this.kick(); }
  setSpeed(s) { this.speed = s; this.emit(); }

  // ---------- the loop ----------
  /** The lab is on screen and the browser tab is visible. */
  labOn() { return this.onScreen && !this.hidden; }
  setOnScreen(on) { this.onScreen = on; if (on) this.kick(); }
  setHidden(hidden) { this.hidden = hidden; if (!hidden) { this.dirty = true; this.kick(); } }
  setGraphs(on) { this.graphsOn = on; this.invalidate(); }
  setColors(colors) { this.colors = colors; this.invalidate(); }
  /** Something on the stage or the graphs changed: draw it at the next frame. */
  invalidate() { this.dirty = true; this.kick(); }
  /** The canvases were resized: draw now (a resize observer runs before the browser paints), or later if off-screen. */
  resized() { if (this.def && this.labOn()) this.paint(); else this.dirty = true; }
  wantsFrame() {
    return !this.destroyed && !!this.def && this.labOn() && ((this.run === 'running' && !this.errored) || this.dirty || !!this.pend || this.planWant || !!this.planner);
  }
  /** Ask for a frame if one is needed and none is coming. */
  kick() {
    if (this.raf || !this.wantsFrame()) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }
  loop = (now) => {
    this.raf = 0;
    const el = Math.min(0.1, Math.max(0, (now - this.last) / 1000)); this.last = now;
    try {
      if (!this.def || !this.labOn()) return;
      this.stats.frames++;
      if (this.pend) this.applyPending(); // at most one slider/drag apply per frame
      const running = this.run === 'running' && !this.errored;
      if (running) {
        this.acc += el * this.speed;
        while (this.acc >= DT) { this.acc -= DT; if (!this.stepModel(DT)) { this.finish(); break; } }
        // A run longer than its plan: plan the next stretch before the line reaches the end of the axes.
        if (this.plan && this.plan.cut && !this.planner && !this.planWant && this.model.t > this.ranges.tMax * 0.9) this.wantPlan(false);
        if (this.model.t > this.ranges.tMax) this.ranges.tMax = this.model.t * 1.05;
      }
      if (this.planWant || this.planner) this.pumpPlan(false);
      if (running || this.dirty) {
        this.paint();
        if (!running || ++this.fc % 4 === 0) this.pushRo();
      }
    } catch (e) { this.halt(e); }
    finally {
      // Nothing above may end the loop: the next frame is asked for whatever happened.
      if (this.wantsFrame()) this.raf = requestAnimationFrame(this.loop);
    }
  };

  /** The state shown: the live model, or a recorded snapshot while scrubbing / hovering a graph. */
  shown() {
    const t = this.hoverT ?? this.scrub;
    if (t == null || !this.hist || t >= this.model.t) return { model: this.model, history: this.hist, live: true, t: this.model.t };
    const T = this.hist.t; let lo = 0, hi = T.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (T[mid] <= t) lo = mid; else hi = mid; }
    const idx = T[hi] <= t ? hi : lo, H = this.hist;
    if (!this.truncCache || this.truncCache.idx !== idx || this.truncCache.len !== T.length || this.truncCache.gen !== H.gen) {
      const h = new History(H.every); h.t = T.slice(0, idx + 1);
      for (const k in H.series) h.series[k] = H.series[k].slice(0, idx + 1);
      this.truncCache = { idx, len: T.length, gen: H.gen, h };
    }
    return { model: this.snaps[idx] || this.model, history: this.truncCache.h, live: false, t: T[idx], idx };
  }

  // ---------- live numbers ----------
  /**
   * The readouts, the time chip, the graph legends and the time scale. They change many times a second
   * while a sim runs, so they are written into their DOM nodes (writeRo), not rendered by the component.
   */
  pushRo() {
    if (!this.def || !this.model) return;
    const s = this.shown(), sm = s.model.sample(), def = this.def;
    const vals = def.readouts.map((r) => { const v = r.key === 't' ? s.model.t : sm[r.key]; return Number.isFinite(v) ? num(v, r.decimals) : '—'; });
    const leg = def.graphs.map((g) => g.series.filter((x) => !x.ahead).map((x) => { const v = sm[x.key]; const r = def.readouts.find((q) => q.key === x.key); return Number.isFinite(v) ? num(v, r ? r.decimals : 2) : '—'; }));
    this.roText = { t: num(s.model.t, 2), end: num(this.model.t, 2), vals, leg, max: Math.max(0.001, this.model.t), at: this.scrub ?? this.model.t };
    this.writeRo();
  }
  /**
   * Put the latest numbers into their nodes. The component renders these nodes empty and never touches
   * their text, so nothing it does can overwrite them; a node it creates anew is filled when it is bound.
   */
  writeRo() {
    const R = this.roText; if (!R) return;
    const put = (el, txt) => { if (el && el.__labTxt !== txt) { el.textContent = txt; el.__labTxt = txt; } };
    for (let i = 0; i < this.roEls.length; i++) put(this.roEls[i], R.vals[i] ?? '—');
    for (const k in this.legEls) { const [gi, si] = k.split('.'); put(this.legEls[k], (R.leg[gi] || [])[si] ?? '—'); }
    put(this.tEl, R.t);
    put(this.scrubLblEl, this.chipless ? `t = ${R.t}` : R.end);
    const sc = this.scrubEl;
    if (sc) {
      const mx = String(R.max); if (sc.max !== mx) sc.max = mx; // max first: value is clamped to it
      if (Math.abs(Number(sc.value) - R.at) > 0.0006) sc.value = String(R.at);
    }
  }
  /** A node that shows a live number was created or removed: (re)fill it. */
  bindNode(kind, el, i, j) {
    if (kind === 'ro') { if (this.roEls[i] === el) return; this.roEls[i] = el; }
    else if (kind === 'leg') { const k = `${i}.${j}`; if (this.legEls[k] === el) return; if (el) this.legEls[k] = el; else delete this.legEls[k]; }
    else if (kind === 't') { if (this.tEl === el) return; this.tEl = el; }
    else if (kind === 'scrubLbl') { if (this.scrubLblEl === el) return; this.scrubLblEl = el; }
    else if (kind === 'scrub') { if (this.scrubEl === el) return; this.scrubEl = el; if (el && !this.roText) { el.max = '0.001'; el.value = '0'; } }
    if (el) { el.__labTxt = null; this.writeRo(); }
  }
  setChipless(on) { if (this.chipless !== on) { this.chipless = on; this.writeRo(); } }

  // ---------- parameters ----------
  /**
   * A new parameter value. `cont` marks a stream of values (a slider being dragged, a held arrow key): the
   * value and the slider move at once, the model takes it at the next frame and the graph axes follow
   * within about 100 ms (applyPending, pumpPlan). Single changes (a menu, a typed value) apply at once.
   */
  onParam(key, value, cont) {
    const def = this.def; if (!def) return;
    const spec = def.params.find((s) => s.key === key); if (!spec) return;
    const v = sanitize(spec, value, this.p[key]).value;
    if (this.preset !== '') { this.preset = ''; this.emit(); }
    if (v === this.p[key]) return;
    this.p = { ...this.p, [key]: v };
    if (cont) {
      const q = this.pend || (this.pend = { restart: false, keepPrev: false, render: false });
      if (spec.kind === 'initial') q.restart = true;
      q.keepPrev = true;
      this.emit(); // the slider is a controlled input: show its new position now
      this.kick();
      return;
    }
    if (this.pend) this.applyPending(); // input still waiting for its frame goes first
    if (spec.kind === 'initial' || this.run === 'ready') {
      const was = this.run;
      this.resetRun(was === 'running' || was === 'finished' || was === 'paused', spec.kind === 'initial');
    } else {
      const fresh = this.planFresh || (this.planner && this.plannerFresh);
      this.planner = null; this.planWant = false; this.planFresh = false;
      this.plan = planRun(this.model, this.p, DT, 1 / 60);
      this.ranges = this.rangesFrom(this.plan, fresh ? null : this.ranges);
    }
    this.dirty = true;
    this.emit(); this.kick();
  }
  /** Values from outside (a preset, a worked example): sanitized, restartValues applied, run back at t = 0. */
  loadValues(values) {
    const def = this.def; if (!def) return;
    const p = {};
    for (const spec of def.params) p[spec.key] = sanitize(spec, values[spec.key] ?? spec.default).value;
    this.p = p;
    this.preset = '';
    this.resetRun(true);
    this.emit();
  }
  pickPreset(i) {
    const pr = this.def && this.def.presets[i]; if (!pr) return;
    this.loadValues(pr.values);
    this.preset = String(i);
    this.emit();
  }
  clearPreset() { this.preset = ''; this.emit(); }
  setToggle(key, on) {
    this.tg = { ...this.tg, [key]: on };
    if (key === '__tape' && on) this.placeTape();
    this.emit(); this.invalidate();
  }
  /**
   * The tape starts from 0 to 5 m along the ground (as in the old lab). Where that is not on the stage
   * (a small world, a world away from the origin), it is laid across the middle of what the stage shows.
   */
  placeTape() {
    const v = this.view; if (!v.width) return;
    const vis = v.visible(), inside = ([x, y]) => x >= vis.xMin && x <= vis.xMax && y >= vis.yMin && y <= vis.yMax;
    if (inside(this.tape.a) && inside(this.tape.b)) return;
    const w = vis.xMax - vis.xMin, r = (x) => (w >= 1 ? Math.round(x * 10) / 10 : x), y = r(vis.yMin + (vis.yMax - vis.yMin) * 0.35);
    this.tape = { a: [r(vis.xMin + w * 0.3), y], b: [r(vis.xMin + w * 0.7), y] };
  }
  clearPrev() { this.prevRuns = []; this.emit(); this.invalidate(); }

  // ---------- drawing ----------
  /** Draw the stage and the graphs. Nothing is drawn while the lab is off-screen; the next frame on screen draws. */
  paint() {
    if (!this.labOn()) { this.dirty = true; return; }
    this.dirty = false;
    this.stats.paints++;
    try { this.drawStage(); this.drawGraphs(); this.paintErr = null; }
    catch (e) { const m = String(e); if (m !== this.paintErr) { this.paintErr = m; console.error(e); } } // log a repeating draw error once, not 60 times a second
  }
  fitCv(cv, maxDpr = 3) {
    const r = cv.getBoundingClientRect(), d = Math.min(maxDpr, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (cv.width !== Math.round(w * d) || cv.height !== Math.round(h * d)) { cv.width = Math.round(w * d); cv.height = Math.round(h * d); }
    const ctx = cv.getContext('2d'); ctx.setTransform(d, 0, 0, d, 0, 0);
    return { ctx, w, h };
  }
  drawStage() {
    const cv = this.canvas; if (!cv || !this.def) return;
    const { ctx, w: cw, h: ch } = this.fitCv(cv), def = this.def, v = this.view;
    if (cw < 40 || ch < 40) return;
    // Stages narrower than 400 px draw a 400 px-wide scene scaled down, so labels keep their proportion to the
    // drawing; 400 (not more) keeps 12 px canvas text at 10.8 px or larger on a 360 px phone.
    const k = cw < 400 ? cw / 400 : 1, w = cw / k, h = ch / k, dpr = Math.min(3, window.devicePixelRatio || 1);
    this.cvK = k; ctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
    if (!this.drag) {
      const vp = def.viewPadding || { left: 44, right: 16, top: 16, bottom: 34 };
      v.padding = { left: vp.left, right: vp.right, top: Math.max(28, vp.top - 20), bottom: vp.bottom };
      v.alignY = h > w * 1.1 ? 'center' : 'bottom';
      v.fit(def.worldBounds(this.p), w, h);
    } else { v.width = w; v.height = h; }
    ctx.clearRect(0, 0, w, h); beginFigure(ctx);
    const s = this.shown();
    const previous = def.showsPrevious && this.tg.prev !== false ? this.prevRuns : [];
    def.draw({ ctx, view: v, model: s.model, params: this.p, toggles: this.tg, colors: this.colors, history: s.history, previous, text: def.text });
    if (this.tg.__tape) this.drawTape(ctx);
  }
  drawTape(ctx) {
    const v = this.view, C = this.colors;
    const A = [v.px(this.tape.a[0]), v.py(this.tape.a[1])], B = [v.px(this.tape.b[0]), v.py(this.tape.b[1])];
    const d = Math.hypot(this.tape.b[0] - this.tape.a[0], this.tape.b[1] - this.tape.a[1]);
    const ang = Math.atan2(B[1] - A[1], B[0] - A[0]), nx = -Math.sin(ang) * 7, ny = Math.cos(ang) * 7;
    ctx.save(); ctx.strokeStyle = C.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]);
    ctx.moveTo(A[0] - nx, A[1] - ny); ctx.lineTo(A[0] + nx, A[1] + ny); ctx.moveTo(B[0] - nx, B[1] - ny); ctx.lineTo(B[0] + nx, B[1] + ny); ctx.stroke();
    for (const [P, id] of [[A, 'tapeA'], [B, 'tapeB']]) {
      ctx.fillStyle = this.drag === id ? C.hot : C.bg; ctx.fillRect(P[0] - 6, P[1] - 6, 12, 12); ctx.strokeRect(P[0] - 6, P[1] - 6, 12, 12);
      ctx.beginPath(); ctx.moveTo(P[0] - 3, P[1]); ctx.lineTo(P[0] + 3, P[1]); ctx.moveTo(P[0], P[1] - 3); ctx.lineTo(P[0], P[1] + 3); ctx.stroke();
    }
    ctx.restore();
    badge(ctx, `${num(d, 2)} ${this.def.lengthUnit || 'm'}`, (A[0] + B[0]) / 2, (A[1] + B[1]) / 2 - 16, { fg: C.body, surface: C.bg }, 'center');
  }
  drawGraphs() {
    if (!this.def || !this.graphsOn || !this.def.graphs.length) return;
    const s = this.shown();
    this.def.graphs.forEach((spec, i) => this.drawGraph(this.gEls[i], spec, this.ranges.g[i], s));
  }
  drawGraph(cv, spec, rg, s) {
    if (!cv || !cv.offsetWidth) return;
    const C = this.colors, { ctx, w, h } = this.fitCv(cv), H = this.hist;
    const pad = { l: 40, r: 10, t: 6, b: 20 }, tMax = this.ranges.tMax;
    const X = (t) => pad.l + (t / tMax) * (w - pad.l - pad.r), Y = (val) => h - pad.b - ((val - rg.lo) / (rg.hi - rg.lo)) * (h - pad.t - pad.b);
    cv._lay = { l: pad.l, r: w - pad.r, tMax };
    ctx.clearRect(0, 0, w, h); ctx.font = '500 11px Barlow, sans-serif'; ctx.lineWidth = 1;
    const sy = niceStep(rg.hi - rg.lo, 4); ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let val = Math.ceil(rg.lo / sy) * sy; val <= rg.hi + 1e-9; val += sy) {
      const yy = Math.round(Y(val)) + 0.5; ctx.strokeStyle = Math.abs(val) < sy * 1e-6 ? C.fg : C.gridline; ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(w - pad.r, yy); ctx.stroke();
      ctx.fillStyle = C.muted; ctx.fillText(formatTick(val, sy), pad.l - 6, yy);
    }
    const sx = niceStep(tMax, Math.max(3, w / 80)); ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (let t = 0; t <= tMax + 1e-9; t += sx) { const xx = Math.round(X(t)) + 0.5; ctx.strokeStyle = C.gridline; ctx.beginPath(); ctx.moveTo(xx, pad.t); ctx.lineTo(xx, h - pad.b); ctx.stroke(); ctx.fillStyle = C.muted; ctx.fillText(formatTick(t, sx), xx, h - pad.b + 4); }
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillStyle = C.ghost; ctx.font = 'italic 12px "Times New Roman", serif'; ctx.fillText(`t, ${this.def.timeUnit || 's'}`, w - pad.r - 2, h - pad.b - 3);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(spec.unit, pad.l + 5, pad.t + 1);
    ctx.strokeStyle = C.fg; ctx.beginPath(); ctx.moveTo(pad.l + 0.5, pad.t); ctx.lineTo(pad.l + 0.5, h - pad.b + 0.5); ctx.lineTo(w - pad.r, h - pad.b + 0.5); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.rect(pad.l, pad.t, w - pad.l - pad.r, h - pad.t - pad.b); ctx.clip();
    for (const se of spec.series) {
      const col = C[se.color.replace(/^--/, '')] || C.fg;
      const src = se.ahead ? this.plan.samples : H, arr = src.series[se.key] || [];
      if (arr.length < 1) continue;
      ctx.strokeStyle = col; ctx.lineWidth = se.ahead ? 1.5 : 2; ctx.setLineDash(se.ahead ? [6, 5] : []); ctx.lineJoin = 'round'; ctx.beginPath();
      // A value that is not a number (not measured yet, undefined at that moment) leaves a gap in the line.
      for (let i = 0, pen = false; i < arr.length; i++) { if (!Number.isFinite(arr[i])) { pen = false; continue; } const xx = X(src.t[i]), yy = Y(arr[i]); pen ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); pen = true; }
      ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
    const sm = s.model.sample();
    if (!s.live) {
      const xx = Math.round(X(s.t)) + 0.5;
      ctx.strokeStyle = C.cursor; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(xx, pad.t); ctx.lineTo(xx, h - pad.b); ctx.stroke(); ctx.setLineDash([]);
    }
    for (const se of spec.series) {
      if (se.ahead || !Number.isFinite(sm[se.key])) continue;
      ctx.fillStyle = C[se.color.replace(/^--/, '')] || C.fg; ctx.strokeStyle = C.bg; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(X(s.model.t), Y(sm[se.key]), 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
  }
  graphHover(e, cv, commit) {
    if (this.run === 'running' || !this.hist || this.hist.length < 2 || !cv._lay) return;
    const r = cv.getBoundingClientRect(), Lr = cv._lay, x = e.clientX - r.left;
    const t = Math.max(0, Math.min(this.model.t, ((x - Lr.l) / (Lr.r - Lr.l)) * Lr.tMax));
    if (commit) { this.hoverT = null; this.setScrub(t); } else { this.hoverT = t; this.dirty = true; this.pushRo(); this.kick(); }
  }
  /**
   * Graph canvas i. Each canvas gets its listeners once. Mouse and pen: hover shows that moment, a press
   * or drag scrubs. Touch: a tap scrubs, a swipe scrolls the page (or the strip of graphs on a phone).
   */
  bindGraph(i, el) {
    if (el && !this.wiredG.has(el)) {
      this.wiredG.add(el);
      let tap = null;
      const touch = (e) => e.pointerType === 'touch';
      el.addEventListener('pointermove', (e) => { if (!touch(e)) this.graphHover(e, el, e.buttons === 1); });
      el.addEventListener('pointerdown', (e) => { if (touch(e)) tap = { x: e.clientX, y: e.clientY }; else this.graphHover(e, el, true); });
      el.addEventListener('pointerup', (e) => { const t0 = tap; tap = null; if (t0 && touch(e) && Math.hypot(e.clientX - t0.x, e.clientY - t0.y) < 10) this.graphHover(e, el, true); });
      el.addEventListener('pointercancel', () => { tap = null; });
      el.addEventListener('pointerleave', () => { if (this.hoverT == null) return; this.hoverT = null; this.dirty = true; this.pushRo(); this.kick(); });
    }
    if (el) { if (this.gEls[i] !== el) { this.gEls[i] = el; this.invalidate(); } }
    else if (this.gEls[i]) this.gEls[i] = null;
  }

  // ---------- pointer on the stage ----------
  pt(e) { const r = this.canvas.getBoundingClientRect(), k = this.cvK || 1; return [(e.clientX - r.left) / k, (e.clientY - r.top) / k]; }
  hitWhat(e) {
    if (!this.def || !this.model) return null;
    const [x, y] = this.pt(e), v = this.view;
    if (this.tg.__tape) {
      if (Math.hypot(x - v.px(this.tape.b[0]), y - v.py(this.tape.b[1])) < 14) return 'tapeB';
      if (Math.hypot(x - v.px(this.tape.a[0]), y - v.py(this.tape.a[1])) < 14) return 'tapeA';
    }
    if (this.def.drag && this.scrub == null) return this.def.drag.hit(v.wx(x), v.wy(y), this.model, this.p, v, this.tg);
    return null;
  }
  onTouch = (e) => {
    const t = e.touches[0];
    try { if (e.touches.length === 1 && t && this.hitWhat(t)) e.preventDefault(); } catch (err) { this.halt(err); }
  };
  onDown = (e) => {
    let h = null;
    try { h = this.hitWhat(e); } catch (err) { this.halt(err); }
    if (!h) return;
    this.drag = h; this.dirty = true; this.canvas.setPointerCapture(e.pointerId); this.canvas.style.cursor = 'grabbing'; e.preventDefault();
    this.kick();
  };
  onMove = (e) => {
    const cv = this.canvas;
    try {
      if (!this.drag) { if (e.pointerType !== 'touch') cv.style.cursor = this.hitWhat(e) ? 'grab' : ''; return; }
      const [x, y] = this.pt(e), v = this.view, wx = v.wx(x), wy = v.wy(y);
      if (this.drag === 'tapeA' || this.drag === 'tapeB') { const P = [Math.round(wx * 10) / 10, Math.round(wy * 10) / 10]; if (this.drag === 'tapeA') this.tape.a = P; else this.tape.b = P; this.invalidate(); return; }
      const def = this.def, changes = def.drag.move(this.drag, wx, wy, this.p, v);
      let changed = false, restart = false;
      for (const k in changes) {
        const spec = def.params.find((s) => s.key === k); if (!spec) continue;
        const before = this.p[k]; this.p[k] = sanitize(spec, changes[k], before).value;
        if (this.p[k] !== before) { changed = true; if (spec.kind === 'initial') restart = true; }
      }
      if (!changed) return;
      // Applied at the next frame, however many pointer events arrive before it (applyPending).
      const q = this.pend || (this.pend = { restart: false, keepPrev: false, render: false });
      if (restart) q.restart = true;
      q.render = true;
      this.kick();
    } catch (err) { this.halt(err); }
  };
  onUp = () => { if (!this.drag) return; this.drag = null; this.dirty = true; this.canvas.style.cursor = ''; this.settle(); };
}

<script setup>
// The simulation lab at the top of a simulation's page: <SimLab id="pendulum" />.
// The run, the model and all painting live in src/lab/controller.js (framework-free); this component
// renders the controls, hands the controller its DOM nodes, and connects it to the page: visibility,
// theme, keyboard, the URL query string and the worked-problem buttons (`physics-sim:load` on window).
// Nothing here touches window or document before onMounted: VitePress renders the page on the server.
import { reactive, ref, shallowRef, markRaw, computed, watch, onMounted, onBeforeUnmount, nextTick, useId } from 'vue'
import { useData } from 'vitepress'
import { loadSim } from '../../../src/sims/load.js'
import { Lab, SPEEDS, COLOR_NAMES } from '../../../src/lab/controller.js'
import { labText } from '../../../src/lab/text.js'
import { fromSearch, toSearch } from '../../../src/core/params.js'
import { decimalMark } from '../../../src/core/i18n.js'
import { readColors, refreshFonts, theme } from '../../../src/ui/canvas.js'
import LabPanel from './LabPanel.vue'

const props = defineProps({ id: { type: String, required: true } })
const { lang, page, frontmatter } = useData()
const T = computed(() => labText(lang.value))
const uid = useId()

const def = shallowRef(null)
const status = ref('loading') // 'loading' | 'error' | 'ready'
// What the controls show. Changes a few times per user action, never per frame (see Lab.emit).
const ui = reactive({ run: 'ready', errored: false, scrubbing: false, canScrub: false, fin: '', values: {}, drafts: {}, tg: {}, preset: '', hasPrev: false, speed: 1 })
const graphsOpen = ref(true)
const narrow = ref(false)
const toast = ref('')

const rootEl = ref(null), canvasEl = ref(null), stageEl = ref(null), graphsEl = ref(null), hudEl = ref(null), boxEl = ref(null)
const dockEl = ref(null), controlsEl = ref(null), statusEl = ref(null), panelComp = ref(null)
// The controller exists only in the browser.
const lab = import.meta.env.SSR ? null : markRaw(new Lab({ onUI }))

function onUI(s) {
  for (const k in s.values) if (ui.values[k] !== s.values[k]) { ui.values[k] = s.values[k]; delete ui.drafts[k]; }
  for (const k in ui.values) if (!(k in s.values)) delete ui.values[k];
  for (const k of ['run', 'errored', 'scrubbing', 'canScrub', 'fin', 'preset', 'hasPrev', 'speed']) if (ui[k] !== s[k]) ui[k] = s[k];
  for (const k in s.tg) if (ui.tg[k] !== s.tg[k]) ui.tg[k] = s.tg[k];
  scheduleUrl()
}

// Live-number nodes: the component renders them empty, the controller fills them (stable ref functions).
const nodeRefs = {}
const nodeRef = (kind, i = 0, j = 0) => nodeRefs[`${kind}.${i}.${j}`] ||= (el) => lab && lab.bindNode(kind, el, i, j)
const graphRefs = []
const graphRef = (i) => graphRefs[i] ||= (el) => lab && lab.bindGraph(i, el)

// What the page knows about this simulation before its code arrives (config.mjs, transformPageData).
const pre = computed(() => (frontmatter.value.lab && frontmatter.value.lab.id === props.id ? frontmatter.value.lab : null))
// The stage is only as tall as the drawing needs (width / ar + pad): a scene much wider than tall (a track,
// a table) would otherwise sit small at the bottom of an empty canvas. On a wide screen it is never under
// 420 px. The numbers come with the page (config.mjs, sceneOf), so the height is final from the first
// paint; lab.css has the same sum.
function sceneOf(d) {
  const b = d.worldBounds(Object.fromEntries(d.params.map(s => [s.key, s.default])))
  const vp = d.viewPadding || { left: 44, right: 16, top: 16, bottom: 34 }
  const ar = (b.xMax - b.xMin) / (b.yMax - b.yMin)
  if (!(ar > 0) || !Number.isFinite(ar)) return null
  return { ar: Math.round(ar * 1000) / 1000, pad: Math.round(Math.max(28, vp.top - 20) + vp.bottom - (vp.left + vp.right) / ar + 40 + (d.stageExtra || 0)) }
}
// From the simulation itself once it has loaded (the same numbers; in development it follows an edit at once).
const scene = computed(() => (def.value ? sceneOf(def.value) : pre.value ? pre.value.scene : null) || null)
const sceneVars = computed(() => (scene.value ? { '--scene-ar': scene.value.ar, '--scene-pad': `${scene.value.pad}px` } : null))
const hasGraphs = computed(() => (def.value ? def.value.graphs.length > 0 : !!pre.value && pre.value.graphs > 0))
const tUnit = computed(() => (def.value ? def.value.timeUnit : pre.value && pre.value.timeUnit) || 's')
// A long status text is cut to the height of its line; a tap opens it in full.
const statusOpen = ref(false)
watch(() => [props.id, ui.run], () => { statusOpen.value = false })
const tok = (c, fallback = 'var(--lab-text)') => (c ? `var(${c}, ${fallback})` : fallback)
const legend = (g) => g.series.filter((x) => !x.ahead)
const speedLabel = (s) => `${String(s).replace('.', decimalMark())}×`
const stateLabel = computed(() => (ui.errored ? T.value.states.errored : T.value.states[ui.run]))
const playLabel = computed(() => ({ running: T.value.pause, finished: T.value.replay, paused: T.value.resume, ready: T.value.play })[ui.run])
const statusText = computed(() => {
  const d = def.value
  if (!d) return ''
  if (ui.errored) return T.value.errored
  if (ui.run === 'finished' && ui.fin) return ui.fin
  return d.drag ? d.drag.hint : T.value.hint
})
const statusStrong = computed(() => ui.errored || (ui.run === 'finished' && !!ui.fin))
// The readout strip is drawn before the simulation's code arrives, from the labels the page carries
// (config.mjs puts them in the frontmatter when the site is built), so it has its final size in the
// pre-rendered page and the picture under it does not move. Both column layouts are given as CSS
// variables and lab.css picks one by the lab's width, with no script, for the same reason.
const readouts = computed(() => (def.value ? def.value.readouts : pre.value ? pre.value.readouts : []))
const roCols = computed(() => {
  const n = readouts.value.length || 3
  return { '--ro-wide': `repeat(${n}, minmax(0, auto))`, '--ro-narrow': `repeat(${n <= 4 ? n : 3}, minmax(0, 1fr))` }
})

// ---------- loading ----------
let seq = 0, retries = 0, pendingLoad = null, labPath = ''
async function load(id) {
  const my = ++seq
  clearTimeout(urlTimer); urlTimer = 0
  if (lab) lab.unload()
  status.value = 'loading'
  let d
  try {
    d = await loadSim(id, lang.value)
    if (!d) throw new Error(`no simulation "${id}"`)
  } catch (e) {
    if (my !== seq) return
    console.error(e); status.value = 'error'; return
  }
  if (my !== seq) return
  try {
    // The query string opens the same experiment: /sims/pendulum?L=2&g=1.62
    const values = fromSearch(d.params, searchOf(d.params, location.search))
    labPath = location.pathname
    lab.setDef(d, values)
    urlValues = JSON.stringify(lab.p) // the address already says this
    onUI(lab.snapshot()) // the controls render with this simulation's values from the start
    def.value = markRaw(d)
    status.value = 'ready'
    retries = 0
    if (pendingLoad) { const p = pendingLoad; pendingLoad = null; await nextTick(); applyLoad(p) }
  } catch (e) {
    if (my !== seq) return
    console.error(e); def.value = null; status.value = 'error'
  }
}
function retry() {
  // Two retries in the page; after that a reload, which starts from an empty module cache in every browser.
  if (++retries > 2) { location.reload(); return }
  load(props.id)
}

// ---------- the URL ----------
/** The query string with each parameter under its own key; a key typed in another case (?l=2 for L) counts. */
function searchOf(specs, search) {
  const q = new URLSearchParams(search), keys = new Set(specs.map((s) => s.key))
  for (const s of specs) {
    if (q.has(s.key)) continue
    for (const [k, v] of q) if (!keys.has(k) && k.toLowerCase() === s.key.toLowerCase()) { q.set(s.key, v); break }
  }
  return q.toString()
}
let urlTimer = 0, urlValues = ''
function scheduleUrl() {
  if (!lab || !lab.def || JSON.stringify(lab.p) === urlValues) return // only a change of values is written
  clearTimeout(urlTimer)
  urlTimer = setTimeout(writeUrl, 300)
}
/** The current values in the query string (replaceState: no history entry); keys the lab does not own stay. */
function writeUrl() {
  clearTimeout(urlTimer); urlTimer = 0
  const d = lab && lab.def
  if (!d || location.pathname !== labPath) return
  urlValues = JSON.stringify(lab.p)
  const q = new URLSearchParams(location.search), own = new Set(d.params.map((s) => s.key.toLowerCase()))
  for (const k of [...q.keys()]) if (own.has(k.toLowerCase())) q.delete(k)
  for (const [k, v] of new URLSearchParams(toSearch(d.params, lab.p))) q.set(k, v)
  const search = q.toString() ? `?${q}` : ''
  if (search === location.search) return
  try { history.replaceState(history.state, '', location.pathname + search + location.hash) } catch (e) { /* too many calls: the next change writes it */ }
}
async function copyLink() {
  writeUrl()
  const url = location.href
  let ok = false
  try { await navigator.clipboard.writeText(url); ok = true } catch (e) {
    const ta = document.createElement('textarea')
    ta.value = url; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
    document.body.appendChild(ta); ta.select()
    try { ok = document.execCommand('copy') } catch (err) { ok = false }
    ta.remove()
  }
  showToast(ok ? T.value.linkCopied : T.value.linkNotCopied)
}
let toastTimer = 0
function showToast(msg) { toast.value = msg; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.value = '' }, 1800) }

// ---------- worked problems further down the page ----------
function onLoadEvent(e) {
  const d = e.detail
  if (!d || !d.values) return
  if (!lab.def) { pendingLoad = d; return }
  applyLoad(d)
}
function applyLoad(d) {
  lab.loadValues(d.values)
  if (d.run) lab.start()
  const root = rootEl.value
  if (!root || full.value) return
  // Focus first (so Space pauses and R resets at once): a focus() after it would stop a smooth scroll.
  root.focus({ preventScroll: true })
  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  root.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' })
}

// ---------- keyboard: only while the lab has focus or the pointer is over it (or fills the window) ----------
function onKey(e) {
  const root = rootEl.value, t = e.target
  if (e.altKey || e.ctrlKey || e.metaKey || !lab || !lab.def || status.value !== 'ready' || !root) return
  if (e.key === 'Escape' && full.value) { if (t && /INPUT|SELECT/.test(t.tagName) && t.type !== 'range') return; e.preventDefault(); setFull(false); return }
  if (!root.contains(document.activeElement) && !root.matches(':hover') && !full.value) return
  if (t && (/INPUT|SELECT|TEXTAREA/.test(t.tagName) && t.type !== 'range' || t.isContentEditable)) return
  if (e.key === 'f' || e.key === 'F') { e.preventDefault(); setFull(!full.value); return }
  if (e.key === ' ') { if (t && t.tagName === 'BUTTON') return; e.preventDefault(); lab.togglePlay() }
  else if (e.key === 'ArrowRight' && !(t && t.type === 'range')) { e.preventDefault(); lab.stepOnce() }
  else if (e.key === 'r' || e.key === 'R') { e.preventDefault(); lab.reset() }
}

// ---------- theme ----------
let dark = null
function readTheme() {
  const root = rootEl.value
  if (!root) return
  dark = document.documentElement.classList.contains('dark')
  const c = readColors(root, [...COLOR_NAMES, 'halo'])
  theme.halo = c.halo
  delete c.halo
  lab.setColors(c)
}

function toggleGraphs() { graphsOpen.value = !graphsOpen.value; autoFolded = true; lab.setGraphs(graphsOpen.value); relayout() }
function togglePanel() { panelOpen.value = !panelOpen.value; relayout() }
// On the page the settings are a band under the stage; the settings button puts them beside the stage
// instead, as the old app's card, so a value can be changed with the whole stage in view.
const panelFloat = ref(false)
const canFloat = computed(() => !narrowPage.value && labW.value >= 760)
function toggleSettings() { if (full.value) togglePanel(); else { panelFloat.value = !panelFloat.value; relayout() } }

// ---------- full-window mode ----------
// The same lab, fixed over the whole window and laid out as the old app: the stage under everything,
// the readouts at the top, the settings panel at the right (a sheet above the controls on a phone),
// the graphs, status line and time controls in a dock at the bottom. Nothing is re-created: the run,
// the values and the scrub position stay as they are.
const full = ref(false)
const panelOpen = ref(true)
const win = reactive({ w: 1280, h: 800 })
let graphsBeforeFull = true, autoFolded = false
const phone = computed(() => win.w < 760)
const compact = computed(() => phone.value || win.h < 520)
const side = computed(() => full.value && panelOpen.value && !phone.value)
const docked = computed(() => side.value && win.w > 1100)
function setFull(on) {
  if (on === full.value || !lab) return
  const html = document.documentElement
  if (on) {
    win.w = innerWidth; win.h = innerHeight
    graphsBeforeFull = graphsOpen.value
    // The old app's defaults: the panel open from 1100 px, the graphs open from 760 × 800.
    panelOpen.value = innerWidth >= 1100
    graphsOpen.value = hasGraphs.value && !(innerHeight < 800 || innerWidth < 760)
    autoFolded = !graphsOpen.value
    html.classList.add('lab-full-open')
  } else {
    graphsOpen.value = graphsBeforeFull
    html.classList.remove('lab-full-open')
  }
  full.value = on
  lab.setGraphs(graphsOpen.value)
  nextTick(() => {
    relayout()
    const root = rootEl.value
    if (!root) return
    if (on) root.focus({ preventScroll: true })
    else { const b = root.querySelector('.lab-full-btn'); if (b) b.focus({ preventScroll: true }) }
  })
}
const panelEl = () => (panelComp.value && panelComp.value.$el) || null
/** Full window: size the graphs to the room the stage can spare and place the canvas in the free rectangle (the old layoutBox). */
function layoutFull() {
  const root = rootEl.value, stage = stageEl.value, dock = dockEl.value, hud = hudEl.value
  if (!root || !stage || !dock || !hud) return
  const H = stage.offsetHeight, W = stage.offsetWidth, top = hud.offsetTop + hud.offsetHeight + 8
  const set = (k, v) => { if (root.style.getPropertyValue(k) !== v) root.style.setProperty(k, v) }
  const g0 = graphsEl.value && graphsEl.value.querySelector('.lab-graph-cv')
  if (graphsOpen.value && g0) {
    const fixed = dock.offsetHeight - g0.offsetHeight, room = H - top - (W < 760 ? 180 : 200) - fixed - 16
    set('--fw-gh', `${Math.max(40, Math.min(120, Math.floor(room)))}px`)
    if (room < 40 && !autoFolded) { autoFolded = true; graphsOpen.value = false; lab.setGraphs(false); nextTick(relayout); return }
  }
  // The settings panel never covers the time controls: beside the stage from 760 px (and beside the dock
  // above 1100 px); on a phone a sheet just above the dock, at most half the free height.
  const below = H - dock.offsetTop, aside = panelEl()
  const sheetH = panelOpen.value && W < 760 && aside && aside.offsetParent ? aside.offsetHeight + 8 : 0
  set('--fw-top', `${top}px`)
  set('--fw-bottom', `${below + 8 + sheetH}px`)
  set('--fw-right', `${panelOpen.value && W >= 760 ? 362 : 0}px`)
  set('--fw-dock', `${below}px`)
  set('--fw-pmax', `${Math.max(140, Math.round((dock.offsetTop - 8 - top) / 2))}px`)
}

// ---------- the stage's height on the page ----------
/** Bottom edge of the bars that stay at the top of the window while the page scrolls (VitePress nav, "on this page" bar). */
function stickyBottom() {
  let b = 0
  const nav = document.querySelector('.VPNav'), local = document.querySelector('.VPLocalNav')
  if (nav && getComputedStyle(nav).position === 'fixed') b = Math.max(b, nav.getBoundingClientRect().bottom)
  if (local) { const cs = getComputedStyle(local); if (cs.display !== 'none' && /sticky|fixed/.test(cs.position)) b = Math.max(b, local.offsetHeight + (parseFloat(cs.top) || 0)) }
  return b
}
/**
 * On the page the lab is sized from the window, not from its content: the time controls, the readouts,
 * the stage and the status line make one block as tall as the window below the site's top bars, and the
 * stage takes what the others leave (at most 3:4 of its width on a wide screen, 1.3 times its width on a
 * phone, as the old app's proportions; at least 240 px). The settings and the graphs come after the block,
 * so they never take height from the stage; the page then scrolls on to the lesson.
 */
function fitStage() {
  const root = rootEl.value, box = boxEl.value
  if (full.value || !root || !box) return
  const w = box.clientWidth, wide = !narrowPage.value
  const others = [hudEl.value, controlsEl.value, statusEl.value].reduce((n, el) => n + (el ? el.offsetHeight : 0), 2)
  const block = innerHeight - stickyBottom() - (wide ? 16 : 8)
  const sc = scene.value, need = sc ? Math.max(wide ? 420 : 0, w / sc.ar + sc.pad) : Infinity
  const h = Math.round(Math.max(240, Math.min(block - others, (wide ? 0.75 : 1.3) * w, need)))
  const set = (k, v) => { if (root.style.getPropertyValue(k) !== v) root.style.setProperty(k, v) }
  set('--lab-stage-h', `${h}px`)
  // The settings card beside the stage: from under the time controls to the bottom of the stage.
  const top = controlsEl.value ? controlsEl.value.offsetHeight : 0
  set('--pf-top', `${top + 8}px`)
  set('--pf-h', `${(hudEl.value ? hudEl.value.offsetHeight : 0) + h - 16}px`)
}
let relayoutQueued = false
function relayout() {
  if (relayoutQueued) return
  relayoutQueued = true
  requestAnimationFrame(() => { relayoutQueued = false; measure(); if (full.value) layoutFull(); else fitStage() })
}

// ---------- lifecycle ----------
let io = null, ro = null, mo = null
const onVis = () => lab.setHidden(document.hidden)
const onSettle = () => lab.settle()
const onFonts = () => { lab.invalidate(); relayout() }
const onResize = () => { win.w = innerWidth; win.h = innerHeight; relayout() }
const narrowPage = ref(false), labW = ref(0)
function measure() {
  const root = rootEl.value
  if (!root) return
  const page = root.clientWidth < 640
  if (page !== narrowPage.value) narrowPage.value = page
  if (!full.value && labW.value !== root.clientWidth) labW.value = root.clientWidth
  if (panelFloat.value && !canFloat.value) panelFloat.value = false
  // As the old lab: a readout strip under 640 px is laid out as on a phone (and the time moves to the time scale).
  const n = full.value ? phone.value || win.w - (side.value ? 362 : 16) - (compact.value ? 8 : 16) < 640 : (panelFloat.value ? root.clientWidth - 362 : root.clientWidth) < 640
  if (n !== narrow.value) narrow.value = n
  lab.setChipless(n)
}
onMounted(() => {
  const root = rootEl.value
  root.__lab = lab // for tests and the console: document.querySelector('.sim-lab').__lab
  // The page around the lab (see lab.css): the outline column gives way and the lab spans the main area.
  document.documentElement.classList.add('has-sim-lab')
  win.w = innerWidth; win.h = innerHeight
  lab.attach(canvasEl.value)
  refreshFonts(root)
  readTheme()
  lab.setHidden(document.hidden)
  io = new IntersectionObserver((entries) => { for (const en of entries) lab.setOnScreen(en.isIntersecting) })
  io.observe(root)
  ro = new ResizeObserver((entries) => {
    for (const en of entries) if (en.target === canvasEl.value || en.target.classList.contains('lab-graphs')) lab.resized()
    relayout()
  })
  for (const el of [canvasEl.value, root, dockEl.value, hudEl.value]) if (el) ro.observe(el)
  mo = new MutationObserver(() => { if (document.documentElement.classList.contains('dark') !== dark) readTheme() })
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  document.addEventListener('visibilitychange', onVis)
  document.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)
  // The end of a slider or canvas drag (anywhere: the pointer may leave the lab): apply it and plan the graphs.
  window.addEventListener('pointerup', onSettle, true)
  document.addEventListener('change', onSettle, true)
  window.addEventListener('physics-sim:load', onLoadEvent)
  if (document.fonts) { document.fonts.ready.then(onFonts, () => {}); document.fonts.addEventListener('loadingdone', onFonts) }
  measure()
  load(props.id)
})
onBeforeUnmount(() => {
  seq++
  clearTimeout(urlTimer); clearTimeout(toastTimer)
  if (io) io.disconnect(); if (ro) ro.disconnect(); if (mo) mo.disconnect()
  document.removeEventListener('visibilitychange', onVis)
  document.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointerup', onSettle, true)
  document.removeEventListener('change', onSettle, true)
  window.removeEventListener('physics-sim:load', onLoadEvent)
  if (document.fonts) document.fonts.removeEventListener('loadingdone', onFonts)
  // Another page may have mounted its own lab already: the class stays while any lab is on the page.
  const html = document.documentElement
  if (rootEl.value) rootEl.value.dataset.leaving = ''
  html.classList.remove('lab-full-open')
  if (!document.querySelector('.sim-lab:not([data-leaving])')) html.classList.remove('has-sim-lab')
  lab.destroy()
})
watch(() => props.id, (id, old) => { if (id !== old) load(id) })
watch(graphsEl, (el, old) => { if (!ro) return; if (old) ro.unobserve(old); if (el) ro.observe(el) })
watch(panelComp, (c, old) => { if (!ro) return; if (old && old.$el) ro.unobserve(old.$el); if (c && c.$el) ro.observe(c.$el) })
watch([def, graphsOpen, panelOpen, panelFloat, full, narrowPage], () => nextTick(relayout))
</script>

<template>
 <section
  ref="rootEl" class="sim-lab"
  :class="{ 'is-narrow': narrow, 'is-ready': status === 'ready', 'is-full': full, 'is-phone': full && phone, 'is-compact': full && compact, 'is-short': full && win.h < 520, 'panel-open': full && panelOpen, 'panel-side': side, 'panel-docked': docked, 'panel-float': !full && panelFloat && canFloat }"
  :style="sceneVars" tabindex="-1" :aria-label="T.region" :aria-modal="full ? 'true' : null" :role="full ? 'dialog' : null"
 >
  <i class="corner tl" /><i class="corner tr" /><i class="corner bl" /><i class="corner br" />
  <div ref="stageEl" class="lab-stage">
   <div ref="hudEl" class="lab-hud">
    <dl v-if="readouts.length" class="lab-readouts" :style="roCols">
     <div v-for="(r, i) in readouts" :key="r.key" class="lab-ro">
      <dt><span class="lab-swatch" :style="{ background: r.color ? tok(r.color) : 'transparent' }" /><span class="lab-ro-label">{{ r.label }}</span></dt>
      <dd><span :ref="nodeRef('ro', i)" class="lab-ro-val" /><span class="lab-unit">{{ r.unit }}</span></dd>
     </div>
    </dl>
    <div v-if="def" class="lab-time">
     <output class="lab-chip">t&nbsp;=&nbsp;<span :ref="nodeRef('t')" />&nbsp;{{ tUnit }}</output>
     <span class="lab-tag lab-state" :class="ui.run === 'running' && !ui.errored ? 'is-accent' : ui.run === 'paused' ? 'is-outline' : 'is-neutral'"><span class="lab-state-dot" />{{ stateLabel }}</span>
    </div>
   </div>
   <div ref="boxEl" class="lab-canvas-box">
    <canvas ref="canvasEl" class="lab-canvas" role="img" :aria-label="page.title" />
    <div v-if="toast" class="lab-toast" role="status">{{ toast }}</div>
   </div>
  </div>

  <!-- The dock: graphs, status line and time controls. On the page they follow the stage (controls first,
       graphs last, see lab.css); in the full window they float at the bottom as in the old app. -->
  <div ref="dockEl" class="lab-dock">
   <i class="corner tl" /><i class="corner tr" /><i class="corner bl" /><i class="corner br" />
   <div v-if="def && hasGraphs" v-show="graphsOpen" ref="graphsEl" class="lab-graphs" :style="{ '--lab-ngraphs': def.graphs.length }">
    <figure v-for="(g, gi) in def.graphs" :key="g.id || gi" class="lab-graph">
     <i class="corner tl" /><i class="corner tr" /><i class="corner bl" /><i class="corner br" />
     <figcaption class="lab-graph-head">
      <span class="lab-graph-title">{{ g.title }}</span>
      <span class="lab-legend">
       <span v-for="(x, si) in legend(g)" :key="x.key" class="lab-legend-item"><span class="lab-legend-line" :style="{ background: tok(x.color, 'var(--lab-n-400)') }" /><i class="lab-sym">{{ x.label }}</i> <span :ref="nodeRef('leg', gi, si)" /></span>
      </span>
     </figcaption>
     <canvas :ref="graphRef(gi)" class="lab-graph-cv" />
    </figure>
   </div>

   <!-- The status line keeps a fixed height (lab.css). A finish message longer than that, or a hint
        the visitor taps, opens upward over the bottom edge of the picture and moves nothing. -->
   <div ref="statusEl" class="lab-status" :class="{ 'is-strong': statusStrong, 'is-error': ui.errored, 'is-open': statusOpen }" role="status" aria-live="polite" @click="statusOpen = !statusOpen">
    <div class="lab-status-box">
     <span class="lab-status-dot" /><span class="lab-status-text">{{ statusText }}</span>
     <span class="lab-keys" aria-hidden="true"><span v-for="[k, what] in T.keys" :key="k"><kbd>{{ k }}</kbd>{{ what }}</span></span>
    </div>
   </div>

   <div ref="controlsEl" class="lab-controls" role="group" :aria-label="T.controls">
    <div class="lab-play">
     <button type="button" class="lab-btn lab-btn-primary lab-play-btn" :disabled="!def || ui.errored" :title="T.playTitle" @click="lab.togglePlay()">
      <i class="corner tl" /><i class="corner tr" /><i class="corner bl" /><i class="corner br" />
      <svg v-if="ui.run === 'running'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="14" y="4" width="4" height="16" rx="1" /><rect x="6" y="4" width="4" height="16" rx="1" /></svg>
      <svg v-else-if="ui.run === 'finished'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3" /></svg>
      <span>{{ playLabel }}</span>
     </button>
     <button type="button" class="lab-btn lab-btn-icon" :disabled="!def || (ui.run === 'finished' && !ui.scrubbing)" :title="T.stepTitle(tUnit)" :aria-label="T.step" @click="lab.stepOnce()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" x2="19" y1="5" y2="19" /></svg>
     </button>
     <button type="button" class="lab-btn lab-btn-icon" :disabled="!def" :title="T.resetTitle" :aria-label="T.reset" @click="lab.reset()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
     </button>
    </div>
    <span class="lab-break" aria-hidden="true" />
    <div class="lab-scrub">
     <input :ref="nodeRef('scrub')" type="range" min="0" step="0.001" :disabled="!ui.canScrub" :aria-label="T.timeline" :title="T.timelineTitle" @input="lab.setScrub(Number($event.target.value))">
     <span class="lab-scrub-lbl"><span :ref="nodeRef('scrubLbl')" /> {{ tUnit }}</span>
     <button v-if="ui.scrubbing" type="button" class="lab-btn lab-btn-ghost lab-to-end" @click="lab.toLive()">{{ T.toEnd }}</button>
    </div>
    <div class="lab-seg" role="radiogroup" :aria-label="T.speed" :title="T.speed">
     <label v-for="s in SPEEDS" :key="s" class="lab-seg-opt"><input type="radio" :name="`${uid}-speed`" :checked="ui.speed === s" @change="lab.setSpeed(s)">{{ speedLabel(s) }}</label>
    </div>
    <div class="lab-tools">
     <button v-if="hasGraphs" type="button" class="lab-btn lab-btn-icon" :disabled="!def" :class="{ 'is-on': graphsOpen }" :aria-pressed="graphsOpen" :title="graphsOpen ? T.hideGraphs : T.showGraphs" :aria-label="graphsOpen ? T.hideGraphs : T.showGraphs" @click="toggleGraphs">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m19 9-5 5-4-4-3 3" /></svg>
     </button>
     <button v-if="full || canFloat" type="button" class="lab-btn lab-btn-icon lab-panel-btn" :class="{ 'is-on': full ? panelOpen : panelFloat }" :aria-pressed="full ? panelOpen : panelFloat" :title="T.settings" :aria-label="T.settings" @click="toggleSettings">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>
     </button>
     <button type="button" class="lab-btn lab-btn-icon lab-link-btn" :disabled="!def" :title="T.copyLink" :aria-label="T.copyLink" @click="copyLink">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
     </button>
     <button type="button" class="lab-btn lab-full-btn" :class="{ 'is-on': full }" :disabled="!def" :aria-pressed="full" :title="full ? T.fullExit : T.fullTitle" :aria-label="full ? T.fullExit : T.full" @click="setFull(!full)">
      <svg v-if="full" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" /><path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
      <span v-if="!full" class="lab-full-label">{{ T.full }}</span>
     </button>
    </div>
   </div>
  </div>

  <LabPanel v-if="def" ref="panelComp" :def="def" :ui="ui" :lab="lab" :T="T" :uid="uid" :full="full || (panelFloat && canFloat)" @toast="showToast" @close="toggleSettings" />
  <div v-else class="lab-panel lab-panel-empty" aria-hidden="true" />

  <div v-if="status === 'loading'" class="lab-cover is-late" role="status">{{ T.loading }}</div>
  <div v-else-if="status === 'error'" class="lab-cover" role="alert">
   <div class="lab-cover-box">
    <span class="lab-cover-title">{{ T.loadFailedTitle }}</span>
    <span class="lab-cover-text">{{ T.loadFailed(page.title) }}</span>
    <button type="button" class="lab-btn lab-btn-primary" @click="retry">{{ T.retry }}</button>
   </div>
  </div>
 </section>
</template>

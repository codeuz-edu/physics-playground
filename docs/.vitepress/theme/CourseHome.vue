<script setup>
// The contents page (docs/index.md). The hero copy and the chapter notes come from the page's `home`
// frontmatter, the chapters and their order from course.json, and each card's title, summary and
// topic from that simulation's own page (sims.data.js). Interface words are in i18n.js.
//
// A card's picture is the simulation's own figure at t = 0, drawn by its draw() as the lab would,
// at most 1.5 device pixels per CSS pixel. Nothing of this runs on the server: pictures are drawn
// after mounting, and a card's simulation is imported (loadSim) only when the card comes within one
// screen of view. The canvas keeps a 16:9 box from the first paint, so drawing moves nothing. Colours
// come from the CSS variables in home.css, read again when the light/dark theme changes.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import course from '../course.json'
import { data as pages } from './sims.data.js'
import { localeOf, useT } from './i18n.js'
import { readProgress } from './progress.js'
import { loadSim } from '../../../src/sims/load.js'
import { Viewport, beginFigure, readColors, refreshFonts, theme } from '../../../src/ui/canvas.js'
import { defaults } from '../../../src/core/params.js'
import { History } from '../../../src/core/sim.js'
import { COLOR_NAMES } from '../../../src/lab/controller.js'

const { frontmatter, lang, site } = useData()
const t = useT()
const home = computed(() => frontmatter.value.home || {})
const locale = computed(() => localeOf(lang.value))
const meta = computed(() => pages)
const href = id => withBase(`/sims/${id}${site.value.cleanUrls ? '' : '.html'}`)
// "Kinematika · Tekislikdagi harakat": the chapter is already the section heading.
const subtopic = topic => (topic.includes('·') ? topic.split('·').slice(1).join('·').trim() : topic)

const chapters = computed(() => course.map(chapter => ({
 number: Number(chapter.number),
 slug: chapter.slug,
 name: chapter.uz,
 note: home.value.chapters?.[chapter.slug] || '',
 cards: chapter.sims.flatMap((id, i) => {
  const page = meta.value[id]
  if (!page) return []
  const details = [subtopic(page.topic), page.examples ? t.value.problems(page.examples) : ''].filter(Boolean).join(', ')
  return [{ id, figure: `${Number(chapter.number)}.${i + 1}`, title: page.title, summary: page.summary, details, href: href(id) }]
 })
})))
const cardCount = computed(() => chapters.value.reduce((n, chapter) => n + chapter.cards.length, 0))
const start = computed(() => (meta.value[home.value.start?.sim] ? href(home.value.start.sim) : chapters.value.find(c => c.cards.length)?.cards[0].href))

// Progress: read after mounting, so the server-rendered page and the first client render match.
const opened = ref(new Set())
const last = ref(null)
const resume = computed(() => (last.value && meta.value[last.value] ? { title: meta.value[last.value].title, href: href(last.value) } : null))
const openedIn = cards => cards.filter(card => opened.value.has(card.id)).length
const openedCount = computed(() => chapters.value.reduce((n, chapter) => n + openedIn(chapter.cards), 0))

// ---------- thumbnails ----------
const wrapper = ref(null)
const canvases = new Map()   // sim id -> <canvas>
const scenes = new Map()     // sim id -> { def, params, model, history, toggles, size }
const requested = new Set()  // sim ids whose picture is loading or drawn
let fontsReady = null, colors = null, intersection = null, resize = null, themeWatch = null, unmounted = false

// Vue calls this on every render of a card (and with null when the card goes away).
const register = (id, el) => {
 if (!el) { canvases.delete(id); return }
 if (canvases.get(id) === el) return
 canvases.set(id, el)
 if (requested.has(id)) { resize?.observe(el); paint(id) } else intersection?.observe(el)
}

async function show(id) {
 if (requested.has(id)) return
 requested.add(id)
 try {
  // The fonts the drawings use are fetched first, so the first picture already has them.
  fontsReady ||= document.fonts ? Promise.all(['400 12px Barlow', '500 12px Barlow', '700 12px Barlow'].map(font => document.fonts.load(font))).catch(() => {}) : null
  const [def] = await Promise.all([loadSim(id, locale.value), fontsReady])
  if (unmounted) return
  const params = defaults(def.params)
  const model = def.createModel()
  model.reset(params)
  const history = new History(1 / 60)
  history.record(0, model.sample(), true)
  const toggles = Object.fromEntries((def.toggles || []).map(toggle => [toggle.key, toggle.default]))
  scenes.set(id, { def, params, model, history, toggles, size: '' })
  paint(id)
  if (canvases.get(id)) resize?.observe(canvases.get(id))
 } catch (error) {
  console.error(`Contents page: the picture of "${id}" could not be drawn.`, error)
 }
}

// Draw one card. With `onlyIfResized`, a card already drawn at its present size is left alone.
function paint(id, onlyIfResized = false) {
 const scene = scenes.get(id), el = canvases.get(id)
 if (!scene || !el || !el.isConnected) return
 const box = el.getBoundingClientRect(), w = Math.round(box.width), h = Math.round(box.height)
 if (!w || !h || (onlyIfResized && scene.size === `${w}x${h}`)) return
 scene.size = `${w}x${h}`
 if (!colors) {
  colors = readColors(wrapper.value, COLOR_NAMES)
  refreshFonts(wrapper.value)
  theme.halo = readColors(wrapper.value, ['halo']).halo
 }
 const dpr = Math.min(1.5, window.devicePixelRatio || 1)
 el.width = Math.round(w * dpr)
 el.height = Math.round(h * dpr)
 const ctx = el.getContext('2d')
 ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
 const { def, params, model, history, toggles } = scene
 const view = new Viewport()
 if (def.alignX) view.alignX = def.alignX
 view.padding = { left: 18, right: 18, top: 18, bottom: 26 }
 view.fit(def.worldBounds(params), w, h)
 ctx.fillStyle = colors.bg
 ctx.fillRect(0, 0, w, h)
 beginFigure(ctx)
 try {
  def.draw({ ctx, view, model, params, toggles, colors, history, previous: [], text: def.text })
 } catch (error) {
  console.error(`Contents page: the picture of "${id}" could not be drawn.`, error)
 }
}

onMounted(() => {
 const progress = readProgress()
 opened.value = progress.opened
 last.value = progress.last

 if ('IntersectionObserver' in window) {
  intersection = new IntersectionObserver((entries) => {
   for (const entry of entries) {
    if (!entry.isIntersecting) continue
    intersection.unobserve(entry.target)
    show(entry.target.dataset.sim)
   }
  }, { rootMargin: '100% 0px' })
  for (const el of canvases.values()) intersection.observe(el)
 } else {
  for (const id of canvases.keys()) show(id)
 }
 if ('ResizeObserver' in window) {
  let queued = new Set(), frame = 0
  resize = new ResizeObserver((entries) => {
   for (const entry of entries) queued.add(entry.target.dataset.sim)
   cancelAnimationFrame(frame)
   frame = requestAnimationFrame(() => { for (const id of queued) paint(id, true); queued = new Set() })
  })
 }
 // VitePress marks the dark theme with the class "dark" on <html>.
 let dark = document.documentElement.classList.contains('dark')
 themeWatch = new MutationObserver(() => {
  if (document.documentElement.classList.contains('dark') === dark) return
  dark = !dark
  colors = null
  for (const id of scenes.keys()) paint(id)
 })
 themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
 unmounted = true
 intersection?.disconnect()
 resize?.disconnect()
 themeWatch?.disconnect()
})
</script>

<template>
 <div ref="wrapper" class="course-home">
  <section class="home-hero home-wrap" aria-labelledby="home-title">
   <div class="hero-heading">
    <span class="hero-kicker">{{ home.kicker }}</span>
    <h1 id="home-title">{{ home.title }} <span class="hero-accent">{{ home.titleAccent }}</span></h1>
   </div>
   <div class="hero-copy">
    <p class="hero-lead">{{ home.lead }}</p>
    <div class="hero-actions">
     <a v-if="resume" class="home-button primary blueprint is-resume" :href="resume.href" :title="`${t.resume}: ${resume.title}`">
      <i class="corner tl" /><i class="corner tr" /><i class="corner bl" /><i class="corner br" />
      <span>{{ t.resume }}: {{ resume.title }}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
     </a>
     <a v-else-if="start" class="home-button primary blueprint" :href="start">
      <i class="corner tl" /><i class="corner tr" /><i class="corner bl" /><i class="corner br" />
      <span>{{ home.start?.text }}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
     </a>
     <a class="home-button" href="#chapters">{{ t.contents }}</a>
    </div>
    <p v-if="home.note" class="hero-note">{{ home.note }}</p>
    <div class="hero-progress">
     <span class="progress-track" aria-hidden="true"><span :style="{ width: `${cardCount ? openedCount / cardCount * 100 : 0}%` }" /></span>
     <span class="progress-text">{{ t.progress(openedCount, cardCount) }}</span>
    </div>
   </div>
  </section>

  <div id="chapters" class="chapters home-wrap">
   <section v-for="chapter in chapters" :id="chapter.slug" :key="chapter.slug" class="chapter" :aria-labelledby="`chapter-${chapter.slug}`">
    <header class="chapter-head">
     <span class="chapter-number" aria-hidden="true">{{ chapter.number }}</span>
     <div class="chapter-text">
      <h2 :id="`chapter-${chapter.slug}`">{{ t.chapter(chapter.number) }}. {{ chapter.name }}</h2>
      <p v-if="chapter.note">{{ chapter.note }}</p>
     </div>
     <span v-if="chapter.cards.length" class="chapter-progress" :title="t.chapterProgress(openedIn(chapter.cards), chapter.cards.length)">
      <span class="visually-hidden">{{ t.chapterProgress(openedIn(chapter.cards), chapter.cards.length) }}</span>
      <span aria-hidden="true">{{ openedIn(chapter.cards) }} / {{ chapter.cards.length }}</span>
     </span>
    </header>
    <ul v-if="chapter.cards.length" class="card-grid">
     <li v-for="card in chapter.cards" :key="card.id">
      <a class="sim-card blueprint" :href="card.href">
       <i class="corner tl" /><i class="corner tr" /><i class="corner bl" /><i class="corner br" />
       <canvas :ref="el => register(card.id, el)" class="sim-thumb" :data-sim="card.id" aria-hidden="true" />
       <span class="sim-card-body">
        <span class="sim-card-figure">{{ t.figure(card.figure) }}</span>
        <span class="sim-card-title">{{ card.title }}</span>
        <span class="sim-card-summary">{{ card.summary }}</span>
        <span class="sim-card-details">
         <span>{{ card.details }}</span>
         <span v-if="opened.has(card.id)" class="sim-card-opened">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>{{ t.opened }}
         </span>
        </span>
       </span>
      </a>
     </li>
    </ul>
    <p v-else class="chapter-pending">{{ t.chapterPending }}</p>
   </section>
  </div>
 </div>
</template>

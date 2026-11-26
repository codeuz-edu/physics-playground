import { defineConfig } from 'vitepress'
import { createLogger } from 'vite'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { seo } from './seo.mjs'

// course.json lists the chapters and, in order, the simulations of each. A simulation has a page
// when its file exists: sims/<number>-<chapter slug>/<nn>-<sim id>.md, for example
// sims/06-oscillations/01-pendulum.md. `rewrites` keeps the URL short (/sims/pendulum).
// The site is in Uzbek only, so pages have no language prefix; a chapter's name is its "uz" key.
const course = JSON.parse(readFileSync(new URL('./course.json', import.meta.url)))
const fileOf = (chapter, id) => `${chapter.number}-${chapter.slug}/${String(chapter.sims.indexOf(id) + 1).padStart(2, '0')}-${id}.md`
const source = path => new URL(`../${path}`, import.meta.url)

// The title of a page: its frontmatter `title`, else its first "# " heading.
const titleOf = path => {
 const text = readFileSync(source(path), 'utf8')
 const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || ''
 const title = frontmatter.match(/^title:\s*(.+)$/m)?.[1].trim().replace(/^(['"])(.*)\1$/, '$2') || text.match(/^#\s+(.+)$/m)?.[1].trim()
 return title || path
}

// The simulation pages that exist, in course order.
const sims = course.flatMap(chapter => chapter.sims
 .map(id => ({ chapter, id, path: `sims/${fileOf(chapter, id)}`, link: `/sims/${id}` }))
 .filter(sim => existsSync(source(sim.path)))
 .map(sim => ({ ...sim, title: titleOf(sim.path) })))

// The reference pages: the overview (index.md) first, then the pages in the order the overview
// links to them, then any other page by file name.
const reference = (() => {
 const dir = 'reference/'
 if (!existsSync(source(dir))) return []
 const names = readdirSync(source(dir)).filter(file => file.endsWith('.md')).map(file => file.slice(0, -3)).sort()
 const linked = names.includes('index') ? [...readFileSync(source(`${dir}index.md`), 'utf8').matchAll(/\]\(\.\/([\w-]+)/g)].map(m => m[1]) : []
 return [...new Set(['index', ...linked, ...names])].filter(name => names.includes(name))
  .map(name => ({ text: titleOf(`${dir}${name}.md`), link: `/${dir}${name === 'index' ? '' : name}` }))
})()

// The sidebar: the contents page, the 18 chapters with their simulations, then the reference pages.
// Chapter groups start folded; the one holding the open page unfolds by itself.
const sidebar = [
 { text: 'Mundarija', link: '/' },
 { text: 'Simulyatsiyalar', items: course.map(chapter => ({
  text: `${Number(chapter.number)}. ${chapter.uz}`, collapsed: true,
  items: sims.filter(sim => sim.chapter === chapter).map(sim => ({ text: sim.title, link: sim.link }))
 })).filter(chapter => chapter.items.length) },
 { text: 'Maʼlumotnoma', items: reference }
]

// Previous / next at the foot of a simulation page: the simulations in course order, so the first
// one has no "previous" and the last has no "next" (the sidebar alone would lead on to the contents
// and reference pages, which the footer's "simulation" labels do not fit). Reference pages turn the
// footer off in their own frontmatter.
const footerLink = sim => (sim ? { text: sim.title, link: sim.link } : false)
const footerLinks = new Map(sims.map((sim, i) => [`sims/${sim.id}.md`, { prev: footerLink(sims[i - 1]), next: footerLink(sims[i + 1]) }]))

const rewrites = Object.fromEntries(course.flatMap(chapter => chapter.sims
 .map(id => [`sims/${fileOf(chapter, id)}`, `sims/${id}.md`])))

const base = process.env.SITE_BASE || '/'
const hostname = 'https://codeuz-edu.github.io/physics-playground/'
// Page links end in .html (cleanUrls is off, as on the organisation's other sites); GitHub Pages
// and `vitepress preview` also serve them without it.
const cleanUrls = false

// Head tags for search engines, link previews and AI tools: canonical address, Open Graph and
// Twitter card with the preview image, author, and a schema.org Course on the contents page (seo.mjs,
// the same file as in the organisation's other course repositories).
const site = seo({
 url: hostname,
 name: 'Fizika maydonçasi',
 image: { path: 'og-image.jpg', width: 1200, height: 733, alt: 'Fizika maydonçasi: gorizontga burçak ostida otilgan jism simulyatsiyasi' },
 languages: { uz: '' },
 defaultLanguage: 'uz',
 homes: { 'index.md': 'Fizika maydonçasi' }
})

// The old single-page site linked to a simulation as /#pendulum: such a link opens that
// simulation's page. Only the contents page (docs/index.md) carries this script.
const simIds = course.flatMap(chapter => chapter.sims)
const redirect = `(function () { var sims = ${JSON.stringify(simIds)}; var id = location.hash.slice(1).split('?')[0]; if (sims.indexOf(id) >= 0) location.replace(${JSON.stringify(base)} + 'sims/' + id + ${JSON.stringify(cleanUrls ? '' : '.html')}) })()`

// VitePress 1.x is written for Vite 5; this project runs it on Vite 6, which prints a warning
// about one line in VitePress's own search box ("Failed to resolve /@localSearchIndex") every time
// the dev server starts. Search works either way, so that one message is dropped.
const logger = createLogger()
const warn = logger.warn
logger.warn = (message, options) => { if (!String(message).includes('/@localSearchIndex')) warn(message, options) }

/**
 * How tall a narrow (phone) stage has to be for a simulation's drawing: stage width / ar + pad pixels.
 * ar is the scene's width over its height for the default values; pad is the room the stage keeps around the
 * scene, plus the simulation's own `stageExtra` for what it draws above the scene (a chart, bars). The page carries these so the stage has its final height from the first paint; SimLab.vue has the
 * same sum (sceneOf there) for a lab on a page without them.
 */
function sceneOf(def) {
 const b = def.worldBounds(Object.fromEntries(def.params.map(s => [s.key, s.default])))
 const vp = def.viewPadding || { left: 44, right: 16, top: 16, bottom: 34 }
 const ar = (b.xMax - b.xMin) / (b.yMax - b.yMin)
 if (!(ar > 0) || !Number.isFinite(ar)) return null
 return { ar: Math.round(ar * 1000) / 1000, pad: Math.round(Math.max(28, vp.top - 20) + vp.bottom - (vp.left + vp.right) / ar + 40 + (def.stageExtra || 0)) }
}

export default defineConfig({
 // No ssr/optimizeDeps settings are needed: the simulations are plain ES modules under src/, and
 // the variable import in loadSim (src/sims/load.js) is split into one chunk per simulation by Vite.
 // Font files are never inlined into the stylesheet: the small latin-ext files (under Vite's 4 KB
 // limit) would otherwise travel as base64 inside the CSS that every page waits for.
 vite: { customLogger: logger, build: { assetsInlineLimit: file => (/\.woff2$/.test(file) ? false : undefined) } },
 title: 'Fizika maydonçasi',
 titleTemplate: ':title — Fizika maydonçasi',
 base, outDir: '../dist', cleanUrls,
 // Working notes (specs and plans) live in docs/superpowers and are not pages of the site.
 srcExclude: ['superpowers/**'],
 // VitePress normally downloads the page behind every link that scrolls into view. The contents
 // page links to all 73 simulations, so that would fetch the whole site; pages load on click instead.
 router: { prefetchLinks: false },
 sitemap: { hostname, transformItems: site.sitemapItems },
 lastUpdated: true,
 rewrites,
 // Formulas are written as $...$ and $$...$$ and typeset when the site is built.
 markdown: { math: true },
 head: [
  ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
  // The browser bar takes the page ground of each theme; theme/index.js follows the theme switch.
  ['meta', { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#f2f2f3' }],
  ['meta', { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#16191c' }],
  ...site.head
 ],
 async transformPageData(pageData) {
  const frontmatter = pageData.frontmatter
  // A simulation page carries its readout labels (and whether it has graphs), so the lab can draw its
  // readout strip and its buttons at full size in the pre-rendered page: nothing moves when the
  // simulation's code arrives (see theme/SimLab.vue). The loader is imported here, by address, and not
  // at the top of this file: a top-level import would make every file under src/sims part of the
  // config, and the dev server would restart on each edit of a simulation.
  const id = pageData.relativePath.match(/^sims\/(?:.*\/)?(?:\d+-)?([a-z0-9-]+)\.md$/)?.[1]
  if (simIds.includes(id)) {
   const { loadSim } = await import(/* @vite-ignore */ new URL('../../src/sims/load.js', import.meta.url).href)
   const def = await loadSim(id, 'uz')
   frontmatter.lab = { id, graphs: def.graphs.length, timeUnit: def.timeUnit || 's', readouts: def.readouts.map(({ key, label, unit, color }) => ({ key, label, unit, color })), scene: sceneOf(def) }
  }
  if (pageData.relativePath === 'index.md') frontmatter.head = [...(frontmatter.head || []), ['script', {}, redirect]]
  const links = footerLinks.get(pageData.relativePath)
  if (links) {
   if (frontmatter.prev === undefined) frontmatter.prev = links.prev
   if (frontmatter.next === undefined) frontmatter.next = links.next
  }
 },
 // Per page: the search and link-preview tags (seo.mjs), and a preload of the two font files every
 // page shows first (Barlow 400 and Barlow Condensed 600, latin).
 transformHead(context) {
  const fonts = context.assets.filter(file => /\/barlow-(latin-400|condensed-latin-600)-normal\.[\w-]+\.woff2$/.test(file))
  return [
   ...site.transformHead(context),
   ...fonts.map(href => ['link', { rel: 'preload', href, as: 'font', type: 'font/woff2', crossorigin: '' }])
  ]
 },
 lang: 'uz',
 description: 'Fizikani tajriba qilib örganing: 73 ta interaktiv simulyatsiya, darslar va yeçilgan masalalar.',
 themeConfig: {
  nav: [
   { text: 'Simulyatsiyalar', link: '/', activeMatch: '^/(sims/.*)?$' },
   { text: 'Maʼlumotnoma', link: '/reference/', activeMatch: '^/reference/' }
  ],
  sidebar,
  outline: { label: 'Bu sahifada', level: [2, 3] },
  docFooter: { prev: 'Oldingi simulyatsiya', next: 'Keyingi simulyatsiya' },
  darkModeSwitchLabel: 'Rang rejimi', lightModeSwitchTitle: 'Yoruğ rejimga ötiş', darkModeSwitchTitle: 'Qoronği rejimga ötiş',
  sidebarMenuLabel: 'Mundarija', returnToTopLabel: 'Yuqoriga', skipToContentLabel: 'Asosiy matnga ötiş',
  editLink: { pattern: 'https://github.com/codeuz-edu/physics-playground/edit/main/docs/:path', text: 'Bu sahifaga özgartiriş taklif qiliş' },
  lastUpdated: { text: 'Oxirgi yangilaniş' },
  notFound: { title: 'Sahifa topilmadi', quote: 'Bu manzilda sahifa yöq. Balki u köçirilgandir.', linkText: 'Mundarijaga', linkLabel: 'Mundarijaga qaytiş' },
  footer: { message: 'Dastur kodi MIT litsenziyasi asosida tarqatiladi. Suratlar Wikimedia Commonsdan olingan: muallifi va litsenziyasi har bir surat ostida yozilgan.' },
  siteTitle: 'Fizika maydonçasi',
  // The old site's mark: a thrown body's path in a blueprint frame. One file per theme.
  logo: { light: '/logo.svg', dark: '/logo-dark.svg', alt: '' },
  socialLinks: [{ icon: 'github', link: 'https://github.com/codeuz-edu/physics-playground', ariaLabel: 'GitHub' }],
  // Search matches both Uzbek Latin spellings. The lessons use ş, ç, ö, ğ, but many people type
  // sh, ch, o', g'. Every word, in the index and in what the visitor types, is reduced to one
  // plain form ("tezlaniş", "tezlanish" and "tezlanis" all become "tezlanish").
  // VitePress copies these two functions to the browser as text, so they must not use anything
  // defined outside themselves.
  search: { provider: 'local', options: {
   miniSearch: { options: {
    tokenize: text => text.replace(/(\p{L})['’‘`ʻʼ](?=\p{L})/gu, '$1').split(/[\n\r\p{Z}\p{P}]+/u),
    processTerm: term => term.toLowerCase().replace(/ş/g, 'sh').replace(/ç/g, 'ch').replace(/ö/g, 'o').replace(/ğ/g, 'g').replace(/[ʻʼ]/g, '')
   } },
   translations: {
    button: { buttonText: 'Qidiriş', buttonAriaLabel: 'Saytdan qidiriş' },
    modal: {
     displayDetails: 'Batafsil körsatiş', resetButtonTitle: 'Tozalaş', backButtonTitle: 'Qidirişni yopiş', noResultsText: 'Natija topilmadi',
     footer: { selectText: 'tanlaş', selectKeyAriaLabel: 'Enter', navigateText: 'ötiş', navigateUpKeyAriaLabel: 'yuqoriga', navigateDownKeyAriaLabel: 'pastga', closeText: 'yopiş', closeKeyAriaLabel: 'Esc' }
    }
   }
  } }
 }
})

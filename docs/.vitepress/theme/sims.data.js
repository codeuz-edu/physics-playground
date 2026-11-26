import { createContentLoader } from 'vitepress'

// What the contents page shows on a simulation's card, read from the frontmatter of the simulation
// pages when the site is built (and again whenever a page changes under `npm run dev`), so the page
// itself stays the one place where a title or summary is written:
//   { pendulum: { title, summary, topic, examples }, … }
// A page lives at sims/<nn>-<chapter>/<kk>-<sim id>.md (see config.mjs); a simulation without a
// page is simply missing here.
export default createContentLoader('sims/**/*.md', {
 transform(pages) {
  const sims = {}
  for (const { url, frontmatter: fm } of pages) {
   const id = url.split('/').at(-1).replace(/\.html$/, '').replace(/^\d+-/, '')
   const examples = Array.isArray(fm.examples) ? fm.examples.length : Number(fm.examples) || 0
   sims[id] = { title: fm.title || id, summary: fm.description || '', topic: fm.topic || '', examples }
  }
  return sims
 }
})

import { watch } from 'vue'
import { inBrowser, useData, useRoute } from 'vitepress'
// The default theme without its Inter font: the site sets its own type (style.css).
import DefaultTheme from 'vitepress/theme-without-fonts'
// Barlow (text) and Barlow Condensed (headings), served from this site: no font is fetched from
// another site. scripts/build-fonts.mjs cuts the font files down to the characters the site uses and
// writes fonts/fonts.css; `npm run dev` and `npm run build` run it first.
import './fonts/fonts.css'
import SimLab from './SimLab.vue'
import SimExample from './SimExample.vue'
import SimPhoto from './SimPhoto.vue'
import CourseHome from './CourseHome.vue'
import { recordVisit } from './progress.js'
import './style.css'
import './lab.css'
import './lesson.css'
import './home.css'

export default {
 extends: DefaultTheme,
 setup() {
  if (!inBrowser) return
  const route = useRoute()
  const { isDark } = useData()
  // Remember every simulation page opened, and the last one, so the contents page can show
  // progress and offer to continue. This stays in the visitor's browser.
  watch(() => route.path, path => {
   const sim = path.match(/\/sims\/([a-z0-9-]+?)(?:\.html)?$/)
   if (sim) recordVisit(sim[1])
  }, { immediate: true })
  // The browser bar follows the theme switch, not only the system setting (see `head` in config.mjs).
  watch(isDark, dark => {
   for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.content = dark ? '#16191c' : '#f2f2f3'
  }, { immediate: true })
 },
 enhanceApp({ app }) {
  app.component('SimLab', SimLab)         // the interactive simulation at the top of each sim page
  app.component('SimExample', SimExample) // a worked problem with a button that loads its values into the lab
  app.component('SimPhoto', SimPhoto)     // a lesson photo with caption and credit
  app.component('CourseHome', CourseHome) // the contents page: chapters and simulation cards
 }
}

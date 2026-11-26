import { computed } from 'vue'
import { useData } from 'vitepress'

// Interface text of the theme's own components, one entry per language. The copy of a page (the
// contents page's hero and chapter notes) lives in that page's frontmatter; sidebar, search and
// footer labels live in config.mjs. Uzbek is the site's language today; English is kept ready so
// that adding the `en` locale needs no change to the components.
const messages = {
 uz: {
  contents: 'Mundarija',
  resume: 'Davom etiş',
  chapter: n => `${n}-bob`,
  figure: n => `${n}-rasm`,
  problems: n => `${n} ta masala`,
  opened: 'oçilgan',
  progress: (done, total) => `${total} ta simulyatsiyadan ${done} tasi oçilgan`,
  chapterProgress: (done, total) => `${total} tadan ${done} tasi oçilgan`,
  chapterPending: 'Bu bobning sahifalari hali tayyor emas.'
 },
 en: {
  contents: 'Contents',
  resume: 'Continue',
  chapter: n => `Chapter ${n}`,
  figure: n => `Figure ${n}`,
  problems: n => `${n} ${n === 1 ? 'problem' : 'problems'}`,
  opened: 'opened',
  progress: (done, total) => `${done} of ${total} simulations opened`,
  chapterProgress: (done, total) => `${done} of ${total} opened`,
  chapterPending: 'The pages of this chapter are not ready yet.'
 }
}

/** The language of the page as a key of `messages` ("uz-Latn" → "uz"); Uzbek when there is none. */
export function localeOf(lang) {
 const key = String(lang || '').split('-')[0]
 return messages[key] ? key : 'uz'
}

export function useT() {
 const { lang } = useData()
 return computed(() => messages[localeOf(lang.value)])
}

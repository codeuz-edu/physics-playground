// Which simulations the visitor has opened, and the last one, kept in this browser only
// (localStorage). theme/index.js records every simulation page on the way in; the contents page
// reads it for its check marks, its progress counts and the "continue" button. Ids are the same in
// every language, so the progress carries over when the visitor switches language.
const OPENED = 'physics-sim:opened'
const LAST = 'physics-sim:last-sim'

export function recordVisit(id) {
 try {
  const opened = readProgress().opened
  localStorage.setItem(OPENED, JSON.stringify([...opened.add(id)]))
  localStorage.setItem(LAST, id)
 } catch { /* storage is blocked: the site works without it */ }
}

export function readProgress() {
 try {
  const list = JSON.parse(localStorage.getItem(OPENED) || '[]')
  return { opened: new Set(Array.isArray(list) ? list.filter(id => typeof id === 'string') : []), last: localStorage.getItem(LAST) }
 } catch {
  return { opened: new Set(), last: null }
 }
}

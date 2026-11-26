// Uzbek text of the lab interface (buttons, panels, messages). Read through common().lab, or
// directly by the lab component (src/lab/text.js) while no simulation has loaded yet.
// To add a language, copy this file to <locale>.js and list it in src/lab/text.js and src/text/<locale>.js.
export default {
  region: 'Simulyatsiya',
  loading: 'Yuklanmoqda…',
  loadFailedTitle: 'Yuklab bölmadi',
  loadFailed: (title) => (title ? `“${title}” simulyatsiyasi yuklanmadi. Internet aloqasini tekşiring.` : 'Simulyatsiya yuklanmadi. Internet aloqasini tekşiring.'),
  retry: 'Qayta uriniş',

  // The time controls.
  controls: 'Vaqtni boşqariş',
  play: 'Boşlaş',
  pause: 'Pauza',
  resume: 'Davom etiş',
  replay: 'Qaytadan',
  playTitle: 'Boşlaş / pauza (Probel)',
  step: 'Qadam',
  stepTitle: (unit) => `Qadam: 1/30 ${unit} oldinga (→)`,
  reset: 'Boşiga',
  resetTitle: 'Boşiga: t = 0 holatiga qaytariş (R)',
  timeline: 'Vaqt şkalasi',
  timelineTitle: 'Vaqt şkalasi: orqaga qaytib köriş',
  toEnd: 'Oxiriga',
  speed: 'Vaqt ötiş surʼati',
  showGraphs: 'Grafiklarni körsatiş',
  hideGraphs: 'Grafiklarni yaşiriş',
  copyLink: 'Havolani nusxalaş: u şu qiymatlar bilan oçiladi',
  full: 'Butun ekran',
  fullTitle: 'Butun ekran: laboratoriya oynani töldiradi (F)',
  fullExit: 'Butun ekrandan çiqiş (Esc)',
  linkCopied: 'Havola nusxalandi',
  linkNotCopied: 'Havolani nusxalab bölmadi: uni manzil satridan oling',
  states: { ready: 'Tayyor', running: 'Bormoqda', paused: 'Pauza', finished: 'Tugadi', errored: 'Töxtatildi' },

  // The status line under the stage.
  errored: 'Hisoblaşda imkonsiz qiymat çiqdi, şuning uçun simulyatsiya töxtatildi.',
  hint: 'Qiymatlarni Sozlamalar panelida özgartiring va «Boşlaş» tugmasini bosing.',

  // The settings panel.
  settings: 'Sozlamalar',
  close: 'Yopiş',
  presets: 'Tayyor holatlar',
  presetPick: 'Holatni tanlang…',
  presetLoaded: (name) => `“${name}” yuklandi`,
  params: 'Parametrlar',
  show: 'Körsatiş',
  tape: 'Ruletka (masofani ölçaş)',
  clearPrev: 'Oldingi izlarni öçiriş',
  tagRestart: 'qaytadan',
  tagLive: 'darhol',
  tagRestartTitle: 'Özgartirilsa, harakat boşidan boşlanadi',
  tagLiveTitle: 'Özgariş darhol, harakat davomida ham kuçga kiradi',
  keys: [['Probel', 'boşlaş'], ['→', 'qadam'], ['R', 'boşiga'], ['F', 'butun ekran']],
  // The menu of the free-fall acceleration g: the planet, then its g.
  planets: { earth: 'Yer', moon: 'Oy', mars: 'Mars', mercury: 'Merkuriy', venus: 'Venera', jupiter: 'Yupiter' },
};

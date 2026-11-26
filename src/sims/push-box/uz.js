// Uzbek text of the push-box simulation. Joined with index.js by sims/load.js.
export default {
  params: {
    F: 'Itariş kuçi',
    m: 'Massa',
    mus: 'Tinçlikdagi işqalaniş',
    muk: 'Sirpaniş işqalanişi (≤ μₜ)',
    v0: 'Boşlanğiç tezlik',
  },
  toggles: {
    forces: 'Itariş va işqalaniş kuçlari',
    net: 'Teng taʼsir etuvçi kuç (ΣF)',
  },
  readouts: {
    f: 'Işqalaniş kuçi',
    a: 'Tezlaniş',
    v: 'Tezlik',
  },
  graphs: {
    forces: { title: 'Qutiga taʼsir etuvçi kuçlar', yLabel: 'F', series: { F: 'itariş kuçi', f: 'işqalaniş kuçi', net: 'ΣF' } },
    v: { title: 'Tezlik', yLabel: 'υ', series: { v: 'υ' } },
  },
  presets: [
    'Yetarliça kuçli itariş',
    'Qözğatişga kuç yetmaydi',
    'Tinçlikdagi işqalanişdan biroz ortiq',
    'Turtib, qöyib yuboriş',
    'Oğirroq quti, xuddi şu kuç',
    'Muz ustida',
  ],
  dragHint: 'Itariş kuçini oşiriş uçun yaşil dumaloq tutqiçni öngga, kamaytiriş uçun çapga suring.',
  msg: {
    /** The box reached the end of the floor, `floor` metres long. */
    finish: (t, floor, speed) => `Quti t = ${t} s da marraga (${floor} m) yetdi, tezligi ${speed} m/s.`,
    rest: (x) => `Quti ${x} m sirpanib, işqalaniş tufayli töxtadi.`,
    /** The push `F` never beat the most static friction can hold, `hold` = μₜmg. */
    stuck: (F, hold) => `Quti joyidan qözğalmadi: itariş kuçi F = ${F} N tinçlikdagi işqalaniş kuçining eng katta qiymatidan (μₜmg = ${hold} N) katta emas.`,
    timeUp: (tMax, x) => `Simulyatsiya ${tMax} s dan keyin töxtatildi, quti ${x} m siljidi.`,
  },
  draw: {
    /** Label of the friction arrow; the part after _ is drawn as a subscript. */
    friction: 'F_iş',
    // Above the box: why it holds or slides. `push` is F, `hold` the static limit μₜmg (both in N).
    sliding: (muk) => `sirpaniş işqalanişi, μₛ = ${muk}`,
    starts: (push, hold) => `F = ${push} N > μₜmg = ${hold} N: quti qözğaladi`,
    holds: (push, hold) => `F = ${push} N ≤ μₜmg = ${hold} N: quti joyida turadi`,
    cue: 'itariş uçun suring',
  },
};

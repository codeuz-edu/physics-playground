// Uzbek text of the "collision" simulation. The definition is in index.js; sims/load.js joins the two.
export default {
  params: {
    m1: 'Birinçi aravaça massasi',
    v1: 'Birinçi aravaça tezligi',
    m2: 'Ikkinçi aravaça massasi',
    v2: 'Ikkinçi aravaça tezligi',
    e: 'Tiklaniş koeffitsiyenti',
  },
  toggles: {
    vel: 'Tezlik vektorlari',
    p: 'Impuls vektorlari (p = mυ)',
    marks: 'Töqnaşuv joyi',
  },
  readouts: {
    v1: 'υ₁',
    v2: 'υ₂',
    p: 'Töliq impuls',
    ke: 'Kinetik energiya',
  },
  graphs: {
    v: { title: 'Tezliklar', series: { v1: 'υ₁', v2: 'υ₂' } },
    pke: { title: 'Impuls va kinetik energiya', series: { p: 'impuls p, kg·m/s', ke: 'kinetik energiya, J' } },
  },
  presets: [
    'Teng massalar, elastik: tezliklar almaşadi',
    'Absolyut noelastik: birikib ketadi',
    'Yengil aravaça oğiriga uriladi',
    'Oğir aravaça yengilini quvib yetadi',
    'Qarama-qarşi, teng impulslar, noelastik',
    'Qisman elastik: e = 0,5',
  ],
  // The finish message is built from two parts: what happened in the impact (`after` or `noHit`)
  // and what became of the kinetic energy (`energyLost`, `energyKept` or `noHitEnd`).
  msg: {
    after: (tHit, v1, v2) => `Töqnaşuvdan (t = ${tHit} s) keyin υ₁ = ${v1} m/s, υ₂ = ${v2} m/s`,
    noHit: 'Aravaçalar töqnaşmadi',
    energyLost: (lost) => `; kinetik energiyaning ${lost} J qismi yöqoldi.`,
    energyKept: '; kinetik energiya saqlandi.',
    noHitEnd: '.',
    restAfterHit: (after, energy) => `${after} — ikkala aravaça tinç holatga keldi${energy}`,
    rest: 'Ikkala aravaça tinç turibdi: tezliklarni özgartiring.',
    left: (after, energy) => `${after}${energy} Aravaça relsning çetiga yetdi.`,
    time: (after, energy, tMax) => `${after}${energy} ${tMax} s ötdi.`,
  },
  draw: {
    impact: (t) => `töqnaşuv: t = ${t} s`,
    stuck: 'birikib ketdi',
  },
};

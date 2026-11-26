// Uzbek text of the "third-law" simulation. The definition is in index.js; sims/load.js joins the two.
export default {
  params: {
    m1: 'Çap aravaça massasi',
    m2: 'Öng aravaça massasi',
    F: 'Itariş kuçi',
    tau: 'Itariş davomiyligi',
  },
  toggles: {
    forces: 'Özaro taʼsir kuçlari',
    vel: 'Tezlik vektorlari',
  },
  readouts: {
    F21: 'F₂₁ (çap aravaçaga)',
    F12: 'F₁₂ (öng aravaçaga)',
    v1: 'υ₁',
    v2: 'υ₂',
    mv1: 'p₁ = m₁υ₁',
    mv2: 'p₂ = m₂υ₂',
  },
  graphs: {
    F: { title: 'Özaro taʼsir kuçlari', series: { F21: 'F₂₁', F12: 'F₁₂' } },
    v: { title: 'Tezliklar', series: { v1: 'υ₁', v2: 'υ₂' } },
    p: { title: 'Impulslar', series: { mv1: 'p₁', mv2: 'p₂', p: 'p₁ + p₂' } },
  },
  presets: [
    'Massalar teng',
    'Öngdagi aravaça 3 marta oğir',
    'Konkida uçuvçilar: bola va katta odam (1 : 2)',
  ],
  msg: {
    // The sentence about the two momenta, passed to `early` and `after` as `momenta`.
    momenta: (p) => `Impulslar moduli teng: |m₁υ₁| = |m₂υ₂| = ${p} kg·m/s, yiğindisi nolga teng.`,
    // A cart reached the end of the track before the push was over; u1, u2 are the speeds a full push would give.
    early: (t, tau, v1, v2, momenta, u1, u2) =>
      `Itariş tugamasdan (t = ${t} s, τ = ${tau} s) aravaça relsning çetiga yetdi. Şu paytda υ₁ = ${v1} m/s, υ₂ = ${v2} m/s. ${momenta} Itariş oxirigaça davom etganda υ₁ = ${u1} m/s, υ₂ = ${u2} m/s bölardi: kuçni yoki itariş davomiyligini kamaytiring.`,
    after: (v1, v2, ratio, momenta) => `Itarişdan keyin υ₁ = ${v1} m/s, υ₂ = ${v2} m/s. Tezliklar modullarining nisbati ${ratio}: u massalar nisbatining teskarisiga teng. ${momenta}`,
  },
  draw: {
    start: 'Boşlaş: prujina aravaçalarni bir-biridan itaradi',
  },
};

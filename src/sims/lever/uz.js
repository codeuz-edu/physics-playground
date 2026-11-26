// Uzbek text of the lever simulation (see index.js).
export default {
  params: {
    m1: 'Çapdagi yuk massasi',
    d1: 'Çap yelka',
    m2: 'Öngdagi yuk massasi',
    d2: 'Öng yelka',
  },
  toggles: {
    forces: 'Kuçlar',
    arms: 'Kuç yelkalari',
    ticks: 'Riçagdagi şkala',
  },
  readouts: {
    M1: 'M₁ = m₁gd₁',
    M2: 'M₂ = m₂gd₂',
    th: 'Ağiş burçagi',
  },
  graphs: {
    th: { title: 'Riçagning ağiş burçagi', series: { th: 'θ' } },
  },
  presets: [
    'Muvozanat: 2 kg × 0,3 m = 1 kg × 0,6 m',
    'Muvozanat buzilgan',
    'Toşni lom bilan kötariş: 5 marta yutiş',
  ],
  dragHint: 'Yuklarni riçag böylab çapga yoki öngga suring: kuç yelkasi, demak kuç momenti ham özgaradi.',
  msg: {
    // M: both moments, already written out ("M₁ = … N·m, M₂ = … N·m").
    balance: (M) => `Riçag muvozanatda: ${M}. Kuç momentlari teng.`,
    // right: true when the right side went down.
    tip: (right, M) => `Riçag ${right ? 'öng' : 'çap'} tomonga ağdi: ${M}. Katta moment tomoni pastga tuşadi.`,
  },
  draw: {
    // M: the equal moment, formatted.
    balance: (M) => `M₁ = M₂ = ${M} N·m: muvozanat`,
    hint: 'yuklarni riçag böylab suring',
  },
};

// Uzbek text of the rope tension (load on two ropes) simulation (see index.js).
export default {
  params: {
    m: 'Yukning massasi',
    al: 'Çap arqonning burçagi',
    be: 'Öng arqonning burçagi',
  },
  toggles: {
    forces: 'Kuçlar',
    comp: 'Kuçlarning proyeksiyalari',
    tri: 'Kuçlar uçburçagi',
  },
  readouts: {
    T1: 'T₁ (çap arqon)',
    T2: 'T₂ (öng arqon)',
    W: 'Oğirlik kuçi mg',
    a: 'Çap arqonning burçagi α',
    b: 'Öng arqonning burçagi β',
  },
  graphs: {
    T: { title: 'Taranglik kuçlari', series: { T1: 'T₁', T2: 'T₂', W: 'mg' } },
    ang: { title: 'Arqonlarning burçaklari', series: { a: 'α', b: 'β' } },
  },
  presets: [
    'Çiroq: ikki arqon 30° da',
    'Deyarli taranglangan arqon: 10°',
    'Har xil burçaklar: 30° va 60°',
    'Deyarli tik arqonlar: 80°',
  ],
  msg: {
    // T1, T2: rope tensions, W: weight mg; already formatted.
    done: (T1, T2, W) => `Muvozanat: T₁ = ${T1} N, T₂ = ${T2} N, yukning oğirligi mg = ${W} N.`,
  },
  draw: {
    // k: how many times the force arrows are shrunk, formatted.
    scaled: (k) => `kuçlar ${k} marta kiçraytirib çizilgan`,
    triangle: 'kuçlar uçburçagi yopiq',
  },
};

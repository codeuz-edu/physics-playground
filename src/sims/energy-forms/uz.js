// Uzbek text of the "energy-forms" simulation. The definition is in index.js; sims/load.js joins the two.
// The label of g comes from the shared dictionary (src/text/uz.js).
export default {
  params: {
    k: 'Prujinaning bikrligi',
    x: 'Prujinaning siqilişi',
    m: 'Şarning massasi',
  },
  toggles: {
    bars: 'Energiya ustunlari',
    vel: 'Tezlik vektori',
  },
  readouts: {
    Ee: 'Prujina energiyasi',
    Ek: 'Kinetik energiya',
    Ep: 'Potensial energiya',
    h: 'Balandlik',
  },
  graphs: {
    E: { title: 'Energiya', series: { Ee: 'prujina', Ek: 'kinetik', Ep: 'potensial', E: 'töla' } },
    h: { title: 'Balandlik', series: { h: 'h' } },
  },
  presets: [
    'k = 500 N/m, x = 10 sm, m = 100 g',
    'Siqiliş ikki marta katta',
    'Oğir şar, bikir prujina',
    'Kuçsiz prujina: şar uçmaydi',
  ],
  msg: {
    // The spring could not throw the ball (xMin = 2mg/k); one of the three weak* sentences follows it.
    weak: (xMin, x) => `Prujina şarni uloqtira olmadi: şar prujinadan faqat x > 2mg/k = ${xMin} m bölganda ajraladi, bu yerda esa x = ${x} m.`,
    weakRose: (why, top) => `${why} Şar prujina bilan birga ${top} m ga kötarilib, boşlanğiç joyiga qaytdi.`,
    weakBalanced: (why) => `${why} Siqiliş aynan şarning öz oğirligidan siqilişi mg/k ga teng: şar muvozanat holatida turib qoldi.`,
    weakSank: (why, x0) => `${why} Siqiliş şarning öz oğirligidan siqilişi mg/k = ${x0} m dan kiçik, şuning uçun şar avval pastga tuşib, söng boşlanğiç joyiga qaytdi.`,
    back: (top, v, E) => `Şar boşlanğiç joyidan ${top} m balandlikka kötarildi va qaytib prujinaga tuşdi. Prujinadan ${v} m/s tezlik bilan ajraldi. Töla energiya ${E} J butun harakat davomida özgarmadi.`,
  },
  draw: {
    // Names under the four energy bars.
    bars: { Ee: 'prujina', Ek: 'kinetik', Ep: 'potens.', E: 'töla' },
  },
};

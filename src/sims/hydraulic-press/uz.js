// Uzbek text of the "hydraulic-press" simulation. The definition is in index.js; sims/load.js joins the two.
export default {
  params: {
    M: 'Yuk massasi',
    S1: 'Kiçik porşen yuzasi',
    S2: 'Katta porşen yuzasi',
    H: 'Kötariş balandligi',
  },
  toggles: {
    forces: 'Kuçlar',
    dims: 'Kötariliş balandligi',
  },
  readouts: {
    F1: 'Kiçik porşenga kuç F₁',
    p: 'Moy bosimi',
    h2: 'Yuk kötarildi',
    n: 'Bosişlar soni',
  },
  graphs: {
    h: { title: 'Yukning kötarilişi', unit: 'sm', series: { h2: 'h' } },
    F: { title: 'Kiçik porşenga kuç', series: { F1: 'F₁' } },
  },
  presets: [
    'Avtomobil kötargiçi',
    'Domkrat: kuçdan 200 marta yutiş',
    'Kiçik press: 20 marta',
    'Teng porşenlar: kuçdan yutiş yöq',
  ],
  units: { S1: 'sm²', S2: 'sm²', H: 'sm', h2: 'sm' },
  // The finish message is `top`, with `gain` or `noGain` (equal pistons) in its middle.
  msg: {
    // h: the lift in cm, n: how many strokes, A: the work in J.
    top: (h, n, gain, A) => `Yuk ${h} sm ga kötarildi, buning uçun kiçik porşen ${n} marta bosildi. ${gain} Bajarilgan iş A = Mgh = ${A} J.`,
    // F1: force on the small piston, W: the load's weight, both in N; k: S₂/S₁.
    gain: (F1, W, k) => `F₁ = ${F1} N kuç yukning ${W} N oğirligidan ${k} marta kiçik.`,
    noGain: (F1, W) => `F₁ = ${F1} N kuç yukning ${W} N oğirligiga teng: porşenlar teng bölganda kuçdan yutiş yöq.`,
  },
  draw: {
    // Beside the big piston: how far the load has risen, in cm.
    lift: (h) => `${h} sm`,
  },
};

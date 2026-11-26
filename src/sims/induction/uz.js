export default {
  params: {
    N: 'Ğaltakdagi öramlar soni',
    F: 'Magnit markazdagi oqim',
    v: 'Magnit tezligi',
  },
  readouts: { phi: 'Bitta öramdagi oqim', E: 'Induksiya EYK' },
  graphs: {
    phi: { title: 'Magnit oqimi', yLabel: 'Φ', series: { phi: 'Φ' } },
    E: { title: 'Induksiya EYK', yLabel: 'ℰ', series: { E: 'ℰ' } },
  },
  presets: [
    'N = 200, Φ = 1 mWb, υ = 0,5 m/s',
    'Magnit ikki marta tez',
    'N = 500, kuçsizroq magnit',
  ],
  msg: {
    end: (avg, max) => `Magnit ğaltakdan ötib ketdi. Kirişda örtaça EYK −${avg} V (oqim ortadi), çiqişda +${avg} V (oqim kamayadi); eng katta |ℰ| = ${max} V.`,
  },
  draw: {
    galvanometer: 'galvanometr',
    // Shown while the magnet comes in (the coil pushes it back) and while it leaves (the coil holds it back).
    lenzEntry: 'Lens qoidasi: ğaltak yaqinlaşayotgan magnitni itaradi',
    lenzExit: 'Lens qoidasi: ğaltak uzoqlaşayotgan magnitni tortadi',
  },
};

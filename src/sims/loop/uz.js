// Uzbek text of the loop-the-loop simulation (see index.js).
export default {
  params: {
    h: 'Boşlanğiç balandlik',
    R: 'Halqa radiusi',
    m: 'Aravaça massasi',
  },
  toggles: {
    forces: 'Kuçlar',
    path: 'Aravaça izi',
  },
  readouts: {
    v: 'Tezlik',
    N: 'Tayanç kuçi N',
    y: 'Balandlik',
  },
  graphs: {
    N: { title: 'Tayanç kuçi', series: { N: 'N' } },
    v: { title: 'Tezlik', series: { v: 'υ' } },
  },
  presets: [
    'h = 3R: töla aylanadi',
    'h = 2,5R: çegara',
    'h = 2R: relsdan ajraladi',
    'h < R: qaytib ketadi',
  ],
  msg: {
    // N: support force at the top, hMin: the least start height 2.5R; already formatted.
    ok: (N, hMin) => `Aravaça halqadan töla aylanib ötdi. Halqa tepasida tayanç kuçi N = ${N} N. Buning uçun h ≥ 2,5R = ${hMin} m bölişi kerak edi.`,
    // y, phi: height and angle where the cart left the rail.
    fell: (y, phi, hMin) => `Aravaça ${y} m balandlikda (φ = ${phi}°) relsdan ajraldi va pastga tuşdi: tezligi yetmadi. Halqadan ötiş uçun h ≥ 2,5R = ${hMin} m kerak.`,
    back: (h) => `Aravaça halqaning ${h} m balandligigaça kötarilib, orqaga qaytdi.`,
  },
};

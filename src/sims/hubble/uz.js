// Uzbek text of the Hubble's law simulation (definition in ./index.js).
export default {
  params: {
    H: 'Habbl doimiysi',
    r: 'Tanlangan galaktikagaça masofa',
  },
  readouts: {
    v: 'Uzoqlaşiş tezligi',
    z: 'Qizil siljiş',
    age: '1/H₀',
  },
  graphs: {
    k: { title: 'Masştab omili', series: { k: 'a' } },
  },
  presets: [
    'H₀ = 70, r = 100 Mpk',
    'Uzoqroq galaktika: 500 Mpk',
    'H₀ = 100, r = 50 Mpk',
  ],
  units: { H: 'km/(s·Mpk)', r: 'Mpk', age: 'mlrd yil' },
  msg: {
    end: (v, z, age) => `Galaktika uzoqlaşiş tezligi υ = H₀r = ${v} km/s, qizil siljiş z ≈ υ/c = ${z}. Koinot yoşining bahosi 1/H₀ ≈ ${age} mlrd yil.`,
  },
  draw: {
    milkyWay: 'Somon yöli',
    distance: (r) => `${r} Mpk`,
    sketch: 'sxematik rasm: hamma masofalar bir xil marta ortadi',
  },
};

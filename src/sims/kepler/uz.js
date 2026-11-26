// Uzbek text of the Kepler's laws simulation (definition in ./index.js).
export default {
  params: {
    a: 'Katta yarim öq',
    e: 'Ekssentrisitet',
    n: 'Teng vaqt bölaklari',
  },
  toggles: {
    areas: 'Teng vaqtdagi yuzlar',
    vel: 'Tezlik vektori',
    orbit: 'Orbita',
  },
  readouts: {
    r: 'Quyoşgaça masofa',
    v: 'Tezlik',
  },
  graphs: {
    r: { title: 'Quyoşgaça masofa', unit: 'a.b.', series: { r: 'r' } },
    v: { title: 'Tezlik', series: { v: 'υ' } },
  },
  presets: [
    'Yer: a = 1 a.b., e = 0,017',
    'Mars: a = 1,52 a.b., e = 0,093',
    'Yupiter: a = 5,2 a.b.',
    'Çözilgan orbita: e = 0,7',
  ],
  units: { a: 'a.b.', r: 'a.b.' },
  timeUnit: 'yil',
  lengthUnit: 'a.b.',
  msg: {
    orbit: (T, ratio) => `Sayyora Quyoş atrofida bir marta aylandi: T = ${T} yil. T² / a³ = ${ratio}.`,
  },
  draw: {
    sun: 'Quyoş',
    // T = a^(3/2) years (a in a.b.), written without a superscript.
    period: (T) => `T = a√a = ${T} yil`,
  },
};

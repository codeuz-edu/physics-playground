export default {
  params: {
    B: 'Magnit induksiya',
    l: 'Sterjen uzunligi',
    v: 'Sterjen tezligi',
    R: 'Zanjir qarşiligi',
  },
  toggles: { forces: 'Kuçlar' },
  readouts: {
    E: 'EYK',
    I: 'Tok kuçi',
    F: 'Amper kuçi',
    Q: 'Issiqlik',
    A: 'Tortiş işi F·s',
  },
  graphs: {
    Q: { title: 'Tortiş işi va ajralgan issiqlik', yLabel: 'Q', series: { A: 'A = F·s', Q: 'Q' } },
  },
  presets: [
    'B = 0,5 T, l = 0,4 m, υ = 2 m/s, R = 2 Ω',
    'Tezlik ikki marta katta',
    'B = 1 T, l = 0,5 m, υ = 1 m/s, R = 1 Ω',
  ],
  msg: {
    end: (dist, E, I, F, Q) => `Sterjen ${dist} m yöl bosdi: ℰ = Bυl = ${E} V, I = ${I} A, tormozlovçi Amper kuçi F = ${F} N, ajralgan issiqlik Q = ${Q} J.`,
  },
};

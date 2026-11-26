export default {
  params: {
    N: 'Ramkadagi öramlar soni',
    B: 'Magnit induksiya',
    S: 'Ramka yuzasi',
    nu: 'Aylaniş çastotasi',
    R: 'Yuklama qarşiligi',
  },
  readouts: {
    phi: 'Bitta öramdagi oqim',
    e: 'Oniy EYK',
    i: 'Oniy tok',
    p: 'Oniy quvvat',
  },
  graphs: {
    phi: { title: 'Magnit oqimi (bitta öram)', yLabel: 'Φ', series: { phi: 'Φ' } },
    e: { title: 'EYK', yLabel: 'ℰ', series: { e: 'ℰ' } },
    p: { title: 'Quvvat', yLabel: 'P', series: { p: 'P' } },
  },
  presets: [
    'N = 100, B = 0,2 T, S = 100 sm², 2 Hz',
    'Çastota ikki marta katta',
    'N = 200, B = 0,5 T, S = 200 sm², 1 Hz',
  ],
  units: { S: 'sm²' },
  msg: {
    end: (periods, Em, E, P) => `${periods} davr ötdi: ℰ_m = ${Em} V, effektiv qiymat ℰ = ℰ_m/√2 = ${E} V, örtaça quvvat P = ${P} W.`,
  },
  draw: {
    lamp: (R) => `lampa, R = ${R} Ω`,
    frame: 'ramka',
    rings: 'kontakt halqalar',
  },
};

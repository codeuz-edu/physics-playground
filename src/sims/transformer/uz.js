export default {
  params: {
    U1: 'Birlamçi kuçlaniş',
    N1: 'Birlamçi çulğamdagi öramlar',
    N2: 'Ikkilamçi çulğamdagi öramlar',
    R: 'Yuklama qarşiligi',
  },
  readouts: { U2: 'Ikkilamçi kuçlaniş', I1: 'Birlamçi tok', I2: 'Ikkilamçi tok' },
  graphs: {
    u: { title: 'Oniy kuçlanişlar', yLabel: 'u', series: { u1: 'u₁', u2: 'u₂' } },
    phi: { title: 'Özakdagi magnit oqimi', yLabel: 'Φ', series: { phi: 'Φ' } },
  },
  presets: [
    'Pasaytiruvçi: 220 V → 11 V',
    'Oşiruvçi: 220 V → 2200 V',
    'Telefon zaryadlagiçi: 220 V → 12 V',
  ],
  msg: {
    end: (U2, I2, I1, k, P) => `U₂ = ${U2} V, I₂ = ${I2} A, I₁ = ${I1} A, k = N₁/N₂ = ${k}; quvvat P₁ = P₂ = ${P} W.`,
  },
};

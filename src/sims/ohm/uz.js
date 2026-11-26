export default {
  params: {
    conn: { label: 'Ulaş usuli', options: ['Ketma-ket', 'Parallel'] },
    U: 'Manba kuçlanişi',
    R1: 'Birinçi rezistor',
    R2: 'Ikkinçi rezistor',
  },
  readouts: { R: 'Umumiy qarşilik', I: 'Tok kuçi', I1: 'I₁', I2: 'I₂', U1: 'U₁', U2: 'U₂' },
  graphs: {
    q: { title: 'Ötgan zaryad', yLabel: 'q', series: { q: 'q = It' } },
    A: { title: 'Tokning işi', yLabel: 'A', series: { A: 'A = UIt' } },
  },
  presets: [
    'Ketma-ket: 4 Ω va 8 Ω, 12 V',
    'Parallel: 4 Ω va 12 Ω, 12 V',
    'Parallel: ikkita 10 Ω, 6 V',
  ],
  msg: {
    series: (R, I, U1, U2) => `Ketma-ket: R = ${R} Ω, I = ${I} A, U₁ = ${U1} V, U₂ = ${U2} V.`,
    parallel: (R, I, I1, I2) => `Parallel: R = ${R} Ω, I = ${I} A, I₁ = ${I1} A, I₂ = ${I2} A.`,
  },
};

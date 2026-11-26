export default {
  params: {
    L: 'Ğaltak induktivligi',
    C: 'Kondensator siğimi',
    U: 'Boşlanğiç kuçlaniş',
  },
  readouts: {
    q: 'Zaryad',
    i: 'Tok kuçi',
    WC: 'Elektr maydon energiyasi',
    WL: 'Magnit maydon energiyasi',
  },
  graphs: {
    qi: { title: 'Zaryad va tok', yLabel: '', series: { q: 'q', i: 'i' } },
    W: { title: 'Energiyalar', yLabel: 'W', series: { WC: 'W_C', WL: 'W_L' } },
  },
  presets: [
    'L = 0,1 H, C = 10 μF, U₀ = 10 V',
    'Siğim 4 marta katta',
    'L = 0,4 H, C = 10 μF, U₀ = 20 V',
  ],
  msg: {
    end: (periods, T, nu, Im, W) => `${periods} davr ötdi: T = 2π√(LC) = ${T} ms, ν = ${nu} Hz, eng katta tok I_m = ${Im} mA, töla energiya W = ${W} mJ.`,
  },
};

export default {
  params: {
    n: 'Garmonika raqami',
    L: 'Tor uzunligi',
    F: 'Torning taranglik kuçi',
    mu: 'Torning çiziqli ziçligi',
  },
  readouts: {
    nu: 'Çastota',
    lam: 'Tölqin uzunligi',
    v: 'Tölqin tezligi',
  },
  graphs: {
    y: { title: 'Dönglikdagi siljiş (amplitudadan %)', series: { y: 'y' } },
  },
  presets: ['Asosiy ton: n = 1, l = 1 m', 'Uçinçi garmonika', 'Gitara tori: l = 0,65 m, F = 81,8 N'],
  msg: {
    end: (n, lam, nu, nodes, antinodes, v) => `${n}-garmonika: λ = 2l/n = ${lam} m, ν = nυ/(2l) = ${nu} Hz, tugunlar soni ${nodes}, döngliklar soni ${antinodes}. Tordagi tölqin tezligi υ = √(F/μ) = ${v} m/s.`,
  },
  draw: {
    // After a dot drawn like the nodes on the string.
    nodes: '— tugunlar',
  },
};

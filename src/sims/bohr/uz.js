export default {
  params: {
    n: 'Elektron qaysi orbitadan ötadi',
    k: { label: 'Qaysi orbitaga ötadi', options: ['1 (Layman seriyasi)', '2 (Balmer seriyasi)', '3 (Paşen seriyasi)'] },
  },
  readouts: {
    E: 'Elektron energiyasi',
    dE: 'Foton energiyasi',
    lam: 'Tölqin uzunligi',
    En: 'Boşlanğiç sath energiyasi',
  },
  graphs: {
    E: { title: 'Elektron energiyasi', series: { E: 'E' } },
  },
  presets: ['Balmer: 3 → 2 (qizil Hα)', 'Layman: 2 → 1 (ultrabinafşa)', 'Balmer: 4 → 2 (kök Hβ)'],
  msg: {
    // n, k: upper and lower orbit; dE: photon energy; lam: wavelength in nm; region: name of the spectral region
    jump: (n, k, dE, lam, region) => `Elektron ${n}-orbitadan ${k}-orbitaga ötdi: foton energiyasi ${dE} eV, tölqin uzunligi λ = ${lam} nm (${region}).`,
    // Added after jump() when the chosen upper orbit was not above the lower one and n had to be raised.
    raised: (n) => ` (Yuqori orbita pastkisidan baland bölişi kerak, şuning uçun n = ${n} olindi.)`,
  },
};

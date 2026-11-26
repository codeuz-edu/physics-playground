export default {
  params: {
    type: { label: 'Közgu', options: ['Botiq (yiğuvçi)', 'Qavariq (soçuvçi)'] },
    R: 'Egrilik radiusi',
    d: 'Buyumgaça masofa',
    h: 'Buyum balandligi',
  },
  readouts: {
    d: 'Buyumgaça masofa',
    f: 'Tasvirgaça masofa',
    G: 'Kattalaştiriş',
    H: 'Tasvir balandligi',
  },
  graphs: {
    distances: { title: 'Buyum va tasvir masofasi', unit: 'sm', series: { d: 'd', f: 'f' } },
  },
  presets: ['Botiq: F < d < 2F', 'Botiq: buyum fokus içida', 'Qavariq közgu (avtomobil közgusi)'],
  units: { R: 'sm', d: 'sm', h: 'sm', f: 'sm', H: 'sm' },
  lengthUnit: 'sm',
  msg: {
    atFocus: 'Buyum fokusda: qaytgan nurlar parallel, tasvir hosil bölmaydi.',
    // f: image distance, G: magnification, H: image height
    real: (f, G, H) => `Tasvir haqiqiy, teskari, közgu oldida: f = ${f} sm, Γ = ${G}, H = ${H} sm.`,
    virtual: (f, G, H) => `Tasvir mavhum, töğri, közgu ortida: |f| = ${f} sm, Γ = ${G}, H = ${H} sm.`,
  },
  draw: {
    realImage: 'haqiqiy tasvir',
    virtualImage: 'mavhum tasvir',
    offPicture: (f) => `tasvir rasmdan taşqarida: |f| = ${f} sm`,
    // sign: '' (concave) or '−' (convex); F, d: numbers; f: a length from cm() or '∞'
    formula: (sign, F, d, f) => `1/F = 1/d + 1/f,  F = ${sign}R/2 = ${F} sm:  d = ${d} sm,  f = ${f}`,
    cm: (x) => `${x} sm`,
  },
};

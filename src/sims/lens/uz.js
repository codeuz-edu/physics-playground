export default {
  params: {
    type: { label: 'Linza', options: ['Yiğuvçi (qavariq)', 'Soçuvçi (botiq)'] },
    F: 'Fokus masofasi',
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
  presets: ['Yiğuvçi: d = 3F', 'Lupa: buyum fokus içida', 'Soçuvçi linza'],
  units: { F: 'sm', d: 'sm', h: 'sm', f: 'sm', H: 'sm' },
  lengthUnit: 'sm',
  msg: {
    atFocus: 'Buyum fokusda: linzadan nurlar parallel çiqadi, tasvir hosil bölmaydi.',
    // f: image distance, G: magnification, H: image height
    real: (f, G, H) => `Tasvir haqiqiy, teskari: f = ${f} sm, kattalaştiriş Γ = ${G}, tasvir balandligi H = ${H} sm.`,
    virtual: (f, G, H) => `Tasvir mavhum, töğri: f = ${f} sm (buyum tomonida), kattalaştiriş Γ = ${G}, tasvir balandligi H = ${H} sm.`,
  },
  draw: {
    realImage: 'haqiqiy tasvir',
    virtualImage: 'mavhum tasvir',
    offPicture: (f) => `tasvir rasmdan taşqarida: f = ${f} sm`,
    // d: a number; f: a length from cm() or '∞'
    formula: (d, f) => `1/F = 1/d + 1/f:  d = ${d} sm,  f = ${f}`,
    cm: (x) => `${x} sm`,
  },
};

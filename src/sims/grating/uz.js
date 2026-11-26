export default {
  params: {
    N: 'Panjara: 1 mm dagi çiziqlar',
    lam: 'Yoruğlik tölqin uzunligi',
  },
  readouts: {
    lam: 'Tölqin uzunligi',
    d: 'Panjara davri',
    phi1: 'Birinçi maksimum burçagi',
    kmax: 'Eng katta tartib',
  },
  graphs: {
    angles: { title: 'Maksimumlar burçagi', series: { phi1: 'k = 1', phi2: 'k = 2', phi3: 'k = 3' } },
  },
  presets: ['500 çiziq/mm, 600 nm', '300 çiziq/mm, 500 nm', '1000 çiziq/mm, 700 nm'],
  msg: {
    // d: grating period in μm, phi1: first-order angle, kmax: highest order, total: number of maxima (2·kmax + 1)
    orders: (d, phi1, kmax, total) => `Panjara davri d = ${d} μm. Birinçi tartibli maksimum φ₁ = ${phi1}°, eng katta tartib k_max = ${kmax}, jami ${total} ta maksimum.`,
    centralOnly: (d) => `Panjara davri d = ${d} μm tölqin uzunligidan katta emas: faqat markaziy maksimum bor.`,
  },
  draw: {
    grating: 'panjara',
    screen: 'ekran',
  },
};

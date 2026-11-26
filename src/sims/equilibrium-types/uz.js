// Uzbek text of the types-of-equilibrium simulation (see index.js).
export default {
  params: {
    // The chosen surface's name is also written on the stage.
    mode: { label: 'Sirt', options: ['Çuqurlik: turğun', 'Dönglik: turğunmas', 'Tekislik: befarq'] },
    x0: 'Şarning boşlanğiç siljişi',
    m: 'Şar massasi',
  },
  toggles: {
    forces: 'Kuçlar',
    eq: 'Muvozanat holati',
  },
  readouts: {
    x: 'Siljiş',
    Ep: 'Potensial energiya',
  },
  graphs: {
    x: { title: 'Siljiş', series: { x: 'x' } },
    E: { title: 'Potensial energiya', series: { Ep: 'Eₚ' } },
  },
  presets: [
    'Turğun: çuqurlik',
    'Turğunmas: dönglik',
    'Befarq: tekislik',
  ],
  msg: {
    away: 'Turğunmas muvozanat: şar muvozanat holatidan çiqarilgandan keyin undan uzoqlaşib ketdi. Bu holatda potensial energiya eng katta.',
    stable: 'Turğun muvozanat: şar muvozanat holati atrofida tebranib, unga qaytmoqda. Bu holatda potensial energiya eng kiçik.',
    neutral: 'Befarq muvozanat: şar yangi joyda ham tinç turibdi. Potensial energiya hamma joyda bir xil.',
    unstable: 'Turğunmas muvozanat: şar muvozanat holatidan uzoqlaşmoqda. Bu holatda potensial energiya eng katta.',
  },
  draw: {
    equilibrium: 'muvozanat holati',
  },
};

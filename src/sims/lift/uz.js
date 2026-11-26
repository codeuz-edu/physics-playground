// Uzbek text of the lift (weight in an accelerating lift) simulation (see index.js).
export default {
  params: {
    m: 'Odamning massasi',
    a: 'Liftning tezlanişi',
    mode: { label: 'Harakat', options: ['Yuqoriga', 'Pastga', 'Arqon uzildi'] },
  },
  toggles: {
    forces: 'Odamga taʼsir etuvçi kuçlar',
    acc: 'Tezlaniş vektori',
  },
  readouts: {
    ay: 'Tezlaniş aᵧ',
    v: 'Tezlik υᵧ',
    P: 'Vazn (tarozi)',
  },
  graphs: {
    a: { title: 'Liftning tezlanişi', series: { ay: 'aᵧ' } },
    P: { title: 'Vazn', series: { P: 'P' } },
  },
  presets: [
    'Yuqoriga, a = 2 m/s²',
    'Pastga, a = 1,5 m/s²',
    'Arqon uzildi: vaznsizlik',
  ],
  msg: {
    freeFall: 'Arqon uzilgan lift erkin tuşadi: tarozi nolni körsatadi, odamning vazni P = 0. Bu vaznsizlik holati.',
    // a, b, c: scale readings while speeding up, steady and stopping (b is also mg); already formatted.
    // lifted: true when the person floats off the scale for part of the ride.
    ride: (a, b, c, lifted) => `Tezlanişli qismda tarozi ${a} N, tekis harakatda ${b} N, töxtaş paytida ${c} N körsatdi. Oğirlik kuçi esa butun yöl davomida ${b} N edi.${lifted ? ' Pastga yönalgan tezlaniş g dan katta bölgan qismda odam tarozidan ajraladi va tarozi nolni körsatadi.' : ''}`,
  },
  draw: {
    floor: (n) => `${n}-qavat`,
    // Which way the cabin is moving, written beside the shaft.
    up: '↑ yuqoriga',
    down: '↓ pastga',
  },
};

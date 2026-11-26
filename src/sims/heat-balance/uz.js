export default {
  params: {
    body: { label: 'Issiq jism', options: ['Issiq suv (c = 4200 J/(kg·K))', 'Mis (c = 400 J/(kg·K))', 'Alyuminiy (c = 920 J/(kg·K))', 'Temir (c = 460 J/(kg·K))'] },
    m1: 'Issiq jism massasi',
    T1: 'Issiq jism temperaturasi',
    m2: 'Sovuq suv massasi',
    T2: 'Sovuq suv temperaturasi',
  },
  readouts: {
    a: 'Issiq jism',
    b: 'Sovuq suv',
    Q: 'Berilgan issiqlik',
  },
  graphs: {
    T: { title: 'Temperaturalar', series: { a: 't₁', b: 't₂' } },
    Q: { title: 'Issiqlik', series: { Q: 'Q' } },
  },
  presets: ['Issiq va sovuq suvni aralaştiriş', 'Qaynoq mis jism suvda', 'Qaynoq alyuminiy jism suvda'],
  timeUnit: 'min',
  msg: {
    // Names of the hot body in the message, in the order of the body menu.
    bodies: ['Issiq suv', 'Mis jism', 'Alyuminiy jism', 'Temir jism'],
    equal: (th) => `Temperaturalar boşidan teng (${th} °C): issiqlik uzatilmaydi, Q = 0.`,
    end: (th, body, Q) => `Issiqlik muvozanati: umumiy temperatura θ = ${th} °C. ${body} Q = ${Q} kJ issiqlik berdi, sovuq suv xuddi şunça oldi.`,
  },
  draw: {
    calorimeter: 'kalorimetr',
  },
};

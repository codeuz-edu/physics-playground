// Uzbek text of the river-boat simulation. Joined with index.js by sims/load.js.
export default {
  params: {
    w: 'Daryo kengligi',
    vb: 'Qayiqning suvga nisbatan tezligi',
    heading: 'Yönaliş burçagi (+ oqimga qarşi)',
    u: 'Oqim tezligi',
  },
  toggles: {
    vec: 'Tezlik vektorlari',
    frame: 'Suvga nisbatan kuzatiş',
  },
  readouts: {
    y: 'Daryo eniga',
    x: 'Oqim böylab',
    speed: 'Qirğoqqa nisbatan tezlik',
  },
  graphs: {
    y: { title: 'Daryo eniga', yLabel: 'y', series: { y: 'y' } },
    x: { title: 'Daryo böylab', yLabel: 'x', series: { x: 'qirğoqdan', xw: 'suvdan' } },
  },
  presets: [
    'Oqimga perpendikulyar suziş',
    'Röparadagi nuqtaga yetiş',
    'Oqimsiz suv',
    'Kuçli oqim, sekin qayiq',
    'Kuçli oqimga qarşi suziş',
  ],
  dragHint: 'Qayiqni boşqariş uçun binafşa strelka uçidagi doiraçani suring: strelkaning yönalişi qayiq yönalişini, uzunligi esa qayiqning suvga nisbatan tezligini belgilaydi.',
  msg: {
    timeUp: (tMax) => `Simulyatsiya ${tMax} s dan keyin töxtatildi.`,
    /** `where` is one of opposite, downstream(d) or upstream(d) below. */
    arrived: (t, where) => `Qayiq t = ${t} s da qarşi qirğoqqa ${where} yetib keldi.`,
    opposite: 'aynan start nuqtasining röparasida',
    downstream: (d) => `start nuqtasidan oqim böylab ${d} m pastda`,
    upstream: (d) => `start nuqtasidan oqimga qarşi ${d} m yuqorida`,
  },
  draw: {
    start: 'start',
    opposite: 'röparadagi nuqta',
    float: 'pökak',
    cue: 'boşqariş uçun suring',
  },
};

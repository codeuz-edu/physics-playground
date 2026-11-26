// Uzbek text of the motion-1d simulation. Joined with index.js by sims/load.js.
export default {
  params: {
    x0: 'Boşlanğiç koordinata',
    v0: 'Boşlanğiç tezlik',
    a: 'Tezlaniş',
  },
  toggles: {
    vel: 'Tezlik vektori (υ)',
    acc: 'Tezlaniş vektori (a)',
    dots: 'Har sekunddagi vaziyati',
    grid: 'Koordinata töri',
  },
  readouts: {
    x: 'Koordinata',
    v: 'Tezlik',
    a: 'Tezlaniş',
  },
  graphs: {
    x: { title: 'Koordinata', yLabel: 'x', series: { x: 'x' } },
    v: { title: 'Tezlik', yLabel: 'υ', series: { v: 'υ' } },
    a: { title: 'Tezlaniş', yLabel: 'a', series: { a: 'a' } },
  },
  presets: [
    'Tinç holatdan tezlaniş',
    'Tekis harakat',
    'Tormozlanib, orqaga qaytiş',
    'Yöl örtasida orqaga buriliş',
    'Orqaga harakatlanib sekinlaşiş',
  ],
  dragHint: 'Boşlanğiç koordinatani tanlaş uçun avtomobilni yöl böylab suring.',
  msg: {
    /** The car reached the mark at `x` m (0 or the end of the track). */
    reached: (t, x, speed) => `Avtomobil t = ${t} s da ${x} m belgisiga yetdi, tezligi ${speed} m/s.`,
    timeUp: (tMax) => `Simulyatsiya ${tMax} s dan keyin töxtatildi.`,
  },
  draw: {
    cue: 'joyini tanlaş uçun suring',
  },
};

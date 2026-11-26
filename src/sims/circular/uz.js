// Uzbek text of the circular simulation. Joined with index.js by sims/load.js.
export default {
  params: {
    r: 'Aylana radiusi',
    v: 'Çiziqli tezlik',
  },
  toggles: {
    vel: 'Tezlik vektori (υ)',
    acc: 'Tezlaniş vektori (a)',
    proj: 'Koordinata proyeksiyalari',
    vcomp: 'Tezlik va tezlaniş proyeksiyalari',
  },
  readouts: {
    period: 'Aylaniş davri T',
    omega: 'Burçak tezligi ω',
    ac: 'Markazga intilma tezlaniş',
  },
  graphs: {
    pos: { title: 'Koordinatalar', yLabel: 'x, y', series: { x: 'x', y: 'y' } },
    vel: { title: 'Tezlik proyeksiyalari', yLabel: 'υ', series: { vx: 'υₓ', vy: 'υᵧ' } },
  },
  presets: [
    'Radius 3 m, tezlik 6 m/s',
    'Tezlik öşa, radius ikki marta kiçik',
    'Radius öşa, tezlik ikki marta katta',
    'Katta aylana, kiçik tezlik',
  ],
  dragHint: 'Radiusni özgartiriş uçun harakat boşlanişidan oldin şarçani markaz tomon yoki undan uzoqqa suring.',
  msg: {
    /** `turns` is how many turns the ball made before the time ran out. */
    timeUp: (tMax, turns) => `Simulyatsiya ${tMax} s dan keyin töxtatildi. Aylanişlar soni N = ${turns}.`,
    done: (t, turns, period) => `Şarça ${t} s davomida ${turns} marta töliq aylandi. Bir marta aylaniş vaqti, yaʼni aylaniş davri T = ${period} s.`,
  },
  draw: {
    cue: 'radiusni tanlaş uçun suring',
  },
};

// Uzbek text of the rocket propulsion simulation (definition in ./index.js).
export default {
  params: {
    M: 'Raketaning quruq massasi',
    mf: 'Yoqilği massasi',
    u: 'Gazning otilib çiqiş tezligi',
    q: 'Yoqilği sarfi',
    mode: { label: 'Qayerda', options: ['Kosmosda (tortişsiz)', 'Yerdan tik yuqoriga'] },
  },
  toggles: {
    forces: 'Kuçlar',
    gas: 'Gaz oqimi',
  },
  readouts: {
    v: 'Tezlik',
    m: 'Massa',
    a: 'Tezlaniş',
    F: 'Reaktiv kuç',
    y: 'Bosib ötgan yöl',
  },
  graphs: {
    v: { title: 'Tezlik', series: { v: 'υ' } },
    m: { title: 'Massa', series: { m: 'm' } },
  },
  presets: [
    'Kosmosda: m₀ / M = 4',
    'Xuddi şu raketa Yerdan',
    'Yoqilği köp: m₀ / M = 10',
  ],
  msg: {
    /** The thrust never beat the weight of the empty rocket: it stayed on the pad. */
    pad: (tb, F, Mg) => `Yoqilği ${tb} s da tugadi, lekin raketa startdan kötarilmadi: reaktiv kuç F = μu = ${F} kN quruq raketaning oğirligidan (Mg = ${Mg} kN) ham kiçik.`,
    /** Fuel burnt out in space: y is the distance travelled. */
    space: (tb, v, y) => `Yoqilği ${tb} s da tugadi. Raketaning tezligi ${v} m/s, bosib ötgan yöli ${y} km.`,
    /** Fuel burnt out on a launch from the ground: y is the height. */
    ground: (tb, v, y) => `Yoqilği ${tb} s da tugadi. Raketaning tezligi ${v} m/s, balandligi ${y} km.`,
    /** Added after `ground` when the rocket had to wait on the pad before lifting off. */
    waited: (tl, ml) => ` Avval reaktiv kuç oğirlikdan kiçik edi, şuning uçun raketa ${tl} s startda turdi va massa ${ml} kg gaça kamaygandagina kötarildi.`,
  },
  draw: {
    waits: (tl) => `F < m₀g: raketa t₁ = ${tl} s startda turadi`,
    stuck: 'F < Mg: raketa kötarila olmaydi',
  },
};

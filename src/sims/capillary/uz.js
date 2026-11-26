// Uzbek text of the "capillary" simulation. The definition is in index.js; sims/load.js joins the two.
export default {
  params: {
    liq: {
      label: 'Suyuqlik',
      options: ['Suv (σ = 0,073 N/m, höllaydi)', 'Spirt (σ = 0,022 N/m, höllaydi)', 'Simob (σ = 0,47 N/m, höllamaydi)'],
    },
    r: 'Kapillyar radiusi',
  },
  readouts: {
    h: 'Ustun balandligi',
    F: 'Sirt taranglik kuçi',
    W: 'Ustun oğirligi',
  },
  graphs: {
    h: { title: 'Ustun balandligi', series: { h: 'h' } },
    F: { title: 'Kuçlar muvozanati', series: { F: 'F', W: 'mg' } },
  },
  presets: [
    'Suv, r = 0,5 mm',
    'Spirt, r = 0,5 mm',
    'Simob, r = 0,5 mm',
    'Suv, juda ingiçka nay r = 0,1 mm',
  ],
  // Names of the liquids, by the keys in index.js, as they start the finish message.
  liquids: { water: 'Suv', ethanol: 'Spirt', mercury: 'Simob' },
  // The column stopped: rise for a wetting liquid, fall for mercury. h: its height in mm, F: the surface-tension force in mN.
  msg: {
    rise: (name, h, F) => `${name} kapillyarda kötarilib, h = ${h} mm da töxtadi: sirt taranglik kuçi ustun oğirligini muvozanatlaydi (${F} mN).`,
    fall: (name, h, F) => `${name} kapillyarda pasayib, h = ${h} mm da töxtadi: sirt taranglik kuçi simobni pastga itaradi, uni atrofdagi simobning ρgh gidrostatik bosimi muvozanatlaydi (${F} mN).`,
  },
  draw: {
    // Under the dish: the tube is drawn wider than it is.
    widened: 'nay kengligi kattalaştirib körsatilgan',
  },
};

// Uzbek text of the "archimedes" simulation. The definition is in index.js; sims/load.js joins the two.
// The liquid names in the "liq" menu come from sims/fluids.uz.js.
export default {
  params: {
    mat: {
      label: 'Jism moddasi',
      options: ['Alyuminiy (2 700 kg/m³)', 'Temir (7 800 kg/m³)', 'Mis (8 900 kg/m³)', 'Qörğoşin (11 300 kg/m³)'],
    },
    V: 'Jism hajmi',
    liq: 'Suyuqlik',
    u: 'Tuşiriş tezligi',
  },
  toggles: {
    forces: 'Kuçlar',
  },
  readouts: {
    P: 'Dinamometr körsatişi',
    FA: 'Arximed kuçi',
    Vb: 'Botgan qism hajmi',
    dL: 'Sathning kötarilişi',
  },
  graphs: {
    F: { title: 'Kuçlar', series: { mg: 'mg', P: 'P', FA: 'Fₐ' } },
    V: { title: 'Botgan qism hajmi', unit: 'sm³', series: { Vb: 'V_b' } },
  },
  presets: [
    'Temir silindr suvda',
    'Temir silindr kerosinda',
    'Alyuminiy, 100 sm³',
    'Katta mis jism dengiz suvida',
  ],
  units: { V: 'sm³', u: 'sm/s', Vb: 'sm³', dL: 'sm' },
  msg: {
    // The body is fully under: weight in air (mg), balance reading (P) and buoyancy (FA), in N.
    under: (mg, P, FA) => `Jism suyuqlikka töla botdi. Dinamometr körsatişi ${mg} N dan ${P} N gaça kamaydi: suyuqlik jismni Fₐ = ρgV = ${FA} N kuç bilan yuqoriga itarmoqda.`,
  },
  draw: {
    // How far the liquid level has risen, in cm.
    rise: (dh) => `Δh = ${dh} sm`,
  },
};

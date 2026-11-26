// Uzbek text of the "floating" simulation. The definition is in index.js; sims/load.js joins the two.
// The liquid names in the "liq" menu come from sims/fluids.uz.js.
export default {
  params: {
    rhoB: 'Jism ziçligi',
    liq: 'Suyuqlik',
    a: 'Kub qirrasi',
  },
  toggles: {
    forces: 'Kuçlar',
    eq: 'Kutilgan botiş çizigi',
  },
  readouts: {
    FA: 'Arximed kuçi',
    mg: 'Oğirlik kuçi mg',
    frac: 'Botgan qismi',
    d: 'Pastki sirt çuqurligi',
  },
  graphs: {
    F: { title: 'Kuçlar', series: { FA: 'Fₐ', mg: 'mg' } },
    d: { title: 'Pastki sirt çuqurligi', unit: 'sm', series: { d: 'd' } },
  },
  presets: [
    'Pöpkak suvda',
    'Qarağay suvda',
    'Muz dengiz suvida',
    'Muz kerosinda',
    'Temir suvda',
    'Temir simobda',
    'Ziçliklar teng: muallaq',
  ],
  units: { a: 'sm', d: 'sm' },
  // How the run ended. Densities in kg/m³, forces in N; pct: the submerged share in %, r: ρ/ρₛ.
  msg: {
    float: (pct, r, mg) => `Jism suzib yuribdi: hajmining ${pct} % qismi suyuqlikka botgan, bu jism va suyuqlik ziçliklarining nisbatiga teng (${r}). Arximed kuçi oğirlik kuçini muvozanatlaydi: Fₐ = mg = ${mg} N.`,
    bottom: (rhoBody, rhoLiquid, FA, mg) => `Jism idiş tubiga çökdi: uning ziçligi suyuqliknikidan katta (${rhoBody} > ${rhoLiquid} kg/m³). Töla botgan jismga Fₐ = ${FA} N kuç, oğirlik kuçi esa mg = ${mg} N.`,
    neutral: (mg) => `Jism suyuqlik içida qayerda qöyilsa, şu yerda turibdi: uning ziçligi suyuqlik ziçligiga teng. Fₐ = mg = ${mg} N.`,
    time: (tMax, rhoBody, rhoLiquid) => `${tMax} s ötdi, jism hali sekin harakatlanmoqda: uning ziçligi suyuqliknikiga juda yaqin (${rhoBody} va ${rhoLiquid} kg/m³), şuning uçun Arximed kuçi bilan oğirlik kuçining farqi juda kiçik.`,
  },
  draw: {
    // Beside the dashed line where a floating body settles: its expected depth, in cm.
    depth: (d) => `ρ/ρₛ · a = ${d} sm`,
    // Caption in the liquid: its menu name (from fluids.uz.js), written in lower case.
    liquid: (name) => name.toLowerCase(),
    // Top-left caption: r = ρ/ρₛ and the verdict below.
    ratio: (r, verdict) => `ρ/ρₛ = ${r}: jism ${verdict}`,
    verdict: { float: 'suzadi', sink: 'çökadi', neutral: 'muallaq turadi' },
  },
};

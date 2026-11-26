export default {
  params: {
    tgt: { label: 'Folga moddasi', options: ['Oltin (Z = 79)', 'Kumuş (Z = 47)', 'Alyuminiy (Z = 13)'] },
    E: 'Alfa-zarra energiyasi',
    b: 'Nişon masofasi',
  },
  toggles: {
    beam: 'Dastadagi boşqa zarralar',
  },
  readouts: {
    r: 'Yadrogaça masofa',
    v: 'Tezlik υ/υ₀',
  },
  graphs: {
    r: { title: 'Yadrogaça masofa', series: { r: 'r' } },
  },
  presets: ['Oltin, 5 MeV, b = 20 fm', 'Markaziy uriliş: b = 0', 'Alyuminiy, 5 MeV, b = 20 fm'],
  msg: {
    // th: scattering angle, rmin: closest approach of this particle, d: closest approach head-on (all in fm or degrees)
    end: (th, rmin, d) => `Alfa-zarra θ = ${th}° burçakka soçildi, yadroga eng yaqin kelgan masofa r_min = ${rmin} fm. Markaziy urilişda eng yaqin masofa d = k·2Ze²/E = ${d} fm.`,
  },
  draw: {
    nucleus: (Z) => `yadro, Z = ${Z}`,
    // The tangent is written "tg" in Uzbek textbooks ("tan" in English ones).
    formula: (theta) => `tg(θ/2) = d / (2b),  θ = ${theta}°`,
  },
};

export default {
  params: {
    part: { label: 'Zarra', options: ['Proton (+e)', 'Alfa-zarra (+2e)', 'Elektron (−e)'] },
    v: 'Tezlik, ×10⁶',
    B: 'Magnit induksiya',
  },
  toggles: { forces: 'Tezlik va kuç' },
  readouts: { r: 'Radius', T: 'Davr', F: 'Lorens kuçi' },
  graphs: {
    x: { title: 'Koordinatalar', yLabel: '', unit: 'sm', series: { x: 'x', y: 'y' } },
  },
  presets: [
    'Proton: 10⁶ m/s, 100 mT',
    'Alfa-zarra: 10⁶ m/s, 100 mT',
    'Proton: 2·10⁶ m/s, 50 mT',
    'Elektron: 10⁶ m/s, 1 mT',
  ],
  units: { r: 'sm' },
  lengthUnit: 'sm',
  msg: {
    turn: (r, T, F) => `Bir töla aylaniş: radius r = ${r} sm, davr T = ${T} μs. Lorens kuçi F = ${F} fN tezlikka tik va iş bajarmaydi.`,
  },
  draw: {
    field: 'B ⊗ (çizma tekisligiga tik, bizdan nariga)',
    radius: (r) => `r = mυ / (|q|B) = ${r} sm`,
  },
};

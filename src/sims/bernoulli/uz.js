// Uzbek text of the "bernoulli" simulation. The definition is in index.js; sims/load.js joins the two.
export default {
  params: {
    v1: 'Keng qismdagi tezlik',
    S1: 'Keng qism yuzasi',
    S2: 'Tor qism yuzasi',
    p1: 'Keng qismdagi bosim',
  },
  toggles: {
    flow: 'Oqim zarralari',
    vel: 'Tezlik vektori',
    dims: 'Sathlar farqi',
  },
  readouts: {
    v: 'Zarra tezligi',
    p: 'Zarra joyidagi bosim',
    Q: 'Suv sarfi Q = Sυ',
  },
  graphs: {
    v: { title: 'Zarra tezligi', series: { v: 'υ' } },
    p: { title: 'Zarra joyidagi bosim', series: { p: 'p' } },
  },
  presets: [
    'Tor joy: yuza 4 marta kiçik',
    'Yuza 3 marta kiçik',
    'Venturi suv ölçagiçi',
    'Söruvçi: bosim manfiy',
    'Kengaygan quvur',
  ],
  units: { S1: 'sm²', S2: 'sm²' },
  // How the run ended, by the shape of the pipe. Speeds in m/s, pressures in kPa (gauge, unless said),
  // dh in cm; k: how many times the speed changed in the middle part.
  msg: {
    // S₁ = S₂.
    same: (v1, p1) => `Zarra quvurdan ötdi. Quvurning kesimi hamma joyda bir xil (S₁ = S₂), şuning uçun tezlik (υ = ${v1} m/s) ham, bosim (p = ${p1} kPa) ham özgarmadi.`,
    // The middle part is wider (S₂ > S₁).
    wider: (k, v2, p1, p2, dh) => `Zarra quvurdan ötdi. Kengaygan qismda tezlik ${k} marta kamaydi (υ₂ = ${v2} m/s), bosim esa ${p1} kPa dan ${p2} kPa gaça ortdi. Manometrlardagi suv sathlari farqi Δh = ${dh} sm.`,
    // Narrower and Bernoulli asks for less than the vapour pressure: pAbs is that absolute pressure, pVapour the vapour pressure.
    cavitation: (k, v2, pAbs, pVapour) => `Zarra quvurdan ötdi. Tor qismda tezlik ${k} marta ortdi (υ₂ = ${v2} m/s). Bernulli tenglamasiga köra absolut bosim u yerda ${pAbs} kPa bölişi kerak edi, lekin u suvning töyingan buğ bosimidan (${pVapour} kPa) kiçik bölmaydi. Tor qismda kavitatsiya boşlanadi: suv qaynab, buğ pufakçalari hosil böladi.`,
    // Narrower, and the pressure there is below the atmosphere by `below`.
    suction: (k, v2, below) => `Zarra quvurdan ötdi. Tor qismda tezlik ${k} marta ortdi (υ₂ = ${v2} m/s), bosim esa atmosfera bosimidan ${below} kPa ga kiçik bölib qoldi: tor qism havoni sörib oladi.`,
    // Narrower, pressure still above the atmosphere.
    narrower: (k, v2, p1, p2, dh) => `Zarra quvurdan ötdi. Tor qismda tezlik ${k} marta ortdi (υ₂ = ${v2} m/s), bosim esa ${p1} kPa dan ${p2} kPa gaça kamaydi. Manometrlardagi suv sathlari farqi Δh = ${dh} sm.`,
  },
  draw: {
    // Under a manometer tube whose water does not rise above the pipe: why.
    cavitation: 'kavitatsiya',
    suction: 'p < p₀: söriş',
    inPipe: 'sath quvurda',
    // Difference of the levels in the first two tubes, in cm.
    dh: (dh) => `Δh = ${dh} sm`,
  },
};

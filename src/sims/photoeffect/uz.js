export default {
  params: {
    metal: { label: 'Katod moddasi', options: ['Seziy (A = 1,9 eV)', 'Kaliy (A = 2,2 eV)', 'Natriy (A = 2,3 eV)', 'Rux (A = 4,2 eV)'] },
    lam: 'Yoruğlik tölqin uzunligi',
    I: 'Yoruğlik intensivligi',
  },
  readouts: {
    Ef: 'Foton energiyasi',
    Ek: 'Elektron energiyasi',
    v: 'Elektron tezligi',
    n: 'Urib çiqarilgan elektronlar',
  },
  graphs: {
    n: { title: 'Elektronlar soni', series: { n: 'N' } },
  },
  presets: ['Seziy, binafşa yoruğlik 400 nm', 'Rux, 400 nm (fotoeffekt yöq)', 'Rux, ultrabinafşa 200 nm'],
  msg: {
    // Ef: photon energy, Ek: largest kinetic energy (also the stopping voltage in volts), v: speed in km/s
    emitted: (Ef, Ek, v) => `Foton energiyasi hν = ${Ef} eV, elektronlarning eng katta kinetik energiyasi ${Ek} eV, tezligi ${v} km/s, tutib qoluvçi kuçlaniş ${Ek} V.`,
    // lamMax: red limit in nm
    noEffect: (Ef, lamMax) => `Foton energiyasi hν = ${Ef} eV çiqiş işidan kiçik: fotoeffekt yöq. Qizil çegara λ_max = ${lamMax} nm.`,
  },
  draw: {
    metals: ['Seziy', 'Kaliy', 'Natriy', 'Rux'], // same order as the metal menu
    cathode: (metal) => `katod: ${metal}`,
    anode: 'anod',
    noEmission: 'foton energiyasi yetmaydi: elektronlar çiqmaydi',
  },
};

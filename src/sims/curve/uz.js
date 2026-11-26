// Uzbek text of the flat curve (car on a bend) simulation (see index.js).
export default {
  params: {
    v: 'Avtomobil tezligi',
    R: 'Buriliş radiusi',
    mu: 'Ğildirak va yöl orasidagi işqalaniş koeffitsiyenti',
    m: 'Avtomobil massasi',
  },
  toggles: {
    forces: 'Işqalaniş kuçi (markazga intilma)',
    vel: 'Tezlik vektori',
    path: 'Avtomobil izi',
  },
  readouts: {
    need: 'Kerakli kuç mυ²/R',
    max: 'Eng katta işqalaniş μmg',
    vmax: 'Xavfsiz tezlik',
    f: 'Işqalaniş kuçi F_iş',
  },
  graphs: {
    F: { title: 'Işqalaniş kuçi va kerakli kuç', series: { f: 'F_iş', need: 'mυ²/R', max: 'μmg' } },
    dev: { title: 'Yöl örtasidan taşqariga suriliş', series: { dev: 'Δ' } },
  },
  presets: [
    'Quruq asfalt: R = 50 m, 15 m/s',
    'Höl yöl: μ = 0,4',
    'Muz: μ = 0,1',
    'Tor buriliş, yuqori tezlik',
  ],
  msg: {
    // need: centripetal force needed, max: the largest friction μmg; vmax: safe speed in m/s, kmh: the same in km/h. All formatted.
    off: (need, max, vmax, kmh) => `Avtomobil yöldan çiqib ketdi: burilişda ${need} N markazga intilma kuç kerak edi, işqalaniş esa köpi bilan ${max} N bera oladi. Bu burilişda xavfsiz tezlik ${vmax} m/s (${kmh} km/soat) dan oşmasligi kerak.`,
    // dev: how far the car drifted outwards.
    drift: (dev, need, max) => `Avtomobil burilişda ${dev} m taşqariga surildi, lekin yöldan çiqmadi: kerakli kuç ${need} N işqalanişning eng katta qiymatidan (${max} N) bir oz katta edi.`,
    ok: (need, max) => `Avtomobil burilişdan xavfsiz ötdi: kerakli markazga intilma kuç ${need} N, işqalaniş kuçining eng katta qiymati ${max} N.`,
  },
  draw: {
    friction: 'F_iş', // friction force arrow
    centre: 'buriliş markazi', // the dot at the centre of the bend
    // v: speed in m/s, kmh: the same in km/h; formatted.
    speed: (v, kmh) => `υ = ${v} m/s = ${kmh} km/soat`,
  },
};

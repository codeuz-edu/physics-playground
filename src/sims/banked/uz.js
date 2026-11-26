// Uzbek text of the banked curve simulation (see index.js).
export default {
  params: {
    v: 'Avtomobil tezligi',
    R: 'Buriliş radiusi',
    th: 'Yölning qiyalik burçagi',
    mu: 'Işqalaniş koeffitsiyenti',
  },
  toggles: {
    forces: 'Kuçlar',
    sum: 'Teng taʼsir etuvçi',
  },
  readouts: {
    v0: 'Ideal tezlik',
    vmin: 'Eng kiçik tezlik',
    vmax: 'Eng katta tezlik',
    need: 'Kerakli μ',
    q: 'Qiyalik böylab siljiş',
  },
  graphs: {
    f: { title: 'Işqalaniş kuçi (1 kg uçun)', series: { f: 'F_iş', lim: 'μN', nlim: '−μN' } },
    q: { title: 'Qiyalik böylab siljiş', series: { q: 'q' } },
  },
  presets: [
    'Ideal tezlik: θ = 15°, R = 100 m',
    'Tez: işqalaniş pastga yönalgan',
    'Sekin: işqalaniş yuqoriga yönalgan',
    'Muzli qiya yöl, μ = 0,05',
  ],
  msg: {
    // In place of the largest speed when friction allows any speed.
    unlimited: 'çeklanmagan',
    // vmin: formatted number, vmax: formatted number with its unit (or `unlimited`). Ends every message below.
    range: (vmin, vmax) => ` Ruxsat etilgan tezliklar: ${vmin} … ${vmax}.`,
    // need: the friction coefficient needed, mu: the one the road has; out: true when the car slid outwards (up the slope).
    off: (need, mu, out, range) => `Işqalaniş yetmadi: kerakli μ = ${need} > ${mu}, avtomobil ${out ? 'taşqariga' : 'içkariga'} sirpanib, yöldan çiqib ketdi.${range}`,
    // q: how far the car slid along the slope.
    slid: (need, mu, q, out, range) => `Işqalaniş yetmadi: kerakli μ = ${need} > ${mu}, avtomobil qiyalik böylab ${q} m ${out ? 'taşqariga' : 'içkariga'} surildi, lekin yöldan çiqmadi.${range}`,
    ideal: (v0, range) => `Ideal tezlik ${v0} m/s: kerakli μ deyarli nol, avtomobil burilişdan işqalanişsiz ötdi.${range}`,
    // up: true when friction points up the slope.
    held: (need, mu, up, range) => `Avtomobil burilişdan ötdi: işqalaniş kuçi qiyalik böylab ${up ? 'yuqoriga' : 'pastga'} yönalgan, kerakli μ = ${need} ≤ ${mu}.${range}`,
  },
  draw: {
    centre: '← buriliş markazi tomoni',
    topView: 'yuqoridan körinişi',
    friction: 'F_iş', // friction force arrow
    ideal: (v0) => `υ₀ = √(gR tg θ) = ${v0} m/s`,
  },
};

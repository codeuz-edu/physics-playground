// Uzbek text of the "rotation" simulation. The definition is in index.js; sims/load.js joins the two.
// The label of g comes from the shared dictionary (src/text/uz.js).
export default {
  params: {
    shape: { label: 'Ğildirak', options: ['Bir jinsli disk', 'Yupqa halqa'] },
    M: 'Ğildirak massasi',
    R: 'Ğildirak radiusi',
    m: 'Osilgan yuk massasi',
  },
  toggles: {
    forces: 'Kuçlar',
    omega: 'Burçak tezlik',
  },
  readouts: {
    eps: 'Burçak tezlaniş ε',
    w: 'Burçak tezlik ω',
    a: 'Yukning tezlanişi',
    M: 'Kuç momenti TR',
    Ekl: 'Yukning kinetik energiyasi mυ²/2',
    Ekw: 'Ğildirakning kinetik energiyasi Iω²/2',
  },
  graphs: {
    w: { title: 'Burçak tezlik', series: { w: 'ω' } },
    v: { title: 'Yukning tezligi', series: { v: 'υ' } },
    E: { title: 'Energiya', series: { Wg: 'mgh (kamaygan Eₚ)', Ekl: 'yuk mυ²/2', Ekw: 'ğildirak Iω²/2' } },
  },
  presets: [
    'Disk: M = 2 kg, R = 0,1 m',
    'Xuddi şunday halqa',
    'Katta disk',
  ],
  msg: {
    // The load reached the floor: time, drop, ε, final ω, I, then where the potential energy Wg went.
    floor: (t, h, eps, w, I, Wg, Ekl, Ekw) =>
      `Yuk ${t} s da ${h} m tuşdi. Burçak tezlanişi ε = ${eps} rad/s², oxirgi burçak tezlik ω = ${w} rad/s, inersiya momenti I = ${I} kg·m². Potensial energiyaning ${Wg} J qismidan ${Ekl} J yukning, ${Ekw} J ğildirakning kinetik energiyasiga aylandi.`,
  },
};

// Uzbek text of the "energy" simulation. The definition is in index.js; sims/load.js joins the two.
export default {
  params: {
    h: 'Boşlanğiç balandlik',
    v0: 'Boşlanğiç tezlik',
    H: 'Tepalik balandligi',
    m: 'Aravaça massasi',
    mu: 'Işqalaniş koeffitsiyenti',
  },
  toggles: {
    bars: 'Energiya ustunlari',
    vel: 'Tezlik vektori (υ)',
    vcomp: 'Tezlik proyeksiyalari (υₓ, υᵧ)',
    levels: 'Balandlik çiziqlari',
  },
  readouts: {
    ke: 'Kinetik energiya',
    pe: 'Potensial energiya',
    e: 'Töliq mexanik energiya',
    v: 'Tezlik',
  },
  graphs: {
    energy: { title: 'Energiyalar', series: { ke: 'kinetik', pe: 'potensial', e: 'töliq', loss: 'yöqotilgan' } },
    v: { title: 'Tezlik', series: { v: 'υ' } },
  },
  presets: [
    'Tepalikdan ötadi: h = 5 m, H = 3 m',
    'Öta olmaydi: h = 3 m, H = 4 m',
    'Aynan yetib boradi: h = 4 m, H = 4 m',
    'Turtki bilan: h = 2 m, υ₀ = 7,7 m/s, H = 5 m',
    'Işqalaniş bilan: μ = 0,1',
  ],
  dragHint: 'Boşlanğiç balandlikni özgartiriş uçun aravaçani yuqoriga yoki pastga, tepalik balandligini özgartiriş uçun ikkinçi tepalik çöqqisidagi tutqiçni suring.',
  msg: {
    crossed: (t, v) => `Aravaça tepalikdan ötdi: t = ${t} s, tepadagi tezligi ${v} m/s.`,
    back: (hmax) => `Aravaça tepalikdan öta olmadi (eng katta balandlik ${hmax} m) va boşlanğiç joyidan orqaga ötib ketdi.`,
    rest: (t, y, loss) => `Işqalaniş kuçi aravaçani t = ${t} s da ${y} m balandlikda töxtatdi; yöqotilgan energiya ${loss} J.`,
    still: 'Aravaça tekis relsda tinç turibdi: boşlanğiç balandlik yoki tezlik bering.',
    time: (tMax, hmax) => `${tMax} s ötdi. Aravaça tepalikdan öta olmadi: ikkinçi tepalikda yetgan eng katta balandligi ${hmax} m.`,
  },
  draw: {
    // Name under the energy bar of the work done against friction (next to Eₖ and Eₚ).
    work: 'A_iş',
    // Cue above the cart before the start, one string per line.
    dragCart: ['balandlikni tanlaş uçun', 'aravaçani suring'],
    dragCrest: 'tepalikni suring',
  },
};

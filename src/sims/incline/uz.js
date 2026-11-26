// Uzbek text of the incline simulation. Joined with index.js by sims/load.js.
export default {
  params: {
    angle: 'Qiyalik burçagi',
    m: 'Massa',
    mus: 'Tinçlikdagi işqalaniş',
    muk: 'Sirpaniş işqalanişi (≤ μₜ)',
  },
  toggles: {
    forces: 'Brusokka taʼsir etuvçi kuçlar',
    comp: 'Oğirlik kuçining taşkil etuvçilari',
    net: 'Teng taʼsir etuvçi kuç (ΣF)',
  },
  readouts: {
    f: 'Işqalaniş kuçi',
    a: 'Tezlaniş',
    v: 'Tezlik',
  },
  graphs: {
    forces: { title: 'Qiya tekislik böylab yönalgan kuçlar', yLabel: 'F', series: { along: 'mg sin α', f: 'işqalaniş kuçi', net: 'ΣF' } },
    v: { title: 'Qiya tekislik böylab tezlik', yLabel: 'υ', series: { v: 'υ' } },
  },
  presets: [
    'Sirpanadi: 30°, μₜ = 0,4',
    'Işqalaniş uşlab turadi: 15°',
    'Sirpaniş boşlanadigan burçakni toping',
    'Işqalanişsiz qiya tekislik',
    'Oğirroq brusok, öşa qiyalik',
  ],
  dragHint: 'Qiyalik burçagini özgartiriş uçun qiya tekislik tepasidagi dumaloq tutqiçni yuqoriga yoki pastga suring.',
  msg: {
    bottom: (t, speed) => `Jism t = ${t} s da qiya tekislikning pastiga yetdi, tezligi ${speed} m/s.`,
    rest: (s) => `Jism ${s} m sirpanib bordi, söng işqalaniş kuçi uni töxtatdi.`,
    /** It never moved: tan α (`tan`) is at most the static coefficient `mus`. */
    stuck: (tan, mus) => `Jism joyidan qözğalmadi: tg α = ${tan} ≤ μₜ = ${mus}, şuning uçun tinçlikdagi işqalaniş kuçi uni uşlab tura oladi.`,
    timeUp: (tMax, s) => `Simulyatsiya ${tMax} s dan keyin töxtatildi; jism qiya tekislik böylab ${s} m sirpanib tuşdi.`,
  },
  draw: {
    /** Label of the friction arrow; the part after _ is drawn as a subscript. */
    friction: 'F_iş',
    // Top left: why the block holds or slides. `tan` is tan α, `mus` the static coefficient.
    sliding: (muk) => `sirpanmoqda: sirpaniş işqalanişi, μₛ = ${muk}`,
    slips: (tan, mus) => `tg α = ${tan} > μₜ = ${mus}: işqalaniş uşlab tura olmaydi`,
    holds: (tan, mus) => `tg α = ${tan} ≤ μₜ = ${mus}: işqalaniş uşlab turibdi`,
    /** Wrapped at spaces onto several lines when the stage is narrow. */
    cue: 'burçakni özgartiriş uçun suring',
  },
};

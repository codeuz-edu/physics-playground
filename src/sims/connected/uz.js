// Uzbek text of the connected bodies (block on a table and a hanging load) simulation (see index.js).
export default {
  params: {
    m1: 'Stoldagi brusok massasi',
    m2: 'Osilgan yuk massasi',
    mu: 'Işqalaniş koeffitsiyenti',
  },
  toggles: {
    forces: 'Kuçlar',
    values: 'Kuçlarning qiymatlari',
  },
  readouts: {
    a: 'Tezlaniş',
    T: 'Taranglik kuçi',
    v: 'Tezlik',
  },
  graphs: {
    v: { title: 'Tezlik', series: { v: 'υ' } },
    s: { title: 'Bosib ötilgan yöl', series: { s: 's' } },
  },
  presets: [
    'Işqalanişsiz: 2 kg va 1 kg',
    'Işqalaniş bilan: 4 kg va 1,5 kg, μ = 0,2',
    'Qözğalmaydi: μm₁g > m₂g',
    'Yengil brusok, oğir yuk',
  ],
  msg: {
    // t: time, v: speed at the floor, T: rope tension; already formatted.
    floor: (t, v, T) => `Yuk ${t} s dan keyin polga tegdi, tezligi ${v} m/s. Ipning taranglik kuçi T = ${T} N.`,
    // pull: m₂g, hold: the largest static friction μm₁g.
    rest: (pull, hold) => `Sistema qözğalmadi: m₂g = ${pull} N tinçlikdagi işqalaniş kuçining eng katta qiymati μm₁g = ${hold} N dan oşmaydi.`,
  },
  draw: {
    friction: 'F_iş', // friction force arrow
  },
};

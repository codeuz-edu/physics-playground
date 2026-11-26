// Uzbek text of the Atwood machine simulation (see index.js).
export default {
  params: {
    m1: 'Çapdagi yuk massasi',
    m2: 'Öngdagi yuk massasi',
    h: 'Oğir yukning balandligi',
  },
  toggles: {
    forces: 'Kuçlar',
    ruler: 'Balandlik çizğiçi',
  },
  readouts: {
    a: 'Tezlaniş',
    T: 'Taranglik kuçi',
    v: 'Tezlik',
  },
  graphs: {
    v: { title: 'Tezlik', series: { v: 'υ' } },
    s: { title: 'Yukning siljişi', series: { s: 's' } },
  },
  presets: [
    '1 kg va 1,5 kg',
    'Massalar deyarli teng: g ni ölçaş',
    'Massalar teng',
    'Xuddi şu maşina Oyda',
  ],
  msg: {
    // t: time, v: speed at the floor, a: acceleration, T: rope tension; already formatted.
    floor: (t, v, a, T) => `Oğir yuk ${t} s dan keyin polga tegdi, tezligi ${v} m/s. Tezlaniş ${a} m/s², ipning taranglik kuçi ${T} N.`,
    balance: (T) => `Massalar teng: tezlaniş nolga teng, yuklar tinç turadi. Ipning taranglik kuçi T = mg = ${T} N.`,
  },
};

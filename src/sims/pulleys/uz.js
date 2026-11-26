// Uzbek text of the pulleys simulation (see index.js).
export default {
  params: {
    m: 'Yukning massasi',
    mode: { label: 'Mexanizm', options: ['Qözğalmas blok', 'Qözğaluvçan blok', 'Polispast (4 arqon)'] },
    u: 'Arqonni tortiş tezligi',
  },
  toggles: {
    forces: 'Kuçlar',
    ruler: 'Balandlik çizğiçi',
  },
  readouts: {
    F: 'Tortiş kuçi F',
    h: 'Yuk balandligi',
    s: 'Tortilgan arqon',
    A: 'Bajarilgan iş',
  },
  graphs: {
    hs: { title: 'Yuk balandligi va tortilgan arqon', series: { h: 'h', s: 's' } },
    A: { title: 'Bajarilgan iş', series: { A: 'A' } },
  },
  presets: [
    'Qözğalmas blok, 50 kg',
    'Qözğaluvçan blok, 50 kg',
    'Polispast, 50 kg',
    'Polispast bilan 200 kg',
  ],
  msg: {
    // h: lift height, s: rope pulled, F: force, A: work; all already formatted.
    done: (h, s, F, A) => `Yuk ${h} m kötarildi. Arqon ${s} m tortildi, kuç F = ${F} N, bajarilgan iş A = F·s = ${A} J.`,
  },
};

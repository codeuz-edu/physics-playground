// Uzbek text of the centre-of-mass simulation (see index.js).
export default {
  params: {
    shape: { label: 'Plastinka', options: ['Töğri törtburçak', 'L-şaklli plastinka', 'Uçburçak'] },
    hole: 'Osiş teşigi',
  },
  toggles: {
    plumb: 'Şovun',
    marks: 'Oldingi şovun çiziqlari',
    com: 'Oğirlik markazini körsatiş',
    force: 'Oğirlik kuçi',
  },
  readouts: { off: 'Şovundan ağiş' },
  graphs: {
    off: { title: 'Şovundan ağiş burçagi', series: { off: 'φ' } },
  },
  presets: ['Törtburçak, A teşik', 'L-şaklli plastinka, A teşik', 'Uçburçak, A teşik'],
  msg: {
    // x, y: coordinates of the centre of mass, already formatted.
    found: (x, y) => `Şovun çiziqlari bir nuqtada kesişdi — bu oğirlik markazi: x = ${x} sm, y = ${y} sm (plastinkaning pastki çap burçağidan).`,
    rest: 'Plastinka töxtadi: oğirlik markazi mix ostida, şovun çiziğida yotadi. Endi plastinkani boşqa teşikdan osing.',
  },
  draw: {
    plumb: 'şovun',
    com: 'oğirlik markazi', // beside the dot at the centre of mass
    // shape: name of the plate (params.shape.options), hole: its letter.
    hung: (shape, hole) => `${shape}, ${hole} teşikdan osilgan`,
  },
};

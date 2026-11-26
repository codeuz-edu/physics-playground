// Uzbek text of the "work-power" simulation. The definition is in index.js; sims/load.js joins the two.
// The label of g comes from the shared dictionary (src/text/uz.js).
export default {
  params: {
    m: 'Yukning massasi',
    angle: 'Qiyalik burçagi',
    mu: 'Işqalaniş koeffitsiyenti',
    u: 'Tortiş tezligi',
  },
  toggles: {
    forces: 'Kuçlar',
    bars: 'Iş ustunlari',
  },
  readouts: {
    F: 'Tortiş kuçi F',
    A: 'Töla iş',
    Au: 'Foydali iş mgh',
    P: 'Quvvat',
    eta: 'FIK',
  },
  graphs: {
    A: { title: 'Iş', series: { A: 'töla', Au: 'foydali', Af: 'işqalanişga' } },
    P: { title: 'Quvvat', series: { P: 'P' } },
  },
  presets: [
    'Işqalanişsiz: FIK 100 %',
    'Işqalaniş bilan: μ = 0,2',
    'Yotiq qiyalik: kuç kiçik, FIK past',
    'Tez tortiş: quvvat katta',
  ],
  msg: {
    // The load reached the top: time, distance along the slope, height gained, total and useful work, efficiency, power.
    top: (t, l, h, A, Au, eta, P) => `Yuk ${t} s da qiya tekislik böylab ${l} m tortildi (h = ${h} m ga kötarildi). Töla iş A = ${A} J, foydali iş ${Au} J, FIK η = ${eta} %, quvvat P = ${P} W.`,
  },
  draw: {
    // Name of the friction force arrow; what follows "_" is set as a subscript.
    friction: 'F_iş',
    // Names under the three work bars: total, useful, against friction.
    bars: { A: 'töla', Au: 'foydali', Af: 'işq.' },
  },
};

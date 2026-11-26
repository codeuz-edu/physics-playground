export default {
  params: {
    mode: { label: 'Tajriba', options: ['Özgarmas taşqi qarşilik', 'Reostat surgiçini suriş (0,1 Ω dan R gaça)'] },
    E: 'Manba EYK',
    r: 'Içki qarşilik',
    R: 'Taşqi qarşilik',
  },
  readouts: {
    I: 'Tok kuçi',
    U: 'Qisqiçlardagi kuçlaniş',
    P: 'Taşqi quvvat',
    eta: 'FIK',
    R: 'R',
    Isc: 'Qisqa tutaşuv toki',
  },
  graphs: {
    P: { title: 'Taşqi quvvat', yLabel: 'P', series: { P: 'P' } },
    IU: { title: 'Tok va kuçlaniş', yLabel: '', series: { I: 'I', U: 'U' } },
  },
  presets: [
    'ℰ = 12 V, r = 1 Ω, R = 5 Ω',
    'Qisqa tutaşuvga yaqin: R = 0,1 Ω',
    'Reostat: 0,1 Ω dan 10 Ω gaça, r = 2 Ω',
  ],
  msg: {
    fixed: (I, U, P, eta) => `I = ${I} A, U = ${U} V, taşqi quvvat P = ${P} W, FIK η = ${eta} %.`,
    // Rheostat swept up to R ≥ r: the power peaked on the way, at R = r.
    peak: (r, Pmax) => `Reostat suriliş tugadi. Taşqi quvvat R = r = ${r} Ω da eng katta böldi: P_max = ℰ²/(4r) = ${Pmax} W.`,
    // Rheostat never reached r: the power was largest at the end of the sweep.
    atEnd: (P) => `Reostat suriliş tugadi. R hamma vaqt r dan kiçik bölgani uçun quvvat oxirida eng katta: P = ${P} W.`,
  },
};

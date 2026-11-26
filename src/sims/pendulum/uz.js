// Uzbek text of the "pendulum" simulation. The definition is in index.js; sims/load.js joins the two.
// The label of g comes from the shared dictionary (src/text/uz.js).
export default {
  params: {
    L: 'Ip uzunligi',
    theta0: 'Boşlanğiç burçak',
    m: 'Şarça massasi',
    b: 'Söniş koeffitsiyenti',
  },
  toggles: {
    vel: 'Tezlik vektori (υ)',
    acc: 'Tezlaniş va uning taşkil etuvçilari (aₜ, aₙ)',
    forces: 'Kuçlar (mg, ipning tarangligi)',
    arc: 'Tebraniş yoyi',
  },
  readouts: {
    theta: 'Burçak',
    v: 'Tezlik',
    tension: 'Ipning tarangligi',
    period: 'Ölçangan davr',
  },
  graphs: {
    theta: { title: 'Burçak', series: { theta: 'α', small: 'kiçik burçaklar formulasi' } },
    v: { title: 'Tezlik', series: { v: 'υ' } },
  },
  presets: [
    'Sekundli mayatnik: l ≈ 1 m, T ≈ 2 s',
    'Katta burçak: 60°',
    'Oyda',
    'Uzun ip: 4 m',
    'Sönuvçi tebraniş',
  ],
  dragHint: 'Boşlanğiç burçakni özgartiriş uçun şarçani çapga yoki öngga suring.',
  msg: {
    // Why no period was measured: damping too strong to swing (critical β given), or no full swing yet.
    overdamped: (crit) => `Söniş juda kuçli (β ≥ 2√(g/l) = ${crit} 1/s): mayatnik tebranmasdan muvozanat holatiga qaytadi, şuning uçun davr ölçanmadi.`,
    noFullSwing: 'Töliq tebraniş bölmagani uçun davr ölçanmadi.',
    // The swing died out; `rest` is `measured(…)` or one of the two reasons above.
    still: (t, rest) => `Tebraniş t = ${t} s da sönib qoldi. ${rest}`,
    measured: (T) => `Ölçangan davr T = ${T} s.`,
    tooShort: (tMax) => `${tMax} s ötdi, lekin bu vaqt davrni ölçaşga yetmadi.`,
    period: (T, T0, diff) => `Ölçangan davr T = ${T} s; kiçik burçaklar formulasi T = 2π√(l/g) = ${T0} s beradi (farq ${diff} %).`,
    // With damping, `period` above is followed by the damped small-angle period.
    periodDamped: (period, Td) => `${period} Söniş ham davrni uzaytiradi: kiçik burçaklarda söniş bilan T = 2π/√(g/l − β²/4) = ${Td} s.`,
  },
  draw: {
    // The exact (large-angle) period; `damped` adds that it is the period without damping.
    exact: (T, damped) => `aniq davr${damped ? ' (sönişsiz)' : ''} = ${T} s`,
    measured: (T) => `ölçangan = ${T} s`,
    // Cue beside the bob before the start, one string per line.
    dragBob: ['burçakni tanlaş uçun', 'şarçani suring'],
  },
};

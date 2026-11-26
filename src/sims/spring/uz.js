// Uzbek text of the "spring" simulation. The definition is in index.js; sims/load.js joins the two.
export default {
  params: {
    m: 'Yuk massasi',
    k: 'Prujina bikrligi',
    x0: 'Boşlanğiç siljiş',
    v0: 'Boşlanğiç tezlik',
    b: 'Qarşilik koeffitsiyenti',
  },
  toggles: {
    force: 'Elastiklik kuçi (F = −kx)',
    vel: 'Tezlik vektori (υ)',
    amp: 'Amplituda çegaralari',
  },
  readouts: {
    x: 'Siljiş',
    v: 'Tezlik',
    F: 'Elastiklik kuçi',
    period: 'Ölçangan davr',
  },
  graphs: {
    xv: { title: 'Siljiş va tezlik', series: { x: 'x, m', v: 'υ, m/s' } },
    energy: { title: 'Energiyalar', series: { ke: 'kinetik', pe: 'potensial', e: 'töliq' } },
  },
  presets: [
    'Asosiy holat: m = 0,5 kg, k = 20 N/m',
    'Qattiq prujina: k = 200 N/m',
    'Oğir yuk: m = 4 kg',
    'Muvozanatdan turtki bilan',
    'Sönuvçi tebraniş',
  ],
  dragHint: 'Boşlanğiç siljişni özgartiriş uçun yukni çapga yoki öngga suring.',
  msg: {
    // The measured period against the formula; with drag, also the period the drag gives (Td may be '∞').
    period: (T, T0) => `Ölçangan davr T = ${T} s; formula T = 2π√(m/k) = ${T0} s beradi.`,
    periodDrag: (T, T0, Td) => `Ölçangan davr T = ${T} s; qarşilik bölmaganda T₀ = 2π√(m/k) = ${T0} s, qarşilik bilan T = 2π/√(k/m − (b/2m)²) = ${Td} s.`,
    // Why no period was measured: drag too strong to swing (critical b given), or no full swing yet.
    overdamped: (crit) => `Qarşilik juda katta (b ≥ 2√(km) = ${crit} kg/s): yuk tebranmasdan muvozanat holatiga qaytadi, şuning uçun davr ölçanmadi.`,
    noFullSwing: 'Töliq tebraniş bölmagani uçun davr ölçanmadi.',
    rest: 'Yuk muvozanat holatida tinç turibdi: boşlanğiç siljiş yoki tezlik bering.',
    // The block reached the end of the spring's travel; `squeezed` is true on the wall side (x < 0).
    limit: (t, x, squeezed, A, lim) =>
      `Yuk t = ${t} s da x = ${x} m ga yetdi: prujina bundan ortiq ${squeezed ? 'siqila' : 'çözila'} olmaydi. Boşlanğiç şartlar amplitudani A = √(x₀² + mυ₀²/k) = ${A} m qiladi, bu ${lim} m dan katta: boşlanğiç siljiş yoki tezlikni kamaytiring.`,
    // The swing died out; `rest` is the period sentence or one of the two reasons above.
    still: (t, rest) => `Tebraniş t = ${t} s da sönib qoldi. ${rest}`,
    tooShort: (t) => `${t} s ötdi, lekin bu vaqt davrni ölçaşga yetmadi.`,
  },
  draw: {
    // Cue right of the block before the start, one string per line.
    dragBlock: ['siljişni tanlaş uçun', 'yukni suring'],
  },
};

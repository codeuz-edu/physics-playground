// Uzbek text of the time dilation and length contraction simulation (definition in ./index.js).
export default {
  params: {
    b: 'Kema tezligi (c ning ulişi)',
    t0: 'Kemadagi soat bilan uçiş vaqti',
    l0: 'Kemaning xususiy uzunligi',
  },
  readouts: {
    ts: 'Kemadagi vaqt',
    te: 'Yerdagi vaqt',
    g: 'γ',
    l: 'Kema uzunligi (Yerdan)',
  },
  graphs: {
    t: { title: 'Soatlar', unit: 'yil', series: { ts: 'kema', te: 'Yer' } },
  },
  presets: [
    'υ = 0,8c, 10 yil',
    'υ = 0,6c, 8 yil',
    'υ = 0,99c, 1 yil',
  ],
  units: { t0: 'yil', ts: 'yil', te: 'yil' },
  timeUnit: 'yil',
  msg: {
    end: (t0, te, g, l) => `Kemadagi soat ${t0} yil körsatdi, Yerdagi soat esa Δt = γΔt₀ = ${te} yil. γ = ${g}, kema uzunligi Yerdan ${l} m körinadi.`,
  },
  draw: {
    /** Caption over the ship at rest (its proper length). */
    shipOwn: (l0) => `kema içida: l₀ = ${l0} m`,
    /** Caption over the moving ship as seen from Earth. */
    shipSeen: (l) => `Yerdan: l = ${l} m`,
    clockShip: (t) => `kemada ${t} yil`,
    clockEarth: (t) => `Yerda ${t} yil`,
  },
};

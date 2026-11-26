// Uzbek text of the star colour and luminosity simulation (definition in ./index.js).
export default {
  params: {
    T: 'Yulduz sirti temperaturasi',
    R: 'Yulduz radiusi (Quyoş radiusida)',
  },
  readouts: {
    lm: 'Spektr maksimumi',
    L: 'Yorqinlik',
    q: 'Sirt nurlaniş quvvati σT⁴',
  },
  graphs: {
    E: { title: '1 m² sirt nurlantirgan energiya', series: { E: 'E' } },
  },
  presets: [
    'Quyoş: 5772 K',
    'Qizil gigant: 3000 K, 100 R☉',
    'Issiq yulduz: 10 000 K, 2 R☉',
  ],
  msg: {
    /** `region` is the name of the spectral region of λ_max (from optics.js). */
    end: (lm, region, L, t, E, q) => `λ_max = b/T = ${lm} nm (${region}), yorqinlik L = ${L} L☉. Sirtning har kvadrat metri ${t} s da ${E} MJ energiya nurlantirdi (σT⁴ = ${q} MW/m²).`,
  },
  draw: {
    /** Name of the vertical axis of the spectrum. */
    intensity: 'nurlaniş intensivligi',
  },
};

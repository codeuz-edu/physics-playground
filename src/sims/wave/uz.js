export default {
  params: {
    type: { label: 'Tölqin turi', options: ['Köndalang (arqonda)', 'Böylama (prujinada, tovuş)'] },
    A: 'Amplituda',
    v: 'Tölqin tezligi (muhitga boğliq)',
    nu: 'Çastota (manbaga boğliq)',
  },
  readouts: {
    y: 'Belgilangan zarra siljişi',
    lam: 'Tölqin uzunligi',
    T: 'Davr',
    front: 'Tölqin fronti',
  },
  graphs: {
    y: { title: 'Belgilangan zarra siljişi', unit: 'sm', series: { y: 'y' } },
  },
  presets: ['υ = 1 m/s, ν = 0,5 Hz', 'Böylama tölqin: υ = 1,5 m/s, ν = 1,5 Hz', 'Uzun tölqin: υ = 0,75 m/s, ν = 0,25 Hz'],
  units: { A: 'sm', y: 'sm' },
  msg: {
    end: (periods, lam, T, front) => `Tölqin ${periods} davr davomida tarqaldi: λ = υ/ν = ${lam} m, T = ${T} s, tölqin fronti ${front} m ga yetdi.`,
  },
  draw: {
    front: 'front',
    // The wavelength caption when the wave is longer than the stage.
    tooLong: (lam) => `${lam} (ekrandan uzun)`,
  },
};

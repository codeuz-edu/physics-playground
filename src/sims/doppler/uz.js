export default {
  params: {
    f0: 'Manba çastotasi',
    vs: 'Manba tezligi',
    vo: 'Kuzatuvçi tezligi',
    dir: { label: 'Harakat', options: ['Manba va kuzatuvçi bir-biriga yaqinlaşmoqda', 'Manba va kuzatuvçi bir-biridan uzoqlaşmoqda'] },
  },
  readouts: {
    f: 'Eşitiladigan çastota',
    lam: 'Tölqin uzunligi',
    dist: 'Kuzatuvçigaça masofa',
  },
  graphs: {
    f: { title: 'Eşitiladigan çastota', series: { f: 'ν', f0: 'manba çastotasi ν₀' } },
    d: { title: 'Kuzatuvçigaça masofa', series: { dist: 's' } },
  },
  presets: ['Yaqinlaşiş: 500 Hz, 25 m/s', 'Uzoqlaşiş: 500 Hz, 25 m/s', 'Tez yordam maşinasi: 700 Hz, 30 m/s', 'Kuzatuvçi yaqinlaşmoqda: 500 Hz, 25 m/s'],
  msg: {
    end: (fh, f0, lam, tHear) => `Kuzatuvçi ${fh} Hz çastotani eşitadi (manba ${f0} Hz). Unga yetib kelayotgan tölqin uzunligi λ = ${lam} m. Birinçi tölqin fronti kuzatuvçiga ${tHear} s da yetib keldi.`,
  },
  draw: {
    source: 'manba',
    observer: 'kuzatuvçi',
    notYet: 'tovuş hali yetib kelmadi',
    // dt: time between two drawn wave fronts, s.
    fronts: (dt) => `tölqin fronti har ${dt} s da çizilgan; ikkala tezlik bir masştabda`,
  },
};

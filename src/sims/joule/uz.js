export default {
  params: {
    U: 'Tarmoq kuçlanişi',
    R: 'Spiral qarşiligi',
    m: 'Suv massasi',
    T0: 'Suvning boşlanğiç temperaturasi',
    eta: 'Çoynak FIK',
  },
  readouts: {
    T: 'Suv temperaturasi',
    Q: 'Ajralgan issiqlik',
    P: 'Quvvat',
    I: 'Tok kuçi',
  },
  graphs: {
    T: { title: 'Suv temperaturasi', series: { T: 't' } },
    Q: { title: 'Ajralgan issiqlik', series: { Q: 'Q' } },
  },
  presets: ['220 V, 40 Ω, 1 kg suv, FIK 80 %', '2 kg suv, FIK 100 %', 'Xuddi şu çoynak 110 V da'],
  timeUnit: 'min',
  msg: {
    end: (t, Q, Qw) => `Suv ${t} min da qaynadi. Isitgiç Q = I²Rt = ${Q} kJ issiqlik ajratdi, suv ${Qw} kJ oldi.`,
  },
};

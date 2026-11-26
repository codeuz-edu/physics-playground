export default {
  params: {
    m: 'Muz massasi',
    P: 'Isitgiç quvvati',
    T0: 'Muzning boşlanğiç temperaturasi',
  },
  readouts: {
    T: 'Temperatura',
    Q: 'Olingan issiqlik',
    fw: 'Suv',
    fs: 'Buğ',
  },
  graphs: {
    T: { title: 'Temperatura', series: { T: 't' } },
    f: { title: 'Muz, suv va buğ ulişi', series: { fi: 'muz', fw: 'suv', fs: 'buğ' } },
  },
  presets: ['0,5 kg muz, −20 °C, 1 kW', '1 kg muz, −10 °C, 2 kW', '0,2 kg muz, 0 °C, 1,5 kW'],
  timeUnit: 'min',
  msg: {
    end: (Q, t) => `Hamma suv buğga aylandi: jami Q = ${Q} kJ, vaqt ${t} min.`,
  },
  draw: {
    // ice warming, ice melting, water warming, water boiling
    stages: ['muz isimoqda: Q = c·m·Δt', 'muz erimoqda: Q = λm, t = 0 °C', 'suv isimoqda: Q = c·m·Δt', 'suv qaynamoqda: Q = Lm, t = 100 °C'],
  },
};

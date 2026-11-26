export default {
  params: {
    T1: 'Isitkiç temperaturasi',
    T2: 'Sovutkiç temperaturasi',
    Q1: 'Isitkiçdan olingan issiqlik',
  },
  readouts: {
    p: 'Bosim',
    V: 'Hajm',
    T: 'Temperatura',
    A: 'Gaz işi',
  },
  graphs: {
    T: { title: 'Temperatura', series: { T: 'T' } },
    A: { title: 'Gaz bajargan iş', series: { A: 'A' } },
  },
  presets: ['T₁ = 600 K, T₂ = 300 K', 'Issiqroq isitkiç: 800 K', 'Temperaturalar yaqin: 500 K va 350 K'],
  msg: {
    end: (Q1, Q2, A, eta) => `Sikl tugadi: gaz Q₁ = ${Q1} J oldi, Q₂ = ${Q2} J berdi, foydali iş A = ${A} J, η = ${eta} %.`,
  },
  draw: {
    // The four stages of the cycle, in order.
    stages: ['1→2 izotermik kengayiş (isitkiçdan Q₁ olinadi)', '2→3 adiabatik kengayiş', '3→4 izotermik siqiliş (sovutkiçga Q₂ beriladi)', '4→1 adiabatik siqiliş'],
    heater: (T1) => `isitkiç, T₁ = ${T1} K`,
    cooler: (T2) => `sovutkiç, T₂ = ${T2} K`,
    insulation: 'issiqlik izolyatsiyasi',
    area: 'yuza = bir siklda bajarilgan foydali iş',
  },
};

export default {
  params: {
    proc: { label: 'Jarayon', options: ['Izotermik (T = const)', 'Izobarik (p = const)', 'Izoxorik (V = const)'] },
    nu: 'Gaz miqdori',
    T0: 'Boşlanğiç temperatura',
    V0: 'Boşlanğiç hajm',
    k: 'Özgariş: V₂/V₁ (izotermik) yoki T₂/T₁',
  },
  readouts: {
    p: 'Bosim',
    V: 'Hajm',
    T: 'Temperatura',
    A: 'Gaz işi',
    Q: 'Issiqlik',
  },
  graphs: {
    p: { title: 'Bosim', series: { p: 'p' } },
    T: { title: 'Temperatura', series: { T: 'T' } },
  },
  presets: ['Boyl–Mariott: hajmni 2 marta kamaytiriş', 'Gey-Lyussak: 300 K dan 450 K gaça', 'Şarl: temperaturani 2 marta oşiriş'],
  msg: {
    // gained: the gas took heat in (Q ≥ 0) rather than gave it away; Q is the magnitude.
    end: (p, V, T, gained, Q, A) => `Jarayon tugadi: p = ${p} kPa, V = ${V} L, T = ${T} K. Gaz ${gained ? 'oldi' : 'berdi'}: Q = ${Q} J, gaz işi A = ${A} J.`,
  },
  draw: {
    cooling: 'sovutiş',
    thermostat: 'termostat: T = const',
  },
};

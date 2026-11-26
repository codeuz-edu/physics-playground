export default {
  params: {
    mode: { label: 'Jarayon', options: ['Zaryadlaş (manbaga ulaş)', 'Razryadlaş (rezistor orqali)'] },
    U: 'Manba kuçlanişi',
    R: 'Qarşilik',
    C: 'Siğim',
  },
  readouts: { u: 'Kondensator kuçlanişi', I: 'Tok kuçi', q: 'Zaryad', W: 'Energiya' },
  graphs: {
    u: { title: 'Kondensator kuçlanişi', yLabel: 'U', series: { u: 'U_C' } },
    I: { title: 'Tok kuçi', yLabel: 'I', series: { I: 'I' } },
  },
  presets: [
    '12 V, 2 kΩ, 500 μF',
    'Siğim ikki marta katta',
    'Razryadlaş: 24 V, 10 kΩ, 200 μF',
  ],
  msg: {
    end: (t5, u, percent, q, W) => `5τ = ${t5} s ötdi: kondensator kuçlanişi U_C = ${u} V (${percent} %), zaryadi q = ${q} mC, energiyasi W = ${W} mJ.`,
  },
  draw: { disconnected: 'manba uzilgan' },
};

export default {
  params: {
    q1: 'Çapdagi zaryad',
    q2: 'Öngdagi zaryad',
    d: 'Zaryadlar orasidagi masofa',
    x0: 'Boşlanğiç nuqta: x',
    y0: 'Boşlanğiç nuqta: y',
  },
  toggles: { lines: 'Kuç çiziqlari', grid: 'Kuçlanganlik vektorlari', free: 'Erkin zaryad yöli' },
  readouts: { E: 'Kuçlanganlik', phi: 'Potensial' },
  graphs: {
    E: { title: 'Kuçlanganlik', yLabel: 'E', series: { E: 'E' } },
    phi: { title: 'Potensial', yLabel: 'φ', series: { phi: 'φ' } },
  },
  presets: [
    'Dipol: 2 μC va −2 μC, örtadagi nuqta',
    'Bir xil zaryadlar, örtadagi nuqta',
    'Yakka zaryad: 3 μC dan 30 sm',
    'Dipol: yuqoriroqdan boşlaş',
  ],
  units: { d: 'sm', x0: 'sm', y0: 'sm' },
  lengthUnit: 'sm',
  msg: {
    // `why` is one of the sentences below, chosen by how the run ended.
    start: (E, phi, why) => `Boşlanğiç nuqtada E = ${E} kN/C, φ = ${phi} kV. ${why}`,
    why: {
      sink: 'Kuç çizigi manfiy zaryadda tugadi.',
      out: 'Kuç çizigi maydon çegarasidan çiqib ketdi.',
      zero: 'Bu nuqtada maydon nolga teng: sinov zaryadi qimirlamaydi.',
      time: '',
      on: 'Boşlanğiç nuqta zaryadning ustida: uni boşqa joyga qöying.',
    },
  },
  draw: { free: 'erkin zaryad' },
};

export default {
  params: {
    mode: { label: 'Tajriba', options: ['Qutblagiç va analizator', 'Uç qutblagiç (oxirgisi 90°)'] },
    I0: 'Tabiiy yoruğlik intensivligi',
    phi: 'Burilgan qutblagiçning oxirgi burçagi',
  },
  readouts: {
    a: 'Burçak',
    I1: 'Qutblagiçdan keyin',
    I: 'Oxirida',
  },
  graphs: {
    I: { title: 'Ötgan yoruğlik intensivligi', series: { I: 'I' } },
  },
  presets: ['Analizator 60° da', 'Analizator 30° da', 'Uç qutblagiç: örtadagisi 45°'],
  msg: {
    // phi: angle of the turned sheet, I: intensity at the end
    analyzer: (phi, I) => `Analizator ${phi}° ga burildi: I = (I₀/2)·cos²φ = ${I} W/m².`,
    middle: (phi, I) => `Örtadagi qutblagiç ${phi}° da: I = (I₀/2)·cos²φ·cos²(90° − φ) = ${I} W/m².`,
  },
  draw: {
    natural: 'tabiiy yoruğlik',
    polarizer: 'qutblagiç',
    analyzer: 'analizator',
  },
};

export default {
  params: {
    q1: 'Birinçi zaryad (mahkamlangan)',
    q2: 'Ikkinçi zaryad',
    m: 'Ikkinçi şarça massasi',
    r0: 'Boşlanğiç masofa',
  },
  toggles: { forces: 'Kuçlar' },
  readouts: { r: 'Masofa', F: 'Kulon kuçi', v: 'Tezlik' },
  graphs: {
    F: { title: 'Kulon kuçi', yLabel: 'F', series: { F: 'F' } },
    v: { title: 'Tezlik', yLabel: 'υ', series: { v: 'υ' } },
  },
  presets: [
    'Itariliş: 2 μC va 2 μC, 10 sm',
    'Tortiliş: 2 μC va −2 μC, 30 sm',
    'Masofa 3 marta katta: 30 sm',
  ],
  units: { r0: 'sm', r: 'sm' },
  msg: {
    far: (v, F) => `Masofa 60 sm böldi: ikkinçi şarça tezligi υ = ${v} m/s, kuç F = ${F} N gaça kamaydi.`,
    hit: (v) => `Şarçalar urildi: urilişdan oldin tezlik υ = ${v} m/s.`,
    none: 'Zaryadlardan biri nolga teng: kuç yöq, şarça joyida turadi.',
  },
  draw: { axis: 'r, sm' },
};

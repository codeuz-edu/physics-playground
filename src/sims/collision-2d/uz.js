// Uzbek text of the "collision-2d" simulation. The definition is in index.js; sims/load.js joins the two.
export default {
  params: {
    m1: 'Uriluvçi şar massasi',
    m2: 'Tinç turgan şar massasi',
    v0: 'Uriluvçi şar tezligi',
    b: 'Nişon siljişi (2R ning ulişi)',
    e: 'Tiklaniş koeffitsiyenti',
  },
  toggles: {
    vel: 'Tezlik vektorlari',
    pvec: 'Impulslar uçburçagi',
    path: 'Şarlarning izi',
  },
  readouts: {
    px: 'pₓ (yiğindi)',
    py: 'pᵧ (yiğindi)',
    Ek: 'Kinetik energiya',
  },
  graphs: {
    p: { title: 'Impulsning proyeksiyalari', series: { px: 'pₓ', py: 'pᵧ' } },
    E: { title: 'Kinetik energiya', series: { Ek: 'Eₖ' } },
  },
  presets: [
    'Teng massalar, elastik, b = 0,5',
    'Markaziy uriliş',
    'Noelastik uriliş, e = 0,5',
    'Yengil şar oğirga uriladi',
  ],
  msg: {
    miss: 'Şarlar bir-biriga tegmadi.',
    // Inserted after the speeds in `after` when both balls move.
    angle: (ang) => `, ular orasidagi burçak ${ang}°`,
    energyKept: (E0) => `Kinetik energiya saqlandi: ${E0} J.`,
    energyLost: (E0, E) => `Kinetik energiya ${E0} J dan ${E} J ga kamaydi.`,
    after: (v1, v2, angle, p, energy) => `Töqnaşuvdan keyin υ₁ = ${v1} m/s, υ₂ = ${v2} m/s${angle}. Impuls saqlandi: ${p} kg·m/s. ${energy}`,
  },
  draw: {
    angle: (ang) => `burçak ${ang}°`,
  },
};

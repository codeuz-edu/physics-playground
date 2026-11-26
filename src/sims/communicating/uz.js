// Uzbek text of the "communicating" simulation. The definition is in index.js; sims/load.js joins the two.
// The liquid names in the two menus come from sims/fluids.uz.js; inside a sentence they are lower-cased here.
const lower = (name) => name.toLowerCase();

export default {
  params: {
    liq1: 'Naydagi suyuqlik',
    liq2: 'Quyilayotgan suyuqlik',
    H2: 'Quyilgan ustun balandligi',
    q: 'Quyiş tezligi',
  },
  toggles: {
    dims: 'Ustunlar balandligi',
    level: 'Ajraliş sathi',
  },
  readouts: {
    h1: 'Çap ustun h₁',
    h2: 'Öng ustun h₂',
    dh: 'Sirtlar farqi',
    p2: 'Ajraliş sathidagi bosim',
  },
  graphs: {
    h: { title: 'Ustunlar balandligi', unit: 'sm', series: { h1: 'h₁', h2: 'h₂' } },
    p: { title: 'Ajraliş sathidagi bosim', series: { p1: 'ρ₁gh₁', p2: 'ρ₂gh₂' } },
  },
  presets: [
    'Suv va kerosin',
    'Suv va ösimlik moyi',
    'Simob va suv',
    'Bir jinsli suyuqlik: suv va suv',
  ],
  units: { H2: 'sm', q: 'sm/s', h1: 'sm', h2: 'sm', dh: 'sm' },
  msg: {
    // base: the liquid in the tube, poured: the one poured into the right arm (menu names);
    // h1, h2: their columns above the interface in cm; ratio: ρ₂/ρ₁.
    full: (base, poured, h1, h2, ratio) => `Öng tirsakka ${h2} sm ${lower(poured)} quyildi. Ajraliş sathidan hisoblaganda ${lower(base)} ustuni h₁ = ${h1} sm, ${lower(poured)} ustuni h₂ = ${h2} sm: h₁/h₂ = ρ₂/ρ₁ = ${ratio}.`,
  },
  draw: {
    // Caption beside each arm: the liquid's menu name.
    liquid: lower,
    // Column heights above the interface, in cm.
    h1: (h) => `h₁ = ${h} sm`,
    h2: (h) => `h₂ = ${h} sm`,
  },
};

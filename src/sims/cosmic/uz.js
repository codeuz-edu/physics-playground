// Uzbek text of the cosmic speeds simulation (definition in ./index.js).
export default {
  params: {
    pl: { label: 'Osmon jismi', options: ['Yer', 'Oy', 'Mars'] },
    v: 'Gorizontal boşlanğiç tezlik',
    h0: 'Otiş balandligi (Nyuton toği)',
  },
  readouts: {
    h: 'Balandlik',
    v: 'Tezlik',
  },
  graphs: {
    h: { title: 'Balandlik', series: { h: 'h' } },
    v: { title: 'Tezlik', series: { v: 'υ' } },
  },
  presets: [
    'Yer: 7,91 km/s (aylana)',
    'Yer: 9 km/s (ellips)',
    'Yer: 11,2 km/s (uzoqlaşiş)',
    'Yer: 6 km/s, 1000 km li toğdan (qaytib tuşadi)',
  ],
  // `at` is the formula's denominator: '/R' from the surface, '/(R + h₀)' from the mountain.
  msg: {
    /** Below υ₁ from the surface itself (h₀ = 0): it touches the ground at once. */
    fallAtOnce: (v, v1) => `υ₀ = ${v} km/s birinçi kosmik tezlikdan (${v1} km/s) kiçik: sirtdan gorizontal otilgan jism darhol sirtga tegadi. Tuşiş yölini köriş uçun otiş balandligini oşiring (Nyuton toği).`,
    /** Below υ₁ from the mountain: it comes back down after t minutes. */
    fall: (v, v1, t) => `υ₀ = ${v} km/s bu balandlikdagi birinçi kosmik tezlikdan (${v1} km/s) kiçik: jism ${t} min dan keyin sirtga qaytib tuşdi.`,
    circle: (at, v1, T) => `υ₀ ≈ υ₁ = √(GM${at}) = ${v1} km/s: jism aylana orbita böylab harakatlanadi, davri ${T} min.`,
    ellipse: (ra, T) => `Orbita ellips: eng uzoq nuqtasi markazdan ${ra} R masofada, davri ${T} min.`,
    /** Below υ₁ from the mountain, but the orbit misses the ground: the launch point is the far end. */
    inner: (v1, rp, T) => `υ₀ birinçi kosmik tezlikdan (${v1} km/s) kiçik, lekin jism sirtga yetmaydi: orbita ellips, otiş nuqtasi uning eng uzoq nuqtasi, eng yaqin nuqtasi markazdan ${rp} R masofada, davri ${T} min.`,
    escape: (at, v2) => `υ₀ ≥ υ₂ = √(2GM${at}) = ${v2} km/s: jism tortişni yengib, uzoqlaşib ketadi.`,
  },
  draw: {
    bodies: ['Yer', 'Oy', 'Mars'],
    speeds: (v1, v2) => `υ₁ = ${v1} km/s,  υ₂ = ${v2} km/s`,
    /** The same, launched from a mountain of height h0. */
    speedsAt: (v1, v2, h0) => `υ₁ = ${v1} km/s,  υ₂ = ${v2} km/s  (h₀ = ${h0} km da)`,
  },
};

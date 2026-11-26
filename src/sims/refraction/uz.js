export default {
  params: {
    n1: 'Birinçi muhit (yuqori)',
    n2: 'Ikkinçi muhit (pastki)',
    a: 'Tuşiş burçagi',
  },
  readouts: {
    a: 'Tuşiş burçagi',
    g: 'Sindiriş burçagi',
    a0: 'Çegaraviy burçak',
  },
  graphs: {
    angles: { title: 'Tuşiş va sindiriş burçaklari', series: { a: 'α', g: 'γ' } },
  },
  presets: ['Havodan şişaga, α = 40°', 'Suvdan havoga, α = 30°', 'Şişadan havoga, α = 45° (töla içki qaytiş)'],
  msg: {
    // a: angle of incidence, a0: critical angle
    totalReflection: (a, a0) => `Töla içki qaytiş: α = ${a}° çegaraviy burçak α₀ = ${a0}° dan katta, nur ikkinçi muhitga ötmaydi.`,
    // g: angle of refraction, ratio: n₂/n₁
    refracted: (g, ratio) => `Sindiriş burçagi γ = ${g}°; sin α / sin γ = n₂/n₁ = ${ratio}.`,
  },
  draw: {
    totalReflection: (a) => `α = ${a}°, sin α > n₂/n₁: töla içki qaytiş`,
    snell: (a, g) => `n₁ sin α = n₂ sin γ:  α = ${a}°,  γ = ${g}°`,
  },
};

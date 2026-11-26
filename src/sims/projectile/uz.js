// Uzbek text of the projectile simulation. Joined with index.js by sims/load.js.
// The label of `g` comes from the shared dictionary (src/text/uz.js).
export default {
  params: {
    v0: 'Boşlanğiç tezlik',
    angle: 'Otiş burçagi',
    h0: 'Boşlanğiç balandlik',
    k: 'Havoning qarşiligi koeffitsiyenti',
  },
  toggles: {
    vel: 'Tezlik vektori (υ)',
    comp: 'Tezlik proyeksiyalari',
    prev: 'Oldingi otişlar',
    grid: 'Koordinata töri',
  },
  readouts: {
    x: 'Gorizontal masofa',
    y: 'Balandlik',
    speed: 'Tezlik moduli',
  },
  graphs: {
    y: { title: 'Balandlik', yLabel: 'y', series: { y: 'y' } },
    v: { title: 'Tezlik proyeksiyalari', yLabel: 'υ', series: { vx: 'υₓ', vy: 'υᵧ' } },
  },
  presets: [
    '45° burçak ostida otiş',
    'Töldiruvçi burçaklar: 30°',
    'Töldiruvçi burçaklar: 60°',
    'Jarlikdan gorizontal otiş',
    'Balkondan yuqoriga otiş',
    'Xuddi şu otiş Oyda',
    'Xuddi şu otiş Marsda',
    'Havoning qarşiligi bilan tez otiş',
  ],
  dragHint: 'Töq sariq strelka uçidagi dumaloq tutqiçni suring: strelkaning yönalişi otiş burçagini, uzunligi esa boşlanğiç tezlikni belgilaydi.',
  msg: {
    timeUp: (tMax) => `Simulyatsiya ${tMax} s dan keyin töxtatildi.`,
    onGround: 'Jism yer sirtida turibdi. Boşlanğiç balandlikni oşiring yoki jismni yuqoriga oting.',
    landed: (t, x, hMax) => `Jism ${t} s dan keyin ${x} m uzoqlikka tuşdi. Eng katta balandlik: ${hMax} m.`,
  },
  draw: {
    /** Label of the highest point of the path. */
    highest: (h) => `eng yuqori nuqta: ${h} m`,
    cue: 'nişonga oliş uçun suring',
  },
};

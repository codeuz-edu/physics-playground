export default {
  params: {
    gas: { label: 'Gaz', options: ['Vodorod H₂ (M = 2 g/mol)', 'Geliy He (M = 4 g/mol)', 'Azot N₂ (M = 28 g/mol)', 'Kislorod O₂ (M = 32 g/mol)', 'Karbonat angidrid CO₂ (M = 44 g/mol)'] },
    T0: 'Boşlanğiç temperatura',
    rate: 'Isitiş tezligi',
    n: 'Konsentratsiya, ×10²⁵',
  },
  readouts: {
    v: 'Örtaça kvadratik tezlik',
    E: 'Ē, ×10⁻²¹',
    p: 'Bosim',
    T: 'Temperatura',
  },
  graphs: {
    v: { title: 'Örtaça kvadratik tezlik', series: { v: 'υ' } },
    p: { title: 'Bosim', series: { p: 'p' } },
  },
  presets: ['Havo (azot), xona temperaturasi', 'Vodorod: 300 K', 'Azotni 300 K dan 600 K gaça isitiş'],
  msg: {
    // solid: the gas turns into a solid (dry ice) rather than a liquid.
    condensed: (T, gas, solid, v, p) => `T = ${T} K da ${gas} ${solid ? 'quruq muzga' : 'suyuqlikka'} aylana boşlaydi: bundan past temperaturada uni ideal gaz deb hisoblab bölmaydi. Şu paytda örtaça kvadratik tezlik ${v} m/s, bosim ${p} kPa.`,
    end: (T, gas, v, E, p) => `T = ${T} K da ${gas} molekulalarining örtaça kvadratik tezligi ${v} m/s, örtaça kinetik energiyasi ${E}·10⁻²¹ J, bosim ${p} kPa.`,
  },
  draw: {
    distribution: 'tezliklar taqsimoti (Maksvell)',
  },
};

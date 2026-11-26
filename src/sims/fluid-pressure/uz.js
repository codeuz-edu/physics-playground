// Uzbek text of the "fluid-pressure" simulation. The definition is in index.js; sims/load.js joins the two.
// The liquid names in the "liq" menu come from sims/fluids.uz.js.
export default {
  params: {
    liq: 'Suyuqlik',
    H: 'Suyuqlik çuqurligi',
    u: 'Datçikning tuşiş tezligi',
    p0: 'Atmosfera bosimi',
  },
  toggles: {
    arrows: 'Datçikka hamma tomondan bosim',
    atm: 'Atmosfera bosimi p₀',
    ruler: 'Çuqurlik şkalasi',
  },
  readouts: {
    h: 'Çuqurlik',
    ph: 'Gidrostatik bosim ρgh',
    p: 'Töla bosim',
  },
  graphs: {
    p: { title: 'Bosim', series: { p: 'p', ph: 'ρgh' } },
    h: { title: 'Datçik çuqurligi', series: { h: 'h' } },
  },
  presets: [
    'Hovuz: 4 m suv',
    'Dengiz: 10 m çuqurlik',
    'Kerosinli bak: 2,5 m',
    'Simob ustuni: 760 mm',
    'Oyda: atmosfera yöq (fikriy tajriba)',
  ],
  dragHint: 'Suyuqlik sirtini yuqoriga yoki pastga suring: idişdagi suyuqlik çuqurligi özgaradi.',
  msg: {
    // The probe reached the floor: depth H in m, hydrostatic and total pressure in kPa.
    bottom: (H, ph, p) => `Datçik idiş tubiga, ${H} m çuqurlikka yetdi. Gidrostatik bosim ρgh = ${ph} kPa, atmosfera bosimi bilan birga p = ${p} kPa.`,
    // Added right after `bottom` (so it starts with a space) when the liquid is water and p₀ is below its vapour pressure.
    boils: ' Eslatma: p₀ suvning töyingan buğ bosimidan (20 °C da 2,3 kPa) kiçik bölsa, oçiq suv qaynab ketadi, şuning uçun bu fikriy tajriba.',
  },
  draw: {
    // Beside the manometer dial, one string per line: its name, then its full scale in kPa.
    gauge: (full) => ['manometr (ρgh)', `0…${full} kPa`],
  },
};

// Uzbek text of the satellite simulation (definition in ./index.js).
export default {
  params: {
    h: 'Orbita balandligi',
    v: 'Boşlanğiç tezlik',
  },
  toggles: {
    vel: 'Tezlik vektori',
    force: 'Tortişiş kuçi',
    pre: 'Kutilayotgan yöl',
  },
  readouts: {
    alt: 'Balandlik',
    v: 'Tezlik',
  },
  graphs: {
    alt: { title: 'Yer sirtidan balandlik', series: { alt: 'h' } },
    v: { title: 'Tezlik', series: { v: 'υ' } },
  },
  presets: [
    'Xalqaro kosmik stansiya: 400 km',
    'Geostatsionar orbita: 35 800 km',
    'Tezlik yetmaydi: 7,0 km/s',
    'Elliptik orbita: 8,5 km/s',
    'Ikkinçi kosmik tezlikdan katta: 11 km/s',
  ],
  timeUnit: 'soat',
  msg: {
    orbit: (period, minutes) => `Yöldoş Yer atrofida bir marta aylanib çiqdi: aylaniş davri ${period} soat (taxminan ${minutes} min).`,
    crash: (t, atmo) => `Yöldoş ${t} soatdan keyin atmosferaning ziç qatlamiga (${atmo} km dan pastga) kirdi: tezlik bu balandlikdagi birinçi kosmik tezlikdan kiçik edi. U yerda havo qarşiligi yöldoşni tormozlaydi va u Yerga qulab tuşadi.`,
    escape: 'Yöldoş Yerning tortişini yengib, uzoqlaşib ketmoqda: tezlik ikkinçi kosmik tezlikdan katta.',
    time: (hours) => `Yöldoş ${hours} soat davomida bir marta ham töla aylanmadi.`,
  },
  draw: {
    earth: 'Yer',
  },
};

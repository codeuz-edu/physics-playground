export default {
  params: {
    part: { label: 'Zarra', options: ['Elektron', 'Proton'] },
    U: 'Tezlatuvçi kuçlaniş',
  },
  readouts: {
    v: 'Tezlik',
    lam: 'Tölqin uzunligi',
  },
  graphs: {
    v: { title: 'Zarra tezligi', series: { v: 'υ' } },
  },
  presets: ['Elektron, 100 V', 'Elektron, 1000 V', 'Proton, 100 V'],
  msg: {
    // U: voltage in V, v: final speed in km/s, lam: de Broglie wavelength in nm
    end: (U, v, lam) => `Zarra U = ${U} V kuçlanişda tezlandi: υ = ${v} km/s, de Broyl tölqin uzunligi λ = h/(mυ) = ${lam} nm.`,
  },
  draw: {
    notToScale: 'tölqin masştabsiz körsatilgan',
  },
};

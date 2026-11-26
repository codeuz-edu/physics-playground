export default {
  params: {
    lam: 'Yoruğlik tölqin uzunligi',
    d: 'Tirqişlar orasidagi masofa',
    L: 'Ekrangaça masofa',
  },
  readouts: {
    L: 'Ekrangaça masofa',
    dx: 'Yöllar orasidagi masofa',
  },
  graphs: {
    dx: { title: 'Yöllar orasidagi masofa', series: { dx: 'Δx' } },
  },
  presets: ['Qizil-zarğaldoq: 600 nm', 'Yaşil: 500 nm, d = 0,25 mm, L = 2 m', 'Qizil: 750 nm, d = 0,3 mm, L = 1,2 m'],
  msg: {
    // dx: fringe spacing in mm
    end: (dx) => `Ekranda interferension manzara: qöşni yoruğ yöllar orasidagi masofa Δx = λL/d = ${dx} mm.`,
  },
};

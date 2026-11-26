export default {
  params: {
    iso: { label: 'Izotop', options: ['Yod-131 (T = 8,02 sutka)', 'Kobalt-60 (T = 5,27 yil)', 'Radon-222 (T = 3,82 sutka)', 'Uglerod-14 (T = 5730 yil)'] },
    N0: 'Boşlanğiç yadrolar soni',
    nT: 'Kuzatiş vaqti (yarim yemiriliş davrlarida)',
  },
  readouts: {
    N: 'Qolgan yadrolar',
    A: 'Ulişi (aktivlik)',
  },
  graphs: {
    N: { title: 'Qolgan yadrolar soni', series: { N: 'N' } },
  },
  presets: ['Yod-131: 3 davr', 'Kobalt-60: 2 davr', 'Uglerod-14: 1 davr'],
  msg: {
    // Units the half-lives are given in.
    periodUnit: { day: 'sutka', year: 'yil' },
    // n: number of half-lives, t: elapsed time in `unit`, N: nuclei left, A: share left in %
    end: (n, t, unit, N, A) => `${n} yarim yemiriliş davri (${t} ${unit}) ötdi: N = N₀·2^(−t/T) = ${N} ta yadro qoldi (${A} %).`,
  },
  draw: {
    // total: atoms in the grid (a sample, whatever N₀ is), left: atoms not yet decayed
    left: (total, left) => `namuna: ${total} ta yadrodan ${left} tasi hali yemirilmagan (tasodifiy)`,
  },
};

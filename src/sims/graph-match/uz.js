// Uzbek text of the graph-match simulation. Joined with index.js by sims/load.js.
export default {
  params: {
    // Options: the target graphs, in the order of TARGETS in model.js.
    target: {
      label: 'Maqsad grafigi',
      options: ['Tekis uzoqlaşiş', 'Kutib, söng yuriş', 'Joyidan tezlaniş', 'Borib-qaytiş', 'Sekinlaşib töxtaş'],
    },
    xp: 'Avtomobil koordinatasi',
  },
  toggles: {
    vel: 'Tezlik vektori (υ)',
    marker: 'Yöldagi maqsad',
  },
  readouts: {
    x: 'Koordinatangiz',
    xt: 'Maqsad',
    gap: 'Farq',
  },
  graphs: {
    v: { title: 'Tezlik (koordinata grafigining qiyaligi)', yLabel: 'υ', series: { v: 'siz', vt: 'maqsad' } },
  },
  dragHint: 'Avtomobilni yöl böylab suring (yoki “Avtomobil koordinatasi” parametrini özgartiring): grafikdagi çiziğingiz punktir çiziqli maqsad grafigi böylab borsin.',
  msg: {
    /** `verdict` is one of great, good or tryAgain below. */
    result: (gap, verdict) => `Maqsaddan örtaça farq: ${gap} m. ${verdict}`,
    great: 'Aʼlo darajada mos keldi!',
    good: 'Yaxşi mos keldi.',
    tryAgain: 'Grafikdagi punktir çiziqni kuzatib, yana urinib köring.',
  },
  draw: {
    /** Key of the chart on the stage: the dashed target line, then your line. */
    target: (name) => `maqsad: ${name}`,
    you: 'siz',
    cue: 'boşqariş uçun suring',
  },
};

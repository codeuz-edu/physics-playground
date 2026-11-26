// Shared Uzbek dictionary. Each simulation has its own text in sims/<id>/uz.js; this file holds
// what several of them share. To add a language, copy this file and the *.uz.js files it imports.
import kit from '../sims/kit.uz.js';
import fluids from '../sims/fluids.uz.js';
import thermo from '../sims/thermo.uz.js';
import elec from '../sims/elec.uz.js';
import optics from '../sims/optics.uz.js';
import lab from '../lab/uz.js';

export default {
  decimalMark: ',',
  // Labels of parameters that many simulations declare the same way (a sim's own text wins).
  params: { g: 'Erkin tuşiş tezlanişi' },
  kit, fluids, thermo, elec, optics, lab,
};

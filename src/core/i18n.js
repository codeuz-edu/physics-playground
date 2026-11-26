/**
 * The active language. One page shows one language, so this is module state: the loader in
 * sims/load.js sets it before a simulation is used, and shared helpers read it when they run.
 * `common` is the shared dictionary for that language (src/text/<locale>.js).
 */
let active = { locale: 'uz', common: {} };

export function setLocale(locale, common) {
  active = { locale, common: common || {} };
}
export const locale = () => active.locale;
export const common = () => active.common;
/** Decimal separator of the active language: a comma in Uzbek, a point in English. */
export const decimalMark = () => active.common.decimalMark ?? ',';

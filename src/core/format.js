import { decimalMark } from './i18n.js';

/**
 * Numbers as the active language prints them (Uzbek textbooks use a decimal comma: 9,81 m/s²),
 * and never "-0,00". Only for text people read; URLs and the maths keep JavaScript's dot.
 */
export function num(v, decimals) {
  return (Math.abs(v) < 0.5 * 10 ** -decimals ? 0 : v).toFixed(decimals).replace('.', decimalMark());
}

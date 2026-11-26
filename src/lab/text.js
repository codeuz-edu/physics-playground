import uz from './uz.js';

/**
 * The lab's interface text by language. The lab needs it before a simulation (and with it the shared
 * dictionary, common().lab) has loaded: for the loading and failure states. Same object as common().lab.
 */
const TEXT = { uz };

export const labText = (locale) => TEXT[locale] || TEXT.uz;

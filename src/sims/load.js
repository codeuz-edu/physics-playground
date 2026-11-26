import { setLocale } from '../core/i18n.js';

/**
 * Loads one simulation in one language.
 *
 * A simulation is two files: sims/<id>/index.js is the language-neutral definition (parameters,
 * model, drawing) and sims/<id>/<locale>.js is its text. This joins them into the object the lab
 * works with: every parameter, toggle, readout, graph and preset gets its label, and the whole
 * text object is attached as `text` for the model's messages and the drawing's captions.
 */
const COMMON = { uz: () => import('../text/uz.js') };
const TEXT = { uz: (id) => import(`./${id}/uz.js`) };

export const locales = Object.keys(COMMON);

export async function loadSim(id, locale = 'uz') {
  if (!COMMON[locale]) locale = 'uz';
  const [mod, common] = await Promise.all([import(`./${id}/index.js`), COMMON[locale]()]);
  setLocale(locale, common.default);
  if (!mod.default) throw new Error(`sims/${id}/index.js has no default export`);
  const text = (await TEXT[locale](id)).default;
  return localize(mod.default, text, common.default);
}

export function localize(def, text, common = {}) {
  const unit = (x) => text.units?.[x.key] ?? x.unit;
  const entry = (group, key) => text[group]?.[key] ?? common[group]?.[key];
  const out = { ...def, text };
  out.params = def.params.map((p) => {
    const t = entry('params', p.key);
    const o = { ...p, label: typeof t === 'object' ? t.label : t, unit: unit(p) };
    // A symbol whose subscript abbreviates a word (a letter for "static" or "sliding") can be replaced per language.
    if (text.symbols?.[p.key] !== undefined) o.symbol = text.symbols[p.key];
    if (typeof t === 'object' && t.options && p.options) o.options = p.options.map((opt, i) => (typeof opt === 'object' ? { ...opt, label: t.options[i] } : t.options[i]));
    return o;
  });
  out.toggles = (def.toggles || []).map((t) => ({ ...t, label: entry('toggles', t.key) }));
  out.readouts = (def.readouts || []).map((r) => ({ ...r, label: entry('readouts', r.key), unit: unit(r) }));
  out.graphs = (def.graphs || []).map((g) => {
    const t = text.graphs?.[g.id] || {};
    const o = { ...g, title: t.title, series: g.series.map((s) => ({ ...s, label: t.series?.[s.key] })) };
    if (t.yLabel !== undefined) o.yLabel = t.yLabel;
    if (t.unit !== undefined) o.unit = t.unit;
    return o;
  });
  out.presets = (def.presets || []).map((p, i) => ({ ...p, name: text.presets?.[i] }));
  if (def.drag) out.drag = { ...def.drag, hint: text.dragHint };
  for (const k of ['timeUnit', 'lengthUnit']) if (text[k] !== undefined) out[k] = text[k];
  return out;
}

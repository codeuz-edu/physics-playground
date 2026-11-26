<script setup>
// The lab's settings panel: presets, parameters (slider + number box, or a menu), what the stage shows,
// and the keyboard hints. Part of SimLab.vue; every change goes to the controller (`lab`), which
// sends the new values back through SimLab's `ui`.
import { computed } from 'vue'
import { formatValue, sanitize, decimalsFor } from '../../../src/core/params.js'
import { num } from '../../../src/core/format.js'
import { PLANETS } from '../../../src/lab/controller.js'

const props = defineProps({
 def: { type: Object, required: true },
 ui: { type: Object, required: true },
 lab: { type: Object, default: null },
 T: { type: Object, required: true },
 uid: { type: String, required: true },
 full: { type: Boolean, default: false } // the lab fills the window: the panel is a card that can be closed
})
const emit = defineEmits(['toast', 'close'])

const tok = (c) => (c ? `var(${c}, var(--lab-text))` : 'var(--lab-text)')
// g in m/s² without its own menu gets a menu of planets.
const planetMenu = (s) => s.key === 'g' && /m\/s²/.test(s.unit) && !s.options
const isMenu = (s) => !!s.options || planetMenu(s)
function menuOptions(s) {
 let opts
 if (s.options) opts = s.options.map((o, i) => ({ value: String(sanitize(s, s.min + i * s.step).value), label: typeof o === 'object' ? o.label : o }))
 else opts = PLANETS.filter((pl) => pl.g >= s.min && pl.g <= s.max).map((pl) => ({ value: String(pl.g), label: `${props.T.planets[pl.key]} — ${num(pl.g, 2)} m/s²` }))
 // A value that is not on the menu (a preset, a worked problem, a link) is shown as itself.
 const v = props.ui.values[s.key]
 if (v !== undefined && !opts.some((o) => o.value === String(v))) opts.push({ value: String(v), label: `${num(v, decimalsFor(s))} ${s.unit}` })
 return opts
}
const toggles = computed(() => [...props.def.toggles, ...(props.def.noTape ? [] : [{ key: '__tape', label: props.T.tape }])])
const shown = (s) => props.ui.drafts[s.key] ?? (props.ui.values[s.key] === undefined ? '' : formatValue(s, props.ui.values[s.key]))

function commit(s, e) {
 if (props.ui.drafts[s.key] === undefined) return
 props.lab.onParam(s.key, e.target.value)
 delete props.ui.drafts[s.key]
}
function onKey(s, e) {
 if (e.key === 'Enter') { e.preventDefault(); e.target.blur() }
 else if (e.key === 'Escape') delete props.ui.drafts[s.key]
 else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
  e.preventDefault()
  delete props.ui.drafts[s.key]
  props.lab.onParam(s.key, props.lab.p[s.key] + (e.key === 'ArrowUp' ? 1 : -1) * s.step * (e.shiftKey ? 10 : 1), true)
 }
}
function pickPreset(e) {
 const val = e.target.value
 if (val === '') { props.lab.clearPreset(); return }
 const pr = props.def.presets[Number(val)]
 props.lab.pickPreset(Number(val))
 if (pr) emit('toast', props.T.presetLoaded(pr.name))
}
</script>

<template>
 <aside class="lab-panel" :aria-label="T.settings">
  <i class="corner tl" /><i class="corner tr" /><i class="corner bl" /><i class="corner br" />
  <div class="lab-panel-head">
   <span>{{ T.settings }}</span>
   <button v-if="full" type="button" class="lab-btn lab-btn-ghost lab-btn-icon lab-panel-close" :aria-label="T.close" :title="T.close" @click="emit('close')">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
   </button>
  </div>
  <div class="lab-panel-body">
   <section v-if="def.presets.length" class="lab-sec lab-presets">
    <label :for="`${uid}-preset`" class="lab-sec-title">{{ T.presets }}</label>
    <select :id="`${uid}-preset`" class="lab-input lab-select" :value="ui.preset" @change="pickPreset">
     <option value="">{{ T.presetPick }}</option>
     <option v-for="(pr, i) in def.presets" :key="i" :value="String(i)">{{ pr.name }}</option>
    </select>
   </section>

   <section class="lab-sec lab-params">
    <div class="lab-sec-title">{{ T.params }}</div>
    <div v-for="s in def.params" :key="s.key" class="lab-param">
     <div class="lab-param-head">
      <label :for="`${uid}-p-${s.key}`" class="lab-param-label"><span class="lab-param-name">{{ s.label }}</span><span class="lab-sym lab-param-sym" :style="{ color: tok(s.color) }">{{ s.symbol }}</span></label>
      <span class="lab-tag" :class="s.kind === 'initial' ? 'is-neutral' : 'is-outline'" :title="s.kind === 'initial' ? T.tagRestartTitle : T.tagLiveTitle">{{ s.kind === 'initial' ? T.tagRestart : T.tagLive }}</span>
     </div>
     <select v-if="isMenu(s)" :id="`${uid}-p-${s.key}`" class="lab-input lab-select" :value="String(ui.values[s.key])" @change="lab.onParam(s.key, Number($event.target.value))">
      <option v-for="o in menuOptions(s)" :key="o.value" :value="o.value">{{ o.label }}</option>
     </select>
     <div v-else class="lab-slider">
      <input type="range" :min="s.min" :max="s.max" :step="s.step" :value="ui.values[s.key]" :aria-label="s.label" @input="lab.onParam(s.key, Number($event.target.value), true)">
      <span class="lab-numbox">
       <input
        :id="`${uid}-p-${s.key}`" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" :value="shown(s)"
        @input="ui.drafts[s.key] = $event.target.value" @blur="commit(s, $event)" @keydown="onKey(s, $event)"
       >
       <span class="lab-unit">{{ s.unit }}</span>
      </span>
     </div>
    </div>
   </section>

   <section v-if="toggles.length" class="lab-sec lab-toggles">
    <div class="lab-sec-title">{{ T.show }}</div>
    <label v-for="t in toggles" :key="t.key" class="lab-check"><input type="checkbox" :checked="!!ui.tg[t.key]" @change="lab.setToggle(t.key, $event.target.checked)">{{ t.label }}</label>
    <button v-if="def.showsPrevious" type="button" class="lab-btn lab-btn-small" :disabled="!ui.hasPrev" @click="lab.clearPrev()">
     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
     {{ T.clearPrev }}
    </button>
   </section>

   <section class="lab-sec lab-hints">
    <div class="lab-keys">
     <span v-for="[k, what] in T.keys" :key="k"><kbd>{{ k }}</kbd>{{ what }}</span>
    </div>
   </section>
  </div>
 </aside>
</template>

<script setup>
// A worked problem. The slot holds the solution; the button loads the problem's values into the
// simulation at the top of the page and runs it, so the answer can be checked by experiment.
// The lab listens for the `physics-sim:load` event on `window`.
import { useData } from 'vitepress'
const props = defineProps({
 values: { type: Object, required: true },   // parameter values of the problem, by parameter key
 check: { type: String, default: '' }        // what the simulation shows at the end of this run
})
const { lang } = useData()
const label = { uz: 'Simulyatsiyada tekşiriş', en: 'Check in the simulation' }
const expect = { uz: 'Simulyatsiya körsatadi:', en: 'The simulation shows:' }
function load() {
 window.dispatchEvent(new CustomEvent('physics-sim:load', { detail: { values: props.values, run: true } }))
}
</script>

<template>
 <div class="sim-example">
  <slot />
  <p v-if="check" class="sim-example-check"><strong>{{ expect[lang] || expect.uz }}</strong> {{ check }}</p>
  <button type="button" class="sim-example-run" @click="load">{{ label[lang] || label.uz }}</button>
 </div>
</template>

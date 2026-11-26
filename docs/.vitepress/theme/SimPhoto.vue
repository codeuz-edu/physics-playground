<script setup>
// A lesson photo: docs/public/photos/<name>.jpg, shown from the smaller AVIF copies that
// scripts/build-photos.mjs makes in photos/sized/ (the JPEG itself is the fallback).
// `credit` may contain links (author, licence, source), so it is rendered as HTML.
import { computed } from 'vue'
import { withBase } from 'vitepress'
const props = defineProps({
 name: { type: String, required: true },      // file name without extension, e.g. "seesaw"
 width: { type: Number, required: true },     // intrinsic size of the original JPEG
 height: { type: Number, required: true },
 alt: { type: String, default: '' },
 caption: { type: String, default: '' },
 credit: { type: String, default: '' },
 // CSS width the photo takes on a wide screen: 720 alone, about 350 beside another photo, 380 for a
 // portrait one. The browser uses it to pick the smallest copy that is still sharp.
 displayWidth: { type: Number, default: 720 }
})
// The same rule as scripts/build-photos.mjs: 640 always, 800 from 800 px, 1200 above 900 px.
const widths = computed(() => [640, ...(props.width >= 800 ? [800] : []), ...(props.width > 900 ? [1200] : [])])
// How wide the photo is laid out (lesson.css): the text column is 720 px from an 800 px window; below
// that it is the window less 48 px of page padding; two photos sit side by side from 552 px.
const sizes = computed(() => `(min-width: 800px) ${props.displayWidth}px, (min-width: 552px) min(${props.displayWidth}px, calc(100vw - 48px)), calc(100vw - 48px)`)
const srcset = computed(() => widths.value.map(w => `${withBase(`/photos/sized/${props.name}-${w}.avif`)} ${Math.min(w, props.width)}w`).join(', '))
</script>

<template>
 <figure class="sim-photo">
  <picture>
   <source type="image/avif" :srcset="srcset" :sizes="sizes">
   <img :src="withBase(`/photos/${name}.jpg`)" :alt="alt" :width="width" :height="height" loading="lazy" decoding="async">
  </picture>
  <!-- A caption with formulas is written as Markdown inside the tag; a plain one uses the `caption` prop. -->
  <figcaption><slot>{{ caption }}</slot> <small v-if="credit" v-html="credit" /></figcaption>
 </figure>
</template>

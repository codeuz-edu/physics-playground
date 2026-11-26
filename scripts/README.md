# scripts/

Build helpers that are not part of the site. Run them from the repository root.

| Command | What it does |
|---|---|
| `npm run photos` | Runs `build-photos.mjs` (also run by `npm run dev` and `npm run build`). For each `docs/public/photos/<name>.jpg` it writes `<name>-640.avif` into `docs/public/photos/sized/`, `<name>-800.avif` when the original is at least 800 px wide, and `<name>-1200.avif` when it is wider than 900 px (sharp, AVIF q50, never upscaled). That folder is generated and not in git. A copy is skipped while its original's content and the encoding settings are unchanged (recorded in `sized/manifest.json`), which is what lets the CI workflows reuse the folder from their cache; `npm run photos -- --force` re-encodes all of them. Copies whose original is gone are removed. The JPEGs are only read. |

`theme/SimPhoto.vue` builds the `srcset` from the same rule, so after adding a photo run `npm run photos` and
pass the JPEG's width and height to `<SimPhoto>` in the lesson.

## Size budgets

`npm run budget` runs `check-budget.mjs` on the built site (`npm run build` first). It checks the number and
total size of font files, the size of the stylesheet and of the theme script, that every photo at least 800 px
wide has its 800 px copies, and that all 73 simulation pages were built. It exits with code 1 when a budget is
exceeded. The limits are at the top of the script; raise one only on purpose, in the change that needs it.

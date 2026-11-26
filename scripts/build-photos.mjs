// scripts/build-photos.mjs: smaller AVIF copies of the lesson photos, so that a phone does not
// download a photo three times larger than its screen.
//
// A photo is one file, docs/public/photos/<name>.jpg; that folder holds nothing else of yours. For
// every such file (only read, never changed) this writes into docs/public/photos/sized/, which is
// generated and not in git:
//   <name>-640.avif       always
//   <name>-800.avif       only when the original is at least 800 px wide
//   <name>-1200.avif      only when the original is wider than 900 px
// Copies are never upscaled: a "-1200" file made from a 1000 px original is 1000 px wide.
// theme/SimPhoto.vue builds the srcset from the same rule (640, 800 from 800 px, 1200 above 900 px), and a lesson
// passes the original's width and height to <SimPhoto>, so no manifest is needed. A browser that
// cannot read AVIF (before 2023) shows the JPEG itself.
//
// Run by `npm run dev` and `npm run build`. A copy is kept while its original's content and the
// encoding settings are unchanged (sized/manifest.json records both), so only a new or replaced
// photo costs time; `npm run photos -- --force` re-encodes all of them. Copies whose original is
// gone are removed. The check is by content, not by file date, so that the CI workflows can restore
// sized/ from their cache after a fresh checkout and skip the encoding.

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PHOTOS = path.join(ROOT, 'docs', 'public', 'photos');
const SIZED = path.join(PHOTOS, 'sized');

const SMALL = 640;
const MEDIUM = 800; // what a phone needs: about 410 CSS px wide at 1.75 to 2 device pixels each
const MEDIUM_IF_AT_LEAST = 800;
const LARGE = 1200;
const LARGE_IF_WIDER_THAN = 900;
const FORMATS = {
  // Effort 4 of 9: nearly three times faster than 6 for files under 2 % larger.
  avif: (img) => img.avif({ quality: 50, effort: 4, chromaSubsampling: '4:2:0' }),
};
// What a copy depends on besides its original: change this when the sizes or the encoding change.
const SETTINGS = 'avif q50 e4 420; 640, 800 from 800, 1200 above 900';
const COPY_RE = /^(.+)-(\d+)\.avif$/;
const force = process.argv.includes('--force');

const exists = (file) => fs.access(file).then(() => true, () => false);
const MANIFEST = path.join(SIZED, 'manifest.json');
/** What each photo's copies were made from: { "<name>": "<hash of the original and the settings>" }. */
const made = await fs.readFile(MANIFEST, 'utf8').then(JSON.parse, () => ({}));
const next = {};

const kb = (n) => (n / 1000).toFixed(1).padStart(8) + ' KB';

const names = (await fs.readdir(PHOTOS)).filter((f) => /\.jpe?g$/i.test(f)).sort();
if (!names.length) throw new Error(`no JPEGs in ${PHOTOS}`);

await fs.mkdir(SIZED, { recursive: true });
const expected = new Set();
const totals = { jpg: 0 }; // bytes per "<format>-<suffix>"
const counts = {};
let encoded = 0;

for (const file of names) {
  const src = path.join(PHOTOS, file);
  const base = file.replace(/\.jpe?g$/i, '');
  const meta = await sharp(src).metadata();
  // EXIF orientation 5-8 means the browser shows the image turned by 90°.
  const width = (meta.orientation ?? 1) >= 5 ? meta.height : meta.width;
  totals.jpg += (await fs.stat(src)).size;

  const suffixes = [SMALL, ...(width >= MEDIUM_IF_AT_LEAST ? [MEDIUM] : []), ...(width > LARGE_IF_WIDER_THAN ? [LARGE] : [])];
  const stamp = crypto.createHash('sha256').update(await fs.readFile(src)).update(SETTINGS).digest('hex').slice(0, 20);
  next[base] = stamp;
  for (const suffix of suffixes) {
    const px = Math.min(suffix, width);
    for (const [fmt, encode] of Object.entries(FORMATS)) {
      const out = path.join(SIZED, `${base}-${suffix}.${fmt}`);
      expected.add(out);
      if (force || made[base] !== stamp || !(await exists(out))) {
        // .rotate() with no argument applies the EXIF orientation; metadata is not copied.
        const img = sharp(src).rotate().resize({ width: px, withoutEnlargement: true });
        const info = await encode(img).toFile(out);
        if (info.width !== px) throw new Error(`${out}: expected ${px} px wide, got ${info.width}`);
        encoded++;
      }
      const key = `${fmt}-${suffix}`;
      totals[key] = (totals[key] ?? 0) + (await fs.stat(out)).size;
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }
}

// Remove copies whose original is gone or which are no longer wanted (never touches a JPEG).
for (const f of await fs.readdir(SIZED)) {
  const p = path.join(SIZED, f);
  if (COPY_RE.test(f) && !expected.has(p)) {
    await fs.rm(p);
    console.log(`removed ${path.relative(ROOT, p)}`);
  }
}

await fs.writeFile(MANIFEST, JSON.stringify(next, null, 1) + '\n');
if (!encoded) {
  console.log('photos: up to date');
  process.exit(0);
}
console.log(`photos: ${names.length} originals, ${encoded} copies encoded${force ? ' (--force)' : ''}`);
console.log(`  original JPEG          ${String(names.length).padStart(3)} files ${kb(totals.jpg)}`);
for (const fmt of Object.keys(FORMATS)) {
  for (const suffix of [SMALL, MEDIUM, LARGE]) {
    const key = `${fmt}-${suffix}`;
    if (counts[key]) console.log(`  ${(fmt + ' ' + suffix).padEnd(22)} ${String(counts[key]).padStart(3)} files ${kb(totals[key])}`);
  }
}

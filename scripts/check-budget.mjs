// scripts/check-budget.mjs — checks the built site (dist/) against size budgets, so that a change
// which makes every visitor download more does not go unnoticed. Run `npm run build` first, then
// `npm run budget`. It prints one line per budget and exits with code 1 when any is exceeded.
//
// The limits were set from the built site as measured on 2026-11-25 (fonts 118.8 KB, theme script
// 53.0 KB gzipped, largest 800 px photo 85.7 KB), each with some room. Raise one only on purpose, in
// the same change that needs it, and say why in that change.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Another built folder can be checked by giving its path: node scripts/check-budget.mjs <dir>
const DIST = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'dist');
// One page per simulation listed in course.json.
const SIMS = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/.vitepress/course.json'), 'utf8')).flatMap((c) => c.sims).length;

const BUDGET = {
  fontFiles: 12,           // .woff2 files in assets/: exactly this many (6 faces x latin and latin-ext)
  fontBytes: 130_000,      // their total size (118.8 KB with hinting kept; room for new letters in lessons)
  legacyFontFiles: 0,      // .woff files: every supported browser reads .woff2
  vietnameseFontFiles: 0,  // the site has no Vietnamese text
  cssGzip: 28_000,         // assets/style.*.css, gzip
  themeGzip: 55_000,       // assets/chunks/theme.*.js, gzip level 6 (53.0 KB when the budget was set)
  photo800Bytes: 95_000,   // the largest photos/sized/*-800.avif
};
const PHOTO_MID = 800;     // a photo at least this wide must have an 800 px copy

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found: run `npm run build` first.');
  process.exit(1);
}

const list = (dir, test) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => test.test(f)).map((f) => path.join(dir, f)) : []);
const size = (file) => fs.statSync(file).size;
const gzip = (files) => files.reduce((n, f) => n + zlib.gzipSync(fs.readFileSync(f), { level: 6 }).length, 0);
const kb = (n) => `${(n / 1000).toFixed(1)} KB`;

const assets = path.join(DIST, 'assets');
const woff2 = list(assets, /\.woff2$/);
const woff = list(assets, /\.woff$/);
const vietnamese = list(assets, /vietnamese/);
const css = list(assets, /^style\..*\.css$/);
const theme = list(path.join(assets, 'chunks'), /^theme\..*\.js$/);
const photos = path.join(DIST, 'photos');
const originals = list(photos, /^(?!.*-\d+\.)[^/]*\.jpg$/);
const sized = path.join(photos, 'sized');
const mids = list(sized, new RegExp(`-${PHOTO_MID}\\.avif$`));
const simPages = list(path.join(DIST, 'sims'), /\.html$/);

// Every original wide enough must have its 800 px copy.
const missing = [];
for (const file of originals) {
  const { width } = await sharp(file).metadata();
  if (width < PHOTO_MID) continue;
  const copy = path.join(sized, path.basename(file).replace(/\.jpg$/, `-${PHOTO_MID}.avif`));
  if (!fs.existsSync(copy)) missing.push(path.basename(copy));
}

const results = [];
const atMost = (key, value, limit, show = String) => results.push({ key, ok: value <= limit, text: `${show(value)} (limit ${show(limit)})` });
results.push({ key: 'fonts.woff2.count', ok: woff2.length === BUDGET.fontFiles, text: `${woff2.length} (must be ${BUDGET.fontFiles})` });
atMost('fonts.woff2.bytes', woff2.reduce((n, f) => n + size(f), 0), BUDGET.fontBytes, kb);
atMost('fonts.woff.count', woff.length, BUDGET.legacyFontFiles);
atMost('fonts.vietnamese', vietnamese.length, BUDGET.vietnameseFontFiles);
results.push(css.length ? { key: 'css.gzip', ok: gzip(css) <= BUDGET.cssGzip, text: `${kb(gzip(css))} (limit ${kb(BUDGET.cssGzip)})` } : { key: 'css.gzip', ok: false, text: 'assets/style.*.css not found' });
results.push(theme.length ? { key: 'theme.gzip', ok: gzip(theme) <= BUDGET.themeGzip, text: `${kb(gzip(theme))} (limit ${kb(BUDGET.themeGzip)})` } : { key: 'theme.gzip', ok: false, text: 'assets/chunks/theme.*.js not found' });
results.push({ key: 'photos.800', ok: originals.length > 0 && missing.length === 0, text: originals.length === 0 ? 'no photos found in dist/photos' : missing.length ? `${missing.length} copies missing, e.g. ${missing.slice(0, 3).join(', ')}` : `all present (${mids.length} photos have an ${PHOTO_MID} px copy)` });
results.push(mids.length ? { key: 'photos.800.max', ok: Math.max(...mids.map(size)) <= BUDGET.photo800Bytes, text: `${kb(Math.max(...mids.map(size)))} (limit ${kb(BUDGET.photo800Bytes)})` } : { key: 'photos.800.max', ok: false, text: `no *-${PHOTO_MID}.avif files` });
results.push({ key: 'pages.sims', ok: simPages.length === SIMS, text: `${simPages.length} (must be ${SIMS}, the simulations in course.json)` });

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.key.padEnd(20)} ${r.text}`);
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} of ${results.length} budgets failed.` : `\nAll ${results.length} budgets met.`);
process.exit(failed ? 1 : 0);

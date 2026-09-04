// Normalise every product photo to a uniform square canvas so the shop grid
// aligns: flatten to white, trim the surrounding white border, pad the subject
// to a centred square with a consistent margin, output 1000x1000 webp.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const DIR = 'public/images/products';
const SIZE = 1000;
const MARGIN = 0.06; // fraction of the subject's longest side added on every edge

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
let files = fs.readdirSync(DIR).filter((f) => f.endsWith('.webp'));
if (only.length) files = files.filter((f) => only.includes(f.replace(/\.webp$/, '')));

let done = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  const src = fs.readFileSync(p);
  try {
    const flat = await sharp(src).flatten({ background: '#ffffff' }).toBuffer();

    // Trim the white border; fall back to the flat image if trim over-crops.
    let subject = flat;
    try {
      const trimmed = await sharp(flat).trim({ background: '#ffffff', threshold: 14 }).toBuffer();
      const tm = await sharp(trimmed).metadata();
      const fm = await sharp(flat).metadata();
      if (tm.width >= fm.width * 0.15 && tm.height >= fm.height * 0.15) subject = trimmed;
    } catch {
      /* keep flat */
    }

    const m = await sharp(subject).metadata();
    const side = Math.max(m.width, m.height);
    const pad = Math.round(side * MARGIN);
    const canvas = side + pad * 2;
    const left = Math.round((canvas - m.width) / 2);
    const top = Math.round((canvas - m.height) / 2);

    // Pad the subject onto a centred white square (separate pipeline — sharp
    // applies extend AFTER resize within one chain, so they must not be mixed).
    const squared = await sharp(subject)
      .extend({
        top,
        bottom: canvas - m.height - top,
        left,
        right: canvas - m.width - left,
        background: '#ffffff',
      })
      .toBuffer();

    await sharp(squared)
      .resize(SIZE, SIZE, { fit: 'fill' })
      .webp({ quality: 84 })
      .toFile(p + '.tmp');
    fs.renameSync(p + '.tmp', p);
    done++;
  } catch (e) {
    console.log('SKIP ' + f + ' — ' + e.message);
  }
}
console.log(`normalised ${done}/${files.length} images`);

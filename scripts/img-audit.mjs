import { PRODUCTS } from '../src/config/site.js';
import fs from 'node:fs';
import path from 'node:path';

const pub = path.join(process.cwd(), 'public');
const missing = [];
for (const p of PRODUCTS) {
  const img = p.images?.[0] || '';
  let ok = false;
  let reason = '';
  if (!img) reason = 'no image field';
  else if (/^https?:\/\//i.test(img)) reason = 'placeholder (remote)';
  else if (fs.existsSync(path.join(pub, img.replace(/^\//, '')))) ok = true;
  else reason = 'file missing: ' + img;
  if (!ok) missing.push({ name: p.name, category: p.category, brand: p.brandName || p.brand || '', reason });
}
missing.sort((a, b) => (a.category + a.name).localeCompare(b.category + b.name));
console.log(`Total products: ${PRODUCTS.length}  |  Without real images: ${missing.length}`);
let cat = '';
for (const m of missing) {
  if (m.category !== cat) { cat = m.category; console.log(`\n### ${cat}`); }
  console.log(`- ${m.name}  [${m.brand}]`);
}

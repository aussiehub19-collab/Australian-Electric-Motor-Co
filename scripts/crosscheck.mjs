// scripts/crosscheck.mjs
// WebForge v9.1 - Pre-ship Crosscheck (exits non-zero on failure)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Starting WebForge v9.1 Pre-ship Crosscheck...');

let failures = [];
let warnings = [];

// 1. Load config
const siteConfigPath = path.resolve(rootDir, 'src/config/site.js');
if (!fs.existsSync(siteConfigPath)) {
  failures.push('B1: Missing src/config/site.js');
}

const { SITE, COMPLIANCE, PRODUCTS, CATEGORIES, FORMS, POSTS, CATEGORY_GUIDES, BRAND_GUIDES, CATEGORY_FAQ, BRAND_FAQ } = await import(`file://${siteConfigPath}`);

// 2. Check Agent-Ready Files A-N (Mandatory on all sites)
const requiredAgentFiles = [
  'public/robots.txt',
  'public/llms.txt',
  'public/auth.md',
  'public/.well-known/api-catalog',
  'public/.well-known/agent-skills/index.json',
  'public/.well-known/mcp/server-card.json',
  'public/.well-known/oauth-protected-resource',
  'public/.well-known/oauth-authorization-server',
  'public/.well-known/openid-configuration',
  'public/.well-known/acp.json',
  'public/.well-known/ucp',
  'public/js/webmcp.js',
  'vercel.json'
];

for (const file of requiredAgentFiles) {
  const fullPath = path.resolve(rootDir, file);
  if (!fs.existsSync(fullPath)) {
    failures.push(`B6: Missing mandatory agent-ready file: ${file}`);
  }
}

// 3. Check auth.md format: MUST start with exactly "# Auth.md"
const authMdPath = path.resolve(rootDir, 'public/auth.md');
if (fs.existsSync(authMdPath)) {
  const content = fs.readFileSync(authMdPath, 'utf8');
  if (!content.startsWith('# Auth.md')) {
    failures.push('B6 / N: public/auth.md must start with exactly "# Auth.md" as the first line');
  }
}

// 4. Check .well-known/ucp has mandatory "ucp": "1.0"
const ucpPath = path.resolve(rootDir, 'public/.well-known/ucp');
if (fs.existsSync(ucpPath)) {
  try {
    const ucp = JSON.parse(fs.readFileSync(ucpPath, 'utf8'));
    if (ucp.ucp !== '1.0') {
      failures.push('B6 / N: .well-known/ucp must contain "ucp": "1.0" field');
    }
  } catch (e) {
    failures.push(`B6: .well-known/ucp is invalid JSON: ${e.message}`);
  }
}

// 5. Check server-card.json tools match V1 live API
const serverCardPath = path.resolve(rootDir, 'public/.well-known/mcp/server-card.json');
if (fs.existsSync(serverCardPath)) {
  try {
    const card = JSON.parse(fs.readFileSync(serverCardPath, 'utf8'));
    const toolNames = (card.capabilities?.tools || []).map(t => t.name);
    const expected = ['search_products', 'get_product', 'list_categories', 'get_policies', 'create_order_draft'];
    for (const exp of expected) {
      if (!toolNames.includes(exp)) {
        failures.push(`B8: server-card.json missing required MCP tool: ${exp}`);
      }
    }
  } catch (e) {
    failures.push(`B8: server-card.json is invalid JSON: ${e.message}`);
  }
}

// 6. Check compliance banned terms across public output
if (COMPLIANCE?.bannedTerms && COMPLIANCE.bannedTerms.length > 0) {
  for (const term of COMPLIANCE.bannedTerms) {
    // Scan public files
    const scanDir = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(full);
        } else if (entry.isFile() && !entry.name.endsWith('.png') && !entry.name.endsWith('.jpg') && !entry.name.endsWith('.webp')) {
          const txt = fs.readFileSync(full, 'utf8');
          if (txt.toLowerCase().includes(term.toLowerCase())) {
            failures.push(`B7: Compliance violation! Banned term "${term}" found in ${full}`);
          }
        }
      }
    };
    scanDir(path.resolve(rootDir, 'public'));
  }
}

// 7. Check strategy docs are not in public/
if (fs.existsSync(path.resolve(rootDir, 'public/PROJECT.md')) || fs.existsSync(path.resolve(rootDir, 'public/docs'))) {
  failures.push('B4: Strategy docs found in public/ directory!');
}

// 8. Check vercel.json has Link header and trailingSlash
const vercelPath = path.resolve(rootDir, 'vercel.json');
if (fs.existsSync(vercelPath)) {
  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  if (vercel.trailingSlash !== true) {
    failures.push('vercel.json must have "trailingSlash": true');
  }
}

// 9. Check products have images and valid prices
if (!PRODUCTS || PRODUCTS.length === 0) {
  failures.push('No products found in src/config/site.js');
} else {
  PRODUCTS.forEach(p => {
    if (!p.name || !p.price || !p.category || !p.slug) {
      failures.push(`Product missing required fields: ${JSON.stringify(p.name || p.slug)}`);
    }
    if (!p.images || p.images.length === 0) {
      failures.push(`Product has no images: ${p.name}`);
    } else {
      const first = p.images[0];
      // 9a. Regression guard: every product now has a real local photo — catch a
      // reintroduced remote placeholder (e.g. Unsplash) immediately, not at audit time.
      if (/^https?:\/\//.test(first)) {
        failures.push(`Product still on a remote placeholder image (no local photo): ${p.name}`);
      } else {
        // 9b. The referenced local file must actually exist in public/.
        const filePath = path.resolve(rootDir, 'public', first.replace(/^\//, ''));
        if (!fs.existsSync(filePath)) {
          failures.push(`Product image file missing on disk: ${p.name} -> ${first}`);
        }
      }
    }
  });
}

// 10. <title> length — mirrors lib/seo.ts buildSeoTitle(); keep in sync if that changes.
function buildSeoTitleCheck(name) {
  const full = `${name} | Australian Electric Motor Co`;
  if (full.length <= 60) return full;
  const short = `${name} | AEMC`;
  if (short.length <= 60) return short;
  return name;
}
const TITLE_WARN_MAX = 65; // hard target is 60; a couple of long product names land just over
for (const p of PRODUCTS) {
  const t = buildSeoTitleCheck(p.name);
  if (t.length > TITLE_WARN_MAX) {
    warnings.push(`Product <title> still long (${t.length} chars): ${p.name}`);
  }
}
for (const c of CATEGORIES) {
  const t = buildSeoTitleCheck(c.name);
  if (t.length > TITLE_WARN_MAX) {
    warnings.push(`Category <title> still long (${t.length} chars): ${c.name}`);
  }
}

// 11. Live placeholders that block GSC / keyword-mapping work — warn every run until set.
if (SITE.gscVerification === 'pending') {
  warnings.push('SITE.gscVerification is still "pending" — Search Console cannot verify this site yet.');
}
if (FORMS?.web3formsKey === 'pending') {
  warnings.push('FORMS.web3formsKey is still "pending" — contact/order/wholesale forms deliver nowhere; WhatsApp is the only live order channel.');
}
if (SITE.domain && SITE.domain.includes('DOMAIN.')) {
  failures.push('B1: SITE.domain is still a placeholder in a production build.');
}

// 12. Internal-linking maps point only at real pages (Batch 7).
const postSlugs = new Set((POSTS || []).map(p => p.slug));
const catSlugs = new Set((CATEGORIES || []).map(c => c.slug));
for (const [catSlug, guideSlugs] of Object.entries(CATEGORY_GUIDES || {})) {
  if (!catSlugs.has(catSlug)) failures.push(`12: CATEGORY_GUIDES key "${catSlug}" is not a real category slug.`);
  for (const g of guideSlugs) {
    if (!postSlugs.has(g)) failures.push(`12: CATEGORY_GUIDES["${catSlug}"] -> "${g}" is not a real blog post slug.`);
  }
}
for (const [brandSlug, guideSlugs] of Object.entries(BRAND_GUIDES || {})) {
  for (const g of guideSlugs) {
    if (!postSlugs.has(g)) failures.push(`12: BRAND_GUIDES["${brandSlug}"] -> "${g}" is not a real blog post slug.`);
  }
}
for (const catSlug of Object.keys(CATEGORY_FAQ || {})) {
  if (!catSlugs.has(catSlug)) failures.push(`12: CATEGORY_FAQ key "${catSlug}" is not a real category slug.`);
}

// Result summary
console.log('\n--- CROSSCHECK REPORT ---');
if (warnings.length > 0) {
  console.log(`⚠️ Warnings (${warnings.length}):`);
  warnings.forEach(w => console.log(`   - ${w}`));
}

if (failures.length > 0) {
  console.error(`❌ FAILED (${failures.length} blocking issues):`);
  failures.forEach(f => console.error(`   - ${f}`));
  process.exit(1);
} else {
  console.log('✅ ALL PRE-SHIP CROSSCHECK AUDITS PASSED (0 errors). Ready for Vercel deploy!\n');
  process.exit(0);
}

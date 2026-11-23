#!/usr/bin/env node
// Local-link and accessibility smoke test for the Chinese website rollout.
// GitHub Pages has a second, independently deployed project at /funtasia-audio/.
// References to that legacy project are tracked separately; they are not local files.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const pages = [
  'index.html',
  'catalog/zh-cn/index.html',
  'catalog/zh-cn/fun-monofilter.html',
  'quality/zh-cn/index.html',
  'about/zh-cn/index.html',
  'support/zh-cn/index.html',
  'records/zh-cn/index.html',
  'utilities/index.html',
  'goods/index.html',
  'studio/index.html',
  'studio/official/zh-cn/index.html',
  'studio/official/expansions/zh-cn/index.html',
  'studio/official/zh-cn/study/index.html',
];
const host = 'https://funtasiaaudio.github.io';
const errors = [];
let checked = 0;
let legacyLinks = 0;
let images = 0;
function report(page, problem) { errors.push(`${page}: ${problem}`); }
for (const page of pages) {
  if (!fs.existsSync(page)) { report(page, 'missing page'); continue; }
  const html = fs.readFileSync(page, 'utf8');
  const base = new URL('/' + page, host);
  const isChinese = page.includes('/zh-cn/');
  if (isChinese && !/<html[^>]*lang="zh-CN"/.test(html)) report(page, 'missing html[lang=zh-CN]');
  if (isChinese && !/<link[^>]*rel="canonical"/.test(html)) report(page, 'missing canonical');
  if (isChinese && !/<meta[^>]*name="description"/.test(html)) report(page, 'missing description');

  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  const namedAnchors = new Set([...html.matchAll(/<a[^>]+name="([^"]+)"/g)].map(m => m[1]));

  for (const match of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)) {
    const raw = match[1].replaceAll('&amp;', '&');
    if (/^(?:data:|mailto:|tel:|javascript:)/i.test(raw)) continue;
    let url;
    try { url = new URL(raw, base); } catch { report(page, 'malformed URL: ' + raw); continue; }
    if (url.origin !== host) continue;
    checked++;
    const local = decodeURIComponent(url.pathname);
    if (local.startsWith('/funtasia-audio/')) { legacyLinks++; continue; }
    const target = local.endsWith('/') ? local + 'index.html' : local;
    if (!fs.existsSync('.' + target) || !fs.statSync('.' + target).isFile()) {
      report(page, `broken site-local URL ${raw} (resolved: ${target})`);
    }
    if (local === base.pathname && url.hash) {
      const anchor = decodeURIComponent(url.hash.slice(1));
      if (!ids.has(anchor) && !namedAnchors.has(anchor)) report(page, `missing fragment #${anchor}`);
    }
  }
  for (const m of html.matchAll(/<img\b([^>]+)>/gi)) {
    images++;
    if (!/\balt\s*=/.test(m[1])) report(page, 'image missing alt attribute');
  }
}
assert.deepEqual(errors, [], 'Chinese site link or accessibility regression');
console.log(`Site-local link QA: PASS (${pages.length} pages, ${checked} local URLs, ${images} images, ${legacyLinks} legacy-project references)`);

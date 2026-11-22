#!/usr/bin/env node
// Lightweight dependency-free static regression checks for the zh-CN launch.
// Run at repository root: node scripts/check-zh-cn.mjs
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

const read = file => fs.readFileSync(file, 'utf8');
const files = ['catalog/zh-cn/index.html', 'catalog/zh-cn/fun-monofilter.html',
  'quality/zh-cn/index.html', 'support/zh-cn/index.html',
  'about/zh-cn/index.html', 'catalog/product-zh-cn.js'];
for (const file of files) assert.ok(fs.existsSync(file), `Missing ${file}`);

const en = read('catalog/en/index.html');
const zh = read('catalog/zh-cn/index.html');
const source = read('catalog/product-zh-cn.js');
const links = html => [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]);
const releaseLinks = html => links(html).filter(u =>
  u.startsWith('https://github.com/funtasiaaudio/') || u.startsWith('../assets/')).sort();

assert.equal((zh.match(/class="card" data-version=/g) || []).length + 
  (zh.match(/id="funtasia-free-collection" class="card"/g) || []).length +
  (zh.match(/id="nyan-buildup" class="card"/g) || []).length, 34,
  'Expected 34 products');
assert.deepEqual(releaseLinks(zh), releaseLinks(en),
  'Download and product image links differ from English catalog');
assert.ok(zh.includes('data-product-key="fun-plate"'), 'FUN Plate card missing');
assert.ok(zh.includes('FUNtasia.Free.Collection.1.1.0.zip'), 'Free Collection version stale');
assert.ok(zh.includes('../product-plate.js?v=20261122-plate-free-100'), 'FUN Plate details missing');
assert.ok(zh.includes('<html lang="zh-CN">'));
assert.ok(zh.includes('https://funtasiaaudio.github.io/catalog/zh-cn/'));
assert.ok(zh.includes('GTM-M88BK887'));
assert.ok(zh.includes('product-zh-cn.js'));
assert.ok(zh.includes('funtasia_product_download_click') === false,
  'Download tracking should be managed in shared catalog.js');
assert.ok(read('catalog/catalog.js').includes('funtasia_product_download_click'));
assert.ok(read('index.html').includes('<option value="zh-CN"'));
assert.ok(read('home-i18n.js').includes("'zh-CN': {"));
assert.ok(read('sitemap.xml').includes('/catalog/zh-cn/'));
for (const lang of ['ja','en','de','fr','ru','zh-cn']) {
  const page=read(`catalog/${lang}/index.html`);
  assert.ok(page.includes('hreflang="zh-CN"'), `Missing Chinese alternate: ${lang}`);
}

const productKeys=[...source.matchAll(/^\s+"([a-z0-9-]+)": \{/gm)].map(m=>m[1]);
assert.equal(productKeys.length, 34, 'Every catalog product needs a zh-CN translation');
for(const path of ['home-i18n.js','catalog/catalog.js','catalog/product-zh-cn.js']) {
  const check = spawnSync(process.execPath, ['--check', path], {encoding: 'utf8'});
  assert.equal(check.status, 0, `JavaScript syntax error in ${path}: ${check.stderr}`);
}

const records = read('records/zh-cn/index.html');
assert.ok(records.includes('<html lang="zh-CN">'), 'Records page locale missing');
assert.ok(records.includes('AI 与创作者权利'), 'Records rights policy untranslated');
assert.ok(records.includes('mailto:info.funtasiarecords@gmail.com'), 'Records collaboration contact missing');
assert.ok(records.includes('https://ko-fi.com/funtasiarecords'), 'Records support URL missing');
assert.ok(records.includes('href="../../catalog/zh-cn/"'), 'Records catalog navigation incorrect');
assert.ok(records.includes('href="../../about/zh-cn/"'), 'Records About navigation incorrect');
assert.ok(read('home-i18n.js').includes("locale === 'zh-CN' ? 'zh-cn' : locale"), 'Homepage Records route incorrect');
for (const path of ['records/index.html','records/en/index.html','records/de/index.html','records/fr/index.html','records/ru/index.html']) {
  assert.ok(read(path).includes('hreflang="zh-CN"'), `Missing Records zh-CN switch: ${path}`);
}
assert.ok(read('sitemap.xml').includes('https://funtasiaaudio.github.io/records/zh-cn/'), 'Records sitemap missing');

console.log('zh-CN Audio + Records static checks: PASS');

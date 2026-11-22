#!/usr/bin/env node
// Version / release asset parity for all six official FUN MonoFilter detail pages.
// External GitHub Release metadata is verified independently before updating this pin.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const version = 'v1.1.0';
const zip = 'https://github.com/funtasiaaudio/FUN-MonoFilter/releases/download/v1.1.0/FUN.MonoFilter.1.1.0.zip';
const image = '../assets/card-fun-monofilter-v1.1.0-sage-portrait.webp';
const langs = ['ja', 'en', 'de', 'fr', 'ru', 'zh-cn'];
const hrefs = [];
const errors = [];

for (const lang of langs) {
  const page = 'catalog/' + lang + '/fun-monofilter.html';
  const html = fs.readFileSync(page, 'utf8');
  const expectedLang = lang === 'zh-cn' ? 'zh-CN' : lang;
  if (!html.includes('<html lang="' + expectedLang + '">')) errors.push(page + ': incorrect lang');
  if (!html.includes('FUN MonoFilter ' + version)) errors.push(page + ': footer version mismatch');
  if (html.includes('v1.0.0') || html.includes('FUN.MonoFilter.1.0.0.zip'))
    errors.push(page + ': stale v1.0.0 reference');
  const download = html.match(/<a class="btn primary" href="([^"]+)"/)?.[1];
  if (download !== zip) errors.push(page + ': mismatched official ZIP link');
  hrefs.push(download);
  const img = html.match(/<img class="shot" src="([^"]+)"/)?.[1];
  if (img !== image) errors.push(page + ': mismatched current artwork');
  if (!img || !fs.existsSync(path.resolve(path.dirname(page), img)))
    errors.push(page + ': missing image file');
  const manual = html.match(/<a class="btn" href="([^"]+\.pdf)"/)?.[1];
  const expectedManual = '../assets/manuals/FUN_MonoFilter_Manual_' +
    (lang === 'zh-cn' ? 'EN' : lang.toUpperCase()) + '.pdf';
  if (manual !== expectedManual) errors.push(page + ': incorrect locale/PDF disclosure');
  if (!manual || !fs.existsSync(path.resolve(path.dirname(page), manual)))
    errors.push(page + ': missing linked PDF manual');
  const catalog = fs.readFileSync('catalog/' + lang + '/index.html', 'utf8');
  const card = catalog.match(/<article\b[^>]*data-product-name="FUN MonoFilter"[\s\S]*?<\/article>/)?.[0];
  if (!card || !card.includes('data-version="' + version + '"') ||
      !card.includes('FUN MonoFilter ' + version) || !card.includes(zip))
    errors.push(page + ': mismatch against existing product catalog card');
}
if (new Set(hrefs).size !== 1) errors.push('The six localized ZIP links differ');
assert.deepEqual(errors, [], 'FUN MonoFilter release parity failed');
console.log('FUN MonoFilter official v1.1.0 parity: PASS (6 locales, current ZIP, artwork, 6 existing PDF manuals)');

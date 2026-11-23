#!/usr/bin/env node
// Scope: validate the existing GTM bootstrap and the Chinese Audio dataLayer contract.
// Passing this does not verify any GTM Custom Event trigger, GA4 tag, consent state,
// Measurement ID, DebugView, cross-domain transfer or Analytics report.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const id='GTM-M88BK887';
const trackedPages=[
  'index.html',
  'catalog/zh-cn/index.html',
  'quality/zh-cn/index.html',
  'about/zh-cn/index.html',
  'support/zh-cn/index.html',
  'records/zh-cn/index.html',
  'studio/official/zh-cn/index.html',
  'studio/official/expansions/zh-cn/index.html',
  'studio/official/zh-cn/study/index.html',
  'utilities/index.html',
  'goods/index.html'
];
const failures=[];
for(const path of trackedPages){
  const content=fs.readFileSync(path,'utf8');
  if(!content.includes("})(window,document,'script','dataLayer','"+id+"');"))
    failures.push(path+': GTM bootstrap missing or changed');
  if(!content.includes('https://www.googletagmanager.com/ns.html?id='+id))
    failures.push(path+': GTM noscript counterpart missing');
  const ids=content.match(/GTM-M88BK887/g)||[];
  if(ids.length!==2)failures.push(path+': GTM container IDs should occur twice, got '+ids.length);
}
const js=fs.readFileSync('catalog/catalog.js','utf8');
const from=js.indexOf("/* GA4 measurement bridge:");
const to=js.indexOf("/* Accessible native dialog",from);
if(from<0||to<0)failures.push('Chinese catalog measurement bridge missing');
else {
  const segment=js.slice(from,to);
  for(const token of [
    "if (localeFilter === 'zh-CN')",
    "funtasia_product_download_click",
    "site_language: 'zh-CN'",
    'product_name:',
    'product_key:',
    'download_url:'
  ])if(!segment.includes(token))failures.push('Missing analytics contract token '+token);
}
assert.deepEqual(failures,[],'Chinese analytics bootstrap contract');
console.log('Chinese site GTM source QA: PASS ('+trackedPages.length+' GTM-bootstrapped entry pages + catalog dataLayer contract)');

#!/usr/bin/env node
// Lightweight dependency-free static regression checks for the zh-CN launch.
// Run at repository root: node scripts/check-zh-cn.mjs
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const read = file => fs.readFileSync(file, 'utf8');
const files = ['catalog/zh-cn/index.html', 'catalog/zh-cn/fun-monofilter.html',
  'quality/zh-cn/index.html', 'support/zh-cn/index.html',
  'about/zh-cn/index.html', 'catalog/product-zh-cn.js'];
for (const file of files) assert.ok(fs.existsSync(file), `Missing ${file}`);

const en = read('catalog/en/index.html');
const zh = read('catalog/zh-cn/index.html');
const source = read('catalog/product-zh-cn.js');
const links = html => [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]);
// Source parity applies to actual release assets and local artwork/manuals.
// Text links to releases may intentionally differ when the localized page
// replaces an old English-only legacy-project title link with the pinned tag.
const releaseLinks = html => links(html).filter(u =>
  (u.startsWith('https://github.com/funtasiaaudio/') && u.includes('/releases/download/')) ||
  u.startsWith('../assets/')).sort();

assert.equal((zh.match(/class="card" data-version=/g) || []).length + 
  (zh.match(/id="funtasia-free-collection" class="card"/g) || []).length +
  (zh.match(/id="nyan-buildup" class="card"/g) || []).length, 34,
  'Expected 34 products');
assert.deepEqual(releaseLinks(zh), releaseLinks(en),
  'Published ZIP and product asset links differ from English catalog');
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
for(const path of ['home-i18n.js','catalog/catalog.js','catalog/product-zh-cn.js','site-sections-i18n.js']) {
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

const shared = read('site-sections-i18n.js');
assert.ok(shared.includes("'zh-CN': 5"), 'Shared zh-CN translation index missing');
assert.ok(shared.includes('zhUtilityRows.length !== utilityRows.length'), 'Shared row count guard missing');
assert.ok(shared.includes('zhGoodsRows.length !== goodsRows.length'), 'Goods row count guard missing');
for (const path of ['utilities/index.html','goods/index.html']) {
  assert.ok(read(path).includes('<option value="zh-CN" lang="zh-CN">简体中文</option>'), `Missing zh-CN selector: ${path}`);
}
assert.ok(read('home-i18n.js').includes("'utilities/?lang=' + locale"), 'Homepage Utilities locale route missing');
assert.ok(read('home-i18n.js').includes("'goods/?lang=' + locale"), 'Homepage Goods locale route missing');


// Exercise the actual client-side locale switch with a small DOM harness.
// This catches mapping/runtime regressions that a text-only source check misses.
for (const [page, japanese, chinese] of [
  ['utilities', '公開ベータ · v0.2.1 · Windows 10/11 x64 · 無料', '公开测试版 · v0.2.1 · Windows 10/11 x64 · 免费'],
  ['goods', '無料ダウンロード', '免费下载']
]) {
  const node = {nodeValue: japanese, parentElement: {tagName: 'P'}};
  const image = {
    values: {alt: 'FUNtasia Studio Charcoalの壁紙プレビュー'},
    getAttribute(key) { return this.values[key] || null; },
    setAttribute(key, value) { this.values[key] = value; }
  };
  const record = {href: '../records/'};
  const catalog = {href: '../catalog/ja/'};
  const select = {value: '', setAttribute() {}, addEventListener() {}};
  const meta = {content: ''};
  const nav = {setAttribute() {}};
  const doc = {
    body: {dataset: {i18nPage: page}},
    documentElement: {lang: 'ja'},
    title: '',
    createTreeWalker() {
      let seen = false;
      return {nextNode() { if (seen) return null; seen = true; return node; }};
    },
    querySelectorAll(query) {
      if (query === '[alt],[aria-label],[title]') return [image];
      if (query === 'a[href="../records/"]') return [record];
      if (query === 'a[href="../catalog/ja/"]') return [catalog];
      return [];
    },
    querySelector(query) {
      if (query === '#section-language') return select;
      if (query === 'meta[name="description"]') return meta;
      if (query === '.site-nav') return nav;
      return null;
    }
  };
  vm.runInNewContext(shared, {
    document: doc, NodeFilter: {SHOW_TEXT: 4},
    navigator: {languages: ['zh-CN'], language: 'zh-CN'},
    location: {search: '?lang=zh-CN', href: 'https://funtasiaaudio.github.io/' + page + '/?lang=zh-CN'},
    localStorage: {getItem() { return null; }, setItem() {}},
    URL, URLSearchParams, history: {replaceState() {}, state: null}
  }, {timeout: 3000});
  assert.equal(node.nodeValue, chinese, `Client-side Chinese text failed on ${page}`);
  assert.equal(doc.documentElement.lang, 'zh-CN');
  assert.equal(select.value, 'zh-CN');
  assert.equal(record.href, '../records/zh-cn/');
  assert.equal(catalog.href, '../catalog/zh-cn/');
  assert.ok(meta.content.length > 15);
  assert.equal(image.values.alt, 'FUNtasia Studio Charcoal 壁纸预览');
}

const studioZh = read('studio/official/zh-cn/index.html');
const studioEn = read('studio/official/index.html');
const studioLink = html => [...html.matchAll(/https:\/\/github\.com\/funtasiaaudio\/[^" ]+/g)].map(m=>m[0]);
assert.ok(studioZh.includes('<html lang="zh-CN">'), 'Studio Chinese locale missing');
assert.ok(studioZh.includes('https://funtasiaaudio.github.io/studio/official/zh-cn/'), 'Studio canonical missing');
assert.ok(studioZh.includes('href="../studio.css?v=4"'), 'Studio stylesheet relative path incorrect');
assert.ok(studioZh.includes('src="../assets/theme-forest.webp"'), 'Studio gallery relative path incorrect');
assert.ok(studioZh.includes('href="../../favicon.png"'), 'Studio icon relative path incorrect');
assert.ok(studioZh.includes('Beta 1.3.0'), 'Studio version missing');
assert.ok(studioZh.includes('日语／英语手册'), 'Studio manual language disclosure missing');
assert.ok(studioZh.includes('可能出现崩溃或数据丢失'), 'Studio beta safety disclosure missing');
assert.deepEqual(studioLink(studioZh), studioLink(studioEn), 'Studio release links changed');
assert.ok(read('studio/index.html').includes("['ja', 'en', 'de', 'fr', 'ru', 'zh-CN']"), 'Studio locale router not extended');
assert.ok(read('studio/index.html').includes("'zh-cn' : locale"), 'Studio zh-CN path mapping missing');
for (const path of ['studio/official/index.html','studio/official/ja/index.html','studio/official/ru/index.html']) {
  assert.ok(read(path).includes('hreflang="zh-CN"'), `Studio language switch missing: ${path}`);
}
assert.ok(read('sitemap.xml').includes('https://funtasiaaudio.github.io/studio/official/zh-cn/'), 'Studio sitemap missing');


// All currently published Audio card artwork needs a meaningful Chinese alt
// description, even when product/parameter names remain in English.
const chineseCardAlts=[...zh.matchAll(/<img\b[^>]*class="shot"[^>]*alt="([^"]+)"[^>]*>/g)].map(match=>match[1]);
assert.equal(chineseCardAlts.length,34,'Missing Chinese Audio product artwork alt attributes');
for(const [i,alt] of chineseCardAlts.entries()){
  assert.ok(/[\u3400-\u9fff]/u.test(alt),
    'English-only artwork description on Chinese Audio card '+(i+1)+': '+alt);
}
assert.ok(chineseCardAlts.some(alt=>alt.includes('Nyan BuildUp 单旋钮渐强、上升音效与转场')),
 'Nyan BuildUp visual should explain the one-knob effects in Chinese');
assert.ok(chineseCardAlts.some(alt=>alt.includes('FUN Dynamics Pack v1.3.0 四款插件') &&
 alt.includes('上排为 Transient Shaper 与 De-Esser') && alt.includes('下排为 Compressor 与 Gate / Expander')),
 'Dynamics Pack artwork should describe all four GUI panels and their positions');
console.log('zh-CN Audio artwork accessibility: PASS (34 localized card alt descriptions)');

// Product-card sharing fallback must return to the same Simplified Chinese card,
// not silently send a reader to the legacy English Audio catalog.
// Other sharing buttons intentionally point to official GitHub Release pages.
const zhShareHtml = read('catalog/zh-cn/index.html');
assert.ok(zhShareHtml.includes('data-filter="utility" aria-pressed="false">实用工具</button>'),
  'Chinese utility category label must not retain an English-only suffix');
assert.ok(!zhShareHtml.includes('data-filter="utility" aria-pressed="false">实用工具 (EN)</button>'));
const zhFallbackShareIds=[
  'nyan-buildup','the-hollow-winds','fun-pair',
  'fun-dynamics-pack','the-resonant-forge','basic-filter-pack',
  'fun-rack','fun-drum-pad','fun-room','fun-clipper-limiter-pack',
  'fun-ott','the-deep-roots','fun-clip-distortion','fun-waveshaper','fun-meq'
];
for (const id of zhFallbackShareIds) {
  const begin=zhShareHtml.indexOf('<article id="'+id+'"');
  assert.ok(begin>=0,'Missing product article '+id);
  const end=zhShareHtml.indexOf('</article>',begin);
  const card=zhShareHtml.slice(begin,end);
  const target='https://funtasiaaudio.github.io/catalog/zh-cn/#'+id;
  const instagram=card.match(/class="mini-btn instagram-share-btn"[^>]*data-share-url="([^"]+)"/)?.[1];
  assert.equal(instagram,target,'Instagram native/copy share link points off-locale: '+id);
  const intent=card.match(/class="mini-btn social-share-btn" href="([^"]+)"/)?.[1];
  assert.ok(intent,'Missing X intent share URL on '+id);
  const url=new URL(intent.replaceAll('&amp;','&'));
  assert.equal(url.host,'twitter.com','Unexpected X share host on '+id);
  assert.equal(url.searchParams.get('url'),target,'X share redirects to wrong locale: '+id);
}
assert.equal(
  (zhShareHtml.match(/data-share-url="https:\/\/funtasiaaudio\.github\.io\/catalog\/en\/#/g)||[]).length,
  0,'Some Instagram fallback share links still point to English');
assert.equal(
  (zhShareHtml.match(/catalog%2Fen%2F%23/g)||[]).length,0,
  'Some encoded X share links still point to the English catalog');
console.log('zh-CN Audio product social sharing: PASS (15 Chinese-localized X/Instagram URL pairs + localized utility label)');

// A direct Release asset must be described as a ZIP download, not as
// "release notes". Keep the documented FUN Dither manual-in-ZIP link
// distinct from the 34 primary product downloads.
const zipButtons=[...zhShareHtml.matchAll(/<a\b[^>]*href="([^"]+\/releases\/download\/[^"]+\.zip)"[^>]*>([^<]+)<\/a>/g)]
  .map(match=>({href:match[1],label:match[2].trim()}));
assert.equal(zipButtons.length,35,'Expected 34 official Audio ZIP CTAs plus one Dither manual-in-ZIP link');
const primaryDownloads=zipButtons.filter(button=>button.label!=='PDF 手册（包含在 ZIP 中）');
assert.equal(primaryDownloads.length,34,'All 34 product ZIP CTAs must be present');
for(const button of primaryDownloads)
  assert.equal(button.label,'下载','Direct ZIP link falsely labelled as a release/document page: '+button.href);
assert.equal(zipButtons.filter(button=>button.label==='PDF 手册（包含在 ZIP 中）').length,1,
  'The Dither PDF manual link must disclose that it leads to a ZIP bundle');
const monoFilterCard=zhShareHtml.match(/<article\b[^>]*data-product-key="fun-monofilter"[^>]*>[\s\S]*?<\/article>/)?.[0];
assert.ok(monoFilterCard,'MonoFilter Chinese product card missing');
assert.ok(monoFilterCard.includes('releases/download/v1.1.0/FUN.MonoFilter.1.1.0.zip" target="_blank" rel="noopener noreferrer">下载</a>'),
  'MonoFilter direct ZIP button needs accurate download-only label');
assert.ok(monoFilterCard.includes('releases/tag/v1.1.0'),
  'MonoFilter release notes must remain reachable from the product title');
const releaseNotesLinks=[...zhShareHtml.matchAll(/<a\b[^>]*href="([^"]+\/releases\/tag\/[^"]+)"[^>]*>([^<]+)<\/a>/g)]
  .filter(match=>match[2].trim()==='更新说明');
assert.ok(releaseNotesLinks.length>=25,'Expected Chinese update-note buttons on official release pages');
console.log('zh-CN Audio CTA semantics: PASS (34 ZIP downloads, one manual-in-ZIP, release notes on tag pages)');

// Every product title points to its pinned GitHub release; every share goes
// either to that same release, or to an anchor that exists on this Chinese page.
const shareCards=[...zhShareHtml.matchAll(/<article\b([^>]*\bclass="card"[^>]*)>([\s\S]*?)<\/article>/g)];
assert.equal(shareCards.length,34,'Expected 34 Audio cards for end-to-end share target audit');
let localizedShares=0, officialShares=0;
for(const [,attrs,card] of shareCards){
  const name=attrs.match(/data-product-name="([^"]+)"/)?.[1]||'unnamed';
  const titleLink=card.match(/^<a href="([^"]+)"/)?.[1];
  const directZip=card.match(/<a\b[^>]*href="([^"]+\/releases\/download\/[^"]+\.zip)"[^>]*>下载<\/a>/)?.[1];
  assert.ok(titleLink&&directZip,'Missing official title or ZIP link on '+name);
  const expectedTag=directZip.replace(/\/releases\/download\/([^/]+)\/[^/]+\.zip$/,'/releases/tag/$1');
  assert.equal(titleLink,expectedTag,'Product title points to an outdated/English legacy page: '+name);
  const intent=card.match(/class="mini-btn social-share-btn" href="([^"]+)"/)?.[1];
  const instagram=card.match(/class="mini-btn instagram-share-btn"[^>]*data-share-url="([^"]+)"/)?.[1];
  assert.ok(intent&&instagram,'Missing social share action on '+name);
  const xTarget=new URL(intent.replaceAll('&amp;','&')).searchParams.get('url');
  assert.equal(xTarget,instagram,'X and Instagram point to different product versions/locales: '+name);
  if(xTarget===expectedTag) {officialShares++;continue;}
  const cardId=attrs.match(/\bid="([^"]+)"/)?.[1];
  assert.ok(cardId,'Localized shared card has no fragment ID: '+name);
  assert.equal(xTarget,'https://funtasiaaudio.github.io/catalog/zh-cn/#'+cardId,
    'Share link points away from the Chinese card or official release: '+name);
  localizedShares++;
}
assert.equal(localizedShares,15,'Expected fifteen Chinese card-localized share targets');
assert.equal(officialShares,19,'Expected nineteen pinned release share targets');
assert.ok(!/funtasia-audio(?:%2F|\/)(?:%23|#)/i.test(zhShareHtml),
  'Chinese Audio still links/shares to the legacy English project card anchors');
console.log('zh-CN Audio share destinations: PASS (15 Chinese anchors + 19 current release URLs)');

const englishManualLinks=[...zhShareHtml.matchAll(
  /<a\b[^>]*href="([^"]+_EN\.pdf)"[^>]*>([\s\S]*?)<\/a>/g
)];
assert.equal(englishManualLinks.length,5,'Expected five existing EN-only PDF manuals');
for(const [,href,body] of englishManualLinks) {
  assert.equal(body.replace(/<[^>]+>/g,'').trim(),'PDF 使用手册（英文）',
    'English manual language not disclosed on Chinese Audio catalog: '+href);
}
assert.ok(!zhShareHtml.includes('>PDF 使用手册</a>'),
  'Chinese catalog retains ambiguous unlabeled PDF manuals');
console.log('zh-CN Audio PDF manual language labels: PASS (5 English manuals explicitly disclosed)');



console.log('zh-CN Audio + Records + Utilities + Goods + Studio static and locale runtime checks: PASS');

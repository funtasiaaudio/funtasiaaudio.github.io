#!/usr/bin/env node
// Regression tests for the Simplified Chinese Studio expansion and reading pages.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const load = file => fs.readFileSync(file, 'utf8');
const enExpansion = load('studio/official/expansions/index.html');
const jaExpansion = load('studio/official/expansions/ja/index.html');
const cnExpansion = load('studio/official/expansions/zh-cn/index.html');
const enStudy = load('studio/official/ja/study/index.html');
const cnStudy = load('studio/official/zh-cn/study/index.html');
const cnStudio = load('studio/official/zh-cn/index.html');
const js = load('studio/official/expansions/expansions.js');
const sitemap = load('sitemap.xml');

const links = html => [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);
const externalLinks = html => links(html)
  .filter(link => /^https:\/\//.test(link))
  .filter(link => !link.includes('funtasiaaudio.github.io/studio/official/'))
  .filter(link => !link.includes('googletagmanager.com'));

function checkLocalLinks(page, html) {
  for (const link of links(html)) {
    if (!/^(?:\.{1,2}\/|\/|[^#:?]+\.(?:png|webp|css|js))/.test(link)) continue;
    if (link.startsWith('//')) continue;
    const resolved = new URL(link, 'https://funtasiaaudio.github.io/' + page);
    if (resolved.origin !== 'https://funtasiaaudio.github.io') continue;
    let target = decodeURIComponent(resolved.pathname).replace(/^\//, '');
    if (!target || target.endsWith('/')) target += 'index.html';
    assert.ok(fs.existsSync(target), `Broken local link ${link} in ${page}: expected ${target}`);
  }
}

assert.ok(cnExpansion.includes('<html lang="zh-CN">'));
assert.ok(cnStudy.includes('<html lang="zh-CN">'));
assert.ok(cnExpansion.includes('https://funtasiaaudio.github.io/studio/official/expansions/zh-cn/'));
assert.ok(cnStudy.includes('https://funtasiaaudio.github.io/studio/official/zh-cn/study/'));
assert.ok(cnStudy.includes('学习说明：以下推荐书籍均为日语出版物'));
assert.ok(cnStudy.includes('书名、作者及出版方等署名信息保留日文原文'),
  'Chinese study notice should explain preserved original-language bibliography');
assert.ok(!cnStudy.includes('著者名'), 'Japanese terminology remains in the Chinese editorial notice');

// Preserve original Japanese bibliographic attribution, including exact author,
// publisher, and circle names, as explicitly promised by the Chinese reading guide.
const attribution = html => [...html.matchAll(/<p class="(?:choice-meta|book-meta)">([^<]+)<\/p>/g)]
  .map(match => match[1]);
assert.equal(attribution(enStudy).length, 7, 'Source study guide must have seven book attributions');
assert.deepEqual(attribution(cnStudy), attribution(enStudy),
  'Chinese book attribution must preserve Japanese source names verbatim');
// FEM01's authoritative GitHub release asset is 3,608,882 bytes,
// which is about 3.61 decimal MB / 3.44 binary MiB.
assert.ok(cnExpansion.includes('约 3.61 MB，约 3.44 MiB'),
  'FEM01 display units should distinguish decimal MB from binary MiB');
assert.ok(enExpansion.includes('approx. 3.61 MB / 3.44 MiB'), 'English FEM01 ZIP size inconsistent');
assert.ok(jaExpansion.includes('約3.61 MB／約3.44 MiB'), 'Japanese FEM01 ZIP size inconsistent');
assert.ok(cnExpansion.includes('ZIP 约 594 KB'), 'Nyan 8bit ZIP size missing');
assert.ok(cnExpansion.includes('ZIP 约 3.51 MB'), 'Fantasy Folk ZIP size missing');


assert.ok(cnStudy.includes('在和声学与对位法的学习中'));
assert.ok(cnExpansion.includes('独立素材重新分发'));
assert.ok(cnExpansion.includes('CC0 1.0'));
assert.ok(cnExpansion.includes('FUN_Orchestral_Percussion_Vol1_LICENSE.txt">官方许可文件</a>'),
  'Chinese Orchestral license label should not suggest a different release filename');
assert.ok(!cnExpansion.includes('FUN_Orchestral_Percussion_Vol1_LICENSE.txt">LICENSE.txt</a>'),
  'Chinese Orchestral license display must not misname the official release asset');
assert.ok(cnExpansion.includes('MIDI 速度说明'));
assert.ok(cnExpansion.includes('不包含 VST3 插件本体或安装程序'));
assert.ok(cnExpansion.includes('不得将波表文件作为独立素材库再分发或转售'),
 'Kawaii Wavetable individual file redistribution terms must not be softened');
assert.ok(cnExpansion.includes('不得将 MIDI 文件本身作为独立素材包再分发或转售'),
 'Epic Metal must disclose restriction from its bundled license');
assert.ok(cnExpansion.includes('Epic Metal ZIP 内的 <strong>LICENSE.md</strong>'),
 'Epic Metal license must be identified as bundled in ZIP');
assert.ok(cnExpansion.includes('Fantasy Folk ZIP 内的 <strong>LICENSE.txt</strong>'),
 'Fantasy Folk license must be identified as bundled in ZIP');
assert.ok(cnExpansion.includes('Orchestral Percussion 的原始录音采用 CC0，可再利用或再分发'),
 'CC0 permissions must remain distinct from proprietary packs');
assert.ok(cnExpansion.includes('Fantasy Folk 允许在具有实质性原创内容的 DAW 工程中分享可编辑 MIDI'),
 'Creative work DAW sharing permission must remain visible');

assert.ok(cnStudio.includes('href="../expansions/zh-cn/"'));
assert.ok(cnStudio.includes('href="study/"'));
assert.ok(js.includes('zh ? `显示'));
assert.equal((enExpansion.match(/data-pack-type=/g) || []).length,
             (cnExpansion.match(/data-pack-type=/g) || []).length);
assert.equal((cnExpansion.match(/data-pack-type=/g) || []).length, 5);
assert.deepEqual(externalLinks(cnExpansion), externalLinks(enExpansion),
  'Expansion official release and license destinations changed');
assert.deepEqual(externalLinks(cnStudy), externalLinks(enStudy),
  'Study book publisher, retailer, or author links changed');

for (const originalName of [
  '音符と鍵盤でおぼえる', '楽典 理論と実習', 'コード理論大全',
  '対位法', '新しい和声', '作曲基礎理論', '汎用アレンジ'
]) assert.ok(cnStudy.includes(originalName), `Original Japanese book title missing: ${originalName}`);

for (const [file, html] of [
  ['studio/official/expansions/zh-cn/index.html', cnExpansion],
  ['studio/official/zh-cn/study/index.html', cnStudy],
  ['studio/official/zh-cn/index.html', cnStudio],
]) checkLocalLinks(file, html);

for (const [file, html] of [
  ['studio/official/expansions/index.html', enExpansion],
  ['studio/official/expansions/ja/index.html', jaExpansion],
  ['studio/official/ja/study/index.html', enStudy],
]) {
  assert.ok(html.includes('hreflang="zh-CN"'), `Missing Chinese alternate: ${file}`);
}
assert.ok(sitemap.includes('https://funtasiaaudio.github.io/studio/official/expansions/zh-cn/'));
assert.ok(sitemap.includes('https://funtasiaaudio.github.io/studio/official/zh-cn/study/'));

const jsCheck = spawnSync(process.execPath, ['--check', 'studio/official/expansions/expansions.js'], { encoding:'utf8' });
assert.equal(jsCheck.status, 0, jsCheck.stderr);

console.log('Studio Chinese expansion, reading guide, URLs, assets and JavaScript: PASS');

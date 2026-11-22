#!/usr/bin/env node
// Canonical / hreflang reciprocal SEO audit for statically localized zh-CN pages.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const host='https://funtasiaaudio.github.io';
const pages=[
 'catalog/zh-cn/index.html',
 'catalog/zh-cn/fun-monofilter.html',
 'quality/zh-cn/index.html',
 'about/zh-cn/index.html',
 'support/zh-cn/index.html',
 'records/zh-cn/index.html',
 'studio/official/zh-cn/index.html',
 'studio/official/expansions/zh-cn/index.html',
 'studio/official/zh-cn/study/index.html'
];
const siteMap=fs.readFileSync('sitemap.xml','utf8');
let checked=0,alternateChecks=0;
const errors=[];
function warn(message){errors.push(message);}
function targetPath(url){
 const u=new URL(url);
 if(u.origin!==host)throw Error('External hreflang target '+url);
 const name=u.pathname.endsWith('/')?u.pathname+'index.html':u.pathname;
 return '.'+decodeURIComponent(name);
}
function linkRecords(html){
 return [...html.matchAll(/<link\b[^>]*>/gi)].map(x=>x[0]);
}
function attribute(tag,key){return tag.match(new RegExp('\\b'+key+'="([^"]+)"'))?.[1]||null;}
const cached=new Map();
function load(file){
 if(!cached.has(file))cached.set(file,fs.readFileSync(file,'utf8'));
 return cached.get(file);
}
for(const page of pages){
 const html=load(page),links=linkRecords(html),expected=host+'/'+page.replace(/index\.html$/,'');
 const canonical=links.filter(tag=>attribute(tag,'rel')==='canonical');
 const alternates=links.filter(tag=>attribute(tag,'rel')==='alternate');
 if(canonical.length!==1||attribute(canonical[0]||'','href')!==expected)
   warn(page+' must have exactly one self-referencing canonical: '+expected);
 if(!/<html\b[^>]*lang="zh-CN"/.test(html))warn(page+' missing zh-CN lang');
 if(!/<meta\b[^>]*name="description"\s+content="[^"]{10,}"/.test(html))
   warn(page+' missing Chinese meta description');
 if((html.match(/<h1\b/g)||[]).length!==1)warn(page+' requires one H1');
 if(!siteMap.includes('<loc>'+expected+'</loc>'))warn(page+' missing sitemap entry');
 const self=alternates.filter(tag=>attribute(tag,'hreflang')==='zh-CN');
 if(self.length!==1||attribute(self[0]||'','href')!==expected)
   warn(page+' hreflang=zh-CN must point to canonical');
 const languages=new Set();
 for(const alt of alternates){
  const lang=attribute(alt,'hreflang'),url=attribute(alt,'href');
  if(!lang||!url){warn(page+' malformed alternate '+alt);continue;}
  if(languages.has(lang))warn(page+' duplicate hreflang '+lang);
  languages.add(lang);
  if(lang==='x-default')continue;
  const file=targetPath(url);
  if(!fs.existsSync(file)){warn(page+' missing alternate target '+file);continue;}
  const other=linkRecords(load(file));
  const backlink=other.find(tag=>attribute(tag,'rel')==='alternate'&&
    attribute(tag,'hreflang')==='zh-CN'&&attribute(tag,'href')===expected);
  if(!backlink)warn(page+' no reciprocal zh-CN hreflang on '+file);
  alternateChecks++;
 }
 checked++;
}
for(const section of ['about','support']){
 const zh=load(section+'/zh-cn/index.html'),ja=load(section+'/index.html');
 for(const [doc,label] of [[zh,'zh-CN'],[ja,'ja']]){
  for(const target of [host+'/'+section+'/',host+'/'+section+'/zh-cn/']){
   if(!linkRecords(doc).some(tag=>attribute(tag,'rel')==='alternate'&&attribute(tag,'href')===target))
    warn(section+' '+label+' missing counterpart hreflang '+target);
  }
 }
 // All Chinese division links must carry a deterministic Chinese destination.
 const expected=[
  '../../catalog/zh-cn/','../../studio/official/zh-cn/',
  '../../utilities/?lang=zh-CN','../../records/zh-cn/',
  '../../goods/?lang=zh-CN'
 ];
 for(const href of expected)if(!zh.includes('href="'+href+'"'))
   warn(section+' missing Chinese destination '+href);
 if(/(?:records\/en\/|utilities\/\?lang=en|goods\/\?lang=en|studio\/official\/(?:ja|ru)\/)/.test(zh))
   warn(section+' has an outdated English/non-Chinese destination');
}
// About page must retain the AI collaborator section from its Japanese source.
// The two characters and their work scopes are localized; identity and
// decorative portrait sprites are preserved without introducing new assets.
{
 const zh=load('about/zh-cn/index.html'),ja=load('about/index.html');
 for(const [file,html] of [['ja',ja],['zh-CN',zh]]){
  if(!html.includes('id="ai-partners-title"'))warn('about '+file+' missing AI partner heading');
  if((html.match(/class="card ai-partner-card"/g)||[]).length!==2)
   warn('about '+file+' must have exactly two AI partner cards');
  for(const name of ['遥（Haruka）','優春（Yasaharu）'])
   if(!html.includes('<h2>'+name+'</h2>'))warn('about '+file+' missing collaborator '+name);
  for(const sprite of ['ai-partner-art--haruka','ai-partner-art--yasaharu'])
   if(!html.includes('class="ai-partner-art '+sprite+'" aria-hidden="true"'))
    warn('about '+file+' missing decorative AI portrait '+sprite);
 }
 for(const phrase of ['参与 DSP 算法','FUNtasia Records 的创作','ChatGPT 中的 AI 角色','由 Hʉeliang 作出决定'])
  if(!zh.includes(phrase))warn('Chinese About missing original collaborator scope: '+phrase);
 if(!zh.includes('sections.css?v=20261122ai-partners'))
  warn('Chinese About should use current AI collaborator stylesheet revision');
}
// Shared Chinese section navigation must use the same readable labels as
// Records, and should never fall back to Studio's browser-language router.
for(const section of ['about','support','records']){
 const page=section+'/zh-cn/index.html';
 const html=load(page);
 const navs=[...html.matchAll(/<nav class="(?:site-nav|footer-links)"[^>]*>[\\s\\S]*?<\\/nav>/g)].map(m=>m[0]);
 if(navs.length!==2){warn(page+' should have header and footer navigation');continue;}
 const labels={
  '../../?lang=zh-CN':'首页',
  '../../catalog/zh-cn/':'音频插件',
  '../../studio/official/zh-cn/':'Studio',
  '../../utilities/?lang=zh-CN':'实用工具',
  '../../records/zh-cn/':'Records',
  '../../goods/?lang=zh-CN':'周边',
  '../../about/zh-cn/':'关于',
  '../../support/zh-cn/':'支持',
  './':{about:'关于',support:'支持',records:'Records'}[section]
 };
 for(const nav of navs){
  if(nav.includes('href="../../studio/"'))warn(page+' Studio should link directly to zh-CN');
  for(const match of nav.matchAll(/<a\\b([^>]*)>([^<]+)<\\/a>/g)){
   const href=attribute(match[1],'href');
   const label=match[2].trim();
   if(!(href in labels))warn(page+' unexpected locale navigation target '+href);
   else if(label!==labels[href])warn(page+' '+href+' expected '+labels[href]+' but got '+label);
  }
 }
 if(!navs[1].includes('aria-label="页脚导航"'))warn(page+' footer aria-label not localized');
}
assert.deepEqual(errors,[],'zh-CN canonical, reciprocal alternate and navigation audit');
console.log('zh-CN SEO and reciprocity QA: PASS ('+checked+' Chinese pages, '+alternateChecks+' reciprocal language links)');

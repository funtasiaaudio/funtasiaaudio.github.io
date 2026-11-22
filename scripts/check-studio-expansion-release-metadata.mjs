#!/usr/bin/env node
// Pin official GitHub Releases metadata for the five staged Studio packs,
// verify the actual download/license hrefs on all three locale pages.
// --remote additionally compares release asset name, size and GitHub SHA-256 via
// the GitHub Releases REST API. This does not download the 650 MB orchestral ZIP.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync('docs/studio-expansion-release-pins.json','utf8'));
assert.equal(manifest.schema,'funtasia-studio-expansion-release-pins-v1');
assert.equal(manifest.packs.length,5);
const langs=['zh-cn','','ja'];
const paths=langs.map(lang=>
  'studio/official/expansions/'+(lang?lang+'/':'')+'index.html');
const errors=[];
let linksChecked=0;
const details=[];
for(const page of paths){
 const html=fs.readFileSync(page,'utf8');
 const cards=[...html.matchAll(/<article class="expansion-card"([^>]+)>[\s\S]*?<\/article>/g)];
 if(cards.length!==5){errors.push(page+': expected 5 cards, got '+cards.length);continue;}
 for(let i=0;i<manifest.packs.length;i++){
  const m=manifest.packs[i],card=cards[i][0];
  const repoBase='https://github.com/funtasiaaudio/'+m.repo+
    '/releases/download/'+m.tag+'/';
  const expected=repoBase+m.zip;
  const hrefs=[...card.matchAll(/\bhref="([^"]+)"/g)].map(x=>x[1]);
  const zipHrefs=hrefs.filter(x=>/\.zip(?:[?#].*)?$/.test(x));
  if(zipHrefs.length!==1||zipHrefs[0]!==expected)
   errors.push(page+' card '+i+' ZIP mismatch: '+zipHrefs.join(', '));
  if(m.license && !hrefs.includes(repoBase+m.license))
   errors.push(page+' card '+i+' official license asset link missing: '+m.license);
  const order=card.match(/\bdata-pack-order="(\d+)"/)?.[1];
  if(order!==String(i))errors.push(page+' unexpected card order '+i+': '+order);
  if(!card.includes('v1.0.0'))
   errors.push(page+' missing release version in '+m.key);
  linksChecked++;
 }
}
for(const m of manifest.packs){
 assert.ok(/^[0-9a-f]{64}$/.test(m.sha256),'Invalid SHA-256 pin for '+m.key);
 assert.ok(Number.isSafeInteger(m.bytes)&&m.bytes>0,'Invalid size for '+m.key);
}
assert.deepEqual(errors,[],'Studio expansion download or license URL parity failed');
console.log('Studio 5-pack release page source QA: PASS ('+linksChecked+
  ' localized pack cards, 5 pinned ZIP names, 3 exposed license asset links per locale)');

if(process.argv.includes('--remote')){
 const token=process.env.GH_TOKEN||'';
 for(const m of manifest.packs){
  const url='https://api.github.com/repos/funtasiaaudio/'+m.repo+
    '/releases/tags/'+encodeURIComponent(m.tag);
  const response=await fetch(url,{headers:{
    'Accept':'application/vnd.github+json',
    'X-GitHub-Api-Version':'2022-11-28',
    'User-Agent':'FUNtasia-Studio-Release-QA',
    ...(token?{'Authorization':'Bearer '+token}:{})
  },signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error(m.key+' GitHub API '+response.status+' '+url);
  const release=await response.json();
  const a=(release.assets||[]).find(x=>x.name===m.zip);
  assert.ok(a,m.key+' official '+m.zip+' release asset missing');
  assert.equal(a.size,m.bytes,m.key+' release ZIP byte size differs');
  assert.equal(a.digest,'sha256:'+m.sha256,m.key+' official SHA-256 differs');
  if(m.license){
   assert.ok((release.assets||[]).some(x=>x.name===m.license),
     m.key+' external release license asset missing');
  }
  details.push({pack:m.key,asset:m.zip,bytes:a.size,sha256:a.digest});
  console.log(m.key+': official release metadata matches size + SHA-256 ('+a.size+' bytes)');
 }
 console.log('Studio 5-pack official GitHub Releases metadata: PASS (5 ZIP sizes/digests and release license assets)');
}

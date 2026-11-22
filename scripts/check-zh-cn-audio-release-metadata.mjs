#!/usr/bin/env node
// Review-only audit: release ZIP links and displayed versions for all 34 Audio
// products across six catalog locales; --remote verifies official GitHub asset
// metadata. It does not download binaries, establish latest versions or test China.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {products,schema}=JSON.parse(fs.readFileSync('docs/zh-cn-audio-release-pins.json','utf8'));
assert.equal(schema,'funtasia-audio-catalog-release-pins-v1');
assert.equal(products.length,34);
const locales=['ja','en','de','fr','ru','zh-cn'];
const expectedUrl=p=>'https://github.com/funtasiaaudio/'+p.repository+
  '/releases/download/'+encodeURIComponent(p.tag)+'/'+encodeURIComponent(p.asset);
const failures=[];
let cardsChecked=0,linksChecked=0;
for(const lang of locales){
  const path='catalog/'+lang+'/index.html';
  const html=fs.readFileSync(path,'utf8');
  const cards=[...html.matchAll(/<article\b[^>]*data-product-name="([^"]+)"[^>]*>[\s\S]*?<\/article>/g)]
    .map(m=>({name:m[1],html:m[0]}));
  if(cards.length!==34){failures.push(path+': expected 34 cards, got '+cards.length);continue;}
  for(let i=0;i<34;i++){
    const p=products[i],card=cards[i],label=lang+' / '+p.name;
    if(card.name!==p.name)failures.push(label+': product order/name is now '+card.name);
    const version=card.html.match(/\bdata-version="([^"]+)"/)?.[1];
    if(version!==p.version)failures.push(label+': displayed version '+version+' differs from '+p.version);
    const hrefs=[...card.html.matchAll(/\bhref="(https:\/\/github\.com\/funtasiaaudio\/[^"]+?\.zip)"/g)]
      .map(m=>m[1]);
    if(hrefs.length!==(p.name==='FUN Dither'?2:1))
      failures.push(label+': unexpected number of ZIP CTAs '+hrefs.length);
    for(const href of hrefs){
      if(href!==expectedUrl(p))failures.push(label+': ZIP URL mismatch '+href);
      linksChecked++;
    }
    cardsChecked++;
  }
}
for(const p of products){
  if(!Number.isSafeInteger(p.bytes)||p.bytes<=0)
    failures.push(p.name+': invalid pinned file size');
  if(!/^[a-f0-9]{64}$/.test(p.sha256))
    failures.push(p.name+': invalid pinned SHA-256');
}
assert.deepEqual(failures,[],'Audio release catalog link/version parity');
console.log('FUNtasia Audio ZIP URL parity: PASS ('+cardsChecked+
  ' cards, '+linksChecked+' ZIP links, six locales, 34 verified metadata pins)');

if(process.argv.includes('--remote')){
  const token=process.env.GH_TOKEN||'';
  let cursor=0;
  const verified=[],errors=[];
  async function worker(){
    while(cursor<products.length){
      const p=products[cursor++];
      const api='https://api.github.com/repos/funtasiaaudio/'+p.repository+
        '/releases/tags/'+encodeURIComponent(p.tag);
      try{
        const resp=await fetch(api,{headers:{
          Accept:'application/vnd.github+json',
          'X-GitHub-Api-Version':'2022-11-28',
          'User-Agent':'FUNtasia-Audio-Release-Integrity',
          ...(token?{Authorization:'Bearer '+token}:{})
        },signal:AbortSignal.timeout(25000)});
        if(!resp.ok)throw Error('GitHub API HTTP '+resp.status);
        const release=await resp.json();
        if(release.tag_name!==p.tag)throw Error('release tag mismatch');
        const asset=(release.assets||[]).find(a=>a.name===p.asset);
        if(!asset)throw Error('ZIP asset missing: '+p.asset);
        if(asset.size!==p.bytes)throw Error('size mismatch: '+asset.size);
        if(asset.digest!=='sha256:'+p.sha256)
          throw Error('SHA-256 mismatch: '+asset.digest);
        if(asset.browser_download_url!==expectedUrl(p))
          throw Error('official download URL mismatch: '+asset.browser_download_url);
        verified.push(p.name);
        console.log('Official release: '+p.name+' '+p.tag+' ('+asset.size+' bytes)');
      }catch(e){errors.push(p.name+': '+e.message+' ['+api+']');}
    }
  }
  await Promise.all(Array.from({length:4},()=>worker()));
  assert.deepEqual(errors,[],'Official GitHub release metadata verification failed');
  assert.equal(verified.length,34,'Not all 34 official assets were checked');
  console.log('FUNtasia Audio GitHub release metadata: PASS (34 assets, URLs, bytes and SHA-256)');
}

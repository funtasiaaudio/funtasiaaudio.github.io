#!/usr/bin/env node
// Real Chromium restricted-network regression. All offsite requests are blocked.
// This is a local simulation, not proof of access from mainland-China networks.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { once } from 'node:events';
import { chromium } from 'playwright';

const root=process.cwd();
const dir=path.join(root,'artifacts','zh-cn-network-fallback');
await fs.mkdir(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp',
 '.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
const server=http.createServer(async(req,res)=>{
 try {
  const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(p.startsWith('/funtasia-audio/')){res.writeHead(204);res.end();return;}
  const target=path.resolve(root,'.'+p,p.endsWith('/')?'index.html':'');
  if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const data=await fs.readFile(target);
  res.writeHead(200,{'content-type':mime[path.extname(target).toLowerCase()]||'application/octet-stream'});
  res.end(data);
 }catch {res.writeHead(404);res.end('Not found');}
});
server.listen(0,'127.0.0.1');
await once(server,'listening');
const origin='http://127.0.0.1:'+server.address().port;
const widths=[1440,390];
const languages=['zh-cn','ja',''];
const failures=[],results=[];
let count=0,blocked=0;
function verify(ok,msg){count++;if(!ok)failures.push(msg);}
const browser=await chromium.launch({headless:true});
try{
 for(const width of widths){
  for(const lang of languages){
   const locale=lang==='zh-cn'?'zh-CN':lang||'en';
   const label=(lang||'en')+'-'+width;
   const ctx=await browser.newContext({viewport:{width,height:850},locale});
   await ctx.route('**/*',route=>{
    if(route.request().url().startsWith(origin+'/'))return route.continue();
    blocked++;return route.abort('failed');
   });
   const page=await ctx.newPage();
   const jsErrors=[];
   page.on('pageerror',e=>jsErrors.push(e.message));
   await page.goto(origin+'/studio/official/expansions/'+(lang?lang+'/':''),{waitUntil:'load'});
   const card=page.locator('.expansion-card');
   verify(await card.count()===5,label+': missing pack cards');
   for(let i=0;i<3;i++){
    const art=card.nth(i).locator('.expansion-art');
    const image=art.locator('img');
    await art.scrollIntoViewIfNeeded();
    await page.waitForFunction(i=>{
     const a=document.querySelectorAll('.expansion-card .expansion-art')[i];
     return a?.classList.contains('image-unavailable');
    },i,{timeout:8000});
    const info=await art.evaluate(el=>({
     className:el.className,role:el.getAttribute('role'),
     accessibleName:el.getAttribute('aria-label'),
     title:el.dataset.fallbackName,detail:el.dataset.fallbackHint,
     hidden:el.querySelector('img')?.hidden,
     height:el.getBoundingClientRect().height
    }));
    verify(info.role==='img',label+': cover fallback accessibility role absent');
    verify(!!info.accessibleName&&!!info.title&&!!info.detail,
     label+': cover fallback name/text missing');
    verify(info.hidden&&info.height>90,label+': cover fallback not visibly rendered');
    verify(!(await image.evaluate(el=>el.naturalWidth>0)),
     label+': external cover image unexpectedly loaded');
   }
   const local=card.nth(3).locator('img');
   await local.scrollIntoViewIfNeeded();
   verify(await local.evaluate(el=>el.complete&&el.naturalWidth>0),
     label+': local Epic Metal artwork failed under external blocking');
   const filter=page.locator('[data-pack-filter="midi"]');
   await filter.click();
   verify(await page.locator('.expansion-card[data-pack-type="midi"]:not([hidden])').count()===2,
     label+': filtering stopped working when external network blocked');
   verify(await page.locator('.expansion-card a.button.primary[href*="/releases/download/"]').count()===5,
     label+': official download hyperlinks unavailable when remote resources blocked');
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),
     label+': horizontal overflow under external blocking');
   verify(jsErrors.length===0,label+': local JavaScript error '+jsErrors.join(' | '));
   results.push({page:'expansions',lang:locale,width,mode:'offsite blocked',fallbackCovers:3,
    localArtwork:true,filters:true,blockedRequests:blocked});
   await page.close();
   await ctx.close();
  }
  // Main Chinese pages must retain actionable text without third-party networks.
  const ctx=await browser.newContext({viewport:{width,height:850},locale:'zh-CN'});
  await ctx.route('**/*',route=>{
   if(route.request().url().startsWith(origin+'/'))return route.continue();
   blocked++;return route.abort('failed');
  });
  const page=await ctx.newPage();
  for(const [key,p] of [
   ['home','/?lang=zh-CN'],['catalog','/catalog/zh-cn/'],
   ['studio','/studio/official/zh-cn/'],['about','/about/zh-cn/'],
   ['records','/records/zh-cn/'],['support','/support/zh-cn/'],
   ['study','/studio/official/zh-cn/study/']
  ]){
   const errors=[];const listener=e=>errors.push(e.message);
   page.on('pageerror',listener);
   await page.goto(origin+p,{waitUntil:'load'});
   verify(await page.locator('main h1').count()>=1,key+'-'+width+': primary heading not readable');
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),
     key+'-'+width+': horizontal overflow');
   verify(errors.length===0,key+'-'+width+': local JavaScript errors '+errors.join('; '));
   if(key==='catalog'){
    verify(await page.locator('article[data-product-name]').count()===34,
     'Catalog products lost when GTM/release hosts are blocked');
   }
   if(key==='about')verify(await page.getByRole('heading',{name:'Hʉeliang'}).count()>=1,
    'About profile text disappeared with external avatar blocked');
   page.off('pageerror',listener);
  }
  await ctx.close();
 }
 // No-JavaScript smoke: main content and the official download links must
 // still be present even when interactive sorting/filtering is not possible.
 const nojs=await browser.newContext({javaScriptEnabled:false,locale:'zh-CN'});
 await nojs.route('**/*',route=>
   route.request().url().startsWith(origin+'/')?route.continue():route.abort('failed'));
 const page=await nojs.newPage();
 await page.goto(origin+'/studio/official/expansions/zh-cn/',{waitUntil:'load'});
 verify(await page.locator('.expansion-card').count()===5,'No-JS hides static expansion cards');
 verify(await page.locator('.expansion-card a.button.primary[href*=".zip"]').count()===5,
  'No-JS hides all official ZIP download anchors');
 await nojs.close();
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
 await fs.writeFile(path.join(dir,'restricted-network-results.json'),
  JSON.stringify({assertions:count,blockedRequests:blocked,failures,results,
   scope:'local browser with all third-party requests aborted; not mainland-China or physical device testing'},null,2));
}
if(failures.length){
 console.error('External-host resilience failures:\n'+failures.slice(0,80).join('\n'));
 process.exitCode=1;
}else console.log('Chinese restricted-network graceful-degradation QA: PASS ('+
 count+' assertions, '+blocked+' aborted offsite requests, 3 locales x 2 widths + no-JS)');

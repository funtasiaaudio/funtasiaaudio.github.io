#!/usr/bin/env node
// Staged Simplified Chinese keyboard-navigation and 320 CSS-px reflow regression.
// Checks actual Chromium keyboard focus and interactive states, not simulated screen-reader speech.
// A 320px CSS viewport models 400% reflow of a 1280px layout; it is not physical browser zoom.
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { once } from 'node:events';
import { chromium } from 'playwright';

const root=process.cwd();
const artifactDir=path.join(root,'artifacts','zh-cn-keyboard-reflow');
await fs.mkdir(artifactDir,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
'.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
'.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp',
'.ico':'image/x-icon','.pdf':'application/pdf'};
const server=http.createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname.startsWith('/funtasia-audio/')){res.writeHead(204);res.end();return;}
  const target=path.resolve(root,'.'+pathname,pathname.endsWith('/')?'index.html':'');
  if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const bytes=await fs.readFile(target);
  res.writeHead(200,{'content-type':types[path.extname(target)]||'application/octet-stream'});
  res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(0,'127.0.0.1');
await once(server,'listening');
const origin='http://127.0.0.1:'+server.address().port;
const cases=[
 ['home','/?lang=zh-CN'],['audio','/catalog/zh-cn/'],
 ['monofilter','/catalog/zh-cn/fun-monofilter.html'],
 ['records','/records/zh-cn/'],['utilities','/utilities/?lang=zh-CN'],
 ['goods','/goods/?lang=zh-CN'],['about','/about/zh-cn/'],
 ['quality','/quality/zh-cn/'],['support','/support/zh-cn/'],
 ['studio','/studio/official/zh-cn/'],
 ['expansions','/studio/official/expansions/zh-cn/'],
 ['study','/studio/official/zh-cn/study/']
];
const widths=[1440,320];
const failures=[],results=[];
let assertions=0;
const verify=(ok,message)=>{assertions++;if(!ok)failures.push(message);};
const browser=await chromium.launch({headless:true});
const focusState=page=>page.evaluate(()=>{
 const el=document.activeElement;
 const r=el?.getBoundingClientRect();
 const style=el?getComputedStyle(el):null;
 return {
   element:el?.tagName||'',
   label:(el?.getAttribute('aria-label')||el?.textContent||el?.getAttribute('value')||'')
     .trim().slice(0,80),
   html:el?.outerHTML?.slice(0,210)||'',
   focusVisible:!!el?.matches(':focus-visible'),
   rect:r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}:null,
   viewport:{width:innerWidth,height:innerHeight},
   outline:style?{style:style.outlineStyle,width:style.outlineWidth,boxShadow:style.boxShadow}:null
 };
});
try{
 for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:860},locale:'zh-CN',reducedMotion:'reduce'});
  await context.route('**/*',route=>route.request().url().startsWith(origin+'/')
    ?route.continue():route.fulfill({status:204,body:''}));
  const page=await context.newPage();
  for(const [key,pathname] of cases){
   const label=key+'-'+width;
   try{
    await page.goto(origin+pathname,{waitUntil:'load'});
    await page.locator('main').waitFor({state:'visible'});
    const state=await page.evaluate(()=>({
     lang:document.documentElement.lang,
     scrollWidth:document.documentElement.scrollWidth,
     width:innerWidth,
     headingVisible:[...document.querySelectorAll('h1')].some(h=>{
       const r=h.getBoundingClientRect();
       return r.width>0 && r.height>0 && getComputedStyle(h).visibility!=='hidden';
     }),
     interactiveCount:document.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),summary').length
    }));
    verify(state.lang==='zh-CN',label+' incorrect document language');
    verify(state.headingVisible,label+' primary heading missing or hidden');
    verify(state.scrollWidth<=width+2,label+' unexpected full-page horizontal scroll '+state.scrollWidth);
    verify(state.interactiveCount>0,label+' no interactive controls');
    const pathResult={page:key,width,document:state,keyboard:[],tasks:[]};
    const forwardTabs=Math.min(12,state.interactiveCount);
    for(let n=0;n<forwardTabs;n++){
     await page.keyboard.press('Tab');
     const focus=await focusState(page);
     pathResult.keyboard.push(focus);
     verify(!['BODY','HTML',''].includes(focus.element),
       label+' Tab '+(n+1)+' focus lost: '+JSON.stringify(focus));
     verify(focus.focusVisible,label+' Tab '+(n+1)+' does not match :focus-visible: '+focus.html);
     const rect=focus.rect;
     verify(!!rect && rect.width>0 && rect.height>0 &&
       rect.right>=-2 && rect.left<=width+2 &&
       rect.bottom>=-2 && rect.top<=860+2,
       label+' Tab '+(n+1)+' target not reachable in viewport: '+JSON.stringify(focus));
    }
    const reverseTabs=Math.min(4,Math.max(0,forwardTabs-1));
    for(let n=0;n<reverseTabs;n++){
     await page.keyboard.press('Shift+Tab');
     const focus=await focusState(page);
     verify(focus.focusVisible && !['BODY','HTML',''].includes(focus.element),
       label+' reverse Shift+Tab lost focus: '+JSON.stringify(focus));
    }
    if(key==='audio'){
     const trigger=page.locator('button.detail-btn').first();
     await trigger.focus();
     await page.keyboard.press('Enter');
     verify(await page.locator('dialog[open]').count()===1,label+' Enter did not open product detail');
     verify(await page.evaluate(()=>document.querySelector('dialog[open]')?.contains(document.activeElement)),
       label+' open dialog did not receive focus');
     for(let n=0;n<8;n++){
      await page.keyboard.press('Tab');
      const inside=await page.evaluate(()=>{
       const dialog=document.querySelector('dialog[open]');
       return {ok:!!dialog&&(document.activeElement===dialog||dialog.contains(document.activeElement)),
         active:document.activeElement?.outerHTML?.slice(0,280)||'',tag:document.activeElement?.tagName};
     });
     verify(inside.ok,label+' Tab escaped modal dialog on step '+n+': '+JSON.stringify(inside));
     }
     for(let n=0;n<8;n++){
      await page.keyboard.press('Shift+Tab');
      const inside=await page.evaluate(()=>{
        const dialog=document.querySelector('dialog[open]');
        return {ok:!!dialog&&(document.activeElement===dialog||dialog.contains(document.activeElement)),
          active:document.activeElement?.outerHTML?.slice(0,280)||'',tag:document.activeElement?.tagName};
      });
      verify(inside.ok,label+' Shift+Tab escaped modal dialog on step '+n+': '+JSON.stringify(inside));
     }
     await page.keyboard.press('Escape');
     verify(await page.locator('dialog[open]').count()===0,label+' Escape did not close dialog');
     verify(await trigger.evaluate(el=>document.activeElement===el),
       label+' focus did not return to dialog trigger');
     const search=page.locator('#product-search');
     await search.focus();
     await page.keyboard.type('FUN Plate');
     verify(await page.locator('[data-product-name]:not([hidden])').count()>0,
       label+' typed catalog search did not reveal matching card');
     pathResult.tasks.push('dialog Enter/Tab/Shift+Tab/Escape/focus return; typed search');
     // Shared catalog.js runs on all locales; verify the fix does not break JA/EN.
     for(const otherLocale of ['ja','en']){
      await page.goto(origin+'/catalog/'+otherLocale+'/',{waitUntil:'load'});
      const otherTrigger=page.locator('button.detail-btn').first();
      await otherTrigger.focus();
      await page.keyboard.press('Enter');
      verify(await page.locator('dialog[open]').count()===1,
        label+' '+otherLocale+' dialog did not open via Enter');
      for(const [direction,keyPress] of [['forward','Tab'],['reverse','Shift+Tab']]){
       for(let n=0;n<6;n++){
        await page.keyboard.press(keyPress);
        verify(await page.evaluate(()=>{
          const d=document.querySelector('dialog[open]');
          return !!d&&(document.activeElement===d||d.contains(document.activeElement));
        }),label+' '+otherLocale+' '+direction+' tab '+n+' escaped native modal');
       }
      }
      await page.keyboard.press('Escape');
      verify(await page.locator('dialog[open]').count()===0,label+' '+otherLocale+' dialog did not close');
      verify(await otherTrigger.evaluate(el=>document.activeElement===el),
        label+' '+otherLocale+' dialog did not return focus to trigger');
     }
     pathResult.tasks.push('JA/EN shared dialog modal keyboard-focus regressions');

    }
    if(key==='expansions'){
     const midi=page.locator('[data-pack-filter="midi"]');
     await midi.focus();
     await page.keyboard.press('Space');
     verify(await midi.getAttribute('aria-pressed')==='true',label+' Space did not activate MIDI filter');
     verify(await page.locator('.expansion-card[data-pack-type="midi"]:not([hidden])').count()===2,
       label+' MIDI filter should reveal 2 existing packs');
     const empty=page.locator('[data-pack-filter="library"]');
     await empty.focus();
     await page.keyboard.press('Enter');
     verify(await empty.getAttribute('aria-pressed')==='true',label+' Enter did not activate empty category');
     verify(await page.locator('.expansion-card:not([hidden])').count()===0,
       label+' empty library filter should hide all packs');
     pathResult.tasks.push('MIDI filter via Space; empty-library filter via Enter');
    }
    results.push(pathResult);
    console.log(label+': '+forwardTabs+' forward Tabs + '+reverseTabs+' reverse Tabs, 320px reflow '+(state.scrollWidth<=width+2?'PASS':'FAIL'));
   }catch(e){
    failures.push(label+' test execution failed: '+(e.stack||e.message));
   }
  }
  await context.close();
 }
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
 await fs.writeFile(path.join(artifactDir,'keyboard-reflow.json'),
    JSON.stringify({assertions,failures,results,limits:'Automated Chromium keyboard/reflow checks, not real screen-reader or browser zoom',widths},null,2));
}
if(failures.length){
 console.error('Keyboard/reflow failures:\n'+failures.slice(0,95).join('\n'));
 process.exitCode=1;
}else console.log('Simplified Chinese keyboard and 320px reflow QA: PASS ('+assertions+' assertions, 12 pages x 2 widths)');

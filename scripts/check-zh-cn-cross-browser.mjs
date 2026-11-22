#!/usr/bin/env node
// Cross-engine QA: Firefox and WebKit are browser-engine simulations on Linux,
// not real physical Safari/iPhone or Firefox on a user device.
// External URLs are blocked and no live GTM/GA4 events are transmitted.
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { once } from 'node:events';
import { firefox, webkit } from 'playwright';

const root=process.cwd(),dir=path.join(root,'artifacts','zh-cn-cross-browser');
await fs.mkdir(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.json':'application/json',
 '.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg',
 '.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
const server=http.createServer(async(req,res)=>{
 try{
  const uri=new URL(req.url,'http://localhost');
  const pathname=decodeURIComponent(uri.pathname);
  if(pathname.startsWith('/funtasia-audio/')){
    res.writeHead(204);res.end();return;
  }
  const file=path.resolve(root,'.'+pathname,pathname.endsWith('/')?'index.html':'');
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const bytes=await fs.readFile(file);
  res.writeHead(200,{'content-type':mime[path.extname(file).toLowerCase()]||'application/octet-stream'});
  res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(0,'127.0.0.1');
await once(server,'listening');
const origin='http://127.0.0.1:'+server.address().port;
const cases=[
 ['home','/?lang=zh-CN'],
 ['audio','/catalog/zh-cn/'],
 ['monofilter','/catalog/zh-cn/fun-monofilter.html'],
 ['records','/records/zh-cn/'],
 ['utilities','/utilities/?lang=zh-CN'],
 ['goods','/goods/?lang=zh-CN'],
 ['about','/about/zh-cn/'],
 ['quality','/quality/zh-cn/'],
 ['support','/support/zh-cn/'],
 ['studio','/studio/official/zh-cn/'],
 ['expansions','/studio/official/expansions/zh-cn/'],
 ['study','/studio/official/zh-cn/study/']
];
const viewports=[{width:1440,height:900},{width:390,height:844},{width:320,height:780}];
const report={scope:'Linux Playwright Firefox/WebKit engine compatibility, not actual Safari/iOS or physical mobile devices',
  engines:['firefox','webkit'],viewports,scans:[],failures:[],assertions:0};
const verify=(value,what)=>{report.assertions++;if(!value)report.failures.push(what);};
try{
 for(const [engineName,engine] of [['firefox',firefox],['webkit',webkit]]){
  const browser=await engine.launch({headless:true});
  try{
   for(const viewport of viewports){
    const context=await browser.newContext({viewport,locale:'zh-CN',reducedMotion:'reduce'});
    await context.route('**/*',route=>
      route.request().url().startsWith(origin+'/')?route.continue():route.fulfill({status:204,body:''}));
    const page=await context.newPage();
    const pageErrors=[];
    page.on('pageerror',error=>pageErrors.push(error.message));
    for(const [key,pathname] of cases){
     const id=engineName+'-'+key+'-'+viewport.width;
     pageErrors.length=0;
     try{
      const resp=await page.goto(origin+pathname,{waitUntil:'load',timeout:25000});
      verify(resp?.status()===200,id+' HTTP response not 200');
      await page.locator('main').waitFor({state:'visible',timeout:9000});
      const state=await page.evaluate(()=>{
       const h1=[...document.querySelectorAll('h1')].filter(x=>{
        const r=x.getBoundingClientRect(),s=getComputedStyle(x);
        return r.width>0&&r.height>0&&s.visibility!=='hidden';
       });
       return {lang:document.documentElement.lang,title:document.title,
        h1Count:h1.length,mainCount:document.querySelectorAll('main').length,
        scrollWidth:document.documentElement.scrollWidth,
        viewportWidth:document.documentElement.clientWidth,
        interactiveCount:document.querySelectorAll('a[href],button,input,select').length};
      });
      verify(state.title.length>=5,id+' missing document title');
      verify(state.mainCount===1,id+' missing/duplicated main landmark');
      verify(state.h1Count===1,id+' missing/duplicated visible h1');
      verify(state.interactiveCount>=2,id+' controls absent');
      verify(state.scrollWidth<=state.viewportWidth+2,
        id+' horizontal overflow '+state.scrollWidth+' CSS px > '+state.viewportWidth);
      if(!['home','utilities','goods'].includes(key))
       verify(state.lang==='zh-CN',id+' wrong declared locale '+state.lang);
      const actions=[];
      if(key==='audio'){
       const search=page.locator('#product-search');
       await search.fill('FUN Plate');
       const visible=page.locator('article[data-product-name]:visible');
       verify((await visible.count())>=1,id+' catalog search did not return result');
       const trigger=page.locator('button.detail-btn:visible').first();
       verify((await trigger.count())===1,id+' detail trigger missing after search');
       if(await trigger.count()){
        await trigger.focus();
        await page.keyboard.press('Enter');
        verify(await page.locator('dialog[open]').count()===1,id+' Enter did not open modal');
        verify(await page.evaluate(()=>{
         const d=document.querySelector('dialog[open]');
         return !!d&&(document.activeElement===d||d.contains(document.activeElement));
        }),id+' modal initial focus escaped');
        for(let step=0;step<5;step++){
         await page.keyboard.press('Tab');
         verify(await page.evaluate(()=>{
          const d=document.querySelector('dialog[open]');
          return !!d&&(document.activeElement===d||d.contains(document.activeElement));
         }),id+' modal Tab '+step+' escaped');
        }
        await page.keyboard.press('Escape');
        verify(await page.locator('dialog[open]').count()===0,id+' modal Escape failed');
        verify(await trigger.evaluate(el=>document.activeElement===el),
         id+' focus not restored to modal trigger');
       }
       actions.push('catalog search, Enter modal, five Tabs, Escape, focus return');
      }
      if(key==='expansions'){
       const filter=page.locator('[data-pack-filter="midi"]');
       await filter.focus();
       await page.keyboard.press('Space');
       verify(await filter.getAttribute('aria-pressed')==='true',
         id+' MIDI filter keyboard activation failed');
       verify(await page.locator('.expansion-card[data-pack-type="midi"]:visible').count()===2,
         id+' MIDI filter did not show both published packs');
       const sort=page.locator('[data-pack-sort]');
       await sort.selectOption('name');
       verify(await sort.inputValue()==='name',id+' sort selection not retained');
       const first=await page.locator('.expansion-card:visible h3').first().textContent();
       verify(!!first?.trim(),id+' sorted expansion title missing');
       actions.push('MIDI filter with Space, name sort');
      }
      if(['audio','studio','expansions'].includes(key)&&viewport.width===390){
       await page.screenshot({path:path.join(dir,id+'.png'),fullPage:false,animations:'disabled'});
      }
      verify(pageErrors.length===0,id+' JavaScript exceptions '+pageErrors.join('; '));
      report.scans.push({id,url:pathname,...state,actions,jsErrors:[...pageErrors]});
      console.log(id+': '+state.interactiveCount+' controls, scrollWidth '+state.scrollWidth+
        ', visible h1 '+state.h1Count+', actions '+actions.join('; '));
     }catch(e){
      report.failures.push(id+' execution error '+(e.stack||e.message));
     }
    }
    await context.close();
   }
  }finally{await browser.close();}
 }
}finally{
 await new Promise(resolve=>server.close(resolve));
 await fs.writeFile(path.join(dir,'report.json'),JSON.stringify(report,null,2));
}
console.log('Firefox/WebKit cross-browser QA: '+(report.failures.length?'FAIL':'PASS')+
  ' ('+report.scans.length+' scans, '+report.assertions+' assertions, '+
  report.failures.length+' failures)');
if(report.failures.length){
 console.error(report.failures.slice(0,80).join('\n'));
 process.exitCode=1;
}

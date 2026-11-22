#!/usr/bin/env node
// Chromium + axe-core automated rule audit. Not a formal WCAG/assistive-technology review.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require=createRequire(import.meta.url);
const axeScript=require.resolve('axe-core/axe.min.js');
const root=process.cwd();
const dir=path.join(root,'artifacts','zh-cn-accessibility');
await fs.mkdir(dir,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
 '.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
const server=http.createServer(async (req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(p.startsWith('/funtasia-audio/')){res.writeHead(204);res.end();return;}
  const t=path.resolve(root,'.'+p,p.endsWith('/')?'index.html':'');
  if(!t.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const data=await fs.readFile(t);
  res.writeHead(200,{'content-type':types[path.extname(t).toLowerCase()]||'application/octet-stream'});
  res.end(data);
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
const viewports=[{width:1440,height:900},{width:390,height:844}];
const tags=['wcag2a','wcag2aa','wcag21a','wcag21aa'];
const report={scope:'Automated axe-core WCAG 2.0/2.1 A+AA checks; not human conformance certification',
 axeVersion:null,viewports,scans:[],totals:{violations:0,affectedElements:0,incompleteGroups:0}};
const failures=[];
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of viewports){
  const context=await browser.newContext({viewport,locale:'zh-CN',reducedMotion:'reduce'});
  await context.route('**/*',route=>
   route.request().url().startsWith(origin+'/')?route.continue():route.fulfill({status:204,body:''}));
  const page=await context.newPage();
  for(const [key,p] of cases){
   const label=key+'-'+viewport.width;
   try{
    await page.goto(origin+p,{waitUntil:'load'});
    await page.locator('main').waitFor({state:'visible',timeout:8000});
    await page.evaluate(()=>document.fonts.ready);
    await page.addScriptTag({path:axeScript});
    const result=await page.evaluate(async tags=>{
     const a=await window.axe.run(document,{runOnly:{type:'tag',values:tags}});
     return {version:window.axe.version,
      violations:a.violations.map(v=>({rule:v.id,impact:v.impact,help:v.help,
       url:v.helpUrl,count:v.nodes.length,
       nodes:v.nodes.slice(0,30).map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))})),
      incomplete:a.incomplete.map(v=>({rule:v.id,count:v.nodes.length}))};
    },tags);
    report.axeVersion=result.version;
    report.scans.push({page:key,path:p,viewport:viewport.width,...result});
    const affected=result.violations.reduce((n,v)=>n+v.count,0);
    report.totals.violations+=result.violations.length;
    report.totals.affectedElements+=affected;
    report.totals.incompleteGroups+=result.incomplete.length;
    for(const v of result.violations){
     failures.push(label+': '+v.rule+' ('+v.impact+', '+v.count+' elements): '+
      JSON.stringify(v.nodes.slice(0,4).map(n=>n.target)));
    }
    console.log(label+': '+result.violations.length+' rule violations, '+affected+' affected elements; '+result.incomplete.length+' incomplete rule groups');
   }catch(e){failures.push(label+': scan failed '+(e.stack||e.message));}
  }
  await context.close();
 }
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
 await fs.writeFile(path.join(dir,'axe-results.json'),JSON.stringify({...report,failures},null,2));
}
console.log('axe-core '+report.axeVersion+': '+report.scans.length+
 ' page/viewport scans, '+report.totals.violations+' violation instances, '+
 report.totals.affectedElements+' affected elements');
if(failures.length){
 console.error('Accessibility findings:\n'+failures.slice(0,120).join('\n'));
 process.exitCode=1;
}else console.log('Chinese automated WCAG 2.0/2.1 A+AA rules PASS (not a human WCAG certificate)');

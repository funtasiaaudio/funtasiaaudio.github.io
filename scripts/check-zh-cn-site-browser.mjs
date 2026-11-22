#!/usr/bin/env node
// Chromium QA for Chinese FUNtasia home, Audio, Records, Utilities, Goods and support pages.
// All site assets are served from a local preview; external services and downloads are not fetched.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { once } from 'node:events';
import { chromium } from 'playwright';

const root = process.cwd();
const dir = path.join(root, 'artifacts', 'zh-cn-site-browser');
await fs.mkdir(dir, {recursive:true});
const types = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.png':'image/png', '.svg':'image/svg+xml',
  '.webp':'image/webp', '.ico':'image/x-icon', '.jpeg':'image/jpeg',
  '.jpg':'image/jpeg', '.pdf':'application/pdf'
};
const server = http.createServer(async (req, res) => {
  try {
    const requested = decodeURIComponent(new URL(req.url, 'http://local').pathname);
    // Legacy funtasia-audio is a different GitHub Pages project, not part of this checkout.
    if(requested.startsWith('/funtasia-audio/')) {
      res.writeHead(204); res.end(); return;
    }
    const target = path.resolve(root, '.'+requested, requested.endsWith('/')?'index.html':'');
    if (!target.startsWith(root+path.sep)) {res.writeHead(403);res.end();return;}
    const bytes = await fs.readFile(target);
    res.writeHead(200,{'content-type':types[path.extname(target).toLowerCase()]||'application/octet-stream',
      'cache-control':'no-store'});
    res.end(bytes);
  } catch {
    res.writeHead(404);res.end('Not found');
  }
});
server.listen(0,'127.0.0.1');
await once(server,'listening');
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true});
const failures=[],report=[];
let checks=0;
function verify(value,message){checks++; if(!value) failures.push(message);}
function relativeTarget(href){return new URL(href,origin).pathname;}
const paths=[
  ['home','/?lang=zh-CN'],
  ['audio','/catalog/zh-cn/'],
  ['monofilter','/catalog/zh-cn/fun-monofilter.html'],
  ['records','/records/zh-cn/'],
  ['utilities','/utilities/?lang=zh-CN'],
  ['goods','/goods/?lang=zh-CN'],
  ['about','/about/zh-cn/'],
  ['quality','/quality/zh-cn/'],
  ['support','/support/zh-cn/']
];
const sizes=[
  {width:1440,height:900},
  {width:390,height:844},
  {width:320,height:720}
];
try {
  for(const viewport of sizes){
    // English UI locale deliberately tests the explicit ?lang=zh-CN override.
    const context=await browser.newContext({viewport,locale:'en-US',reducedMotion:'reduce'});
    await context.route('**/*',route=>route.request().url().startsWith(origin+'/')
      ?route.continue():route.fulfill({status:204,body:''}));
    const page=await context.newPage();
    let pageErrors=[],missing=[];
    page.on('pageerror',error=>pageErrors.push(error.message));
    page.on('response',response=>{
      const u=response.url();
      if(u.startsWith(origin+'/') && !u.includes('/funtasia-audio/') && response.status()>=400)
        missing.push(response.status()+' '+new URL(u).pathname);
    });
    for(const [key,pathname] of paths){
      pageErrors=[];missing=[];
      await page.goto(origin+pathname,{waitUntil:'load'});
      await page.locator('main').waitFor({state:'visible'});
      await page.evaluate(()=>document.fonts.ready);
      const state=await page.evaluate(()=>{
        const nav=[...document.querySelectorAll('header nav a,header .nav a')]
          .filter(a=>{const r=a.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(a).display!=='none';})
          .map(a=>{const r=a.getBoundingClientRect();return {label:a.textContent.trim().slice(0,32),left:r.left,right:r.right};});
        const broken=[...document.images].filter(im=>im.complete&&im.naturalWidth===0 &&
          im.currentSrc.startsWith(location.origin+'/') && !new URL(im.currentSrc).pathname.startsWith('/funtasia-audio/'))
          .map(im=>im.getAttribute('src'));
        return {
          lang:document.documentElement.lang,
          title:document.title,
          width:document.documentElement.scrollWidth,
          viewport:innerWidth,
          nav,broken,
          headings:document.querySelectorAll('h1').length,
        };
      });
      const label=key+'-'+viewport.width;
      verify(state.lang==='zh-CN',label+' language should be zh-CN: '+state.lang);
      verify(state.headings===1,label+' should have one h1: '+state.headings);
      verify(state.width<=viewport.width+2,label+' document overflow: '+state.width+' > '+viewport.width);
      for(const anchor of state.nav)
        verify(anchor.left>=-2&&anchor.right<=viewport.width+2,label+' nav overflow: '+JSON.stringify(anchor));
      verify(state.broken.length===0,label+' broken local images: '+JSON.stringify(state.broken));
      verify(pageErrors.length===0,label+' JS errors: '+pageErrors.join('; '));
      verify(missing.length===0,label+' missing local resources: '+missing.join('; '));
      report.push({key,viewport:viewport.width,...state});
      await page.screenshot({path:path.join(dir,label+'.png'),
        fullPage:false,animations:'disabled'});

      if(key==='home'){
        verify(await page.locator('#home-language').inputValue()==='zh-CN',label+' home switch');
        verify(relativeTarget(await page.locator('#audio').getAttribute('href'))==='/catalog/zh-cn/',label+' Audio link');
        verify(relativeTarget(await page.locator('#records').getAttribute('href'))==='/records/zh-cn/',label+' Records link');
        verify(relativeTarget(await page.locator('#studio').getAttribute('href'))==='/studio/official/zh-cn/',label+' Studio link');
        verify(new URL(await page.locator('#utilities').getAttribute('href'),origin).searchParams.get('lang')==='zh-CN',label+' Utilities link');
        verify(new URL(await page.locator('#goods').getAttribute('href'),origin).searchParams.get('lang')==='zh-CN',label+' Goods link');
        await page.locator('#home-language').selectOption('en');
        verify(documentNeverThrows(await page.locator('#studio').getAttribute('href')).endsWith('/official/'),label+' English Studio fallback');
        await page.locator('#home-language').selectOption('zh-CN');
        verify(relativeTarget(await page.locator('#studio').getAttribute('href'))==='/studio/official/zh-cn/',label+' Chinese language switch restores Studio');
      }
      if(key==='audio'){
        const cards=page.locator('[data-product-name]');
        verify(await cards.count()===34,label+' expected 34 catalog products');
        const count=await page.locator('#product-count').textContent();
        verify(count.includes('34'),label+' total product counter: '+count);
        await page.locator('[data-filter="effect"]').click();
        const effectCount=await page.locator('[data-product-name]:not([hidden])').count();
        verify(effectCount>0&&effectCount<34,label+' effects filter '+effectCount);
        await page.locator('[data-filter="all"]').click();
        await page.locator('#product-search').fill('FUN Plate');
        const matched=await page.locator('[data-product-name]:not([hidden])').count();
        verify(matched>=1&&matched<34,label+' search results '+matched);
        await page.locator('#product-search').fill('ChineseQaUnlikelyNoMatch98765');
        verify(await page.locator('[data-product-name]:not([hidden])').count()===0,label+' search no-results');
        verify(await page.locator('#empty-state').isVisible(),label+' no-results state');
        await page.locator('#product-search').fill('');
        const dialogButton=page.locator('button.detail-btn').first();
        verify(await dialogButton.count()>0,label+' detail dialog button generated');
        if(await dialogButton.count()){
          await dialogButton.click();
          verify(await page.locator('dialog[open]').count()>0,label+' detail dialog opens');
          await page.keyboard.press('Escape');
          verify(await page.locator('dialog[open]').count()===0,label+' Escape closes dialog');
        }
        const nav=page.locator('header .catalog-site-nav');
        verify((await nav.locator('a[href*="records/zh-cn/"]').count())>0,label+' Chinese Records nav');
        verify((await nav.locator('a[href*="studio/official/zh-cn/"]').count())>0,label+' Chinese Studio nav');
        verify((await nav.locator('a[href*="utilities/?lang=zh-CN"]').count())>0,label+' Chinese Utilities nav');
        verify((await nav.locator('a[href*="goods/?lang=zh-CN"]').count())>0,label+' Chinese Goods nav');
      }
      if(key==='monofilter'){
        verify((await page.locator('main > p').first().textContent()).includes('低频'),
          label+' Chinese intro was not translated');
      }
      if(key==='utilities'||key==='goods'){
        verify(await page.locator('#section-language').inputValue()==='zh-CN',label+' section language selected');
        const cat=page.locator('a[href*="/catalog/zh-cn/"]').first();
        verify(await cat.count()>0,label+' link to Chinese Audio');
        await page.locator('#section-language').selectOption('en');
        verify((await page.locator('html').getAttribute('lang'))==='en',label+' English switch');
        await page.locator('#section-language').selectOption('zh-CN');
        verify(await page.locator('html').getAttribute('lang')==='zh-CN',label+' Chinese restored');
      }
      // Test errors generated during interactions as well as initial page load.
      verify(pageErrors.length===0,label+' interaction JS errors: '+pageErrors.join('; '));
    }
    await context.close();
  }
} catch(error) {
  failures.push('Uncaught browser test error: '+(error.stack||error.message));
} finally {
  await fs.writeFile(path.join(dir,'inspection.json'),JSON.stringify({checks,failures,report},null,2));
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
function documentNeverThrows(href){return new URL(href,origin).pathname;}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log('FUNtasia zh-CN whole-site Chromium QA: PASS ('+checks+' assertions, 9 pages x 3 viewports)');

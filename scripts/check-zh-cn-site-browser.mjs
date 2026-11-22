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
          .map(a=>{
            const r=a.getBoundingClientRect();
            let parent=a.parentElement;
            while(parent && parent!==document.body){
              const style=getComputedStyle(parent);
              if(['auto','scroll'].includes(style.overflowX) && parent.scrollWidth>parent.clientWidth+2) break;
              parent=parent.parentElement;
            }
            let reachable=false;
            const scrollable=!!parent && parent!==document.body;
            if(scrollable){
              const old=parent.scrollLeft, pr=parent.getBoundingClientRect();
              parent.scrollLeft=Math.max(0,Math.min(parent.scrollWidth-parent.clientWidth,
                old+(r.right-pr.right)));
              const shifted=a.getBoundingClientRect();
              reachable=shifted.left>=pr.left-2 && shifted.right<=pr.right+2;
              parent.scrollLeft=old;
            }
            return {label:a.textContent.trim().slice(0,32),left:r.left,right:r.right,
              scrollable,reachable};
          });
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
        verify((anchor.left>=-2&&anchor.right<=viewport.width+2) ||
            (anchor.scrollable && anchor.reachable),
            label+' nav not reachable in visible or scrollable menu: '+JSON.stringify(anchor));
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

        const utilityLabel=await page.locator('[data-filter="utility"]').textContent();
        verify(utilityLabel.trim()==='实用工具',label+' utility category wrongly says English-only');
        // Actual DOM verification at all 3 viewport widths, before filters hide cards.
        for(const id of [
          'nyan-buildup','the-hollow-winds','fun-pair',
          'fun-dynamics-pack','the-resonant-forge','basic-filter-pack'
        ]){
          const card=page.locator('article#'+id);
          const expected='https://funtasiaaudio.github.io/catalog/zh-cn/#'+id;
          const nativeCopy=await card.locator('.instagram-share-btn').getAttribute('data-share-url');
          verify(nativeCopy===expected,label+' '+id+' Instagram share should return to zh-CN');
          const rawIntent=await card.locator('.social-share-btn').getAttribute('href');
          const intent=new URL(rawIntent);
          verify(intent.searchParams.get('url')===expected,
            label+' '+id+' X share should return to zh-CN');
        }

        const enManualLinks=page.locator('article.card a[href$="_EN.pdf"]');
        verify(await enManualLinks.count()===5,label+' should have five known English PDF manuals');
        const enManualLabels=await enManualLinks.allTextContents();
        verify(enManualLabels.every(text=>text.trim()==='PDF 使用手册（英文）'),
          label+' English PDF language not disclosed: '+enManualLabels.join(' | '));
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
      if(key==='about'||key==='support'){
        const nav=page.locator('header .site-nav');
        for(const fragment of [
          '/catalog/zh-cn/','/studio/official/zh-cn/',
          '/utilities/?lang=zh-CN','/records/zh-cn/',
        ]){
          verify(await nav.locator('a[href*="'+fragment+'"]').count()>0,
            label+' missing Chinese navigation to '+fragment);
        }
        verify(await page.locator('a[href="../../records/zh-cn/"]').count()>0,
          label+' Chinese Records link not reachable');
        const recordsLink=nav.locator('a[href="../../records/zh-cn/"]').first();
        await recordsLink.click();
        verify(new URL(page.url()).pathname==='/records/zh-cn/',
          label+' clicking Chinese Records nav unexpectedly changed locale');
        await page.goBack({waitUntil:'load'});
        if(key==='about'){
          verify(await page.locator('main').innerText().then(t=>!t.includes('（英文）')),
            label+' stale English-label disclosure in translated About');
        }
        if(key==='support'){
          const jaLink=page.locator('.section-language-switch a[href="../"]');
          verify(await jaLink.count()===1,label+' missing Japanese Support language switch');
          await jaLink.click();
          verify(new URL(page.url()).pathname==='/support/',
            label+' Support Japanese language navigation failed');
          const zhLink=page.locator('.section-language-switch a[href="zh-cn/"]');
          verify(await zhLink.count()===1,label+' missing return Chinese Support link');
          await zhLink.click();
          verify(new URL(page.url()).pathname==='/support/zh-cn/',
            label+' Support Chinese language return failed');
        }
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


  // Check actual release artwork/download link and mobile layout in all 6 localized detail pages.
  for(const viewport of sizes){
    const context=await browser.newContext({viewport,locale:'en-US',reducedMotion:'reduce'});
    await context.route('**/*',route=>route.request().url().startsWith(origin+'/')
      ?route.continue():route.fulfill({status:204,body:''}));
    for(const lang of ['ja','en','de','fr','ru','zh-cn']){
      const page=await context.newPage();
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(origin+'/catalog/'+lang+'/fun-monofilter.html',{waitUntil:'load'});
      const snapshot=await page.evaluate(()=>{
        const image=document.querySelector('img.shot');
        const href=document.querySelector('a.btn.primary')?.getAttribute('href');
        return {
          lang:document.documentElement.lang,
          title:document.title,
          width:document.documentElement.scrollWidth,
          viewport:innerWidth,
          imageLoaded:!!image&&image.complete&&image.naturalWidth>0,
          href,footer:document.querySelector('footer')?.textContent||'',
          headings:document.querySelectorAll('h1').length
        };
      });
      const id='monofilter-'+lang+'-'+viewport.width;
      verify(snapshot.lang===(lang==='zh-cn'?'zh-CN':lang),id+' language incorrect');
      verify(snapshot.headings===1,id+' h1 missing or duplicate');
      verify(snapshot.width<=viewport.width+2,id+' page horizontal overflow');
      verify(snapshot.imageLoaded,id+' updated v1.1.0 image failed to load');
      verify(snapshot.href==='https://github.com/funtasiaaudio/FUN-MonoFilter/releases/download/v1.1.0/FUN.MonoFilter.1.1.0.zip',
        id+' release ZIP mismatch');
      verify(snapshot.footer.includes('v1.1.0'),id+' footer version mismatch');
      verify(errors.length===0,id+' browser errors '+errors.join('; '));
      report.push({key:'monofilter-'+lang,viewport:viewport.width,...snapshot});
      await page.screenshot({path:path.join(dir,id+'.png'),fullPage:false,animations:'disabled'});
      await page.close();
    }
    await context.close();
  }



  // Test query overrides, saved language and direct links across Home/Utilities/Goods.
  // An older stored 'en' choice must not break an explicit Chinese deep link.
  const localeContext=await browser.newContext({viewport:{width:390,height:844},
    locale:'en-US',reducedMotion:'reduce'});
  await localeContext.route('**/*',route=>route.request().url().startsWith(origin+'/')
    ?route.continue():route.fulfill({status:204,body:''}));
  const localePage=await localeContext.newPage();
  const localeIs=async(value,label)=>{
    verify(await localePage.locator('html').getAttribute('lang')===value,label+' html lang');
    verify(await localePage.locator('#section-language').inputValue()===value,
      label+' language picker');
  };
  await localePage.goto(origin+'/?lang=en',{waitUntil:'load'});
  await localePage.evaluate(()=>localStorage.setItem('funtasia.home.language','en'));
  await localePage.goto(origin+'/utilities/?lang=zh-CN',{waitUntil:'load'});
  await localeIs('zh-CN','Utilities explicit zh-CN overrides saved en');
  for(const target of ['studio/official/zh-cn/','about/zh-cn/','support/zh-cn/']){
    verify(await localePage.locator('a[href="../'+target+'"]').count()>0,
      'Utilities missing Chinese '+target);
  }
  await localePage.reload({waitUntil:'load'});
  await localeIs('zh-CN','Utilities Chinese reload');
  await localePage.locator('#section-language').selectOption('en');
  await localeIs('en','Utilities manual English choice');
  verify(new URL(localePage.url()).searchParams.get('lang')===null,
    'Manual language choice should clear the previous query');
  await localePage.reload({waitUntil:'load'});
  await localeIs('en','Utilities saved English on reload');
  await localePage.goto(origin+'/goods/?lang=zh-CN',{waitUntil:'load'});
  await localeIs('zh-CN','Goods explicit zh-CN overrides saved English');
  for(const target of ['studio/official/zh-cn/','about/zh-cn/','support/zh-cn/']){
    verify(await localePage.locator('a[href="../'+target+'"]').count()>0,
      'Goods missing Chinese '+target);
  }
  await localePage.locator('a[href="../about/zh-cn/"]').first().click();
  verify(new URL(localePage.url()).pathname==='/about/zh-cn/',
    'Goods to Chinese About navigation failed');
  verify(await localePage.locator('html').getAttribute('lang')==='zh-CN',
    'Goods to Chinese About changed language');
  await localePage.goto(origin+'/goods/?lang=zh-CN',{waitUntil:'load'});
  await localePage.reload({waitUntil:'load'});
  await localeIs('zh-CN','Goods explicit Chinese reload');
  await localePage.locator('#section-language').selectOption('zh-CN');
  verify(await localePage.evaluate(()=>
    localStorage.getItem('funtasia.home.language'))==='zh-CN',
    'Explicit Chinese selection did not persist');
  await localePage.goto(origin+'/utilities/',{waitUntil:'load'});
  await localeIs('zh-CN','Utilities saved Chinese without query');
  await localePage.goto(origin+'/',{waitUntil:'load'});
  verify(await localePage.locator('html').getAttribute('lang')==='zh-CN',
    'Home should load saved Chinese');
  verify(await localePage.locator('#studio').getAttribute('href')==='studio/official/zh-cn/',
    'Chinese home Studio route changed');
  await localePage.goto(origin+'/goods/?lang=ja',{waitUntil:'load'});
  await localeIs('ja','Japanese query overrides saved Chinese');
  verify(await localePage.locator('a[href="../about/zh-cn/"]').count()===0,
    'Japanese Goods should not link to Chinese About');
  verify(await localePage.locator('a[href="../support/zh-cn/"]').count()===0,
    'Japanese Goods should not link to Chinese Support');
  await localeContext.close();
  report.push({key:'locale-query-precedence-and-navigation',
    coverage:'Home, Utilities, Goods explicit locale, saved choice, reload and Chinese subpage links'});

  // Front-end GTM dataLayer event contract: a ZIP click is an intent, not proof of download.
  // Run with GTM remote JS blocked; only assert the site's own event payload and single firing.
  const analyticsContext=await browser.newContext({viewport:{width:1280,height:800},locale:'zh-CN'});
  await analyticsContext.route('**/*',route=>route.request().url().startsWith(origin+'/')
    ?route.continue():route.fulfill({status:204,body:''}));
  const analyticsPage=await analyticsContext.newPage();
  await analyticsPage.goto(origin+'/catalog/zh-cn/',{waitUntil:'load'});
  await analyticsPage.evaluate(()=>{
    document.addEventListener('click', event=>{
      if(event.target.closest?.('a[href]'))event.preventDefault();
    },true);
  });
  const customEvents=()=>analyticsPage.evaluate(()=>
    (window.dataLayer||[]).filter(x=>x && x.event==='funtasia_product_download_click')
  );
  verify(await analyticsPage.evaluate(()=>
    (window.dataLayer||[]).filter(x=>x && x.event==='gtm.js').length)===1,
    'Chinese Audio catalog should initialize GTM dataLayer once');
  const downloadLinks=analyticsPage.locator('article[data-product-name] a.mini-btn[href*="/releases/download/"]');
  verify(await downloadLinks.count()>=2,'Expected at least 2 direct public ZIP links for analytics QA');
  const firstProduct=await downloadLinks.first().evaluate(el=>({
    product_name:el.closest('[data-product-name]')?.dataset.productName||'',
    product_key:el.closest('[data-product-name]')?.dataset.productKey||'',
    download_url:el.href
  }));
  await downloadLinks.first().click();
  let observed=await customEvents();
  verify(observed.length===1,'One Chinese catalog ZIP click should create one event');
  verify(observed[0]?.site_language==='zh-CN','GTM event language incorrect');
  verify(observed[0]?.product_name===firstProduct.product_name && !!firstProduct.product_name,
    'GTM event product_name missing/mismatched');
  verify(observed[0]?.product_key===firstProduct.product_key && !!firstProduct.product_key,
    'GTM event product_key missing/mismatched');
  verify(observed[0]?.download_url===firstProduct.download_url &&
    firstProduct.download_url.startsWith('https://github.com/funtasiaaudio/'),
    'GTM event download_url incorrect');
  verify(Object.keys(observed[0]||{}).sort().join(',')===
    ['download_url','event','product_key','product_name','site_language'].sort().join(','),
    'GTM event unexpectedly adds personal data or changes contract');

  const manual=analyticsPage.locator('article[data-product-name] a.mini-btn[href$=".pdf"]').first();
  verify(await manual.count()>0,'Expected a public PDF manual link');
  if(await manual.count())await manual.click();
  verify((await customEvents()).length===1,
    'Manual PDF click must not be counted as a product ZIP download');
  const detailsButton=analyticsPage.locator('button.detail-btn').first();
  if(await detailsButton.count()){
    await detailsButton.click();
    verify((await customEvents()).length===1,'Opening product details must not count as download');
    await analyticsPage.keyboard.press('Escape');
  }
  await downloadLinks.nth(1).click();
  observed=await customEvents();
  verify(observed.length===2,'Two ZIP clicks must make exactly two events');
  verify(observed[1]?.product_name!==observed[0]?.product_name,
    'Second download should track its own distinct product metadata');
  await downloadLinks.first().focus();
  await analyticsPage.keyboard.press('Enter');
  observed=await customEvents();
  verify(observed.length===3,'Keyboard activation of ZIP link should fire one event');

  await analyticsPage.goto(origin+'/catalog/en/',{waitUntil:'load'});
  await analyticsPage.evaluate(()=>{
    document.addEventListener('click',event=>{
      if(event.target.closest?.('a[href]'))event.preventDefault();
    },true);
  });
  await analyticsPage.locator('article[data-product-name] a.mini-btn[href*="/releases/download/"]').first().click();
  verify((await customEvents()).length===0,
    'English catalog must not emit zh-CN-only custom analytics events');
  await analyticsContext.close();
  report.push({key:'analytics-front-end',assertions:'Chinese product ZIP click, keyboard, manual exclusion, metadata, English regression',transport:'GTM remote script intentionally blocked'});

  // Browser-language and query alias matrix: Simplified and Traditional must not be conflated.
  const localeCases = [
    ['zh', 'zh-CN'], ['zh-CN', 'zh-CN'],
    ['zh-Hans', 'zh-CN'], ['zh-SG', 'zh-CN'],
    ['zh-TW', 'en'], ['zh-HK', 'en'], ['zh-Hant', 'en']
  ];
  for(const [browserTag, expected] of localeCases){
    const context=await browser.newContext({viewport:{width:1024,height:768},locale:'en-US'});
    await context.addInitScript(tag => {
      Object.defineProperty(navigator,'language',{configurable:true,get:()=>tag});
      Object.defineProperty(navigator,'languages',{configurable:true,get:()=>[tag]});
    }, browserTag);
    await context.route('**/*',route=>route.request().url().startsWith(origin+'/')
      ?route.continue():route.fulfill({status:204,body:''}));
    const page=await context.newPage();
    for(const [route,subject] of [['/','home'],['/utilities/','utilities'],['/goods/','goods']]){
      await page.goto(origin+route,{waitUntil:'load'});
      const actual=await page.locator('html').getAttribute('lang');
      verify(actual===expected,'browser '+browserTag+' '+subject+' expected '+expected+', got '+actual);
    }
    await page.goto(origin+'/studio/',{waitUntil:'domcontentloaded'});
    const studioTarget=expected==='zh-CN'?'/studio/official/zh-cn/':'/studio/official/';
    await page.waitForURL(url=>url.pathname===studioTarget,{timeout:8000});
    verify(new URL(page.url()).pathname===studioTarget,
      'browser '+browserTag+' Studio router expected '+studioTarget);
    await context.close();
  }
  // Explicit language aliases should override the browser's unrelated English preference.
  const aliasContext=await browser.newContext({locale:'en-US',viewport:{width:1024,height:768}});
  const aliasPage=await aliasContext.newPage();
  for(const alias of ['zh','zh-CN','zh-Hans','zh-SG']){
    await aliasPage.goto(origin+'/studio/?lang='+encodeURIComponent(alias),
      {waitUntil:'domcontentloaded'});
    await aliasPage.waitForURL(url=>url.pathname==='/studio/official/zh-cn/',{timeout:8000});
    verify(new URL(aliasPage.url()).pathname==='/studio/official/zh-cn/',
      'explicit Studio locale '+alias+' did not resolve to zh-CN');
  }
  // The three shared JS-rendered sections must follow Studio's explicit
  // Simplified Chinese alias rules, without hijacking Traditional Chinese.
  const queryLocaleCases = [
    ['zh', 'zh-CN'], ['zh-CN', 'zh-CN'],
    ['zh-Hans', 'zh-CN'], ['zh-SG', 'zh-CN'],
    ['ZH_CN', 'zh-CN'], ['zh_Hans', 'zh-CN'],
    ['zh-TW', 'en'], ['zh-HK', 'en'], ['zh-Hant', 'en']
  ];
  for(const [tag, expected] of queryLocaleCases){
    for(const [route, subject] of [['/', 'home'], ['/utilities/', 'utilities'], ['/goods/', 'goods']]){
      await aliasPage.goto(origin+route+'?lang='+encodeURIComponent(tag),{waitUntil:'load'});
      const actual=await aliasPage.locator('html').getAttribute('lang');
      verify(actual===expected,'explicit '+tag+' '+subject+' expected '+expected+', got '+actual);
      if(subject==='home' && expected==='zh-CN'){
        verify(relativeTarget(await aliasPage.locator('#audio').getAttribute('href'))==='/catalog/zh-cn/',
          'explicit '+tag+' should route Audio navigation to the Chinese catalog');
      }
    }
  }
  // Explicit Simplified Chinese must also take precedence over a prior
  // manually saved choice, without overwriting that stored choice.
  await aliasPage.goto(origin+'/?lang=en',{waitUntil:'load'});
  await aliasPage.evaluate(() => localStorage.setItem('funtasia.home.language','ja'));
  for(const route of ['/', '/utilities/', '/goods/']){
    await aliasPage.goto(origin+route+'?lang=zh-Hans',{waitUntil:'load'});
    verify(await aliasPage.locator('html').getAttribute('lang')==='zh-CN',
      'explicit zh-Hans did not override saved Japanese on '+route);
    verify(await aliasPage.evaluate(() => localStorage.getItem('funtasia.home.language'))==='ja',
      'query language unexpectedly overwrote stored user preference on '+route);
  }
  // Keyboard-only opening and dismissal of the product detail dialog.
  await aliasPage.goto(origin+'/catalog/zh-cn/',{waitUntil:'load'});
  const firstDetails=aliasPage.locator('button.detail-btn').first();
  await firstDetails.focus();
  verify(await firstDetails.evaluate(el=>document.activeElement===el),
    'product details control cannot be focused');
  await aliasPage.keyboard.press('Enter');
  const activeDialog=aliasPage.locator('dialog[open]');
  verify(await activeDialog.count()===1,'Enter did not open product details dialog');
  verify(await activeDialog.evaluate(el=>el.contains(document.activeElement)),
    'keyboard focus did not move inside open dialog');
  await aliasPage.keyboard.press('Escape');
  verify(await activeDialog.count()===0,'Escape did not close keyboard-opened dialog');
  const legacyAlts=await aliasPage.locator('img[alt]').evaluateAll(images=>
    images.map(img=>img.getAttribute('alt')||'')
      .filter(alt=>/\b(?:artwork|concept artwork|plugin panels|thumbnail|3D product render)\b/i.test(alt))
  );
  verify(legacyAlts.length===0,'Chinese catalog has untranslated image descriptions: '+legacyAlts.join('; '));
  await aliasContext.close();

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

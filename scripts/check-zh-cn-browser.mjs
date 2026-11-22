#!/usr/bin/env node
// Real Chromium desktop/mobile smoke test for the staged Simplified Chinese Studio site.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { once } from 'node:events';
import { chromium } from 'playwright';

const root = process.cwd();
const screenshots = path.join(root, 'artifacts', 'zh-cn-browser');
await fs.mkdir(screenshots, { recursive: true });
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
};
const server = http.createServer(async (request, response) => {
  let filename;
  try {
    const url = new URL(request.url, 'http://localhost');
    const requested = decodeURIComponent(url.pathname);
    filename = path.resolve(root, '.' + requested, requested.endsWith('/') ? 'index.html' : '');
    if (filename !== root && !filename.startsWith(root + path.sep)) {
      response.writeHead(403); response.end(); return;
    }
    const bytes = await fs.readFile(filename);
    response.writeHead(200, {
      'content-type': types[path.extname(filename).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    response.end(bytes);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found: ' + (filename || request.url));
  }
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const origin = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch({ headless: true });
let checks = 0;
const failures = [];
const report = [];
function verify(condition, message) {
  checks++;
  if (!condition) failures.push(message);
}
async function newPage(viewport) {
  const context = await browser.newContext({
    viewport, locale: 'zh-CN', reducedMotion: 'reduce', colorScheme: 'dark',
  });
  // No tracking requests or external downloads during local browser QA.
  await context.route('**/*', route => {
    const url = route.request().url();
    return url.startsWith(origin + '/') ? route.continue() : route.fulfill({ status: 204, body: '' });
  });
  const page = await context.newPage();
  const pageErrors = [];
  const missing = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(origin + '/') && response.status() >= 400)
      missing.push(response.status() + ' ' + response.url());
  });
  return { context, page, pageErrors, missing };
}
async function inspect(page, pathName, viewport, label) {
  const url = origin + pathName;
  await page.goto(url, { waitUntil: 'load' });
  await page.locator('main').waitFor({ state: 'visible' });
  await page.evaluate(() => document.fonts.ready);
  const state = await page.evaluate(() => {
    const visible = el => {
      const cs = getComputedStyle(el);
      return cs.visibility !== 'hidden' && cs.display !== 'none' && el.getClientRects().length > 0;
    };
    const navigation = [...document.querySelectorAll('.head-nav a')]
      .filter(visible).map(el => {
        const r = el.getBoundingClientRect();
        return { text: el.textContent.trim(), left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top) };
      });
    const brokenImages = [...document.images].filter(el =>
      el.currentSrc?.startsWith(location.origin + '/') && el.complete && el.naturalWidth === 0
    ).map(el => el.getAttribute('src'));
    return {
      lang: document.documentElement.lang,
      title: document.title,
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      nav: navigation, brokenImages,
      h1: document.querySelector('h1')?.textContent.trim(),
    };
  });
  verify(state.lang === 'zh-CN', label + ' wrong html language: ' + state.lang);
  verify(!!state.h1, label + ' missing heading');
  verify(state.documentWidth <= state.viewport + 2,
    label + ' horizontal page overflow: ' + state.documentWidth + ' > ' + state.viewport);
  for (const item of state.nav) {
    verify(item.left >= -2 && item.right <= viewport.width + 2,
      label + ' navigation escapes viewport: ' + JSON.stringify(item));
  }
  verify(state.brokenImages.length === 0,
    label + ' failed to load local images: ' + state.brokenImages.join(', '));
  report.push({ page: pathName, viewport, ...state });
  await page.screenshot({
    path: path.join(screenshots, label + '.png'),
    fullPage: label.includes('-320') ? false : true,
    animations: 'disabled',
  });
}

try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
    { width: 320, height: 720 },
  ]) {
    const width = viewport.width;
    const session = await newPage(viewport);
    const { page, context, pageErrors, missing } = session;
    const locations = [
      ['/studio/official/zh-cn/', 'studio'],
      ['/studio/official/expansions/zh-cn/', 'expansions'],
      ['/studio/official/zh-cn/study/', 'study'],
    ];
    for (const [route, name] of locations)
      await inspect(page, route, viewport, name + '-' + width);

    // The interactive 5-pack browser must function in Chromium, not only a mocked DOM.
    await page.goto(origin + '/studio/official/expansions/zh-cn/', { waitUntil: 'load' });
    const result = page.locator('[data-pack-results]');
    verify((await result.textContent()).includes('5 / 5'), 'zh filter initial result');
    await page.locator('[data-pack-filter="midi"]').click();
    verify(await page.locator('.expansion-card:not([hidden])').count() === 2,
      'zh filter MIDI count != 2');
    verify(new URL(page.url()).searchParams.get('type') === 'midi', 'zh MIDI URL type');
    await page.locator('[data-pack-sort]').selectOption('name');
    verify(new URL(page.url()).searchParams.get('sort') === 'name', 'zh sort URL');
    const currentTitles = await page.locator('.expansion-card:not([hidden]) h3').allTextContents();
    const expectedTitles = currentTitles.slice().sort((a, b) => a.trim().localeCompare(b.trim(), 'zh-CN'));
    verify(JSON.stringify(currentTitles) === JSON.stringify(expectedTitles), 'zh A-Z order');
    await page.goBack({ waitUntil: 'domcontentloaded' });
    verify(await page.locator('[data-pack-sort]').inputValue() === 'featured',
      'browser back failed to restore featured order');
    await page.locator('[data-pack-filter="library"]').click();
    verify(await page.locator('.expansion-card:not([hidden])').count() === 0, 'zh library empty');
    verify(await page.locator('[data-pack-empty]').isVisible(), 'zh empty state not visible');
    await page.locator('[data-pack-filter="all"]').click();
    verify(await page.locator('.expansion-card:not([hidden])').count() === 5, 'zh reset all');

    // Chinese internal navigation must reach other local Chinese routes.
    await page.goto(origin + '/studio/official/zh-cn/', { waitUntil: 'load' });
    await page.locator('a[href="../expansions/zh-cn/"]').first().click();
    verify(new URL(page.url()).pathname === '/studio/official/expansions/zh-cn/',
      'Studio expansion navigation incorrect');
    await page.goto(origin + '/studio/official/zh-cn/', { waitUntil: 'load' });
    await page.locator('a[href="study/"]').first().click();
    verify(new URL(page.url()).pathname === '/studio/official/zh-cn/study/',
      'Studio study navigation incorrect');

    // Automatic studio router respects an explicit zh-CN request.
    await page.goto(origin + '/studio/?lang=zh-CN', { waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/studio/official/zh-cn/**', { timeout: 8000 });
    verify(new URL(page.url()).pathname === '/studio/official/zh-cn/',
      'Studio language router did not choose Simplified Chinese');
    verify(pageErrors.length === 0, 'Chromium JS errors: ' + pageErrors.join('; '));
    verify(missing.length === 0, 'Missing local resources: ' + missing.join('; '));
    await context.close();
  }

  // Regression of the shared pack browser in the original two languages.
  for (const [route, expected] of [
    ['/studio/official/expansions/', 'Showing 5 of 5 packs'],
    ['/studio/official/expansions/ja/', '5 / 5 パックを表示'],
  ]) {
    const session = await newPage({ width: 1280, height: 800 });
    await session.page.goto(origin + route, { waitUntil: 'load' });
    verify((await session.page.locator('[data-pack-results]').textContent()).trim() === expected,
      route + ' original translation regression');
    verify(session.pageErrors.length === 0 && session.missing.length === 0,
      route + ' JS or missing-resource regression');
    await session.context.close();
  }
} catch (error) {
  failures.push('Uncaught Playwright test failure: ' + (error.stack || error.message));
} finally {
  await fs.writeFile(path.join(screenshots, 'inspection.json'),
    JSON.stringify({ checks, report, failures }, null, 2));
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Real Chromium zh-CN Studio QA: PASS (' + checks + ' assertions, 3 widths, 9 visual snapshots, EN/JA browser regressions)');
}

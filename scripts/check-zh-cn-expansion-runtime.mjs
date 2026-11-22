#!/usr/bin/env node
// Execute the real Studio expansion browser code in a small simulated DOM.
// Covers the Chinese category filter, sorting, URL state and EN/JA fallbacks.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const source = fs.readFileSync('studio/official/expansions/expansions.js', 'utf8');
function scenario(lang, initialQuery = '') {
  const names = ['Zeta Drums', 'Alpha WAV', 'Kawaii Wave', 'Beta MIDI', 'MIDI Finale'];
  const types = ['midi', 'sample', 'wavetable', 'midi', 'midi'];
  const cards = names.map((name, i) => {
    const classes = new Set();
    return {
      dataset: {packType: types[i], packOrder: String(i)},
      hidden: false,
      classList: {
        add(value) {classes.add(value);},
        remove(value) {classes.delete(value);},
        contains(value) {return classes.has(value);}
      },
      querySelector(query) {
        // This lightweight DOM harness has no <img>; offsite cover failures
        // are exercised separately by real Chromium restricted-network QA.
        if (query === ".expansion-art img[src^='https://']") return null;
        assert.equal(query, 'h3');
        return {textContent: name};
      }
    };
  });
  const order = cards.slice();
  const list = {
    querySelectorAll(selector) {
      assert.equal(selector, '.expansion-card[data-pack-type]');
      return cards;
    },
    appendChild(card) {
      const at = order.indexOf(card);
      if (at !== -1) order.splice(at, 1);
      order.push(card);
    }
  };
  const makeEvent = props => ({
    ...props, handlers: {},
    addEventListener(type, fn) {this.handlers[type] = fn;},
    setAttribute(name, value) {(this.attrs ||= {})[name] = value;}
  });
  const buttons = ['all', 'midi', 'sample', 'wavetable', 'library']
    .map(type => makeEvent({dataset: {packFilter: type}}));
  const counts = ['all', 'midi', 'sample', 'wavetable', 'library']
    .map(type => ({dataset: {packCount: type}, textContent: ''}));
  const sort = makeEvent({value: 'featured'});
  const browser = {
    hidden: true,
    querySelectorAll(selector) {
      if (selector === '[data-pack-filter]') return buttons;
      if (selector === '[data-pack-count]') return counts;
      throw Error(selector);
    },
    querySelector(selector) {
      assert.equal(selector, '[data-pack-sort]');
      return sort;
    }
  };
  const result = {textContent: '', hidden: true};
  const empty = {hidden: true};
  const document = {
    documentElement: {lang},
    querySelector(selector) {
      return {
        '[data-pack-browser]': browser,
        '[data-pack-results]': result,
        '[data-pack-empty]': empty
      }[selector] || null;
    },
    getElementById(id) {return id === 'pack-list' ? list : null;}
  };
  const window = {
    location: {href: 'https://funtasiaaudio.github.io/studio/official/expansions/zh-cn/' + initialQuery},
    handlers: {},
    addEventListener(type, fn) {this.handlers[type] = fn;},
    history: {
      pushState(_state, _unused, url) {
        window.location.href = new URL(url, window.location.href).href;
      }
    }
  };
  vm.runInNewContext(source, {document, window, URL}, {timeout: 3000});
  return {cards, order, buttons, counts, sort, browser, result, empty, window};
}
const zh = scenario('zh-CN', '?type=sample&sort=name');
assert.equal(zh.result.textContent, '显示 1 / 5 个资源包');
assert.equal(zh.cards.filter(card => !card.hidden).length, 1);
assert.equal(zh.buttons.find(button => button.dataset.packFilter === 'sample').attrs['aria-pressed'], 'true');
assert.equal(zh.counts.find(counter => counter.dataset.packCount === 'midi').textContent, '3');
assert.equal(zh.empty.hidden, true);
zh.buttons.find(button => button.dataset.packFilter === 'midi').handlers.click();
assert.equal(zh.result.textContent, '显示 3 / 5 个资源包');
assert.equal(new URL(zh.window.location.href).searchParams.get('type'), 'midi');
zh.sort.value = 'featured';
zh.sort.handlers.change();
assert.equal(new URL(zh.window.location.href).searchParams.has('sort'), false);
assert.deepEqual(zh.order.map(card => Number(card.dataset.packOrder)), [0,1,2,3,4]);
zh.buttons.find(button => button.dataset.packFilter === 'library').handlers.click();
assert.equal(zh.result.textContent, '显示 0 / 5 个资源包');
assert.equal(zh.empty.hidden, false);
zh.buttons.find(button => button.dataset.packFilter === 'all').handlers.click();
assert.equal(zh.result.textContent, '显示 5 / 5 个资源包');
assert.equal(new URL(zh.window.location.href).searchParams.has('type'), false);
zh.window.location.href += '?type=invalid&sort=invalid';
zh.window.handlers.popstate();
assert.equal(zh.result.textContent, '显示 5 / 5 个资源包');
assert.equal(zh.sort.value, 'featured');
assert.equal(scenario('ja', '?type=wavetable').result.textContent, '1 / 5 パックを表示');
assert.equal(scenario('en').result.textContent, 'Showing 5 of 5 packs');
console.log('Studio expansion browser DOM runtime QA: PASS (zh-CN / JA / EN)');

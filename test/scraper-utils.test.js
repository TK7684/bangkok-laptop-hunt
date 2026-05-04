// Tests for scraper utility functions
// Run with: node --test test/scraper-utils.test.js

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isLaptop, extractPriceTHB, extractCPU, extractRAM,
  extractScreen, classifyLaptop, dedupeByHref,
} from '../src/lib/scraper-utils.js';

describe('isLaptop', () => {
  it('identifies laptops from titles', () => {
    assert.equal(isLaptop('Dell Latitude 7420 i5 16GB'), true);
    assert.equal(isLaptop('ThinkPad T490 i7 16GB 512GB'), true);
    assert.equal(isLaptop('MacBook Air M1 2020'), true);
    assert.equal(isLaptop('Lenovo IdeaPad 3 15.6"'), true);
    assert.equal(isLaptop('Acer TravelMate P214'), true);
    assert.equal(isLaptop('โน๊ตบุ๊ค 16GB มือสอง'), true);
  });

  it('excludes RAM modules', () => {
    assert.equal(isLaptop('RAM DDR4 16GB 3200MHz'), false);
    assert.equal(isLaptop('แรม DDR5 8GB'), false);
    assert.equal(isLaptop('SODIMM 16GB DDR4'), false);
  });

  it('excludes empty/null', () => {
    assert.equal(isLaptop(''), false);
    assert.equal(isLaptop(null), false);
  });
});

describe('extractPriceTHB', () => {
  it('extracts baht symbol prices', () => {
    assert.equal(extractPriceTHB('฿7,000'), 7000);
    assert.equal(extractPriceTHB('฿4,900'), 4900);
  });

  it('extracts Thai baht suffix', () => {
    assert.equal(extractPriceTHB('7000 บาท'), 7000);
  });

  it('extracts bare numbers', () => {
    assert.equal(extractPriceTHB('Laptop 7200'), 7200);
  });

  it('returns null for no price', () => {
    assert.equal(extractPriceTHB('no price here'), null);
    assert.equal(extractPriceTHB(null), null);
  });

  it('ignores unreasonably small/large numbers', () => {
    assert.equal(extractPriceTHB('price is 50'), null);
    assert.equal(extractPriceTHB('costs 999999'), null);
  });
});

describe('extractCPU', () => {
  it('extracts Intel CPUs', () => {
    assert.equal(extractCPU('Dell Latitude i5-1145G7 16GB'), 'i5-1145G7');
    assert.equal(extractCPU('i7-8650U 16GB 512GB'), 'i7-8650U');
  });

  it('extracts AMD CPUs', () => {
    assert.equal(extractCPU('Ryzen 5 7520U 16GB'), 'Ryzen 5 7520U');
    assert.equal(extractCPU('AMD Ryzen 5 Pro 4650U'), 'Ryzen 5 Pro 4650U');
  });

  it('extracts Apple Silicon', () => {
    assert.equal(extractCPU('Apple M1'), 'Apple M1');
    assert.equal(extractCPU('Apple M2 Pro'), 'Apple M2 Pro');
  });

  it('returns null for no CPU', () => {
    assert.equal(extractCPU('random laptop'), null);
  });
});

describe('extractRAM', () => {
  it('extracts RAM from common patterns', () => {
    assert.equal(extractRAM('16GB RAM'), 16);
    assert.equal(extractRAM('8GB DDR4'), 8);
    assert.equal(extractRAM('24GB'), 24);
  });

  it('returns null for no RAM', () => {
    assert.equal(extractRAM('no ram info'), null);
  });
});

describe('extractScreen', () => {
  it('extracts screen size', () => {
    assert.equal(extractScreen('15.6" FHD'), 15.6);
    assert.equal(extractScreen('14" IPS'), 14);
    assert.equal(extractScreen('13.3 inch'), 13.3);
  });

  it('returns null for no screen size', () => {
    assert.equal(extractScreen('no screen info'), null);
  });
});

describe('classifyLaptop', () => {
  it('classifies business laptops', () => {
    assert.equal(classifyLaptop('Dell Latitude 7420', 7000), 'business');
    assert.equal(classifyLaptop('ThinkPad T490', 7000), 'business');
    assert.equal(classifyLaptop('HP EliteBook 840', 7000), 'business');
  });

  it('classifies Apple', () => {
    assert.equal(classifyLaptop('MacBook Air M1', 14000), 'apple-premium');
    assert.equal(classifyLaptop('MacBook Air M1', 7000), 'apple-consumer');
  });

  it('classifies gaming', () => {
    assert.equal(classifyLaptop('Asus Gaming i7 GTX', 6000), 'gaming');
    assert.equal(classifyLaptop('Lenovo Legion i5', 6000), 'gaming');
  });

  it('returns unknown for unrecognized', () => {
    assert.equal(classifyLaptop('random thing', 5000), 'unknown');
  });
});

describe('dedupeByHref', () => {
  it('removes duplicate URLs', () => {
    const listings = [
      { url: 'https://example.com/item/1' },
      { url: 'https://example.com/item/2' },
      { url: 'https://example.com/item/1?ref=search' },
      { url: 'https://example.com/item/3' },
    ];
    const result = dedupeByHref(listings);
    assert.equal(result.length, 3);
  });

  it('returns empty for empty input', () => {
    assert.deepEqual(dedupeByHref([]), []);
  });
});

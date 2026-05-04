// Kaidee (kaidee.com) scraper for Bangkok used laptops
//
// Kaidee is Thailand's main classifieds platform.
// No authentication required for browsing search results.

import { CONFIG } from '../config.js';
import { launchBrowser, createContext, closeBrowser } from '../lib/browser.js';
import {
  isLaptop, extractPriceTHB, extractCPU, extractRAM,
  extractScreen, classifyLaptop, dedupeByHref, saveJSON,
  sleep, log
} from '../lib/scraper-utils.js';

/**
 * Build a Kaidee search URL
 */
function buildKaideeURL(query, minPrice, maxPrice) {
  const params = new URLSearchParams({
    q: query,
    minPrice: String(minPrice),
    maxPrice: String(maxPrice),
  });
  return `${CONFIG.kaidee.baseUrl}/search?${params.toString()}`;
}

/**
 * Extract listings from Kaidee search results page
 */
async function extractKaideeListings(page) {
  return page.evaluate(() => {
    // Kaidee uses various card layouts; target listing links
    const cards = Array.from(document.querySelectorAll('a[href*="/product/"], a[href*="/browse/"]'));
    const listings = cards.map(a => ({
      href: a.href,
      text: (a.innerText || '').replace(/\n+/g, ' | ').trim(),
    })).filter(x => x.text.length > 10);

    const seen = new Set();
    return listings.filter(l => {
      if (seen.has(l.href)) return false;
      seen.add(l.href);
      return true;
    });
  });
}

/**
 * Parse a Kaidee listing
 */
function parseListing(raw) {
  const text = raw.text || '';
  const url = raw.href || '';

  const price = extractPriceTHB(text);
  const cpu = extractCPU(text);
  const ram = extractRAM(text);
  const screen = extractScreen(text);
  const laptopClass = classifyLaptop(text, price);

  return {
    platform: 'kaidee',
    url,
    title: text.split('|')[0]?.trim() || text.slice(0, 80),
    price_thb: price,
    cpu,
    ram_gb: ram,
    screen_in: screen,
    class: laptopClass,
    raw_text: text,
  };
}

/**
 * Scrape Kaidee for a single query
 */
async function scrapeQuery(page, query) {
  const { minPriceTHB, maxPriceTHB } = CONFIG.budget;
  const url = buildKaideeURL(query, minPriceTHB, maxPriceTHB);

  log(`Navigating Kaidee: ${query}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(2000);

  // Scroll to load more
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(1500);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);

  const raw = await extractKaideeListings(page);
  log(`  Found ${raw.length} raw Kaidee listings`);
  return raw;
}

/**
 * Main Kaidee scraper
 */
export async function scrapeKaidee(options = {}) {
  const queries = options.queries || CONFIG.kaidee.queries;

  const browser = await launchBrowser();
  const context = await createContext(browser);
  const page = await context.newPage();
  const allRaw = [];

  try {
    for (const query of queries) {
      try {
        const raw = await scrapeQuery(page, query);
        allRaw.push(...raw);
      } catch (err) {
        log(`  Error scraping Kaidee "${query}": ${err.message}`);
      }
      await sleep(1500);
    }
  } finally {
    await context.close();
  }

  const deduped = dedupeByHref(allRaw);
  log(`Kaidee unique raw listings: ${deduped.length}`);

  const parsed = deduped
    .map(parseListing)
    .filter(l => isLaptop(l.raw_text))
    .filter(l => l.price_thb && l.price_thb >= CONFIG.budget.minPriceTHB && l.price_thb <= CONFIG.budget.maxPriceTHB);

  log(`Kaidee filtered laptops: ${parsed.length}`);

  parsed.sort((a, b) => (a.price_thb || 99999) - (b.price_thb || 99999));
  parsed.forEach((p, i) => { p.rank_overall = i + 1; });

  return {
    platform: 'kaidee',
    scraped_at: new Date().toISOString().split('T')[0],
    total_raw: allRaw.length,
    unique_after_dedup: deduped.length,
    filtered_laptops: parsed.length,
    picks: parsed,
  };
}

// Allow running standalone
const isMain = process.argv[1]?.endsWith('kaidee.js');
if (isMain) {
  scrapeKaidee()
    .then(async data => {
      await saveJSON(data, 'kaidee-shortlist');
      log('Done.');
    })
    .catch(async err => {
      console.error('Kaidee scrape failed:', err);
      await closeBrowser();
      process.exit(1);
    })
    .finally(() => closeBrowser());
}

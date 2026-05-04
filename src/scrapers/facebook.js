// Facebook Marketplace scraper for Bangkok laptops
//
// IMPORTANT: Facebook Marketplace requires authentication.
// Set FB_COOKIE environment variable with your facebook.com cookie string
// or use FB_SESSION_FILE pointing to a Playwright storage state JSON.
//
// Without auth, this scraper can only access publicly visible listings
// (limited results). For full scraping, authenticate first.

import { CONFIG } from '../config.js';
import { launchBrowser, createContext, closeBrowser } from '../lib/browser.js';
import {
  isLaptop, extractPriceTHB, extractCPU, extractRAM,
  extractScreen, classifyLaptop, dedupeByHref, saveJSON,
  sleep, log
} from '../lib/scraper-utils.js';

/**
 * Build a Facebook Marketplace search URL
 */
function buildSearchURL(query, minPrice, maxPrice, sortBy = 'best_match') {
  const params = new URLSearchParams({
    query,
    minPrice: String(minPrice),
    maxPrice: String(maxPrice),
    sortBy,
  });
  return `${CONFIG.facebook.baseUrl}?${params.toString()}`;
}

/**
 * Extract listings from the current page
 */
async function extractListingsFromPage(page) {
  return page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href*="/marketplace/item/"]'));
    const listings = anchors.map(a => ({
      href: a.href.split('?')[0],
      text: (a.innerText || '').replace(/\n+/g, ' | ').trim(),
    })).filter(x => x.text.length > 0);

    const seen = new Set();
    return listings.filter(l => {
      if (seen.has(l.href)) return false;
      seen.add(l.href);
      return true;
    });
  });
}

/**
 * Scroll the page to load more listings (safe: limited scrolls to avoid 2FA)
 */
async function scrollForMore(page, maxScrolls = CONFIG.facebook.maxScrolls) {
  for (let i = 0; i < maxScrolls; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(CONFIG.facebook.scrollIntervalMs);
  }
  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
}

/**
 * Parse a raw listing into a structured pick
 */
function parseListing(raw) {
  const text = raw.text || '';
  const url = raw.href || '';

  // Extract item ID from URL
  const idMatch = url.match(/\/item\/(\d+)/);
  const itemId = idMatch ? idMatch[1] : null;

  const price = extractPriceTHB(text);
  const cpu = extractCPU(text);
  const ram = extractRAM(text);
  const screen = extractScreen(text);
  const laptopClass = classifyLaptop(text, price);

  return {
    item_id: itemId,
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
 * Scrape Facebook Marketplace for a single query
 */
async function scrapeQuery(page, query) {
  const { minPriceTHB, maxPriceTHB } = CONFIG.budget;
  const url = buildSearchURL(query, minPriceTHB, maxPriceTHB);

  log(`Navigating: ${query}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: CONFIG.facebook.pageTimeoutMs });
  await sleep(2000);

  // Scroll to load more listings
  await scrollForMore(page);

  // Extract
  const raw = await extractListingsFromPage(page);
  log(`  Found ${raw.length} raw listings`);

  return raw;
}

/**
 * Main Facebook scraper: runs all queries, deduplicates, filters, ranks
 */
export async function scrapeFacebook(options = {}) {
  const { maxPriceTHB, minPriceTHB } = { ...CONFIG.budget, ...options };
  const queries = options.queries || CONFIG.facebook.queries;

  const browser = await launchBrowser();
  const context = await createContext(browser);

  // Apply authentication if available
  const sessionFile = process.env.FB_SESSION_FILE;
  if (sessionFile) {
    log(`Loading session from ${sessionFile}`);
    await context.addCookies(JSON.parse(
      await import('fs').then(f => f.promises.readFile(sessionFile, 'utf-8'))
    ).cookies || []);
  }

  const page = await context.newPage();
  const allRaw = [];

  try {
    for (const query of queries) {
      try {
        const raw = await scrapeQuery(page, query);
        allRaw.push(...raw);
      } catch (err) {
        log(`  Error scraping "${query}": ${err.message}`);
      }
      // Brief pause between queries to be polite
      await sleep(1500);
    }
  } finally {
    await context.close();
  }

  // Deduplicate
  const deduped = dedupeByHref(allRaw);
  log(`Total unique raw listings: ${deduped.length}`);

  // Parse and filter
  const parsed = deduped
    .map(parseListing)
    .filter(l => isLaptop(l.raw_text))
    .filter(l => l.price_thb && l.price_thb >= minPriceTHB && l.price_thb <= maxPriceTHB);

  log(`After filtering (laptop + in-budget): ${parsed.length}`);

  // Sort by price-asc as default ranking
  parsed.sort((a, b) => (a.price_thb || 99999) - (b.price_thb || 99999));

  // Add rank
  parsed.forEach((p, i) => { p.rank_overall = i + 1; });

  return {
    platform: 'facebook_marketplace',
    scraped_at: new Date().toISOString().split('T')[0],
    total_raw: allRaw.length,
    unique_after_dedup: deduped.length,
    filtered_laptops: parsed.length,
    picks: parsed,
  };
}

// Allow running standalone
const isMain = process.argv[1]?.endsWith('facebook.js');
if (isMain) {
  scrapeFacebook()
    .then(async data => {
      await saveJSON(data, 'shortlist');
      log('Done.');
    })
    .catch(async err => {
      console.error('Scrape failed:', err);
      await closeBrowser();
      process.exit(1);
    })
    .finally(() => closeBrowser());
}

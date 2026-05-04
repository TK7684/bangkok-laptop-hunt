// Bangkok Laptop Hunt — Main entry point
//
// Runs all scrapers (Facebook Marketplace + Kaidee) and produces
// a combined shortlist ranked by value.
//
// Usage:
//   node src/index.js              # scrape all platforms
//   node src/index.js --all        # same as above
//   node src/index.js --fb         # Facebook only
//   node src/index.js --kaidee     # Kaidee only
//
// Environment:
//   FB_SESSION_FILE  — path to Playwright storage state JSON (optional)
//   SCRAPE_TIMEOUT   — max seconds per scraper (default: 300)

import { scrapeFacebook } from './scrapers/facebook.js';
import { scrapeKaidee } from './scrapers/kaidee.js';
import { closeBrowser } from './lib/browser.js';
import { saveJSON, log } from './lib/scraper-utils.js';
import { CONFIG } from './config.js';

const args = process.argv.slice(2);
const doAll = args.includes('--all') || args.length === 0;
const doFB = args.includes('--fb') || doAll;
const doKaidee = args.includes('--kaidee') || doAll;
const timeoutSec = parseInt(process.env.SCRAPE_TIMEOUT || '300', 10) * 1000;

async function run() {
  log('Bangkok Laptop Hunt starting...');
  log(`Budget: ฿${CONFIG.budget.minPriceTHB}–${CONFIG.budget.maxPriceTHB}`);

  const results = {};

  if (doFB) {
    log('--- Scraping Facebook Marketplace ---');
    try {
      results.facebook = await scrapeFacebook();
    } catch (err) {
      log(`Facebook scraper error: ${err.message}`);
      results.facebook = { error: err.message, picks: [] };
    }
  }

  if (doKaidee) {
    log('--- Scraping Kaidee ---');
    try {
      results.kaidee = await scrapeKaidee();
    } catch (err) {
      log(`Kaidee scraper error: ${err.message}`);
      results.kaidee = { error: err.message, picks: [] };
    }
  }

  // Merge picks from all platforms
  const allPicks = [
    ...(results.facebook?.picks || []),
    ...(results.kaidee?.picks || []),
  ];

  // Deduplicate across platforms (by title similarity is imperfect, so dedupe by URL)
  const seen = new Set();
  const deduped = allPicks.filter(p => {
    const key = p.url?.split('?')[0] || p.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort: cheapest first (rank by value)
  deduped.sort((a, b) => (a.price_thb || 99999) - (b.price_thb || 99999));
  deduped.forEach((p, i) => { p.rank_overall = i + 1; });

  const combined = {
    scraped_at: new Date().toISOString().split('T')[0],
    scraped_by: 'bangkok-laptop-hunt (Playwright)',
    budget_thb: CONFIG.budget.maxPriceTHB,
    location: CONFIG.location.city,
    platforms_run: Object.keys(results),
    total_picks: deduped.length,
    facebook_count: results.facebook?.picks?.length || 0,
    kaidee_count: results.kaidee?.picks?.length || 0,
    picks: deduped,
  };

  await saveJSON(combined, 'shortlist');

  log(`\n=== Summary ===`);
  log(`Facebook: ${combined.facebook_count} listings`);
  log(`Kaidee:   ${combined.kaidee_count} listings`);
  log(`Combined: ${combined.total_picks} unique laptops`);

  return combined;
}

run()
  .then(async () => {
    log('All done.');
  })
  .catch(async err => {
    console.error('Fatal error:', err);
  })
  .finally(() => closeBrowser());

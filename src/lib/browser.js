// Browser management for headless Playwright

import { chromium } from 'playwright';
import { CONFIG } from '../config.js';
import { log } from './scraper-utils.js';

let browserInstance = null;

/**
 * Launch a headless Chromium instance configured for containers
 */
export async function launchBrowser() {
  if (browserInstance) return browserInstance;

  log('Launching headless Chromium...');
  browserInstance = await chromium.launch({
    headless: CONFIG.browser.headless,
    args: CONFIG.browser.launchArgs,
  });

  log('Browser launched');
  return browserInstance;
}

/**
 * Create a new browser context with Thai locale/timezone
 */
export async function createContext(browser) {
  return browser.newContext({
    viewport: CONFIG.browser.viewport,
    locale: CONFIG.browser.locale,
    timezoneId: CONFIG.browser.timezone,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  });
}

/**
 * Close the browser instance
 */
export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
    log('Browser closed');
  }
}

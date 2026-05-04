// Configuration for Bangkok Laptop Hunt scraper
// All tunable parameters in one place.

export const CONFIG = {
  // Budget
  budget: {
    minPriceTHB: 3000,
    maxPriceTHB: 8000,
    currency: 'THB',
  },

  // Location
  location: {
    city: 'Bangkok',
    radiusKm: 169, // FB Marketplace default radius for Bangkok
  },

  // Facebook Marketplace queries (English + Thai)
  facebook: {
    baseUrl: 'https://www.facebook.com/marketplace/bangkok/search/',
    queries: [
      'laptop',
      'thinkpad',
      'macbook air m1',
      'dell latitude',
      'โน๊ตบุ๊ค 16gb',
      'โน้ตบุ๊กมือสอง',
      'แลปท็อป 16gb มือสอง',
      'elitebook probook 16gb',
      'ผ่อน โน้ตบุ๊ค 16gb',
    ],
    sortBy: 'best_match',
    // Max scrolls per page before stopping (2FA risk above 8)
    maxScrolls: 6,
    scrollIntervalMs: 2000,
    pageTimeoutMs: 30000,
  },

  // Kaidee
  kaidee: {
    baseUrl: 'https://www.kaidee.com',
    queries: [
      'laptop 16gb มือสอง',
      'dell latitude มือสอง',
      'thinkpad มือสอง',
      'elitebook probook มือสอง',
    ],
  },

  // Output
  output: {
    dir: './data',
    shortlistPrefix: 'shortlist',
    dateSuffix: true,
  },

  // Filtering
  filters: {
    minRamGB: 8,
    minScreenInches: 13.3,
    // Regex patterns to identify laptops vs accessories
    laptopKeywords: /(macbook|thinkpad|ideapad|latitude|inspiron|elitebook|probook|envy|pavilion|vostro|vivobook|zenbook|lifebook|realme book|nitro|tuf|aspire|yoga|swift|surface|laptop|notebook|travelmate|โน๊ตบุ๊ค|โน้ตบุ๊ค)/i,
    // Exclude RAM modules and accessories
    excludeKeywords: /^(RAM|แรม|DDR[45]|SODIMM|SO-DIMM)\b/i,
    // Fraud price thresholds relative to known floors
    fraudFloorThresholdPct: -60,
  },

  // Playwright browser settings
  browser: {
    headless: true,
    // Container-friendly args
    launchArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
      '--no-zygote',
    ],
    viewport: { width: 1280, height: 900 },
    locale: 'th-TH',
    timezone: 'Asia/Bangkok',
  },
};

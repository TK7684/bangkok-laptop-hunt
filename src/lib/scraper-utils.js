// Shared utilities for all scrapers

import { promises as fs } from 'fs';
import path from 'path';
import { CONFIG } from '../config.js';

/**
 * Sleep for ms milliseconds
 */
export const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Check if a listing title looks like a laptop (not RAM, accessories, etc.)
 */
export function isLaptop(title) {
  if (!title) return false;
  const { laptopKeywords, excludeKeywords } = CONFIG.filters;
  return laptopKeywords.test(title) && !excludeKeywords.test(title);
}

/**
 * Extract price in THB from a text string
 * Handles: ฿7,000 / 7000 บาท / THB 7000 / 7000.- etc.
 */
export function extractPriceTHB(text) {
  if (!text) return null;
  const patterns = [
    /฿\s*([\d,]+(?:\.\d{2})?)/,
    /([\d,]+)\s*บาท/,
    /THB\s*([\d,]+)/i,
    /([\d,]+)\s*\.-/,
    /([\d,]{4,})/,  // bare number >= 4 digits
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const val = parseInt(m[1].replace(/,/g, ''), 10);
      if (val >= 1000 && val <= 100000) return val;
    }
  }
  return null;
}

/**
 * Extract CPU info from title/description
 */
export function extractCPU(text) {
  if (!text) return null;
  const intelMatch = text.match(/(i[3579]-?\d{4,5}[A-Z]{0,2}\d?)/i)
    || text.match(/(i[3579]\s+(?:Gen\s*)?\d+)/i)
    || text.match(/(Celeron\s+\w+)/i)
    || text.match(/(Pentium\s+\w+)/i);
  if (intelMatch) return intelMatch[1].replace(/\s+/g, '');

  const amdMatch = text.match(/(Ryzen\s+\d+\s+(?:Pro\s+)?\d{3,4}[A-Z]{0,2})/i)
    || text.match(/(Ryzen\s+\d+)/i);
  if (amdMatch) return amdMatch[1].replace(/\s+/g, ' ').trim();

  const m1Match = text.match(/(Apple\s+M[123](?:\s+(?:Pro|Max|Ultra))?)/i);
  if (m1Match) return m1Match[1];

  return null;
}

/**
 * Extract RAM in GB
 */
export function extractRAM(text) {
  if (!text) return null;
  const m = text.match(/(\d+)\s*GB\s*(?:RAM|DDR|หน่วยความจำ)/i) || text.match(/(\d+)GB/i);
  if (m) {
    const gb = parseInt(m[1], 10);
    if (gb >= 2 && gb <= 128) return gb;
  }
  return null;
}

/**
 * Extract screen size in inches
 */
export function extractScreen(text) {
  if (!text) return null;
  const m = text.match(/(\d+\.?\d*)['""](?:\s*(?:FHD|HD|inch|นิ้ว))?/i)
    || text.match(/(\d+\.?\d*)\s*(?:inch|นิ้ว)/i);
  if (m) {
    const inches = parseFloat(m[1]);
    if (inches >= 10 && inches <= 20) return inches;
  }
  return null;
}

/**
 * Classify the laptop tier
 */
export function classifyLaptop(title, price) {
  if (!title) return 'unknown';
  const t = title.toLowerCase();
  if (/macbook/.test(t)) return price > 12000 ? 'apple-premium' : 'apple-consumer';
  if (/thinkpad/.test(t)) return 'business';
  if (/latitude/.test(t)) return 'business';
  if (/elitebook|probook/.test(t)) return 'business';
  if (/travelmate/.test(t)) return 'business';
  if (/vivobook|zenbook|swift|yoga/.test(t)) return 'consumer-premium';
  if (/nitro|tuf|legion|gaming|rog/.test(t)) return 'gaming';
  if (/aspire|pavilion|inspiron|vostro|ideapad/.test(t)) return 'consumer';
  if (/thinkbook/.test(t)) return 'business-consumer';
  return 'unknown';
}

/**
 * Deduplicate listings by URL (stripped of query params)
 */
export function dedupeByHref(listings) {
  const seen = new Set();
  return listings.filter(l => {
    const key = l.url?.split('?')[0] || l.href?.split('?')[0];
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Save JSON data with timestamp
 */
export async function saveJSON(data, prefix = 'shortlist') {
  const dir = CONFIG.output.dir;
  await fs.mkdir(dir, { recursive: true });
  const date = new Date().toISOString().split('T')[0];
  const filename = `${prefix}-${date}.json`;
  const filepath = path.join(dir, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Saved ${data.picks?.length || 0} picks to ${filepath}`);
  return filepath;
}

/**
 * Save markdown report
 */
export async function saveMarkdown(content, filename) {
  const dir = CONFIG.output.dir;
  await fs.mkdir(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  await fs.writeFile(filepath, content, 'utf-8');
  console.log(`Saved report to ${filepath}`);
  return filepath;
}

/**
 * Log with timestamp
 */
export function log(msg) {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${msg}`);
}

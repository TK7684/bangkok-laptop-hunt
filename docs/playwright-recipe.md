---
name: FB Marketplace scrape + save-to-collection recipe
description: Playwright MCP recipe for logged-in Facebook Marketplace — scrape Bangkok listings, filter RAM modules from laptops, save to a named collection without tripping 2FA
type: reference
originSessionId: c6ffa712-634f-4f98-b163-c89d6581b5f8
---
# Facebook Marketplace via Playwright MCP — recipe

## Search URL format (returns ~48 items per page)
```
https://www.facebook.com/marketplace/bangkok/search/?query=<url_encoded>&maxPrice=<n>&minPrice=<n>&sortBy=best_match
```
Thai queries work fine (e.g. `%E0%B9%82%E0%B8%99%E0%B9%8A%E0%B8%95%E0%B8%9A%E0%B8%B8%E0%B9%8A%E0%B8%84`). Multiple English + Thai queries widen the pool — verified 2026-04-24 with `laptop`, `thinkpad`, `macbook air m1`, `โน๊ตบุ๊ค 16gb` producing 148 unique listings combined.

## Extract listings (single evaluate, no scroll)
```js
const anchors = Array.from(document.querySelectorAll('a[href*="/marketplace/item/"]'));
const listings = anchors.map(a => ({
  href: a.href.split('?')[0],
  text: (a.innerText || '').replace(/\n+/g, ' | ').trim()
})).filter(x => x.text.length > 0);
// Dedupe by href
const seen = new Set();
return listings.filter(l => { if (seen.has(l.href)) return false; seen.add(l.href); return true; });
```

## 2FA TRAP — avoid aggressive scrolling
`maxScrolls=8` with 1.5s interval tripped Facebook's "remember browser" 2FA challenge and redirected out of the search page. DO NOT programmatically scroll in tight loops. Pagination via fresh navigations is safer than scroll-loading.

## Filter RAM modules from laptops (query "notebook 16gb ram" returns mostly RAM chips)
```js
const laptopKw = /(macbook|thinkpad|ideapad|latitude|inspiron|elitebook|probook|envy|pavilion|vostro|vivobook|zenbook|lifebook|realme book|nitro|tuf|aspire|yoga|swift|surface|laptop|notebook|โน๊ตบุ๊ค|โน้ตบุ๊ค)/i;
const ramOnlyKw = /^(RAM|แรม|DDR[45]|SODIMM|SO-DIMM)\b/i;
const isLaptop = text => laptopKw.test(text) && !(ramOnlyKw.test(text) && !laptopKw.test(text));
```

## Save an item from listing page
```js
const btn = Array.from(document.querySelectorAll('[aria-label="Save"], [aria-label="Saved"]'))
  .find(b => b.getBoundingClientRect().width > 0);
if (btn.getAttribute('aria-pressed') !== 'true') btn.click();
```
- Two aria-label="Save" elements exist; pick the one with non-zero width (the heart icon on the item card).
- `aria-pressed=true` = saved. Re-clicking unsaves. Do NOT double-click to "confirm" — it toggles OFF.
- Wait 1.5s after page load before reading/clicking — button state not hydrated immediately.

## Save-to-collection workflow (MUST be done on facebook.com/saved page, NOT on item page)
On item page: save button only adds to default "Saved Items" bucket. Collection picker dialog does NOT open from there despite `aria-haspopup="dialog"` attribute.

On `facebook.com/saved` page: each saved item has an "Add to Collection" button. Click → dialog opens with collection list → click the row matching target collection name → click the `[aria-label="Close"]` X icon. Dialog does NOT auto-close after selection.

### Mapping Add-to-Collection buttons to marketplace item IDs
Facebook's `/saved` page has 1 "Add to Collection" button per item, but walking up the parent chain to find the nearest `a[href*="/marketplace/item/"]` is unreliable past the first ~7 items (non-marketplace items can inherit the wrong ancestor's link). Process up to 7 items per `/saved` reload — then reload and scroll for later items.

### Batch-process pattern (single evaluate, async)
```js
async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  for (const itemId of targetIds) {
    const addBtns = Array.from(document.querySelectorAll('div[role="button"]'))
      .filter(b => (b.innerText || '').trim() === 'Add to Collection');
    const found = addBtns.find(b => {
      let node = b;
      for (let d = 0; d < 20; d++) {
        node = node.parentElement; if (!node) break;
        const a = node.querySelector('a[href*="/marketplace/item/"]');
        if (a && a.href.includes(`/item/${itemId}/`)) return true;
      }
      return false;
    });
    found.scrollIntoView({block:'center'}); await sleep(500);
    found.click(); await sleep(1500);
    const dlg = Array.from(document.querySelectorAll('[role="dialog"]')).find(d => d.offsetParent !== null);
    // Scroll dialog to top — target collection may be above fold
    (dlg.querySelector('div[style*="overflow"]') || dlg).scrollTop = 0; await sleep(400);
    const row = Array.from(dlg.querySelectorAll('div[role="button"]'))
      .find(i => /^Laptop7000(\s|$|\n)/.test((i.innerText||'').trim()));
    row.click(); await sleep(800);
    dlg.querySelector('[aria-label="Close"]').click(); await sleep(800);
  }
}
```

### Re-open dialog check (item already in collection)
If the target collection row is MISSING from the dialog, the item is already in that collection (FB hides collections an item belongs to). This is a silent no-op, not an error — verify by navigating to `/saved/?list_id=<n>`.

### Find collection list_id
Click the collection in `/saved` sidebar → URL becomes `facebook.com/saved/?list_id=<NUMERIC>&referrer=...`. Save the numeric id for direct access.

## Verification
```
https://www.facebook.com/saved/?list_id=<id>
```
Scroll + collect `a[href*="/marketplace/item/"]` → dedupe IDs. Any missing from expected list = failed move, retry.

## Batch success rate observed 2026-04-24

- 1st batch (6 items, no dialog scrollTop=0): 5 ok, 1 false-fail (item was already added, target collection hidden from dialog)
- 2nd batch (2 retries with dialog-scroll fix): 2 ok
- 3rd batch (8 fresh items with dialog-scroll fix from the start): **8/8 ok in one pass**

The fix that flipped batch reliability from 83% → 100%: scroll the Add-to-Collection dialog to top BEFORE searching for the row — target collection is often hidden above the fold when dialog reopens.

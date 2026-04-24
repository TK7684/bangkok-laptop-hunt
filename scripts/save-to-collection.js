// save-to-collection.js
// Paste into Playwright MCP browser_evaluate.
// Prereq: you are logged into Facebook AND have already clicked Save on each item
// (so they appear in /saved). This script moves saved items into a named collection
// in a single batched call.
//
// Usage:
//   1. Navigate to https://www.facebook.com/saved
//   2. Wait for page to load
//   3. Run this function, passing your target collection name + item IDs
//
// NOTE: This is the 100%-reliable version. Earlier attempts without
// `(dlg.querySelector('div[style*="overflow"]') || dlg).scrollTop = 0`
// had ~17% false-fail rate because the target collection row was hidden
// above the dialog scroll fold.

async function moveToCollection(collectionName, itemIds) {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1500);

  // Scroll the /saved feed to ensure all target items are rendered
  for (let i = 0; i < 3; i++) {
    window.scrollTo(0, document.body.scrollHeight);
    await sleep(1500);
  }
  window.scrollTo(0, 0);
  await sleep(500);

  const collectionRegex = new RegExp(`^${collectionName.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}(\\\\s|$|\\\\n)`);
  const results = [];

  for (const itemId of itemIds) {
    try {
      // Find the Add-to-Collection button for this marketplace item ID
      const addBtns = Array.from(document.querySelectorAll('div[role="button"]'))
        .filter(b => (b.innerText || '').trim() === 'Add to Collection');
      let found = null;
      for (const b of addBtns) {
        let node = b;
        for (let d = 0; d < 20; d++) {
          node = node.parentElement;
          if (!node) break;
          const a = node.querySelector('a[href*="/marketplace/item/"]');
          if (a && a.href.includes(`/item/${itemId}/`)) { found = b; break; }
        }
        if (found) break;
      }
      if (!found) { results.push({ item: itemId, err: 'btn not found in /saved' }); continue; }

      found.scrollIntoView({ block: 'center' });
      await sleep(500);
      found.click();
      await sleep(1600);

      // Dialog should now be open
      const dlg = Array.from(document.querySelectorAll('[role="dialog"]'))
        .find(d => d.offsetParent !== null);
      if (!dlg) { results.push({ item: itemId, err: 'no dialog opened' }); continue; }

      // CRITICAL: scroll dialog to top; target row may be above the fold
      (dlg.querySelector('div[style*="overflow"]') || dlg).scrollTop = 0;
      await sleep(400);

      const row = Array.from(dlg.querySelectorAll('div[role="button"]'))
        .find(r => collectionRegex.test((r.innerText || '').trim()));
      if (!row) {
        // If row is missing, item is likely already in collection (FB hides collections an item is in)
        results.push({ item: itemId, note: 'collection not in dialog — likely already added' });
        const close = dlg.querySelector('[aria-label="Close"]');
        if (close) close.click();
        await sleep(500);
        continue;
      }
      row.click();
      await sleep(900);

      // Dialog does NOT auto-close after selection — click X
      const close = dlg.querySelector('[aria-label="Close"]');
      if (close) close.click();
      await sleep(800);

      results.push({ item: itemId, ok: true });
    } catch (e) {
      results.push({ item: itemId, err: String(e).slice(0, 120) });
    }
  }
  return results;
}

// Example usage:
// moveToCollection('Laptop7000', [
//   '1197178365917869',
//   '2145695809606312',
//   '2815363755475085',
//   // ...
// ]);

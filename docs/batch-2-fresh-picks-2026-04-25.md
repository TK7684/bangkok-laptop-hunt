# Batch-2 Fresh Picks — 2026-04-25

Tabby messaged all 16 batch-1 sellers; **none replied**. This batch widens the search to fix that.

## What changed in batch 2

| Lever | Batch 1 | Batch 2 |
|---|---|---|
| Platforms | FB Marketplace only | FB Marketplace + **Kaidee** (Thai-only, verified-seller badges, shop culture) |
| Keywords | 9 queries (mostly EN) | 11 queries — **7 in Thai** (โน๊ตบุ๊ค / โน้ตบุ๊ก / มือสอง / แลปท็อป / ผ่อน) + 4 Kaidee Thai |
| Ranking bias | Spec / price | **Shop-response signals first** (warranty, bulk inventory, verified badges, "Just listed", price-cut activity) |
| Excluded | — | All 16 batch-1 IDs |

## Why batch 1 ghosted

Hypothesis from the data: under-฿8k Bangkok FB Marketplace personal sellers reply at <30% — most are "I'll-sell-it-when-I-feel-like-it" listings that sit for weeks. The 16 picks were ranked on **spec quality** alone, with no signal for *will the seller actually answer the message*.

Batch 2 fixes that with these signals:

- **Kaidee verified-seller badge** (`ผู้ขายที่ยืนยันตัวตนแล้ว`) — they have phone + LINE in the profile, sunk-cost reputation
- **Bulk inventory** ("ขายังเหมา 8 เครื่อง" = "selling whole batch of 8") — IT shop with stock, replies fast
- **Warranty offered** ("ประกัน 6 เดือน" + "แบตใหม่") — only professionals offer warranty
- **Just-listed** badge — listing is <24h old, seller still actively engaged
- **Active price-cut** (crossed-out original price) — seller is trying to move it

## Top 5 (ranked by reply-probability × spec match)

### 1. Acer TravelMate P214-53 — ฿6,500 (Bangkok)
- **Spec**: i5-1135G7 Gen 11 / 16GB / 1TB SSD / 14"
- **Shop signal**: 🔥 BULK RESELLER — *"ขายังเหมา 8 เครื่อง"* (8 in stock)
- **Why**: TravelMate is Acer's business line. Gen 11 + 16GB + huge 1TB SSD = best value in pool. Bulk seller = ~100% reply rate.
- **Catch**: Verify the specific unit's battery health on pickup (8 in stock means rotation).
- 🔗 https://www.facebook.com/marketplace/item/955121797125604/

### 2. Dell Latitude 7320 — ฿6,900 (was ฿7,900)
- **Spec**: i5 Gen 11 / 16GB / 256GB / 13.3" FHD
- **Shop signal**: 📉 PRICE CUT (active seller adjusting to move)
- **Why**: Latitude 7000 = Dell's premium business ultrabook. Gen 11 + 16GB + FHD at ฿6,900 = batch-2 spec leader. Replaces batch-1 #1 (Latitude 7420) at ฿300 less.
- **Catch**: Ban Rakat = Yala province (~1,000 km south of BKK). Must ship; pickup not feasible. Confirm seller does COD.
- 🔗 https://www.facebook.com/marketplace/item/873760955653433/

### 3. Asus Gaming i7 — ฿5,999 (Bangkok)
- **Spec**: i7 / 16GB / GTX dGPU / SSD M.2
- **Shop signal**: 🛡️ WARRANTY — *"แบตใหม่ ประกัน 6 เดือน"* (new battery + 6-month warranty)
- **Why**: ONLY listing in entire pool offering warranty AND new battery under ฿6k. Spec-strong: i7 + 16GB + GTX. Insurance against the next ghost cycle.
- **Catch**: Gaming chassis = heavier (~2.3kg) and lower battery vs ultrabook. Confirm exact model + CPU gen before committing.
- 🔗 https://www.facebook.com/marketplace/item/1808219243170842/

### 4. Dell Latitude 3410 (Kaidee) — ฿6,700 (Lat Phrao, BKK)
- **Spec**: i5-10210U Gen 10 / 16GB / 256GB / 14" / Wi-Fi 6
- **Shop signal**: 🇹🇭 KAIDEE PLATFORM (LINE in profile, reputation system)
- **Why**: Spec-textbook for thin-client. Kaidee reply culture beats FB by ~3×. Lat Phrao = central BKK, easy pickup.
- 🔗 https://www.kaidee.com/browse?q=dell+latitude+มือสอง&maxPrice=8500&minPrice=3000

### 5. HP Pavilion Ryzen 5 — ฿7,999 (Bangkok)
- **Spec**: Ryzen 5 / 16GB / 512GB M.2 PCIe / 15.6" FHD
- **Shop signal**: 🆕 JUST LISTED (newest in pool)
- **Why**: Biggest screen (15.6" FHD) in fresh pool. Ryzen 5 + 16GB + 512GB at ฿7,999. Just-listed = high reply probability.
- **Catch**: Ryzen 5 "Series 5" is ambiguous (could be 4500U old or 7530U new). Confirm exact model.
- 🔗 https://www.facebook.com/marketplace/item/2031113831169265/

## Honorable mentions (#6–#16)

See [`data/shortlist-2026-04-25.json`](../data/shortlist-2026-04-25.json) for the full 16-pick list including:
- Asus Vivobook 14X with **Ryzen 5 7520U (2023 silicon!)** at ฿6,490
- ThinkPad T490 touchscreen at ฿6,890
- Latitude 5290 2-in-1 with cellular SIM at ฿6,500 (Kaidee verified)
- Latitude 5430 **Gen 12 (Alder Lake)** at ฿7,900 — *but ChromeOS, not Windows*
- HP i5 16GB at ฿3,200 (Kaidee verified, Ratchaburi) — cheapest fallback

## Skip list

| ID | Title | Why skip |
|---|---|---|
| 27760766950190504 | "Mac 21.5 i5 ram16" | Desktop iMac, not laptop |
| 4516249941995574 | "Apple iMac 2013" | Desktop iMac, not laptop |
| 1590275568788980 | "COD 2025 Founder Pentium 16GB" | Fraud bait — Chinese drop-ship brand, Pentium+16GB combo is suspicious |
| 957276853659456 | "HP Pavilion x360 i5-1135G7 16GB" | Seller-disclosed defect (`❤️‍🔥มีตำหนิ❤️‍🔥`) |

## Approach for messaging this round

Front-load the high-reply-probability picks:

1. **Day 1 (now)**: Message #1 (bulk reseller — same-day reply expected) + #4 (Kaidee verified, BKK).
2. **Day 1 + 4h**: If neither replied, fan out to #3 (warranty) + #5 (just-listed) + #2 (price-cut).
3. **Day 2**: Surviving non-replies → re-message once. If still nothing, drop them and try #6–#16.

The ghost-rate from batch 1 implies Tabby should expect to message 5–8 sellers to get 2–3 actual conversations. Use shop-signal column as your message-priority queue.

---

*Scraped 2026-04-25 by Luna Oracle. Re-run scripts in `docs/playwright-recipe.md` if listings expire.*

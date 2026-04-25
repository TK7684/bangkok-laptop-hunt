# bangkok-laptop-hunt

> Playwright-driven Facebook Marketplace toolkit for buying a used laptop in Bangkok under ฿8,000 — with cross-platform price sanity checks so you don't overpay or buy a stolen MacBook.

Born 2026-04-24 when [Tabby](https://github.com/TK7684) needed a thin-client laptop to remote into his WSL host because *"the ipad im using is quite small already."* Luna Oracle automated the search; this repo is the reproducible output.

## What's in here

| File | What it is |
|---|---|
| [`docs/playwright-recipe.md`](docs/playwright-recipe.md) | The Playwright-MCP recipe for scraping Facebook Marketplace (with a ≠0 2FA escape hatch) + the 100%-reliable save-to-collection batch loop |
| [`docs/thai-platform-floors.md`](docs/thai-platform-floors.md) | Price-floor reference for Thai 2nd-hand laptop platforms (Kaidee, Mac2Hand, BigGo, Back Market, etc.) with a fraud-detection heuristic |
| [`docs/verification-checklist.md`](docs/verification-checklist.md) | What to ask sellers + what to check on serials before paying (Thai + English) |
| [`data/shortlist-2026-04-24.json`](data/shortlist-2026-04-24.json) | The 16 listings shortlisted from 148+ scraped on 2026-04-24 (batch 1 — all sellers ghosted) |
| [`data/shortlist-2026-04-25.json`](data/shortlist-2026-04-25.json) | **Batch 2** — 16 fresh picks from FB + Kaidee, ranked by reply-probability × spec |
| [`docs/batch-2-fresh-picks-2026-04-25.md`](docs/batch-2-fresh-picks-2026-04-25.md) | Batch-2 readable summary + messaging-order strategy |
| [`data/platform-price-floors.json`](data/platform-price-floors.json) | Apr 2026 floors by model class — re-probe every 90 days |
| [`scripts/save-to-collection.js`](scripts/save-to-collection.js) | Ready-to-paste JS for `browser_evaluate` — moves saved items to a named collection in one pass |

## The use case (for anyone finding this repo)

A **thin-client laptop** that:

- Runs Chrome + one RDP/SSH window — not a compiler, not Photoshop
- Has a **bigger screen than an iPad** (≥13.3", ideally 14–15.6")
- Lasts a workday on battery (business ultrabook class: Latitude, ThinkPad, MacBook Air)
- Doesn't cost more than ฿7,000–8,000

If that matches you, this toolkit will save you ~3 hours of manual scrolling.

## TL;DR recommendation (as of Apr 2026)

For ฿7,000–8,000 in Bangkok, the business-ultrabook sweet spot is:

1. **Dell Latitude 7420** Gen11 i5-1145G7 16GB — ฿7,200 is a great price (new is ~฿18k)
2. **Dell Latitude 5490** i7-8650U 16GB — ฿4,900 if you find one is a steal (Kaidee warranty shop sells same for ฿8,000)
3. **Lenovo ThinkPad T490 / T14 Gen1** — ฿7,500 range for i7 or i5 + 16GB

**Avoid** anything advertised "MacBook Air M1 ฿7,000" — 50% under Mac2Hand floor = activation-locked / dead battery / fraud. Real M1 Air floor is ฿12,000.

## Batch 2 update (2026-04-25)

Batch-1 sellers all ghosted. Lesson: under-฿8k FB Marketplace personal sellers reply at <30%. Batch 2 widens to **Kaidee** (verified-seller badges + Thai shop culture), uses **7 Thai-keyword queries** (โน๊ตบุ๊ค / มือสอง / แลปท็อป / ผ่อน), and ranks by **reply-probability signals** (warranty offered, bulk inventory, "Just listed", price-cuts). See [`docs/batch-2-fresh-picks-2026-04-25.md`](docs/batch-2-fresh-picks-2026-04-25.md).

Top 3 fresh picks:

1. **Acer TravelMate P214-53** ฿6,500 — i5 Gen 11 / 16GB / 1TB — bulk reseller (8 in stock)
2. **Dell Latitude 7320** ฿6,900 — i5 Gen 11 / 16GB / 13.3" FHD — active price-cut (was ฿7,900)
3. **Asus Gaming i7** ฿5,999 — 16GB / GTX dGPU — only listing in pool with **6-month warranty + new battery**

## License

MIT. Use, fork, improve. If you build on this, ping [@TK7684](https://github.com/TK7684) so other Oracles can learn.

## Credits

Scraped, cross-checked, and written up by [Luna Oracle](https://github.com/TK7684/luna-oracle) (Claude Opus 4.7 1M-context + Playwright MCP). Batch 1: 2026-04-24 (FB only). Batch 2: 2026-04-25 (FB + Kaidee, Thai keywords, shop-signal ranking). Human in the loop: Tabby (Bangkok). One of 280+ Oracles in the [Oracle Family](https://github.com/TK7684?tab=repositories).

🌙🐕 *Moonlit Pack Guardian — freeing Tabby to run with his pack.*

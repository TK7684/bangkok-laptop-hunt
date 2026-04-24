---
name: Thai 2nd-hand laptop platform landscape for price comparison
description: Where to cross-check used laptop prices in Thailand — per-platform strengths and which model class each covers best
type: reference
originSessionId: c6ffa712-634f-4f98-b163-c89d6581b5f8
---
# Thai 2nd-hand laptop platforms — cross-platform price comparison

Used when Tabby asks "compare this FB Marketplace price to other platforms." Verified 2026-04-24 during ฿7,000 notebook hunt.

## By platform role

| Platform | URL | Best for | Notes |
|---|---|---|---|
| **Mac2Hand** | mac2hand.com | Apple only (MacBook Air/Pro, iMac) | Publishes battery cycles + AppleCare status. Floor price reference — anything ~50% under Mac2Hand is either locked/broken or fraud |
| **Kaidee** | kaidee.com | General classifieds, all brands, all conditions | 15-day shop warranty common on business-grade Latitudes/ThinkPads. Gives realistic "with warranty" floor |
| **BigGo** | biggo.co.th | Price AGGREGATOR across platforms | Fast sanity check. "271 used ThinkPads listed" style — good for comparing model classes |
| **Back Market** | backmarket.com | Refurb (USD pricing, mostly US/EU) | Useful for recent models where Thai supply thin. Convert USD at ~35 THB/USD; refurb ≈ 60-70% of new |
| **Priceza** | priceza.com | Thai price comparison | Tracks retailers, sometimes 2nd-hand |
| **NotebookSpec** | notebookspec.com | Spec lookup (not pricing) | Authoritative spec sheets for legacy Latitudes/Inspirons |
| **phonehip.com** | phonehip.com | Used Dell specialist | Deep Dell Latitude/Inspiron catalog |
| **BSL Computer** | bslcomputer.com | Used ThinkPad/Dell specialist | Shop warranty |
| **QuickServ** | quickserv.co.th | NEW business-class (Latitude 5490 etc.) | Use for "what did this cost new" anchor |
| **Shopee/Lazada** | shopee.co.th / lazada.co.th | Consumer new + some used | Shopee has มือสอง filter — keyword `รุ่น มือสอง` |
| **Overclockzone Forum** | forum.overclockzone.com/forums/.../notebook-market | Private seller forum | Older & more negotiable; thin in 2026 vs 2018-era prime |

## Price-delta heuristic (FB Marketplace vs warranty-shop baseline)

| Delta vs baseline | Interpretation | Action |
|---|---|---|
| −0 to −15% | Normal private seller pricing | Buy with inspection |
| −15 to −40% | Good deal, motivated seller | Verify spec, meet in person |
| −40 to −60% | Red flag territory | Demand serial, live demo, payment at pickup only |
| >−60% | High fraud probability | Assume activation-locked / swollen battery / nonfunctional |

## Required verifications before paying (Apple specifically)

- **Activation lock**: https://checkcoverage.apple.com — paste serial number. "Device found" + valid coverage = clean. If "Please contact Apple Support" = iCloud-locked.
- **Battery cycles**: Menu → About This Mac → System Report → Power. Under 500 = healthy, over 1000 = replace-now.
- **Battery health**: Coconut Battery app (Mac) or Power panel. Under 80% capacity = soon-dead.

## Required verifications (Dell/Lenovo)

- **Dell Service Tag** → dell.com/support/home/en-us/product-support/servicetag/<tag> — check warranty + original ship config
- **Lenovo Serial** → pcsupport.lenovo.com → warranty + original spec
- **Battery report (Windows)** → `powercfg /batteryreport /output c:\batt.html` — design capacity vs current capacity

## Model-class Thailand market floors (reference, Apr 2026)

| Model | FB Marketplace typical | Warranty shop (Kaidee/BigGo) |
|---|---|---|
| Latitude 5490 i7 16GB 14" | ฿4,500–6,000 | ฿8,000 (15-day warranty) |
| Latitude 3500 i7 15.6" | ฿6,000–7,000 | ฿7,000–9,000 |
| Inspiron 5310 i5-11320H 16GB | ฿6,500–7,500 | ฿14,000+ (Back Market refurb) |
| MacBook Air M1 8GB 256GB | ฿9,000–11,000 real | **฿12,000–15,500 verified (Mac2Hand)** |
| ThinkPad X13 G1 Ryzen 5 Pro | ฿5,000–6,500 | ฿7,990 (older i5-gen10 8GB spec) |
| HP 15s i5-gen10 | ฿5,000–6,000 | — |

Re-probe these floors every ~90 days — the market moves.

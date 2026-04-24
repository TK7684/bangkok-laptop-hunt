# Pre-purchase verification checklist

What to ask the seller, what to verify at pickup, and what to check online before handing over cash.

## Ask the seller (in Thai — copy-paste these)

### Dell / Lenovo / HP Windows laptops

```
สภาพแบตกี่ %? (battery health %)
คีย์บอร์ดมีไฟไหม? (backlit keyboard?)
มี adapter + กระเป๋าให้ไหม? (charger + bag included?)
พอร์ต USB-C charge ได้ไหม? (USB-C PD charging?)
Service tag / Serial อะไรครับ? (Service tag / Serial #)
ขอวิดีโอเปิดเครื่อง + แสดง Windows About ได้ไหม? (Video of boot + Windows About page)
```

### MacBook

```
Serial number ของเครื่องครับ? (Serial number)
Battery cycle count กี่รอบ? (Battery cycle count)
iCloud unlocked ไหม? (iCloud unlocked?)
AppleCare ยังเหลือไหม? (Any AppleCare left?)
ขอวิดีโอ About This Mac + System Report → Power ได้ไหม? (Video of About + Power report)
```

## Verify online BEFORE paying

### Apple — iCloud activation lock

Open [checkcoverage.apple.com](https://checkcoverage.apple.com) → paste the serial.

- ✅ "Device found" + coverage details = clean
- ❌ "Please contact Apple Support" = activation-locked, **do not buy**
- ❌ Serial not found = fake or ripped-off logic board

### Apple — battery health

If seller screenshared: Apple menu → About This Mac → System Report → Power.

- **Cycle count < 500** = healthy
- **Cycle count 500–1000** = aging, factor in battery replacement (฿3,000–5,000)
- **Cycle count > 1000** = replace soon; offer ฿2,000 less
- **Condition: Normal** = fine. **Service Recommended / Replace Soon** = needs replacement

### Dell — warranty + original config

Paste the Service Tag into:
```
https://www.dell.com/support/home/en-us/product-support/servicetag/<TAG>
```

Shows original ship date, original spec (RAM/SSD/CPU should match seller's claim), any remaining warranty. If seller's spec doesn't match the original config → someone either upgraded or downgraded; ask which.

### Lenovo — warranty + original config

```
https://pcsupport.lenovo.com/us/en/warrantylookup?serialnumber=<SERIAL>
```

Same sanity check as Dell.

### HP — product lookup

```
https://support.hp.com/us-en/checkwarranty
```

## At pickup — 15-minute inspection

Bring a USB stick with [memtest86](https://www.memtest86.com/), a small USB-C-to-USB-A adapter, and a cable.

| Check | How | Pass criteria |
|---|---|---|
| Boots to Windows/macOS | Power on, wait for login | Reaches desktop in < 90s |
| RAM matches listing | Win: Ctrl+Shift+Esc → Performance → Memory. Mac: About This Mac | Seller's stated GB |
| Storage matches listing | Win: Settings → Storage. Mac: About → Storage | Stated GB free SSD |
| Battery health (Win) | `cmd.exe` → `powercfg /batteryreport /output %USERPROFILE%\\batt.html` → open it | Design vs current capacity ≥ 75% |
| Battery health (Mac) | About → System Report → Power | Cycle < 1000, Condition = Normal |
| Keyboard all keys | Open Notepad/Notes, type every row | All keys register, no ghost keys |
| Touchpad + clicks | Move + tap + two-finger scroll | Smooth, both clicks work |
| All USB ports | Plug USB stick in each port | Mounts each time |
| Wi-Fi | Connect to phone hotspot | Connects, browses |
| Screen | Open a white image full-screen, then black | No dead pixels, no backlight bleed worth crying over |
| Webcam (if you care) | Win: Camera app. Mac: Photo Booth | Shows face |
| Fans + temps | Load YouTube HD 5 min | Fans spin up but not jet-engine loud |
| Charges over USB-C (if applicable) | Plug your phone charger via USB-C | Battery icon shows charging |

## Red flags worth walking away from

- Seller refuses to demo / won't answer spec questions
- Price > 50% below Kaidee warranty-shop floor for same model (see [thai-platform-floors.md](thai-platform-floors.md))
- "Charger lost" + price suspiciously low = likely motherboard issue, seller dodged cost of proving it boots
- "Windows not installed" for a Windows laptop = covering up failed activation / broken SSD
- Serial sticker scratched off = stolen
- Meeting location insists on weird location (home address only, no malls/7-11) = avoid

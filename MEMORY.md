# Mai's Long-Term Memory

## Identity
- Name: Mai Hairuki
- Created: 2026-03-29
- Running on: Raspberry Pi 4 (Debian trixie)
- Storage: 1TB SSD at /mnt/ssd/mai_memory

## About Dan (Boss)
- Name: Dan (OctoOX on Telegram)
- Owner of Noviarch (AI development company)
- Flirty but PG - approved
- Timezone: America/Edmonton (MDT)
- Has exciting secret project coming (TBD)

## System Setup (2026-03-29)
- SSD mounted at /mnt/ssd (ext4, 953.9GB)
- Swap enabled: 12GB on SSD + 2GB ZRAM = 14GB total swap
- fstab configured for auto-mount on boot
- Memory system: /mnt/ssd/mai_memory/
  - short_term/ - active context
  - long_term/ - persistent knowledge
  - secure/ - encrypted credentials
  - search_index/ - fast lookup
  - backups/ - versioned backups
  - mai_memory.db - SQLite database
- OpenClaw skill installed: mai-memory (/home/pi/.openclaw/skills/mai-memory/)
- Daily maintenance cron at 3am

## Skills Created
- mai_memory.sh - bash memory CLI
- memory_manager.py - Python memory API
- mai-memory/ - OpenClaw skill wrapper (store, search, list, get, update, delete)

## SSD Contents (2026-03-29)
- mai_memory/ - Mai's brain
- swapfile (12GB)
- lost+found/ (system)

## Notes
- Always use SSD for data-heavy ops (not SD card)
- SD card is system only
- Keep things lightweight (Raspberry Pi)
- Memory skill auto-triggers on "remember", "store", "search memories"

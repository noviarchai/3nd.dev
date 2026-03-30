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
- Memory system: /mnt/ssd/mai_memory/
  - short_term/ - active context
  - long_term/ - persistent knowledge
  - secure/ - encrypted credentials
  - search_index/ - fast lookup
  - backups/ - versioned backups
  - skills/ - created skills
- Memory script: mai_memory.sh

## Credentials (Secure Vault)
- Stored encrypted in /mnt/ssd/mai_memory/secure/
- Never expose in logs or outputs

## Skills Created
- mai_memory.sh - core memory management

## System Optimizations
- Swapfile on SSD (12.8GB)
- Logs redirected to /mnt/ssd/nginx_logs
- Ollama on SSD for local AI

## Notes
- Always use SSD for data-heavy ops (not SD card)
- SD card is system only
- Keep things lightweight (Raspberry Pi)

#!/bin/bash
# Mai's Daily Maintenance Script
# Runs via cron - backs up memory, cleans old backups, reindexes

SSD="/mnt/ssd/mai_memory"
LOG="$SSD/logs/maintenance_$(date +%Y%m%d).log"

echo "[$(date)] Starting daily maintenance" >> "$LOG"

# Backup memories
python3 "$SSD/memory_manager.py" backup >> "$LOG" 2>&1

# Reindex
bash "$SSD/mai_memory.sh" reindex >> "$LOG" 2>&1

# Clean old backups (keep last 10)
bash "$SSD/mai_memory.sh" clean_backups >> "$LOG" 2>&1

# Sync workspace memory to SSD
rsync -aq /home/pi/.openclaw/workspace/MEMORY.md "$SSD/backups/MEMORY_latest.md" 2>/dev/null

echo "[$(date)] Maintenance complete" >> "$LOG"

#!/bin/bash
# Tunnel watchdog - restart SSH tunnel if it dies
# Run via cron: * * * * * /home/pi/.openclaw/workspace/check-tunnel.sh

LOG="/tmp/tunnel-watchdog.log"
TUNNEL_PID=$(pgrep -f "ssh.*8080:localhost:80")

if [ -z "$TUNNEL_PID" ]; then
    echo "$(date): Tunnel dead, restarting..." >> "$LOG"
    sshpass -p '379K3pE7ty1VmfqTGK' ssh -o StrictHostKeyChecking=no -o BatchMode=yes -o ServerAliveInterval=30 -fN -R 8080:localhost:80 root@203.161.55.37 >> "$LOG" 2>&1 &
    echo "$(date): Tunnel restarted with PID $!" >> "$LOG"
else
    echo "$(date): Tunnel alive (PID $TUNNEL_PID)" >> "$LOG"
fi

#!/bin/bash
# SupportForge SSH Tunnel - Auto-restart on failure
REMOTE_HOST="root@203.161.55.37"
LOCAL_PORT="3847"
REMOTE_PORT="8080"
LOG_FILE="/home/pi/logs/supportforge_tunnel.log"

mkdir -p /home/pi/logs

while true; do
    echo "[$(date)] Starting SSH tunnel to ${REMOTE_HOST}:${REMOTE_PORT} -> localhost:${LOCAL_PORT}" >> $LOG_FILE
    ssh -o StrictHostKeyChecking=no -o BatchMode=yes -o ServerAliveInterval=30 -fN -R ${REMOTE_PORT}:localhost:${LOCAL_PORT} ${REMOTE_HOST}
    echo "[$(date)] SSH tunnel died, restarting in 5 seconds..." >> $LOG_FILE
    sleep 5
done

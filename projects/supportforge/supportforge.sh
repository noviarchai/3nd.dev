#!/bin/bash

# SupportForge Startup Script
SERVICE_NAME="supportforge"
PORT=3847
APP_DIR="/var/www/support.beta.nex.monster/html/supportforge"
DATA_DIR="$APP_DIR/data"
PID_FILE="/var/run/$SERVICE_NAME.pid"
LOG_FILE="/var/log/$SERVICE_NAME.log"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    error "Please run as root"
    exit 1
fi

# Ensure data directory exists
mkdir -p "$DATA_DIR"

# Start the application
start() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            log "SupportForge is already running (PID: $PID)"
            return 1
        fi
        rm "$PID_FILE"
    fi

    log "Starting SupportForge on port $PORT..."
    
    cd "$APP_DIR"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log "Installing dependencies..."
        npm install --production
    fi
    
    # Start with environment variables
    PORT=$PORT NODE_ENV=production nohup node src/server.js >> "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    
    sleep 2
    
    if kill -0 $(cat "$PID_FILE") 2>/dev/null; then
        log "SupportForge started successfully (PID: $(cat "$PID_FILE"))"
    else
        error "Failed to start SupportForge. Check $LOG_FILE"
        rm "$PID_FILE"
        exit 1
    fi
}

stop() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        log "Stopping SupportForge (PID: $PID)..."
        kill "$PID" 2>/dev/null
        sleep 2
        rm "$PID_FILE"
        log "SupportForge stopped"
    else
        log "SupportForge is not running"
    fi
}

restart() {
    stop
    sleep 1
    start
}

status() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            log "SupportForge is running (PID: $PID)"
            return 0
        fi
    fi
    log "SupportForge is not running"
    return 1
}

case "$1" in
    start) start ;;
    stop) stop ;;
    restart) restart ;;
    status) status ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac

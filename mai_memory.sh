#!/bin/bash
# Mai's Memory System v1.0
# Persistent memory with indexing, versioning, and search

SSD="/mnt/ssd/mai_memory"
MEMORY_DIR="$SSD"
CONFIG="$MEMORY_DIR/.config"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Ensure directory structure
init_memory() {
    mkdir -p "$MEMORY_DIR"/{short_term,long_term,secure,logs,skills,backups,search_index,temp}
    touch "$CONFIG"
}

# Store a memory
store() {
    local type="$1"
    local title="$2"
    local content="$3"
    local tags="${4:-}"
    local timestamp=$(date +%s)
    local id=$(echo "$title-$timestamp" | md5sum | cut -d' ' -f1)
    
    local dir="$MEMORY_DIR/$type"
    local file="$dir/${id}.md"
    
    cat > "$file" << EOF
---
id: $id
title: $title
type: $type
tags: $tags
created: $(date -Iseconds)
version: 1
---

$content
EOF

    index_memory "$id" "$title" "$type" "$tags"
    log "${CYAN}[STORE]${NC} $type: $title ($id)"
    echo "$id"
}

search() {
    local query="$1"
    local type="${2:-}"
    
    if [ -n "$type" ]; then
        grep -r -l "$query" "$MEMORY_DIR/$type" 2>/dev/null | head -20
    else
        grep -r -l "$query" "$MEMORY_DIR" --exclude-dir=secure 2>/dev/null | head -20
    fi
}

get() {
    local id="$1"
    find "$MEMORY_DIR" -name "${id}.md" -exec cat {} \; 2>/dev/null
}

update() {
    local id="$1"
    local content="$2"
    
    local file=$(find "$MEMORY_DIR" -name "${id}.md" 2>/dev/null | head -1)
    if [ -f "$file" ]; then
        local version=$(grep "^version:" "$file" | cut -d':' -f2 | tr -d ' ')
        version=$((version + 1))
        cp "$file" "$MEMORY_DIR/backups/${id}_v$((version-1)).md"
        sed -i "s/^version:.*/version: $version/" "$file"
        sed -i "/^---$/,/^---$/d" "$file"
        echo -e "---\n$(head -5 "$file")\n---\n$content" > "$file"
        log "${YELLOW}[UPDATE]${NC} $id -> v$version"
    fi
}

index_memory() {
    local id="$1"
    local title="$2"
    local type="$3"
    local tags="$4"
    echo "$id|$title|$type|$tags" >> "$MEMORY_DIR/search_index/.index"
}

reindex() {
    log "${CYAN}[REINDEX]${NC} Building search index..."
    rm -f "$MEMORY_DIR/search_index/.index"
    touch "$MEMORY_DIR/search_index/.index"
    for type in short_term long_term secure; do
        for file in "$MEMORY_DIR/$type"/*.md; do
            [ -f "$file" ] || continue
            local id=$(basename "$file" .md)
            local title=$(grep "^title:" "$file" | cut -d':' -f2 | tr -d ' ')
            local tags=$(grep "^tags:" "$file" | cut -d':' -f2 | tr -d ' ')
            echo "$id|$title|$type|$tags" >> "$MEMORY_DIR/search_index/.index"
        done
    done
    log "${GREEN}[DONE]${NC} Reindex complete"
}

list_memories() {
    local type="${1:-}"
    if [ -n "$type" ]; then
        for file in "$MEMORY_DIR/$type"/*.md; do
            [ -f "$file" ] || continue
            local id=$(basename "$file" .md)
            local title=$(grep "^title:" "$file" | cut -d':' -f2 | tr -d ' ')
            local tags=$(grep "^tags:" "$file" | cut -d':' -f2 | tr -d ' ')
            echo "[$type] $title (tags: $tags)"
        done
    else
        for type in short_term long_term secure; do
            for file in "$MEMORY_DIR/$type"/*.md 2>/dev/null; do
                [ -f "$file" ] || continue
                local id=$(basename "$file" .md)
                local title=$(grep "^title:" "$file" | cut -d':' -f2 | tr -d ' ')
                local tags=$(grep "^tags:" "$file" | cut -d':' -f2 | tr -d ' ')
                echo "[$type] $title (tags: $tags)"
            done
        done
    fi
}

backup() {
    local backup_dir="$MEMORY_DIR/backups/backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    cp -r "$MEMORY_DIR/short_term" "$MEMORY_DIR/long_term" "$backup_dir/" 2>/dev/null
    cp "$MEMORY_DIR/search_index/.index" "$backup_dir/" 2>/dev/null
    log "${GREEN}[BACKUP]${NC} Created: $backup_dir"
}

quick_search() {
    local query="$1"
    grep -i "$query" "$MEMORY_DIR/search_index/.index" 2>/dev/null | head -20
}

clean_backups() {
    cd "$MEMORY_DIR/backups" || return
    ls -dt backup_* | tail -n +11 | xargs rm -rf 2>/dev/null
    log "${CYAN}[CLEAN]${NC} Removed old backups"
}

init_memory

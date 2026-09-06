#!/usr/bin/env bash
set -euo pipefail

backup_dir=/var/backups/assistant-gateway
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
target="$backup_dir/assistant-gateway-$timestamp.dump"
temporary="$target.partial"

install -d -m 700 "$backup_dir"
umask 077
runuser -u postgres -- pg_dump --format=custom assistant_gateway > "$temporary"
mv "$temporary" "$target"
find "$backup_dir" -type f -name 'assistant-gateway-*.dump' -mtime +14 -delete

#!/bin/bash
# Pre-build verification - ensures source is correct before building
EXPECTED_PAGES=68
EXPECTED_COMPONENTS=33

PAGES=$(ls /var/www/iluxuryegypt/client/src/pages/ 2>/dev/null | wc -l)
COMPONENTS=$(ls /var/www/iluxuryegypt/client/src/components/ 2>/dev/null | wc -l)

if [ "$PAGES" -lt "$EXPECTED_PAGES" ]; then
    echo "[BLOCKED] Source code is outdated! Expected $EXPECTED_PAGES pages, found $PAGES"
    echo "DO NOT BUILD ON THIS SERVER without syncing source first."
    echo "Deploy from the local dev machine using: python deploy_fast.py"
    exit 1
fi

if [ "$COMPONENTS" -lt "$EXPECTED_COMPONENTS" ]; then
    echo "[BLOCKED] Source code is outdated! Expected $EXPECTED_COMPONENTS components, found $COMPONENTS"
    echo "DO NOT BUILD ON THIS SERVER without syncing source first."
    echo "Deploy from the local dev machine using: python deploy_fast.py"
    exit 1
fi

echo "[OK] Source verified: $PAGES pages, $COMPONENTS components"

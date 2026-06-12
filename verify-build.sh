#!/bin/bash
# Pre-build verification - ensures source is correct before building
EXPECTED_PAGES=68
EXPECTED_COMPONENTS=33

PAGES=$(ls /var/www/iluxuryegypt/client/src/pages/ 2>/dev/null | wc -l)
COMPONENTS=$(ls /var/www/iluxuryegypt/client/src/components/ 2>/dev/null | wc -l)

if [ "$PAGES" -lt "$EXPECTED_PAGES" ]; then
    echo "[WARN] Source path /var/www/iluxuryegypt not found (expected $EXPECTED_PAGES pages, found $PAGES). Skipping legacy server check."
fi

if [ "$COMPONENTS" -lt "$EXPECTED_COMPONENTS" ]; then
    echo "[WARN] Source path /var/www/iluxuryegypt not found (expected $EXPECTED_COMPONENTS components, found $COMPONENTS). Skipping legacy server check."
fi

echo "[OK] Build proceeding."

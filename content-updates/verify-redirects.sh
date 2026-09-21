#!/usr/bin/env bash
# Proves every redirect answers 301 with the right Location, over GET and HEAD.
#
#   bash content-updates/verify-redirects.sh https://iluxuryegypt.com
#
# GET and HEAD both, and that is the whole point of this file. The owner's
# `curl -sI https://iluxuryegypt.com/stay` returned 200 for weeks while a
# browser redirected correctly, because -I sends HEAD and every redirect
# middleware was guarded on `req.method !== "GET"`. Checking one method is how
# that went unnoticed. scripts/test-redirects.ts asserts the same cases against
# a locally booted server; this one asserts them against what is deployed.
#
# GENERATED. Every expected target below was computed by calling
# resolveRedirect() from server/path-redirects.ts, not written by hand. The
# first version of this file was written by hand and got /stay/<slug> wrong:
# it expected /luxury-hotels-in-egypt/<slug> because /stay appears in
# PATH_PREFIX_REDIRECTS, missing that CHILD_PATH_REDIRECTS is consulted first
# and sends every sub-path of /stay to /hotel instead. Deriving the answer from
# the function removes that whole class of mistake. Regenerate rather than
# editing this by hand.
#
# 55 redirects, 110 assertions.

set -uo pipefail
BASE="${1:-https://iluxuryegypt.com}"
pass=0; fail=0

check() {
  local path="$1" want="$2" expected="$BASE$2"
  for method in GET HEAD; do
    local flag=""; [ "$method" = "HEAD" ] && flag="-I"
    local out code loc
    out=$(curl -s $flag -o /dev/null -w '%{http_code} %{redirect_url}' "$BASE$path")
    code="${out%% *}"; loc="${out#* }"
    if [ "$code" = "301" ] && [ "$loc" = "$expected" ]; then
      pass=$((pass+1))
      printf '  ok    %-4s %-62s -> %s\n' "$method" "$path" "$want"
    else
      fail=$((fail+1))
      printf '  FAIL  %-4s %-62s got %s %s (wanted 301 %s)\n' "$method" "$path" "$code" "$loc" "$expected"
    fi
  done
}

echo "Checking 55 redirects against $BASE, GET and HEAD each"
echo

check "/blog/do-us-citizens-need-a-visa-for-egypt" "/blog/egypt-visa-for-us-citizens"
check "/blog/is-egypt-safe-for-american-tourists" "/blog/is-egypt-safe-for-americans"
check "/blog/vaccines-for-egypt-travel" "/blog/vaccinations-needed-for-egypt"
check "/blog/how-to-plan-a-luxury-egypt-trip" "/blog/planning-a-trip-to-egypt"
check "/blog/things-to-know-before-traveling-to-egypt" "/blog/egypt-travel-tips"
check "/blog/egypt-packing-list" "/blog/what-to-pack-for-egypt"
check "/blog/luxury-egypt-vacations" "/blog/luxury-egypt-tours"
check "/blog/luxury-egypt-anniversary-trip" "/blog/egypt-honeymoon"
check "/blog/grand-egyptian-museum-private-tour" "/blog/grand-egyptian-museum-tour"
check "/blog/vip-cairo-experience" "/blog/private-tours-in-cairo-egypt"
check "/blog/private-egypt-tour" "/blog/private-tours-in-cairo-egypt"
check "/blog/bespoke-egypt-travel" "/blog/tailor-made-egypt-tours"
check "/blog/what-currency-does-egypt-use" "/blog/currency-in-egypt"
check "/blog/cairo-airport-transfer" "/"
check "/stay/four-seasons-cairo" "/hotel/four-seasons-cairo"
check "/luxury-hotels-in-egypt/four-seasons-cairo" "/hotel/four-seasons-cairo"
check "/egypt-tour-packages" "/luxury-egypt-tour-packages"
check "/egypt-tour-packages/classic-egypt" "/luxury-egypt-tour-packages/classic-egypt"
check "/luxury-egypt-tour-packages/egypt-solo-travel" "/luxury-egypt-tour-packages/egypt-tours-for-solo-travellers"
check "/luxury-egypt-tour-packages/egypt-solo-travel/classic-egypt" "/luxury-egypt-tour-packages/egypt-tours-for-solo-travellers/classic-egypt"
check "/luxury-egypt-tour-packages/small-group-tours-egypt" "/luxury-egypt-tour-packages/small-group-egypt-tours"
check "/luxury-egypt-tour-packages/small-group-tours-egypt/classic-egypt" "/luxury-egypt-tour-packages/small-group-egypt-tours/classic-egypt"
check "/categories/egypt-solo-travel" "/luxury-egypt-tour-packages/egypt-tours-for-solo-travellers"
check "/categories/egypt-solo-travel/classic-egypt" "/luxury-egypt-tour-packages/egypt-tours-for-solo-travellers/classic-egypt"
check "/categories/small-group-tours-egypt" "/luxury-egypt-tour-packages/small-group-egypt-tours"
check "/categories/small-group-tours-egypt/classic-egypt" "/luxury-egypt-tour-packages/small-group-egypt-tours/classic-egypt"
check "/destinations/cairo" "/egypt-travel-guide/cairo-travel-guide"
check "/destinations/cairo/classic-egypt" "/egypt-travel-guide/cairo-travel-guide/classic-egypt"
check "/destinations/luxor" "/egypt-travel-guide/attractions-in-luxor"
check "/destinations/luxor/classic-egypt" "/egypt-travel-guide/attractions-in-luxor/classic-egypt"
check "/destinations/aswan" "/egypt-travel-guide/aswan-egypt-attractions"
check "/destinations/aswan/classic-egypt" "/egypt-travel-guide/aswan-egypt-attractions/classic-egypt"
check "/destinations/alexandria" "/egypt-travel-guide/alexandria-egypt-attractions"
check "/destinations/alexandria/classic-egypt" "/egypt-travel-guide/alexandria-egypt-attractions/classic-egypt"
check "/destinations/hurghada" "/egypt-travel-guide/things-to-do-in-hurghada"
check "/destinations/hurghada/classic-egypt" "/egypt-travel-guide/things-to-do-in-hurghada/classic-egypt"
check "/destinations/siwa-oasis" "/egypt-travel-guide/siwa-oasis-egypt"
check "/destinations/siwa-oasis/classic-egypt" "/egypt-travel-guide/siwa-oasis-egypt/classic-egypt"
check "/destinations" "/egypt-travel-guide"
check "/destinations/classic-egypt" "/egypt-travel-guide/classic-egypt"
check "/stay" "/luxury-hotels-in-egypt"
check "/stay/classic-egypt" "/hotel/classic-egypt"
check "/10-day-egypt-family-tour" "/family-tours-egypt"
check "/egypt-luxury-family-tour" "/egypt-family-vacation-packages"
check "/14-day-egypt-family-tour" "/egypt-tours-family"
check "/7-day-solo-travel-egypt" "/7-day-egypt-tour"
check "/9-day-solo-egypt" "/10-day-egypt-tour"
check "/solo-vacation-packages-luxury-egypt-5-day-tour" "/12-days-egypt-tour"
check "/14-day-royal-egypt" "/egypt-private-tour-packages"
check "/9-day-egypt-pyramids-luxor-sea" "/egypt-private-tours"
check "/14-day-egypt-small-group-tour" "/egypt-small-group-tour"
check "/14-day-luxury-egypt-tour-package" "/egypt-small-group-tour"
check "/10-day-nile-cruise" "/egypt-nile-cruise-packages"
check "/luxury-siwa-oasis-expedition" "/best-luxury-egypt-tours"
check "/7-day-vip-egypt" "/luxury-small-group-tours-egypt"

echo
echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ] || exit 1

#!/bin/bash
# Pre-warm prerender cache for all pages
# Run daily via cron to ensure crawlers always get fast responses

BASE="http://localhost:5000"
LOG="/var/log/cache-warm.log"
echo "$(date): Starting cache warm" >> $LOG

# Static pages
for page in / /destinations /egypt-tour-packages /egypt-day-tours /egypt-nile-cruise-tours /blog /contact /stay /tailor-made /faq /about/who-we-are /about/iluxury-difference /about/your-experience /about/trusted-worldwide /privacy-policy /terms-conditions /cookie-policy /responsible-travel /disclaimer; do
  curl -s --max-time 60 "${BASE}${page}?_prerender=true" > /dev/null 2>&1
  sleep 2
done

# Category pages
PGPASSWORD=Egyptluxury2026 psql -h localhost -p 5432 -U luxuryegypt -d luxuryegypt -t -c "SELECT slug FROM categories;" 2>/dev/null | tr -d " " | while read slug; do
  [ -n "$slug" ] && curl -s --max-time 60 "${BASE}/egypt-tour-packages/${slug}?_prerender=true" > /dev/null 2>&1 && sleep 2
done

# Blog posts
PGPASSWORD=Egyptluxury2026 psql -h localhost -p 5432 -U luxuryegypt -d luxuryegypt -t -c "SELECT slug FROM posts WHERE published=true;" 2>/dev/null | tr -d " " | while read slug; do
  [ -n "$slug" ] && curl -s --max-time 60 "${BASE}/blog/${slug}?_prerender=true" > /dev/null 2>&1 && sleep 2
done

# Destinations
PGPASSWORD=Egyptluxury2026 psql -h localhost -p 5432 -U luxuryegypt -d luxuryegypt -t -c "SELECT slug FROM destinations;" 2>/dev/null | tr -d " " | while read slug; do
  [ -n "$slug" ] && curl -s --max-time 60 "${BASE}/destinations/${slug}?_prerender=true" > /dev/null 2>&1 && sleep 2
done

# Tours
PGPASSWORD=Egyptluxury2026 psql -h localhost -p 5432 -U luxuryegypt -d luxuryegypt -t -c "SELECT slug FROM tours;" 2>/dev/null | tr -d " " | while read slug; do
  [ -n "$slug" ] && curl -s --max-time 60 "${BASE}/${slug}?_prerender=true" > /dev/null 2>&1 && sleep 2
done

echo "$(date): Cache warm complete" >> $LOG

#!/bin/bash
# Emergency restore - restores the correct dist from backup
echo 'Restoring dist from backup...'
rm -rf /var/www/iluxuryegypt/dist
cp -r /var/www/iluxuryegypt/dist_backup_correct /var/www/iluxuryegypt/dist
pm2 restart iluxury
echo '[OK] Dist restored and server restarted'
echo 'Assets:' && ls /var/www/iluxuryegypt/dist/public/assets/ | grep 'index-'

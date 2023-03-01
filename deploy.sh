#!/bin/bash

PM2_STATUS=$(npx pm2 status 0 | grep -c "online")

if [ $PM2_STATUS -eq 1 ]; then
  echo "Restarting process with ID 0"
  npx pm2 restart 0
else
  echo "Starting index.js"
  npx pm2 start index.js
fi

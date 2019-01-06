#!/bin/bash
echo "[start] mce_api"
echo "MCE_ENV = $MCE_ENV"

if [ "$MCE_ENV" = "development" ]
then
  bash /app/build.sh
elif [ "$MCE_ENV" = "build" ]
then
  bash /app/build.sh
else
  # start
  /app/bin/mce -c /app/config.yml
fi
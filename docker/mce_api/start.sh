#!/bin/bash
echo "[start] mce_api"
echo "MCE_ENV = $MCE_ENV"

if [ "$MCE_ENV" = "development" ]
then
  bash /app/build.sh
fi

# start
/app/bin/mce -c /app/config.yml
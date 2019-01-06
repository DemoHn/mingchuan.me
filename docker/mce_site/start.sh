#!/bin/bash
echo "[start] mce_site"
echo "NODE_ENV = $NODE_ENV"

if [ "$NODE_ENV" = "development" ]
then
  bash /app/build.sh
  yarn dev
elif [ "$NODE_ENV" = "build" ]
then
  bash /app/build.sh
else
  yarn start
fi
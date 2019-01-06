#!/bin/bash
echo "[start] mce_site"
echo "MCE_ENV = $MCE_ENV"

# run build script
if [ "$MCE_ENV" = "development" ]
then
  NODE_ENV=$MCE_ENV yarn && yarn dev
else
  # run production build
  cp -r /app/dist/.nuxt /app/src
  NODE_ENV=$MCE_ENV yarn start
fi
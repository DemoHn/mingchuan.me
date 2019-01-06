#!/bin/bash
echo "[start] mce_site"
echo "MCE_ENV = $MCE_ENV"

# set NODE_ENV
if [ "$MCE_ENV" = "build" ]
then
  NODE_ENV=production
else
  NODE_ENV=$MCE_ENV
fi
echo "NODE_ENV = $NODE_ENV"

# install deps
yarn

# run build script
if [ "$MCE_ENV" = "development" ]
then
  NODE_ENV=$NODE_ENV bash /app/build.sh
  yarn dev
elif [ "$MCE_ENV" = "build" ]
then
  NODE_ENV=$NODE_ENV bash /app/build.sh
else
  # run production build
  cp -r /app/dist/.nuxt /app/src
  yarn start
fi
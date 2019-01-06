#!/bin/bash
echo "[build] mce_site"
echo "NODE_ENV = $NODE_ENV"

# clear old build
rm -rf /app/dist/.nuxt
yarn
if [ "$NODE_ENV" != "development" ]
then
  yarn build
  # move artifacts manually to dist/ folder 
  cp -r .nuxt /app/dist
fi
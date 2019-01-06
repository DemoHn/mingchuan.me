#!/bin/bash
echo "[build] mce_site"

# install deps
yarn

# clear old build
rm -rf /app/dist/.nuxt

# build
NODE_ENV=production yarn build

# move artifacts manually to dist/ folder 
cp -r .nuxt /app/dist

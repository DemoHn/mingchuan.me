#!/bin/bash

# build 
echo '[build] start building web-main...'
pushd packages/web-main; yarn && yarn build; popd

echo '[build] start building api-main...'
pushd packages/api-main; yarn && yarn build; popd

echo '[tar] tar data...'
mkdir -p build

echo '[tar] generating api-main.tar.gz...'
tar -C packages/api-main -czf build/api-main.tar.gz node_modules package.json dist migrations

echo '[tar] generating web-main.tar.gz...'
tar -C packages/web-main -czf build/web-main.tar.gz node_modules package.json .next static server.js
#!/bin/bash
echo "NODE_ENV = $NODE_ENV"

yarn
if [ "$NODE_ENV" = "development" ]
then
  yarn dev
else
  yarn build && yarn start
fi
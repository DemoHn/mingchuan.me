#!/bin/bash

ROOT=/go/src/mingchuan.me
BIN=/app/bin
# remove old build
rm -f $BIN/mce
rm -rf $ROOT/api/restapi $ROOT/api/models

# a tricky way to install swagger
if ! [ -x "$(command -v swagger)" ]; then
  # a faster way to install go-swagger
  mkdir -p /go/src/github.com/go-swagger
  git clone --depth=1 https://github.com/go-swagger/go-swagger /go/src/github.com/go-swagger/go-swagger
  go install github.com/go-swagger/go-swagger/cmd/swagger
fi

# change to workdir
cd /go/src/mingchuan.me
# genearte swagger files
swagger generate server -t api -f $ROOT/api/swagger.yml --exclude-main -A mce
# build binary
GO111MODULE=on CGO_ENABLED=0 go build -ldflags "-s -w" -o $BIN/mce -v $ROOT/main.go
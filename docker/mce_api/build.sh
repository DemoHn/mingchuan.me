#!/bin/bash

ROOT=/go/src/mingchuan.me
BIN=/app/bin
# remove old build
rm -f $BIN/mce
rm -rf $ROOT/api/restapi $ROOT/api/models

# genearte swagger files
swagger generate server -t api -f $ROOT/api/swagger.yml --exclude-main -A mce	
# build binary
CGO_ENABLED=0 go build -ldflags "-s -w" -o $BIN/mce -v $ROOT/main.go
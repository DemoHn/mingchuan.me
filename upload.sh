#!/bin/sh

echo '[upload] api-main.tar.gz'
scp build/web-main.tar.gz root@mingchuan.me:/data/mingchuan.me/tar
echo '[upload] web-main.tar.gz'
scp build/api-main.tar.gz root@mingchuan.me:/data/mingchuan.me/tar

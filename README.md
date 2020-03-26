# mingchuan.me

## Overview

This repository aims to host the backend server (API server) of [mingchuan.me](https://mingchuan.me).

## Deployment

This site is hosted on [Zeit Now](https://zeit.co), thanks to its amazing building tools, the whole process becomes dramatically easy.


## Notes

1. Build packages & upload artifacts to remote server:

```sh
$ ./build.sh && ./upload.sh
```

IN THE FUTURE, we will just run `node ./start.js build && node ./start.js upload`

PLANNED `./start.js` commands:

```
build: build artifacts for all packages to get ready for upload
upload: upload artifacts to main server
monitor: monitor web applications
monitor-server: monitor server status (need to run as root user)
```

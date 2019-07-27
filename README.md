# mingchuan.me

## Overview

This repository aims to host the backend server (API server) of [mingchuan.me](https://mingchuan.me).

## Deployment

This site is hosted on [Zeit Now](https://zeit.co), thanks to its amazing building tools, the whole process becomes dramatically easy.


## Notes

1. Build docker image:

```
docker build -t demohn/mingchuan.me:1 .
```

2. Run docker image:

```
docker run -it --rm -v "$(pwd)"/Caddyfile:/etc/Caddyfile --env-file .env -p 80:80 -p 443:443 -p 8080:8080 demohn/mingchuan.me:1
```
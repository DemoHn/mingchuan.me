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

2. How to setup local development environment:
  - start a MySQL server on local machine.
  - setup an accessible account (SELECT/CREATE/ALTER/UPDATE/DELETE/DROP) and create a database named `mce_main`.
  - create a `.env` file on `packages/api-main` and write data as follows:

  ```
# db
DATABASE_URL=mysql://<user>:<password>@127.0.0.1:3306/mce_main
  ```

  - cd to `packages/api-main`, and run `yarn run migrate:up`
  - run `yarn run dev:local`


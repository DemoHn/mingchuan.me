# Build stage
# api-main, web-main
FROM node:11-alpine AS builder

WORKDIR /app
COPY . .

# install deps
RUN yarn
# install lerna
RUN yarn global add lerna
# build
RUN NODE_ENV=production lerna run build

# tar artifacts
# api-main
RUN tar -C packages/api-main -czf api-main.tar.gz node_modules package.json dist migrations

# web-main
RUN tar -C packages/web-main -czf web-main.tar.gz node_modules package.json .next static

# Installer Stage
FROM node:11-alpine AS container

WORKDIR /srv

# install PM2
RUN yarn global add pm2
# # init dir
RUN mkdir -p bin packages/web-main packages/api-main node_modules

# copy caddy
COPY --from=abiosoft/caddy /usr/bin/caddy /srv/bin
# copy BE & FE build artifacts
COPY --from=builder /app/web-main.tar.gz .
COPY --from=builder /app/api-main.tar.gz .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY --from=builder /app/lerna.json .
# untar data
RUN tar -xzf web-main.tar.gz -C packages/web-main
RUN tar -xzf api-main.tar.gz -C packages/api-main

# copy misc config file
COPY config/pm2.config.js .
COPY config/Caddyfile /etc

# # copy PM2
ENTRYPOINT ["pm2-runtime", "/srv/pm2.config.js"]
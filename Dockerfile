# Build stage
# api-main, web-main
FROM node:11-alpine AS builder

WORKDIR /app
COPY . .

# install deps for api-main
RUN yarn

# tar artifacts
# api-main
RUN tar -C packages/api-main -czf api-main.tar.gz node_modules package.json dist migrations

# web-main
RUN tar -C packages/web-main -czf web-main.tar.gz node_modules package.json .next static server.js

# Installer Stage
FROM node:11-alpine AS container

WORKDIR /srv

# # init dir
RUN mkdir -p bin packages/web-main packages/api-main node_modules

# copy BE & FE build artifacts
COPY --from=builder /app/web-main.tar.gz .
COPY --from=builder /app/api-main.tar.gz .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY --from=builder /app/lerna.json .
# untar data
RUN tar -xzf web-main.tar.gz -C packages/web-main
RUN tar -xzf api-main.tar.gz -C packages/api-main

# # copy PM2
ENTRYPOINT ["pm2-runtime", "/srv/pm2.config.js"]
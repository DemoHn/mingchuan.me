# Frontend Build Stage
FROM node:11-alpine AS WEB-builder

WORKDIR /app
COPY packages/web-main .

# install deps
RUN yarn
# build
RUN NODE_ENV=production yarn build

# Backend Build Stage
FROM node:11-alpine AS API-builder

WORKDIR /app
RUN mkdir -p /app/src
COPY packages/api-main ./src
# move out tsconfig.json
RUN mv src/tsconfig.json src/package.json .

# install deps
RUN yarn
# build
RUN yarn build --outDir build

# # Installer Stage
# FROM node:11-alpine AS container

# WORKDIR /srv

# # install PM2
# RUN yarn global add pm2
# # init dir
# RUN mkdir -p api web config pm2

# # copy caddy
# COPY --from=abiosoft/caddy /usr/bin/caddy .
# # copy FE & BE build artifacts
# COPY --from=API-builder /app/bin/mce api/
# COPY --from=WEB-builder /app/. web/
# # copy PM2
# COPY pm2.config.js pm2/

# ENTRYPOINT ["pm2", "start", "/srv/pm2/pm2.config.js", "--no-daemon"]
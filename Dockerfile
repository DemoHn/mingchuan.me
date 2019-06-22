# Frontend Build Stage
FROM node:11-alpine AS WEB-builder

WORKDIR /app
COPY src/web.mce .

# install deps
RUN yarn
# build
RUN NODE_ENV=production yarn build

# Backend Build Stage
FROM golang:1.12-alpine AS API-builder

# install git
RUN apk update && apk upgrade && \
    apk add bash git make

WORKDIR /go/src/mingchuan.me

ENV ROOT=/go/src/mingchuan.me
ENV BIN=/app/bin

COPY src/api.mce .

RUN mkdir -p $BIN
# install go-swagger
RUN go get -u github.com/go-swagger/go-swagger/cmd/swagger
# genearte swagger files
RUN swagger generate server -t app/drivers/swagger -f api/swagger.yml --exclude-main -A mce
# build binary
RUN GO111MODULE=on CGO_ENABLED=0 go build -ldflags "-s -w" -o $BIN/mce -v $ROOT/main.go


# Installer Stage
FROM node:11-alpine AS container

WORKDIR /srv

# install PM2
RUN yarn global add pm2
# init dir
RUN mkdir -p api web config pm2

# copy caddy
COPY --from=abiosoft/caddy /usr/bin/caddy .
# copy FE & BE build artifacts
COPY --from=API-builder /app/bin/mce api/
COPY --from=WEB-builder /app/. web/
# copy PM2
COPY pm2.config.js pm2/

ENTRYPOINT ["pm2", "start", "/srv/pm2/pm2.config.js", "--no-daemon"]
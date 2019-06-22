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
FROM abiosoft/caddy AS installer

WORKDIR /srv

# install nodejs
RUN mkdir -p /srv/api /srv/web
COPY --from=API-builder /app/bin/mce api/

ENTRYPOINT ["tail", "-f", "/dev/null"]
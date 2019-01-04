FROM golang:1.11-alpine

# install git
RUN apk update && apk upgrade && \
    apk add bash git make

# install dep, go-swagger
RUN go get -u -v github.com/go-swagger/go-swagger/cmd/swagger

RUN mkdir -p /app/storage
# install dep to vendor/ folder
WORKDIR /go/src/mingchuan.me

EXPOSE 4000

CMD ["bash", "/app/start.sh"]
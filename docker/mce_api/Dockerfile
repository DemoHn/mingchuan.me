FROM golang:1.11-alpine

# install git
RUN apk update && apk upgrade && \
    apk add bash git make

RUN mkdir -p /app/bin /app/storage

EXPOSE 4000

CMD ["bash", "/app/start.sh"]
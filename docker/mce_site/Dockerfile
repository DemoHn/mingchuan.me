FROM node:11-alpine

# install bash
RUN apk update && apk upgrade && \
  apk add bash

RUN mkdir -p /app/src /app/dist

WORKDIR /app/src

# add start script
EXPOSE 3000
CMD ["bash", "/app/start.sh"]

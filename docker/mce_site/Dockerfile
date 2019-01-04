FROM node:11-alpine

# install bash
RUN apk update && apk upgrade && \
  apk add bash

# build deps
WORKDIR /app/web.mce

ENV NODE_ENV=production

ENV HOST 0.0.0.0
# add start script
EXPOSE 3000
CMD ["bash", "/app/start.sh"]

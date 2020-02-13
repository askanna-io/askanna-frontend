FROM node:lts-alpine as build-stage
WORKDIR /app

# install and cache app dependencies
COPY package.json /app/package.json

RUN npm install

VOLUME ["/app"]

CMD ["npm", "run", "serve"]
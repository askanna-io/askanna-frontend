FROM node:lts-alpine as build-stage
WORKDIR /app

# install and cache app dependencies
COPY package.json /app/package.json

RUN npm install

VOLUME ["/app"]

EXPOSE 8080

CMD ["npm", "run", "serve"]
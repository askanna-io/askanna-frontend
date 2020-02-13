# build stage
FROM node:lts-alpine as build-stage
VOLUME ["/app", "/app/node_modules"]
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:./node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json

RUN npm install
RUN npm install -D
RUN npm install -g @vue/cli@4.1.2

# start app
CMD ["npm", "run", "serve"]
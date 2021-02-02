############################################
# Base image - enough for local development
############################################
FROM node:lts-alpine as base-stage

WORKDIR /app
COPY package*.json ./

RUN npm ci

EXPOSE 8080
CMD ["npm", "run", "serve"]


############################################
# Build image - contains built code
############################################
FROM base-stage as build-stage

COPY . .

RUN npm run build

############################################
# Production image - serves built code
############################################
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./compose/vhost.d/default.conf /etc/nginx/conf.d/default.conf

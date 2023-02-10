ARG BASE_IMAGE=base-image

##################################################################
# Base image - install dependencies
##################################################################
FROM node:lts-alpine as base-image
LABEL org.opencontainers.image.authors="AskAnna <support@askanna.io>"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

##################################################################
# Build image - contains built code
##################################################################
FROM $BASE_IMAGE AS build
LABEL org.opencontainers.image.authors="AskAnna <support@askanna.io>"

COPY . .

RUN npm run build

##################################################################
# Production image - serves built code
##################################################################
FROM nginx:stable-alpine as production
LABEL org.opencontainers.image.authors="AskAnna <support@askanna.io>"

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./docker/vhost.d/default.conf /etc/nginx/conf.d/default.conf

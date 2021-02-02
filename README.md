# AskAnna Frontend

This repository holds code for the AskAnna Frontend. Code is written in Typescript and using the
VueJS framework.

## Development using Docker

You can use Docker Compose to run the project locally.

First you need to a little local configuration. The next commands you only have to run once.
The next configuration only has to be done once. Docker compose will use these files while
building the container.

```shell
ln -s docker-compose.local.yml docker-compose.override.yml
ln -s .env.development .env.production.local
```

Use the following command to start a Docker container running the AskAnna frontend:

```shell
docker-compose up
```

After creating the container, you can open the frontend:
[http://localhost:8080](http://localhost:8080). Please mind that we don't support HTTPS for local
development.

If you have changed the Dockerfile or changed something in `package.json`, please allow docker to
rebuild the image:

```shell
docker-compose up --build
```

Any change in the `src` folder will be automatically picked up and rebuild in this modus.

### Developing remotely

It is possible to use a remote Docker instance while developing locally. Information is found the
[docker-compose.mutagen.yml](./docker-compose.mutagen.yml) file.

This method can also be used when developing on a MacOS to improve the app performance.

## Running build version in docker-compose

In case we are happy with the work and want to see how this builds into the staging environment,
one can simulate that by setting the `docker-compose.production.yml` to be the
`docker-compose.override.yml`:

```shel
ln -s docker-compose.production.yml docker-compose.override.yml
```

And then run:

```shell
docker-compose up --build
```

In this setup the AskAnna Frontend local production version can be accessed via:
[askanna.127-0-0-1.nip.io](http://askanna.127-0-0-1.nip.io).

## Development local without Docker

### Vue specific configuration for docker

In the root folder in the file `vue.config.js` we configured `host` to `0.0.0.0`. When used in a
non-docker setup, you will be exposing the application publicly on the local network. **BE AWARE**

### Project setup

```shell
npm install
```

### Compiles and hot-reloads for development

```shell
npm run serve
```

### Compiles and minifies for production

```shell
npm run build
```

### Run your unit tests

```shell
npm run test:unit
```

### Run your end-to-end tests

```shell
npm run test:e2e
```

### Lints and fixes files

```shell
npm run lint
```

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

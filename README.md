# AskAnna Frontend

This repository holds code for the AskAnna Frontend. Code is written in Typescript and using the
VueJS framework.

## Development using Docker

You can use Docker Compose to run the project locally.

First you need to a little local configuration. The next commands you only have to run once.
The next configuration only has to be done once. Docker compose will use these files while
building the container.

```shell
ln -s .env.development .env.production.local
```

Use the following command to start a Docker container running the AskAnna frontend:

```shell
docker-compose up
```

After creating the container, you can open the frontend:
[http://localhost:8080](http://localhost:8080). Please mind that we don't support HTTPS for local
development.

If you have changed the Dockerfile or changed something in `package.json`, please allow Docker to
rebuild the image:

```shell
docker-compose up --build
```

Any change in the `src` folder will be automatically picked up and rebuild in this modus.

### Change AskAnna backend

When you develop locally, by default it will use the backend hosted at `https://api.askanna.eu`. In
the file `.env.development` you can change the value `VUE_APP_API_URL`. For example, if you have
the AskAnna Backend running locally you could set the value to `http://localhost:8000`.

### Removing docker-compose setup

In case you don't want to develop or run `askanna-frontend` locally anymore, or something happened
which corrupted your installation. You can execute the following to remove `askanna-frontend` from
your system:

```bash
docker-compose rm --stop -v -f
```

This will remove all volumes which where created for `askanna-frontend` to run.

## Development without Docker

### Vue specific configuration for docker

In the root folder in the file `vue.config.js` we configured `host` to `0.0.0.0`. When used in a
non-Docker setup, you will be exposing the application publicly on the local network. **BE AWARE!**

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

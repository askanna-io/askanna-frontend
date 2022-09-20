# AskAnna Frontend

This repository holds code for the AskAnna Frontend. Code is written in Typescript and using the VueJS framework.

## Development using Docker

You can use Docker Compose to run the project locally.

First, you need to do some minor local configuration. The following command, you only have to run initially. Docker
compose will use these files while building the container.

```bash
ln -s .env.development .env.production.local
```

Use the following command to start a Docker container running the AskAnna Frontend:

```bash
docker compose up
```

After creating the container, you can open the frontend: [http://localhost:5173](http://localhost:5173). Please mind
that we don't support HTTPS for local development.

The container starts a local web server with
[Hot Module Replacement](https://vitejs.dev/guide/features.html#hot-module-replacement). It will automatically provide
instant updates when you save a change.

If you want to run a web server that serves the build solution from `./dist`, you can change the target in the file
`docker-compose.yml` and set it to `preview-stage`.

### Removing docker-compose setup

In case you don't want to run the AskAnna Frontend container anymore, or something happened which corrupted your
installation. You can execute the following to remove Askanna Frontend container from your system:

```bash
docker compose rm --stop -v -f
```

## Development without Docker

### Install packages

```shell
npm install
```

### Compiles and hot-reloads for development

```shell
npm run dev
```

### Compiles and minifies for production

```shell
npm run build
```

### Run preview of the build solution

```shell
npm run preview
```

Note: you first need to build, before you can run the preview

## Change AskAnna backend

When you develop locally, by default it will use the backend hosted at `https://api.askanna.eu`. In the file
`.env.development` you can change the value `VITE_APP_API_URL`. For example, if you have the AskAnna Backend running
locally you could set the value to `http://localhost:8000`.

This will remove all volumes which where created for `askanna-frontend` to run.

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

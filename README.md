# AskAnna Frontend

This repository holds code for the AskAnna Frontend. Our frontend stack primarily uses [Vue.js](https://vuejs.org/)
and leverages the Composition API for over 90% of the components. We use [Pinia](https://pinia.vuejs.org/) for store
management. Pinia is a modern and intuitive state management system for Vue.

We utilize [Vuetify](https://vuetifyjs.com), a popular UI component library for Vue, to provide a polished and
streamlined user interface. This library offers various customizable and reusable components, allowing us to rapidly
build and maintain a consistent design system.

To streamline development and building processes, we use [Vite](https://vitejs.dev/). Vite is a fast, modern,
lightweight build tool that provides instant hot module replacement, lightning-fast bundling and a seamless
development experience.

By utilizing this frontend stack, we have aimed to deliver a performant and reliable user experience that is both
developer-friendly and scalable.

More information about AskAnna can be found on [the company site](https://askanna.io). In
[the documentation](https://docs.askanna.io) you can read more about how to use AskAnna.

## Development using GitPod

AskAnna can be developed in a [GitPod](https://www.gitpod.io/) workspace. If you open the project in GitPod, it will
automatically install dependencies and spin-up a development environment with
[Hot Module Replacement](https://vitejs.dev/guide/features.html#hot-module-replacement).

## Development using Docker

You can use [Docker Compose](https://docs.docker.com/compose/) to run the project locally.

Use the following command to start a Docker container running the AskAnna Frontend:

```shell
docker compose up
```

After creating the container, you can open the frontend: [http://localhost:5173](http://localhost:5173). Please mind
that we don't support HTTPS for local development.

The container starts a local web server with
[Hot Module Replacement](https://vitejs.dev/guide/features.html#hot-module-replacement). It will automatically provide
instant updates when you save a change.

### Removing docker-compose setup

In case you don't want to run the AskAnna Frontend container anymore, or something happened which corrupted your
installation. You can execute the following to remove AskAnna Frontend container from your system:

```shell
docker compose rm --stop -v -f
```

This will remove all containers and volumes which where created for `askanna-frontend` to run.

### Preview of the build solution

To get a preview of the AskAnna Frontend as-if it is a production site, you can build an AskAnna Frontend using the
Dockerfile located at `docker/Dockerfile`.

```shell
docker build -f docker/Dockerfile -t askanna/frontend:preview .
docker run --rm -p 8080:80 askanna/frontend:preview
```

After creating the container, you can open the frontend: [http://localhost:8080](http://localhost:8080). Please mind
that we don't support HTTPS for local development.

## Development without Docker

With [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) you can quickly install the packages needed to
work on the AskAnna Frontend.

### Install packages

```shell
npm install
```

### Compiles and development with Hot Module Replacement

```shell
npm run dev
```

### Compiles and minifies for production

```shell
npm run build -- --mode development
```

### Run preview of the minified build solution

```shell
npm run preview
```

Or run the build & preview with a "single" command:

```shell
npm run build -- --mode development && npm run preview
```

## Configuration

### Change AskAnna Backend

When you develop locally, by default it will use the backend hosted at `https://beta-api.askanna.eu`. If you want to
change this settings, the advice is to make a local copy of the `.env.development` file:

```shell
cp .env.development .env.development.local
```

In the `.env.development.local` you can change the value `VITE_APP_API_URL`. For example, if you have the AskAnna
Backend running locally, you could set the value to `http://localhost:8000`.

### Sentry logging

If you want to enable Sentry logging while working on the AskAnna Frontend, in the `.env.development.local` file you
can add the DSN URL linked to your Sentry project in the variable `VITE_APP_SENTRY_URL`.

### Vue.js configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

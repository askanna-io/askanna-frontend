# askanna-frontend

This is the repository the holds code for AskAnna-Frontend. Code is written in Typescript and using the VueJS framework.

## Running for development

We use Docker Compose to run the project locally. 

The first thing to do is configure docker-compose to use local ports and volumes. This only needs to be run once.

```
ln -s docker-compose.local.yml docker-compose.override.yml
```

From the on, use the following command to start your containers.

```
docker-compose up
```

You can visit the result in [http://localhost:8080](http://localhost:8080). Please mind that we don't have support for HTTPS yet.


If you have changed the Dockerfile or changed something in `package.json`, please allow docker to rebuild the image:

```
docker-compose up -build
```

Any change in the `src` folder will be automatically picked up and rebuild in this modus.

### Developing remotely

It is possible to use a remote Docker instance while developing locally. Information is found the [docker-compose.mutagen.yml](./docker-compose.mutagen.yml) file.

This method can also be used when developing on a macOS to improve the app performance.


## Running build version in docker-compose

In case we are happy with the work and want to see how this builds into the staging environment, one can simulate that via:

```
docker-compose -f production.yml up --build
```

On building the image, the command `npm run build` is issued to build.

In this setup the front-end code with backend and can be accessed via: [askanna.127-0-0-1.nip.io](http://askanna.127-0-0-1.nip.io).

## Vue specific configuration for docker

In the root folder in the file `vue.config.js` we configured `host` to `0.0.0.0`. When used in a non-docker setup, you will be exposing the application publicly on the local network. **BE AWARE**


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

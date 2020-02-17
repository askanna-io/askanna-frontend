# askanna-frontend

This is the repository the holds code for AskAnna-Frontend. Code is written in Typescript and using the VueJS framework.

## Running for development

We provide a way to run the code in a dockerized environment. This setup asumes you are *NOT* running your own webserver like nginx or apache on your local machine. The setup contains a nginx reverse proxy which will occupy port 80 on your machine.

If you already have some webserver software running which is on port 80, please shut this down before using the following commands.

You can visit the result in [http://askanna.localhost](http://askanna.localhost). Please mind that we don't have support for HTTPS yet.

```
docker-compose -f local.yml up
```

If you have changed the Dockerfile or changed something in `package.json`, please allow docker to rebuild the image:

```
docker-compose -f local up -build
```

Any change in the `src` folder will be automaticly picked up and rebuild in this modus.

## Running build version in docker-compose

In case we are happy with the work and want to see how this builds into the staging environment, one can simulate that via:

```
docker-compose -f production.yml up --build
```

On building the image, the command `npm run build` is issued to build.

In this setup the front-end code with backend and can be accessed via: [askanna.localhost](http://askanna.localhost).

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

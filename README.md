# askanna-frontend

## Running build version in docker-compose
```
docker-compose -f local.yml up
```

If you have changed the Dockerfile or changed something in `package.json`, please allow docker to rebuild the image:

```
docker-compose -f local up -build
```

Any change in the `src` folder will be automaticly picked up and rebuild in this modus.

### Build modus (staging modus)

In case we are happy with the work and want to see how this builds into the staging environment, one can simulate that via:

```
docker-compose -f production.yml up --build
```

On building the image, the command `npm run build` is issued to build.

In this setup the front-end code with backend and can be accessed via: [askanna.localhost](http://askanna.localhost).

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

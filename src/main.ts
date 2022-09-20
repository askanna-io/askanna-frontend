import Vue from 'vue'
import { markRaw } from 'vue'
import App from './App.vue'
import router from './router/index'
import vuetify from './plugins/vuetify'
import * as Sentry from '@sentry/vue'
import Sticky from 'vue-sticky-directive'
import { BrowserTracing } from '@sentry/tracing'
import { createPinia, PiniaVuePlugin } from 'pinia'

if (import.meta.env.VUE_APP_SENTRY === 'on') {
  const rate: number = parseFloat(<string>import.meta.env.VITE_APP_SENTRY_TRACES_RATE || '0')

  Sentry.init({
    Vue,
    ignoreErrors: ['Non-Error exception captured', 'Non-Error promise rejection captured'],
    dsn: 'https://c3668b20284540cb91541549285dcc94@o451235.ingest.sentry.io/5436959',
    environment: import.meta.env.VITE_APP_SENTRY_ENV,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: [import.meta.env.VITE_APP_API_URL, /^\//]
      })
    ],
    tracesSampleRate: rate
  })
}

// global filter
Vue.filter('capitalize', function (value: string) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
Vue.filter('lowercase', function (value: string) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toLowerCase() + value.slice(1)
})

Vue.use(Sticky)
Vue.use(PiniaVuePlugin)

const pinia = createPinia()

pinia.use(({ store }) => {
  store.$routerAskAnna = markRaw(useRouterAskAnna())
})

//check if the current user is authenticated
const notAllowedRouteWithToken = ['signin', 'signup']

router.beforeEach((to, previus, next) => {
  if (to.name === next.name) return
  if (to.name === previus.name && to.hash) return

  const token = window.localStorage.getItem('token')
  const isRequiresAuth = to.matched.some(route => route.meta.requiresAuth)
  const isNotAllowedWithToken = notAllowedRouteWithToken.some(route => route === to.name)

  if (isRequiresAuth && !token && to.name !== 'signin') {
    window.localStorage.setItem('back_after_login', window.location.pathname)

    next({
      name: 'projects'
    })
  } else if (token && isNotAllowedWithToken) {
    next('/')
  } else {
    next()
  }
})

new Vue({
  router,
  pinia,
  vuetify,
  render: h => h(App)
}).$mount('#app')

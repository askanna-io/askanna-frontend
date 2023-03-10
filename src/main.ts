import Vue from 'vue'
import App from './App.vue'
import { markRaw } from 'vue'
import router from './router/index'
import * as Sentry from '@sentry/vue'
import vuetify from './plugins/vuetify'
import Sticky from 'vue-sticky-directive'
import { BrowserTracing } from '@sentry/tracing'
import { createPinia, PiniaVuePlugin } from 'pinia'

if (import.meta.env.VITE_APP_SENTRY_URL) {
  const rate: number = parseFloat(
    <string>import.meta.env.VITE_APP_SENTRY_TRACES_RATE || '0'
  )

  Sentry.init({
    Vue,
    ignoreErrors: [
      'Non-Error exception captured',
      'Non-Error promise rejection captured'
    ],
    dsn: import.meta.env.VITE_APP_SENTRY_URL,
    environment: import.meta.env.VITE_APP_SENTRY_ENV,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router)
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

router.beforeEach((to, previous, next) => {
  if (
    to.path !== '/' &&
    (to?.path === next?.path || to?.path === previous?.path) &&
    Object.is(to?.query, previous?.query)
  )
    return false
  if (to.name === previous.name && to.hash) return false

  const token = window.localStorage.getItem('token')
  const isRouteRequiresAuth = to.matched.some(
    (route) => route.meta.requiresAuth
  )
  const isRouteNotAllowedWithToken = notAllowedRouteWithToken.some(
    (route) => route === to.name
  )

  if (isRouteRequiresAuth && !token && !isRouteNotAllowedWithToken) {
    next({
      name: 'projects'
    })
  } else if (token && isRouteNotAllowedWithToken) {
    next('/')
  } else {
    next()
  }
})

router.afterEach((to) => {
  const token = window.localStorage.getItem('token')
  const isErrorPage = to.name?.includes('does-not-exist')
  const isNotAllowedToBack = notAllowedRouteWithToken.some(
    (route) => route === to?.name
  )

  if (!token && !isNotAllowedToBack && !isErrorPage) {
    window.localStorage.setItem('back_after_login', window.location.pathname)
  }
})

new Vue({
  router,
  pinia,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')

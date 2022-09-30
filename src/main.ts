import Vue from 'vue'
import { markRaw } from 'vue'
import App from './App.vue'
import router from './router/index'
import vuetify from './plugins/vuetify'
import * as Sentry from '@sentry/vue'
import Sticky from 'vue-sticky-directive'
import { BrowserTracing } from '@sentry/tracing'
import { createPinia, PiniaVuePlugin } from 'pinia'

if (import.meta.env.VITE_APP_SENTRY_URL) {
  const rate: number = parseFloat(<string>import.meta.env.VITE_APP_SENTRY_TRACES_RATE || '0')

  Sentry.init({
    Vue,
    ignoreErrors: ['Non-Error exception captured', 'Non-Error promise rejection captured'],
    dsn: import.meta.env.VITE_APP_SENTRY_URL,
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

router.beforeEach((to, previous, next) => {
  if (to.name === next.name || to.name === previous.name) return
  if (to.name === previous.name && to.hash) return

  const token = window.localStorage.getItem('token')
  const isRequiresAuth = to.matched.some(route => route.meta.requiresAuth)
  const isNotAllowedWithToken = notAllowedRouteWithToken.some(route => route === to.name)

  if (isRequiresAuth && !token && to.name !== 'signin') {
    next({
      name: 'projects'
    })
  } else if (token && isNotAllowedWithToken) {
    next('/')
  } else {
    next()
  }
})

router.afterEach(to => {
  const token = window.localStorage.getItem('token')
  const isErrorPage = to.name?.includes('does-not-exist')

  if (!token && to?.name !== 'signin' && !isErrorPage) {
    window.localStorage.setItem('back_after_login', window.location.pathname)
  }
})

new Vue({
  router,
  pinia,
  vuetify,
  render: h => h(App)
}).$mount('#app')

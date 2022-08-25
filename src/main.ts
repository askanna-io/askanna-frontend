import Vue from 'vue'
import './core/components'
import VueAxios from 'vue-axios'
import { app, router } from './core'
import Beta from '@/core/plugins/beta'
import VueFileAgent from 'vue-file-agent'
import $axios from '@/core/plugins/axios'
import Sticky from 'vue-sticky-directive'
import hooks from '@/core/plugins/vue-hooks'
import vuetify from '@/core/plugins/vuetify'
import 'vue-file-agent/dist/vue-file-agent.css'
import VueCompositionApi from '@vue/composition-api'
import { createPinia, PiniaVuePlugin } from 'pinia'

import './registerServiceWorker'

import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { Vue as VueIntegration } from '@sentry/integrations'

const pinia = createPinia()

Vue.use(VueAxios, $axios)

Vue.use(PiniaVuePlugin)

if (process.env.VUE_APP_SENTRY === 'on') {
  const rate: number = parseFloat(<string>process.env.VUE_APP_SENTRY_TRACES_RATE || '0')

  Sentry.init({
    ignoreErrors: ['Non-Error exception captured', 'Non-Error promise rejection captured'],
    dsn: 'https://c3668b20284540cb91541549285dcc94@o451235.ingest.sentry.io/5436959',
    environment: process.env.VUE_APP_SENTRY_ENV,
    integrations: [
      new VueIntegration({
        Vue,
        tracing: true
      }),
      new Integrations.BrowserTracing()
    ],
    tracesSampleRate: rate
  })
}

Vue.use(VueFileAgent)
// register globally
Vue.use(Beta)
Vue.use(hooks)
Vue.use(Sticky)

Vue.use(VueCompositionApi)
Vue.config.productionTip = false

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

//init app instance
new Vue({
  router,
  pinia,
  vuetify,
  render: h => h(app)
}).$mount('#app')

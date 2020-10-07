import Vue from 'vue'
import './core/components'
import VueAxios from 'vue-axios'
import hooks from '@u3u/vue-hooks'
import Beta from '@/core/plugins/beta'
import VueFileAgent from 'vue-file-agent'
import VueClipboard from 'vue-clipboard2'
import $axios from '@/core/plugins/axios'
import Sticky from 'vue-sticky-directive'
import Logger from '@/core/plugins/logger'
import { app, router, store } from './core'
import vuetify from '@/core/plugins/vuetify'
import 'vue-file-agent/dist/vue-file-agent.css'
import VueCompositionApi from '@vue/composition-api'

import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { Vue as VueIntegration } from '@sentry/integrations'

if (process.env.VUE_APP_SENTRY === 'on') {
  const rate: number = parseFloat(<string>process.env.VUE_APP_SENTRY_TRACES_RATE || '0')

  Sentry.init({
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

import VueKinesis from 'vue-kinesis'

Vue.use(VueKinesis)

import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'vue-prism-editor/dist/prismeditor.min.css'
Vue.use(VueClipboard)
Vue.use(VueFileAgent)
// register globally
Vue.use(Beta)
Vue.use(hooks)
Vue.use(Logger)
Vue.use(Sticky)

Vue.use(VueCompositionApi)
Vue.config.productionTip = false

//check if the current user is authenticated
router.beforeEach((to, _, next) => {
  if (to.name === 'join') {
    next()

    return
  }
  const token = window.localStorage.getItem('token')
  const backAfterUrl = window.localStorage.getItem('back_after_login')

  if (!token && to.name !== 'login') {
    window.localStorage.setItem('back_after_login', window.location.pathname)
    next('login')
  } else if (token && backAfterUrl) {
    window.localStorage.setItem('back_after_login', '')

    next(backAfterUrl)
  } else if (token && to.name === 'login') {
    next('/workspace')
  } else {
    next()
  }
})

Vue.use(VueAxios, $axios)

//init app instance
new Vue({
  router,
  store,
  vuetify,
  render: h => h(app)
}).$mount('#app')

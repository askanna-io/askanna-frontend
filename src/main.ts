import Vue from 'vue'
import axios from 'axios'
import './core/components'
import VueAxios from 'vue-axios'
import hooks from '@u3u/vue-hooks'
import Beta from '@/core/plugins/beta'
import Logger from '@/core/plugins/logger'
import { app, router, store } from './core'

import { makeServer } from './server/index'

import vuetify from '@/core/plugins/vuetify'
import VueCompositionApi from '@vue/composition-api'

import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'vue-prism-editor/dist/VuePrismEditor.css'

import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

// register globally
import Sticky from 'vue-sticky-directive'
Vue.use(Sticky)
Vue.use(hooks)
Vue.use(Beta)
Vue.use(hooks)
Vue.use(Logger)

Vue.use(VueCompositionApi)
Vue.config.productionTip = false

//check if the current user is authenticated
router.beforeEach((to, _, next) => {
  const token = window.localStorage.getItem('token')

  if (!token && to.name !== 'login') {
    next('login')
  } else if (token && to.name === 'login') {
    next('/workspace')
  } else {
    next()
  }
})
// create axios instance and set csrftoken for Django
const $axios = axios.create()
$axios.defaults.xsrfCookieName = 'csrftoken'
$axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'

// add token to request if exist
$axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')

    if (token != null) {
      config.headers.Authorization = `Token ${token}`
    }

    return config
  },

  function (err) {
    return Promise.reject(err)
  }
)

// for each response check status
$axios.interceptors.response.use(
  config => config,

  err => {
    if (err.response && err.response.status === 401) {
      router.push({ name: 'login' })
    }

    return Promise.reject(err)
  }
)

Vue.use(VueAxios, $axios)

if (process.env.NODE_ENV === 'development') {
  makeServer()
}

//init app instance
new Vue({
  router,
  store,
  vuetify,
  render: h => h(app)
}).$mount('#app')

export { $axios }

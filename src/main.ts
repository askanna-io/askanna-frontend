import Vue from 'vue'
import axios from 'axios'
import './core/components'
import VueAxios from 'vue-axios'
import hooks from '@u3u/vue-hooks'
import { app, router, store } from './core'
import logger from '@/core/plugins/logger'
import vuetify from '@/core/plugins/vuetify'
import VueCompositionApi from '@vue/composition-api'
import validationRules from '@/core/plugins/validationRules'

Vue.use(hooks)
Vue.use(logger)
Vue.use(validationRules)
Vue.use(VueCompositionApi)
Vue.config.productionTip = false

//check if the current user is authenticated
router.beforeEach((to, _, next) => {
  const token = window.localStorage.getItem('token')

  if (!token && to.name !== 'login') {
    next('login')
  } else if (token && to.name === 'login') {
    next('/')
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
  function(config) {
    const token = localStorage.getItem('token')

    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },

  function(err) {
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

//init app instance
new Vue({
  router,
  store,
  vuetify,
  render: h => h(app)
}).$mount('#app')

export { $axios }

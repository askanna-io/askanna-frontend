import Vue from 'vue'
import './core/components'
import VueAxios from 'vue-axios'
import hooks from '@u3u/vue-hooks'
import Beta from '@/core/plugins/beta'
import $axios from '@/core/plugins/axios'
import Sticky from '@/core/plugins/sticky'
import Logger from '@/core/plugins/logger'
import { app, router, store } from './core'
import vuetify from '@/core/plugins/vuetify'
import VueCompositionApi from '@vue/composition-api'

import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'vue-prism-editor/dist/VuePrismEditor.css'

import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

// register globally
Vue.use(Beta)
Vue.use(hooks)
Vue.use(Logger)
Vue.use(Sticky)

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

Vue.use(VueAxios, $axios)

//init app instance
new Vue({
  router,
  store,
  vuetify,
  render: h => h(app)
}).$mount('#app')

import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/features/auth/config'

import workspace from '@/features/workspace/config'

Vue.use(Router)
export default new Router({
  routes: [
    ...auth.paths,
    ...workspace.paths,
    {
      path: '*',
      redirect: '/login'
    }
  ],
  mode: 'history',
  base: process.env.BASE_URL
})

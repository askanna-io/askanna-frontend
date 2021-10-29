import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/features/auth/config'
import user from '@/features/user/config'
//import project from '@/features/project/config'

import workspace from '@/features/workspace/config'

Vue.use(Router)
export default new Router({
  routes: [
    ...auth.paths,
    ...user.paths,
    //...project.paths,
    ...workspace.paths,
    {
      path: '*',
      redirect: '/signin'
    }
  ],
  mode: 'history',
  base: process.env.BASE_URL
})

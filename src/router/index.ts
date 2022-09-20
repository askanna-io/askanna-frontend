import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/features/auth/config'
import user from '@/features/user/config'
import projects from '@/features/projects/config'
import workspace from '@/features/workspace/config'
import workspaces from '@/features/workspaces/config'

Vue.use(Router)
export default new Router({
  routes: [
    ...auth.paths,
    ...user.paths,
    ...projects.paths,
    ...workspaces.paths,
    ...workspace.paths,

    {
      path: '*',
      redirect: '/signin'
    }
  ],
  mode: 'history',
  base: import.meta.env.BASE_URL
})

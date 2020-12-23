import Router from 'vue-router'
import workspaceConfig from '@/features/workspace/config'

export default () => {
  return new Router({
    routes: [
      ...workspaceConfig.paths,
      {
        path: '*',
        redirect: '/signin'
      }
    ],
    mode: 'history',
    base: process.env.BASE_URL
  })
}

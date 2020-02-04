import Vue from 'vue'
import Router from 'vue-router'

const modules = require.context('@/features', true, /config.ts$/)
const paths: any[] = []
const moduleKeys = modules.keys()

for (const modulePath of moduleKeys) {
  const moduleRoutes = modules(modulePath).default

  paths.push(...moduleRoutes.paths)
}

Vue.use(Router)
export default new Router({
  routes: [
    ...paths,
    {
      path: '*',
      redirect: '/login'
    }
  ],
  mode: 'history',
  base: process.env.BASE_URL
})

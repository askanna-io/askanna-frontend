export default {
  paths: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "production" */ './views/TheDashboard.vue')
    }
  ]
}

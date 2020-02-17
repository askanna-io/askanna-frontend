export default {
  paths: [
    {
      name: 'dashboard',
      path: '/',
      component: () => import(/* webpackChunkName: "production" */ './views/TheDashboard.vue')
    }
  ]
}

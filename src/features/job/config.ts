export default {
  paths: [
    {
      path: '/job/:id',
      name: 'job',
      component: () => import(/* webpackChunkName: "job" */ './views/TheJob.vue')
    }
  ]
}

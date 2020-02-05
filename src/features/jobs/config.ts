export default {
  paths: [
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import(/* webpackChunkName: "login" */ './views/TheJobs.vue')
    }
  ]
}

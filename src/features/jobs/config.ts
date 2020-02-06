export default {
  paths: [
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import(/* webpackChunkName: "jobs" */ './views/TheJobs.vue')
    }
  ]
}

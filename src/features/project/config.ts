export default {
  paths: [
    {
      path: '/project/:id',
      name: 'project',
      component: () => import(/* webpackChunkName: "project" */ './views/TheProject.vue')
    }
  ]
}

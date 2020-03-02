export default {
  paths: [
    {
      name: 'projects',
      path: '/projects',
      component: () => import(/* webpackChunkName: "projects" */ './views/TheProjects.vue')
    }
  ]
}

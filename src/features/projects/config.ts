export default {
  paths: [
    {
      path: '/projects/',
      component: () => import(/* webpackChunkName: "projects" */ '../projects/views/public-projects.vue'),
      name: 'projects',
      meta: {
        requiresAuth: false,
        hideAppBarIcon: true,
        title: 'AskAnna public project'
      }
    }
  ]
}

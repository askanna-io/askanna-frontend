export const projects = {
  paths: [
    {
      path: '/projects',
      component: () => import('./views/Projects.vue'),
      name: 'projects',
      meta: {
        requiresAuth: false,
        hideAppBarIcon: true,
        title: 'AskAnna public project'
      }
    }
  ]
}
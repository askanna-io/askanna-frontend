export const projects = {
  paths: [
    {
      path: '/projects',
      component: () => import('./views/index.vue'),
      name: 'projects',
      meta: {
        requiresAuth: false,
        hideAppBarIcon: true,
        title: 'AskAnna public project'
      }
    }
  ]
}

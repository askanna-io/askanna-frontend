export const user = {
  paths: [
    {
      path: '/profile',
      component: () => import('./views/Profile.vue'),
      name: 'profile',
      meta: {
        requiresAuth: true,
        hideAppBarIcon: true,
        title: 'AskAnna profile',
        breadcrumb: 'Edit my profile'
      }
    }
  ]
}

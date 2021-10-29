export default {
  paths: [
    {
      path: '/profile',
      component: () => import(/* webpackChunkName: "profile" */ './views/profile.vue'),
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

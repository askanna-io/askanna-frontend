export const auth = {
  paths: [
    {
      path: '/',
      name: 'check-access',
      meta: {
        requiresAuth: true,
        hideAppBarIcon: true
      },
      component: () => import('./views/check-access.vue')
    },
    {
      meta: {
        title: 'Log in to AskAnna'
      },
      path: '/signin',
      component: () => import('./views/signin/index.vue'),
      name: 'signin'
    },
    {
      meta: {
        title: 'Sign up AskAnna'
      },
      path: '/signup',
      component: () => import('./views/signin/index.vue'),
      name: 'signup'
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('./views/logout.vue')
    },
    {
      path: '/join/:token/workspace/:workspaceId/people/:peopleId',
      name: 'join',
      component: () => import('./views/join.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('./views/forgot-password.vue')
    },
    {
      path: '/account/reset-password',
      name: 'account-reset-password',
      component: () => import('./views/reset-password.vue')
    }
  ]
}

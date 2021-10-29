export default {
  paths: [
    {
      path: '/',
      name: 'check-access',
      meta: {
        requiresAuth: true,
        hideAppBarIcon: true
      },
      component: () => import(/* webpackChunkName: "check-access" */ './views/check-access.vue')
    },
    {
      meta: {
        title: 'Log in to AskAnna'
      },
      path: '/signin',
      component: () => import(/* webpackChunkName: "signin" */ './views/signin/index.vue'),
      name: 'signin'
    },
    {
      meta: {
        title: 'Sign up AskAnna'
      },
      path: '/signup',
      component: () => import(/* webpackChunkName: "signup" */ './views/signin/index.vue'),
      name: 'signup'
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import(/* webpackChunkName: "login" */ './views/TheLogout.vue')
    },
    {
      path: '/join/:token/workspace/:workspaceId/people/:peopleId',
      name: 'join',
      component: () => import(/* webpackChunkName: "join" */ './views/join.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import(/* webpackChunkName: "login" */ './views/forgot-password.vue')
    },
    {
      path: '/account/reset-password',
      name: 'account-reset-password',
      component: () => import(/* webpackChunkName: "join" */ './views/account/resetPassword.vue')
    }
  ]
}

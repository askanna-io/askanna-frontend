export const auth = {
  paths: [
    {
      path: '/',
      name: 'check-access',
      meta: {
        requiresAuth: true,
        hideAppBarIcon: true,
        layout: 'ThePublicLayout'
      },
      component: () => import('./views/CheckAccess.vue')
    },
    {
      path: '/signin',
      name: 'signin',
      meta: {
        title: 'Log in to AskAnna',
        layout: 'TheLoginLayout'
      },
      component: () => import('./views/Signin.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      meta: {
        title: 'Sign up AskAnna',
        layout: 'TheLoginLayout'
      },
      component: () => import('./views/Signin.vue'),
    },
    {
      path: '/logout',
      name: 'Logout',
      component: () => import('./views/Logout.vue')
    },
    {
      path: '/join/:token/workspace/:workspaceId/people/:peopleId',
      name: 'join',
      meta: {
        title: 'Join in to AskAnna',
        layout: 'TheLoginLayout'
      },
      component: () => import('./views/JoinIn.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      meta: {
        title: 'Forgot password',
        layout: 'TheLoginLayout'
      },
      component: () => import('./views/ForgotPassword.vue')
    },
    {
      path: '/account/reset-password',
      name: 'account-reset-password',
      meta: {
        title: 'Reset password',
        layout: 'TheLoginLayout'
      },
      component: () => import('./views/AccountResetPassword.vue')
    }
  ]
}
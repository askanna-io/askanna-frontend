export default {
  paths: [
    {
      meta: {
        title: 'Log in to AskAnna'
      },
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ './views/login/index.vue'),
      children: [
        {
          path: '',
          name: 'login',
          component: () => import(/* webpackChunkName: "login" */ './views/login/login.vue')
        }
      ]
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

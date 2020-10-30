export default {
  paths: [
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/TheLogin.vue')
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
    }
  ]
}

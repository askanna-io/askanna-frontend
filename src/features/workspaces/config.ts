export const workspaces = {
  paths: [
    {
      path: '/workspaces',
      component: () => import('./views/Workspaces.vue'),
      name: 'workspaces',
      meta: {
        hideAppBarIcon: true,
        title: 'Workspaces'
      }
    }
  ]
}

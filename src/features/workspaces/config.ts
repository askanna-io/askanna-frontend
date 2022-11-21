export const workspaces = {
  paths: [
    {
      path: '/workspaces',
      component: () => import('./views/workspaces.vue'),
      name: 'workspaces',
      meta: {
        hideAppBarIcon: true,
        title: 'Workspaces'
      }
    }
  ]
}

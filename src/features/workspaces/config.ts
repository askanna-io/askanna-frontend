export default {
  paths: [
    {
      path: '/workspaces',
      component: () => import(/* webpackChunkName: "workspaces" */ '../workspaces/views/workspaces.vue'),
      name: 'workspaces',
      meta: {
        hideAppBarIcon: true,
        title: 'Workspaces'
      }
    }
  ]
}

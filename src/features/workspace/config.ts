export default {
  paths: [
    {
      path: '/workspace',
      component: () => import(/* webpackChunkName: "workspace-index" */ './views/index.vue'),
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "workspace" */ './views/TheWorkspace.vue'),
          name: 'workspace'
        },
        {
          path: 'project/:id',
          component: () => import(/* webpackChunkName: "workspace-add" */ '../project/views/TheProject.vue'),
          name: 'workspace-project'
        }
      ]
    }
  ]
}

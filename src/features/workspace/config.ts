export default {
  paths: [
    {
      path: '/workspace',
      name: 'workspace',
      component: () => import(/* webpackChunkName: "workspace" */ './views/TheWorkspace.vue')
    }
  ]
}

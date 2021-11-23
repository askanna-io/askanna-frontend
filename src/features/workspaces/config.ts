import { PERMISSIONS_LABELS } from '@/features/workspace/store/const'

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

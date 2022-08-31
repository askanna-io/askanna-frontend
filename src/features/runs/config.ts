import { runRoutes } from '@/features/run/config'

export const runsRoutes = {
  path: 'runs',
  component: () => import(/* webpackChunkName: "workspace-project-job-runs-index" */ './views/index.vue'),
  meta: {
    breadcrumb: 'Runs'
  },
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "workspace-project-job-runs" */ './views/runs.vue'),
      name: 'workspace-project-job-jobruns',
      redirect: { name: 'workspace-project-jobs-job-runs-table' },

      children: [
        {
          path: 'table',
          component: () =>
            import(/* webpackChunkName: "workspace-project-uuid-jobs-name-runs-table-view" */ './views/table-view.vue'),
          name: 'workspace-project-jobs-job-runs-table',
          meta: {
            tabValue: 'table'
          }
        },
        {
          path: 'compare',
          component: () =>
            import(
              /* webpackChunkName: "workspace-project-uuid-jobs-name-runs-compare-view" */ './views/compare-view.vue'
            ),
          name: 'workspace-project-jobs-job-runs-compare',
          meta: {
            tabValue: 'compare'
          }
        }
      ]
    },

    ...runRoutes
  ]
}

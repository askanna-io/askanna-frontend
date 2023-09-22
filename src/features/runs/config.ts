import { runRoutes } from '@/features/run/config'

export const runsRoutes = {
  path: 'runs',
  component: () => import('./views/JobRunsIndex.vue'),
  meta: {
    breadcrumb: 'Runs'
  },
  children: [
    {
      path: '',
      component: () => import('./views/JobRunsList.vue'),
      name: 'workspace-project-job-runs',
      redirect: { name: 'workspace-project-jobs-job-runs-table' },

      children: [
        {
          path: 'table',
          component: () => import('./views/JobRunsTableView.vue'),
          name: 'workspace-project-jobs-job-runs-table',
          meta: {
            tabValue: 'table'
          }
        },
        {
          path: 'compare',
          component: () => import('./views/JobRunsCompareView.vue'),
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

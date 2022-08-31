import { jobRoutes } from '@/features/job/config'

export const jobsRoutes = {
  path: 'jobs',
  component: () => import(/* webpackChunkName: "workspace-project-uuid-jobs-index" */ './views/index.vue'),
  meta: {
    breadcrumb: 'Jobs',
    hideAppBarIcon: true
  },
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "workspace-project-uuid-jobs" */ './views/jobs.vue'),
      name: 'workspace-project-jobs',
      meta: {
        breadcrumb: 'Packages',
        hideAppBarIcon: true
      }
    },
    ...jobRoutes
  ]
}

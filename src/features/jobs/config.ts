import { jobRoutes } from '@/features/job/config'

export const jobsRoutes = {
  path: 'jobs',
  component: () => import('./views/index.vue'),
  meta: {
    breadcrumb: 'Jobs',
    hideAppBarIcon: true
  },
  children: [
    {
      path: '',
      component: () => import('./views/jobs.vue'),
      name: 'workspace-project-jobs',
      meta: {
        breadcrumb: 'Packages',
        hideAppBarIcon: true
      }
    },
    ...jobRoutes
  ]
}

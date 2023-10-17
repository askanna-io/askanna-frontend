import { jobRoutes } from '@/features/job/config'

export const jobsRoutes = {
  path: 'jobs',
  component: () => import('./views/ProjectJobsIndex.vue'),
  meta: {
    breadcrumb: 'Jobs',
    hideAppBarIcon: true,
  },
  children: [
    {
      path: '',
      component: () => import('./views/ProjectJobs.vue'),
      name: 'workspace-project-jobs',
      meta: {
        breadcrumbLevel: 2,
        hideAppBarIcon: true
      }
    },
    ...jobRoutes
  ]
}

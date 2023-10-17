import { runsRoutes } from '@/features/runs/config'
import { PERMISSIONS_LABELS } from '@/features/workspace/types'

export const jobRoutes = [
  {
    path: 'job-does-not-exist',
    component: () => import('./views/JobDoesNotExist.vue'),
    name: 'workspace-project-job-does-not-exist',
    meta: {
      title: 'Oops...we cannot find this job',
      breadcrumb: 'Job does not exist',
      breadcrumbLevel: 3
    }
  },
  {
    path: ':jobId',
    redirect: { name: 'workspace-project-job-overiew' },

    component: () => import('./views/JobIndex.vue'),
    meta: {
      breadcrumb: 'Job - :jobId'
    },
    children: [
      runsRoutes,
      {
        path: 'overview',
        component: () => import('./views/JobOverview.vue'),
        name: 'workspace-project-job-overiew',
        meta: {
          title: 'Overview',
          breadcrumbLevel: 4,
          breadcrumb: 'Overview',
        }
      },
      {
        path: 'edit',
        component: () => import('./views/JobEdit.vue'),
        name: 'workspace-project-job-edit',
        meta: {
          breadcrumb: 'Edit',
          permission: PERMISSIONS_LABELS.projectJobEdit
        }
      }
    ]
  }
]

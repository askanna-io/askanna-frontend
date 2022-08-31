import { runsRoutes } from '@/features/runs/config'
import { PERMISSIONS_LABELS } from '@/features/workspace/types'

export const jobRoutes = [
  {
    path: 'job-does-not-exist',
    component: () =>
      import(/* webpackChunkName: "workspace-project-job-does-not-exist" */ './views/job-does-not-exist.vue'),
    name: 'workspace-project-job-does-not-exist',
    meta: {
      title: 'Oops...we cannot find this job',
      breadcrumb: 'Job does not exist'
    }
  },
  {
    path: ':jobId',
    redirect: { name: 'workspace-project-job-overiew' },

    component: () => import(/* webpackChunkName: "workspace-project-uuid-jobs-id" */ './views/index.vue'),
    meta: {
      breadcrumb: 'Job - :jobId'
    },
    children: [
      runsRoutes,
      {
        path: 'overview',
        component: () => import(/* webpackChunkName: "workspace-project-job-overiew" */ './views/overview.vue'),
        name: 'workspace-project-job-overiew',
        meta: {
          breadcrumb: 'Overview'
        }
      },
      {
        path: 'edit',
        component: () => import(/* webpackChunkName: "workspace-project-job-edit" */ './views/edit.vue'),
        name: 'workspace-project-job-edit',
        meta: {
          breadcrumb: 'Edit',
          permission: PERMISSIONS_LABELS.projectJobEdit
        }
      }
    ]
  }
]

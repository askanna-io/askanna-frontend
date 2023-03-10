import { jobsRoutes } from '@/features/jobs/config'
import { packageRoutes } from '@/features/package/config'
import { PERMISSIONS_LABELS } from '@/features/workspace/types'

export const projectRoutes = [
  {
    path: 'new-project',
    component: () => import('./views/new-project.vue'),
    name: 'workspace-new-project',
    meta: {
      hideAppBarIcon: true,
      breadcrumb: 'New project - :workspaceId',
      permission: PERMISSIONS_LABELS.projectCreate
    }
  },
  {
    path: 'project-does-not-exist',
    component: () => import('./views/project-does-not-exist.vue'),
    name: 'project-does-not-exist',
    meta: {
      requiresAuth: false,
      hideAppBarIcon: true,
      title: 'Oops...we cannot find this project',
      breadcrumb: 'Project does not exist'
    }
  },
  {
    path: 'project/:projectId',
    component: () => import('./views/index.vue'),
    meta: {
      hideAppBarIcon: true,
      breadcrumb: 'Project - :projectId',
      title: 'Project: projectId'
    },

    children: [
      {
        path: '',
        name: 'workspace-project',
        redirect: { name: 'workspace-project-code' },
        meta: {
          hideAppBarIcon: true
        }
      },
      jobsRoutes,
      {
        path: 'variables',
        name: 'workspace-project-variables',
        component: () => import('./views/variables.vue'),
        meta: {
          hideAppBarIcon: true,
          breadcrumb: 'Variables'
        }
      },
      packageRoutes,
      {
        path: 'code-does-not-exist',
        component: () => import('./views/code-does-not-exist.vue'),
        name: 'workspace-project-code-does-not-exist',
        meta: {
          hideAppBarIcon: true,
          title: 'Oops...we cannot find this package',
          breadcrumb: 'Package does not exist'
        }
      },
      {
        path: 'edit',
        name: 'workspace-project-edit',
        component: () => import('./views/project-edit.vue'),
        meta: {
          breadcrumb: 'Edit',
          hideAppBarIcon: true,
          permission: PERMISSIONS_LABELS.projectInfoEdit
        }
      }
    ]
  }
]

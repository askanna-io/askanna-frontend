import { jobsRoutes } from '@/features/jobs/config'
import { codeRoutes } from '@/features/code/config'
import { PERMISSIONS_LABELS } from '@/features/workspace/types'

export const projectRoutes = [
  {
    path: 'new-project',
    name: 'workspace-new-project',
    component: () => import('./views/ProjectNew.vue'),
    meta: {
      hideAppBarIcon: true,
      breadcrumb: 'New project - :workspaceId',
      permission: PERMISSIONS_LABELS.projectCreate
    }
  },
  {
    path: 'project-does-not-exist',
    name: 'project-does-not-exist',
    component: () => import('./views/ProjectDoesNotExist.vue'),
    meta: {
      requiresAuth: false,
      hideAppBarIcon: true,
      breadcrumb: 'Project does not exist',
      title: 'Oops...we cannot find this project'
    }
  },
  {
    path: 'project/:projectId',
    component: () => import('./views/ProjectIndex.vue'),
    meta: {
      hideAppBarIcon: true,
      title: 'Project: projectId',
      breadcrumb: 'Project - :projectId'
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
      {
        path: 'runs',
        name: 'workspace-project-runs',
        component: () => import('./views/ProjectRuns.vue'),
        meta: {
          hideAppBarIcon: true,
          breadcrumb: 'Runs',
          breadcrumbLevel: 2
        }
      },
      jobsRoutes,
      {
        path: 'variables',
        name: 'workspace-project-variables',
        component: () => import('./views/ProjectVariables.vue'),
        meta: {
          hideAppBarIcon: true,
          breadcrumb: 'Variables',
          breadcrumbLevel: 2
        }
      },
      codeRoutes,
      {
        path: 'code-does-not-exist',
        name: 'workspace-project-code-does-not-exist',
        component: () => import('./views/ProjectCodeDoesNotExist.vue'),
        meta: {
          hideAppBarIcon: true,
          breadcrumb: 'Package does not exist',
          title: 'Oops...we cannot find this package'
        }
      },
      {
        path: 'edit',
        name: 'workspace-project-edit',
        component: () => import('./views/ProjectEdit.vue'),
        meta: {
          breadcrumb: 'Edit',
          hideAppBarIcon: true,
          permission: PERMISSIONS_LABELS.projectInfoEdit
        }
      }
    ]
  }
]

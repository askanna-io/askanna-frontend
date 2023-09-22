import { peopleRoutes } from '@/features/people/config'
import { projectRoutes } from '@/features/project/config'
import { PERMISSIONS_LABELS } from '@/features/workspace/types'

export const workspace = {
  paths: [
    {
      path: '/workspace-new',
      component: () => import('./views/WorkspaceNew.vue'),
      name: 'workspace-new',
      meta: {
        hideAppBarIcon: true,
        breadcrumb: 'New workspace'
      }
    },
    {
      path: '/workspace-does-not-exist',
      component: () => import('./views/WorkspaceDoesNotExist.vue'),
      name: 'workspace-does-not-exist',
      meta: {
        hideAppBarIcon: true,
        breadcrumb: 'Workspace does not exist',
        title: 'Oops...we cannot find this workspace'
      }
    },
    {
      path: '/:workspaceId?',
      caseSensitive: true,
      component: () => import('./views/Workspace.vue'),
      meta: {
        hideAppBarIcon: true,
        title: 'Workspace: workspaceId',
        breadcrumb: 'Workspace - :workspaceId'
      },

      children: [
        {
          path: '',
          component: () => import('./views/WorkspaceIndex.vue'),
          meta: {
            hideAppBarIcon: true
          },
          children: [
            {
              path: '',
              component: () => import('./views/WorkspaceProjects.vue'),
              name: 'workspace',
              meta: {
                requiresAuth: false,
                hideAppBarIcon: true,
                breadcrumb: 'Workspace',
                title: 'Workspace: workspaceId'
              }
            },
            {
              path: 'edit',
              component: () => import('./views/WorkspaceEdit.vue'),
              name: 'workspace-edit',
              meta: {
                breadcrumb: 'Edit',
                hideAppBarIcon: true,
                permission: PERMISSIONS_LABELS.workspaceInfoEdit
              }
            }
          ]
        },
        peopleRoutes,
        ...projectRoutes,
        {
          path: 'profile',
          component: () => import('./views/WorkspaceProfile.vue'),
          name: 'workspace-profile',
          meta: {
            requiresAuth: true,
            hideAppBarIcon: true,
            title: 'AskAnna profile',
            breadcrumb: 'Edit my profile'
          }
        }
      ]
    }
  ]
}

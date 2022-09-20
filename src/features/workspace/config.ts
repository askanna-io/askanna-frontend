import { peopleRoutes } from '@/features/people/config'
import { projectRoutes } from '@/features/project/config'
import { PERMISSIONS_LABELS } from '@/features/workspace/types'

export default {
  paths: [
    {
      path: '/workspace-new',
      component: () => import('./views/workspace-new.vue'),
      name: 'workspace-new',
      meta: {
        hideAppBarIcon: true,
        breadcrumb: 'New workspace'
      }
    },
    {
      path: '/workspace-does-not-exist',
      component: () => import('./views/workspace-does-not-exist.vue'),
      name: 'workspace-does-not-exist',
      meta: {
        hideAppBarIcon: true,
        breadcrumb: 'Workspace does not exist',
        title: 'Oops...we cannot find this workspace'
      }
    },
    {
      path: '/:workspaceId',
      caseSensitive: true,
      component: () => import('./views/index.vue'),
      meta: {
        hideAppBarIcon: true,
        title: 'Workspace: workspaceId',
        breadcrumb: 'Workspace - :workspaceId'
      },

      children: [
        {
          path: '',
          component: () => import('./views/workspace-index.vue'),
          meta: {
            hideAppBarIcon: true
          },
          children: [
            {
              path: '',
              component: () => import('./views/workspace-projects.vue'),
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
              component: () => import('./views/workspace-edit.vue'),
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
          component: () => import('./views/workspace-profile.vue'),
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

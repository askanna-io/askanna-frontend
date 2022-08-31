import { peopleRoutes } from '@/features/people/config'
import { projectRoutes } from '@/features/project/config'
import { PERMISSIONS_LABELS } from '@/features/workspace/types'

export default {
  paths: [
    {
      path: '/workspace-new',
      component: () => import(/* webpackChunkName: "workspace-new" */ './views/workspace-new.vue'),
      name: 'workspace-new',
      meta: {
        hideAppBarIcon: true,
        breadcrumb: 'New workspace'
      }
    },
    {
      path: '/workspace-does-not-exist',
      component: () =>
        import(/* webpackChunkName: "workspace-does-not-exist" */ './views/workspace-does-not-exist.vue'),
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
      component: () => import(/* webpackChunkName: "workspace" */ './views/index.vue'),
      meta: {
        hideAppBarIcon: true,
        title: 'Workspace: workspaceId',
        breadcrumb: 'Workspace - :workspaceId'
      },

      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "workspace-index" */ './views/workspace-index.vue'),
          meta: {
            hideAppBarIcon: true
          },
          children: [
            {
              path: '',
              component: () => import(/* webpackChunkName: "workspace-projects" */ './views/workspace-projects.vue'),
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
              component: () => import(/* webpackChunkName: "workspace-edit" */ './views/workspace-edit.vue'),
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
          component: () => import(/* webpackChunkName: "workspace-profile" */ './views/workspace-profile.vue'),
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

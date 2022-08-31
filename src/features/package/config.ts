export const packageRoutes = {
  path: 'code',
  component: () => import(/* webpackChunkName: "workspace-project-package" */ './views/package.vue'),
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "workspace-project-code" */ './views/code.vue'),
      meta: {
        useProjectPackageId: true,
        hideAppBarIcon: true
      },
      children: [
        {
          path: '',
          name: 'workspace-project-code',
          components: {
            default: () => import(/* webpackChunkName: "workspace-project-package" */ './views/uuid.vue'),
            newPackage: () => import(/* webpackChunkName: "workspace-project-package-new" */ './views/new-package.vue')
          },
          meta: {
            useProjectPackageId: true,
            hideAppBarIcon: true,
            title: 'Code | Project: projectId'
          }
        },
        {
          path: 'history',
          component: () =>
            import(/* webpackChunkName: "workspace-project-code-package-history" */ './views/history.vue'),
          name: 'workspace-project-code-package-history',
          meta: {
            breadcrumb: 'History',
            hideAppBarIcon: true
          }
        }
      ]
    },
    {
      path: ':packageId',
      component: () => import(/* webpackChunkName: "workspace-project-package-uuid" */ './views/index.vue'),
      meta: {
        breadcrumb: 'Code - :packageId',
        hideAppBarIcon: true
      },
      children: [
        {
          path: '',
          name: 'workspace-project-package',

          component: () => import(/* webpackChunkName: "workspace-project-package" */ './views/uuid.vue'),
          children: [],
          meta: {
            hideAppBarIcon: true
          },
          props: true
        },

        {
          path: ':folderName(.*)',
          component: () => import(/* webpackChunkName: "workspace-project-package-folder" */ './views/uuid.vue'),
          name: 'workspace-project-package-folder',
          meta: {
            breadcrumb: ':folderName',
            hideAppBarIcon: true
          },
          children: []
        }
      ]
    }
  ],
  meta: {
    hideAppBarIcon: true
  }
}

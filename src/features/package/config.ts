export const packageRoutes = {
  path: 'code',
  component: () => import('./views/package.vue'),
  children: [
    {
      path: '',
      component: () => import('./views/package-code.vue'),
      meta: {
        useProjectPackageId: true,
        hideAppBarIcon: true
      },
      children: [
        {
          path: '',
          name: 'workspace-project-code',
          components: {
            default: () => import('./views/suuid.vue'),
            newPackage: () => import('./views/new-package.vue')
          },
          meta: {
            useProjectPackageId: true,
            hideAppBarIcon: true,
            title: 'Code | Project: projectId'
          }
        },
        {
          path: 'history',
          component: () => import('./views/history.vue'),
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
      component: () => import('./views/index.vue'),
      meta: {
        breadcrumb: 'Code - :packageId',
        hideAppBarIcon: true
      },
      children: [
        {
          path: '',
          name: 'workspace-project-package',

          component: () => import('./views/suuid.vue'),
          children: [],
          meta: {
            hideAppBarIcon: true
          },
          props: true
        },

        {
          path: ':folderName(.*)',
          component: () => import('./views/suuid.vue'),
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

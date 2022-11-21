export const packageRoutes = {
  path: 'code',
  component: () => import('./views/index.vue'),
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
        newPackage: () => import('./views/new.vue')
      },
      meta: {
        useProjectPackageId: true,
        hideAppBarIcon: true,
        title: 'Code | Project: projectId'
      },
      children: [
        {
          path: ':packageId',
          component: () => import('./views/suuid.vue'),
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
              }
            }
          ]
        }
      ]
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
}

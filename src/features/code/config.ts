export const codeRoutes = {
  path: 'code',
  component: () => import('./views/CodeIndex.vue'),
  meta: {
    useProjectPackageId: true,
    hideAppBarIcon: true
  },
  children: [
    {
      path: 'history',
      component: () => import('./views/CodeHistory.vue'),
      name: 'workspace-project-code-history',
      meta: {
        breadcrumb: 'History',
        hideAppBarIcon: true
      }
    },
    {
      path: '',
      name: 'workspace-project-code',
      components: {
        default: () => import('./views/CodeSuuid.vue'),
        newPackage: () => import('./views/CodeNew.vue')
      },
      meta: {
        hideAppBarIcon: true,
        useProjectPackageId: true,
        title: 'Code | Project: projectId'
      },
      children: [
        {
          path: ':packageId',
          component: () => import('./views/CodeSuuid.vue'),
          meta: {
            breadcrumb: 'Code - :packageId',
            hideAppBarIcon: true,
            breadcrumbLevel: 2,

          },
          children: [
            {
              path: '',
              name: 'workspace-project-code-package',
              component: () => import('./views/CodeSuuid.vue'),
              children: [],
              meta: {
                hideAppBarIcon: true
              },
              props: true
            },
            {
              path: ':folderName(.*)?',
              component: () => import('./views/CodeSuuid.vue'),
              name: 'workspace-project-code-package-folder',
              meta: {
                breadcrumbLevel: 2,
                hideAppBarIcon: true,
                breadcrumb: ':folderName',
              }
            }
          ]
        }
      ]
    }
  ]
}

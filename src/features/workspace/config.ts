export default {
  paths: [
    {
      path: '/workspace',
      component: () => import(/* webpackChunkName: "workspace-index" */ './views/index.vue'),
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "workspace" */ './views/TheWorkspace.vue'),
          name: 'workspace'
        },
        {
          path: 'project/:projectId',
          component: () => import(/* webpackChunkName: "workspace-add" */ '../project/views/TheProject.vue'),
          name: 'workspace-project',
          children: [
            {
              path: 'activity',
              component: () =>
                import(/* webpackChunkName: "workspace-project-uuid-activity" */ '../project/views/tabs/Activity.vue'),
              name: 'workspace-project-activity'
            },
            {
              path: 'jobs',
              component: () =>
                import(/* webpackChunkName: "workspace-project-uuid-jobs" */ '../project/views/tabs/Jobs.vue'),
              name: 'workspace-project-jobs'
            },
            {
              path: 'documantation',
              component: () =>
                import(
                  /* webpackChunkName: "workspace-project-uuid-documantation" */ '../project/views/tabs/Documantation.vue'
                ),
              name: 'workspace-project-documantation'
            },
            {
              path: 'packages',
              component: () =>
                import(/* webpackChunkName: "workspace-project-packages-index" */ '../packages/views/index.vue'),
              children: [
                {
                  path: '',
                  component: () =>
                    import(/* webpackChunkName: "workspace-project-packages" */ '../packages/views/ThePackages.vue'),
                  name: 'workspace-project-packages'
                },
                {
                  path: ':packageId',
                  component: () =>
                    import(/* webpackChunkName: "workspace-project-packages-uuid" */ '../package/views/index.vue'),
                  children: [
                    {
                      path: '',
                      component: () =>
                        import(
                          /* webpackChunkName: "workspace-project-packages-uuid" */ '../package/views/ThePackage.vue'
                        ),
                      name: 'workspace-project-packages-uuid'
                    },
                    {
                      path: 'history',
                      component: () =>
                        import(
                          /* webpackChunkName: "workspace-project-uuid-packages-uuid-history" */ '../package/views/ThePackageHistory.vue'
                        ),
                      name: 'workspace-project-packages-uuid-history'
                    },
                    {
                      path: 'version/:versionId',
                      component: () =>
                        import(
                          /* webpackChunkName: "workspace-project-uuid-packages-uuid-history" */ '../package/views/ThePackage.vue'
                        ),
                      name: 'workspace-project-packages-uuid-version-uuid'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

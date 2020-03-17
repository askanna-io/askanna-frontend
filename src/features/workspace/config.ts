export default {
  paths: [
    {
      path: '/workspace',
      component: () => import(/* webpackChunkName: "workspace-index" */ './views/index.vue'),
      meta: {
        breadcrumb: 'Dashboard'
      },
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "workspace" */ './views/TheWorkspace.vue'),
          name: 'workspace',
          meta: {
            breadcrumb: 'Workspace'
          }
        },
        {
          path: 'project/:projectId',
          redirect: { name: 'workspace-project-activity' },
          component: () => import(/* webpackChunkName: "workspace-add" */ '../project/views/TheProject.vue'),
          name: 'workspace-project',
          meta: {
            breadcrumb: 'Project - #:projectId'
          },
          children: [
            {
              path: 'activity',
              component: () =>
                import(/* webpackChunkName: "workspace-project-uuid-activity" */ '../project/views/tabs/Activity.vue'),
              name: 'workspace-project-activity',
              meta: {
                breadcrumb: 'Activity'
              }
            },
            {
              path: 'jobs',
              component: () =>
                import(/* webpackChunkName: "workspace-project-uuid-jobs" */ '../project/views/tabs/Jobs.vue'),
              name: 'workspace-project-jobs',
              meta: {
                breadcrumb: 'Jobs'
              }
            },
            {
              path: 'documantation',
              component: () =>
                import(
                  /* webpackChunkName: "workspace-project-uuid-documantation" */ '../project/views/tabs/Documantation.vue'
                ),
              name: 'workspace-project-documantation',
              meta: {
                breadcrumb: 'Documantation'
              }
            },
            {
              path: 'packages',
              component: () =>
                import(/* webpackChunkName: "workspace-project-packages-index" */ '../packages/views/index.vue'),
              meta: {
                breadcrumb: 'Packages'
              },
              children: [
                {
                  path: '',
                  component: () =>
                    import(/* webpackChunkName: "workspace-project-packages" */ '../packages/views/ThePackages.vue'),
                  name: 'workspace-project-packages',
                  meta: {
                    breadcrumb: 'Packages'
                  }
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
                      name: 'workspace-project-packages-uuid',
                      meta: {
                        breadcrumb: 'Packages - #:packageId'
                      }
                    },
                    {
                      path: 'history',
                      component: () =>
                        import(
                          /* webpackChunkName: "workspace-project-uuid-packages-uuid-history" */ '../package/views/ThePackageHistory.vue'
                        ),
                      name: 'workspace-project-packages-uuid-history',
                      meta: {
                        breadcrumb: 'History'
                      }
                    },
                    {
                      path: 'version/:versionId',
                      component: () =>
                        import(
                          /* webpackChunkName: "workspace-project-uuid-packages-uuid-version" */ '../package/views/ThePackage.vue'
                        ),
                      name: 'workspace-project-packages-uuid-version-uuid',
                      meta: {
                        breadcrumb: 'Version - #:versionId'
                      },
                      children: [
                        {
                          path: ':folderName',
                          component: () =>
                            import(
                              /* webpackChunkName: "workspace-project-uuid-packages-uuid-version-name" */ '../package/views/ThePackage.vue'
                            ),
                          name: 'workspace-project-packages-uuid-version-uuid-name',
                          meta: {
                            breadcrumb: ':folderName'
                          },
                          children: [
                            {
                              path: ':subFolderName',
                              component: () =>
                                import(
                                  /* webpackChunkName: "workspace-project-uuid-packages-uuid-version-name-sub" */ '../package/views/ThePackage.vue'
                                ),
                              name: 'workspace-project-packages-uuid-version-uuid-name-sub',
                              meta: {
                                breadcrumb: ':subFolderName'
                              }
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
      ]
    }
  ]
}

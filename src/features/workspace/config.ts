export default {
  paths: [
    {
      path: '/user',
      component: () => import(/* webpackChunkName: "user" */ '../jobrun/views/JobRun.vue'),
      name: 'user',
      meta: {
        breadcrumb: 'user'
      }
    },
    {
      path: '/:workspace',
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
          component: () => import(/* webpackChunkName: "workspace-project" */ '../project/views/TheProject.vue'),
          meta: {
            breadcrumb: 'Project - #:projectId'
          },
          children: [
            {
              path: '',
              name: 'workspace-project',
              component: () =>
                import(/* webpackChunkName: "workspace-project-uuid-activity" */ '../project/views/TheProject.vue'),
              meta: {
                breadcrumb: 'Project - #:projectId'
              }
            },
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
                import(
                  /* webpackChunkName: "workspace-project-uuid-jobs-index" */ '../project/views/tabs/jobs/index.vue'
                ),
              meta: {
                breadcrumb: 'Jobs'
              },
              children: [
                {
                  path: '',
                  component: () =>
                    import(/* webpackChunkName: "workspace-project-uuid-jobs" */ '../project/views/tabs/jobs/Jobs.vue'),
                  name: 'workspace-project-jobs',
                  meta: {
                    breadcrumb: 'Packages'
                  }
                },
                {
                  path: ':jobId',
                  redirect: { name: 'workspace-project-job-overiew' },

                  component: () =>
                    import(/* webpackChunkName: "workspace-project-uuid-jobs-id" */ '@job/views/index.vue'),
                  meta: {
                    breadcrumb: ':jobId'
                  },
                  children: [
                    {
                      path: 'overview',
                      component: () =>
                        import(/* webpackChunkName: "workspace-project-job-overiew" */ '@job/views/JobOverview.vue'),
                      name: 'workspace-project-job-overiew',
                      meta: {
                        breadcrumb: 'Overview'
                      }
                    },
                    {
                      path: 'runs',
                      component: () =>
                        import(/* webpackChunkName: "workspace-project-job-jobruns" */ '@job/views/JobOverview.vue'),
                      name: 'workspace-project-job-jobruns',
                      meta: {
                        breadcrumb: 'Job run'
                      }
                    },
                    {
                      path: 'variables',
                      component: () =>
                        import(/* webpackChunkName: "workspace-project-job-variables" */ '@job/views/JobVariables.vue'),
                      name: 'workspace-project-job-variables',
                      meta: {
                        breadcrumb: 'Variables'
                      }
                    },
                    {
                      path: 'tokens',
                      component: () =>
                        import(/* webpackChunkName: "workspace-project-job-tokens" */ '@job/views/JobTokens.vue'),
                      name: 'workspace-project-job-tokens',
                      meta: {
                        breadcrumb: 'Tokens'
                      }
                    },
                    {
                      path: ':jobRunId',
                      component: () =>
                        import(
                          /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid" */ '@jobrun/views/JobRun.vue'
                        ),
                      name: 'workspace-project-jobs-name-uuid',
                      meta: {
                        breadcrumb: 'Job run - #:jobRunId'
                      }
                    }
                  ]
                }
              ]
            },
            {
              path: 'documentation',
              component: () =>
                import(
                  /* webpackChunkName: "workspace-project-uuid-documentation" */ '../project/views/tabs/Documentation.vue'
                ),
              name: 'workspace-project-documentation',
              meta: {
                breadcrumb: 'Documentation'
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
                      path: 'version',
                      redirect: { name: 'workspace-project-packages' }
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
                          path: ':folderName(.*)',
                          component: () =>
                            import(
                              /* webpackChunkName: "workspace-project-uuid-packages-uuid-version-name" */ '../package/views/ThePackage.vue'
                            ),
                          name: 'workspace-project-packages-uuid-version-uuid-name-folder',
                          meta: {
                            breadcrumb: ':folderName'
                          },
                          children: []
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

export default {
  paths: [
    {
      path: '/:workspace',
      component: () => import(/* webpackChunkName: "workspace-index" */ './views/index.vue'),
      meta: {
        breadcrumb: 'Dashboard'
      },
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "workspace" */ './views/workspace.vue'),
          name: 'workspace',
          meta: {
            breadcrumb: 'Workspace'
          }
        },
        {
          path: 'project/:projectId',
          redirect: { name: 'workspace-project-activity' },
          component: () => import(/* webpackChunkName: "workspace-project" */ './views/project/index.vue'),
          meta: {
            breadcrumb: 'Project - #:projectId'
          },
          children: [
            {
              path: '',
              name: 'workspace-project',
              redirect: { name: 'workspace-project-packages' },
              component: () =>
                import(/* webpackChunkName: "workspace-project-uuid-activity" */ './views/project/index.vue'),
              meta: {
                breadcrumb: 'Project - #:projectId'
              }
            },
            {
              path: 'activity',
              component: () =>
                import(/* webpackChunkName: "workspace-project-uuid-activity" */ './views/project/activity.vue'),
              name: 'workspace-project-activity',
              meta: {
                breadcrumb: 'Activity'
              }
            },
            {
              path: 'jobs',
              component: () =>
                import(/* webpackChunkName: "workspace-project-uuid-jobs-index" */ './views/project/jobs/index.vue'),
              meta: {
                breadcrumb: 'Jobs'
              },
              children: [
                {
                  path: '',
                  component: () =>
                    import(/* webpackChunkName: "workspace-project-uuid-jobs" */ './views/project/jobs/jobs.vue'),
                  name: 'workspace-project-jobs',
                  meta: {
                    breadcrumb: 'Packages'
                  }
                },
                {
                  path: ':jobId',
                  redirect: { name: 'workspace-project-job-overiew' },

                  component: () =>
                    import(
                      /* webpackChunkName: "workspace-project-uuid-jobs-id" */ './views/project/jobs/job/index.vue'
                    ),
                  meta: {
                    breadcrumb: ':jobId'
                  },
                  children: [
                    {
                      path: 'overview',
                      component: () =>
                        import(
                          /* webpackChunkName: "workspace-project-job-overiew" */ './views/project/jobs/job/overview.vue'
                        ),
                      name: 'workspace-project-job-overiew',
                      meta: {
                        breadcrumb: 'Overview'
                      }
                    },
                    {
                      path: 'runs',
                      component: () =>
                        import(
                          /* webpackChunkName: "workspace-project-job-runs" */ './views/project/jobs/job/runs.vue'
                        ),
                      name: 'workspace-project-job-jobruns',
                      meta: {
                        breadcrumb: 'Job run'
                      }
                    },
                    {
                      path: 'variables',
                      component: () =>
                        import(
                          /* webpackChunkName: "workspace-project-job-variables" */ './views/project/jobs/job/variables.vue'
                        ),
                      name: 'workspace-project-job-variables',
                      meta: {
                        breadcrumb: 'Variables'
                      }
                    },
                    {
                      path: 'tokens',
                      component: () =>
                        import(
                          /* webpackChunkName: "workspace-project-job-tokens" */ './views/project/jobs/job/tokens.vue'
                        ),
                      name: 'workspace-project-job-tokens',
                      meta: {
                        breadcrumb: 'Tokens'
                      }
                    },
                    {
                      path: ':jobRunId',
                      name: 'workspace-project-jobs-job-jobrun',
                      redirect: { name: 'workspace-project-jobs-job-jobrun-input' },

                      component: () =>
                        import(
                          /* webpackChunkName: "workspace-project-uuid-jobs-name-run" */ './views/project/jobs/job/run.vue'
                        ),
                      meta: {
                        breadcrumb: 'Job run - #:jobRunId'
                      },
                      children: [
                        {
                          path: '',
                          component: () =>
                            import(
                              /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-input" */ './views/project/jobs/job/jobrun/input.vue'
                            ),
                          name: 'workspace-project-jobs-job-jobrun-input'
                        },
                        {
                          path: 'result',
                          component: () =>
                            import(
                              /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-result" */ './views/project/jobs/job/jobrun/result.vue'
                            ),
                          name: 'workspace-project-jobs-job-jobrun-result'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              path: 'documentation',
              component: () =>
                import(
                  /* webpackChunkName: "workspace-project-uuid-documentation" */ './views/project/documentation.vue'
                ),
              name: 'workspace-project-documentation',
              meta: {
                breadcrumb: 'Documentation'
              }
            },
            {
              path: 'packages',
              component: () =>
                import(/* webpackChunkName: "workspace-project-packages-index" */ './views/project/packages.vue'),
              meta: {
                breadcrumb: 'Packages'
              },
              children: [
                {
                  path: '',
                  component: () =>
                    import(/* webpackChunkName: "workspace-project-packages" */ './views/project/packages/index.vue'),
                  name: 'workspace-project-packages',
                  meta: {
                    breadcrumb: 'Packages'
                  }
                },
                {
                  path: ':packageId',
                  component: () =>
                    import(
                      /* webpackChunkName: "workspace-project-packages-uuid" */ './views/project/packages/package.vue'
                    ),

                  children: [
                    {
                      path: '',
                      component: () =>
                        import(
                          /* webpackChunkName: "workspace-project-packages-uuid" */ './views/project/packages/package/index.vue'
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
                          /* webpackChunkName: "workspace-project-uuid-packages-uuid-history" */ './views/project/packages/package/history.vue'
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
                          /* webpackChunkName: "workspace-project-uuid-packages-uuid-version" */ './views/project/packages/package/index.vue'
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
                              /* webpackChunkName: "workspace-project-uuid-packages-uuid-version-name" */ './views/project/packages/package/index.vue'
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

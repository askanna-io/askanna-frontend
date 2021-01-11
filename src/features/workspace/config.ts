const jobRun = [
  {
    path: '',
    component: () =>
      import(/* webpackChunkName: "workspace-project-job-runs" */ './views/project/jobs/job/jobruns/runs.vue'),
    name: 'workspace-project-job-jobruns'
  },
  {
    path: 'run-does-not-exist',
    component: () =>
      import(
        /* webpackChunkName: "workspace-project-job-run-does-not-exist" */ './views/project/jobs/job/jobruns/run-does-not-exist.vue'
      ),
    name: 'workspace-project-job-run-does-not-exist',
    meta: {
      title: 'Oops...we cannot find this jobrun',
      breadcrumb: 'Run does not exist'
    }
  },
  {
    path: ':jobRunId',
    name: 'workspace-project-jobs-job-jobrun',
    redirect: { name: 'workspace-project-jobs-job-jobrun-input' },
    meta: {
      breadcrumb: 'Job run - :jobRunId'
    },
    component: () =>
      import(
        /* webpackChunkName: "workspace-project-uuid-jobs-name-run" */ './views/project/jobs/job/jobruns/jobrun/index.vue'
      ),

    children: [
      {
        path: 'input',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-input" */ './views/project/jobs/job/jobruns/jobrun/input.vue'
          ),
        name: 'workspace-project-jobs-job-jobrun-input'
      },
      {
        path: 'result',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-result" */ './views/project/jobs/job/jobruns/jobrun/result.vue'
          ),
        name: 'workspace-project-jobs-job-jobrun-result'
      },
      {
        path: 'artifact',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-artifact-index" */ './views/project/jobs/job/jobruns/jobrun/index-artifact.vue'
          ),
        children: [
          {
            path: '',
            component: () =>
              import(
                /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-artifact" */ './views/project/jobs/job/jobruns/jobrun/artifact.vue'
              ),
            name: 'workspace-project-jobs-job-jobrun-artifact',

            children: [
              {
                path: ':folderName(.*)',
                component: () =>
                  import(
                    /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-artifact-folder" */ './views/project/jobs/job/jobruns/jobrun/artifact.vue'
                  ),
                name: 'workspace-project-jobs-job-jobrun-artifact-folder',
                meta: {
                  breadcrumb: ':folderName'
                }
              }
            ]
          }
        ]
      },
      {
        path: 'code',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-package-uuid" */ './views/project/jobs/job/jobruns/jobrun/index-code.vue'
          ),
        children: [
          {
            path: '',
            component: () =>
              import(
                /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-code" */ './views/project/jobs/job/jobruns/jobrun/code.vue'
              ),
            name: 'workspace-project-jobs-job-jobrun-code',

            children: [
              {
                path: ':folderName(.*)',
                component: () =>
                  import(
                    /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-code-folder" */ './views/project/jobs/job/jobruns/jobrun/code.vue'
                  ),
                name: 'workspace-project-jobs-job-jobrun-code-folder',
                meta: {
                  breadcrumb: ':folderName'
                }
              }
            ]
          }
        ]
      },
      {
        path: 'code-does-not-exist',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-jobs-job-jobrun-code-does-not-exist" */ './views/project/jobs/job/jobruns/jobrun/jobrun-code-does-not-exist.vue'
          ),
        name: 'workspace-project-jobs-job-jobrun-code-does-not-exist',
        meta: {
          title: 'Oops...we cannot find this package',
          breadcrumb: 'Package does not exist'
        }
      },
      {
        path: 'log',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-log" */ './views/project/jobs/job/jobruns/jobrun/log.vue'
          ),
        name: 'workspace-project-jobs-job-jobrun-log'
      }
    ]
  }
]

const packageRoutes = [
  {
    path: 'new-package',
    component: () =>
      import(/* webpackChunkName: "workspace-project-package-new" */ './views/project/package/new-package.vue'),
    name: 'workspace-project-package-new'
  },
  {
    path: ':packageId',
    component: () =>
      import(/* webpackChunkName: "workspace-project-package-uuid" */ './views/project/package/index.vue'),
    meta: {
      breadcrumb: 'Code - :packageId'
    },
    children: [
      {
        path: '',
        name: 'workspace-project-package',

        component: () => import(/* webpackChunkName: "workspace-project-package" */ './views/project/package/uuid.vue'),
        children: []
      },
      {
        path: 'history',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-code-package-history" */ './views/project/package/history.vue'
          ),
        name: 'workspace-project-code-package-history',
        meta: {
          breadcrumb: 'History'
        }
      },
      {
        path: ':folderName(.*)',
        component: () =>
          import(/* webpackChunkName: "workspace-project-package-folder" */ './views/project/package/uuid.vue'),
        name: 'workspace-project-package-folder',
        meta: {
          breadcrumb: ':folderName'
        },
        children: []
      }
    ]
  }
]

const JobRoutes = [
  {
    path: '',
    component: () => import(/* webpackChunkName: "workspace-project-uuid-jobs" */ './views/project/jobs/jobs.vue'),
    name: 'workspace-project-jobs',
    meta: {
      breadcrumb: 'Packages'
    }
  },
  {
    path: 'job-does-not-exist',
    component: () =>
      import(
        /* webpackChunkName: "workspace-project-job-does-not-exist" */ './views/project/jobs/job-does-not-exist.vue'
      ),
    name: 'workspace-project-job-does-not-exist',
    meta: {
      title: 'Oops...we cannot find this job',
      breadcrumb: 'Job does not exist'
    }
  },
  {
    path: ':jobId',
    redirect: { name: 'workspace-project-job-overiew' },

    component: () =>
      import(/* webpackChunkName: "workspace-project-uuid-jobs-id" */ './views/project/jobs/job/index.vue'),
    meta: {
      breadcrumb: 'Job - :jobId'
    },
    children: [
      {
        path: 'overview',
        component: () =>
          import(/* webpackChunkName: "workspace-project-job-overiew" */ './views/project/jobs/job/overview.vue'),
        name: 'workspace-project-job-overiew',
        meta: {
          breadcrumb: 'Overview'
        }
      },
      {
        path: 'runs',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-job-runs-index" */ './views/project/jobs/job/jobruns/index.vue'
          ),
        meta: {
          breadcrumb: 'Runs'
        },
        children: jobRun
      },
      {
        path: 'variables',
        component: () =>
          import(/* webpackChunkName: "workspace-project-job-variables" */ './views/project/jobs/job/variables.vue'),
        name: 'workspace-project-job-variables',
        meta: {
          breadcrumb: 'Variables'
        }
      },
      {
        path: 'tokens',
        component: () =>
          import(/* webpackChunkName: "workspace-project-job-tokens" */ './views/project/jobs/job/tokens.vue'),
        name: 'workspace-project-job-tokens',
        meta: {
          breadcrumb: 'Tokens'
        }
      }
    ]
  }
]

export default {
  paths: [
    {
      path: '/workspace-does-not-exist',
      component: () =>
        import(/* webpackChunkName: "workspace-does-not-exist" */ './views/workspace-does-not-exist.vue'),
      name: 'workspace-does-not-exist',
      meta: {
        title: 'Oops...we cannot find this workspace',
        breadcrumb: 'Workspace does not exist'
      }
    },
    {
      path: '/:workspaceId',
      component: () => import(/* webpackChunkName: "workspace-index" */ './views/index.vue'),
      meta: {
        breadcrumb: 'Workspace - :workspaceId',
        requiresAuth: true
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
          path: 'people',
          component: () => import(/* webpackChunkName: "workspace-people" */ './views/people.vue'),
          name: 'workspace-people',
          meta: {
            breadcrumb: 'People'
          }
        },
        {
          path: 'new-project',
          component: () => import(/* webpackChunkName: "workspace-new-project" */ './views/new-project.vue'),
          name: 'workspace-new-project',
          meta: {
            breadcrumb: 'New project - :workspaceId'
          }
        },
        {
          path: 'project-does-not-exist',
          component: () =>
            import(/* webpackChunkName: "project-does-not-exist" */ './views/project-does-not-exist.vue'),
          name: 'project-does-not-exist',
          meta: {
            title: 'Oops...we cannot find this project',
            breadcrumb: 'Project does not exist'
          }
        },
        {
          path: 'profile',
          component: () => import(/* webpackChunkName: "workspace-profile" */ './views/workspace-profile.vue'),
          name: 'workspace-profile',
          meta: {
            breadcrumb: 'Profile'
          }
        },
        {
          path: 'project/:projectId',
          component: () => import(/* webpackChunkName: "workspace-project" */ './views/project/index.vue'),
          meta: {
            breadcrumb: 'Project - :projectId'
          },

          children: [
            {
              path: '',
              name: 'workspace-project',
              redirect: { name: 'workspace-project-code' },
              component: () =>
                import(/* webpackChunkName: "workspace-project-uuid-activity" */ './views/project/uuid-project.vue'),
              meta: {
                breadcrumb: 'Project - :projectId'
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
              children: JobRoutes
            },
            {
              path: 'variables',
              name: 'workspace-project-variables',
              component: () =>
                import(/* webpackChunkName: "workspace-project-variables" */ './views/project/variables.vue'),
              meta: {
                breadcrumb: 'Variables'
              }
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
              path: 'code',
              name: 'workspace-project-code',
              component: () =>
                import(/* webpackChunkName: "workspace-project-package" */ './views/project/package.vue'),
              children: packageRoutes
            },
            {
              path: 'code-does-not-exist',
              component: () =>
                import(
                  /* webpackChunkName: "workspace-project-code-does-not-exist" */ './views/project/code-does-not-exist.vue'
                ),
              name: 'workspace-project-code-does-not-exist',
              meta: {
                title: 'Oops...we cannot find this package',
                breadcrumb: 'Package does not exist'
              }
            }
          ]
        }
      ]
    }
  ]
}

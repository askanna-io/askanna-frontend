const jobRun = [
  {
    path: '',
    component: () =>
      import(/* webpackChunkName: "workspace-project-job-runs" */ './views/project/jobs/job/jobruns/runs.vue'),
    name: 'workspace-project-job-jobruns'
  },
  {
    path: ':jobRunId',
    name: 'workspace-project-jobs-job-jobrun',

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
        name: 'workspace-project-jobs-job-jobrun-input',
        meta: {
          breadcrumb: 'Job run - #:jobRunId'
        }
      },
      {
        path: 'result',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-result" */ './views/project/jobs/job/jobruns/jobrun/result.vue'
          ),
        name: 'workspace-project-jobs-job-jobrun-result',
        meta: {
          breadcrumb: 'Job run - #:jobRunId'
        }
      },
      {
        path: 'log',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-log" */ './views/project/jobs/job/jobruns/jobrun/log.vue'
          ),
        name: 'workspace-project-jobs-job-jobrun-log',
        meta: {
          breadcrumb: 'Job run - #:jobRunId'
        }
      }
    ]
  }
]

const packageRoutes = [
  {
    path: ':packageId',
    component: () =>
      import(/* webpackChunkName: "workspace-project-package-uuid" */ './views/project/package/index.vue'),
    name: 'workspace-project-package-index',
    meta: {
      breadcrumb: 'Packages - #:packageId'
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
        path: 'version/:versionId',
        component: () =>
          import(/* webpackChunkName: "workspace-project-package-version" */ './views/project/package/index.vue'),
        name: 'workspace-project-package-version',
        meta: {
          breadcrumb: 'Version - #:versionId'
        },
        children: [
          {
            path: ':folderName(.*)',
            component: () =>
              import(
                /* webpackChunkName: "workspace-project-packages-version-name" */ './views/project/package/uuid.vue'
              ),
            name: 'workspace-project-packages-version-name-folder',
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
    path: ':jobId',
    redirect: { name: 'workspace-project-job-overiew' },

    component: () =>
      import(/* webpackChunkName: "workspace-project-uuid-jobs-id" */ './views/project/jobs/job/index.vue'),
    meta: {
      breadcrumb: 'Job - #:jobId'
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
          breadcrumb: 'Job runs'
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
      path: '/:workspaceId',
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
          component: () => import(/* webpackChunkName: "workspace-project" */ './views/project/index.vue'),
          meta: {
            breadcrumb: 'Project - #:projectId'
          },
          children: [
            {
              path: '',
              name: 'workspace-project',
              redirect: { name: 'workspace-project-package' },

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
              children: JobRoutes
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
              path: 'code/history',
              component: () =>
                import(
                  /* webpackChunkName: "workspace-project-package-history" */ './views/project/package/code-history.vue'
                ),
              name: 'workspace-project-package-history',
              meta: {
                breadcrumb: 'History'
              }
            },
            {
              path: 'code',
              name: 'workspace-project-code',
              component: () =>
                import(/* webpackChunkName: "workspace-project-package" */ './views/project/package.vue'),
              children: packageRoutes
            }
          ]
        }
      ]
    }
  ]
}

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
    redirect: { name: 'workspace-project-jobs-job-jobrun-overview' },
    meta: {
      title: 'Run: jobRunId',
      breadcrumb: 'Run - :jobRunId'
    },
    component: () =>
      import(
        /* webpackChunkName: "workspace-project-uuid-jobs-name-run" */ './views/project/jobs/job/jobruns/jobrun/index.vue'
      ),

    children: [
      {
        path: 'edit',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-edit" */ './views/project/jobs/job/jobruns/jobrun/edit.vue'
          ),
        name: 'workspace-project-jobs-job-jobrun-edit',
        meta: {
          title: 'Run: jobRunId'
        }
      },
      {
        path: 'overview',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-overview" */ './views/project/jobs/job/jobruns/jobrun/overview.vue'
          ),
        name: 'workspace-project-jobs-job-jobrun-overview',
        meta: {
          title: 'Run: jobRunId'
        }
      },
      {
        path: 'input',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-input" */ './views/project/jobs/job/jobruns/jobrun/input.vue'
          ),
        name: 'workspace-project-jobs-job-jobrun-input',
        meta: {
          title: 'Run: jobRunId'
        }
      },
      {
        path: 'result/:view?',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-result" */ './views/project/jobs/job/jobruns/jobrun/result.vue'
          ),
        name: 'workspace-project-jobs-job-jobrun-result',
        meta: {
          title: 'Run: jobRunId'
        }
      },
      {
        path: 'metrics',
        redirect: { name: 'workspace-project-jobs-job-jobrun-metrics-table' },
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-metrics" */ './views/project/jobs/job/jobruns/jobrun/metrics/index.vue'
          ),
        name: 'workspace-project-jobs-job-jobrun-metrics',
        meta: {
          title: 'Run: jobRunId'
        },
        children: [
          {
            path: 'table',
            component: () =>
              import(
                /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-metrics-table" */ './views/project/jobs/job/jobruns/jobrun/metrics/table-view.vue'
              ),
            name: 'workspace-project-jobs-job-jobrun-metrics-table',
            meta: {
              tabValue: 'table',
              title: 'Run: jobRunId'
            }
          },
          {
            path: 'json',
            component: () =>
              import(
                /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-metrics-json" */ './views/project/jobs/job/jobruns/jobrun/metrics/json-view.vue'
              ),
            name: 'workspace-project-jobs-job-jobrun-metrics-json',
            meta: {
              tabValue: 'json',
              title: 'Run: jobRunId'
            }
          },
          {
            path: 'card',
            component: () =>
              import(
                /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-metrics-card" */ './views/project/jobs/job/jobruns/jobrun/metrics/card-view.vue'
              ),
            name: 'workspace-project-jobs-job-jobrun-metrics-card',
            meta: {
              tabValue: 'card',
              title: 'Run: jobRunId'
            }
          },
          {
            path: 'grid',
            component: () =>
              import(
                /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-metrics-grid" */ './views/project/jobs/job/jobruns/jobrun/metrics/grid-view.vue'
              ),
            name: 'workspace-project-jobs-job-jobrun-metrics-grid',
            meta: {
              tabValue: 'grid',
              title: 'Run: jobRunId'
            }
          }
        ]
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
            meta: {
              title: 'Run: jobRunId'
            },

            children: [
              {
                path: ':folderName(.*)',
                component: () =>
                  import(
                    /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-artifact-folder" */ './views/project/jobs/job/jobruns/jobrun/artifact.vue'
                  ),
                name: 'workspace-project-jobs-job-jobrun-artifact-folder',
                meta: {
                  title: 'Run: jobRunId',
                  breadcrumb: ':folderName'
                }
              }
            ]
          }
        ]
      },
      {
        path: 'variables',
        redirect: { name: 'workspace-project-jobs-job-jobrun-variables-table' },
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-variables" */ './views/project/jobs/job/jobruns/jobrun/variables/index.vue'
          ),
        name: 'workspace-project-jobs-job-jobrun-variables',
        children: [
          {
            path: 'table',
            component: () =>
              import(
                /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-variables-table" */ './views/project/jobs/job/jobruns/jobrun/variables/table-view.vue'
              ),
            name: 'workspace-project-jobs-job-jobrun-variables-table',
            meta: {
              tabValue: 'table',
              title: 'Run: jobRunId'
            }
          },
          {
            path: 'json',
            component: () =>
              import(
                /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-variables-json" */ './views/project/jobs/job/jobruns/jobrun/variables/json-view.vue'
              ),
            name: 'workspace-project-jobs-job-jobrun-variables-json',
            meta: {
              tabValue: 'json',
              title: 'Run: jobRunId'
            }
          },
          {
            path: 'card',
            component: () =>
              import(
                /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-variables-card" */ './views/project/jobs/job/jobruns/jobrun/variables/card-view.vue'
              ),
            name: 'workspace-project-jobs-job-jobrun-variables-card',
            meta: {
              tabValue: 'card',
              title: 'Run: jobRunId'
            }
          },
          {
            path: 'grid',
            component: () =>
              import(
                /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-variables-grid" */ './views/project/jobs/job/jobruns/jobrun/variables/grid-view.vue'
              ),
            name: 'workspace-project-jobs-job-jobrun-variables-grid',
            meta: {
              tabValue: 'grid',
              title: 'Run: jobRunId'
            }
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
            meta: {
              title: 'Run: jobRunId'
            },
            children: [
              {
                path: ':folderName(.*)',
                component: () =>
                  import(
                    /* webpackChunkName: "workspace-project-uuid-jobs-name-run-uuid-code-folder" */ './views/project/jobs/job/jobruns/jobrun/code.vue'
                  ),
                name: 'workspace-project-jobs-job-jobrun-code-folder',
                meta: {
                  title: 'Run: jobRunId',
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
        name: 'workspace-project-jobs-job-jobrun-log',
        meta: {
          title: 'Run: jobRunId'
        }
      }
    ]
  }
]

const packageRoutes = [
  {
    path: 'new-package',
    component: () =>
      import(/* webpackChunkName: "workspace-project-package-new" */ './views/project/package/new-package.vue'),
    name: 'workspace-project-package-new',
    meta: {
      hideAppBarIcon: true
    }
  },
  {
    path: ':packageId',
    component: () =>
      import(/* webpackChunkName: "workspace-project-package-uuid" */ './views/project/package/index.vue'),
    meta: {
      breadcrumb: 'Code - :packageId',
      hideAppBarIcon: true
    },
    children: [
      {
        path: '',
        name: 'workspace-project-package',

        component: () => import(/* webpackChunkName: "workspace-project-package" */ './views/project/package/uuid.vue'),
        children: [],
        meta: {
          hideAppBarIcon: true
        }
      },
      {
        path: 'history',
        component: () =>
          import(
            /* webpackChunkName: "workspace-project-code-package-history" */ './views/project/package/history.vue'
          ),
        name: 'workspace-project-code-package-history',
        meta: {
          breadcrumb: 'History',
          hideAppBarIcon: true
        }
      },
      {
        path: ':folderName(.*)',
        component: () =>
          import(/* webpackChunkName: "workspace-project-package-folder" */ './views/project/package/uuid.vue'),
        name: 'workspace-project-package-folder',
        meta: {
          breadcrumb: ':folderName',
          hideAppBarIcon: true
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
      breadcrumb: 'Packages',
      hideAppBarIcon: true
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
      },
      {
        path: 'edit',
        component: () =>
          import(/* webpackChunkName: "workspace-project-job-edit" */ './views/project/jobs/job/edit.vue'),
        name: 'workspace-project-job-edit',
        meta: {
          breadcrumb: 'Edit'
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
        hideAppBarIcon: true,
        breadcrumb: 'Workspace does not exist',
        title: 'Oops...we cannot find this workspace'
      }
    },
    {
      path: '/:workspaceId',
      component: () => import(/* webpackChunkName: "workspace" */ './views/index.vue'),
      meta: {
        requiresAuth: true,
        hideAppBarIcon: true,
        title: 'Workspace: workspaceId',
        breadcrumb: 'Workspace - :workspaceId'
      },
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "workspace-index" */ './views/workspace/index.vue'),
          meta: {
            hideAppBarIcon: true,
            breadcrumb: 'Workspace',
            title: 'Workspace: workspaceId'
          },
          children: [
            {
              path: '',
              component: () => import(/* webpackChunkName: "workspace" */ './views/workspace/workspace.vue'),
              name: 'workspace',
              meta: {
                hideAppBarIcon: true,
                breadcrumb: 'Workspace',
                title: 'Workspace: workspaceId'
              }
            },
            {
              path: 'edit',
              component: () => import(/* webpackChunkName: "workspace-edit" */ './views/workspace/workspace-edit.vue'),
              name: 'workspace-edit',
              meta: {
                hideAppBarIcon: true,
                breadcrumb: 'Workspace edit'
              }
            }
          ]
        },
        {
          path: 'people',
          component: () => import(/* webpackChunkName: "workspace-people" */ './views/people.vue'),
          name: 'workspace-people',
          meta: {
            hideAppBarIcon: true,
            breadcrumb: 'People'
          }
        },
        {
          path: 'new-project',
          component: () => import(/* webpackChunkName: "workspace-new-project" */ './views/new-project.vue'),
          name: 'workspace-new-project',
          meta: {
            hideAppBarIcon: true,
            breadcrumb: 'New project - :workspaceId'
          }
        },
        {
          path: 'project-does-not-exist',
          component: () =>
            import(/* webpackChunkName: "project-does-not-exist" */ './views/project-does-not-exist.vue'),
          name: 'project-does-not-exist',
          meta: {
            hideAppBarIcon: true,
            title: 'Oops...we cannot find this project',
            breadcrumb: 'Project does not exist'
          }
        },
        {
          path: 'profile',
          component: () => import(/* webpackChunkName: "workspace-profile" */ './views/workspace-profile.vue'),
          name: 'workspace-profile',
          meta: {
            hideAppBarIcon: true,
            breadcrumb: 'Profile'
          }
        },

        {
          path: 'project/:projectId',
          component: () => import(/* webpackChunkName: "workspace-project" */ './views/project/index.vue'),
          meta: {
            hideAppBarIcon: true,
            breadcrumb: 'Project - :projectId'
          },

          children: [
            {
              path: '',
              name: 'workspace-project',
              redirect: { name: 'workspace-project-code' },
              meta: {
                hideAppBarIcon: true
              }
            },
            {
              path: 'activity',
              component: () =>
                import(/* webpackChunkName: "workspace-project-uuid-activity" */ './views/project/activity.vue'),
              name: 'workspace-project-activity',
              meta: {
                hideAppBarIcon: true,
                breadcrumb: 'Activity'
              }
            },
            {
              path: 'jobs',
              component: () =>
                import(/* webpackChunkName: "workspace-project-uuid-jobs-index" */ './views/project/jobs/index.vue'),
              meta: {
                breadcrumb: 'Jobs',
                hideAppBarIcon: true
              },
              children: JobRoutes
            },
            {
              path: 'variables',
              name: 'workspace-project-variables',
              component: () =>
                import(/* webpackChunkName: "workspace-project-variables" */ './views/project/variables.vue'),
              meta: {
                hideAppBarIcon: true,
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
                hideAppBarIcon: true,
                breadcrumb: 'Documentation'
              }
            },
            {
              path: 'code',
              name: 'workspace-project-code',
              component: () =>
                import(/* webpackChunkName: "workspace-project-package" */ './views/project/package.vue'),
              children: packageRoutes,
              meta: {
                hideAppBarIcon: true
              }
            },
            {
              path: 'code-does-not-exist',
              component: () =>
                import(
                  /* webpackChunkName: "workspace-project-code-does-not-exist" */ './views/project/code-does-not-exist.vue'
                ),
              name: 'workspace-project-code-does-not-exist',
              meta: {
                hideAppBarIcon: true,
                title: 'Oops...we cannot find this package',
                breadcrumb: 'Package does not exist'
              }
            },
            {
              path: 'edit',
              name: 'workspace-project-edit',
              component: () =>
                import(/* webpackChunkName: "workspace-project-edit" */ './views/project/project-edit.vue'),
              meta: {
                breadcrumb: 'Edit',
                hideAppBarIcon: true
              }
            }
          ]
        }
      ]
    }
  ]
}

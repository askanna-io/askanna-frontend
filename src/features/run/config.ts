import { PERMISSIONS_LABELS } from '@/features/workspace/types'

export const runRoutes = [
  {
    path: 'run-does-not-exist',
    component: () => import('./views/run-does-not-exist.vue'),
    name: 'workspace-project-job-run-does-not-exist',
    meta: {
      title: 'Oops...we cannot find this jobrun',
      breadcrumb: 'Run does not exist'
    }
  },
  {
    path: ':runId',
    name: 'workspace-project-jobs-job-run',
    redirect: { name: 'workspace-project-jobs-job-run-overview' },
    meta: {
      title: 'Run: runId',
      breadcrumb: 'Run - :runId'
    },
    component: () => import('./views/index.vue'),

    children: [
      {
        path: 'edit',
        component: () => import('./views/edit.vue'),
        name: 'workspace-project-jobs-job-run-edit',
        meta: {
          title: 'Run: runId',
          permission: PERMISSIONS_LABELS.projectRunEdit
        }
      },
      {
        path: 'overview',
        component: () => import('./views/overview.vue'),
        name: 'workspace-project-jobs-job-run-overview',
        meta: {
          title: 'Run: runId'
        }
      },
      {
        path: 'input/:view?',
        component: () => import('./views/run-input.vue'),
        name: 'workspace-project-jobs-job-run-input',
        meta: {
          title: 'Run: runId'
        }
      },
      {
        path: 'result/:view?',
        component: () => import('./views/result.vue'),
        name: 'workspace-project-jobs-job-run-result',
        meta: {
          title: 'Run: runId'
        }
      },
      {
        path: 'metrics',
        redirect: { name: 'workspace-project-jobs-job-run-metrics-table' },
        component: () => import('./views/metrics/index.vue'),
        name: 'workspace-project-jobs-job-run-metrics',
        meta: {
          title: 'Run: runId'
        },
        children: [
          {
            path: 'table',
            component: () => import('./views/metrics/table-view.vue'),
            name: 'workspace-project-jobs-job-run-metrics-table',
            meta: {
              tabValue: 'table',
              title: 'Run: runId'
            }
          },
          {
            path: 'chart',
            component: () => import('./views/metrics/chart-view.vue'),
            name: 'workspace-project-jobs-job-run-metrics-chart',
            meta: {
              tabValue: 'chart',
              title: 'Run: runId'
            }
          },
          {
            path: 'json',
            component: () => import('./views/metrics/json-view.vue'),
            name: 'workspace-project-jobs-job-run-metrics-json',
            meta: {
              tabValue: 'json',
              title: 'Run: runId'
            }
          }
        ]
      },
      {
        path: 'artifact',
        component: () => import('./views/artifact.vue'),
        name: 'workspace-project-jobs-job-run-artifact',
        meta: {
          title: 'Run: runId'
        },
        children: [
          {
            path: ':folderName(.*)',
            component: () => import('./views/artifact.vue'),
            name: 'workspace-project-jobs-job-run-artifact-folder',
            meta: {
              title: 'Run: runId',
              breadcrumb: ':folderName'
            }
          }
        ]
      },
      {
        path: 'variables',
        redirect: { name: 'workspace-project-jobs-job-run-variables-table' },
        component: () => import('./views/variables/index.vue'),
        name: 'workspace-project-jobs-job-run-variables',
        children: [
          {
            path: 'table',
            component: () => import('./views/variables/table-view.vue'),
            name: 'workspace-project-jobs-job-run-variables-table',
            meta: {
              tabValue: 'table',
              title: 'Run: runId'
            }
          },
          {
            path: 'json',
            component: () => import('./views/variables/json-view.vue'),
            name: 'workspace-project-jobs-job-run-variables-json',
            meta: {
              tabValue: 'json',
              title: 'Run: runId'
            }
          }
        ]
      },
      {
        path: 'code',
        component: () => import('./views/package.vue'),
        name: 'workspace-project-jobs-job-run-code',
        meta: {
          title: 'Run: runId'
        },
        children: [
          {
            path: ':folderName(.*)',
            component: () => import('./views/package.vue'),
            name: 'workspace-project-jobs-job-run-code-folder',
            meta: {
              title: 'Run: runId',
              breadcrumb: ':folderName'
            }
          }
        ]
      },
      {
        path: 'code-does-not-exist',
        component: () => import('./views/run-code-does-not-exist.vue'),
        name: 'workspace-project-jobs-job-run-code-does-not-exist',
        meta: {
          title: 'Oops...we cannot find this package',
          breadcrumb: 'Package does not exist'
        }
      },
      {
        path: 'log',
        component: () => import('./views/log.vue'),
        name: 'workspace-project-jobs-job-run-log',
        meta: {
          title: 'Run: runId'
        }
      }
    ]
  }
]

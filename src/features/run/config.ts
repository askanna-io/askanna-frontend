import { PERMISSIONS_LABELS } from '@/features/workspace/types'

export const runRoutes = [
  {
    path: 'run-does-not-exist',
    component: () => import('./views/RunDoesNotExist.vue'),
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
      breadcrumb: 'Run - :runId',
      breadcrumbLevel: 6
    },
    component: () => import('./views/RunIndex.vue'),

    children: [
      {
        path: 'edit',
        component: () => import('./views/RunEdit.vue'),
        name: 'workspace-project-jobs-job-run-edit',
        meta: {
          title: 'Run: runId',
          permission: PERMISSIONS_LABELS.projectRunEdit
        }
      },
      {
        path: 'overview',
        component: () => import('./views/RunOverview.vue'),
        name: 'workspace-project-jobs-job-run-overview',
        meta: {
          title: 'Run: runId'
        }
      },
      {
        path: 'input/:view?',
        component: () => import('./views/RunInput.vue'),
        name: 'workspace-project-jobs-job-run-input',
        meta: {
          title: 'Run: runId'
        }
      },
      {
        path: 'result/:view?',
        component: () => import('./views/RunResult.vue'),
        name: 'workspace-project-jobs-job-run-result',
        meta: {
          title: 'Run: runId'
        }
      },
      {
        path: 'metrics',
        redirect: { name: 'workspace-project-jobs-job-run-metrics-table' },
        component: () => import('./views/metrics/RunMetricsIndex.vue'),
        name: 'workspace-project-jobs-job-run-metrics',
        meta: {
          title: 'Run: runId'
        },
        children: [
          {
            path: 'table',
            component: () => import('./views/metrics/RunMetricsTableView.vue'),
            name: 'workspace-project-jobs-job-run-metrics-table',
            meta: {
              tabValue: 'table',
              title: 'Run: runId'
            }
          },
          {
            path: 'chart',
            component: () => import('./views/metrics/RunMetricsChartView.vue'),
            name: 'workspace-project-jobs-job-run-metrics-chart',
            meta: {
              tabValue: 'chart',
              title: 'Run: runId'
            }
          },
          {
            path: 'json',
            component: () => import('./views/metrics/RunMetricsJsonView.vue'),
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
        component: () => import('./views/RunArtifact.vue'),
        name: 'workspace-project-jobs-job-run-artifact',
        meta: {
          title: 'Run: runId'
        },
        children: [
          {
            path: ':folderName(.*)',
            component: () => import('./views/RunArtifact.vue'),
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
        component: () => import('./views/variables/RunVariablesIndex.vue'),
        name: 'workspace-project-jobs-job-run-variables',
        children: [
          {
            path: 'table',
            component: () => import('./views/variables/RunVariablesTableView.vue'),
            name: 'workspace-project-jobs-job-run-variables-table',
            meta: {
              tabValue: 'table',
              title: 'Run: runId'
            }
          },
          {
            path: 'json',
            component: () => import('./views/variables/RunVariablesJsonView.vue'),
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
        component: () => import('./views/RunCode.vue'),
        name: 'workspace-project-jobs-job-run-code',
        meta: {
          title: 'Run: runId'
        },
        children: [
          {
            path: ':folderName(.*)',
            component: () => import('./views/RunCode.vue'),
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
        component: () => import('./views/RunCodeDoesNotExist.vue'),
        name: 'workspace-project-jobs-job-run-code-does-not-exist',
        meta: {
          title: 'Oops...we cannot find this package',
          breadcrumb: 'Package does not exist'
        }
      },
      {
        path: 'log',
        component: () => import('./views/RunLog.vue'),
        name: 'workspace-project-jobs-job-run-log',
        meta: {
          title: 'Run: runId'
        }
      }
    ]
  }
]

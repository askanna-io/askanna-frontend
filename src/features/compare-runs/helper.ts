export const compareItems = {
  overview: {
    title: 'Overview',
    items: [
      {
        title: 'Status',
        field: 'status',
        type: 'status',
        getRouteParams: () => ({})
      },
      {
        title: 'Name',
        field: 'name',
        type: 'text',
        getRouteParams: () => ({})
      },
      {
        title: 'SUUID',
        field: 'short_uuid',
        type: 'run-suuid',
        to: 'workspace-project-jobs-job-jobrun-overview',
        getRouteParams: params => ({ jobRunId: params.jobRunId })
      },
      {
        title: 'Start date',
        field: 'created',
        type: 'date',
        getRouteParams: () => ({})
      },
      {
        title: 'Duration',
        field: 'duration',
        type: 'duration',
        getRouteParams: () => ({})
      },
      {
        title: 'Code',
        type: 'code',
        field: 'package.short_uuid',
        to: 'workspace-project-jobs-job-jobrun-code',
        getRouteParams: params => ({ jobRunId: params.jobRunId })
      },
      {
        title: 'By',
        field: 'created_by',
        type: 'by',
        class: '',
        getRouteParams: () => ({})
      },
      {
        title: 'Trigger',
        field: 'trigger',
        type: 'trigger',
        getRouteParams: () => ({})
      },
      {
        isMainGroup: true,
        title: 'Environment',
        field: '',
        type: '',
        getRouteParams: () => ({})
      },
      {
        isSubItem: true,
        title: 'Image name',
        field: 'environment.image',
        type: 'environment',
        params: {
          slicedFromStart: true
        },
        getRouteParams: () => ({})
      },
      {
        isSubItem: true,
        title: 'Image tag',
        field: 'environment.image.tag',
        type: 'text-sliced',
        getRouteParams: () => ({})
      },
      {
        isSubItem: true,
        title: 'Image digest',
        field: 'environment.image.digest',
        type: 'text-sliced',
        getRouteParams: () => ({})
      },
      {
        isSubItem: true,
        title: 'Timezone',
        field: 'environment.timezone',
        type: 'text',
        getRouteParams: () => ({})
      },
      {
        isMainGroup: true,
        title: 'Log',
        field: '',
        type: '',
        getRouteParams: () => ({})
      },
      {
        isSubItem: true,
        title: 'No. of lines',
        field: 'log.lines',
        type: 'text',
        getRouteParams: () => ({})
      },
      {
        isSubItem: true,
        title: 'Size',
        field: 'log.size',
        type: 'text-size',
        getRouteParams: () => ({})
      }
    ]
  },
  input: {
    title: 'Input',
    items: [
      {
        title: 'No. of lines',
        field: 'payload.lines',
        type: 'text',
        getRouteParams: () => ({})
      },
      {
        title: 'Size',
        field: 'payload.size',
        type: 'text-size',
        getRouteParams: () => ({})
      }
    ]
  },
  result: {
    title: 'Result',
    items: [
      {
        title: 'File name',
        field: 'result.name',
        type: 'text-slice',
        getRouteParams: () => ({})
      },
      {
        title: 'Size',
        field: 'result.size',
        type: 'text-size',
        getRouteParams: () => ({})
      }
    ]
  },
  metrics: {
    title: 'Metrics',
    items: [
      {
        title: 'File name',
        field: 'result.name',
        type: 'text',
        getRouteParams: () => ({})
      },
      {
        title: 'Size',
        field: 'result.size',
        type: 'text',
        getRouteParams: () => ({})
      }
    ]
  },
  artifact: {
    title: 'Artifact',
    items: [
      {
        title: 'No. of files',
        field: 'artifact.count_files',
        type: 'text',
        getRouteParams: () => ({})
      },
      {
        title: 'No. of directories',
        field: 'artifact.count_dir',
        type: 'text',
        getRouteParams: () => ({})
      },
      {
        title: 'Size',
        field: 'artifact.size',
        type: 'text-size',
        getRouteParams: () => ({})
      }
    ]
  }
}

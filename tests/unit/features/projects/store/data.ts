export const project = {
  uuid: 'f1e2144a-87f9-4936-8562-4304c51332ea',
  created: '2020-03-31T05:35:22.747000Z',
  modified: '2020-03-31T05:38:50.578000Z',
  title: 'AskAnna sandbox',
  description: 'safely play around in the sandbox',
  status: 1,
  activate_date: '2020-03-31T05:35:22Z',
  deactivate_date: null,
  deleted: null,
  short_uuid: '7MQT-6309-9g3t-R5QR',
  name: 'AskAnna Sandbox',
  workspace: '695fcc8b-ba8c-4575-a1e0-f0fcfc70a349'
}
export const projects = {
  count: 3,
  next: null,
  previous: null,
  results: [
    {
      uuid: '8d0c8475-3985-46a0-aaef-e582ab47c70c',
      created: '2020-03-31T05:36:17.341000Z',
      modified: '2020-03-31T05:36:17.341000Z',
      title: 'AskAnna base',
      description: '',
      status: 1,
      activate_date: '2020-03-31T05:36:17.327000Z',
      deactivate_date: null,
      deleted: null,
      short_uuid: '4I9d-ahIQ-8WkT-tT8C',
      name: 'AskAnna startup',
      workspace: '695fcc8b-ba8c-4575-a1e0-f0fcfc70a349'
    },
    {
      uuid: 'a1074a55-6818-45aa-8362-be27f1b1435e',
      created: '2020-03-11T15:27:19.536000Z',
      modified: '2020-03-31T05:34:37.307000Z',
      title: 'AskAnna HQ',
      description: '',
      status: 1,
      activate_date: '2020-03-31T05:34:33Z',
      deactivate_date: null,
      deleted: null,
      short_uuid: '4tr5-yND3-WU1z-F1ry',
      name: 'AskAnna HQ',
      workspace: '695fcc8b-ba8c-4575-a1e0-f0fcfc70a349'
    },
    {
      uuid: 'f1e2144a-87f9-4936-8562-4304c51332ea',
      created: '2020-03-31T05:35:22.747000Z',
      modified: '2020-03-31T05:38:50.578000Z',
      title: 'AskAnna sandbox',
      description: 'safely play around in the sandbox',
      status: 1,
      activate_date: '2020-03-31T05:35:22Z',
      deactivate_date: null,
      deleted: null,
      short_uuid: '7MQT-6309-9g3t-R5QR',
      name: 'AskAnna Sandbox',
      workspace: '695fcc8b-ba8c-4575-a1e0-f0fcfc70a349'
    }
  ]
}

export const projectJobs = [
  {
    uuid: '5b77db15-1213-4cbd-9ff5-40292ae15397',
    project: 'f1e2144a-87f9-4936-8562-4304c51332ea',
    created: '2020-03-31T08:01:02.442000Z',
    modified: '2020-03-31T08:03:06.157000Z',
    title: 'failcase',
    description: '',
    deleted: null,
    short_uuid: '2mb4-iA7p-680u-Tpaw',
    name: 'failcase',
    default_payload: 'e2e55775-c824-40c2-8e3d-8707aeb02289',
    function: 'dummyload.tasks.hello_error',
    backend: 'job.celerybackend.CeleryJob',
    visible: true,
    environment: 'python3.5',
    env_variables: '',
    owner: null
  },
  {
    uuid: '2ac57407-6cf7-4bac-9a17-02d27f4a566f',
    project: 'f1e2144a-87f9-4936-8562-4304c51332ea',
    created: '2020-03-31T07:57:47.771000Z',
    modified: '2020-03-31T08:03:10.596000Z',
    title: 'sleep',
    description: '',
    deleted: null,
    short_uuid: '1Ihu-frKX-1QYm-g61d',
    name: 'sleep',
    default_payload: '9209f436-273a-44aa-b4cb-c92290ec330f',
    function: 'dummyload.tasks.hello_retvalue',
    backend: 'job.celerybackend.CeleryJob',
    visible: true,
    environment: 'python3.5',
    env_variables: '',
    owner: null
  }
]

type apiPoint<T> = { [key: string]: T }
type apiUrl = (ids: apiUrlFunctionParams) => string
type AuthApiUrl = () => string
export type apiUrlFunctionParams = {
  [key: string]: string
}

interface ApiSettings {
  url: () => string
  apiUrl: () => string
  auth: {
    login: AuthApiUrl
    logout: apiUrl
    currentUser: AuthApiUrl
    resetPassword: AuthApiUrl
    validateResetToken: AuthApiUrl
    confirmResetPassword: AuthApiUrl
  }
  points: {
    [pointServiceName: string]: apiPoint<apiUrl>
  }
}
interface FuaturesApi {
  [featureApi: string]: (uuid: string) => void | string
}

export const url = process.env.VUE_APP_URL
export const apiUrl = process.env.VUE_APP_API_URL
const apiPort = process.env.VUE_APP_API_PORT

export const api: ApiSettings = {
  url: () => `${apiUrl}:${apiPort}/`,
  apiUrl: () => `${apiUrl}:${apiPort}/v1/`,
  // auth api
  auth: {
    login: () => `rest-auth/login/`,
    logout: () => `rest-auth/logout/`,
    currentUser: () => 'rest-auth/user/',
    resetPassword: () => `rest-auth/password/reset/`,
    validateResetToken: () => `rest-auth/password/token-status/`,
    confirmResetPassword: () => `rest-auth/password/reset/confirm/`
  },
  points: {
    auth: {
      logout: () => `rest-auth/logout/`,
      getCurrentUser: () => 'rest-auth/user/'
    },
    accounts: {
      create: () => `accounts/`
    },
    jobs: {
      list: () => `job/`
    },
    project: {
      get: id => `project/${id}/`,
      list: () => `project/`,
      jobs: id => `project/${id}/jobs/`,
      packages: id => `project/${id}/packages/`,
      getLastJobRun: id => `job/${id}/runs/`,
      create: () => 'project/',
      update: id => `project/${id}/`,
      templates: () => 'project_template/',
      delete: id => `project/${id}/`
    },
    package: {
      get: ({ projectId, packageId }) => `project/${projectId}/packages/${packageId}/`,
      registerPackage: () => 'package/',
      registerChunkPackage: packageId => `package/${packageId}/packagechunk/`,
      uploadChunkPackage: ({ chunkId, packageId }) => `package/${packageId}/packagechunk/${chunkId}/chunk/`,
      finishUpload: packageId => `package/${packageId}/finish_upload/`
    },
    packages: {
      list: () => `project/`,
      projectPackages: id => `project/${id}/packages/`,
      getDownloadLink: ({ projectId, packageId }) => `project/${projectId}/packages/${packageId}/download/`

      //getDownloadLink: ({ projectId, packageId }) => 'project/1/packages/45d1816c-4973-4db1-b909-a4a2a6cda9b4/download/'
    },
    job: {
      add: () => 'job/',
      get: id => `job/${id}/`,
      update: id => `job/${id}/`,
      remove: id => `job/${id}/`,
      info: id => `job/${id}/info/`,
      kill: id => `job/${id}/kill/`,
      pause: id => `job/${id}/pause/`,
      reset: id => `job/${id}/reset/`,
      start: id => `run/${id}/`,
      stop: id => `job/${id}/stop/`,
      result: id => `job/${id}/result/`,
      runs: id => `job/${id}/runs/`,
      getJobRun: id => `runinfo/${id}/`,
      jobrunStatus: id => `status/${id}/`,
      getJobRunPayload: ({ jobRunShortId, payloadUuid }) => `runinfo/${jobRunShortId}/payload/${payloadUuid}/`
    },
    jobrun: {
      get: id => `runinfo/${id}/`,
      runs: id => `job/${id}/runs/`,
      getJobRun: id => `runinfo/${id}/`,
      getJobRunResult: id => `result/${id}/`,
      getJobRunLog: id => `log/${id}/`,
      getDownloadLink: ({ jobRunShortId, artifactShortId }) =>
        `runinfo/${jobRunShortId}/artifact/${artifactShortId}/download/`,
      getJobRunPayload: ({ jobRunShortId, payloadUuid }) => `runinfo/${jobRunShortId}/payload/${payloadUuid}/`,
      getJobRunArtifact: ({ jobRunShortId, artifactShortId }) => `runinfo/${jobRunShortId}/artifact/${artifactShortId}/`
    },
    workspace: {
      get: id => `workspace/${id}/`,
      list: () => `workspace/`,
      projects: id => `workspace/${id}/projects/`,
      invitePeople: id => `workspace/${id}/people/`,
      changeRole: ({ workspaceId, peopleId }) => `workspace/${workspaceId}/people/${peopleId}/`,
      acceptInvitetion: ({ workspaceId, peopleId }) => `workspace/${workspaceId}/people/${peopleId}/`,
      getProjectPackages: id => `project/${id}/packages/`,
      getWorkspacePeople: id => `workspace/${id}/people/`,
      setPeopleAvatar: ({ workspaceId, peopleId }) => `workspace/${workspaceId}/people/${peopleId}/avatar/`
    },
    result: {
      get: id => `result/${id}/`
    },
    variables: {
      list: id => `project/${id}/variables/`,
      update: ({ projectId, variableId }) => `project/${projectId}/variables/${variableId}/`
    },
    user: {
      getAccounts: () => 'accounts/',
      getProfile: () => 'rest-auth/user/',
      updateAccount: id => `accounts/${id}/`
    },
    metric: {
      getMetric: jobRunShortId => `runinfo/${jobRunShortId}/metrics/`,
      getMetricMeta: jobRunShortId => `runinfo/${jobRunShortId}/metrics/${jobRunShortId}/meta/`
    },
    runifo: {
      getVariables: jobRunShortId => `runinfo/${jobRunShortId}/variables/`,
      getVariablesMeta: jobRunShortId => `runinfo/${jobRunShortId}/variables/${jobRunShortId}/meta/`
    }
  }
}

export const apiStringify = (moduleName: string) => {
  return Object.keys(api.points[moduleName]).reduce((acc: any, prop) => {
    acc[prop] = prop

    return acc
  }, {})
}

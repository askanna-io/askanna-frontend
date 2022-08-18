type apiPoint<T> = { [key: string]: T }
type apiUrl = (ids: apiUrlFunctionParams) => string

export type apiUrlFunctionParams = {
  [key: string]: string
}

interface ApiSettings {
  apiUrl: () => string
  points: {
    [pointServiceName: string]: apiPoint<apiUrl>
  }
}
interface FuaturesApi {
  [featureApi: string]: (uuid: string) => void | string
}

export const url = process.env.VUE_APP_URL
export const apiUrl = process.env.VUE_APP_API_URL

export const api: ApiSettings = {
  apiUrl: () => `${apiUrl}/v1/`,
  points: {
    auth: {
      login: () => `auth/login/`,
      logout: () => `auth/logout/`,
      currentUser: () => 'uth/user/',
      getCurrentUser: () => 'auth/user/',
      resetPassword: () => `auth/password/reset/`,
      validateResetToken: () => `auth/password/token-status/`,
      confirmResetPassword: () => `auth/password/reset/confirm/`
    },
    accounts: {
      create: () => `accounts/`
    },
    jobs: {
      list: () => `job/`,
      jobs: id => `project/${id}/jobs/`,
      getLastJobRun: id => `job/${id}/runs/`
    },
    project: {
      get: id => `project/${id}/`,
      list: () => `project/`,
      projectMe: id => `project/${id}/me/`,
      packages: id => `project/${id}/packages/`,
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
    },
    job: {
      add: () => 'job/',
      get: id => `job/${id}/`,
      update: id => `job/${id}/`,
      delete: id => `job/${id}/`,
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
      delete: id => `runinfo/${id}/`,
      getJobRun: id => `runinfo/${id}/`,
      getJobRunResult: id => `result/${id}/`,
      getJobRunLog: id => `log/${id}/`,
      getDownloadLink: ({ jobRunShortId, artifactShortId }) =>
        `runinfo/${jobRunShortId}/artifact/${artifactShortId}/download/`,
      getJobRunPayload: ({ jobRunShortId, payloadUuid }) => `runinfo/${jobRunShortId}/payload/${payloadUuid}/`,
      getJobRunArtifact: ({ jobRunShortId, artifactShortId }) => `runinfo/${jobRunShortId}/artifact/${artifactShortId}/`
    },
    workspace: {
      list: () => `workspace/`,
      create: () => `workspace/`,
      get: id => `workspace/${id}/`,
      profile: id => `workspace/${id}/me/`,
      profileAvatar: id => `workspace/${id}/me/avatar/`,
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
      globalProfile: () => 'me/',
      globalProfileAvatar: () => 'me/avatar/',
      getAccounts: () => 'accounts/',
      getProfile: () => 'auth/user/',
      updateAccount: id => `accounts/${id}/`
    },
    metric: {
      getMetric: jobRunShortId => `runinfo/${jobRunShortId}/metrics/`,
      getMetricMeta: jobRunShortId => `runinfo/${jobRunShortId}/`
    },
    runifo: {
      getVariables: jobRunShortId => `runinfo/${jobRunShortId}/variables/`
    },
    variable: {
      getVariables: jobRunShortId => `runinfo/${jobRunShortId}/variables/`
    }
  }
}

export const apiStringify = (moduleName: string) => {
  return Object.keys(api.points[moduleName]).reduce((acc: any, prop) => {
    acc[prop] = prop

    return acc
  }, {})
}

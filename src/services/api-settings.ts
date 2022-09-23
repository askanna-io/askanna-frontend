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

export const url = import.meta.env.VITE_APP_URL
export const apiUrl = import.meta.env.VITE_APP_API_URL

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
      getLastRun: id => `job/${id}/runs/`
    },
    project: {
      get: id => `project/${id}/`,
      list: () => `project/`,
      projectMe: id => `project/${id}/me/`,
      packages: id => `project/${id}/packages/`,
      create: () => 'project/',
      update: id => `project/${id}/`,
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
      getRun: id => `runinfo/${id}/`,
      jobrunStatus: id => `status/${id}/`,
      getRunPayload: ({ runShortId, payloadUuid }) => `runinfo/${runShortId}/payload/${payloadUuid}/`
    },
    run: {
      get: id => `runinfo/${id}/`,
      runs: id => `job/${id}/runs/`,
      delete: id => `runinfo/${id}/`,
      getRun: id => `runinfo/${id}/`,
      getRunResult: id => `result/${id}/`,
      getRunLog: id => `log/${id}/`,
      getDownloadLink: ({ runShortId, artifactShortId }) =>
        `runinfo/${runShortId}/artifact/${artifactShortId}/download/`,
      getRunPayload: ({ runShortId, payloadUuid }) => `runinfo/${runShortId}/payload/${payloadUuid}/`,
      getRunArtifact: ({ runShortId, artifactShortId }) => `runinfo/${runShortId}/artifact/${artifactShortId}/`
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
      getPeople: id => `workspace/${id}/people/`,
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
      getMetric: runShortId => `runinfo/${runShortId}/metrics/`,
      getMetricMeta: runShortId => `runinfo/${runShortId}/`
    },
    runifo: {
      getVariables: runShortId => `runinfo/${runShortId}/variables/`
    },
    variable: {
      getVariables: runShortId => `runinfo/${runShortId}/variables/`
    }
  }
}

export const apiStringify = (moduleName: string) => {
  return Object.keys(api.points[moduleName]).reduce((acc: any, prop) => {
    acc[prop] = prop

    return acc
  }, {})
}
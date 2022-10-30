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
      create: () => `account/`
    },
    jobs: {
      list: () => `job/`,
      jobs: id => `project/${id}/job/`,
      getLastRun: id => `job/${id}/run/`
    },
    project: {
      list: () => `project/`,
      create: () => 'project/',
      get: id => `project/${id}/`,
      update: id => `project/${id}/`,
      delete: id => `project/${id}/`,
      projectMe: id => `project/${id}/me/`,
      packages: id => `project/${id}/package/`
    },
    package: {
      registerPackage: () => 'package/',
      get: packageId => `package/${packageId}/`,
      finishUpload: packageId => `package/${packageId}/finish_upload/`,
      registerChunkPackage: packageId => `package/${packageId}/packagechunk/`,
      uploadChunkPackage: ({ chunkId, packageId }) => `package/${packageId}/packagechunk/${chunkId}/chunk/`
    },
    packages: {
      list: () => `project/`,
      projectPackages: id => `project/${id}/package/`,
      getDownloadLink: packageId => `package/${packageId}/download/`
    },
    job: {
      add: () => 'job/',
      get: id => `job/${id}/`,
      update: id => `job/${id}/`,
      delete: id => `job/${id}/`,
      info: id => `job/${id}/info/`,
      kill: id => `job/${id}/kill/`,
      runs: id => `job/${id}/run/`,
      stop: id => `job/${id}/stop/`,
      pause: id => `job/${id}/pause/`,
      reset: id => `job/${id}/reset/`,
      result: id => `job/${id}/result/`
    },
    run: {
      get: id => `run/${id}/`,
      delete: id => `run/${id}/`,
      getRun: id => `run/${id}/`,
      runs: id => `job/${id}/run/`,
      status: id => `run/${id}/status/`,
      getRunLog: id => `run/${id}/log/`,
      getRunResult: id => `run/${id}/result/`,
      start: id => `job/${id}/run/request/batch/`,
      getRunPayload: ({ runShortId, payloadUuid }) => `run/${runShortId}/payload/${payloadUuid}/`,
      getRunArtifact: ({ runShortId, artifactShortId }) => `run/${runShortId}/artifact/${artifactShortId}/`,
      getDownloadLink: ({ runShortId, artifactShortId }) => `run/${runShortId}/artifact/${artifactShortId}/download/`
    },
    workspace: {
      list: () => `workspace/`,
      create: () => `workspace/`,
      get: id => `workspace/${id}/`,
      profile: id => `workspace/${id}/me/`,
      projects: id => `workspace/${id}/project/`,
      getPeople: id => `workspace/${id}/people/`,
      invitePeople: id => `workspace/${id}/people/`,
      profileAvatar: id => `workspace/${id}/me/avatar/`,
      getProjectPackages: id => `project/${id}/package/`,
      changeRole: ({ workspaceId, peopleId }) => `workspace/${workspaceId}/people/${peopleId}/`,
      acceptInvitetion: ({ workspaceId, peopleId }) => `workspace/${workspaceId}/people/${peopleId}/`,
      setPeopleAvatar: ({ workspaceId, peopleId }) => `workspace/${workspaceId}/people/${peopleId}/avatar/`
    },
    result: {
      get: id => `run/${id}/result/`
    },
    variables: {
      list: id => `project/${id}/variable/`,
      update: ({ projectId, variableId }) => `project/${projectId}/variable/${variableId}/`
    },
    user: {
      globalProfile: () => 'me/',
      getAccounts: () => 'accounts/',
      getProfile: () => 'auth/user/',
      updateAccount: id => `accounts/${id}/`,
      globalProfileAvatar: () => 'me/avatar/'
    },
    metric: {
      getMetricMeta: runShortId => `run/${runShortId}/`,
      getMetric: runShortId => `run/${runShortId}/metric/`
    },
    runifo: {
      getVariables: runShortId => `run/${runShortId}/variable/`
    },
    variable: {
      getVariables: runShortId => `run/${runShortId}/variable/`
    }
  }
}

export const apiStringify = (moduleName: string) => {
  return Object.keys(api.points[moduleName]).reduce((acc: any, prop) => {
    acc[prop] = prop

    return acc
  }, {})
}

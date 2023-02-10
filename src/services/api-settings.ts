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
      resetPassword: () => `auth/password/reset/`,
      confirmResetPassword: () => `auth/password/reset/confirm/`,
      resetTokenStatus: () => `auth/password/reset/token-status/`
    },
    accounts: {
      create: () => `account/`
    },
    project: {
      list: () => `project/`,
      create: () => 'project/',
      get: (id) => `project/${id}/`,
      update: (id) => `project/${id}/`,
      delete: (id) => `project/${id}/`,
      projectMe: (id) => `project/${id}/me/`
    },
    package: {
      list: () => `package/`,
      get: (packageId) => `package/${packageId}/`,
      getDownloadLink: (packageId) => `package/${packageId}/download/`,
      finishUpload: (packageId) => `package/${packageId}/finish_upload/`,
      registerChunkPackage: (packageId) => `package/${packageId}/packagechunk/`,
      uploadChunkPackage: ({ chunkId, packageId }) => `package/${packageId}/packagechunk/${chunkId}/chunk/`
    },
    job: {
      add: () => 'job/',
      list: () => `job/`,
      get: (id) => `job/${id}/`,
      update: (id) => `job/${id}/`,
      delete: (id) => `job/${id}/`
    },
    run: {
      list: () => 'run/',
      get: (id) => `run/${id}/`,
      delete: (id) => `run/${id}/`,
      getRun: (id) => `run/${id}/`,
      status: (id) => `run/${id}/status/`,
      getRunLog: (id) => `run/${id}/log/`,
      getRunResult: (id) => `run/${id}/result/`,
      start: (id) => `job/${id}/run/request/batch/`,
      getRunPayload: ({ runShortId, payloadUuid }) => `run/${runShortId}/payload/${payloadUuid}/`,
      getRunArtifact: ({ runShortId, artifactShortId }) => `run/${runShortId}/artifact/${artifactShortId}/`,
      getDownloadLink: ({ runShortId, artifactShortId }) => `run/${runShortId}/artifact/${artifactShortId}/download/`
    },
    workspace: {
      list: () => `workspace/`,
      create: () => `workspace/`,
      get: (id) => `workspace/${id}/`,
      profile: (id) => `workspace/${id}/me/`,
      getPeople: (id) => `workspace/${id}/people/`,
      profileAvatar: (id) => `workspace/${id}/me/avatar/`,
      invitePeople: (id) => `workspace/${id}/people/invite/`,
      checkPeopleByEmails: (id) => `workspace/${id}/people/invite/check-email/`,
      changeRole: ({ workspaceId, peopleId }) => `workspace/${workspaceId}/people/${peopleId}/`,
      updatePeople: ({ workspaceId, peopleId }) => `workspace/${workspaceId}/people/${peopleId}/`,
      setPeopleAvatar: ({ workspaceId, peopleId }) => `workspace/${workspaceId}/people/${peopleId}/avatar/`,
      acceptInvitetion: ({ workspaceId, peopleId }) => `workspace/${workspaceId}/people/${peopleId}/invite/accept/`,
      resendInvitetion: ({ workspaceId, peopleId }) => `workspace/${workspaceId}/people/${peopleId}/invite/resend/`,
      getInvitetionInfo: ({ workspaceId, peopleId }) => `workspace/${workspaceId}/people/${peopleId}/invite/info/`
    },
    result: {
      get: (id) => `run/${id}/result/`
    },
    variables: {
      list: () => 'variable/',
      update: (variableId) => `variable/${variableId}/`
    },
    user: {
      globalProfile: () => 'me/',
      getAccounts: () => 'account',
      getProfile: () => 'auth/user/',
      updateAccount: (id) => `account/${id}/`,
      globalProfileAvatar: () => 'me/avatar/'
    },
    metric: {
      getMetricMeta: (runShortId) => `run/${runShortId}/`,
      getMetric: (runShortId) => `run/${runShortId}/metric/`
    },
    runifo: {
      getVariables: (runShortId) => `run/${runShortId}/variable/`
    },
    variable: {
      getVariables: (runShortId) => `run/${runShortId}/variable/`
    }
  }
}

export const apiStringify = (moduleName: string) => {
  return Object.keys(api.points[moduleName]).reduce((acc: any, prop) => {
    acc[prop] = prop

    return acc
  }, {})
}

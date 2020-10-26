export interface generalState extends GeneralState {}

export interface GeneralState {
  projectId: string
  breadcrumbParams: {
    jobId: string
    jobRunId: string
    projectId: string
    workspaceId: string
  }
}

export const GENERAL_STORE = 'general'

export const action = {
  setBreadcrumbParams: 'setBreadcrumbParams'
}

export const mutation = {
  SET_BREADCRUMB_PARAMS: 'SET_BREADCRUMB_PARAMS'
}

export const stateType = {
  projectId: 'projectId',
  breadcrumbParams: 'breadcrumbParams'
}

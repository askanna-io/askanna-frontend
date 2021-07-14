export interface generalState extends GeneralState {}

export type IntervalMap = Record<string, Number>

export interface GeneralState {
  projectId: string
  breadcrumbParams: {
    jobId: string
    jobRunId: string
    projectId: string
    workspaceId: string
  }
  interval: any
}

export const GENERAL_STORE = 'general'

export const action = {
  setInterval: 'setInterval',
  clearInterval: 'clearInterval',
  setBreadcrumbParams: 'setBreadcrumbParams'
}

export const mutation = {
  SET_INTERVAL: 'SET_INTERVAL',
  CLEAR_INTERVAL: 'CLEAR_INTERVAL',
  SET_BREADCRUMB_PARAMS: 'SET_BREADCRUMB_PARAMS'
}

export const stateType = {
  interval: 'interval',
  projectId: 'projectId',
  breadcrumbParams: 'breadcrumbParams'
}

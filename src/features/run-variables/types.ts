export interface runInfoVariablesState extends RunInfoVariablesState {}

export interface RunInfoVariablesState {
  isFiltered: boolean
  variables: {
    count: number
    results: Variables[]
    next: null | string
  }
  variablesJSON: {
    count: number
    results: Variables[]
    next: null | string
  }
  variablesLabels: string[]
  variablesFullData: string
  loading: {
    variables: Boolean
    variablesJSON: Boolean
    variablesByParams: Boolean
  }
}
interface Variables {
  name: string
  status: string
  email: string
  uuid: string
  short_uuid: string
  object_uuid: string
  workspace: {
    name: string
    short_uuid: string
    uuid: string
  }
  role: string
  job_title: string
  user: { name: string | null; short_uuid: string | null; uuid: string | null }
  front_end_url: string
}

export const RUNIFO_VARIABLES_STORE = 'runinfoVariables'

export const action = {
  getVariables: 'getVariables',
  setLoading: 'setLoading',
  setIsFiltered: 'setIsFiltered',
  getVariablesJSON: 'getVariablesJSON',
  getVariablesLabels: 'getVariablesLabels',
  getVariablesInitial: 'getVariablesInitial',
  getVariablesByParams: 'getVariablesByParams',
  getVariablesFullData: 'getVariablesFullData'
}

export const mutation = {
  SET_VARIABLES: 'SET_VARIABLES',
  SET_LOADING: 'SET_LOADING',
  SET_IS_FILTERED: 'SET_IS_FILTERED',
  SET_VARIABLES_INIT: 'SET_VARIABLES_INIT',
  SET_VARIABLES_JSON: 'SET_VARIABLES_JSON',
  SET_VARIABLES_FULL_DATA: 'SET_VARIABLES_FULL_DATA'
}

export const stateType = {
  variables: 'variables',
  loading: 'loading',
  isFiltered: 'isFiltered',
  variablesJSON: 'variablesJSON',
  variablesLabels: 'variablesLabels',
  variablesFullData: 'variablesFullData'
}

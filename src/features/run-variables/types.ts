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

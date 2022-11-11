export interface Variable {
  name: string
  value: string
  created: string
  modified: string
  suuid: string
  is_masked: boolean
  project: {
    name: string
    suuid: string
  }
}

export const VARIABLES_STORE = 'variables'

export interface Variable {
  name: string
  value: string
  created_at: string
  modified_at: string
  suuid: string
  is_masked: boolean
  project: {
    name: string
    suuid: string
  }
}

export const VARIABLES_STORE = 'variables'

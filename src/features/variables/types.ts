export interface VariablesState {
  variable: Variable
  variables: Variable[]
  variablesLoading: boolean
  variablePopup: boolean
  variableConfirmDeletePopup: boolean
}

interface Variable {
  name: string
  value: string
  created: string
  modified: string
  uuid: string
  short_uuid: string
  is_masked: boolean
  project: {
    name: string
    uuid: string
    short_uuid: string
  }
}

export const VARIABLES_STORE = 'variables'

export class VariableModel {
  private _state: Variable

  constructor() {
    this._state = VariableModel.initialState()
  }

  get state() {
    return this._state
  }

  static initialState() {
    return {
      name: '',
      value: '',
      created: '',
      modified: '',
      uuid: '',
      short_uuid: '',
      is_masked: false,
      project: {
        name: '',
        uuid: '',
        short_uuid: ''
      }
    }
  }
}

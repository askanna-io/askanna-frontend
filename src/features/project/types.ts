export const enum ProjectVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

interface Project {
  uuid: string
  name: string
  flows: any[]
  created: string
  modified: string
  template: string
  short_uuid: string
  description: string
  package: {
    name: string
    uuid: string
    short_uuid: string
  }
  visibility: ProjectVisibility
}

export const PROJECT_STORE = 'project'

export class ProjectModel {
  private _state: Project

  constructor() {
    this._state = ProjectModel.initialState()
  }

  get state() {
    return this._state
  }

  static initialState() {
    return {
      uuid: '',
      name: '',
      flows: [],
      created: '',
      modified: '',
      template: '',
      permission: {},
      short_uuid: '',
      description: '',
      package: {
        name: '',
        uuid: '',
        short_uuid: ''
      },
      visibility: ProjectVisibility.PRIVATE
    }
  }
}

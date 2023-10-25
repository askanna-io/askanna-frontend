import { CreatedBy } from '@/features/run/types'

export const enum ProjectVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

interface Project {
  name: string
  flows: any[]
  created_at: string
  modified_at: string
  template: string
  suuid: string
  description: string
  package: {
    name: string
    suuid: string
  }
  created_by: {
    suuid: string
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
      name: '',
      flows: [],
      created_at: '',
      created_by: {} as CreatedBy,
      modified_at: '',
      template: '',
      permission: {},
      suuid: '',
      description: '',
      package: {
        name: '',
        suuid: ''
      },
      visibility: ProjectVisibility.PRIVATE
    }
  }
}

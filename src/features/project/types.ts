export interface projectState extends ProjectState {}

export interface ProjectState {
  project: Project
  projects: {
    next: string
    previous: string
    count: number
    results: any[]
  }
  projectJobs: []
  query: {
    limit: number
    offset: number
  }
  lastPackage: any
  jobsLoading: Boolean
  projectLoading: Boolean
  menu: {
    sticked: boolean
    isSticked: boolean
    isShowProjectBar: boolean
  }
  projectsLoading: Boolean
  projectTemplates: ProjectTemplate[]
}

export interface ProjectTemplate {
  created: string
  deleted: null | string
  modified: string
  name: string
  scope: any
  short_uuid: string
  template_location: string
  uuid: string
}

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

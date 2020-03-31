export interface projectState extends ProjectData {}

export interface ProjectData {
  project: Project
  projects: []
}

interface Project {
  uuid: string
  created: string
  modified: string
  description: string
  short_uuid: string
  name: string
  status: string
  flows: any[]
}

export const PROJECT_STORE = 'project'

export const action = {
  addProject: 'addProject',
  getProject: 'getProject',
  getProjects: 'getProjects'
}

export const mutation = {
  SET_PROJECT: 'SET_PROJECT',
  SET_PROJECTS: 'SET_PROJECTS',
  UPDATE_ROJECT: 'UPDATE_ROJECT'
}

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
      short_uuid: '',
      created: '',
      modified: '',
      description: '',
      name: '',
      status: '',
      flows: []
    }
  }
}

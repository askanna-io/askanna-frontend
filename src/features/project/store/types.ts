export interface projectState extends ProjectData {}

export interface ProjectData {
  project: Project
  projects: []
}

interface Project {
  id: number
  uuid: string
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
      id: 0,
      uuid: '',
      name: '',
      status: '',
      flows: []
    }
  }
}

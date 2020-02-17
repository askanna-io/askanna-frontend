export interface projectState extends ProjectData {}

export interface ProjectData {
  project: Project
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
  getProject: 'getProject'
}

export const mutation = {
  SET_PROJECT: 'SET_PROJECT',
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

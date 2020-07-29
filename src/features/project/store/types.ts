export interface projectState extends ProjectState {}

export interface ProjectState {
  project: Project
  projects: {
    count: number
    results: any[]
  }
  projectJobs: []
  query: {
    limit: number
    offset: number
  }
  createProject: {
    name: string
    workspace: string
  }
}

interface Project {
  uuid: string
  short_uuid: string
  name: string
  status: string
  flows: any[]
  created: string
  modified: string
  title: string
  description: string
}

export const PROJECT_STORE = 'project'

export const action = {
  setProject: 'setProject',
  addProject: 'addProject',
  getProject: 'getProject',
  getProjects: 'getProjects',
  createProject: 'createProject',
  updateProject: 'updateProject',
  getProjectJobs: 'getProjectJobs',
  resetProjectJobs: 'resetProjectJobs'
}

export const mutation = {
  SET_PROJECT: 'SET_PROJECT',
  SET_PROJECTS: 'SET_PROJECTS',
  UPDATE_ROJECT: 'UPDATE_ROJECT',
  UPDATE_PROJECTS: 'UPDATE_PROJECTS',
  SET_PROJECT_DATA: 'SET_PROJECT_DATA',
  SET_PROJECT_JOBS: 'SET_PROJECT_JOBS',
  RESET_PORJECT_JOBS: 'RESET_PORJECT_JOBS'
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
      name: '',
      status: '',
      created: '',
      modified: '',
      flows: [],
      title: '',
      description: ''
    }
  }
}

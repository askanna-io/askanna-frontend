export interface projectState extends ProjectState {}

export interface ProjectState {
  project: Project
  projects: {
    count: 0
    results: []
  }
  projectJobs: []
  query: {
    limit: 10
    offset: 0
  }
  jobsLoading: Boolean
  lastPackage: any
  projectsLoading: Boolean
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
  addProject: 'addProject',
  getProject: 'getProject',
  getProjects: 'getProjects',
  getProjectJobs: 'getProjectJobs',
  getLastPackage: 'getLastPackage',
  resetProjectJobs: 'resetProjectJobs'
}

export const mutation = {
  SET_LOADING: 'SET_LOADING',
  SET_PROJECT: 'SET_PROJECT',
  SET_PROJECTS: 'SET_PROJECTS',
  UPDATE_ROJECT: 'UPDATE_ROJECT',
  SET_LAST_PACKAGE: 'SET_LAST_PACKAGE',
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

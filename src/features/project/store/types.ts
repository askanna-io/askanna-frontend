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
  }
  jobsLoading: Boolean
  lastPackage: any
  menu: {
    isSticked: boolean
    isShowProjectBar: boolean
    sticked: boolean
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
  setMenu: 'setMenu',
  setProject: 'setProject',
  addProject: 'addProject',
  getProject: 'getProject',
  getProjects: 'getProjects',
  createProject: 'createProject',
  updateProject: 'updateProject',
  getProjectJobs: 'getProjectJobs',
  getLastPackage: 'getLastPackage',
  resetProjectJobs: 'resetProjectJobs'
}

export const mutation = {
  SET_LOADING: 'SET_LOADING',
  SET_MENU: 'SET_MENU',
  SET_PROJECT: 'SET_PROJECT',
  SET_PROJECTS: 'SET_PROJECTS',
  UPDATE_ROJECT: 'UPDATE_ROJECT',
  SET_LAST_PACKAGE: 'SET_LAST_PACKAGE',
  UPDATE_PROJECTS: 'UPDATE_PROJECTS',
  SET_PROJECT_DATA: 'SET_PROJECT_DATA',
  SET_PROJECT_JOBS: 'SET_PROJECT_JOBS',
  RESET_PROJECT_DATA: 'RESET_PROJECT_DATA',
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

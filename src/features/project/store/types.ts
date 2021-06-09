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
  jobsLoading: Boolean
  projectLoading: Boolean
  lastPackage: any
  menu: {
    isSticked: boolean
    isShowProjectBar: boolean
    sticked: boolean
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
}

export const PROJECT_STORE = 'project'

export const action = {
  setMenu: 'setMenu',
  setProject: 'setProject',
  addProject: 'addProject',
  getProject: 'getProject',
  getProjects: 'getProjects',
  createProject: 'createProject',
  deleteProject: 'deleteProject',
  updateProject: 'updateProject',
  getProjectJobs: 'getProjectJobs',
  getLastPackage: 'getLastPackage',
  resetProjectJobs: 'resetProjectJobs',
  resetProjectData: 'resetProjectData',
  getProjectTemplates: 'getProjectTemplates',
  createProjectFullWay: 'createProjectFullWay',
  createProjectShortWay: 'createProjectShortWay'
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
  RESET_PORJECT_JOBS: 'RESET_PORJECT_JOBS',
  SET_PROJECT_TEMPLATES: 'SET_PROJECT_TEMPLATES'
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
      name: '',
      flows: [],
      created: '',
      modified: '',
      template: '',
      short_uuid: '',
      description: '',
      package: {
        name: '',
        uuid: '',
        short_uuid: ''
      }
    }
  }
}

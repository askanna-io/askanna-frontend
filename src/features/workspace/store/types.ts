export interface workspaceState extends WorkspaceState {}

export interface WorkspaceState {
  workspace: Workspace
  workspaces: {
    count: number
    results: Workspace[]
  }
  workspaceProjects: {
    count: number
    results: Workspace[]
  }
  workspaceQuery: {
    limit: number
    offset: number
  }
  workspaceProjectsQuery: {
    limit: number
    offset: number
    next: null | string
  }
  workspacesLoading: Boolean
  workspaceProjectsLoading: Boolean
  workspaceSettings: {
    projectView: Number
  }
}

interface Workspace {
  uuid: string
  short_uuid: string
  name: string
  status: number
  created: string
  modified: string
  title: string
  description: string
  activate_date: string
  deactivate_date: string | null
  deleted: null
}

export const WORKSPACE_STORE = 'workspace'

export const action = {
  reset: 'reset',
  setQuery: 'setQuery',
  getWorkspace: 'getWorkspace',
  getWorkspaces: 'getWorkspaces',
  changeSettings: 'changeSettings',
  getWorkpaceProjects: 'getWorkpaceProjects',
  getInitialWorkpaceProjects: 'getInitialWorkpaceProjects'
}

export const mutation = {
  RESET: 'RESET',
  SET_QUERY: 'SET_QUERY',
  SET_LOADING: 'SET_LOADING',
  SET_WORKSPACE: 'SET_WORKSPACE',
  SET_WORKSPACES: 'SET_WORKSPACES',
  UPDATE_PROJECTS: 'UPDATE_PROJECTS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_WORKSPACE_PROJECTS: 'SET_WORKSPACE_PROJECTS'
}

export const stateType = {
  workspacesLoading: 'workspacesLoading',
  workspaceProjectsLoading: 'workspaceProjectsLoading'
}

export class WorkspaceModel {
  private _state: Workspace

  constructor() {
    this._state = WorkspaceModel.initialState()
  }

  get state() {
    return this._state
  }

  static initialState() {
    return {
      uuid: '',
      short_uuid: '',
      name: '',
      status: 1,
      created: '',
      modified: '',
      title: '',
      description: '',
      activate_date: '',
      deactivate_date: '',
      deleted: null
    }
  }
}

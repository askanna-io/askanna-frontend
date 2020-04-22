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
  status: string
  created: string
  modified: string
  title: string
  description: string
}

export const WORKSPACE_STORE = 'workspace'

export const action = {
  getWorkspace: 'getWorkspace',
  getWorkspaces: 'getWorkspaces',
  changeSettings: 'changeSettings',
  getWorkpaceProjects: 'getWorkpaceProjects'
}

export const mutation = {
  SET_LOADING: 'SET_LOADING',
  SET_WORKSPACE: 'SET_WORKSPACE',
  SET_WORKSPACES: 'SET_WORKSPACES',
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
      status: '',
      created: '',
      modified: '',
      title: '',
      description: ''
    }
  }
}
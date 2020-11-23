export interface workspaceState extends WorkspaceState {}

export interface WorkspaceState {
  workspace: Workspace
  workspaces: {
    count: number
    results: Workspace[]
  }
  workspaceProjects: {
    count: number
    next: null | string
    results: Workspace[]
  }
  workspaceQuery: {
    limit: number
    offset: number
  }
  workspacesLoading: Boolean
  workspacePeopleLoading: Boolean
  workspaceProjectsLoading: Boolean
  workspaceSettings: {
    projectView: Number
  }
  workspacePeople: Person[]
  workspacePeopleParams: {
    search: string
    sorting: { sortBy: string; sort: number }
    filter: {
      role: string
      status: string
    }
  }
  invitation: Invitation
}
interface Invitation {
  name: string
  status: string
  email: string
  uuid: string
  short_uuid: string
  object_uuid: string
  workspace: {
    name: string
    short_uuid: string
    uuid: string
  }
  role: string
  job_title: string
  user: { name: string | null; short_uuid: string | null; uuid: string | null }
  front_end_url: string
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

interface Person {
  uuid: string
  short_uuid: string
  name: string
  role: string
  job_title: string
  created: string
  modified: string
  last_active: string
}

export const WORKSPACE_STORE = 'workspace'

export const action = {
  reset: 'reset',
  setQuery: 'setQuery',
  getWorkspace: 'getWorkspace',
  getWorkspaces: 'getWorkspaces',

  changeSettings: 'changeSettings',
  sendInvitations: 'sendInvitations',
  sendInviteEmail: 'sendInviteEmail',
  acceptInvitetion: 'acceptInvitetion',
  getInvitetionInfo: 'getInvitetionInfo',
  setWorkspaceParams: 'setWorkspaceParams',
  getWorkspacePeople: 'getWorkspacePeople',
  getWorkpaceProjects: 'getWorkpaceProjects',
  deleteWorkspacePeople: 'deleteWorkspacePeople',
  getInitialWorkpacePeople: 'getInitialWorkpacePeople',
  getInitialWorkpaceProjects: 'getInitialWorkpaceProjects'
}

export const mutation = {
  RESET: 'RESET',
  SET_QUERY: 'SET_QUERY',
  SET_LOADING: 'SET_LOADING',
  SET_WORKSPACE: 'SET_WORKSPACE',
  SET_INVITATION: 'SET_INVITATION',
  SET_WORKSPACES: 'SET_WORKSPACES',
  UPDATE_PROJECTS: 'UPDATE_PROJECTS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  RESET_INVITATION: 'RESET_INVITATION',
  SET_WORKSPACE_PARAMS: 'SET_WORKSPACE_PARAMS',
  SET_WORKSPACE_PEOPLE: 'SET_WORKSPACE_PEOPLE',
  SET_WORKSPACE_PROJECTS: 'SET_WORKSPACE_PROJECTS',
  DELETE_WORKSPACE_PEOPLE: 'DELETE_WORKSPACE_PEOPLE',
  UPDATE_WORKSPACE_PEOPLE: 'UPDATE_WORKSPACE_PEOPLE',
  SET_WORKSPACE_PEOPLE_INITIAL: 'SET_WORKSPACE_PEOPLE_INITIAL'
}

export const stateType = {
  workspace: 'workspace',
  invitation: 'invitation',
  workspaces: 'workspaces',
  workspacePeople: 'workspacePeople',
  workspaceProjects: 'workspaceProjects',
  workspaceSettings: 'workspaceSettings',
  workspacesLoading: 'workspacesLoading',
  workspacePeopleParams: 'workspacePeopleParams',
  workspacePeopleLoading: 'workspacePeopleLoading',
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
export class InvitationModel {
  private _state: Invitation

  constructor() {
    this._state = InvitationModel.initialState()
  }

  get state() {
    return this._state
  }

  static initialState() {
    return {
      name: '',
      status: '',
      email: '',
      uuid: '',
      short_uuid: '',
      object_uuid: '',
      workspace: { name: '', short_uuid: '', uuid: '' },
      role: '',
      job_title: '',
      user: { name: null, short_uuid: null, uuid: null },
      front_end_url: ''
    }
  }
}

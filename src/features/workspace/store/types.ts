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
  loading: {
    people: Boolean
    projects: Boolean
    workspaces: Boolean
  }
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
  currentPeople: {
    role: string
    name: string
    email: string
    created_at: string
    short_uuid: string
    user: {
      name: string
      uuid: string
      short_uuid: string
    }
    avatar: {
      icon: string
      large: string
      medium: string
      small: string
    }
  }
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
  email: string
  uuid: string
  short_uuid: string
  name: string
  role: string
  job_title: string
  created: string
  modified: string
  last_active: string
  front_end_url: string
  object_type: string
  object_uuid: string
  status: string
  user: {
    name?: string
    short_uuid?: string
    uuid?: string
  }
  workspace: {
    name?: string
    short_uuid?: string
    uuid?: string
  }
}

export const WORKSPACE_STORE = 'workspace'

export const action = {
  reset: 'reset',
  setQuery: 'setQuery',
  setLoading: 'setLoading',
  changeRole: 'changeRole',
  deletePeople: 'deletePeople',
  getWorkspace: 'getWorkspace',
  getWorkspaces: 'getWorkspaces',
  changeSettings: 'changeSettings',
  getPeopleAvatar: 'getPeopleAvatar',
  setPeopleAvatar: 'setPeopleAvatar',
  sendInvitations: 'sendInvitations',
  sendInviteEmail: 'sendInviteEmail',
  deleteInvitation: 'deleteInvitation',
  acceptInvitetion: 'acceptInvitetion',
  getCurrentPeople: 'getCurrentPeople',
  resendInvitation: 'resendInvitation',
  getInvitetionInfo: 'getInvitetionInfo',
  setWorkspaceParams: 'setWorkspaceParams',
  getWorkspacePeople: 'getWorkspacePeople',
  getWorkpaceProjects: 'getWorkpaceProjects',
  deleteWorkspacePeople: 'deleteWorkspacePeople',
  updateWorkspaceProfile: 'updateWorkspaceProfile',
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
  SET_CURRENT_PEOPLE: 'SET_CURRENT_PEOPLE',
  SET_WORKSPACE_PARAMS: 'SET_WORKSPACE_PARAMS',
  SET_WORKSPACE_PEOPLE: 'SET_WORKSPACE_PEOPLE',
  SET_WORKSPACE_PROJECTS: 'SET_WORKSPACE_PROJECTS',
  updateWorkpaceProjects: 'updateWorkpaceProjects',
  DELETE_WORKSPACE_PEOPLE: 'DELETE_WORKSPACE_PEOPLE',
  CHANGE_WORKSPACE_PEOPLE: 'CHANGE_WORKSPACE_PEOPLE',
  UPDATE_WORKSPACE_PEOPLE: 'UPDATE_WORKSPACE_PEOPLE',
  DELETE_WORKSPACE_PROJECT: 'DELETE_WORKSPACE_PROJECT',
  SET_WORKSPACE_PEOPLE_INITIAL: 'SET_WORKSPACE_PEOPLE_INITIAL',
  SET_INITIAL_WORKSPACE_PROJECTS: 'SET_INITIAL_WORKSPACE_PROJECTS'
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

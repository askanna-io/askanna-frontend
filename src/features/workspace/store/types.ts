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
    results: Project[]
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
  currentPeople: Person
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
    uuid: string
    short_uuid: string
  }
  role: string
  job_title: string
  user: { name: string | null; short_uuid: string | null; uuid: string | null }
  front_end_url: string
}
interface Workspace {
  uuid: string
  deleted: null
  name: string
  status: number
  created: string
  modified: string
  short_uuid: string
  is_member: boolean
  description: string
  activate_date: string
  deactivate_date: string | null
  visibility: WorkspaceVisibility
}

enum WorkspaceVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export interface Person {
  uuid: string
  short_uuid: string
  name?: string
  email: string
  use_global_profile?: boolean
  role: {
    name: string
    code: string
  }
  membership: {
    name: string
    status: string
    email: string
    uuid: string
    short_uuid: string
    object_uuid: string
    object_type: string
    workspace: {
      relation: string
      name: string
      uuid: string
      short_uuid: string
    }
    role: string
    job_title: string
    user: {
      relation: string
      name: string
      uuid: string
      short_uuid: string
    }
    avatar: {
      icon: string
      small: string
      medium: string
      large: string
    }
    front_end_url: string
  }
  permission?: {
    'askanna.me': boolean
    'askanna.admin': boolean
    'askanna.member': boolean
    'askanna.workspace.create': boolean
    'workspace.remove': boolean
    'workspace.info.view': boolean
    'workspace.info.edit': boolean
    'workspace.project.list': boolean
    'workspace.project.create': boolean
    'workspace.people.list': boolean
    'workspace.people.invite.create': boolean
    'workspace.people.invite.remove': boolean
    'workspace.people.invite.resend': boolean
    'workspace.people.edit': boolean
    'workspace.people.remove': boolean
    'project.info.view'?: boolean
    'project.info.edit'?: boolean
    'project.remove'?: boolean
    'project.code.list'?: boolean
    'project.code.create'?: boolean
    'project.job.list'?: boolean
    'project.job.create'?: boolean
    'project.job.edit'?: boolean
    'project.job.remove'?: boolean
    'project.variable.list'?: boolean
    'project.variable.create'?: boolean
    'project.variable.edit'?: boolean
    'project.variable.remove'?: boolean
    'project.run.list'?: boolean
    'project.run.create'?: boolean
    'project.run.edit'?: boolean
    'project.run.remove'?: boolean
  }
  avatar: {
    icon: string
    small: string
    medium: string
    large: string
  }
}

interface Project {
  uuid: string
  short_uuid: string
  name: string
  description: null | string
  workspace: {
    relation: string
    name: string
    uuid: string
    short_uuid: string
  }
  package: {
    uuid: string
    short_uuid: string
    name: string
  }
  notifications: {
    all: {
      email: []
    }
    error: {
      email: []
    }
  }
  template: null | string
  created_by: {
    uuid: null | string
    short_uuid: null | string
    name: null | string
  }
  created: string
  modified: string
  url: string
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
  deleteWorkspace: 'deleteWorkspace',
  updateWorkspace: 'updateWorkspace',
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
  getWorkspacePermission: 'getWorkspacePermission',
  updateWorkspaceProfile: 'updateWorkspaceProfile',
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
  SET_WORKSPACE_PERMISSION: 'SET_WORKSPACE_PERMISSION',
  SET_WORKSPACE_PEOPLE_INITIAL: 'SET_WORKSPACE_PEOPLE_INITIAL',
  SET_INITIAL_WORKSPACE_PROJECTS: 'SET_INITIAL_WORKSPACE_PROJECTS',

  ASKANNA_TEST_CHANGE_ROLE: 'ASKANNA_TEST_CHANGE_ROLE'
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

export const getter = {
  isWorkspacePublic: 'isWorkspacePublic',
  currentPeoplePermission: 'currentPeoplePermission'
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
      name: '',
      status: 1,
      created: '',
      modified: '',
      deleted: null,
      short_uuid: '',
      description: '',
      is_member: false,
      activate_date: '',
      deactivate_date: '',
      visibility: WorkspaceVisibility.PUBLIC
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
      uuid: '',
      role: '',
      email: '',
      status: '',
      job_title: '',
      short_uuid: '',
      object_uuid: '',
      front_end_url: '',
      workspace: { name: '', short_uuid: '', uuid: '' },
      user: { name: null, short_uuid: null, uuid: null }
    }
  }
}

export class PersonModel {
  private _state: Person

  constructor() {
    this._state = PersonModel.initialState()
  }

  get state() {
    return this._state
  }

  static initialState() {
    return {
      uuid: '',
      short_uuid: '',
      name: '',
      email: '',
      role: {
        name: '',
        code: ''
      },
      membership: {
        name: '',
        status: '',
        email: '',
        uuid: '',
        short_uuid: '',
        object_uuid: '',
        object_type: '',
        workspace: {
          relation: '',
          name: '',
          uuid: '',
          short_uuid: ''
        },
        role: '',
        job_title: '',
        user: {
          relation: '',
          name: '',
          uuid: '',
          short_uuid: ''
        },
        avatar: {
          icon: '',
          small: '',
          medium: '',
          large: ''
        },
        front_end_url: ''
      },
      permission: undefined,
      avatar: {
        icon: '',
        small: '',
        medium: '',
        large: ''
      }
    }
  }
}

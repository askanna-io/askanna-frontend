export interface userState extends UserState {}

export interface UserState {
  accounts: any[]
  userProfile: {
    name: string
    email: string
    password?: string | undefined | null
    short_uuid?: string
    old_password?: string
  }
  globalProfile: GlobalProfile
  tempAuth: {
    username: string
    password: string
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

interface GlobalProfile {
  uuid: string
  short_uuid: string
  name: string
  email: string
  job_title: string
  role: {
    name: string
    code: string
  }
  membership: null
  permission?: {
    'askanna.me': boolean
    'askanna.admin': boolean
    'askanna.member': boolean
    'askanna.workspace.create': boolean
  }
  avatar: {
    icon: string
    small: string
    medium: string
    large: string
  }
}

export const USER_STORE = 'user'

export const action = {
  getAccounts: 'getAccounts',
  updateProfile: 'updateProfile',
  getUserProfile: 'getUserProfile',
  getGlobalProfile: 'getGlobalProfile',
  updateGlobalAvatar: 'updateGlobalAvatar',
  updateGlobalProfile: 'updateGlobalProfile'
}

export const mutation = {
  SET_ACCOUNTS: 'SET_ACCOUNTS',
  SET_TEMP_AUTH: 'SET_TEMP_AUTH',
  DELETE_PASSWORD: 'DELETE_PASSWORD',
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  DELETE_TEMP_AUTH: 'DELETE_TEMP_AUTH',
  SET_GLOBAL_PROFILE: 'SET_GLOBAL_PROFILE'
}

export const getter = {
  globalPermission: 'globalPermission'
}

export const stateType = {
  workspace: 'workspace',
  invitation: 'invitation'
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

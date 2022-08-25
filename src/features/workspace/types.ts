export interface workspaceState extends WorkspaceState {}

export interface WorkspaceState {
  workspace: Workspace
  workspaces: {
    count: number
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
  people: Person[]
  peopleParams: {
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

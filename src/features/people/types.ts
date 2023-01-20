interface Invitation {
  name: string
  status: string
  email: string
  suuid: string
  object_uuid: string
  workspace: {
    name: string
    suuid: string
  }
  role: string
  job_title: string
  user: { name: string | null; suuid: string | null }
  front_end_url: string
}

export interface Person {
  suuid: string
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
    suuid: string
    object_uuid: string
    object_type: string
    workspace: {
      relation: string
      name: string
      suuid: string
    }
    role: string
    job_title: string
    user: {
      relation: string
      name: string
      suuid: string
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
    'workspace.create': boolean
    'workspace.remove': boolean
    'workspace.info.view': boolean
    'workspace.info.edit': boolean
    'workspace.people.list': boolean
    'workspace.people.invite.create': boolean
    'workspace.people.invite.remove': boolean
    'workspace.people.invite.resend': boolean
    'workspace.people.edit': boolean
    'workspace.people.remove': boolean
    'project.list': boolean
    'project.create': boolean
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

export const PEOPLE_STORE = 'people'

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
      suuid: '',
      role: '',
      email: '',
      status: '',
      job_title: '',
      object_uuid: '',
      front_end_url: '',
      workspace: { name: '', suuid: '' },
      user: { name: null, suuid: null }
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
      suuid: '',
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
        suuid: '',
        object_uuid: '',
        object_type: '',
        workspace: {
          relation: '',
          name: '',
          suuid: ''
        },
        role: '',
        job_title: '',
        user: {
          relation: '',
          name: '',
          suuid: ''
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
      },
      use_global_profile: false
    }
  }
}

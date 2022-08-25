export interface runIdState extends jobRubData {}

export interface jobRubData {
  runs: { count: number; results: Run[]; next: null | string }
  openRunResult: boolean
  run: Run
  runLoading: boolean
  runIdsLoading: boolean
  runlogLoading: boolean
  runArtifactLoading: boolean
  runIdlogScrollLoading: boolean
  runLog: {
    count: number
    next: null | string
    results: any[]
  }
  runLogFullVersion: any[]
  artifactData?: Package
}

export interface Package {
  uuid: string
  cdn_base_url: string
  filename: string
  storage_location: string
  project: string
  size: number
  created_by: number
  created_at: string
  files: File[]
}

export interface Run {
  name: string
  uuid: string
  duration: number | null
  description: string
  short_uuid: string
  payload: {
    duration: number
    short_uuid: string
    size: number | string
  }
  status: string
  runtime: number
  memory: number
  return_payload: string
  stdout: any[]
  created: string
  finished: string
  version: {
    name: string
    uuid: string
  }
  package: {
    name: string
    uuid: string
    short_uuid: string
  }
  runner: {
    cpu_cores: number
    cpu_time: number
    job_status: number
    memory_mib: number
    name: string
    uuid: string
  }
  created_by: {
    name: string
  }
  trigger: {
    name: string
  }
  result: {
    extension: string
    lines: number
    mimetype: string
    name: string
    size: number
  }
  environment: {
    description?: string
    image: {
      digest: string
      name: string
      tag: string
    }
    name: string
    label?: string
    timezone: string
  }
}

export const JOB_RUN_STORE = 'run'

// actions
export const action = {
  getRun: 'getRun',
  setLoading: 'setLoading',
  resetStore: 'resetStore',
  getRunsJob: 'getRunsJob',
  udapteRun: 'udapteRun',
  getRunLog: 'getRunLog',
  deleteRunInfo: 'deleteRunInfo',
  resetRunLog: 'resetRunLog',
  downloadPackage: 'downloadPackage',
  getTargetPackage: 'getTargetPackage',
  getInitRunLog: 'getInitRunLog',
  showRunResult: 'showRunResult',
  closeResultModal: 'closeResultModal',
  getRunArtifact: 'getRunArtifact',
  getFullVersionRunLog: 'getFullVersionRunLog',
  getInitialRunArtifact: 'getInitialRunArtifact'
}

// mutations
export const mutation = {
  SET_LOADING: 'SET_LOADING',
  SET_RESULT_MODAL: 'SET_RESULT_MODAL',
  RESET_JOB_RUN_LOG: 'RESET_JOB_RUN_LOG',
  CLOSE_RESULT_MODAL: 'CLOSE_RESULT_MODAL',
  UPDATE_JOB_RUN_STORE: 'UPDATE_JOB_RUN_STORE'
}

//mutations
export const SET_JOB_RUN = 'SET_JOB_RUN'
export const SET_JOB_RUNS = 'SET_JOB_RUNS'
export const SET_JOB_RUN_LOG = 'SET_JOB_RUN_LOG'
export const UPDATE_JOB_RESULT = 'UPDATE_JOB_RESULT'
export const SET_JOB_RUN_RESULT = 'SET_JOB_RUN_RESULT'
export const SET_JOB_RUN_ARTIFACT = 'SET_JOB_RUN_ARTIFACT'
export const SET_JOB_RUN_RESULT_PREVIEW = 'SET_JOB_RUN_RESULT_PREVIEW'
export const SET_JOB_RUN_LOG_FULL_VERSION = 'SET_JOB_RUN_LOG_FULL_VERSION'

export const stateType = {
  runs: 'runs',
  run: 'run',
  runLog: 'runLog',
  logLoading: 'logLoading',
  artifactData: 'artifactData',
  runIdPayload: 'runIdPayload',
  runLoading: 'runLoading',
  runIdsLoading: 'runIdsLoading',
  runlogLoading: 'runlogLoading',
  runLogFullVersion: 'runLogFullVersion',
  runArtifactLoading: 'runArtifactLoading',
  runIdlogScrollLoading: 'runIdlogScrollLoading'
}

export class RunModel {
  private _state: Run

  constructor() {
    this._state = RunModel.initialState()
  }

  get state() {
    return this._state
  }

  static initialState() {
    return {
      uuid: '',
      name: '',
      duration: null,
      description: '',
      short_uuid: '',
      payload: {
        duration: 0,
        short_uuid: ''
      },
      status: '',
      runtime: 0,
      memory: 0,
      return_payload: '',
      stdout: [],
      created: '',
      finished: '',
      version: {
        name: '',
        uuid: ''
      },
      package: {
        name: '',
        uuid: '',
        short_uuid: ''
      },
      artifact: {
        name: '',
        uuid: '',
        short_uuid: ''
      },
      runner: {
        cpu_cores: 0,
        cpu_time: 0,
        job_status: 0,
        memory_mib: 0,
        name: '',
        uuid: ''
      },
      created_by: {
        name: ''
      },
      trigger: {
        name: ''
      },
      variables_meta: { count: 0, size: 0, label_names: [], keys: [], variable_names: [] },
      count: 0,
      keys: [],
      labels: [],
      size: 0,
      result: {
        size: 0,
        lines: 0,
        mimetype: '',
        extension: '',
        name: ''
      },
      environment: {
        name: '',
        label: '',
        timezone: '',
        description: '',
        image: { name: '', tag: '', digest: '' }
      }
    }
  }
}

export interface File {
  path: string
  parent: string
  file: 'file' | 'directory'
  size: number
  last_modified: string
  name: string
  type: string
  ext: string
}
export class ArtifactModel {
  private _state: Package

  constructor() {
    this._state = ArtifactModel.initialState()
  }

  get state() {
    return this._state
  }

  static initialState() {
    return {
      uuid: '',
      filename: '',
      cdn_base_url: '',
      storage_location: '',
      project: '',
      size: 0,
      created_by: 0,
      created_at: '',
      files: []
    }
  }
}

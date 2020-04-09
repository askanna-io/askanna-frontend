export interface jobRunState extends jobRubData {}

export interface jobRubData {
  runs: JobRun[]
  openJobRunResult: boolean
  jobRun: JobRun
  jobRunPayload: string
  payLoadLoading: Boolean
}

export interface JobRun {
  uuid: string
  payload: {
    duration: number
  }
  status: string
  runtime: number
  memory: number
  return_payload: string
  stdout: any
  created: string
  finished: string
  version: {
    name: string
    uuid: string
  }
  runner: {
    name: string
  }
  owner: {
    name: string
  }
  trigger: {
    name: string
  }
}

export const JOB_RUN_STORE = 'jobrun'

// actions
export const action = {
  getJobRun: 'getJobRun',
  resetStore: 'resetStore',
  getRunsJob: 'getRunsJob',
  getJobRunPayload: 'getJobRunPayload',
  showJobRunResult: 'showJobRunResult',
  closeResultModal: 'closeResultModal'
}

// mutations
export const mutation = {
  SET_LOADING: 'SET_LOADING',
  SET_RESULT_MODAL: 'SET_RESULT_MODAL',
  CLOSE_RESULT_MODAL: 'CLOSE_RESULT_MODAL',
  UPDATE_JOB_RUN_STORE: 'UPDATE_JOB_RUN_STORE'
}

//mutations
export const SET_JOB_RUN = 'SET_JOB_RUN'
export const SET_JOB_RUNS = 'SET_JOB_RUNS'
export const UPDATE_JOB_RESULT = 'UPDATE_JOB_RESULT'
export const SET_JOB_RUN_PAYLOAD = 'SET_JOB_RUN_PAYLOAD'

export const stateType = {
  payLoadLoading: 'payLoadLoading'
}

export class JobRunModel {
  private _state: JobRun

  constructor() {
    this._state = JobRunModel.initialState()
  }

  get state() {
    return this._state
  }

  static initialState() {
    return {
      uuid: '',
      payload: {
        duration: 0
      },
      status: '',
      runtime: 0,
      memory: 0,
      return_payload: '',
      stdout: '',
      created: '',
      finished: '',
      version: {
        name: '',
        uuid: ''
      },
      runner: {
        name: ''
      },
      owner: {
        name: ''
      },
      trigger: {
        name: ''
      }
    }
  }
}

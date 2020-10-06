export interface jobState extends jobData {}

export interface jobData {
  job: Job
  result: string
  jobrun: JobRun
}

interface JobRun {
  created: string
  message_type: string
  next_url: string
  run_uuid: string
  jobrun_uuid: string
  status: string
  updated: string
}

interface Job {
  uuid: string
  name: string
  title: string
  status: string
  created: string
  modified: string
  short_uuid: string
  description: string
}

export const JOB_STORE = 'job'

// actions
export const action = {
  addJob: 'addJob',
  getJob: 'getJob',
  stopJob: 'stopJob',
  killJob: 'killJob',
  pauseJob: 'pauseJob',
  resetJob: 'resetJob',
  startJob: 'startJob',
  updateJob: 'updateJob',
  getJobRun: 'getJobRun',
  removeJob: 'removeJob',
  resultJob: 'resultJob',
  changeJob: 'changeJob',
  resetStore: 'resetStore',
  getJobInfo: 'getJobInfo',
  resetJobRun: 'resetJobRun',
  getJobRunStatus: 'getJobRunStatus'
}

// mutations
export const mutation = {
  CHANGE_JOB: 'CHANGE_JOB',
  SET_JOB_RUN: 'SET_JOB_RUN',
  RESET_JOB_RUN: 'RESET_JOB_RUN',
  RESET_JOB_STORE: 'RESET_JOB_STORE',
  SET_RESULT_MODAL: 'SET_RESULT_MODAL',
  UPDATE_JOB_RESULT: 'UPDATE_JOB_RESULT',
  CLOSE_RESULT_MODAL: 'CLOSE_RESULT_MODAL'
}

export const getJob = 'getJob'
export const killJob = 'killJob'
export const startJob = 'startJob'
export const pauseJob = 'pauseJob'
export const resetJob = 'resetJob'

export const addJob = 'addJob'
export const updateJob = 'updateJob'
export const removeJob = 'removeJob'
export const getJobInfo = 'getJobInfo'

//mutations
export const SET_JOB = 'SET_JOB'
export const UPDATE_JOB = 'UPDATE_JOB'

export class JobModel {
  private _state: Job

  constructor() {
    this._state = JobModel.initialState()
  }

  get state() {
    return this._state
  }

  static initialState() {
    return {
      uuid: '',
      name: '',
      title: '',
      status: '',
      created: '',
      modified: '',
      short_uuid: '',
      description: ''
    }
  }
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
      created: '',
      message_type: '',
      next_url: '',
      run_uuid: '',
      jobrun_uuid: '',
      status: '',
      updated: ''
    }
  }
}

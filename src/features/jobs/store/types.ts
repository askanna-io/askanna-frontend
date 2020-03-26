export interface JobsState extends jobsData {}

export interface jobsData {
  list: JobItem[]
}

export interface JobItem {
  id: number
  uuid: string
  name: string
  status: {
    name: string
    project: string | null
    function: string
    backend: string
    created: string
    payload: any
    lastrun: {
      status: string
      runtime: number
      memory: number
      return_payload: string
      stdout: null
      created: string
      finished: string
    }
  }
}

export const JOBS_STORE = 'jobs'

// actions
export const getJobsList = 'getJobsList'
export const getProjecJobs = 'getProjecJobs'

//mutations
export const SET_JOBS_LIST = 'SET_JOBS_LIST'
export const UDPDATE_LIST = 'UDPDATE_LIST'

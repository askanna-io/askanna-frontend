export interface JobsState extends jobsData {}

export interface jobsData {
  list: any[]
}

export const JOBS_STORE = 'jobs'

// actions
export const getJobsList = 'getJobsList'

//mutations
export const SET_JOBS_LIST = 'SET_JOBS_LIST'

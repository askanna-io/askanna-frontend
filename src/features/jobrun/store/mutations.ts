import { MutationTree } from 'vuex'
import { File, JobRunModel, jobRunState, ArtifactModel } from './types'
import * as type from './types'
import { isArray, set } from 'lodash'

export const mutations: MutationTree<jobRunState> = {
  [type.SET_JOB_RUN](state, data) {
    state.jobRun = data
  },

  [type.SET_JOB_RUNS](state, data) {
    if (isArray(data)) {
      state.runs = {
        next: null,
        results: data,
        count: data.length
      }
      return
    }
    state.runs = data
  },

  [type.mutation.CLOSE_RESULT_MODAL](state) {
    state.openJobRunResult = false
  },

  [type.mutation.SET_RESULT_MODAL](state) {
    state.openJobRunResult = true
  },

  [type.SET_JOB_RUN_PAYLOAD](state, data) {
    state.jobRunPayload = data
  },

  [type.mutation.UPDATE_JOB_RUN_STORE](state) {
    state.runs = {
      count: 0,
      next: null,
      results: []
    }
    state.jobRunLoading = true
    state.payLoadLoading = true
    state.jobRunPayload = undefined

    state.jobRun = new JobRunModel().state

    state.jobRunLog = {
      count: 0,
      next: null,
      results: []
    }
    state.jobRunLogFullVersion = []
    state.artifactData = new ArtifactModel().state
  },

  [type.mutation.SET_LOADING](state, { name, value }) {
    set(state, name, value)
  },

  [type.SET_JOB_RUN_LOG](state, { count, next, results: list }) {
    state.jobRunLog = {
      next,
      count,
      results: [...state.jobRunLog.results, ...list]
    }
  },

  [type.SET_JOB_RUN_LOG_FULL_VERSION](state, data) {
    state.jobRunLogFullVersion = data
  },

  [type.mutation.RESET_JOB_RUN_LOG](state) {
    state.jobRunLog = {
      next: '',
      count: 0,
      results: []
    }
  },

  [type.SET_JOB_RUN_ARTIFACT](state, { artifactData: data }) {
    const re = /(?:\.([^.]+))?$/
    const files = data.files.map((file: File) => {
      const fileExt = re.exec(file.name)
      const ext = (!file.is_dir && fileExt && typeof fileExt[1] !== 'undefined' && fileExt[1]) || 'txt'

      return { ...file, ext }
    })

    state.artifactData = { ...data, files }
  }
}

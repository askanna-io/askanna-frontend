import { isArray } from 'lodash'
import { defineStore } from 'pinia'
import { Run } from '@/features/run/types'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

const SERVICE_NAME = 'run'

const api = apiStringify(SERVICE_NAME)

export const useRunsStore = defineStore('runs', {
  state: () => {
    return {
      runs: { next: '', previous: '', count: 0, results: [] },
      runsLoading: true
    }
  },

  actions: {
    async getRuns({ loading, params, initial, suuid, suuidKey = 'job_suuid' } = { loading: true, params: {}, initial: false, suuid: '', suuidKey: 'job_suuid' }) {
      if (loading) this.runsLoading = true

      let runs: Run[]

      try {
        runs = await apiService({
          action: api.list,
          serviceName: SERVICE_NAME,
          params: { ...params, [suuidKey]: suuid }
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on runs  in getRuns action.\nError: ', e)
        this.runsLoading = false

        return
      }

      this.runsLoading = false

      if (isArray(runs)) {
        this.runs = {
          next: null,
          results: runs,
          count: runs.length
        }
        return
      }

      this.runs = initial ? runs : { ...runs, results: [...this.runs.results, ...runs.results] }
    }
  }
})

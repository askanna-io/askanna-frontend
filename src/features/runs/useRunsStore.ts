import { isArray } from 'lodash'
import { defineStore } from 'pinia'
import apiService from '@/core/services/apiService'
import { JobRun } from '@/features/jobrun/store/types'
import { useLogger } from '@/core/composition/useLogger'
import { apiStringify } from '@/core/services/api-settings'

const SERVICE_NAME = 'jobrun'
const api = apiStringify(SERVICE_NAME)

export const useRunsStore = defineStore('runs', {
  state: () => {
    return {
      runs: { next: '', count: 0, results: [] },
      runsLoading: true
    }
  },

  actions: {
    async getRuns({ uuid, params }) {
      this.runsLoading = true

      let runs: JobRun[]
      try {
        runs = await apiService({
          uuid,
          params,
          action: api.runs,
          serviceName: SERVICE_NAME
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

      this.runs = runs
    }
  }
})

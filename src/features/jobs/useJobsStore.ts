import { map } from 'lodash'
import { defineStore } from 'pinia'
import apiService from '@/core/services/apiService'
import { useLogger } from '@/core/composition/useLogger'
import { apiStringify } from '@/core/services/api-settings'

const SERVICE_NAME = 'jobs'
const api = apiStringify(SERVICE_NAME)

export const useJobsStore = defineStore(SERVICE_NAME, {
  state: () => {
    return {
      jobs: [],
      loading: true
    }
  },

  actions: {
    async getProjectJobs(uuid: string) {
      this.loading = true

      let jobs
      try {
        jobs = await apiService({
          uuid,
          action: api.jobs,
          serviceName: SERVICE_NAME
        })
      } catch (error) {
        const logger = useLogger()

        this.loading = false

        logger.error('Error on load project jobs in getProjectJobs action.\nError: ', error)

        return
      }

      await Promise.all(
        map(jobs, async (job: any) => {
          const runs = await apiService({
            uuid: job.short_uuid,
            action: api.getLastJobRun,
            serviceName: SERVICE_NAME,
            params: {
              limit: 1,
              offset: 0
            }
          })
          const run =
            runs && runs.results.length
              ? runs.results[0]
              : { status: 'NOT_RUNS', created: '', started: '', finished: '', updated: '' }
          job.runs = {
            count: runs.count,
            status: {
              status: run.status,
              created: run.created,
              started: run.started,
              finished: run.finished,
              updated: run.modified
            }
          }

          return job
        })
      )

      this.jobs = jobs
      this.loading = false
    }
  }
})

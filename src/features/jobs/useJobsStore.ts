import { map } from 'lodash'
import { defineStore } from 'pinia'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

const SERVICE_NAME = 'job'
const api = apiStringify(SERVICE_NAME)

export const useJobsStore = defineStore('jobs', {
  state: () => {
    return {
      jobs: { next: '', previous: '', count: 0, results: [] },
      loading: true
    }
  },

  actions: {
    async getProjectJobs({ loading, params, initial, suuid } = { loading: true, params: {}, initial: false, suuid: '' }) {
      if (loading) this.loading = true

      let jobs
      try {
        jobs = await apiService({
          action: api.list,
          serviceName: SERVICE_NAME,
          params: { ...params, project_suuid: suuid }
        })
      } catch (error) {
        const logger = useLogger()

        this.loading = false

        logger.error('Error on load project jobs in getProjectJobs action.\nError: ', error)

        return
      }

      await Promise.all(
        map(jobs.results, async (job: any) => {
          const runs = await apiService({
            serviceName: 'run',
            action: api.list,
            params: { job_suuid: job.suuid, page_size: 1 }
          })

          const run = runs && runs.results.length ? runs.results[0] : { status: 'not_runs', created_at: '', started_at: '', finished_at: '', modified_at: '' }
          job.runs = {
            suuid: run.suuid,
            count: runs.count,
            status: {
              status: run.status,
              created_at: run.created_at,
              started_at: run.started_at,
              finished_at: run.finished_at,
              modified_at: run.modified_at
            }
          }

          return job
        })
      )

      this.jobs = initial ? jobs : { ...jobs, results: [...this.jobs.results, ...jobs.results] }

      this.loading = false
    }
  }
})

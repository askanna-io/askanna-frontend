import { defineStore } from 'pinia'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

interface Schedule {
  last_run_at: string
  next_run_at: string
  raw_definition: string
}
interface Job {
  name: string
  title: string
  status: string
  created_at: string
  timezone: string
  modified_at: string
  suuid: string
  environment: string
  description: string
  schedules?: Schedule[]
  notifications: {
    info: { email: string[] }
    error: { email: string[] }
  }
}

const SERVICE_NAME = 'job'
const api = apiStringify(SERVICE_NAME)

export const useJobStore = defineStore(SERVICE_NAME, {
  state: () => {
    return {
      job: {} as Job,
      loading: true
    }
  },

  actions: {
    async getJob(suuid: string) {
      this.loading = true

      let job
      try {
        job = await apiService({
          suuid,
          action: api.get,
          serviceName: SERVICE_NAME
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load job in getJob action.\nError: ', error)

        this.$routerAskAnna.routerPush({ name: 'workspace-project-job-does-not-exist' })

        return
      }
      this.job = job
      this.loading = false

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ jobId: job.name })
    },

    async updateJob(data) {
      const logger = useLogger()

      let updatedJob
      try {
        updatedJob = await apiService({
          data,
          method: 'PATCH',
          action: api.update,
          serviceName: SERVICE_NAME,
          suuid: this.job.suuid
        })
      } catch (e) {
        logger.error('Error on update job in updateJob action.\nError: ', e)

        return false
      }

      logger.success('Job was updated')

      this.job = Object.assign({}, this.job, updatedJob)

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ jobId: updatedJob.name })

      return true
    },

    async deleteJob({ suuid: suuid, name }) {
      const logger = useLogger()

      try {
        await apiService({
          suuid,
          action: api.delete,
          method: 'delete',
          serviceName: SERVICE_NAME
        })
        logger.success(`You have successfully deleted the job ${name}`)

        return true
      } catch (error) {
        logger.error('Error on delete job in deleteJob action.\nError: ', error)
      }
    }
  }
})

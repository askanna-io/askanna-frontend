import { defineStore } from 'pinia'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

interface Schedule {
  last_run: string
  next_run: string
  raw_definition: string
}
interface Job {
  uuid: string
  name: string
  title: string
  status: string
  created: string
  timezone: string
  modified: string
  short_uuid: string
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
    async getJob(uuid: string) {
      this.loading = true

      let job
      try {
        job = await apiService({
          uuid,
          action: api.get,
          serviceName: SERVICE_NAME
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load job in getJob action.\nError: ', error)

        this.$routerAskAnna.push({ name: 'workspace-project-job-does-not-exist' })

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
          method: 'put',
          action: api.update,
          serviceName: SERVICE_NAME,
          uuid: this.job.short_uuid
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

    async deleteJob({ short_uuid: uuid, name }) {
      const logger = useLogger()

      try {
        await apiService({
          uuid,
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

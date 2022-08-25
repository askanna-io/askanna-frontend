import VueRouter from 'vue-router'
import { defineStore } from 'pinia'
import { useRouter } from '@/core/plugins/vue-hooks'
import apiService from '@/core/services/apiService'
import { useLogger } from '@/core/composition/useLogger'
import { apiStringify } from '@/core/services/api-settings'
import { useGeneralStore } from '@/core/store/useGeneralStore'

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

interface Run {
  uuid: string
  status: string
  updated: string
  created: string
  finished: string
  next_url: string
  short_uuid: string
  message_type: string
  environment: {
    name: string
    label: string
    timezone: string
    description: string
    image: { name: string; tag: string; digest: string }
  }
}

const SERVICE_NAME = 'job'
const { router } = useRouter()
const api = apiStringify(SERVICE_NAME)
const { isNavigationFailure, NavigationFailureType } = VueRouter

export const useJobStore = defineStore(SERVICE_NAME, {
  state: () => {
    return {
      job: {} as Job,
      loading: true,
      run: {} as Run,
      runStatusLoading: true
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

        router.push({ name: 'workspace-project-job-does-not-exist' }).catch(failure => {
          if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
            logger.error('Error on redirect to workspace-project-job-does-not-exist.\nError: ', failure)
          }
        })

        return
      }
      this.job = job
      this.loading = false

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ jobId: job.name })
    },

    async startJob({ code, ...params }) {
      const logger = useLogger()

      let run
      try {
        run = await apiService({
          action: api.start,
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          params,
          data: code,
          serviceName: SERVICE_NAME,
          uuid: this.job.short_uuid
        })
      } catch (e) {
        logger.error('Error on start job in startJob action.\nError: ', e)
        return
      }
      logger.success('Job was started')

      this.run = run
    },

    async getRunStatus(runIdShortUuid: string) {
      this.runStatusLoading = true

      let status
      try {
        status = await apiService({
          action: api.jobrunStatus,
          serviceName: SERVICE_NAME,
          uuid: runIdShortUuid || this.run.short_uuid
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on getjob run status in getRunStatus action.\nError: ', e)

        return
      }

      this.run = { ...this.run, ...status }

      this.runStatusLoading = false
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

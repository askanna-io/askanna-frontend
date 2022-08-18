import { defineStore } from 'pinia'

interface BreadcrumbParams {
  jobId?: string
  jobRunId?: string
  projectId?: string
  workspaceId?: string
}

export const useGeneralStore = defineStore('general', {
  state: () => {
    return {
      projectId: '',
      breadcrumbParams: {
        jobId: '',
        jobRunId: '',
        projectId: '',
        workspaceId: ''
      },
      interval: new Map()
    }
  },
  actions: {
    async setBreadcrumbParams(data: BreadcrumbParams) {
      this.breadcrumbParams = { ...this.breadcrumbParams, ...data }
    },

    async setInterval({ key, handler }: { key: string; handler: TimerHandler }) {
      this.interval.set(key, setInterval(handler, 5000))
    },

    async clearInterval(key: string) {
      const id = this.interval.get(key)
      clearInterval(id)

      this.interval.delete(key)
    }
  }
})

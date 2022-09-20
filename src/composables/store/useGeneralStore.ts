import { defineStore } from 'pinia'

export type IntervalMap = Record<string, Number>

interface BreadcrumbParams {
  jobId?: string
  runId?: string
  projectId?: string
  workspaceId?: string
}

export interface GeneralState {
  projectId: string
  breadcrumbParams: {
    jobId: string
    jobRunId: string
    projectId: string
    workspaceId: string
  }
  interval: any
}

const GENERAL_STORE = 'general'

export const useGeneralStore = defineStore(GENERAL_STORE, {
  state: () => {
    return {
      projectId: '',
      breadcrumbParams: {
        jobId: '',
        runId: '',
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

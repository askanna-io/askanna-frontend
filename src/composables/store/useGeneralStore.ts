import { defineStore } from 'pinia'

export type IntervalMap = Record<string, Number>

interface BreadcrumbParams {
  jobName?: string
  runName?: string
  projectName?: string
  workspaceName?: string
}

export interface GeneralState {
  projectId: string
  breadcrumbParams: {
    jobName: string
    runName: string
    projectName: string
    workspaceName: string
  }
  interval: any,
  routeNotExist: boolean
}

const GENERAL_STORE = 'general'

export const useGeneralStore = defineStore(GENERAL_STORE, {
  state: () => {
    return {
      projectId: '',
      breadcrumbParams: {
        jobName: '',
        runName: '',
        projectName: '',
        workspaceName: ''
      },
      interval: new Map(),
      routeNotExist: false
    }
  },

  actions: {
    async setRouteNotExist() {
      if (!this.routeNotExist) {
        this.routeNotExist = true
      }
    },
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

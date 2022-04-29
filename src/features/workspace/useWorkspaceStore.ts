import { defineStore } from 'pinia'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'

export enum WorkspaceVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

interface Workspace {
  name: string
  description?: string
  visibility: WorkspaceVisibility
}

const serviceName = 'workspace'
const api = apiStringify(serviceName)

export const useWorkspaceStore = defineStore('workspace', {
  state: () => {
    return {
      loading: true,
      workspace: {
        name: '',
        description: '',
        visibility: WorkspaceVisibility.PRIVATE
      }
    }
  },
  getters: {},

  actions: {
    async createWorkspace(data: Workspace) {
      this.loading = true
      let workspace
      try {
        workspace = await apiService({
          data,
          serviceName,
          method: 'post',
          action: api.create
        })
      } catch (error) {
        return
      }

      this.loading = false

      return workspace
    }
  }
})

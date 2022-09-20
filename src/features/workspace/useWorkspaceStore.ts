import router from '@/router'
import VueRouter from 'vue-router'
import { defineStore } from 'pinia'
import { WORKSPACE_STORE } from './types'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

const { isNavigationFailure, NavigationFailureType } = VueRouter

export enum WorkspaceVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

interface Workspace {
  name: string
  description?: string
  visibility: WorkspaceVisibility
}

const serviceName = WORKSPACE_STORE
const api = apiStringify(WORKSPACE_STORE)

export const useWorkspaceStore = defineStore(WORKSPACE_STORE, {
  state: () => {
    return {
      loading: true,
      workspace: {
        name: '',
        uuid: '',
        short_uuid: '',
        description: '',
        is_member: false,
        visibility: WorkspaceVisibility.PRIVATE
      },
      workspaceSettings: {
        projectView: 0
      }
    }
  },
  getters: {
    isWorkspacePublic: state => state.workspace.visibility === 'PUBLIC'
  },

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
    },

    async getWorkspace(uuid) {
      let workspace
      try {
        workspace = await apiService({
          action: api.get,
          serviceName,
          uuid
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load workspace in getWorkspace action.\nError: ', error)

        this.$routerAskAnna.push({ name: 'workspace-does-not-exist' })

        return
      }

      this.workspace = workspace

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ workspaceId: workspace.name })
    },

    async updateWorkspace(data) {
      const logger = useLogger()

      let workspace
      try {
        workspace = await apiService({
          data,
          serviceName,
          method: 'put',
          action: api.get,
          uuid: this.workspace.short_uuid
        })
      } catch (error) {
        logger.error('Error on update workspace in getWorkspace action.\nError: ', error)

        return workspace
      }

      this.workspace = workspace

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ workspaceId: workspace.name })

      return workspace
    },

    async deleteWorkspace(workspace) {
      const logger = useLogger()

      try {
        await apiService({
          serviceName,
          method: 'delete',
          action: api.delete,
          uuid: workspace.short_uuid
        })

        logger.success(`You have successfully deleted the workspace ${workspace.name}`)

        return true
      } catch (error) {
        logger.error('Error on delete workspace in deleteWorkspace action.\nError: ', error)

        return
      }
    }
  }
})

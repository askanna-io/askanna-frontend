import { defineStore } from 'pinia'
import { WORKSPACE_STORE } from './types'
import apiService from '@/services/apiService'
import { CreatedBy } from '@/features/run/types'
import { apiStringify } from '@/services/api-settings'

export enum WorkspaceVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export const defaultWorkspace = {
  name: '',
  suuid: '',
  description: '',
  is_member: false,
  created_by: {} as CreatedBy,
  visibility: WorkspaceVisibility.PRIVATE
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
        suuid: '',
        description: '',
        is_member: false,
        created_at: '',
        visibility: WorkspaceVisibility.PRIVATE,
        created_by: {} as CreatedBy
      },
      newWorkspace: { ...defaultWorkspace }
    }
  },

  getters: {
    isWorkspacePublic: (state) => state.workspace.visibility === 'PUBLIC'
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

    async getWorkspace(suuid) {
      let workspace
      try {
        workspace = await apiService({
          suuid,
          serviceName,
          action: api.get
        })
      } catch (error) {
        const logger = useLogger()
        const generalStore = useGeneralStore()

        logger.error('Error on load workspace in getWorkspace action.\nError: ', error)

        await generalStore.setRouteNotExist()

        return
      }

      this.workspace = workspace
      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ workspaceName: workspace.name })

      const peopleStore = usePeopleStore()
      peopleStore.setCurretPeoplePermission(workspace.permission)
    },

    async updateWorkspace(data) {
      const logger = useLogger()

      let workspace
      try {
        workspace = await apiService({
          data,
          serviceName,
          method: 'PATCH',
          action: api.get,
          suuid: this.workspace.suuid
        })
      } catch (error) {
        logger.error('Error on update workspace in getWorkspace action.\nError: ', error)

        return workspace
      }

      this.workspace = workspace

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ workspaceName: workspace.name })

      return workspace
    },

    async deleteWorkspace(workspace) {
      const logger = useLogger()

      try {
        await apiService({
          serviceName,
          method: 'delete',
          action: api.delete,
          suuid: workspace.suuid
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

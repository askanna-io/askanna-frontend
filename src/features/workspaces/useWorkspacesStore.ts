import { defineStore } from 'pinia'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'
import useSortFilterHelper from '@/core/composition/useSortFilterHelper'

const serviceName = 'workspace'
const api = apiStringify(serviceName)
const sortFilterHelper = useSortFilterHelper()

export const useWorkspacesStore = defineStore('workspaces', {
  state: () => {
    return {
      loading: true,
      loadingAll: true,
      query: {
        limit: 1000,
        offset: 0
      },
      workspaces: {
        count: 0,
        next: '',
        previous: '',
        results: []
      },
      allWorkspaces: {
        count: 0,
        next: '',
        previous: '',
        results: []
      }
    }
  },
  getters: {
    getWorkspacesByParams: state => {
      return ({ sort = 'desc', sortby = 'created', is_member, searchtext, visibility }) => {
        sortFilterHelper.results = [...state.allWorkspaces.results]

        return sortFilterHelper
          .filterByVisibility(visibility)
          .filterByMember(is_member)
          .filterBySearchtext(searchtext)
          .sorting({ sort, sortby })
      }
    }
  },

  actions: {
    async getMemberWorkspaces() {
      this.loading = true
      try {
        this.workspaces = await apiService({
          serviceName,
          action: api.list,
          params: { ...this.query, membership: true }
        })
      } catch (error) {
        return
      }

      this.loading = false
      return this.workspaces
    },

    async getAllWorkspaces() {
      this.loadingAll = true
      try {
        this.allWorkspaces = await apiService({
          serviceName,
          action: api.list,
          params: this.query
        })
      } catch (error) {
        return
      }

      this.loadingAll = false
    }
  }
})

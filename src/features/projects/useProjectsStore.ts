import { defineStore } from 'pinia'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'
import useSortFilterHelper from '@/core/composition/useSortFilterHelper'

const serviceName = 'project'
const api = apiStringify(serviceName)
const sortFilterHelper = useSortFilterHelper()

export const useProjectsStore = defineStore('projects', {
  state: () => {
    return {
      loading: true,
      query: {
        limit: 1000,
        offset: 0
      },
      projects: {
        count: 0,
        next: '',
        previous: '',
        results: []
      }
    }
  },
  getters: {
    getProjectsByParams: state => {
      return ({ sort = 'desc', sortby = 'created', is_member, searchtext, visibility }) => {
        sortFilterHelper.results = [...state.projects.results]

        return sortFilterHelper
          .filterByVisibility(visibility)
          .filterByMember(is_member)
          .filterBySearchtext(searchtext)
          .sorting({ sort, sortby })
      }
    }
  },
  actions: {
    async getProjects() {
      this.loading = true
      try {
        this.projects = await apiService({
          action: api.list,
          serviceName,
          params: this.query
        })
      } catch (error) {
        return
      }

      this.loading = false
    }
  }
})

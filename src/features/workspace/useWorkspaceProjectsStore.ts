import { defineStore } from 'pinia'
import useSortFilterHelper from '@/core/composition/useSortFilterHelper'

const sortFilterHelper = useSortFilterHelper()

export const useWorkspaceProjectsStore = defineStore('workspaceProjects', {
  state: () => {
    return {
      allWorkspaceProjects: {
        count: 0,
        next: '',
        previous: '',
        results: []
      }
    }
  },
  getters: {
    getProjectsByParams: state => {
      return ({ sort = 'desc', sortby = 'created', is_member, search, visibility }) => {
        sortFilterHelper.results = [...state.allWorkspaceProjects.results]

        return sortFilterHelper
          .filterByVisibility(visibility)
          .filterByMember(is_member)
          .filterBySearchtext(search)
          .sorting({ sort, sortby })
      }
    }
  },

  actions: {}
})

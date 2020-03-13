import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import { apiStringify } from '@/core/api-settings'
import * as rootTypes from '@/core/store/actionTypes'

import { projectState, PROJECT_STORE, action, mutation } from './types'

const root = true
const serviceName = PROJECT_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<projectState, RootState> = {
  async [action.getProject]({ commit, dispatch }, id) {
    let project
    try {
      project = await dispatch(
        rootTypes.apiService,
        {
          action: api.get,
          serviceName,
          uuid: id
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load project  in getProject action.\nError: ', e)
      return
    }

    commit(mutation.SET_PROJECT, project)
  },

  async [action.getProjects]({ commit, dispatch }) {
    let projects
    try {
      projects = await dispatch(
        rootTypes.apiService,
        {
          action: api.list,
          serviceName
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load projects  in getProjects action.\nError: ', e)
      return
    }

    projects = projects.map((project: any, index: number) => {
      return {
        ...project,
        id: index,
        description:
          'Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well.'
      }
    })

    commit(mutation.SET_PROJECTS, projects)
  }
}

import { map } from 'lodash'
import { ActionTree } from 'vuex'
import apiService from '@/core/services/apiService'
import * as rootTypes from '@/core/store/actionTypes'
import { apiStringify } from '@/core/services/api-settings'
import { projectState, PROJECT_STORE, action, mutation } from './types'

const serviceName = PROJECT_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<projectState, RootState> = {
  async [action.getProject]({ commit, dispatch }, uuid) {
    let project
    try {
      project = await apiService({
        action: api.get,
        serviceName,
        uuid: uuid
      })
    } catch (error) {
      dispatch(rootTypes.loggerError, {
        errorHint: 'Error on load project  in getProject action.\nError:',
        error
      })
      return
    }

    commit(mutation.SET_PROJECT, project)
  },

  async [action.getProjects]({ state, commit, dispatch }) {
    let projects
    try {
      projects = await apiService({
        action: api.list,
        serviceName,
        params: state.query
      })
    } catch (error) {
      dispatch(rootTypes.loggerError, {
        errorHint: 'Error on load projects in getProjects action.\nError:',
        error
      })
      return
    }

    commit(mutation.SET_PROJECTS, projects)
  },

  async [action.getProjectJobs]({ commit, dispatch }, uuid) {
    commit(mutation.SET_LOADING, { name: 'jobsLoading', value: true })

    let jobs
    try {
      jobs = await apiService({
        action: api.jobs,
        serviceName,
        uuid
      })
    } catch (error) {
      commit(mutation.SET_LOADING, { name: 'jobsLoading', value: false })

      dispatch(rootTypes.loggerError, {
        errorHint: 'Error on load project jobs in getProjectJobs action.\nError: ',
        error
      })
      return
    }

    await Promise.all(
      map(jobs, async (job: any) => {
        const runs = await apiService({
          action: api.getLastJobRun,
          serviceName,
          uuid: job.short_uuid,
          params: {
            limit: 1,
            offset: 0
          }
        })
        const run = runs && runs.results.length ? runs.results[0] : { status: 'NOT_RUNS', created: '' }
        job.runs = { count: runs.count, status: { status: run.status, created: run.created } }

        return job
      })
    )

    commit(mutation.SET_PROJECT_JOBS, jobs)
    commit(mutation.SET_LOADING, { name: 'jobsLoading', value: false })
  },

  async [action.resetProjectJobs]({ commit }) {
    commit(mutation.RESET_PORJECT_JOBS)
  }
}

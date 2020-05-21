import { mutations } from '@/features/project/store/mutations'
import { mutation } from '@/features/project/store/types'
import * as data from './data'

describe('project muttions', () => {
  it('SET_PROJECT should update state with data in payload', () => {
    const state = {
      project: {}
    }
    mutations[mutation.SET_PROJECT](state, data.project)
    expect(state.project).toBe(data.project)
  })

  it('SET_PROJECTS should update state with data in payload', () => {
    const state = {
      projects: {}
    }

    mutations[mutation.SET_PROJECTS](state, data.projects)
    expect(state.projects).toBe(data.projects)
  })

  it('SET_PROJECT_JOBS should update state with data in payload', () => {
    const state = {
      projectJobs: []
    }
    mutations[mutation.SET_PROJECT_JOBS](state, data.projectJobs)
    expect(state.projectJobs).toBe(data.projectJobs)
  })

  it('RESET_PORJECT_JOBS should reset state for projectJobs', () => {
    const state = {
      projectJobs: data.projectJobs
    }

    mutations[mutation.RESET_PORJECT_JOBS](state)
    expect(state.projectJobs).toStrictEqual([])
  })
})

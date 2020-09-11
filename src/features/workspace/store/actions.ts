import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'
import { workspaceState, WORKSPACE_STORE, stateType, action, mutation } from './types'

const serviceName = WORKSPACE_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<workspaceState, RootState> = {
  async [action.getWorkspace]({ commit }, uuid) {
    let workspace
    try {
      workspace = await apiService({
        action: api.get,
        serviceName,
        uuid
      })
    } catch (error) {
      logger.error(commit, 'Error on load workspaces  in getWorkspaces action.\nError: ', error)

      return
    }

    commit(mutation.SET_WORKSPACE, workspace)
  },

  async [action.getWorkspaces]({ state, commit }) {
    commit(mutation.SET_LOADING, { name: stateType.workspacesLoading, value: true })
    let workspaces
    try {
      workspaces = await apiService({
        action: api.list,
        serviceName,
        params: state.workspaceQuery
      })
    } catch (error) {
      logger.error(commit, 'Error on load workspaces in getWorkspaces action.\nError: ', error)
      commit(mutation.SET_LOADING, { name: stateType.workspacesLoading, value: false })

      return
    }

    commit(mutation.SET_WORKSPACES, workspaces)
    commit(mutation.SET_LOADING, { name: stateType.workspacesLoading, value: false })
  },

  async [action.getInitialWorkpaceProjects]({ commit, dispatch }, data) {
    commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: true })

    await dispatch(action.getWorkpaceProjects, data)

    commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: false })
  },

  async [action.getWorkpaceProjects]({ commit, dispatch, state }, { params }) {
    let projects
    try {
      projects = await apiService({
        action: api.projects,
        serviceName,
        uuid: state.workspace.short_uuid,
        params
      })
    } catch (error) {
      logger.error(commit, 'Error on load projects in getWorkpaceProjects action.\nError: ', error)

      return
    }
    commit(mutation.SET_WORKSPACE_PROJECTS, projects)
    commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: false })
  },

  async [action.changeSettings]({ commit }, data) {
    commit(mutation.UPDATE_SETTINGS, data)
  },

  async [action.setQuery]({ commit }, data) {
    commit(mutation.SET_QUERY, data)
  },

  async [action.reset]({ commit }) {
    commit(mutation.RESET)
  },

  async [action.getInitialWorkpacePeople]({ commit, dispatch }, data) {
    commit(mutation.SET_LOADING, { name: stateType.workspacePeopleLoading, value: true })

    await dispatch(action.getWorkspacePeople, data)

    commit(mutation.SET_LOADING, { name: stateType.workspacePeopleLoading, value: false })
  },
  async [action.getWorkspacePeople]({ commit, state }, { workspaceId, params }) {
    commit(mutation.SET_LOADING, { name: stateType.workspacePeopleLoading, value: true })

    let people = {
      count: 35,
      next: '/5',
      results: [
        {
          name: 'Robbert Boss',
          job_title: 'Founder at AskAnna',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBGb6lgE=--1ff48481acb71fb3ed0a69bf2150565c692cecd6/avatar-130-x3?v=1',
          uuid: '1',
          short_uuid: '1',
          role: 'admin',
          created: '1',
          modified: '1',
          last_active: '1'
        },
        {
          name: 'Anthony Leung',
          job_title: 'System architect',
          uuid: '2',
          short_uuid: '2',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBO5XmwE=--2836f5fa7f940c46cc85ccde52dbf67d8e718f41/avatar-130-x3?v=1',
          role: 'admin',
          created: '2',
          modified: '2',
          last_active: '2'
        },
        {
          name: 'Caya de Haas',
          job_title: 'Software developer at AskAnna',
          uuid: '3',
          short_uuid: '3',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBBoq2gE=--3f45e230a4f4dd86a6443ace820dd2bdb274af2e/avatar-130-x4?v=1',
          role: 'admin',
          created: '3',
          modified: '3',
          last_active: '3'
        },
        {
          name: 'Federico Jaramillo',
          job_title: 'Software Engineer at AskAnna',
          uuid: '4',
          short_uuid: '4',
          role: 'admin',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBAiz6QE=--03a1cb78bd61430f46f583986ce548521f57131f/avatar-130-x4?v=1',
          created: '4',
          modified: '4',
          last_active: '4'
        },
        {
          name: 'Andrii Shapovalov',
          job_title: 'Frontend Developer at AskAnna',
          uuid: '5',
          short_uuid: '5',
          role: 'admin',
          created: '5',
          modified: '5',
          last_active: '5'
        },
        {
          name: 'Robbert Boss',
          job_title: 'Founder at AskAnna',
          uuid: '6',
          short_uuid: '6',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBGb6lgE=--1ff48481acb71fb3ed0a69bf2150565c692cecd6/avatar-130-x3?v=1',
          role: 'admin',
          created: '12',
          modified: '12',
          last_active: '12'
        },
        {
          name: 'Anthony Leung',
          job_title: 'System architect',
          uuid: '7',
          short_uuid: '7',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBO5XmwE=--2836f5fa7f940c46cc85ccde52dbf67d8e718f41/avatar-130-x3?v=1',

          role: 'admin',
          created: '22',
          modified: '22',
          last_active: '22'
        },
        {
          name: 'Caya de Haas',
          job_title: 'Software developer at AskAnna',
          uuid: '8',
          short_uuid: '8',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBBoq2gE=--3f45e230a4f4dd86a6443ace820dd2bdb274af2e/avatar-130-x4?v=1',

          role: 'admin',
          created: '3',
          modified: '3',
          last_active: '3'
        },
        {
          name: 'Federico Jaramillo',
          job_title: 'Software Engineer at AskAnna',
          uuid: '9',
          short_uuid: '9',

          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBAiz6QE=--03a1cb78bd61430f46f583986ce548521f57131f/avatar-130-x4?v=1',
          role: 'admin',
          created: '4',
          modified: '4',
          last_active: '4'
        },
        {
          name: 'Andrii Shapovalov',
          job_title: 'Frontend Developer at AskAnna',
          uuid: '10',
          short_uuid: '10',
          role: 'admin',
          created: '5',
          modified: '5',
          last_active: '5'
        },
        {
          name: 'Robbert Boss',
          job_title: 'Founder at AskAnna',
          uuid: '11',
          short_uuid: '11',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBGb6lgE=--1ff48481acb71fb3ed0a69bf2150565c692cecd6/avatar-130-x3?v=1',
          role: 'admin',
          created: '1',
          modified: '1',
          last_active: '1'
        },
        {
          name: 'Anthony Leung',
          job_title: 'System architect',
          uuid: '12',
          short_uuid: '12',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBO5XmwE=--2836f5fa7f940c46cc85ccde52dbf67d8e718f41/avatar-130-x3?v=1',

          role: 'admin',
          created: '2',
          modified: '2',
          last_active: '2'
        },
        {
          name: 'Caya de Haas',
          job_title: 'Software developer at AskAnna',
          uuid: '13',
          short_uuid: '13',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBBoq2gE=--3f45e230a4f4dd86a6443ace820dd2bdb274af2e/avatar-130-x4?v=1',

          role: 'admin',
          created: '3',
          modified: '3',
          last_active: '3'
        },
        {
          name: 'Federico Jaramillo',
          job_title: 'Software Engineer at AskAnna',
          uuid: '14',
          short_uuid: '14',

          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBAiz6QE=--03a1cb78bd61430f46f583986ce548521f57131f/avatar-130-x4?v=1',
          role: 'admin',
          created: '4',
          modified: '4',
          last_active: '4'
        },
        {
          name: 'Andrii Shapovalov',
          job_title: 'Frontend Developer at AskAnna',
          uuid: '15',
          short_uuid: '15',
          role: 'admin',
          created: '5',
          modified: '5',
          last_active: '5'
        },
        {
          name: 'Robbert Boss',
          job_title: 'Founder at AskAnna',
          uuid: '16',
          short_uuid: '16',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBGb6lgE=--1ff48481acb71fb3ed0a69bf2150565c692cecd6/avatar-130-x3?v=1',
          role: 'admin',
          created: '1',
          modified: '1',
          last_active: '1'
        },
        {
          name: 'Anthony Leung',
          job_title: 'System architect',
          uuid: '17',
          short_uuid: '17',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBO5XmwE=--2836f5fa7f940c46cc85ccde52dbf67d8e718f41/avatar-130-x3?v=1',

          role: 'admin',
          created: '2',
          modified: '2',
          last_active: '2'
        },
        {
          name: 'Caya de Haas',
          job_title: 'Software developer at AskAnna',
          uuid: '18',
          short_uuid: '18',

          role: 'admin',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBBoq2gE=--3f45e230a4f4dd86a6443ace820dd2bdb274af2e/avatar-130-x4?v=1',

          created: '3',
          modified: '3',
          last_active: '3'
        },
        {
          name: 'Federico Jaramillo',
          job_title: 'Software Engineer at AskAnna',
          uuid: '19',
          short_uuid: '19',

          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBAiz6QE=--03a1cb78bd61430f46f583986ce548521f57131f/avatar-130-x4?v=1',
          role: 'admin',
          created: '4',
          modified: '4',
          last_active: '4'
        },
        {
          name: 'Andrii Shapovalov',
          job_title: 'Frontend Developer at AskAnna',
          uuid: '20',
          short_uuid: '20',
          role: 'admin',
          created: '5',
          modified: '5',
          last_active: '5'
        },
        {
          name: 'Robbert Boss',
          job_title: 'Founder at AskAnna',
          uuid: '21',
          short_uuid: '21',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBGb6lgE=--1ff48481acb71fb3ed0a69bf2150565c692cecd6/avatar-130-x3?v=1',
          role: 'admin',
          created: '1',
          modified: '1',
          last_active: '1'
        },
        {
          name: 'Anthony Leung',
          job_title: 'System architect',
          uuid: '22',
          short_uuid: '22',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBO5XmwE=--2836f5fa7f940c46cc85ccde52dbf67d8e718f41/avatar-130-x3?v=1',

          role: 'admin',
          created: '2',
          modified: '2',
          last_active: '2'
        },
        {
          name: 'Caya de Haas',
          job_title: 'Software developer at AskAnna',
          uuid: '23',
          short_uuid: '23',
          role: 'admin',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBBoq2gE=--3f45e230a4f4dd86a6443ace820dd2bdb274af2e/avatar-130-x4?v=1',

          created: '3',
          modified: '3',
          last_active: '3'
        },
        {
          name: 'Federico Jaramillo',
          job_title: 'Software Engineer at AskAnna',
          uuid: '24',
          short_uuid: '24',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBAiz6QE=--03a1cb78bd61430f46f583986ce548521f57131f/avatar-130-x4?v=1',

          role: 'admin',
          created: '4',
          modified: '4',
          last_active: '4'
        },
        {
          name: 'Andrii Shapovalov',
          job_title: 'Frontend Developer at AskAnna',
          uuid: '25',
          short_uuid: '25',
          role: 'admin',
          created: '5',
          modified: '5',
          last_active: '5'
        },
        {
          name: 'Robbert Boss',
          job_title: 'Founder at AskAnna',
          uuid: '26',
          short_uuid: '26',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBGb6lgE=--1ff48481acb71fb3ed0a69bf2150565c692cecd6/avatar-130-x3?v=1',
          role: 'admin',
          created: '1',
          modified: '1',
          last_active: '1'
        },
        {
          name: 'Anthony Leung',
          job_title: 'System architect',
          uuid: '27',
          short_uuid: '27',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBO5XmwE=--2836f5fa7f940c46cc85ccde52dbf67d8e718f41/avatar-130-x3?v=1',

          role: 'admin',
          created: '2',
          modified: '2',
          last_active: '2'
        },
        {
          name: 'Caya de Haas',
          job_title: 'Software developer at AskAnna',
          uuid: '28',
          short_uuid: '28',

          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBBoq2gE=--3f45e230a4f4dd86a6443ace820dd2bdb274af2e/avatar-130-x4?v=1',
          role: 'admin',
          created: '3',
          modified: '3',
          last_active: '3'
        },
        {
          name: 'Federico Jaramillo',
          job_title: 'Software Engineer at AskAnna',
          uuid: '29',
          short_uuid: '29',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBAiz6QE=--03a1cb78bd61430f46f583986ce548521f57131f/avatar-130-x4?v=1',

          role: 'admin',
          created: '4',
          modified: '4',
          last_active: '4'
        },
        {
          name: 'Andrii Shapovalov',
          job_title: 'Frontend Developer at AskAnna',
          uuid: '30',
          short_uuid: '30',
          role: 'admin',
          created: '5',
          modified: '5',
          last_active: '5'
        },
        {
          name: 'Robbert Boss',
          job_title: 'Founder at AskAnna',
          uuid: '31',
          short_uuid: '31',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBGb6lgE=--1ff48481acb71fb3ed0a69bf2150565c692cecd6/avatar-130-x3?v=1',
          role: 'admin',
          created: '1',
          modified: '1',
          last_active: '1'
        },
        {
          name: 'Anthony Leung',
          job_title: 'System architect',
          uuid: '32',
          short_uuid: '32',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBO5XmwE=--2836f5fa7f940c46cc85ccde52dbf67d8e718f41/avatar-130-x3?v=1',

          role: 'admin',
          created: '2',
          modified: '2',
          last_active: '2'
        },
        {
          name: 'Caya de Haas',
          job_title: 'Software developer at AskAnna',
          uuid: '33',
          short_uuid: '33',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBBoq2gE=--3f45e230a4f4dd86a6443ace820dd2bdb274af2e/avatar-130-x4?v=1',

          role: 'admin',
          created: '3',
          modified: '3',
          last_active: '3'
        },
        {
          name: 'Federico Jaramillo',
          job_title: 'Software Engineer at AskAnna',
          uuid: '34',
          short_uuid: '34',
          avatar:
            'https://bc3-production-assets-cdn.basecamp-static.com/4281589/people/BAhpBAiz6QE=--03a1cb78bd61430f46f583986ce548521f57131f/avatar-130-x4?v=1',

          role: 'admin',
          created: '4',
          modified: '4',
          last_active: '4'
        },
        {
          name: 'Andrii Shapovalov',
          job_title: 'Frontend Developer at AskAnna',
          uuid: '35',
          short_uuid: '35',
          role: 'admin',
          created: '5',
          modified: '5',
          last_active: '5'
        }
      ]
    }
    params = { ...params, ...state.workspacePeopleParams }
    /* try {
      people = await apiService({
        action: api.getWorkspacePeople,
        serviceName,
        uuid: workspaceId,
        params
      })
    } catch (error) {
      logger.error(commit, 'Error on load people in getWorkspacePeople action.\nError: ', error)

      return
    } */
    const peopleMutation = params.offset === 0 ? mutation.SET_WORKSPACE_PEOPLE_INITIAL : mutation.SET_WORKSPACE_PEOPLE

    commit(peopleMutation, people)
    commit(mutation.SET_LOADING, { name: stateType.workspacePeopleLoading, value: false })
  },

  async [action.setWorkspaceParams]({ commit }, data) {
    commit(mutation.SET_WORKSPACE_PARAMS, data)
  }
}

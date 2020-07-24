import { useState, useActions } from '@u3u/vue-hooks'
import { PROJECT_STORE, action } from '../store/types'
import { computed } from '@vue/composition-api'

export default function () {
  const state = {
    ...useState(PROJECT_STORE, {
      project: 'project',
      projects: 'projects',
      projectJobs: 'projectJobs',
      createProject: 'createProject'
    })
  }

  const projectName = computed({
    get: () => {
      return state.createProject.value.name
    },
    set: value => {
      actions.setProject({ name: 'name', value })
    }
  })

  const actions = {
    ...useActions(PROJECT_STORE, { ...action })
  }

  return {
    ...state,
    ...actions,
    projectName
  }
}

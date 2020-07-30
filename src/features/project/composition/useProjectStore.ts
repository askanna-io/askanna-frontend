import { computed } from '@vue/composition-api'
import { useState, useActions } from '@u3u/vue-hooks'
import { PROJECT_STORE, action } from '../store/types'

export default function () {
  const state = {
    ...useState(PROJECT_STORE, {
      menu: 'menu',
      project: 'project',
      projects: 'projects',
      projectJobs: 'projectJobs',
      jobsLoading: 'jobsLoading',
      lastPackage: 'lastPackage',
      createProject: 'createProject'
    })
  }

  const stickedVM = computed({
    get: () => state.menu.value.sticked,
    set: value => actions.setMenu({ name: 'menu.sticked', value })
  })

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
    stickedVM,
    ...state,
    ...actions,
    projectName
  }
}

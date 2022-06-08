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
      projectLoading: 'projectLoading',
      projectTemplates: 'projectTemplates'
    })
  }

  const stickedVM = computed({
    get: () => state.menu.value.sticked,
    set: value => actions.setMenu({ name: 'menu.sticked', value })
  })

  const projectName = computed({
    get: () => {
      return state.project.value.name
    },
    set: value => {
      actions.setProject({ path: 'name', value })
    }
  })

  const actions = {
    ...useActions(PROJECT_STORE, { ...action })
  }

  return {
    stickedVM,
    state,
    ...state,
    ...actions,
    actions,
    projectName
  }
}

import { computed } from '@vue/composition-api'
import { useState, useActions } from '@u3u/vue-hooks'
import { PROJECT_STORE, action } from '../store/types'

export default function () {
  const state = {
    ...useState(PROJECT_STORE, { menu: 'menu', project: 'project', projects: 'projects', projectJobs: 'projectJobs' })
  }

  const stickedVM = computed({
    get: () => state.menu.value.sticked,
    set: value => actions.setMenu({ name: 'menu.sticked', value })
  })

  const actions = {
    ...useActions(PROJECT_STORE, { ...action })
  }

  return {
    stickedVM,
    ...state,
    ...actions
  }
}

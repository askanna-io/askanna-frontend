import { computed } from '@vue/composition-api'
import { useState, useActions } from '@u3u/vue-hooks'
import { VARIABLES_STORE, action } from '../store/types'

export default function () {
  const state = {
    ...useState(VARIABLES_STORE, {
      variable: 'variable',
      variables: 'variables',
      variablePopup: 'variablePopup'
    })
  }

  const actions = {
    ...useActions(VARIABLES_STORE, { ...action })
  }

  const variablePopupVmodel = computed({
    get: () => state.variablePopup.value,
    set: value => actions.setVariablePopUp(value)
  })

  return {
    variablePopupVmodel,
    ...state,
    ...actions
  }
}

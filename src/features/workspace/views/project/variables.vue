<template>
  <div>
    <variable-list :items="variables" @onEditItem="handleEditItem">
      <template slot="header">
        <variable-list-header @openVariablePopup="handleOpenVariablePopup" />
      </template>
    </variable-list>
    <variable-popup :projectId="projectId" />
  </div>
</template>

<script>
import useCopy from '@/core/composition/useCopy'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import VariableList from '@/features/variables/components/VariableList'
import VariablePopup from '@/features/variables/components/VariablePopup'
import { computed, onBeforeMount, defineComponent } from '@vue/composition-api'
import useVariablesStore from '@/features/variables/composition/useVariablesStore'
import VariableListHeader from '@/features/variables/components/VariableListHeader'

export default defineComponent({
  name: 'Variables',

  components: { VariableList, VariablePopup, VariableListHeader },

  setup(props, context) {
    const variablesStore = useVariablesStore()
    const { projectId } = context.root.$route.params

    onBeforeMount(async () => await variablesStore.getVariables(projectId))

    const variables = computed(() => variablesStore.variables.value)

    const handleOpenVariablePopup = () => variablesStore.setVariablePopUp(true)

    const handleEditItem = variableId => {
      variablesStore.getVariable({ projectId, variableId })
      variablesStore.setVariablePopUp(true)
    }

    return {
      projectId,
      variables,
      handleEditItem,
      handleOpenVariablePopup
    }
  }
})
</script>

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

<script setup lang="ts">
import { useRouter } from '@u3u/vue-hooks'
import { computed, onBeforeMount } from '@vue/composition-api'
import VariableList from '@/features/variables/components/VariableList.vue'
import VariablePopup from '@/features/variables/components/VariablePopup.vue'
import useVariablesStore from '@/features/variables/composition/useVariablesStore'
import VariableListHeader from '@/features/variables/components/VariableListHeader.vue'

const { route } = useRouter()

const variablesStore = useVariablesStore()
const { projectId } = route.value.params

const fetchData = async () => await variablesStore.getVariables(projectId)

onBeforeMount(() => fetchData())

const variables = computed(() => variablesStore.variables.value)

const handleOpenVariablePopup = () => variablesStore.setVariablePopUp(true)

const handleEditItem = variableId => {
  variablesStore.getVariable({ projectId, variableId })
  variablesStore.setVariablePopUp(true)
}
</script>

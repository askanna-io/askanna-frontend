<template>
  <div>
    <VariableList :items="variables" @onEditItem="handleEditItem">
      <template slot="header">
        <VariableListHeader @openVariablePopup="handleOpenVariablePopup" />
      </template>
    </VariableList>
    <VariablePopup :projectId="projectId" />
  </div>
</template>

<script setup lang="ts">
const { route } = useRouterAskAnna()
const variablesStore = useVariablesStore()

const { projectId } = route.params

const variables = computed(() => variablesStore.variables)

const handleOpenVariablePopup = () => (variablesStore.variablePopup = true)

const handleEditItem = variableId => {
  variablesStore.getVariable({ projectId, variableId })
  variablesStore.variablePopup = true
}
</script>

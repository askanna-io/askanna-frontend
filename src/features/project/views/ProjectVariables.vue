<template>
  <VariableList @onEditItem="handleEditItem">
    <template v-slot:header>
      <VariableListHeader @openVariablePopup="handleOpenVariablePopup" />
    </template>
  </VariableList>
  <VariablePopup :projectId="projectId" />
</template>

<script setup lang="ts">
const { route } = useRouterAskAnna()
const variablesStore = useVariablesStore()

const { projectId } = route.params

const handleOpenVariablePopup = () => (variablesStore.variablePopup = true)

const handleEditItem = async variableId => {
  await variablesStore.getVariable({ projectId, variableId })
  variablesStore.variablePopup = true
}
</script>

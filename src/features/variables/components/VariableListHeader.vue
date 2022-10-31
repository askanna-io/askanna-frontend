<template>
  <div :class="{ 'pt-2': $vuetify.breakpoint.xsOnly }">
    <AskAnnaCard flat v-if="!$vuetify.breakpoint.xsOnly">
      <AskAnnaCardText>
        <p>
          Project variables are applied to every run environment within this project. You can use variables for
          settings, passwords, tokens, etcetera. Masked variables can be used for sensitive information.
          <a
            class="app-link text-decoration-none primary--text font-weight-medium d-inline-block"
            href="https://docs.askanna.io/variables/"
            target="_blank"
          >
            Read the documentation</a
          >
          for more information about how you can use variables in the job definition and project code.
        </p>
      </AskAnnaCardText>
    </AskAnnaCard>
    <AskAnnaToolbar v-if="projectVariableCreate" color="grey lighten-4" flat dense>
      <AskAnnaSpacer />
      <AskAnnaButton @click="handleOpenVariablePopup()" small rounded class="mr-3">
        <AskAnnaIcon color="primary" left>mdi-plus</AskAnnaIcon>
        New variable
      </AskAnnaButton>
    </AskAnnaToolbar>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits('openVariablePopup')

const permission = usePermission()
const projectVariableCreate = computed(() => permission.getFor(permission.labels.projectVariableCreate))

const handleOpenVariablePopup = () => emits('openVariablePopup')
</script>

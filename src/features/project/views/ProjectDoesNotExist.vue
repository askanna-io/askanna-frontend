<template>
  <AskAnnaPageDoesNotExist
    variant="outlined"
    pageTitle="project"
  >
    <template
      v-slot:header
      v-if="isUserLoggedIn"
    >
      <AskAnnaBreadcrumbs :items="breadcrumbs" />
    </template>
  </AskAnnaPageDoesNotExist>
</template>

<script setup lang="ts">
const permission = useAskAnnaPermission()
const workSpaceStore = useWorkspaceStore()

const breadcrumbs = computed(() => [
  {
    title: workSpaceStore.workspace.name,
    to: `/${workSpaceStore.workspace.suuid}`,
    disabled: false
  },
  {
    title: 'Project does not exist',
    to: '',
    disabled: true
  }
])

const isUserLoggedIn = computed(() => permission.isUserLoggedIn)
</script>
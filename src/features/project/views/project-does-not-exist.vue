<template>
  <AskAnnaPageDoesNotExist pageTitle="project" outlined>
    <template v-slot:header v-if="isUserLoggedIn">
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </template>
  </AskAnnaPageDoesNotExist>
</template>

<script setup lang="ts">
const permission = usePermission()
const workSpaceStore = useWorkspaceStore()

const breadcrumbs = computed(() => [
  {
    title: workSpaceStore.workspace.name,
    to: `/${workSpaceStore.workspace.short_uuid}`,
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

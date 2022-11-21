<template>
  <AskAnnaPageDoesNotExist pageTitle="project" outlined>
    <template v-slot:header v-if="isUserLoggedIn">
      <VBreadcrumbs :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <VBreadcrumbsItem :to="item.to" exact>
            {{ item.title }}
          </VBreadcrumbsItem>
        </template>
      </VBreadcrumbs>
    </template>
  </AskAnnaPageDoesNotExist>
</template>

<script>
const { isUserLoggedIn } = usePermission()
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
</script>

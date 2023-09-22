<template>
  <ul
    role="list"
    :class="{ 'px-2': $vuetify.display.xs }"
    class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 list list-none px-3"
  >
    <li
      v-for="item in items"
      :key="item.suuid"
    >
      <VHover
        v-slot:default="{ props, isHovering }"
        open-delay="150"
        close-delay="150"
      >
        <AskAnnaListCardItem
          v-bind="props"
          :project="item"
          :name="item.name"
          :hover="isHovering"
          :visibility="item.visibility"
          :description="sanitizeHTML(item.description)"
          :to="{
            name: 'workspace-project-code',
            params: {
              projectId: item.suuid,
              workspaceId: item.workspace.suuid
            },
            meta: { title: `${item.name}}` }
          }"
        />
      </VHover>
    </li>
  </ul>
  <AskAnnaAlert
    v-if="!loading && !items.length"
    class=" mx-3"
  >
    <template v-if="!isProjectCreatePermission || !isSignIn">
      There are no projects in this workspace that you have access to.
    </template>
    <template v-else-if="queryParams.search">There are no projects for this search request in this
      workspace.</template>
    <template v-else-if="queryParams.visibility || queryParams.is_member">There are no projects for this filter
      request in this workspace.</template>
    <template v-else>
      There are no projects in this workspace. So, let's create one. You can easily do this with the option "+
      CREATE PROJECT" in the grey bar.<br />
      <RouterLink :to="{
        name: 'workspace-new-project',
        params: { workspaceId: $route.params.workspaceId }
      }">
        Or click here to create a new project.</RouterLink>
    </template>
  </AskAnnaAlert>
  <slot name="footer"></slot>
</template>

<script setup lang="ts">
defineProps({
  workspaceName: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  queryParams: {
    type: Object,
    default: () => ({
      search: '',
      sort: '',
      order_by: '',
      visibility: '',
      is_member: ''
    })
  },
  settings: {
    type: Object,
    default: function () {
      return {
        projectView: 1
      }
    }
  }
})

const sanitizeHTML = useSanitizeHTML()
const permission = useAskAnnaPermission()
const workspaceProjectsStore = useWorkspaceProjectsStore()

const isSignIn = computed(() => permission.token)
const loading = computed(() => workspaceProjectsStore.loading)
const isProjectCreatePermission = computed(() => permission.getFor(permission.labels.projectCreate))
</script>
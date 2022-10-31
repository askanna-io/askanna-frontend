<template>
  <v-data-iterator :items="items" hide-default-footer :no-data-text="''" disable-pagination>
    <template v-slot:default="props">
      <AskAnnaRow v-if="!settings.projectView" :class="{ 'px-2': $vuetify.breakpoint.xsOnly }">
        <AskAnnaCol
          v-for="item in props.items"
          :key="item.name + item.short_uuid"
          cols="12"
          sm="6"
          md="4"
          lg="4"
          :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }"
        >
          <v-hover v-slot:default="{ hover }" open-delay="200">
            <workspace-project-card-item
              :project="item"
              :workspaceName="workspaceName"
              :hover="hover"
              :description="sanitizeHTML(item.description)"
            />
          </v-hover>
        </AskAnnaCol>
      </AskAnnaRow>
      <div v-if="settings.projectView">
        <div v-for="item in props.items" :key="item.name + item.short_uuid">
          <workspace-project-list-item :project="item" :workspaceName="workspaceName" cols="12" />
          <AskAnnaDivider />
        </div>
      </div>
    </template>
    <template v-slot:no-data
      ><AskAnnaAlert
        v-if="!loading"
        class="mt-2 text-center"
        dense
        outlined
        :class="{ 'ma-2': $vuetify.breakpoint.xsOnly }"
      >
        <template v-if="isWorkspaceViewer || !isSignIn">
          There are no projects in this workspace that you have access to.
        </template>
        <template v-else-if="queryParams.search"
          >There are no projects for this search request in this workspace.</template
        >
        <template v-else-if="queryParams.visibility || queryParams.is_member"
          >There are no projects for this filter request in this workspace.</template
        >
        <template v-else>
          There are no projects in this workspace. So, let's create one. You can easily do this with the option "+
          CREATE PROJECT" in the grey bar.<br />
          <router-link
            :to="{
              name: 'workspace-new-project',
              params: { workspaceId: $route.params.workspaceId }
            }"
          >
            Or click here to create a new project.</router-link
          >
        </template>
      </AskAnnaAlert></template
    >
  </v-data-iterator>
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
      sortby: '',
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

const permission = usePermission()
const peopleStore = usePeopleStore()
const sanitizeHTML = useSanitizeHTML()
const workspaceProjectsStore = useWorkspaceProjectsStore()

const isSignIn = computed(() => permission.token)
const loading = computed(() => workspaceProjectsStore.loading)
const isWorkspaceViewer = computed(() => peopleStore.currentPeople.role.code === 'WV')
</script>

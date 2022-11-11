<template>
  <AskAnnaLoadingProgress :type="'table-row'" :loading="loading">
    <v-data-iterator :items="projects" hide-default-footer :no-data-text="''" disable-pagination>
      <template v-slot:header>
        <PublicProjectsToolbar />
      </template>
      <template v-slot:default="props">
        <AskAnnaRow :class="{ 'px-2': $vuetify.breakpoint.xsOnly }">
          <AskAnnaCol
            v-for="item in props.items"
            @click="handleOpenProject(item)"
            :key="item.name + item.suuid + item.role"
            cols="12"
            sm="6"
            md="4"
            lg="4"
            :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }"
          >
            <v-hover v-slot:default="{ hover }" open-delay="200">
              <WorkspaceProjectCardItem
                :project="item"
                :hover="hover"
                :routeBackTo="'projects'"
                :workspaceName="item.workspace.name"
                :description="sanitizeHTML(item.description)"
              />
            </v-hover>
          </AskAnnaCol>
        </AskAnnaRow>
      </template>
      <template v-slot:no-data
        ><AskAnnaAlert
          v-if="!loading"
          dense
          outlined
          class="mt-2 text-center"
          :class="{ 'ma-2': $vuetify.breakpoint.xsOnly }"
        >
          <template v-if="query.search">There are no projects for this search request.</template>
          <template v-else-if="query.visibility || query.is_member"
            >There are no projects for this filter request.</template
          >
          <template v-else>There are no projects that you have access to.</template>
        </AskAnnaAlert></template
      >
    </v-data-iterator>
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
const sanitizeHTML = useSanitizeHTML()
const projectsStore = useProjectsStore()
const { route, router } = useRouterAskAnna()

const query = computed(() => route.query)
const loading = computed(() => projectsStore.loading)
const projects = computed(() => projectsStore.getProjectsByParams(query.value))

const handleOpenProject = project => {
  router.push({
    name: 'workspace-project-code',
    params: {
      projectId: project.suuid,
      workspaceId: project.workspace.suuid,
      title: `${project.name} - ${project.workspace.name}`,
      packageId: (project.package && project.package.suuid) || ''
    }
  })
}
</script>

<style scoped>
iframe {
  border: none;
}
.is-current-user {
  border: 1px solid var(--v-primary-base);
}
</style>

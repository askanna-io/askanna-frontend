<template>
  <AskAnnaLoadingProgress :type="'table-row'" :loading="loading">
    <v-data-iterator :items="projects" hide-default-footer :no-data-text="''" disable-pagination>
      <template v-slot:header>
        <PublicProjectsToolbar />
      </template>
      <template v-slot:default="props">
        <v-row :class="{ 'px-2': $vuetify.breakpoint.xsOnly }">
          <v-col
            v-for="item in props.items"
            @click="handleOpenProject(item)"
            :key="item.name + item.short_uuid + item.role"
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
          </v-col>
        </v-row>
      </template>
      <template v-slot:no-data
        ><v-alert
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
        </v-alert></template
      >
    </v-data-iterator>
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
import { ref, computed } from '@vue/composition-api'
import usePermission from '@/core/composition/usePermission'
import useSanitizeHTML from '@/core/composition/useSanitizeHTML'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { useProjectsStore } from '@/features/projects/useProjectsStore'

import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'
import PublicProjectsToolbar from '../components/public-projects/PublicProjectsToolbar.vue'
import WorkspaceProjectCardItem from '@/features/workspace/components/WorkspaceProjectCardItem.vue'

const permission = usePermission()
const routerAA = useRouterAskAnna()
const sanitizeHTML = useSanitizeHTML()
const projectsStore = useProjectsStore()

const loading = computed(() => projectsStore.loading)
const query = computed(() => routerAA.route.value.query)
const projects = computed(() => projectsStore.getProjectsByParams(query.value))

const handleOpenProject = project => {
  routerAA.push({
    name: 'workspace-project-code',
    params: {
      projectId: project.short_uuid,
      workspaceId: project.workspace.short_uuid,
      title: `${project.name} - ${project.workspace.name}`,
      packageId: (project.package && project.package.short_uuid) || ''
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
